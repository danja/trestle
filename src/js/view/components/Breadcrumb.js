/**
 * Breadcrumb component
 * Displays the current location in the hierarchy and allows navigation to parent nodes
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
    this.currentNode = null;
    this.lastRenderedPath = ''; // Track the last rendered path to prevent unnecessary re-renders
    this._updateCount = 0; // Track update count to detect infinite loops
    this._lastUpdateTime = Date.now();
    this._disabled = false; // Flag to completely disable the component if it's causing problems
    
    if (!this.rootElement) {
      console.warn('Breadcrumb root element not found');
      return;
    }
    
    // Bind methods to preserve 'this' context
    this.handleNodeUpdated = this.handleNodeUpdated.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);
    
    this.initialize();
  }

  /**
   * Initialize the breadcrumb
   */
  initialize() {
    try {
      // Clean up any existing listeners
      this.destroy();
      
      // Set up new event listeners and store unsubscribe functions
      this.unsubscribeNodeUpdated = this.eventBus.on('node:updated', this.handleNodeUpdated);
      this.unsubscribeNavigate = this.eventBus.on('navigate', this.handleNavigate);
      
      // Initial render with empty state
      this.render();
    } catch (error) {
      console.error('Error initializing breadcrumb:', error);
    }
  }

  /**
   * Safely get a string representation of the current path
   * @returns {string} A string representation of the current path
   */
  getPathString() {
  // Diagnostic logging to inspect the structure of currentNode.path
  try {
    if (this.currentNode && this.currentNode.path) {
      const path = this.currentNode.path;
      
      // Check if path is an empty object - this is likely causing the infinite loop
      if (typeof path === 'object' && !Array.isArray(path) && Object.keys(path).length === 0) {
        console.log('[Breadcrumb] currentNode.path is an empty object, returning empty string');
        return '';
      }
      
      let info = {
        type: Array.isArray(path) ? 'array' : typeof path,
        length: Array.isArray(path) ? path.length : undefined,
        preview: []
      };
      if (Array.isArray(path)) {
        for (let i = 0; i < Math.min(10, path.length); i++) {
          const item = path[i];
          if (item && typeof item === 'object') {
            info.preview.push({
              idx: i,
              type: item.constructor ? item.constructor.name : typeof item,
              id: item.id,
              title: item.title,
              selfRef: item === path
            });
          } else {
            info.preview.push({ idx: i, type: typeof item, value: item });
          }
        }
      }
      console.log('[Breadcrumb] currentNode.path shallow info:', info);
    }
  } catch (e) {
    console.error('[Breadcrumb] Error inspecting currentNode.path:', e);
  }
    try {
      if (!this.currentNode || !this.currentNode.path) return '';
      
      // Handle non-array paths
      if (!Array.isArray(this.currentNode.path)) {
        try {
          return String(this.currentNode.path);
        } catch (e) {
          return '';
        }
      }
      
      const seen = new WeakSet();
      const maxDepth = 10; // Prevent excessive recursion
      
      const getItemString = (item, depth = 0) => {
        try {
          // Prevent circular references and excessive depth
          if (depth > maxDepth || !item || typeof item !== 'object') {
            return '';
          }
          
          // Check for circular references
          if (seen.has(item)) {
            return '[Circular]';
          }
          
          // Add to seen set
          seen.add(item);
          
          // Handle different types of items
          if (typeof item.id === 'string' || typeof item.id === 'number') {
            const idStr = String(item.id);
            const titleStr = (item.title && typeof item.title === 'string') 
              ? item.title 
              : '';
            return `${idStr}${titleStr ? ':' + titleStr : ''}`;
          } else if (typeof item === 'string' || typeof item === 'number') {
            return String(item);
          }
          
          return '';
        } catch (e) {
          return '';
        }
      };
      
      // Process path items with a limit
      const maxItems = 100; // Prevent processing too many items
      const result = [];

      for (let i = 0; i < Math.min(this.currentNode.path.length, maxItems); i++) {
        const itemStr = getItemString(this.currentNode.path[i]);
        if (itemStr) {
          result.push(itemStr);
        }
      }
      
      return result.join('/');
    } catch (error) {
      console.error('Error getting path string:', error);
      return '';
    }
  }

  /**
   * Handle node updated event
   * @param {Object} data - The event data
   * @param {Object} data.node - The updated node
   */
  handleNodeUpdated({ node } = {}) {
    // If component is disabled due to detected infinite loop, do nothing
    if (this._disabled) {
      return;
    }
    
    // Detect potential infinite loop
    const now = Date.now();
    const timeSinceLastUpdate = now - this._lastUpdateTime;
    this._lastUpdateTime = now;
    
    // If updates are happening too frequently, disable the component
    if (timeSinceLastUpdate < 50) { // Less than 50ms between updates
      this._updateCount++;
      
      if (this._updateCount > 10) { // More than 10 rapid updates
        console.error('[Breadcrumb] Infinite loop detected! Disabling component to prevent browser freeze.');
        this._disabled = true;
        
        // Render a simple home-only breadcrumb
        if (this.rootElement) {
          this.rootElement.innerHTML = '';
          const homeItem = this.createHomeItem();
          if (homeItem) {
            this.rootElement.appendChild(homeItem);
          }
        }
        
        // Unsubscribe from events
        if (this.unsubscribeNodeUpdated) {
          this.unsubscribeNodeUpdated();
        }
        if (this.unsubscribeNavigate) {
          this.unsubscribeNavigate();
        }
        
        return;
      }
    } else {
      // Reset counter if updates aren't happening rapidly
      this._updateCount = 0;
    }
    
    if (this._updatingBreadcrumb) {
      console.warn('[Breadcrumb] Skipping handleNodeUpdated due to re-entrancy');
      return;
    }
    
    this._updatingBreadcrumb = true;
    try {
      if (!node) {
        console.warn('[Breadcrumb] handleNodeUpdated called with no node');
        this._updatingBreadcrumb = false;
        return;
      }
      
      // Strict validation of node structure
      if (!node || typeof node !== 'object') {
        console.warn('[Breadcrumb] Invalid node object');
        this._updatingBreadcrumb = false;
        return;
      }
      
      // Don't process nodes with empty object paths - this is likely causing the infinite loop
      if (node.path && typeof node.path === 'object' && !Array.isArray(node.path) && Object.keys(node.path).length === 0) {
        console.warn('[Breadcrumb] Node has empty object path, skipping update');
        this._updatingBreadcrumb = false;
        return;
      }
      
      // Only allow array paths or string paths
      const hasValidPath = node.path && (
        (Array.isArray(node.path) && node.path.length > 0) || 
        (typeof node.path === 'string' && node.path.length > 0)
      );
      
      if (!hasValidPath) {
        console.warn('[Breadcrumb] Node has invalid path, skipping update');
        this._updatingBreadcrumb = false;
        return;
      }
      
      // If we're getting the same node reference, be extra careful
      if (this.currentNode === node) {
        console.info('[Breadcrumb] Same node reference, skipping update');
        this._updatingBreadcrumb = false;
        return;
      }
      
      // Store current node and render
      this.currentNode = node;
      this.render();
    } catch (error) {
      console.error('[Breadcrumb] Error handling node update:', error);
    }
    this._updatingBreadcrumb = false;
  }

  /**
   * Handle navigation event
   * @param {Object} data - The navigation data
   * @param {Object} data.node - The node being navigated to
   */
  handleNavigate({ node } = {}) {
    try {
      if (!node) return;
      
      // Only update if the node is different
      if (this.currentNode === node) {
        const currentPath = this.getPathString();
        if (currentPath === this.lastRenderedPath) {
          return; // Skip if path hasn't changed
        }
      }
      
      this.currentNode = node;
      this.render();
    } catch (error) {
      console.error('Error handling navigation:', error);
    }
  }

  /**
   * Handle breadcrumb item click
   * @param {string} nodeId - The ID of the node to navigate to
   * @param {Event} event - The click event
   */
  handleBreadcrumbClick(nodeId, event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      if (nodeId) {
        this.eventBus.emit('view:navigateTo', { nodeId });
      }
    } catch (error) {
      console.error('Error handling breadcrumb click:', error);
    }
  }

  /**
   * Create a breadcrumb item
   * @param {Object} item - The breadcrumb item
   * @param {boolean} isLast - Whether this is the last item in the breadcrumb
   * @returns {HTMLElement|null} The created breadcrumb item or null if invalid
   */
  createBreadcrumbItem(item, isLast = false) {
    try {
      if (!item || typeof item !== 'object') return null;
      
      const li = document.createElement('li');
      li.className = 'breadcrumb-item';
      
      const title = (item.title && typeof item.title === 'string') ? item.title : 'Untitled';
      
      if (isLast) {
        li.setAttribute('aria-current', 'page');
        const span = document.createElement('span');
        span.textContent = title;
        li.appendChild(span);
      } else {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = title;
        link.addEventListener('click', (e) => this.handleBreadcrumbClick(item.id, e));
        li.appendChild(link);
      }
      
      return li;
    } catch (error) {
      console.error('Error creating breadcrumb item:', error);
      return null;
    }
  }

  /**
   * Create a home breadcrumb item
   * @returns {HTMLElement} The home breadcrumb item
   */
  createHomeItem() {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('aria-label', 'Home');
    link.addEventListener('click', (e) => this.handleBreadcrumbClick('root', e));
    
    // Add home icon (using inline SVG for simplicity)
    link.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
      </svg>
      <span class="visually-hidden">Home</span>
    `;
    
    li.appendChild(link);
    return li;
  }

  /**
   * Create a separator element
   * @returns {HTMLElement} The separator element
   */
  createSeparator() {
    const li = document.createElement('li');
    li.className = 'breadcrumb-separator';
    li.setAttribute('aria-hidden', 'true');
    li.textContent = '/';
    return li;
  }

  /**
   * Safely get path items from the current node
   * @returns {Array} Array of path items
   */
  getSafePathItems() {
    try {
      if (!this.currentNode || !this.currentNode.path) return [];
      
      // Handle non-array paths
      if (!Array.isArray(this.currentNode.path)) {
        return [];
      }
      
      const items = [];
      const seen = new WeakSet();
      
      // Process each item in the path
      for (const item of this.currentNode.path) {
        try {
          // Skip falsy or non-object items
          if (!item || typeof item !== 'object') continue;
          
          // Check for circular references
          if (seen.has(item)) continue;
          seen.add(item);
          
          // Create a safe copy
          items.push({
            id: (typeof item.id === 'string' || typeof item.id === 'number') ? String(item.id) : '',
            title: (typeof item.title === 'string') ? item.title : 'Untitled'
          });
          
          // Prevent infinite loops
          if (items.length > 50) break;
          
        } catch (error) {
          console.warn('Error processing path item:', error);
          continue;
        }
      }
      
      return items;
    } catch (error) {
      console.error('Error getting safe path items:', error);
      return [];
    }
  }

  /**
   * Render the breadcrumb
   */
  render() {
    // If component is disabled due to detected infinite loop, do nothing
    if (this._disabled) {
      return;
    }
    
    // Use a flag to prevent re-entrancy
    if (this._isRendering) {
      console.warn('[Breadcrumb] Prevented recursive render');
      return;
    }
    
    this._isRendering = true;
    
    try {
      // Clear existing content
      if (!this.rootElement) {
        this._isRendering = false;
        return;
      }
      
      // Always start with a clean slate
      this.rootElement.innerHTML = '';
      
      // Create a document fragment for better performance
      const fragment = document.createDocumentFragment();
      
      // Always add home item
      const homeItem = this.createHomeItem();
      if (homeItem) {
        fragment.appendChild(homeItem);
      }
      
      // If no node is set or node has invalid path, just show home
      if (!this.currentNode || !this.currentNode.path) {
        this.rootElement.appendChild(fragment);
        this.lastRenderedPath = '';
        this._isRendering = false;
        return;
      }
      
      // Only continue with array paths
      if (!Array.isArray(this.currentNode.path) || this.currentNode.path.length === 0) {
        this.rootElement.appendChild(fragment);
        this.lastRenderedPath = '';
        this._isRendering = false;
        return;
      }
      
      // Get safe path items with a limit
      const pathItems = this.getSafePathItems().slice(0, 5); // Limit to 5 items to be safe
      
      // Add each item in the path
      for (let i = 0; i < pathItems.length; i++) {
        try {
          const item = pathItems[i];
          if (!item || typeof item !== 'object') continue;
          
          const isLast = i === pathItems.length - 1;
          
          // Add separator
          const separator = this.createSeparator();
          if (separator) {
            fragment.appendChild(separator);
          }
          
          // Add breadcrumb item
          const breadcrumbItem = this.createBreadcrumbItem(item, isLast);
          if (breadcrumbItem) {
            fragment.appendChild(breadcrumbItem);
          }
        } catch (error) {
          console.warn('[Breadcrumb] Error rendering breadcrumb item:', error);
          continue;
        }
      }
      
      // Update the DOM
      this.rootElement.appendChild(fragment);
      
      // Update last rendered path
      this.lastRenderedPath = Array.isArray(this.currentNode.path) ? 'valid-path' : '';
      
      this._isRendering = false;
      return;
      
      // Update the last rendered path
      this.lastRenderedPath = currentPath;
      
      // Create a document fragment for better performance
      const fragment = document.createDocumentFragment();
      
      try {
        // Always add home item
        const homeItem = this.createHomeItem();
        if (homeItem) {
          fragment.appendChild(homeItem);
        }
        
        // Get safe path items with a limit
        const pathItems = this.getSafePathItems().slice(0, 20); // Limit to 20 items
        
        // Add each item in the path
        for (let i = 0; i < pathItems.length; i++) {
          try {
            const item = pathItems[i];
            if (!item || typeof item !== 'object') continue;
            
            const isLast = i === pathItems.length - 1;
            
            // Add separator (except before the first item)
            if (i >= 0) {
              const separator = this.createSeparator();
              if (separator) {
                fragment.appendChild(separator);
              }
            }
            
            // Add breadcrumb item
            const breadcrumbItem = this.createBreadcrumbItem(item, isLast);
            if (breadcrumbItem) {
              fragment.appendChild(breadcrumbItem);
            }
          } catch (error) {
            console.warn('Error rendering breadcrumb item:', error);
            continue;
          }
        }
        
        // Clear and update the DOM in one operation
        this.rootElement.innerHTML = '';
        this.rootElement.appendChild(fragment);
        
      } catch (error) {
        console.error('Error building breadcrumb fragment:', error);
        if (this.rootElement) {
          this.rootElement.innerHTML = '';
        }
      }
    } catch (error) {
      console.error('Error in breadcrumb render:', error);
      if (this.rootElement) {
        this.rootElement.innerHTML = '';
      }
    } finally {
      this._isRendering = false;
    }
  }
  
  /**
   * Clean up event listeners and references
   */
  destroy() {
    // Clean up event listeners using the stored unsubscribe functions
    if (this.unsubscribeNodeUpdated) {
      this.unsubscribeNodeUpdated();
      this.unsubscribeNodeUpdated = null;
    }
    
    if (this.unsubscribeNavigate) {
      this.unsubscribeNavigate();
      this.unsubscribeNavigate = null;
    }
    
    // Clear the root element
    if (this.rootElement) {
      this.rootElement.innerHTML = '';
    }
    
    // Clear references
    this.currentNode = null;
    this.lastRenderedPath = null;
  }
}

export default Breadcrumb;
