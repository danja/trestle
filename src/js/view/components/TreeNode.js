/**
 * TreeNode component
 * Handles the rendering and functionality of an individual node in the tree
 */
const TYPE_DISPLAY_CONFIG = {
    'prj:Project': {
        buttonIcon: '📁',
        label: 'Project',
        indicatorClass: 'ts-type-icon--project'
    },
    'prj:Task': {
        buttonIcon: '✓',
        label: 'Task',
        indicatorClass: 'ts-type-icon--task'
    },
    'ts:Node': {
        buttonIcon: '🏷️',
        label: 'Set type',
        indicatorClass: 'ts-type-icon--generic'
    }
};

const DEFAULT_TYPE_DISPLAY = {
    buttonIcon: '🏷️',
    label: 'Set type',
    indicatorClass: 'ts-type-icon--generic'
};

export class TreeNode {
    /**
     * Create a new TreeNode
     * @param {Object} nodeData - The node data
     * @param {Map} nodesMap - The map of all nodes
     * @param {EventBus} eventBus - The event bus for communication
     * @param {HTMLElement} template - The node template
     */
    constructor(nodeData, nodesMap, eventBus, template) {
        this.nodeData = nodeData;
        this.nodesMap = nodesMap;
        this.eventBus = eventBus;
        this.template = template;
        this.element = null;
        this.favoriteButton = null;
        this.typeButton = null;
        this.typeIconElement = null;
        
        // Listen for favorite state changes
        this.eventBus.on('favorites:toggled', this.handleFavoriteToggled.bind(this));
        this.eventBus.on('favorites:added', this.handleFavoriteAdded.bind(this));
        this.eventBus.on('favorites:removed', this.handleFavoriteRemoved.bind(this));
        
        // Listen for type changes
        this.eventBus.on('view:setNodeType', this.handleNodeTypeSet.bind(this));
    }

