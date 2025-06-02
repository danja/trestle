/**
 * RightPanel component
 * Handles the right panel that shows shortcuts and console output
 */
import log from 'loglevel';
export class RightPanel {
  /**
   * Create a new RightPanel
   * @param {EventBus} eventBus - The event bus for communication
   */
  /**
   * Check parent elements for any visibility issues
   * @param {HTMLElement} element - The element to check
   * @param {number} depth - Current depth in the DOM tree
   */
  checkParentVisibility(element, depth = 0) {
    if (!element || element === document.documentElement) return;
    
    const style = window.getComputedStyle(element);
    const visibilityIssues = [];
    
    if (style.display === 'none') visibilityIssues.push('display: none');
    if (style.visibility === 'hidden') visibilityIssues.push('visibility: hidden');
    if (style.opacity === '0') visibilityIssues.push('opacity: 0');
    if (style.overflow === 'hidden') visibilityIssues.push('overflow: hidden');
    
    if (visibilityIssues.length > 0) {
      console.warn(`[RightPanel] Visibility issue in parent (depth ${depth}):`, {
        element,
        tagName: element.tagName,
        id: element.id,
        class: element.className,
        issues: visibilityIssues.join(', ')
      });
    }
    
    // Check parent element
    this.checkParentVisibility(element.parentElement, depth + 1);
  }

