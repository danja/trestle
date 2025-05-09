/**
 * NodeSelector component
 * Manages node selection and keyboard navigation
 */
export class NodeSelector {
    /**
     * Create a new NodeSelector
     * @param {HTMLElement} rootElement - The root element containing the tree
     * @param {Map} nodeElements - Map of node ID to node element
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(rootElement, nodeElements, eventBus) {
        this.rootElement = rootElement;
        this.nodeElements = nodeElements;
        this.eventBus = eventBus;
        this.selectedNodeId = null;
        
        this.initialize();
    }

    /**
     * Initialize the node selector
     */
    initialize() {
        this.rootElement.addEventListener('click', this.handleClick.bind(this));
    }

    /**
     * Handle click on a node
     * @param {MouseEvent} event - The click event
     */
    handleClick(event) {
        const target = event.target;
        
        // Handle node selection
        if (target.classList.contains('ts-entry') || target.classList.contains('ts-title')) {
            const entry = target.classList.contains('ts-entry') ? target : target.closest('.ts-entry');
            this.selectNode(entry.id);
            event.stopPropagation();
        }
    }

    /**
     * Select a node
     * @param {string} nodeId - The ID of the node to select
     */
    selectNode(nodeId) {
        if (this.selectedNodeId) {
            const prevSelected = document.getElementById(this.selectedNodeId);
            if (prevSelected) {
                prevSelected.classList.remove('ts-selected');
            }
        }

        this.selectedNodeId = nodeId;
        const entry = document.getElementById(nodeId);
        if (entry) {
            entry.classList.add('ts-selected');
            entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Get the ID of the currently selected node
     * @returns {string|null} The ID of the selected node, or null if no node is selected
     */
    getSelectedNodeId() {
        return this.selectedNodeId;
    }

    /**
     * Navigate up in the tree
     * @param {string} currentNodeId - The ID of the current node
     */
    navigateUp(currentNodeId) {
        const currentLi = this.nodeElements.get(currentNodeId);
        if (!currentLi) return;

        let prevLi = currentLi.previousElementSibling;

        if (prevLi) {
            while (prevLi.classList.contains('ts-open') && prevLi.querySelector('ul')?.lastElementChild) {
                prevLi = prevLi.querySelector('ul').lastElementChild;
            }

            const prevId = prevLi.querySelector('.ts-entry').id;
            this.selectNode(prevId);
        } else {
            const parentLi = currentLi.parentElement.closest('li');
            if (parentLi) {
                const parentId = parentLi.querySelector('.ts-entry').id;
                this.selectNode(parentId);
            }
        }
    }

    /**
     * Navigate down in the tree
     * @param {string} currentNodeId - The ID of the current node
     */
    navigateDown(currentNodeId) {
        const currentLi = this.nodeElements.get(currentNodeId);
        if (!currentLi) return;

        if (currentLi.classList.contains('ts-open')) {
            const firstChild = currentLi.querySelector('ul > li');
            if (firstChild) {
                const childId = firstChild.querySelector('.ts-entry').id;
                this.selectNode(childId);
                return;
            }
        }

        let nextLi = currentLi.nextElementSibling;
        if (nextLi) {
            const nextId = nextLi.querySelector('.ts-entry').id;
            this.selectNode(nextId);
            return;
        }

        let parent = currentLi.parentElement.closest('li');
        while (parent) {
            const parentNext = parent.nextElementSibling;
            if (parentNext) {
                const nextId = parentNext.querySelector('.ts-entry').id;
                this.selectNode(nextId);
                return;
            }
            parent = parent.parentElement.closest('li');
        }
    }

    /**
     * Move the selected node up
     * @param {string} nodeId - The ID of the node to move
     */
    moveNodeUp(nodeId) {
        const nodeLi = this.nodeElements.get(nodeId);
        if (!nodeLi) return;

        const parent = nodeLi.parentElement;
        const prevLi = nodeLi.previousElementSibling;

        if (!prevLi) return;

        const parentNode = parent.closest('li');
        const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root';

        const children = Array.from(parent.children);
        const currentIndex = children.indexOf(nodeLi);
        const newIndex = currentIndex - 1;

        this.eventBus.emit('view:moveNode', {
            nodeId,
            newParentId: parentId,
            newIndex
        });

        parent.insertBefore(nodeLi, prevLi);
    }

    /**
     * Move the selected node down
     * @param {string} nodeId - The ID of the node to move
     */
    moveNodeDown(nodeId) {
        const nodeLi = this.nodeElements.get(nodeId);
        if (!nodeLi) return;

        const parent = nodeLi.parentElement;
        const nextLi = nodeLi.nextElementSibling;

        if (!nextLi) return;

        const parentNode = parent.closest('li');
        const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root';

        const children = Array.from(parent.children);
        const currentIndex = children.indexOf(nodeLi);
        const newIndex = currentIndex + 1;

        this.eventBus.emit('view:moveNode', {
            nodeId,
            newParentId: parentId,
            newIndex
        });

        if (nextLi.nextElementSibling) {
            parent.insertBefore(nodeLi, nextLi.nextElementSibling);
        } else {
            parent.appendChild(nodeLi);
        }
    }
}

export default NodeSelector;