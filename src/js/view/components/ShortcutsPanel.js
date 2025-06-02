import log from 'loglevel';

export default class ShortcutsPanel {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.logger = log.getLogger('ShortcutsPanel');
    this.container = null;
    this.shortcuts = [];

    // Bind methods
    this.initialize = this.initialize.bind(this);
    this.render = this.render.bind(this);
  }

  /**
   * Initialize the shortcuts panel
   * @param {HTMLElement} container - The container element for the shortcuts
   */
  initialize(container) {
    if (!container) {
      this.logger.error('Shortcuts container element not provided');
      return;
    }

    // The container should be the #shortcuts-content element
    this.container = container;
    this.loadShortcuts();
    this.setupEventListeners();
    this.render();

    this.logger.info('Shortcuts panel initialized');
  }

  /**
   * Load shortcuts (can be extended to load from config)
   */
  loadShortcuts() {
    // TODO: Load from config or API
    this.shortcuts = [
      { key: 'Ctrl+S', description: 'Save current file' },
      { key: 'Ctrl+F', description: 'Search' },
      { key: 'Ctrl+Z', description: 'Undo' },
      { key: 'Ctrl+Shift+Z', description: 'Redo' },
      { key: 'F5', description: 'Refresh' },
      { key: 'Escape', description: 'Close panel/dialog' },
    ];
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Listen for shortcuts update events
    this.eventBus.on('shortcuts:update', (shortcuts) => {
      if (Array.isArray(shortcuts)) {
        this.shortcuts = shortcuts;
        this.render();
      }
    });
  }

  /**
   * Render the shortcuts list
   */
  render() {
    if (!this.container) {
      this.logger.warn('Cannot render shortcuts: container not found');
      return;
    }

    try {
      // Clear existing content
      this.container.innerHTML = '';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'shortcuts-header';
      header.innerHTML = '<h3>Keyboard Shortcuts</h3>';
      
      // Create list container
      const list = document.createElement('div');
      list.className = 'shortcuts-list';
      
      // Add shortcut items
      this.shortcuts.forEach(shortcut => {
        const item = document.createElement('div');
        item.className = 'shortcut-item';
        
        const key = document.createElement('span');
        key.className = 'shortcut-key';
        key.textContent = this.escapeHtml(shortcut.key);
        
        const desc = document.createElement('span');
        desc.className = 'shortcut-description';
        desc.textContent = this.escapeHtml(shortcut.description);
        
        item.appendChild(key);
        item.appendChild(desc);
        list.appendChild(item);
      });
      
      // Add elements to container
      this.container.appendChild(header);
      this.container.appendChild(list);
      
    } catch (error) {
      this.logger.error('Error rendering shortcuts:', error);
    }
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    // Clean up any event listeners here
  }
}
