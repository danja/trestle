/**
 * TreeNode component
 * Handles the rendering and functionality of an individual node in the tree
 */
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
}