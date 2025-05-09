/**
 * CardDetail component
 * Handles the card detail view for nodes
 */
export class CardDetail {
    /**
     * Create a new CardDetail
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.cardElement = document.getElementById('card');
        this.titleElement = document.getElementById('card-title');
        this.descriptionElement = document.getElementById('card-description');
        this.idElement = document.getElementById('card-nid');
        this.dateElement = document.getElementById('card-date');
        this.closeButton = document.getElementById('card-close');
        
        this.currentNodeId = null;

        this.initialize();
    }

    /**
     * Initialize the card detail component
     */
    initialize() {
        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.handleClose.bind(this));
        }
    }

    /**
     * Show the card detail for a node
     * @param {string} nodeId - The ID of the node to show
     * @param {string} title - The title of the node
     * @param {string} date - The creation date of the node
     */
    show(nodeId, title, date) {
        this.currentNodeId = nodeId;
        
        if (this.titleElement) {
            this.titleElement.textContent = title;
        }
        
        if (this.idElement) {
            this.idElement.textContent = nodeId;
        }
        
        if (this.dateElement) {
            this.dateElement.textContent = date;
        }

        this.eventBus.emit('view:getNodeData', {
            nodeId,
            callback: (node) => this.populateDescription(node)
        });

        // Store node ID with the card
        if (this.cardElement) {
            this.cardElement.dataset.nodeId = nodeId;
            this.cardElement.classList.remove('hidden');
        }
    }

    /**
     * Populate the description field with node data
     * @param {Object} node - The node data
     */
    populateDescription(node) {
        if (this.descriptionElement) {
            this.descriptionElement.value = node.description || '';
            this.descriptionElement.focus();
        }
    }

    /**
     * Handle the close button click
     */
    handleClose() {
        if (this.cardElement && this.cardElement.dataset.nodeId) {
            // Save description
            this.eventBus.emit('view:updateNodeDescription', {
                nodeId: this.cardElement.dataset.nodeId,
                description: this.descriptionElement.value
            });
            
            // Hide card
            this.cardElement.classList.add('hidden');
            this.currentNodeId = null;
        }
    }

    /**
     * Hide the card detail view
     */
    hide() {
        if (this.cardElement) {
            this.cardElement.classList.add('hidden');
            this.currentNodeId = null;
        }
    }
}

export default CardDetail;