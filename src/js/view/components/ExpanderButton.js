/**
 * ExpanderButton component
 * Handles the expand/collapse functionality for tree nodes
 */
export class ExpanderButton {
    /**
     * Create a new ExpanderButton
     * @param {HTMLElement} rootElement - The root element containing the tree
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(rootElement, eventBus) {
        this.rootElement = rootElement;
        this.eventBus = eventBus;
        
        this.initialize();
    }

    /**
     * Initialize the expander buttons
     */
    initialize() {
        this.rootElement.addEventListener('click', this.handleExpanderClick.bind(this));
    }

    /**
     * Handle click on an expander button
     * @param {MouseEvent} event - The click event
     */
    handleExpanderClick(event) {
        const target = event.target;
        
        if (target.classList.contains('ts-expander')) {
            const li = target.closest('li');
            this.toggleExpanded(li);
            event.stopPropagation();
        }
    }

    /**
     * Toggle the expanded state of a node
     * @param {HTMLElement} nodeElement - The node element to toggle
     */
    toggleExpanded(nodeElement) {
        if (!nodeElement) return;
        
        nodeElement.classList.toggle('ts-closed');
        nodeElement.classList.toggle('ts-open');
    }

    /**
     * Expand a node
     * @param {HTMLElement} nodeElement - The node element to expand
     */
    expand(nodeElement) {
        if (!nodeElement) return;
        
        nodeElement.classList.remove('ts-closed');
        nodeElement.classList.add('ts-open');
    }

    /**
     * Collapse a node
     * @param {HTMLElement} nodeElement - The node element to collapse
     */
    collapse(nodeElement) {
        if (!nodeElement) return;
        
        nodeElement.classList.add('ts-closed');
        nodeElement.classList.remove('ts-open');
    }

    /**
     * Check if a node is expanded
     * @param {HTMLElement} nodeElement - The node element to check
     * @returns {boolean} True if the node is expanded, false otherwise
     */
    isExpanded(nodeElement) {
        if (!nodeElement) return false;
        
        return nodeElement.classList.contains('ts-open');
    }

    /**
     * Expand all nodes
     */
    expandAll() {
        const closedNodes = this.rootElement.querySelectorAll('.ts-closed');
        closedNodes.forEach(node => {
            node.classList.remove('ts-closed');
            node.classList.add('ts-open');
        });
    }

    /**
     * Collapse all nodes
     */
    collapseAll() {
        const openNodes = this.rootElement.querySelectorAll('.ts-open');
        openNodes.forEach(node => {
            node.classList.add('ts-closed');
            node.classList.remove('ts-open');
        });
    }
}