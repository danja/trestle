// src/js/model/TrestleModel.js
import { Config } from '../config.js'
import { generateID, generateDate } from '../utils/utils.js'

export class TrestleModel {
    /**
     * Creates a new TrestleModel instance
     * @param {string|Object} endpoints - The SPARQL endpoint definitions
     * @param {string} baseUri - The base URI for the model
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(endpoints, baseUri, eventBus) {
        const normalizedEndpoints = typeof endpoints === 'string'
            ? { query: endpoints, update: endpoints }
            : (endpoints || {})

        this.queryEndpoint = normalizedEndpoints.query || null
        this.updateEndpoint = normalizedEndpoints.update || normalizedEndpoints.query || null
        this.baseUri = baseUri.endsWith('/') ? baseUri : `${baseUri}/`
        this.baseUriFilter = this.baseUri.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
        this.eventBus = eventBus
        this.rootId = null
        this.nodes = new Map()
        this.localStorageKey = 'trestle-outline'
        this.persistence = {
            useLocalStorage: Config.PERSISTENCE?.useLocalStorage !== false,
            useSparql: Config.PERSISTENCE?.useSparql !== false
        }
        this.sparqlCredentials = Config.SPARQL_CREDENTIALS

        // Set up event handlers
        this.eventBus.on('node:updated', this.handleNodeUpdate.bind(this))
        this.eventBus.on('node:moved', this.handleNodeMove.bind(this))
        this.eventBus.on('node:deleted', this.handleNodeDelete.bind(this))
    }

    /**
     * Initialize the model
     */
    async initialize() {
        try {
            await this.loadData()
            this.eventBus.emit('model:loaded', { nodes: Array.from(this.nodes.values()) })
        } catch (error) {
            console.error('Failed to initialize model:', error)
            this.createEmptyModel()
        }
    }

    /**
     * Create an empty model structure
     */
    createEmptyModel() {
        const rootId = this.generateNodeId('root')
        this.rootId = rootId

        console.log('Creating empty model with rootId:', rootId)

        // Create root node
        this.nodes.set(rootId, {
            id: rootId,
            type: 'RootNode', // Ensure the root node has the correct type
            title: 'Root Node',
            created: generateDate(),
            children: []
        })

        console.log('Emitting model:created with root node type:', this.nodes.get(this.rootId).type)

        console.log('Emitting model:created with data:', {
            rootId: this.rootId,
            nodes: Array.from(this.nodes.values())
        })

        this.eventBus.emit('model:created', {
            rootId: this.rootId,
            nodes: Array.from(this.nodes.values())
        }) // Emit the correct root node and nodes
    }

    /**
     * Generate a unique node ID
     * @param {string} prefix - The ID prefix
     * @returns {string} The generated ID
     */
    generateNodeId(prefix = 'nid') {
        return `${prefix}-${generateID()}`
    }

    /**
     * Load data from the SPARQL endpoint
     * @returns {Promise<boolean>} Success indicator
     */
    async loadData() {
        if (!this.persistence.useSparql || !this.queryEndpoint) {
            throw new Error('SPARQL query endpoint is not configured or disabled')
        }

        try {
            const fURL = `${this.queryEndpoint}?query=${encodeURIComponent(this.buildLoadQuery())}`

            const response = await fetch(fURL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    ...this.buildAuthHeaders()
                }
            })

            if (!response.ok) {
                throw new Error(`SPARQL query failed: ${response.statusText}`)
            }

            const data = await response.json()

            this.processLoadedData(data)

