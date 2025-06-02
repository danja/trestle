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

    this.container = container;
    this.loadShortcuts();
    this.render();
    this.setupEventListeners();

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
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="shortcuts-header">
        <h3>Keyboard Shortcuts</h3>
      </div>
      <div class="shortcuts-list">
        ${this.shortcuts.map(shortcut => `
          <div class="shortcut-item">
            <span class="shortcut-key">${this.escapeHtml(shortcut.key)}</span>
            <span class="shortcut-description">${this.escapeHtml(shortcut.description)}</span>
          </div>
        `).join('')}
      </div>
    `;
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
