// src/js/controller/TrestleController.js
import { SearchEngine } from '../utils/SearchEngine.js'

export class TrestleController {
    /**
     * Creates a new TrestleController instance
     * @param {TrestleModel} model - The data model
     * @param {TrestleView} view - The view
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(model, view, eventBus) {
        this.model = model
        this.view = view
        this.eventBus = eventBus

        // Initialize search engine
        this.searchEngine = new SearchEngine({
            caseSensitive: false,
            wholeWord: false,
            includeDescriptions: true,
            maxResults: 50
        })

        // Set up event handlers
        this.setupEventHandlers()
    }

    /**
     * Initialize the controller
     */
    initialize() {
        console.log('[TrestleController] Initializing controller');
        const savedOutline = this.model.loadOutline();
        console.log('[TrestleController] Saved outline:', savedOutline);

        if (savedOutline && savedOutline.nodes && savedOutline.nodes.length > 0) {
            console.log('[TrestleController] Loading saved outline with nodes:', savedOutline.nodes.length);
            this.eventBus.emit('model:loaded', savedOutline);
        } else {
            console.log('[TrestleController] Creating new outline');
            // Create a root node if none exists
            const rootNode = this.model.addNode(null, 'Root Node', 0);
            
            // Add a sample child node to make the tree visible
            const childNode = this.model.addNode(rootNode.id, 'Sample Item', 0);
            
            const nodes = Array.from(this.model.nodes.values());
            console.log('[TrestleController] Created new nodes:', nodes);
            
            this.eventBus.emit('model:created', { nodes });
        }
    }

    /**
     * Set up event handlers for view events
     */
    setupEventHandlers() {
        // Basic node operations
        this.eventBus.on('view:addChild', this.handleAddChild.bind(this))
        this.eventBus.on('view:addSibling', this.handleAddSibling.bind(this))
        this.eventBus.on('view:updateNode', this.handleUpdateNode.bind(this))
        this.eventBus.on('view:deleteNode', this.handleDeleteNode.bind(this))

        // Node movement
        this.eventBus.on('view:moveNode', this.handleMoveNode.bind(this))
        this.eventBus.on('view:indentNode', this.handleIndentNode.bind(this))
        this.eventBus.on('view:outdentNode', this.handleOutdentNode.bind(this))

        // Data access
        this.eventBus.on('view:getNodeData', this.handleGetNodeData.bind(this))

        // Position-specific insertion
        this.eventBus.on('view:insertNodeAt', this.handleInsertNodeAt.bind(this))

        // Search events
        this.eventBus.on('view:search', this.handleSearch.bind(this))
        this.eventBus.on('view:clearSearch', this.handleClearSearch.bind(this))

        // Favorites events
        this.eventBus.on('favorites:toggle', this.handleToggleFavorite.bind(this))
        this.eventBus.on('favorites:add', this.handleAddFavorite.bind(this))
        this.eventBus.on('favorites:remove', this.handleRemoveFavorite.bind(this))
        this.eventBus.on('favorites:get', this.handleGetFavorites.bind(this))

        // Type events
        this.eventBus.on('view:setNodeType', this.handleSetNodeType.bind(this))
    }

    /**
     * Save the current data
     * @returns {Promise<boolean>} Success indicator
     */
    async saveData() {
        try {
            const result = await this.model.saveData()
            const localStatus = result?.local ?? null
            const sparqlStatus = result?.sparql ?? null
            const localSuccess = localStatus === true
            const sparqlSuccess = sparqlStatus === true
            const sparqlAttempted = sparqlStatus !== null

            let message = 'Failed to save data'
            let notificationType = 'error'

            if (sparqlSuccess && localSuccess) {
                message = 'Data saved to SPARQL store and browser storage'
                notificationType = 'info'
            } else if (sparqlSuccess) {
                message = 'Data saved to SPARQL store'
                notificationType = 'info'
            } else if (localSuccess) {
                message = sparqlAttempted
                    ? 'SPARQL save failed - data stored locally instead'
                    : 'Data saved locally (offline mode)'
                notificationType = sparqlAttempted ? 'error' : 'info'
            }

            this.showNotification(message, notificationType)

            return sparqlSuccess || localSuccess
        } catch (error) {
            console.error('Save error:', error)
            this.showNotification('Error saving data', 'error')
            return false
        }
    }

    /**
     * Shows a notification to the user
     * @param {string} message - The message to show
     * @param {string} type - The type of notification (default: 'info')
     */
    showNotification(message, type = 'info') {
        // For now just use alert, but this could be improved
        // with a custom notification component
        if (type === 'error') {
            alert(`Error: ${message}`)
        } else {
            alert(message)
        }
    }

    /**
     * Add a new root level item
     */
    addRootItem() {
        const rootNode = this.model.getRootNode()
        if (!rootNode) return

        // Create empty node at the end of root's children
        const node = this.model.addNode(rootNode.id, '', rootNode.children.length)

        this.eventBus.emit('node:added', {
            node,
            parentId: 'trestle-root'
        })
    }