    /**
     * Render the node and its children
     * @param {HTMLElement} parentElement - The parent element to append to
     * @returns {HTMLLIElement} The rendered node element
     */
    render(parentElement) {
        const { id, title, created, children = [] } = this.nodeData;

        const li = document.createElement('li');
        li.dataset.nodeId = id;

        // Create dropzone for drag and drop functionality
        const dropzone = document.createElement('div');
        dropzone.className = 'dropzone';
        li.appendChild(dropzone);

        // Clone the template and customize it
        const entry = this.template.content.cloneNode(true).querySelector('.ts-entry');
        entry.id = id;
        this.typeIconElement = entry.querySelector('.ts-type-icon') || null;

        const normalizedType = this.getNormalizedType();
        this.applyTypeAttributes(normalizedType, entry, li);
        this.updateTypeIndicator(normalizedType);

        const titleElement = entry.querySelector('.ts-title');
        titleElement.textContent = title || '';

        // Set created date (hidden)
        const dateElement = entry.querySelector('.date');
        dateElement.textContent = created || '';

        // --- Add delete button event listener ---
        const deleteButton = entry.querySelector('.ts-delete');
        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (confirm('Are you sure you want to delete this item and all its children?')) {
                    this.eventBus.emit('view:deleteNode', { nodeId: id });
                }
            });
        }
        // --- End delete button event listener ---

        // --- Add child button event listener ---
        const addChildButton = entry.querySelector('.ts-addChild');
        if (addChildButton) {
            addChildButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.eventBus.emit('view:addChild', { parentId: id });
            });
        }
        // --- End add child button event listener ---

        // --- Add type button event listener ---
        const typeButton = entry.querySelector('.ts-type');
        if (typeButton) {
            typeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.eventBus.emit('view:showTypeSelector', { 
                    nodeId: id, 
                    buttonElement: typeButton,
                    currentType: this.nodeData.type || 'ts:Node'
                });
            });
            
            // Store reference to type button and update its appearance
            this.typeButton = typeButton;
            this.updateTypeButton();
        }
        // --- End type button event listener ---

        // --- Add favorite button ---
        const favoriteButton = document.createElement('button');
        favoriteButton.className = 'ts-favorite';
        favoriteButton.innerHTML = '☆'; // Empty star
        favoriteButton.setAttribute('aria-label', 'Toggle favorite');
        favoriteButton.title = 'Add to favorites';
        
        favoriteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.eventBus.emit('favorites:toggle', { 
                nodeId: id,
                title: title || 'Untitled'
            });
        });
        
        // Add the favorite button to the entry
        if (titleElement) {
            titleElement.parentNode.insertBefore(favoriteButton, titleElement.nextSibling);
        }
        
        // Store reference to favorite button
        this.favoriteButton = favoriteButton;
        
        // Set initial favorite state
        this.updateFavoriteState();
        // --- End favorite button ---

        // Append entry to list item
        li.appendChild(entry);

        // Render children if any
        if (children && children.length > 0) {
            const ul = document.createElement('ul');
            li.appendChild(ul);
            li.classList.add('ts-open');

            for (const childId of children) {
                this._renderChild(childId, ul);
            }
        } else {
            li.classList.add('ts-closed');
        }

        if (parentElement) {
            parentElement.appendChild(li);
        }

        this.element = li;
        return li;
    }

    /**
     * Render a child node
     * @param {string} childId - The ID of the child node
     * @param {HTMLElement} parentElement - The parent element to append to
     * @returns {HTMLLIElement} The rendered child node element
     * @private
     */
    _renderChild(childId, parentElement) {
        const childData = this.nodesMap.get(childId);
        if (!childData) return null;

        const childNode = new TreeNode(childData, this.nodesMap, this.eventBus, this.template);
        return childNode.render(parentElement);
    }

    /**
     * Get the normalized RDF type for the node
     * @returns {string|null} The normalized type or null if no RDF type is set
     */
    getNormalizedType() {
        const rawType = this.nodeData?.type;
        if (!rawType || rawType === 'Node' || rawType === 'RootNode') {
            return null;
        }
        return rawType;
    }

    /**
     * Apply type-related data attributes to entry and container elements
     * @param {string|null} nodeType - The normalized node type
     * @param {HTMLElement} [entryElement] - The entry element to update
     * @param {HTMLElement} [containerElement] - The container (li) element to update
     */
    applyTypeAttributes(nodeType, entryElement = null, containerElement = null) {
        const entry = entryElement || document.getElementById(this.nodeData.id);
        const container = containerElement || this.element;

        if (entry) {
            if (nodeType) {
                entry.dataset.nodeType = nodeType;
            } else {
                delete entry.dataset.nodeType;
            }
        }

        if (container) {
            if (nodeType) {
                container.dataset.nodeType = nodeType;
            } else {
                delete container.dataset.nodeType;
            }
        }
    }

    /**
     * Update the inline type indicator icon
     * @param {string|null} normalizedType - Normalized RDF type for the node
     */
    updateTypeIndicator(normalizedType = this.getNormalizedType()) {
        if (!this.typeIconElement) return;

        this.typeIconElement.className = 'ts-type-icon';

        if (normalizedType) {
            const display = TYPE_DISPLAY_CONFIG[normalizedType] || DEFAULT_TYPE_DISPLAY;
            if (display.indicatorClass) {
                this.typeIconElement.classList.add(display.indicatorClass);
            }
            this.typeIconElement.classList.add('is-visible');
            this.typeIconElement.dataset.type = normalizedType;
            const label = display.label || 'Typed node';
            this.typeIconElement.title = `${label} (${normalizedType})`;
        } else {
            delete this.typeIconElement.dataset.type;
            this.typeIconElement.removeAttribute('title');
        }
    }

    /**
     * Update the node with new data
     * @param {Object} properties - The properties to update
     */
    update(properties) {
        if (!this.element) return;

        const entry = document.getElementById(this.nodeData.id);
        if (!entry) return;

        if (properties.title !== undefined) {
            const titleElement = entry.querySelector('.ts-title');
            titleElement.textContent = properties.title;
            this.nodeData.title = properties.title;
        }

        if (properties.type !== undefined) {
            this.nodeData.type = properties.type;
            if (properties.typeUri !== undefined) {
                this.nodeData.typeUri = properties.typeUri;
            }
            const normalizedType = this.getNormalizedType();
            this.applyTypeAttributes(normalizedType);
            this.updateTypeButton();
            this.updateTypeIndicator(normalizedType);
        }
    }

    /**
     * Add a child node
     * @param {Object} childData - The child node data
     * @returns {TreeNode} The created child node
     */
    addChild(childData) {
        if (!this.element) return null;

        // Get or create parent's child list
        let ul = this.element.querySelector('ul');
        if (!ul) {
            ul = document.createElement('ul');
            this.element.appendChild(ul);
            this.element.classList.remove('ts-closed');
            this.element.classList.add('ts-open');
        }

        const childNode = new TreeNode(childData, this.nodesMap, this.eventBus, this.template);
        childNode.render(ul);

        return childNode;
    }

    /**
     * Remove the node from the DOM
     */
    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    /**
     * Select this node
     */
    select() {
        if (!this.element) return;

        const entry = document.getElementById(this.nodeData.id);
        if (entry) {
            entry.classList.add('ts-selected');
            entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Deselect this node
     */
    deselect() {
        if (!this.element) return;

        const entry = document.getElementById(this.nodeData.id);
        if (entry) {
            entry.classList.remove('ts-selected');
        }
    }

    /**
     * Update the favorite button state
     */
    updateFavoriteState() {
        if (!this.favoriteButton) return;

        const isFavorite = this.nodeData.tags && this.nodeData.tags.includes('favorite');
        
        if (isFavorite) {
            this.favoriteButton.innerHTML = '★'; // Filled star
            this.favoriteButton.classList.add('is-favorite');
            this.favoriteButton.title = 'Remove from favorites';
        } else {
            this.favoriteButton.innerHTML = '☆'; // Empty star
            this.favoriteButton.classList.remove('is-favorite');
            this.favoriteButton.title = 'Add to favorites';
        }
    }

    /**
     * Handle favorite toggled event
     * @param {Object} data - The favorite toggled data
     */
    handleFavoriteToggled(data) {
        if (data.nodeId === this.nodeData.id) {
            // Update local node data
            if (data.isFavorite) {
                if (!this.nodeData.tags) this.nodeData.tags = [];
                if (!this.nodeData.tags.includes('favorite')) {
                    this.nodeData.tags.push('favorite');
                }
            } else {
                if (this.nodeData.tags) {
                    const index = this.nodeData.tags.indexOf('favorite');
                    if (index !== -1) {
                        this.nodeData.tags.splice(index, 1);
                    }
                }
            }
            this.updateFavoriteState();
        }
    }

    /**
     * Handle favorite added event
     * @param {Object} data - The favorite added data
     */
    handleFavoriteAdded(data) {
        if (data.nodeId === this.nodeData.id) {
            if (!this.nodeData.tags) this.nodeData.tags = [];
            if (!this.nodeData.tags.includes('favorite')) {
                this.nodeData.tags.push('favorite');
            }
            this.updateFavoriteState();
        }
    }

    /**
     * Handle favorite removed event
     * @param {Object} data - The favorite removed data
     */
    handleFavoriteRemoved(data) {
        if (data.nodeId === this.nodeData.id) {
            if (this.nodeData.tags) {
                const index = this.nodeData.tags.indexOf('favorite');
                if (index !== -1) {
                    this.nodeData.tags.splice(index, 1);
                }
            }
            this.updateFavoriteState();
        }
    }

    /**
     * Handle node type set event
     * @param {Object} data - The event data
     */
    handleNodeTypeSet(data) {
        if (data.nodeId === this.nodeData.id) {
            // Update node data
            this.nodeData.type = data.type;
            this.nodeData.typeUri = data.typeUri;
            const normalizedType = this.getNormalizedType();
            this.applyTypeAttributes(normalizedType);
            // Update type button appearance
            this.updateTypeButton();
            this.updateTypeIndicator(normalizedType);
        }
    }

    /**
     * Update the type button appearance based on current node type
     */
    updateTypeButton() {
        if (!this.typeButton) return;

        const normalizedType = this.getNormalizedType();
        const buttonTypeKey = normalizedType || 'ts:Node';
        const display = TYPE_DISPLAY_CONFIG[buttonTypeKey] || DEFAULT_TYPE_DISPLAY;
        const label = display.label || 'Set type';

        // Update button content and attributes
        this.typeButton.textContent = display.buttonIcon || DEFAULT_TYPE_DISPLAY.buttonIcon;
        this.typeButton.setAttribute('aria-label', label);
        const titleType = normalizedType || 'ts:Node';
        this.typeButton.title = `${label} (${titleType})`;

        // Add CSS class to indicate type state
        if (normalizedType) {
            this.typeButton.classList.add('ts-type-set');
        } else {
            this.typeButton.classList.remove('ts-type-set');
        }
    }
}

export default TreeNode;
