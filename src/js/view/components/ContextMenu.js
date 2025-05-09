/**
 * ContextMenu component
 * Handles context menu functionality for tree nodes
 */
export class ContextMenu {
    /**
     * Create a new ContextMenu
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.shortcutsPanel = document.getElementById('shortcuts-text');
        this.shortcutsButton = document.getElementById('shortcutsButton');
        this.mobileShortcutsButton = document.getElementById('mobileShortcutsButton');
        this.menuBox = document.getElementById('menu-box');
        this.hamburgerButton = document.getElementById('hamburgerButton');
        
        this.initialize();
    }

    /**
     * Initialize the context menu
     */
    initialize() {
        // Set up global click handler to close shortcuts panel when clicking outside
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        
        // Set up shortcuts buttons
        if (this.shortcutsButton) {
            this.shortcutsButton.addEventListener('click', this.toggleShortcutsPanel.bind(this));
        }
        
        if (this.mobileShortcutsButton) {
            this.mobileShortcutsButton.addEventListener('click', () => {
                this.toggleShortcutsPanel();
                if (this.menuBox) {
                    this.menuBox.classList.add('hidden');
                }
            });
        }
        
        // Set up mobile menu
        if (this.hamburgerButton && this.menuBox) {
            this.hamburgerButton.addEventListener('click', this.handleHamburgerClick.bind(this));
        }
    }

    /**
     * Toggle the shortcuts panel visibility
     */
    toggleShortcutsPanel() {
        if (this.shortcutsPanel) {
            this.shortcutsPanel.classList.toggle('hidden');
        }
    }

    /**
     * Handle hamburger button click
     * @param {MouseEvent} event - The click event
     */
    handleHamburgerClick(event) {
        this.menuBox.classList.toggle('hidden');
        event.stopPropagation();
    }

    /**
     * Handle document click - close menus when clicking outside
     * @param {MouseEvent} event - The click event
     */
    handleDocumentClick(event) {
        // Close shortcuts panel if clicked outside
        if (this.shortcutsPanel && 
            !this.shortcutsPanel.classList.contains('hidden') &&
            !this.shortcutsPanel.contains(event.target) &&
            event.target.id !== 'shortcutsButton' &&
            event.target.id !== 'mobileShortcutsButton') {
            this.shortcutsPanel.classList.add('hidden');
        }
        
        // Close mobile menu when clicking outside
        if (this.menuBox && 
            !this.menuBox.classList.contains('hidden') &&
            !this.menuBox.contains(event.target) &&
            event.target !== this.hamburgerButton) {
            this.menuBox.classList.add('hidden');
        }
    }

    /**
     * Add contextual buttons for adding nodes between existing nodes
     * @param {HTMLElement} rootElement - The root element containing the tree
     * @param {EventBus} eventBus - The event bus for communication
     */
    static addContextualAddButtons(rootElement, eventBus) {
        const dropzones = rootElement.querySelectorAll('.dropzone');

        dropzones.forEach(dropzone => {
            const addButton = document.createElement('div');
            addButton.className = 'ts-add-between';
            addButton.title = 'Add item here';

            addButton.addEventListener('click', (event) => {
                event.stopPropagation();

                const listItem = dropzone.closest('li');
                if (!listItem) return;

                const nodeId = listItem.dataset.nodeId;
                const parentElement = listItem.parentElement;
                const parentNode = parentElement.closest('li');
                const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root';

                const siblings = Array.from(parentElement.children);
                const index = siblings.indexOf(listItem);

                eventBus.emit('view:insertNodeAt', {
                    parentId,
                    index: index
                });
            });

            dropzone.appendChild(addButton);
        });
    }
}

export default ContextMenu;