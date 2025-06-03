import log from 'loglevel';

export default class ConsolePanel {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.logger = log.getLogger('ConsolePanel');
    this.consoleOutput = null;
    this.consoleEmptyState = null;
    this.unreadCount = 0;
    this.seen = new WeakSet();

    // Bind methods
    this.initialize = this.initialize.bind(this);
    this.logToConsole = this.logToConsole.bind(this);
    this.clear = this.clear.bind(this);
  }

  /**
   * Initialize the console panel
   * @param {HTMLElement} container - The container element for the console
   */
  initialize(container) {
    if (!container) {
      this.logger.error('Console container element not provided');
      return;
    }

    // The container should be the #console-content element
    this.container = container;
    this.consoleOutput = this.container.querySelector('.console-output');
    this.consoleEmptyState = this.container.querySelector('.console-empty-state');

    if (!this.consoleOutput) {
      this.logger.error('Console output element not found in container');
      return;
    }

    // Set up event listeners
    this.setupEventListeners();
    this.logger.info('Console panel initialized');
  }

  /**
   * Set up event listeners for console events
   */
  setupEventListeners() {
    // Listen for all console log events, including custom debug/info
    this.eventBus.on('node:added', (message) => {
      console.log('HERE');
      this.logToConsole(message);
      this.logToConsole(message, 'debug');
    });
    this.eventBus.on('console:debug', (message) => {
      this.logToConsole(message, 'debug');
    });
    this.eventBus.on('console:info', (message) => {
      this.logToConsole(message, 'info');
    });
    this.eventBus.on('console:warn', (message) => {
      this.logToConsole(message, 'warn');
    });
    this.eventBus.on('console:error', (message) => {
      this.logToConsole(message, 'error');
    });
    this.eventBus.on('console:log', (message) => {
      this.logToConsole(message, 'log');
    });

    // Listen for clear console events
    this.eventBus.on('console:clear', () => this.clear());
  }

  /**
   * Log a message to the console
   * @param {string|Object} message - The message to log
   * @param {string} type - The log level ('log', 'error', 'warn', 'info', 'debug')
   * @param {boolean} [force=false] - Whether to force logging regardless of log level
   * @returns {boolean} True if the message was logged successfully
   */
  logToConsole(message, type = 'log', force = false) {
    if (!this.consoleOutput) {
      console.error('Console output not initialized');
      return false;
    }

    try {
      // Convert message to string if it's an object
      if (typeof message !== 'string') {
        try {
          message = JSON.stringify(message, this.getCircularReplacer(), 2);
        } catch (e) {
          message = String(message);
        }
      }

      // Create log entry
      const logEntry = document.createElement('div');
      logEntry.className = `console-entry console-${type}`;

      const timestamp = new Date().toISOString().substring(11, 23);
      const formattedMessage = this.escapeHtml(message)
        .replace(/\n/g, '<br>')
        .replace(/\s/g, '&nbsp;');

      logEntry.innerHTML = `
        <span class="console-timestamp">${timestamp}</span>
        <span class="console-level">${type.toUpperCase()}</span>
        <span class="console-message">${formattedMessage}</span>
      `;

      this.consoleOutput.appendChild(logEntry);

      // Auto-scroll if near bottom
      if (this.isScrolledToBottom()) {
        this.scrollToBottom();
      }

      // Update unread count if console is not visible
      this.eventBus.emit('console:new-message');

      return true;
    } catch (error) {
      console.error('Error logging to console:', error);
      return false;
    }
  }

  /**
   * Clear the console
   */
  clear() {
    if (this.consoleOutput) {
      this.consoleOutput.innerHTML = '';
      this.unreadCount = 0;
      this.eventBus.emit('console:cleared');
    }
  }

  /**
   * Helper to handle circular references in objects
   */
  getCircularReplacer() {
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (this.seen.has(value)) {
          return '[Circular]';
        }
        this.seen.add(value);
      }
      return value;
    };
  }

  /**
   * Check if scrolled to bottom
   */
  isScrolledToBottom() {
    if (!this.consoleOutput) return true;
    const { scrollTop, scrollHeight, clientHeight } = this.consoleOutput;
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
  }

  /**
   * Scroll to bottom of console
   */
  scrollToBottom() {
    if (this.consoleOutput) {
      this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
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