    /**
     * Update node description
     * @param {string} nodeId - The ID of the node to update
     * @param {string} description - The new description
     */
    updateNodeDescription(nodeId, description) {
        this.model.updateNodeDescription(nodeId, description)
    }

    /**
     * Handle adding a child node
     * @param {Object} data - The event data
     */
    handleAddChild(data) {
        const { parentId } = data
        const parent = this.model.getNode(parentId)
        if (!parent) return

        // Add node at the end of parent's children
        const childIndex = parent.children ? parent.children.length : 0
        const node = this.model.addNode(parentId, '', childIndex)

        this.eventBus.emit('node:added', {
            node,
            parentId
        })
    }

    /**
     * Handle adding a sibling node
     * @param {Object} data - The event data
     */
    handleAddSibling(data) {
        const { nodeId } = data
        const node = this.model.getNode(nodeId)
        if (!node) return

        // Get parent
        const parentId = node.parent
        const parent = this.model.getNode(parentId)
        if (!parent) return

        // Find index in parent's children
        const siblingIndex = parent.children.indexOf(nodeId)
        if (siblingIndex === -1) return

        // Add node after current node
        const newNode = this.model.addNode(parentId, '', siblingIndex + 1)

        this.eventBus.emit('node:added', {
            node: newNode,
            parentId
        })
    }

    /**
     * Handle inserting a node at a specific position
     * @param {Object} data - The event data
     */
    handleInsertNodeAt(data) {
        const { parentId, index } = data
        const parent = this.model.getNode(parentId)
        if (!parent) return

        // Create empty node at specified index
        const node = this.model.addNode(parentId, '', index)

        this.eventBus.emit('node:added', {
            node,
            parentId
        })
    }

    /**
     * Handle updating a node
     * @param {Object} data - The event data
     */
    handleUpdateNode(data) {
        const { nodeId, properties } = data

        this.model.updateNode(nodeId, properties)

        this.eventBus.emit('node:updated', {
            nodeId,
            properties
        })
    }

    /**
     * Handle deleting a node
     * @param {Object} data - The event data
     */
    handleDeleteNode(data) {
        const { nodeId } = data

        this.model.deleteNode(nodeId)

        this.eventBus.emit('node:deleted', {
            nodeId
        })
    }

    /**
     * Handle moving a node
     * @param {Object} data - The event data
     */
    handleMoveNode(data) {
        const { nodeId, newParentId, newIndex } = data

        this.model.moveNode(nodeId, newParentId, newIndex)

        // Emit event for node move
        this.eventBus.emit('node:moved', { nodeId, newParentId, newIndex })
    }

    /**
     * Handle indenting a node
     * @param {Object} data - The event data
     */
    handleIndentNode(data) {
        const { nodeId } = data
        const node = this.model.getNode(nodeId)
        if (!node || !node.parent) return

        const parent = this.model.getNode(node.parent)
        if (!parent || !parent.children) return

        // Find index in parent's children
        const index = parent.children.indexOf(nodeId)
        if (index <= 0) return // Can't indent first item

        // Get previous sibling as new parent
        const newParentId = parent.children[index - 1]
        const newParent = this.model.getNode(newParentId)
        if (!newParent) return

        // Move node to end of new parent's children
        this.model.moveNode(nodeId, newParentId, newParent.children ? newParent.children.length : 0)

        // Notify view
        this.eventBus.emit('view:nodeIndented', {
            nodeId,
            newParentId
        })
    }

    /**
     * Handle outdenting a node
     * @param {Object} data - The event data
     */
    handleOutdentNode(data) {
        const { nodeId } = data
        const node = this.model.getNode(nodeId)
        if (!node || !node.parent) return

        const parent = this.model.getNode(node.parent)
        if (!parent || !parent.parent) return

        const grandparentId = parent.parent
        const grandparent = this.model.getNode(grandparentId)
        if (!grandparent) return

        // Find parent's index in grandparent's children
        const parentIndex = grandparent.children.indexOf(parent.id)
        if (parentIndex === -1) return

        // Move node after its parent in grandparent's children
        this.model.moveNode(nodeId, grandparentId, parentIndex + 1)

        // Notify view
        this.eventBus.emit('view:nodeOutdented', {
            nodeId,
            newParentId: grandparentId
        })
    }

    /**
     * Handle getting node data
     * @param {Object} data - The event data
     */
    handleGetNodeData(data) {
        const { nodeId, callback } = data

        const node = this.model.getNode(nodeId)
        if (node && callback) {
            callback(node)
        }
    }

    /**
     * Handle search requests
     * @param {Object} data - The search data
     */
    handleSearch(data) {
        const { query } = data

        if (!query || !query.trim()) {
            this.handleClearSearch()
            return
        }

        try {
            // Get all nodes from the model
            const nodes = this.model.getAllNodesForSearch()
            
            // Perform search
            const results = this.searchEngine.search(nodes, query.trim())
            
            // Emit search results
            this.eventBus.emit('search:results', {
                query: query.trim(),
                results,
                timestamp: Date.now()
            })

            console.log(`Search for "${query}" returned ${results.length} results`)
        } catch (error) {
            console.error('Search error:', error)
            this.eventBus.emit('search:error', {
                query,
                error: error.message,
                timestamp: Date.now()
            })
        }
    }

