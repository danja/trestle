/**
 * TypeSelector component
 * Handles RDF type selection dropdown for tree nodes
 * Uses TypeService via event bus for proper loose coupling
 */

export class TypeSelector {
    /**
     * Create a new TypeSelector
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.activeDropdown = null;
        this.currentNodeId = null;
        this.availableTypes = [];
        
        // Bind methods
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleAvailableTypes = this.handleAvailableTypes.bind(this);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Listen for document clicks to close dropdown
        document.addEventListener('click', this.handleDocumentClick);

        // Request available types from TypeService
        this.requestAvailableTypes();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        this.eventBus.on('type:availableTypes', this.handleAvailableTypes);
        this.eventBus.on('type:nodeTypeSet', this.handleNodeTypeSet.bind(this));
        this.eventBus.on('type:error', this.handleTypeError.bind(this));
    }

    /**
     * Request available types from TypeService
     */
    requestAvailableTypes() {
        this.eventBus.emit('type:getAvailable', {
            callback: this.handleAvailableTypes
        });
    }

    /**
     * Handle available types response
     * @param {Object} data - The response data
     */
    handleAvailableTypes(data) {
        this.availableTypes = data.types || [];
        console.log('[TypeSelector] Received available types:', this.availableTypes);
    }

    /**
     * Show type selection dropdown for a node
     * @param {string} nodeId - The node ID
     * @param {HTMLElement} buttonElement - The button that triggered the dropdown
     * @param {string} currentType - The current node type
     */
    showTypeDropdown(nodeId, buttonElement, currentType = 'ts:Node') {
        // Close any existing dropdown
        this.closeDropdown();
        
        this.currentNodeId = nodeId;
        
        // Create dropdown element
        const dropdown = document.createElement('div');
        dropdown.className = 'type-dropdown';
        dropdown.innerHTML = this.buildDropdownHTML(currentType);
        
        // Position dropdown relative to button
        const buttonRect = buttonElement.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${buttonRect.bottom + 5}px`;
        dropdown.style.left = `${buttonRect.left}px`;
        dropdown.style.zIndex = '1000';
        
        // Add event listeners to type options
        const typeOptions = dropdown.querySelectorAll('.type-option');
        typeOptions.forEach(option => {
            option.addEventListener('click', (event) => {
                event.stopPropagation();
                const selectedType = option.dataset.type;
                const selectedUri = option.dataset.uri;
                this.selectType(nodeId, selectedType, selectedUri);
                this.closeDropdown();
            });
        });
        
        // Add to DOM
        document.body.appendChild(dropdown);
        this.activeDropdown = dropdown;
    }

    /**
     * Build the HTML for the dropdown
     * @param {string} currentType - The current node type
     * @returns {string} The dropdown HTML
     */
    buildDropdownHTML(currentType) {
        let html = '<div class="type-dropdown-header">Select Type</div>';
        
        this.availableTypes.forEach(typeInfo => {
            const isSelected = typeInfo.prefix === currentType;
            const selectedClass = isSelected ? ' selected' : '';
            
            html += `
                <div class="type-option${selectedClass}" 
                     data-type="${typeInfo.prefix}" 
                     data-uri="${typeInfo.uri.value || typeInfo.uri}"
                     title="${typeInfo.description}">
                    <span class="type-label">${typeInfo.label}</span>
                    <span class="type-prefix">${typeInfo.prefix}</span>
                    ${isSelected ? '<span class="type-checkmark">✓</span>' : ''}
                </div>
            `;
        });
        
        return html;
    }

    /**
     * Select a type for the current node
     * @param {string} nodeId - The node ID
     * @param {string} typePrefix - The type prefix (e.g., 'prj:Project')
     * @param {string} typeUri - The full type URI
     */
    selectType(nodeId, typePrefix, typeUri) {
        console.log(`[TypeSelector] Setting type for node ${nodeId} to ${typePrefix} (${typeUri})`);
        
        // Use TypeService to set the node type via event bus
        this.eventBus.emit('type:setNodeType', {
            nodeId,
            typePrefix
        });
    }

    /**
     * Handle node type set response
     * @param {Object} data - The response data
     */
    handleNodeTypeSet(data) {
        const { nodeId, typePrefix, typeInfo } = data;
        
        // Emit to view layer to update the node
        this.eventBus.emit('view:setNodeType', {
            nodeId,
            type: typePrefix,
            typeUri: typeInfo.uri.value || typeInfo.uri,
            typeInfo
        });
        
        // Show visual feedback
        this.showTypeNotification(`Node type set to ${typePrefix}`);
    }

    /**
     * Handle type service errors
     * @param {Object} data - The error data
     */
    handleTypeError(data) {
        console.error('[TypeSelector] Type service error:', data);
        this.showTypeNotification(`Error: ${data.error}`, 'error');
    }

    /**
     * Close the active dropdown
     */
    closeDropdown() {
        if (this.activeDropdown) {
            this.activeDropdown.remove();
            this.activeDropdown = null;
            this.currentNodeId = null;
        }
    }

    /**
     * Handle document clicks to close dropdown
     * @param {MouseEvent} event - The click event
     */
    handleDocumentClick(event) {
        if (this.activeDropdown && !this.activeDropdown.contains(event.target)) {
            this.closeDropdown();
        }
    }

    /**
     * Show a temporary notification
     * @param {string} message - The notification message
     */
    showTypeNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'type-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            padding: 10px 15px;
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Get the display type for a node
     * @param {string} nodeType - The node type
     * @returns {string} The display label
     */
    static getTypeDisplay(nodeType) {
        // Return the part after the colon or the full type if no colon
        const parts = nodeType.split(':');
        return parts.length > 1 ? parts[1] : nodeType;
    }

    /**
     * Get type info by prefix
     * @param {string} typePrefix - The type prefix
     * @returns {Object|null} The type info object
     */
    static getTypeInfo(typePrefix) {
        // This method now requires an instance with access to TypeService
        // Use the instance methods instead of static methods
        console.warn('[TypeSelector] Static getTypeInfo is deprecated. Use instance method through TypeService.');
        return null;
    }
}

export default TypeSelector;