  constructor(eventBus) {
    // Initialize logger
    this.logger = log.getLogger('RightPanel');
    this.logger.setLevel(log.levels.INFO); // Default level, can be changed with setLogLevel()
    
    this.logger.info('Initializing RightPanel');
    this.eventBus = eventBus;
    
    // Initialize resizing state
    this.isResizing = false;
    this.lastDownX = 0;
    this.startWidth = 400; // Default width
    
    // Get DOM elements
    this.panel = document.getElementById('right-panel');
    this.panelTitle = document.getElementById('panel-title');
    this.closeButton = document.getElementById('close-panel');
    this.clearConsoleButton = document.getElementById('clear-console');
    this.shortcutsContent = document.getElementById('shortcuts-content');
    this.consoleContent = document.getElementById('console-content');
    this.consoleOutput = document.getElementById('console-output');
    this.consoleEmptyState = this.consoleContent?.querySelector('.console-empty-state');
    this.currentView = null;
    this.unreadCount = 0;
    this.notificationBadge = null;
    this.consoleButton = document.getElementById('mobileConsoleButton');
    this.seen = new WeakSet(); // For tracking circular references
    
    // Check for parent visibility issues
    if (this.panel) {
      console.log('[RightPanel] Checking parent elements for visibility issues');
      this.checkParentVisibility(this.panel);
    } else {
      console.error('[RightPanel] Panel element not found in the DOM');
    }
    
    // Log element states and computed styles
    const logElement = (id, el) => {
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return {
        exists: !!el,
        id: el.id,
        classList: el.className,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        transform: style.transform,
        position: style.position,
        zIndex: style.zIndex
      };
    };

    console.log('[RightPanel] Elements:', {
      panel: logElement('right-panel', this.panel),
      panelTitle: logElement('panel-title', this.panelTitle),
      closeButton: logElement('close-panel', this.closeButton),
      clearConsoleButton: logElement('clear-console', this.clearConsoleButton),
      shortcutsContent: logElement('shortcuts-content', this.shortcutsContent),
      consoleContent: logElement('console-content', this.consoleContent),
      consoleOutput: logElement('console-output', this.consoleOutput),
      consoleButton: logElement('mobileConsoleButton', this.consoleButton)
    });
    
    // Log document state
    console.log('[RightPanel] Document state:', {
      readyState: document.readyState,
      bodyClass: document.body.className,
      panelInDOM: document.body.contains(this.panel)
    });
    
    // Create notification badge
    this.createNotificationBadge();
    
    // Initialize the panel
    this.initialize();
    
    // Set up resize handlers
    this.setupResizeHandlers();
    
    // Log that initialization is complete
    this.logger.info('[RightPanel] Initialization complete');
    
    // Add a temporary style to help debug
    const style = document.createElement('style');
    style.textContent = `
      #right-panel {
        transition: all 0.3s ease-in-out !important;
        will-change: transform, opacity !important;
      }
      #right-panel.debug-outline {
        outline: 2px solid red !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize the right panel
   */
  initialize() {
    console.log('[RightPanel] Initializing event listeners');
    
    try {
      // Set up event listeners for panel controls
      if (this.closeButton) {
        this.closeButton.addEventListener('click', () => {
          console.log('[RightPanel] Close button clicked');
          this.hide();
        });
      } else {
        console.warn('[RightPanel] Close button not found');
      }
      
      // Clear console button
      if (this.clearConsoleButton) {
        this.clearConsoleButton.addEventListener('click', (e) => {
          console.log('[RightPanel] Clear console button clicked');
          e.stopPropagation();
          this.clearConsole();
        });
      } else {
        console.warn('[RightPanel] Clear console button not found');
      }
      
      // Set up menu button click handlers with detailed event logging
      const shortcutsButton = document.getElementById('mobileShortcutsButton');
      const consoleButton = document.getElementById('mobileConsoleButton');
      
      if (shortcutsButton) {
        shortcutsButton.addEventListener('click', (e) => {
          console.group('[RightPanel] Shortcuts Button Click');
          console.log('Event target:', e.target);
          console.log('Current target:', e.currentTarget);
          console.log('Event phase:', e.eventPhase);
          console.log('Bubbles:', e.bubbles);
          console.log('Default prevented:', e.defaultPrevented);
          console.groupEnd();
          
          e.stopPropagation();
          this.show('shortcuts');
        }, true); // Use capture phase to catch event early
      } else {
        console.warn('[RightPanel] Shortcuts button not found');
      }
      
      if (consoleButton) {
        this.consoleButton = consoleButton;
        consoleButton.addEventListener('click', (e) => {
          console.group('[RightPanel] Console Button Click');
          console.log('Event target:', e.target);
          console.log('Current target:', e.currentTarget);
          console.log('Event phase:', e.eventPhase);
          console.log('Bubbles:', e.bubbles);
          console.log('Default prevented:', e.defaultPrevented);
          console.groupEnd();
          
          e.stopPropagation();
          e.preventDefault();
          this.show('console');
        }, true); // Use capture phase to catch event early
        
        // Add a second listener to check if event is being stopped
        consoleButton.addEventListener('click', (e) => {
          console.log('[RightPanel] Second console button listener - should not see this if propagation was stopped');
        });
      } else {
        console.warn('[RightPanel] Console button not found');
      }
      
      // Only close panel when clicking the close button or toggling the same view
      document.addEventListener('click', (event) => {
        if (!this.panel) {
          console.warn('[RightPanel] Panel element not found');
          return;
        }
        
        const isCloseButton = event.target.closest('#close-panel');
        const isConsoleButton = event.target.closest('#mobileConsoleButton');
        
        if (isCloseButton) {
          console.log('[RightPanel] Close button clicked, hiding panel');
          this.hide();
        } else if (isConsoleButton && this.currentView === 'console') {
          // Toggle console off if clicking the console button while console is open
          console.log('[RightPanel] Console button clicked while console is open, hiding panel');
          this.hide();
        }
      }, true); // Use capture phase to ensure we catch the event
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (event) => {
        // Close panel on escape
        if (event.key === 'Escape' && this.isVisible()) {
          console.log('[RightPanel] Escape key pressed, hiding panel');
          this.hide();
          return;
        }
        
        // Toggle console with Ctrl+Shift+C (Cmd+Shift+C on Mac)
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modifier = isMac ? event.metaKey : event.ctrlKey;
        
        if (modifier && event.shiftKey && event.key === 'C') {
          console.log('[RightPanel] Toggle console shortcut detected');
          event.preventDefault();
          if (this.currentView === 'console' && this.isVisible()) {
            this.hide();
          } else {
            this.show('console');
          }
        }
      });
      
      // Set up console event listeners
      this.setupConsoleListener();
      
      // Set up file link handlers for stack traces
      if (this.consoleOutput) {
        this.setupFileLinkHandlers();
      }
      
      // Log a welcome message with proper HTML escaping
      const welcomeMsg = 'Console ready. Use Ctrl+Shift+C (Cmd+Shift+C on Mac) to toggle this panel.';
      this.logToConsole(welcomeMsg, 'info');
      
      // Log any early errors that occurred before the console was ready
      if (window.earlyConsoleErrors) {
        window.earlyConsoleErrors.forEach(error => {
          if (error && error.message) {
            this.logToConsole(typeof error.message === 'string' ? error.message : String(error), 'error');
          }
        });
        window.earlyConsoleErrors = [];
      }
    } catch (error) {
      console.error('[RightPanel] Error during initialization:', error);
    }
    // All initialization code is now in the try-catch block above
  }

  /**
   * Show the panel with the specified view
   * @param {string} view - The view to show ('shortcuts' or 'console')
   */
  show(view) {
    console.group(`[RightPanel] show(${view})`);
    
    // Force check parent visibility on each show attempt
    if (this.panel) {
      this.checkParentVisibility(this.panel);
    }
    
    if (!this.panel) {
      console.error('Panel element not found in show()');
      console.groupEnd();
      return;
    }
    
    const wasVisible = this.isVisible();
    const wasConsoleView = this.currentView === 'console';
    
    console.log('Previous state:', { wasVisible, currentView: this.currentView });
    
    // If clicking the same button, toggle visibility
    if (this.currentView === view && wasVisible) {
      console.log('Toggling panel visibility');
      this.hide();
      console.groupEnd();
      return;
    }
    
    console.log(`Showing view: ${view}`);
    this.currentView = view;
    
    try {
      // Debug: Log initial state
      console.log('Initial panel state:', {
        display: this.panel.style.display,
        className: this.panel.className,
        computedStyle: {
          display: window.getComputedStyle(this.panel).display,
          visibility: window.getComputedStyle(this.panel).visibility,
          opacity: window.getComputedStyle(this.panel).opacity,
          transform: window.getComputedStyle(this.panel).transform
        }
      });
      
      // Force show the panel
      console.log('Forcing panel to be visible');
      this.panel.style.display = 'flex';
      this.panel.style.visibility = 'visible';
      this.panel.style.opacity = '1';
      this.panel.style.transform = 'translateX(0)';
      this.panel.classList.remove('hidden');
      this.panel.classList.add('debug-outline');
      
      // Update panel content based on the view
      if (view === 'shortcuts') {
        console.log('Showing shortcuts');
        if (this.panelTitle) this.panelTitle.textContent = 'Keyboard Shortcuts';
        if (this.shortcutsContent) this.shortcutsContent.classList.remove('hidden');
        if (this.consoleContent) this.consoleContent.classList.add('hidden');
      } else if (view === 'console') {
        console.log('Showing console');
        if (this.panelTitle) this.panelTitle.textContent = 'Console Output';
        if (this.shortcutsContent) this.shortcutsContent.classList.add('hidden');
        if (this.consoleContent) this.consoleContent.classList.remove('hidden');
        
        // Reset unread count when console is shown
        if (!wasConsoleView || !wasVisible) {
          console.log('Resetting unread count');
          this.unreadCount = 0;
          this.updateNotificationBadge();
        }
      }
      
      // Add visible class and update body state
      console.log('Adding visible class and panel-visible to body');
      this.panel.classList.add('visible');
      document.body.classList.add('panel-visible');
      
      // Force reflow to ensure transition works
      void this.panel.offsetWidth;
      
      // Focus the close button for better keyboard navigation
      if (this.closeButton) {
        this.closeButton.focus();
      }
      
      // Debug: Log final state
      console.log('Final panel state:', {
        display: this.panel.style.display,
        className: this.panel.className,
        computedStyle: {
          display: window.getComputedStyle(this.panel).display,
          visibility: window.getComputedStyle(this.panel).visibility,
          opacity: window.getComputedStyle(this.panel).opacity,
          transform: window.getComputedStyle(this.panel).transform
        },
        rect: this.panel.getBoundingClientRect()
      });
      
    } catch (error) {
      console.error('Error in show method:', error);
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Hide the panel
   */
  hide() {
    try {
      console.log('[RightPanel] Hiding panel');
      if (!this.panel) {
        console.warn('[RightPanel] Panel element not found in hide()');
        return;
      }
      
      // Remove visible class to trigger transition
      this.panel.classList.remove('visible');
      
      // Remove panel-visible class from body
      if (document.body) {
        document.body.classList.remove('panel-visible');
      }
      
      // After transition completes, hide the panel completely
      const onTransitionEnd = () => {
        if (this.panel && !this.panel.classList.contains('visible')) {
          this.panel.classList.add('hidden');
          this.panel.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      
      this.panel.addEventListener('transitionend', onTransitionEnd);
      
      // Fallback in case transitionend doesn't fire
      setTimeout(() => {
        if (this.panel && !this.panel.classList.contains('visible')) {
          this.panel.classList.add('hidden');
        }
      }, 350); // Slightly longer than the CSS transition
      
      this.currentView = null;
      
      console.log('[RightPanel] Panel hidden');
    } catch (error) {
      console.error('[RightPanel] Error in hide method:', error);
    }
  }

  /**
   * Check if the panel is currently visible
   * @returns {boolean} True if the panel is visible
   */
  isVisible() {
    return this.panel.classList.contains('visible');
  }

  /**
   * Set up a listener for console events
   */
  setupConsoleListener() {
    // Specific console events
    this.eventBus.on('console:log', (message) => {
      this.logToConsole(message, 'log');
    });
    
    this.eventBus.on('console:error', (message) => {
      this.logToConsole(message, 'error');
    });
    
    this.eventBus.on('console:warn', (message) => {
      this.logToConsole(message, 'warn');
    });
    
    this.eventBus.on('console:info', (message) => {
      this.logToConsole(message, 'info');
    });
    
    // Listen to specific Trestle events
    const trestleEvents = [
      'node:selected',
      'node:updated',
      'node:created',
      'node:deleted',
      'tree:updated',
      'breadcrumb:update',
      'search:results',
      'favorites:updated',
      'history:changed',
      'error'
    ];
    
    trestleEvents.forEach(eventName => {
      this.eventBus.on(eventName, (data) => {
        this.logTrestleEvent(eventName, data);
      });
    });
    
    // Listen to all events for debugging
    const originalEmit = this.eventBus.emit;
    const self = this;
    
    // Override the emit method to log all events with loglevel
    this.eventBus.emit = function(eventName, ...args) {
      // Call the original emit method
      const result = originalEmit.apply(this, [eventName, ...args]);
      
      // Don't log our own events to prevent infinite loops
      if (!eventName.startsWith('console:') && !trestleEvents.includes(eventName)) {
        // Use debug level for all events by default
        const message = `Event: ${eventName} ${args.length > 0 ? '\n' + self.safeStringify(args) : ''}`;
        self.logToConsole(message, 'debug');
      }
      
      return result;
    }.bind(this.eventBus);
  }
  
  /**
   * Log Trestle-specific events with custom formatting
   */
  /**
   * Handle Trestle-specific events with appropriate log levels
   * @param {string} eventName - The name of the event
   * @param {Object} data - The event data
   */
  logTrestleEvent(eventName, data) {
    let message = '';
    let logLevel = 'info'; // Default log level
    
    switch (eventName) {
      case 'node:selected':
        message = `Selected node: ${data?.id || 'unknown'}`;
        if (data?.title) message += ` (${data.title})`;
        logLevel = 'debug'; // Debug level for selection events
        break;
        
      case 'node:updated':
        message = `Updated node: ${data?.id || 'unknown'}`;
        if (data?.changes) {
          message += '\nChanges: ' + Object.entries(data.changes)
            .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
            .join(', ');
        }
        logLevel = 'info';
        break;
        
      case 'node:created':
        message = `Created node: ${data?.id || 'unknown'}`;
        if (data?.title) message += ` (${data.title})`;
        logLevel = 'info';
        break;
        
      case 'node:deleted':
        message = `Deleted node: ${data?.id || 'unknown'}`;
        if (data?.title) message += ` (${data.title})`;
        logLevel = 'warn'; // Warn level for deletion events
        break;
        
      case 'tree:updated':
        message = 'Tree structure updated';
        if (data?.nodeCount) message += ` (${data.nodeCount} nodes)`;
        logLevel = 'debug'; // Debug level for tree updates
        break;
        
      case 'breadcrumb:update':
        message = 'Breadcrumb updated';
        if (data?.path) message += `: ${data.path.map(n => n.title).join(' > ')}`;
        logLevel = 'debug'; // Debug level for breadcrumb updates
        break;
        
      case 'search:results':
        message = `Search returned ${data?.results?.length || 0} results`;
        if (data?.query) message += ` for "${data.query}"`;
        logLevel = 'debug'; // Debug level for search results
        break;
        
      case 'favorites:updated':
        message = `Favorites updated (${data?.count || 0} items)`;
        logLevel = 'debug'; // Debug level for favorites updates
        break;
        
      case 'history:changed':
        message = `Navigation history updated (${data?.position || 0}/${data?.length || 0})`;
        logLevel = 'debug'; // Debug level for history changes
        break;
        
      case 'error':
        message = `Error: ${data?.message || 'Unknown error'}`;
        if (data?.stack) message += `\n${data.stack}`;
        logLevel = 'error'; // Error level for errors
        break;
        
      default:
        message = `Event: ${eventName}`;
        if (data) message += '\n' + this.safeStringify(data);
        logLevel = 'debug'; // Debug level for unhandled events
    }
    
    // Log the message with the appropriate level
    this.logToConsole(message, logLevel);
  }
  
  /**
   * Set the logging level for the console
   * @param {string} level - The log level to set ('trace', 'debug', 'info', 'warn', 'error', 'silent')
   */
  setLogLevel(level) {
    const levelMap = {
      'trace': log.levels.TRACE,
      'debug': log.levels.DEBUG,
      'info': log.levels.INFO,
      'warn': log.levels.WARN,
      'error': log.levels.ERROR,
      'silent': log.levels.SILENT
    };
    
    const newLevel = levelMap[level.toLowerCase()];
    
    if (newLevel !== undefined) {
      this.logger.setLevel(newLevel);
      this.logToConsole(`Log level set to: ${level.toUpperCase()}`, 'info', true);
    } else {
      this.logger.warn(`Invalid log level: ${level}. Valid levels are: ${Object.keys(levelMap).join(', ')}`);
    }
    
    return this.logger.getLevel();
  }

  /**
   * Safely stringify data, handling circular references and errors
   */
  safeStringify(obj) {
    try {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
        }
        return value;
      }, 2);
    } catch (e) {
      try {
        return String(obj);
      } catch (e2) {
        return '[Unstringifiable]';
      }
    }
  }

  /**
   * Log a message to the console output
   * @param {string} message - The message to log
   * @param {string} type - The type of log ('log', 'error', 'warn', 'info')
   */
  /**
   * Apply syntax highlighting to JSON strings
   */
  syntaxHighlight(json) {
    if (!json) return '';
    
    // If it's not a string, convert it to a JSON string
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    
    // Add syntax highlighting
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
            match = match.replace(/"([^"]+)":/, '<span class="key">"$1"</span>:');
            return match;
          }
          cls = 'string';
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }
  
  /**
   * Make file paths in stack traces clickable
   */
  formatStacktrace(stack) {
    if (!stack) return '';
    
    // Match file paths like "at functionName (path/to/file.js:123:45)"
    return stack.replace(
      /\s+at\s+(.+?\s+)?\(?([^\n)]+):(\d+):(\d+)\)?/g, 
      (match, fn, path, line, col) => {
        const displayPath = path.replace(/^.*[\\\/]/, ''); // Show only filename
        return `\n    at ${fn || ''}<a href="#" class="file-link" data-path="${path}" data-line="${line}" data-col="${col}">${displayPath}:${line}:${col}</a>`;
      }
    );
  }
  
  /**
   * Handle clicks on file links in the console
   */
  setupFileLinkHandlers() {
    this.consoleOutput.addEventListener('click', (e) => {
      const link = e.target.closest('.file-link');
      if (!link) return;
      
      e.preventDefault();
      
      const path = link.dataset.path;
      const line = parseInt(link.dataset.line, 10);
      const col = parseInt(link.dataset.col, 10) || 1;
      
      // Emit an event to open the file in the editor
      this.eventBus.emit('editor:open', {
        filePath: path,
        line: line,
        column: col
      });
      
      // Focus the editor
      this.eventBus.emit('focus:editor');
    });
  }
  
  /**
   * Unescape HTML entities in a string
   * @param {string} str - The string to unescape
   * @returns {string} The unescaped string
   */
  unescapeHtml(escapedStr) {
    if (typeof escapedStr !== 'string') return escapedStr;
    
    const textarea = document.createElement('textarea');
    textarea.innerHTML = escapedStr;
    return textarea.textContent || textarea.innerText || '';
  }

  /**
   * Log a message to the console output with loglevel filtering
   * @param {string} message - The message to log
   * @param {string} type - The type of log ('log', 'error', 'warn', 'info', 'debug')
   * @param {boolean} [force=false] - If true, bypass log level filtering
   */
  logToConsole(message, type = 'log', force = false) {
    if (!this.consoleOutput) return;
    
    // Map log types to loglevel methods
    const logLevels = {
      'error': log.levels.ERROR,
      'warn': log.levels.WARN,
      'info': log.levels.INFO,
      'debug': log.levels.DEBUG,
      'trace': log.levels.TRACE,
      'log': log.levels.INFO
    };
    
    const currentLevel = this.logger.getLevel();
    const messageLevel = logLevels[type] || log.levels.INFO;
    
    // Skip if message level is below current log level and not forced
    if (!force && currentLevel > messageLevel) {
      return;
    }
    
    // Convert message to string if it's not already
    let messageStr;
    try {
      // First convert to string, handling objects and other types
      messageStr = typeof message === 'string' 
        ? message 
        : (message instanceof Error ? message.stack || message.message : JSON.stringify(message, null, 2));
      
      // Unescape any HTML entities in the message
      messageStr = this.unescapeHtml(messageStr);
      
    } catch (e) {
      messageStr = String(message);
    }
    
    // Log to browser console using the appropriate loglevel method
    // Use the raw message for the browser console to avoid double-escaping
    const rawMessage = message instanceof Error ? message : (typeof message === 'object' ? message : messageStr);
    
    if (type === 'error') {
      this.logger.error(rawMessage);
    } else if (type === 'warn') {
      this.logger.warn(rawMessage);
    } else if (type === 'info' || type === 'log') {
      this.logger.info(rawMessage);
    } else if (type === 'debug') {
      this.logger.debug(rawMessage);
    } else if (type === 'trace') {
      this.logger.trace(rawMessage);
    }
    
    // Format and display in the UI console
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `console-entry console-${type}`;
    
    try {
      let formattedMessage;
      this.seen = new WeakSet(); // Reset for each message
      
      if (message === undefined) {
        formattedMessage = '<span class="undefined">undefined</span>';
      } else if (message === null) {
        formattedMessage = '<span class="null">null</span>';
      } else if (message instanceof Error) {
        const stack = this.formatStacktrace(message.stack || '');
        // Ensure we properly escape the error message for HTML display
        const errorMessage = this.escapeHtml(this.unescapeHtml(message.message || 'Error'));
        formattedMessage = 
          `<span class="error">${errorMessage}</span>${stack ? '\n' + stack : ''}`;
      } else if (typeof message === 'object') {
        try {
          // First try to stringify with circular reference handling
          const jsonString = JSON.stringify(message, (key, value) => {
            // Handle circular references
            if (typeof value === 'object' && value !== null) {
              if (this.seen.has(value)) {
                return '[Circular]';
              }
              this.seen.add(value);
            }
            // Convert any HTML strings to plain text to prevent XSS
            if (typeof value === 'string') {
              return this.unescapeHtml(value);
            }
            return value;
          }, 2);
          
          // If successful, use the pretty-printed JSON
          formattedMessage = this.syntaxHighlight(jsonString);
        } catch (e) {
          // If stringify fails (e.g., due to circular refs), use a simpler representation
          formattedMessage = this.escapeHtml(String(message));
        } 
      } else if (typeof message === 'string') {
        // First unescape any HTML entities
        let processedMessage = this.unescapeHtml(message);
        
        // Format stack traces with clickable file links
        if (processedMessage.includes(' at ') && (processedMessage.includes('.js:') || processedMessage.includes('.html:'))) {
          formattedMessage = this.formatStacktrace(processedMessage);
        } else {
          // Escape HTML for safe display in the UI
          formattedMessage = this.escapeHtml(processedMessage).replace(/\n/g, '<br>');
        }
      } else if (typeof message === 'boolean') {
        formattedMessage = `<span class="boolean">${message}</span>`;
      } else if (typeof message === 'number') {
        formattedMessage = `<span class="number">${message}</span>`;
      } else {
        // For strings, escape HTML but preserve newlines
        formattedMessage = this.escapeHtml(String(message)).replace(/\n/g, '<br>');
      }
      
      // Don't escape formattedMessage again as it's already been escaped
      logEntry.innerHTML = `
        <span class="console-type">${type.toUpperCase()}</span>
        <span class="console-time">${timestamp}</span>
        <span class="console-message">${formattedMessage}</span>
      `;
      
      // Add to the console output
      this.consoleOutput.appendChild(logEntry);
      
      // Hide empty state if it's the first message
      if (this.consoleEmptyState && this.consoleOutput.children.length === 1) {
        this.consoleOutput.style.display = 'block';
        this.consoleEmptyState.style.display = 'none';
      }
      
      // Auto-scroll to bottom if we're at the bottom or close to it
      const { scrollTop, scrollHeight, clientHeight } = this.consoleOutput;
      const isScrolledToBottom = scrollHeight - (scrollTop + clientHeight) < 50;
      if (isScrolledToBottom) {
        this.consoleOutput.scrollTop = scrollHeight;
      }
      
      // If console panel is not active, show a notification
      if (this.currentView !== 'console') {
        this.showConsoleNotification();
      }
    } catch (error) {
      console.error('Error logging to console:', error);
    }
  }
  
  /**
   * Helper function to escape HTML in console messages
   * @param {string} unsafe - The string to escape
   * @returns {string} The escaped string
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>')  // Convert newlines to <br> for better formatting
      .replace(/\s/g, '&nbsp;'); // Replace spaces with non-breaking spaces
  }
  
  /**
   * Create and style the notification badge
   */
  createNotificationBadge() {
    if (this.consoleButton && !this.notificationBadge) {
      this.notificationBadge = document.createElement('span');
      this.notificationBadge.className = 'notification-badge hidden';
      this.consoleButton.appendChild(this.notificationBadge);
    }
  }

  /**
   * Update the notification badge with the current unread count
   */
  updateNotificationBadge() {
    if (!this.notificationBadge) return;
    
    if (this.unreadCount > 0) {
      this.notificationBadge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount.toString();
      this.notificationBadge.classList.remove('hidden');
    } else {
      this.notificationBadge.classList.add('hidden');
    }
  }

  /**
   * Show a notification that new console messages are available
   */
  showConsoleNotification() {
    if (this.currentView !== 'console') {
      this.unreadCount++;
      this.updateNotificationBadge();
    }
  }
  
  /**
   * Set up resize handlers for the panel
   */
  setupResizeHandlers() {
    if (!this.panel) return;

    const handleMouseDown = (e) => {
      // Only start resizing if clicking near the left edge
      const rect = this.panel.getBoundingClientRect();
      const handleWidth = 8; // Should match the width in CSS
      
      if (e.clientX >= rect.left - handleWidth && e.clientX <= rect.left + handleWidth) {
        this.isResizing = true;
        this.startWidth = rect.width;
        this.lastDownX = e.clientX;
        this.panel.classList.add('resizing');
        
        // Prevent text selection during resize
        document.body.style.userSelect = 'none';
        
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    const handleMouseMove = (e) => {
      if (!this.isResizing) return;
      
      const deltaX = this.lastDownX - e.clientX;
      const newWidth = this.startWidth + deltaX;
      
      // Enforce min and max width constraints
      if (newWidth >= 300 && newWidth <= 800) {
        this.panel.style.width = `${newWidth}px`;
      }
      
      e.preventDefault();
      e.stopPropagation();
    };
    
    const handleMouseUp = () => {
      if (this.isResizing) {
        this.isResizing = false;
        this.panel.classList.remove('resizing');
        document.body.style.userSelect = '';
      }
    };
    
    // Add event listeners
    this.panel.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Store cleanup function
    this.cleanupResizeHandlers = () => {
      this.panel.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }
  
  /**
   * Clean up event listeners when the panel is destroyed
   */
  destroy() {
    if (this.cleanupResizeHandlers) {
      this.cleanupResizeHandlers();
    }
  }
}

export default RightPanel;