    /**
     * Handle clear search requests
     */
    handleClearSearch() {
        // Emit clear search results
        this.eventBus.emit('search:cleared', {
            timestamp: Date.now()
        })

        console.log('Search cleared')
    }

    /**
     * Update search engine options
     * @param {Object} options - New search options
     */
    updateSearchOptions(options) {
        this.searchEngine.setOptions(options)
    }

    /**
     * Get current search engine options
     * @returns {Object} Current search options
     */
    getSearchOptions() {
        return this.searchEngine.getOptions()
    }

    /**
     * Handle toggle favorite requests
     * @param {Object} data - The favorite data
     */
    handleToggleFavorite(data) {
        const { nodeId } = data

        if (!nodeId) {
            console.warn('No nodeId provided for favorite toggle')
            return
        }

        try {
            const wasAdded = this.model.toggleFavorite(nodeId)
            const node = this.model.getNode(nodeId)
            
            if (node) {
                this.eventBus.emit('favorites:toggled', {
                    nodeId,
                    isFavorite: wasAdded,
                    node: {
                        id: node.id,
                        title: node.title,
                        tags: node.tags || []
                    },
                    timestamp: Date.now()
                })

                console.log(`Node ${nodeId} ${wasAdded ? 'added to' : 'removed from'} favorites`)
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            this.eventBus.emit('favorites:error', {
                nodeId,
                error: error.message,
                timestamp: Date.now()
            })
        }
    }

    /**
     * Handle add favorite requests
     * @param {Object} data - The favorite data
     */
    handleAddFavorite(data) {
        const { nodeId } = data

        if (!nodeId) {
            console.warn('No nodeId provided for add favorite')
            return
        }

        try {
            const success = this.model.addToFavorites(nodeId)
            const node = this.model.getNode(nodeId)
            
            if (success && node) {
                this.eventBus.emit('favorites:added', {
                    nodeId,
                    node: {
                        id: node.id,
                        title: node.title,
                        tags: node.tags || []
                    },
                    timestamp: Date.now()
                })

                console.log(`Node ${nodeId} added to favorites`)
            }
        } catch (error) {
            console.error('Error adding favorite:', error)
            this.eventBus.emit('favorites:error', {
                nodeId,
                error: error.message,
                timestamp: Date.now()
            })
        }
    }

    /**
     * Handle remove favorite requests
     * @param {Object} data - The favorite data
     */
    handleRemoveFavorite(data) {
        const { nodeId } = data

        if (!nodeId) {
            console.warn('No nodeId provided for remove favorite')
            return
        }

        try {
            const success = this.model.removeFromFavorites(nodeId)
            
            if (success) {
                this.eventBus.emit('favorites:removed', {
                    nodeId,
                    timestamp: Date.now()
                })

                console.log(`Node ${nodeId} removed from favorites`)
            }
        } catch (error) {
            console.error('Error removing favorite:', error)
            this.eventBus.emit('favorites:error', {
                nodeId,
                error: error.message,
                timestamp: Date.now()
            })
        }
    }

    /**
     * Handle get favorites requests
     * @param {Object} data - The request data
     */
    handleGetFavorites(data) {
        const { callback } = data

        try {
            const favoriteNodes = this.model.getFavoriteNodes()
            const favorites = favoriteNodes.map(node => ({
                id: node.id,
                title: node.title,
                description: node.description,
                tags: node.tags || [],
                created: node.created
            }))

            this.eventBus.emit('favorites:list', {
                favorites,
                count: favorites.length,
                timestamp: Date.now()
            })

            if (callback && typeof callback === 'function') {
                callback(favorites)
            }

            console.log(`Retrieved ${favorites.length} favorite nodes`)
        } catch (error) {
            console.error('Error getting favorites:', error)
            this.eventBus.emit('favorites:error', {
                error: error.message,
                timestamp: Date.now()
            })
        }
    }

    /**
     * Handle set node type requests
     * @param {Object} data - The type data
     */
    handleSetNodeType(data) {
        const { nodeId, type, typeUri } = data

        if (!nodeId || !type) {
            console.warn('Missing nodeId or type for set node type')
            return
        }

        try {
            const success = this.model.setNodeType(nodeId, type, typeUri)
            
            if (success) {
                console.log(`Node ${nodeId} type set to ${type}`)
                
                // Emit success event
                this.eventBus.emit('node:typeSet', {
                    nodeId,
                    type,
                    typeUri,
                    timestamp: Date.now()
                })
            }
        } catch (error) {
            console.error('Error setting node type:', error)
            this.eventBus.emit('node:typeError', {
                nodeId,
                error: error.message,
                timestamp: Date.now()
            })
        }
    }
}

export default TrestleController;
