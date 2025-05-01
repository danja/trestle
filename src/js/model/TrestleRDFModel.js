// src/js/model/TrestleRDFModel.js
import { TrestleModel } from './TrestleModel.js'
import { Config } from '../config.js'
import rdf from 'rdf-ext'

/**
 * Extended Trestle model with RDF capabilities
 */
class TrestleRDFModel extends TrestleModel {
    /**
     * Creates a new TrestleRDFModel instance
     * @param {string} endpoint - The SPARQL endpoint URL
     * @param {string} baseUri - The base URI for the model
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(endpoint, baseUri, eventBus) {
        // Call parent constructor
        super(endpoint, baseUri, eventBus)

        // Initialize RDF dataset
        this.rdfDataset = rdf.dataset()
    }

    /**
     * Initialize the model
     */
    async initialize() {
        try {
            // Initialize base model
            await super.initialize()

            // Build RDF dataset
            this.buildRDFDataset()
        } catch (error) {
            console.error('Error in RDF initialization:', error)
        }
    }

    /**
     * Create an empty model structure
     */
    createEmptyModel() {
        // Create empty model in base class
        super.createEmptyModel()

        // Build RDF dataset
        this.buildRDFDataset()
    }

    /**
     * Build RDF dataset from node data
     */
    buildRDFDataset() {
        // Create fresh dataset
        this.rdfDataset = rdf.dataset()

        // Add all nodes to dataset
        for (const [nodeId, node] of this.nodes.entries()) {
            this.addNodeToRDF(node)
        }
    }

