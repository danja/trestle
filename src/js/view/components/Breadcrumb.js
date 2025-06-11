/**
 * Breadcrumb component
 * Simple navigation showing Home > Current Location
 */

export class Breadcrumb {
    /**
     * Create a new Breadcrumb
     * @param {HTMLElement} rootElement - The root element for the breadcrumb
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(rootElement, eventBus) {
        this.rootElement = rootElement;
        this.eventBus = eventBus;
        this.currentZoomNode = null; // The node we're zoomed into (null = root view)
        
        if (!this.rootElement) {
            console.warn('[Breadcrumb] Root element not found');
            return;
        }
        
        // Bind methods
        this.handleZoomChange = this.handleZoomChange.bind(this);
        this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);
        
        this.initialize();
    }

    /**
     * Initialize the breadcrumb
     */
    initialize() {
        // Listen for zoom level changes
        this.eventBus.on('view:zoomedIn', this.handleZoomChange);
        this.eventBus.on('view:zoomedOut', this.handleZoomChange);
        this.eventBus.on('view:navigatedHome', this.handleZoomChange);
        
        // Initial render (show just Home)
        this.render();
    }

    /**
     * Handle zoom level changes
     * @param {Object} data - Event data containing the new zoom node
     */
    handleZoomChange(data = {}) {
        const { nodeId, nodeTitle } = data;
        
        if (nodeId && nodeId !== 'root') {
            // We're zoomed into a specific node
            this.currentZoomNode = {
                id: nodeId,
                title: nodeTitle || 'Untitled'
            };
        } else {
            // We're at root level
            this.currentZoomNode = null;
        }
        
        this.render();
    }

    /**
     * Handle breadcrumb click
     * @param {string} nodeId - The node ID to navigate to ('root' for home)
     * @param {Event} event - The click event
     */
    handleBreadcrumbClick(nodeId, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (nodeId === 'root') {
            this.eventBus.emit('view:navigateHome');
        } else {
            this.eventBus.emit('view:navigateTo', { nodeId });
        }
    }

    /**
     * Create a breadcrumb item
     * @param {string} id - The node ID
     * @param {string} title - The display title
     * @param {boolean} isActive - Whether this is the current location
     * @returns {HTMLElement} The breadcrumb item
     */
    createBreadcrumbItem(id, title, isActive = false) {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        
        if (isActive) {
            li.setAttribute('aria-current', 'page');
            const span = document.createElement('span');
            span.textContent = title;
            span.className = 'breadcrumb-current';
            li.appendChild(span);
        } else {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = title;
            link.className = 'breadcrumb-link';
            link.addEventListener('click', (e) => this.handleBreadcrumbClick(id, e));
            li.appendChild(link);
        }
        
        return li;
    }

    /**
     * Create a separator element
     * @returns {HTMLElement} The separator
     */
    createSeparator() {
        const li = document.createElement('li');
        li.className = 'breadcrumb-separator';
        li.setAttribute('aria-hidden', 'true');
        li.textContent = '>';
        return li;
    }

    /**
     * Render the breadcrumb
     */
    render() {
        if (!this.rootElement) return;
        
        // Clear existing content
        this.rootElement.innerHTML = '';
        
        // Create container
        const ol = document.createElement('ol');
        ol.className = 'breadcrumb-list';
        
        // Always show Home first
        if (this.currentZoomNode) {
            // We're zoomed in - show Home as clickable link
            const homeItem = this.createBreadcrumbItem('root', 'Home', false);
            ol.appendChild(homeItem);
            
            // Add separator
            ol.appendChild(this.createSeparator());
            
            // Add current zoom node as active
            const currentItem = this.createBreadcrumbItem(
                this.currentZoomNode.id, 
                this.currentZoomNode.title, 
                true
            );
            ol.appendChild(currentItem);
        } else {
            // We're at root - show Home as active
            const homeItem = this.createBreadcrumbItem('root', 'Home', true);
            ol.appendChild(homeItem);
        }
        
        this.rootElement.appendChild(ol);
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        if (this.rootElement) {
            this.rootElement.innerHTML = '';
        }
        this.currentZoomNode = null;
    }
}

export default Breadcrumb;