            return true
        } catch (error) {
            console.error('Error loading data:', error)
            throw error
        }
    }

    /**
     * Build the SPARQL query for loading data
     * @returns {string} The SPARQL query
     */
    buildLoadQuery() {
        return `
            PREFIX dc: <${Config.PREFIXES.dc}>
            PREFIX ts: <${Config.PREFIXES.ts}>

            SELECT ?node ?type ?title ?created ?index ?parent WHERE {
                ?node a ?type .
                OPTIONAL { ?node dc:title ?title } .
                OPTIONAL { ?node dc:created ?created } .
                OPTIONAL { ?node ts:index ?index } .
                OPTIONAL { ?node ts:parent ?parent } .
             #   FILTER(STRSTARTS(STR(?type), "${Config.PREFIXES.ts}"))
            }
        `
    }

    /**
     * Process the loaded data from SPARQL
     * @param {Object} data - The loaded data
     */
    processLoadedData(data) {
        // Clear existing data
        this.nodes.clear()
        this.rootId = null

        // Create a map of nodes
        const nodesMap = new Map()

        // Process all nodes
        for (const binding of data.results.bindings) {
            const nodeUri = binding.node.value
            const nodeId = this.extractLocalId(nodeUri)
            const type = this.extractLocalType(binding.type.value)

            // Create or update node
            let node = nodesMap.get(nodeId) || { id: nodeId, children: [] }
            node.type = type

            if (binding.title) {
                node.title = binding.title.value
            }

            if (binding.created) {
                node.created = binding.created.value
            }

            if (binding.index) {
                node.index = parseInt(binding.index.value, 10)
            }

            if (binding.parent) {
                node.parent = this.extractLocalId(binding.parent.value)
            }

            // Mark root node
            if (type === 'RootNode') {
                this.rootId = nodeId
            }

            nodesMap.set(nodeId, node)
        }

        // Build parent-child relationships
        for (const [id, node] of nodesMap.entries()) {
            if (node.parent) {
                const parentNode = nodesMap.get(node.parent)
                if (parentNode) {
                    if (!parentNode.children) {
                        parentNode.children = []
                    }
                    parentNode.children.push(id)
                }
            }
        }

        // Sort children by index
        for (const node of nodesMap.values()) {
            if (node.children && node.children.length > 0) {
                node.children.sort((a, b) => {
                    const nodeA = nodesMap.get(a)
                    const nodeB = nodesMap.get(b)
                    return (nodeA.index || 0) - (nodeB.index || 0)
                })
            }
        }

        // Store nodes
        this.nodes = nodesMap
    }

    /**
     * Extract the local ID from a URI
     * @param {string} uri - The URI
     * @returns {string} The local ID
     */
    extractLocalId(uri) {
        const parts = uri.split('/')
        return parts[parts.length - 1]
    }

    /**
     * Extract the local type from a URI
     * @param {string} uri - The URI
     * @returns {string} The local type
     */
    extractLocalType(uri) {
        const parts = uri.split('/')
        return parts[parts.length - 1]
    }

    /**
     * Add a new node
     * @param {string} parentId - The parent node ID
     * @param {string} title - The node title
     * @param {number} index - The index in parent's children
     * @returns {Object} The new node
     */
    addNode(parentId, title, index) {
        const nodeId = this.generateNodeId()
        const now = generateDate()

        const newNode = {
            id: nodeId,
            type: 'Node',
            title: title || '',
            created: now,
            parent: parentId,
            index: index,
            children: []
        }

        // Add to model
        this.nodes.set(nodeId, newNode)

        // Update parent's children
        const parentNode = this.nodes.get(parentId)
        if (parentNode) {
            if (!parentNode.children) {
                parentNode.children = []
            }

            if (typeof index === 'number') {
                parentNode.children.splice(index, 0, nodeId)
                this.updateChildIndices(parentNode)
            } else {
                newNode.index = parentNode.children.length
                parentNode.children.push(nodeId)
            }
        }

        return newNode
    }

    /**
     * Update child indices after changes
     * @param {Object} parentNode - The parent node
     */
    updateChildIndices(parentNode) {
        if (parentNode.children) {
            parentNode.children.forEach((childId, index) => {
                const child = this.nodes.get(childId)
                if (child) {
                    child.index = index
                }
            })
        }
    }

    /**
     * Move a node to a new parent
     * @param {string} nodeId - The node ID to move
     * @param {string} newParentId - The new parent ID
     * @param {number} newIndex - The new index in parent's children
     */
    moveNode(nodeId, newParentId, newIndex) {
        const node = this.nodes.get(nodeId)
        if (!node) return

        const oldParentId = node.parent
        const oldParent = this.nodes.get(oldParentId)

        // Remove from old parent
        if (oldParent && oldParent.children) {
            const oldIndex = oldParent.children.indexOf(nodeId)
            if (oldIndex !== -1) {
                oldParent.children.splice(oldIndex, 1)
                this.updateChildIndices(oldParent)
            }
        }

        // Add to new parent
        const newParent = this.nodes.get(newParentId)
        if (newParent) {
            if (!newParent.children) {
                newParent.children = []
            }

            if (typeof newIndex === 'number') {
                newParent.children.splice(newIndex, 0, nodeId)
            } else {
                newParent.children.push(nodeId)
                newIndex = newParent.children.length - 1
            }

            // Update node
            node.parent = newParentId
            node.index = newIndex

            // Update all indices
            this.updateChildIndices(newParent)
        }

        // Emit event for node move
        this.eventBus.emit('node:moved', { nodeId, newParentId, newIndex })
    }

    /**
     * Delete a node and its children
     * @param {string} nodeId - The node ID to delete
     */
    deleteNode(nodeId) {
        const node = this.nodes.get(nodeId)
        if (!node) return

        // Delete children recursively
        if (node.children && node.children.length > 0) {
            const childrenToDelete = [...node.children]
            for (const childId of childrenToDelete) {
                this.deleteNode(childId)
            }
        }

        // Remove from parent
        const parentId = node.parent
        if (parentId) {
            const parent = this.nodes.get(parentId)
            if (parent && parent.children) {
                const index = parent.children.indexOf(nodeId)
                if (index !== -1) {
                    parent.children.splice(index, 1)
                    this.updateChildIndices(parent)
                }
            }
        }

        // Delete node
        this.nodes.delete(nodeId)
    }

    /**
     * Update a node's properties
     * @param {string} nodeId - The node ID to update
     * @param {Object} properties - The properties to update
     */
    updateNode(nodeId, properties) {
        const node = this.nodes.get(nodeId)
        if (!node) return

        // Update properties
        Object.assign(node, properties)
    }

    /**
     * Update a node's description
     * @param {string} nodeId - The node ID to update
     * @param {string} description - The new description
     */
    updateNodeDescription(nodeId, description) {
        const node = this.nodes.get(nodeId)
        if (!node) return

        node.description = description
    }

    /**
     * Get a node by ID
     * @param {string} nodeId - The node ID
     * @returns {Object} The node
     */
    getNode(nodeId) {
        return this.nodes.get(nodeId)
    }

    /**
     * Get all nodes
     * @returns {Array} The nodes
     */
    getAllNodes() {
        return Array.from(this.nodes.values())
    }

    /**
     * Get the root node
     * @returns {Object} The root node
     */
    getRootNode() {
        return this.nodes.get(this.rootId)
    }

    /**
     * Convert the model to Turtle format
     * @returns {string} The Turtle representation
     */
    toTurtle() {
        let turtle = `@prefix dc: <${Config.PREFIXES.dc}> .\n`
        turtle += `@prefix ts: <${Config.PREFIXES.ts}> .\n`
        turtle += `@prefix prj: <${Config.PREFIXES.prj}> .\n\n`

        // Add root node
        const rootNode = this.nodes.get(this.rootId)
        if (rootNode) {
            turtle += `<${this.baseUri}${rootNode.id}> a ts:RootNode .\n`
        }

        // Add all other nodes
        for (const [id, node] of this.nodes.entries()) {
            // Skip root
            if (id === this.rootId) continue

            if (node.type === 'Node' || node.type) {
                // Use the node's RDF type or default to ts:Node
                const rdfType = this.getRdfTypeForNode(node);
                turtle += `<${this.baseUri}${node.id}> a ${rdfType};\n`

                // Add title
                if (node.title) {
                    turtle += `   dc:title "${this.escapeTurtle(node.title)}" ;\n`
                }

                // Add created date
                if (node.created) {
                    turtle += `   dc:created "${node.created}" ;\n`
                }

                // Add index
                turtle += `   ts:index "${node.index}" ;\n`

                // Add parent
                if (node.parent) {
                    turtle += `   ts:parent <${this.baseUri}${node.parent}> .\n`
                } else {
                    // Default to root
                    turtle += `   ts:parent <${this.baseUri}${this.rootId}> .\n`
                }

                // Add description as separate triple
                if (node.description) {
                    turtle += `<${this.baseUri}${node.id}> dc:description """${this.escapeTurtle(node.description)}""" .\n`
                }

                // Add tags as separate triples
                if (node.tags && Array.isArray(node.tags)) {
                    node.tags.forEach(tag => {
                        if (tag && typeof tag === 'string' && tag.trim().length > 0) {
                            turtle += `<${this.baseUri}${node.id}> ts:tag "${this.escapeTurtle(tag.trim())}" .\n`
                        }
                    })
                }
            }
        }

        return turtle
    }

    /**
     * Escape special characters for Turtle format
     * @param {string} text - The text to escape
     * @returns {string} The escaped text
     */
    escapeTurtle(text) {
        if (!text) return ''
        return text
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
    }

    /**
     * Save the model to the SPARQL endpoint
     * @returns {Promise<boolean>} Success indicator
     */
    async saveData() {
        const result = {
            local: null,
            sparql: null
        }

        const turtle = this.toTurtle()

        const localStatus = this.saveOutlineToLocalStorage(turtle)
        if (localStatus !== null) {
            result.local = localStatus
        }

        const shouldSaveToSparql = this.persistence.useSparql && !!this.updateEndpoint

        if (!shouldSaveToSparql) {
            return result
        }

        try {
            const updateQuery = this.buildSparqlUpdate(turtle)

            const response = await fetch(this.updateEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/sparql-update',
                    ...this.buildAuthHeaders()
                },
                body: updateQuery
            })

            if (!response.ok) {
                throw new Error(`Failed to save data: ${response.status} ${response.statusText}`)
            }

            result.sparql = true
        } catch (error) {
            console.error('Error saving data:', error)
            this.eventBus.emit('model:error', {
                message: 'Failed to persist data to SPARQL endpoint',
                error
            })
            result.sparql = false
        }

        return result
    }

    /**
     * Build a SPARQL update query that replaces the graph for the current base URI
     * @param {string} turtle - The Turtle serialization of the graph
     * @returns {string} The SPARQL UPDATE command
     */
    buildSparqlUpdate(turtle) {
        const prefixLines = Object.entries(Config.PREFIXES)
            .map(([prefix, uri]) => `PREFIX ${prefix}: <${uri}>`)
            .join('\n')

        const tripleLines = turtle
            .split('\n')
            .filter(line => {
                const trimmed = line.trim()
                return trimmed.length > 0 && !trimmed.toLowerCase().startsWith('@prefix')
            })

        const indentedTriples = tripleLines
            .map(line => `  ${line}`)
            .join('\n')

        return `${prefixLines}

DELETE WHERE {
  ?s ?p ?o .
  FILTER(
    STRSTARTS(STR(?s), "${this.baseUriFilter}") ||
    STRSTARTS(STR(?o), "${this.baseUriFilter}")
  )
};

INSERT DATA {
${indentedTriples}
};
`
    }

    buildAuthHeaders() {
        const username = this.sparqlCredentials?.username
        const password = this.sparqlCredentials?.password

        if (!username || password === undefined || password === null) {
            return {}
        }

        let encoded

        if (typeof btoa === 'function') {
            encoded = btoa(`${username}:${password}`)
        } else if (typeof Buffer !== 'undefined') {
            encoded = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')
        } else {
            return {}
        }

        return {
            Authorization: `Basic ${encoded}`
        }
    }

    /**
     * Handle node update events
     * @param {Object} data - The update data
     */
    handleNodeUpdate(data) {
        const { nodeId, properties } = data
        this.updateNode(nodeId, properties)
    }

    /**
     * Handle node move events
     * @param {Object} data - The move data
     */
    handleNodeMove(data) {
        const { nodeId, newParentId, newIndex } = data
        this.moveNode(nodeId, newParentId, newIndex)
    }

    /**
     * Handle node delete events
     * @param {Object} data - The delete data
     */
    handleNodeDelete(data) {
        const { nodeId } = data
        this.deleteNode(nodeId)
    }

    /**
     * Persist the current outline to localStorage
     * @param {string} turtle - The Turtle representation of the graph
     * @returns {boolean|null} True if saved, false if failed, null if skipped
     */
    saveOutlineToLocalStorage(turtle) {
        if (!this.persistence.useLocalStorage) {
            return null
        }

        try {
            const nodesSnapshot = Array.from(this.nodes.values()).map(node => {
                const snapshot = { ...node }
                if (Array.isArray(node.children)) {
                    snapshot.children = [...node.children]
                }
                if (Array.isArray(node.tags)) {
                    snapshot.tags = [...node.tags]
                }
                return snapshot
            })

            const payload = {
                savedAt: new Date().toISOString(),
                nodes: nodesSnapshot,
                turtle
            }

            localStorage.setItem(this.localStorageKey, JSON.stringify(payload))
            return true
        } catch (error) {
            console.error('Failed to save outline locally:', error)
            this.eventBus.emit('model:error', {
                message: 'Failed to persist outline locally',
                error
            })
            return false
        }
    }

    /**
     * Load the outline from localStorage
     * @returns {Object|null} The loaded outline or null if not found
     */
    loadOutline() {
        if (!this.persistence.useLocalStorage) {
            return null
        }

        try {
            const savedData = localStorage.getItem(this.localStorageKey)
            if (savedData) {
                const parsed = JSON.parse(savedData)

                if (Array.isArray(parsed)) {
                    return { nodes: parsed }
                }

                if (parsed && Array.isArray(parsed.nodes)) {
                    return {
                        nodes: parsed.nodes,
                        turtle: parsed.turtle,
                        savedAt: parsed.savedAt
                    }
                }

                return parsed
            }
        } catch (error) {
            console.error('Failed to load outline:', error)
        }
        return null
    }

    /**
     * Get all nodes for searching
     * @returns {Array} Array of all nodes
     */
    getAllNodesForSearch() {
        return Array.from(this.nodes.values()).filter(node => 
            node.type === 'Node' // Exclude root nodes from search
        )
    }

    /**
     * Get node by ID
     * @param {string} nodeId - The node ID
     * @returns {Object|null} The node or null if not found
     */
    getNode(nodeId) {
        return this.nodes.get(nodeId) || null
    }

    /**
     * Get all children of a node
     * @param {string} nodeId - The parent node ID
     * @returns {Array} Array of child nodes
     */
    getChildNodes(nodeId) {
        const node = this.getNode(nodeId)
        if (!node || !node.children) {
            return []
        }

        return node.children
            .map(childId => this.getNode(childId))
            .filter(child => child !== null)
    }

    /**
     * Get the path from root to a specific node
     * @param {string} nodeId - The target node ID
     * @returns {Array} Array of nodes representing the path
     */
    getNodePath(nodeId) {
        const path = []
        let currentNode = this.getNode(nodeId)

        while (currentNode && currentNode.id !== this.rootId) {
            path.unshift(currentNode)
            currentNode = currentNode.parent ? this.getNode(currentNode.parent) : null
        }

        return path
    }

    /**
     * Add a tag to a node
     * @param {string} nodeId - The node ID
     * @param {string} tag - The tag to add
     * @returns {boolean} Success indicator
     */
    addNodeTag(nodeId, tag) {
        const node = this.getNode(nodeId)
        if (!node) {
            console.warn(`Node ${nodeId} not found for adding tag`)
            return false
        }

        // Initialize tags array if it doesn't exist
        if (!node.tags) {
            node.tags = []
        }

        // Add tag if not already present
        if (!node.tags.includes(tag)) {
            node.tags.push(tag)
            this.eventBus.emit('node:tagAdded', { nodeId, tag, tags: [...node.tags] })
            return true
        }

        return false
    }

    /**
     * Remove a tag from a node
     * @param {string} nodeId - The node ID
     * @param {string} tag - The tag to remove
     * @returns {boolean} Success indicator
     */
    removeNodeTag(nodeId, tag) {
        const node = this.getNode(nodeId)
        if (!node || !node.tags) {
            return false
        }

        const index = node.tags.indexOf(tag)
        if (index !== -1) {
            node.tags.splice(index, 1)
            this.eventBus.emit('node:tagRemoved', { nodeId, tag, tags: [...node.tags] })
            return true
        }

        return false
    }

    /**
     * Toggle a tag on a node
     * @param {string} nodeId - The node ID
     * @param {string} tag - The tag to toggle
     * @returns {boolean} True if tag was added, false if removed
     */
    toggleNodeTag(nodeId, tag) {
        const node = this.getNode(nodeId)
        if (!node) {
            return false
        }

        if (this.hasNodeTag(nodeId, tag)) {
            this.removeNodeTag(nodeId, tag)
            return false
        } else {
            this.addNodeTag(nodeId, tag)
            return true
        }
    }

    /**
     * Check if a node has a specific tag
     * @param {string} nodeId - The node ID
     * @param {string} tag - The tag to check
     * @returns {boolean} True if node has the tag
     */
    hasNodeTag(nodeId, tag) {
        const node = this.getNode(nodeId)
        return node && node.tags && node.tags.includes(tag)
    }

    /**
     * Get all tags for a node
     * @param {string} nodeId - The node ID
     * @returns {Array} Array of tags
     */
    getNodeTags(nodeId) {
        const node = this.getNode(nodeId)
        return node && node.tags ? [...node.tags] : []
    }

    /**
     * Get all nodes with a specific tag
     * @param {string} tag - The tag to search for
     * @returns {Array} Array of nodes with the tag
     */
    getNodesByTag(tag) {
        return Array.from(this.nodes.values()).filter(node => 
            node.tags && node.tags.includes(tag)
        )
    }

    /**
     * Add node to favorites
     * @param {string} nodeId - The node ID
     * @returns {boolean} Success indicator
     */
    addToFavorites(nodeId) {
        return this.addNodeTag(nodeId, 'favorite')
    }

    /**
     * Remove node from favorites
     * @param {string} nodeId - The node ID
     * @returns {boolean} Success indicator
     */
    removeFromFavorites(nodeId) {
        return this.removeNodeTag(nodeId, 'favorite')
    }

    /**
     * Toggle favorite status of a node
     * @param {string} nodeId - The node ID
     * @returns {boolean} True if added to favorites, false if removed
     */
    toggleFavorite(nodeId) {
        return this.toggleNodeTag(nodeId, 'favorite')
    }

    /**
     * Check if node is in favorites
     * @param {string} nodeId - The node ID
     * @returns {boolean} True if node is favorited
     */
    isFavorite(nodeId) {
        return this.hasNodeTag(nodeId, 'favorite')
    }

    /**
     * Get all favorite nodes
     * @returns {Array} Array of favorite nodes
     */
    getFavoriteNodes() {
        return this.getNodesByTag('favorite')
    }

    /**
     * Get the RDF type for a node in prefixed form
     * @param {Object} node - The node object
     * @returns {string} The RDF type in prefixed form (e.g., 'prj:Project')
     */
    getRdfTypeForNode(node) {
        if (node.type && node.type !== 'Node') {
            // If the node has a specific type set, use it
            return node.type;
        }
        // Default to ts:Node
        return 'ts:Node';
    }

    /**
     * Set the RDF type for a node
     * @param {string} nodeId - The node ID
     * @param {string} rdfType - The RDF type in prefixed form (e.g., 'prj:Project')
     * @param {string} rdfTypeUri - The full RDF type URI
     * @returns {boolean} Success indicator
     */
    setNodeType(nodeId, rdfType, rdfTypeUri) {
        const node = this.getNode(nodeId);
        if (!node) {
            console.warn(`Node ${nodeId} not found for setting type`);
            return false;
        }

        node.type = rdfType;
        node.typeUri = rdfTypeUri;

        // Emit event for type change
        this.eventBus.emit('node:typeChanged', { 
            nodeId, 
            type: rdfType, 
            typeUri: rdfTypeUri 
        });

        return true;
    }
}

export default TrestleModel;