    /**
     * Add a node to the RDF dataset
     * @param {Object} node - The node to add
     */
    addNodeToRDF(node) {
        if (!node) return

        // Set up namespaces
        const ns = {
            rdf: rdf.namespace(Config.PREFIXES.rdf || 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
            dc: rdf.namespace(Config.PREFIXES.dc),
            ts: rdf.namespace(Config.PREFIXES.ts),
            xsd: rdf.namespace(Config.PREFIXES.xsd || 'http://www.w3.org/2001/XMLSchema#')
        }
        const subject = rdf.namedNode(`${this.baseUri}${node.id}`)

        // Helper function to add quads
        const add = (p, o) => {
            if (o !== undefined && o !== null) {
                this.rdfDataset.add(rdf.quad(subject, p, o))
            }
        }

        // Add type
        add(ns.rdf('type'), ns.ts(node.type))

        // Add title
        if (node.title !== undefined) {
            add(ns.dc('title'), rdf.literal(node.title))
        }

        // Add created date
        if (node.created) {
            add(ns.dc('created'), rdf.literal(node.created, ns.xsd('dateTime')))
        } else {
            // Default created date
            add(ns.dc('created'), rdf.literal(new Date().toISOString(), ns.xsd('dateTime')))
        }

        // Add description
        if (node.description !== undefined) {
            add(ns.ts('description'), rdf.literal(node.description))
        }

        // Add parent
        if (node.parent !== undefined && node.parent !== null) {
            add(ns.ts('parent'), rdf.namedNode(`${this.baseUri}${node.parent}`))
        }

        // Add index
        if (node.index !== undefined) {
            add(ns.ts('index'), rdf.literal(node.index.toString()))
        }
    }

    /**
     * Add a new node
     * @param {string} parentId - The parent node ID
     * @param {string} title - The node title
     * @param {number} index - The index in parent's children
     * @returns {Object} The new node
     */
    addNode(parentId, title, index) {
        // Add node in base class
        const newNode = super.addNode(parentId, title, index)

        // Add to RDF dataset
        this.addNodeToRDF(newNode)

        return newNode
    }

    /**
     * Update a node's properties
     * @param {string} nodeId - The node ID to update
     * @param {Object} properties - The properties to update
     */
    updateNode(nodeId, properties) {
        // Update in base class
        super.updateNode(nodeId, properties)

        // Update in RDF dataset
        const node = this.getNode(nodeId)
        if (node) {
            // Remove existing quads
            const quadsToRemove = this.rdfDataset.match(rdf.namedNode(`${this.baseUri}${nodeId}`))
            for (const quad of quadsToRemove) {
                this.rdfDataset.delete(quad)
            }

            // Add updated node
            this.addNodeToRDF(node)
        }
    }

    /**
     * Update a node's description
     * @param {string} nodeId - The node ID to update
     * @param {string} description - The new description
     */
    updateNodeDescription(nodeId, description) {
        // Update in base class
        super.updateNodeDescription(nodeId, description)

        // Update in RDF dataset
        const node = this.getNode(nodeId)
        if (node) {
            // Remove existing description quads
            const descQuads = this.rdfDataset.match(
                rdf.namedNode(`${this.baseUri}${nodeId}`),
                rdf.namespace(Config.PREFIXES.dc)('description')
            )

            for (const quad of descQuads) {
                this.rdfDataset.delete(quad)
            }

            // Add new description if provided
            if (description) {
                this.rdfDataset.add(rdf.quad(
                    rdf.namedNode(`${this.baseUri}${nodeId}`),
                    rdf.namespace(Config.PREFIXES.dc)('description'),
                    rdf.literal(description)
                ))
            }
        }
    }

    /**
     * Delete a node and its children
     * @param {string} nodeId - The node ID to delete
     */
    deleteNode(nodeId) {
        // Get all descendant IDs
        const allNodesToDelete = this.getAllDescendantIds(nodeId)
        allNodesToDelete.push(nodeId)

        // Delete in base class
        super.deleteNode(nodeId)

        // Delete from RDF dataset
        for (const idToDelete of allNodesToDelete) {
            this.removeNodeFromRDF(idToDelete)
        }
    }

    /**
     * Get all descendant IDs of a node
     * @param {string} nodeId - The node ID
     * @returns {Array} The descendant IDs
     */
    getAllDescendantIds(nodeId) {
        const node = this.getNode(nodeId)
        if (!node || !node.children || node.children.length === 0) {
            return []
        }

        let descendantIds = []
        for (const childId of node.children) {
            descendantIds.push(childId)
            descendantIds = descendantIds.concat(this.getAllDescendantIds(childId))
        }
        return descendantIds
    }

    /**
     * Remove a node from the RDF dataset
     * @param {string} nodeId - The node ID to remove
     */
    removeNodeFromRDF(nodeId) {
        const subject = rdf.namedNode(`${this.baseUri}${nodeId}`)

        // Find all quads to remove
        const quadsToRemove = []

        // Quads where node is subject
        for (const quad of this.rdfDataset.match(subject)) {
            quadsToRemove.push(quad)
        }

        // Quads where node is object
        for (const quad of this.rdfDataset.match(null, null, subject)) {
            quadsToRemove.push(quad)
        }

        // Delete quads
        for (const quad of quadsToRemove) {
            this.rdfDataset.delete(quad)
        }
    }

    /**
     * Move a node to a new parent
     * @param {string} nodeId - The node ID to move
     * @param {string} newParentId - The new parent ID
     * @param {number} newIndex - The new index in parent's children
     */
    moveNode(nodeId, newParentId, newIndex) {
        // Move in base class
        super.moveNode(nodeId, newParentId, newIndex)

        // Update in RDF dataset
        const node = this.getNode(nodeId)
        if (node) {
            // Remove existing quads
            this.removeNodeFromRDF(nodeId)
            this.addNodeToRDF(node)
        }

        // Update children of new parent
        const newParent = this.getNode(newParentId)
        if (newParent && newParent.children) {
            for (const childId of newParent.children) {
                const child = this.getNode(childId)
                if (child) {
                    this.removeNodeFromRDF(childId)
                    this.addNodeToRDF(child)
                }
            }
        }
    }

    /**
     * Convert the model to Turtle format
     * @returns {string} The Turtle representation
     */
    toTurtle() {
        // Use base class implementation
        return super.toTurtle()
    }

    /**
     * Get the RDF dataset
     * @returns {Dataset} The RDF dataset
     */
    getRDFDataset() {
        return this.rdfDataset
    }
}

export default TrestleRDFModel