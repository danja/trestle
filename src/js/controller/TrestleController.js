// src/js/controller/TrestleController.js
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

        // Set up event handlers
        this.setupEventHandlers()
    }

    /**
     * Initialize the controller
     */
    initialize() {
        this.model.initialize()
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
    }

    /**
     * Save the current data
     * @returns {Promise<boolean>} Success indicator
     */
    async saveData() {
        try {
            const success = await this.model.saveData()
            if (success) {
                this.showNotification('Data saved successfully')
            } else {
                this.showNotification('Failed to save data', 'error')
            }
            return success
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
}