/**
 * TypeService - Handles RDF type management using RDF-Ext
 * Uses event bus for loose coupling and modular design
 */
import rdf from 'rdf-ext'
import { namespaces } from '../../utils/utils.js'

export class TypeService {
    /**
     * Create a new TypeService
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(eventBus) {
        this.eventBus = eventBus
        this.ns = {}
        this.availableTypes = new Map()

        // Initialize namespaces using RDF-Ext
        Object.entries(namespaces).forEach(([prefix, uri]) => {
            this.ns[prefix] = rdf.namespace(uri)
        })

        this.initializeTypes()
        this.setupEventHandlers()
    }

    /**
     * Initialize available RDF types
     */
    initializeTypes() {
        // Define available types with proper RDF handling
        const types = [
            {
                prefix: 'prj:Project',
                uri: this.ns.prj('Project'),
                label: 'Project',
                description: 'A project with goals and deliverables',
                category: 'project'
            },
            {
                prefix: 'prj:Task',
                uri: this.ns.prj('Task'),
                label: 'Task',
                description: 'A specific task or action item',
                category: 'project'
            },
            {
                prefix: 'ts:Node',
                uri: this.ns.ts('Node'),
                label: 'Generic Item',
                description: 'Default generic node type',
                category: 'trestle'
            }
        ]

        types.forEach(type => {
            this.availableTypes.set(type.prefix, type)
        })
    }

    /**
     * Set up event handlers
     */
    setupEventHandlers() {
        this.eventBus.on('type:getAvailable', this.handleGetAvailableTypes.bind(this))
        this.eventBus.on('type:setNodeType', this.handleSetNodeType.bind(this))
        this.eventBus.on('type:getTypeInfo', this.handleGetTypeInfo.bind(this))
        this.eventBus.on('type:validateType', this.handleValidateType.bind(this))
    }

    /**
     * Handle request for available types
     * @param {Object} data - Request data
     */
    handleGetAvailableTypes(data) {
        const { callback, category } = data

        let types = Array.from(this.availableTypes.values())
        
        // Filter by category if specified
        if (category) {
            types = types.filter(type => type.category === category)
        }

        const response = {
            types,
            count: types.length,
            timestamp: Date.now()
        }

        // Emit response event
        this.eventBus.emit('type:availableTypes', response)

        // Call callback if provided
        if (callback && typeof callback === 'function') {
            callback(response)
        }
    }

    /**
     * Handle set node type request
     * @param {Object} data - Type setting data
     */
    handleSetNodeType(data) {
        const { nodeId, typePrefix, nodeSubject } = data

        if (!nodeId || !typePrefix) {
            this.eventBus.emit('type:error', {
                error: 'Missing nodeId or typePrefix',
                data,
                timestamp: Date.now()
            })
            return
        }

        const typeInfo = this.availableTypes.get(typePrefix)
        if (!typeInfo) {
            this.eventBus.emit('type:error', {
                error: `Unknown type: ${typePrefix}`,
                data,
                timestamp: Date.now()
            })
            return
        }

        try {
            // Create RDF dataset for the type assertion
            const dataset = rdf.dataset()
            const subject = nodeSubject || rdf.namedNode(`http://hyperdata.it/trestle/${nodeId}`)

            // Add the type triple using RDF-Ext
            dataset.add(rdf.quad(
                subject,
                this.ns.rdf('type'),
                typeInfo.uri
            ))

            // Emit successful type setting
            this.eventBus.emit('type:nodeTypeSet', {
                nodeId,
                typePrefix,
                typeUri: typeInfo.uri.value,
                typeInfo,
                dataset,
                subject,
                timestamp: Date.now()
            })

            console.log(`[TypeService] Set type ${typePrefix} for node ${nodeId}`)

        } catch (error) {
            console.error('[TypeService] Error setting node type:', error)
            this.eventBus.emit('type:error', {
                error: error.message,
                nodeId,
                typePrefix,
                timestamp: Date.now()
            })
        }
    }

    /**
     * Handle get type info request
     * @param {Object} data - Request data
     */
    handleGetTypeInfo(data) {
        const { typePrefix, callback } = data

        const typeInfo = this.availableTypes.get(typePrefix)
        const response = {
            typePrefix,
            typeInfo: typeInfo || null,
            found: !!typeInfo,
            timestamp: Date.now()
        }

        this.eventBus.emit('type:typeInfo', response)

        if (callback && typeof callback === 'function') {
            callback(response)
        }
    }

    /**
     * Handle validate type request
     * @param {Object} data - Validation data
     */
    handleValidateType(data) {
        const { typePrefix, callback } = data

        const isValid = this.availableTypes.has(typePrefix)
        const response = {
            typePrefix,
            isValid,
            typeInfo: isValid ? this.availableTypes.get(typePrefix) : null,
            timestamp: Date.now()
        }

        this.eventBus.emit('type:typeValidated', response)

        if (callback && typeof callback === 'function') {
            callback(response)
        }
    }

    /**
     * Get all available types (synchronous)
     * @returns {Array} Array of type information
     */
    getAvailableTypes() {
        return Array.from(this.availableTypes.values())
    }

    /**
     * Get type information (synchronous)
     * @param {string} typePrefix - The type prefix to look up
     * @returns {Object|null} Type information or null if not found
     */
    getTypeInfo(typePrefix) {
        return this.availableTypes.get(typePrefix) || null
    }

    /**
     * Validate a type prefix (synchronous)
     * @param {string} typePrefix - The type prefix to validate
     * @returns {boolean} True if valid
     */
    isValidType(typePrefix) {
        return this.availableTypes.has(typePrefix)
    }

    /**
     * Create an RDF dataset with type information for a node
     * @param {string} nodeId - The node ID
     * @param {string} typePrefix - The type prefix
     * @param {string} baseUri - The base URI for nodes
     * @returns {Object|null} Object with dataset and subject, or null if invalid
     */
    createTypeDataset(nodeId, typePrefix, baseUri = 'http://hyperdata.it/trestle/') {
        const typeInfo = this.availableTypes.get(typePrefix)
        if (!typeInfo) {
            return null
        }

        const dataset = rdf.dataset()
        const subject = rdf.namedNode(`${baseUri}${nodeId}`)

        // Add type assertion
        dataset.add(rdf.quad(
            subject,
            this.ns.rdf('type'),
            typeInfo.uri
        ))

        return {
            dataset,
            subject,
            typeInfo
        }
    }
}

export default TypeService