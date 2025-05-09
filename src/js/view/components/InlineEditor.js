/**
 * InlineEditor component
 * Handles inline editing of node titles
 */
export class InlineEditor {
    /**
     * Create a new InlineEditor
     * @param {HTMLElement} rootElement - The root element containing the tree
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(rootElement, eventBus) {
        this.rootElement = rootElement;
        this.eventBus = eventBus;
        this.editingId = null;
        
        this.initialize();
    }

    /**
     * Initialize the inline editor
     */
    initialize() {
        this.rootElement.addEventListener('dblclick', this.handleDblClick.bind(this));
        this.rootElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.rootElement.addEventListener('focus', this.handleFocus.bind(this), true);
        this.rootElement.addEventListener('blur', this.handleBlur.bind(this), true);
        
        // Global escape key handler
        document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this));
    }

    /**
     * Handle double-click on a node title
     * @param {MouseEvent} event - The double-click event
     */
    handleDblClick(event) {
        const target = event.target;
        
        if (target.classList.contains('ts-title')) {
            this.startEditing(target);
            event.stopPropagation();
        }
    }

    /**
     * Start editing a node title
     * @param {HTMLElement} titleElement - The title element to edit
     */
    startEditing(titleElement) {
        titleElement.contentEditable = true;
        titleElement.focus();
        this.editingId = titleElement.closest('.ts-entry').id;

        // Select all text
        const range = document.createRange();
        range.selectNodeContents(titleElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Handle keydown events during editing
     * @param {KeyboardEvent} event - The keydown event
     */
    handleKeyDown(event) {
        if (!event.target.isContentEditable) return;

        const entry = event.target.closest('.ts-entry');
        if (!entry) return;

        const nodeId = entry.id;
        const nodeLi = entry.closest('li');
        if (!nodeLi) return;

        switch (event.key) {
            case 'Tab':
                this.handleTabKey(event, nodeId, nodeLi);
                break;

            case 'Enter':
                this.handleEnterKey(event, nodeId, nodeLi);
                break;

            case 'Escape':
                this.handleEscapeKey(event, nodeId);
                break;

            case 'ArrowUp':
                this.handleArrowKeys(event, nodeId, 'up');
                break;

            case 'ArrowDown':
                this.handleArrowKeys(event, nodeId, 'down');
                break;
        }
    }

    /**
     * Handle Tab key during editing (indent/outdent)
     * @param {KeyboardEvent} event - The keydown event
     * @param {string} nodeId - The ID of the node being edited
     * @param {HTMLElement} nodeLi - The node's list item element
     */
    handleTabKey(event, nodeId, nodeLi) {
        event.preventDefault();
        
        if (event.shiftKey) {
            // Outdent logic
            const parentLi = nodeLi.parentElement.closest('li');
            if (!parentLi) return; // Already at the top level

            const grandParentUl = parentLi.parentElement;
            if (!grandParentUl) return;

            const newParentId = grandParentUl.closest('li')?.dataset.nodeId || 'trestle-root';

            grandParentUl.insertBefore(nodeLi, parentLi.nextElementSibling);

            this.eventBus.emit('view:moveNode', {
                nodeId,
                newParentId,
                newIndex: Array.from(grandParentUl.children).indexOf(nodeLi)
            });
        } else {
            // Indent logic
            const prevLi = nodeLi.previousElementSibling;
            if (!prevLi) return; // No previous sibling to indent under

            const newParentId = prevLi.dataset.nodeId;
            let childUl = prevLi.querySelector('ul');
            if (!childUl) {
                childUl = document.createElement('ul');
                prevLi.appendChild(childUl);
                prevLi.classList.remove('ts-closed');
                prevLi.classList.add('ts-open');
            }

            childUl.appendChild(nodeLi);

            this.eventBus.emit('view:moveNode', {
                nodeId,
                newParentId,
                newIndex: Array.from(childUl.children).indexOf(nodeLi)
            });
        }
    }

    /**
     * Handle Enter key during editing (finish editing and create new node)
     * @param {KeyboardEvent} event - The keydown event
     * @param {string} nodeId - The ID of the node being edited
     * @param {HTMLElement} nodeLi - The node's list item element
     */
    handleEnterKey(event, nodeId, nodeLi) {
        if (event.shiftKey) {
            return; // Allow line breaks with Shift+Enter
        }

        event.preventDefault();
        event.target.contentEditable = false;
        this.editingId = null;

        const newTitle = event.target.textContent.trim();
        this.eventBus.emit('view:updateNode', { nodeId, properties: { title: newTitle } });

        const isFirstNode =
            nodeLi.parentElement.classList.contains('ts-root') &&
            !nodeLi.previousElementSibling;

        if (isFirstNode) {
            this.eventBus.emit('view:addChild', { parentId: nodeId });
        } else {
            this.eventBus.emit('view:addSibling', { nodeId });
        }
    }

    /**
     * Handle Escape key during editing (cancel editing)
     * @param {KeyboardEvent} event - The keydown event
     * @param {string} nodeId - The ID of the node being edited
     */
    handleEscapeKey(event, nodeId) {
        event.preventDefault();
        event.target.contentEditable = false;
        this.editingId = null;
        
        // Re-select the node
        this.eventBus.emit('view:selectNode', { nodeId });
    }

    /**
     * Handle Arrow keys during editing (move node or navigate)
     * @param {KeyboardEvent} event - The keydown event
     * @param {string} nodeId - The ID of the node being edited
     * @param {string} direction - The direction ('up' or 'down')
     */
    handleArrowKeys(event, nodeId, direction) {
        if (event.ctrlKey) {
            event.preventDefault();
            
            if (direction === 'up') {
                this.eventBus.emit('view:moveNodeUp', { nodeId });
            } else {
                this.eventBus.emit('view:moveNodeDown', { nodeId });
            }
        } else {
            event.preventDefault();
            
            if (direction === 'up') {
                this.eventBus.emit('view:navigateUp', { nodeId });
            } else {
                this.eventBus.emit('view:navigateDown', { nodeId });
            }
        }
    }

    /**
     * Handle focus events
     * @param {FocusEvent} event - The focus event
     */
    handleFocus(event) {
        if (event.target.classList.contains('ts-title')) {
            const entry = event.target.closest('.ts-entry');
            this.eventBus.emit('view:selectNode', { nodeId: entry.id });
        }
    }

    /**
     * Handle blur events
     * @param {FocusEvent} event - The blur event
     */
    handleBlur(event) {
        if (event.target.classList.contains('ts-title') && event.target.isContentEditable) {
            const entry = event.target.closest('.ts-entry');
            const nodeId = entry.id;
            const newTitle = event.target.textContent.trim();

            this.eventBus.emit('view:updateNode', { nodeId, properties: { title: newTitle } });

            event.target.contentEditable = false;
            this.editingId = null;
        }
    }

    /**
     * Handle global keydown events
     * @param {KeyboardEvent} event - The keydown event
     */
    handleGlobalKeyDown(event) {
        if (event.key === 'Escape' && this.editingId) {
            const editingTitle = document.getElementById(this.editingId)?.querySelector('.ts-title');
            if (editingTitle && editingTitle.isContentEditable) {
                editingTitle.blur();
                this.eventBus.emit('view:selectNode', { nodeId: this.editingId });
                this.editingId = null;
            }
        }
    }

    /**
     * Get the ID of the node currently being edited
     * @returns {string|null} The ID of the node being edited, or null if no node is being edited
     */
    getEditingId() {
        return this.editingId;
    }
}

export default InlineEditor;