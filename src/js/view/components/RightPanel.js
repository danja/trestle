/**
 * RightPanel component
 * Container for the right panel that manages different views (console, shortcuts, etc.)
 */
import log from 'loglevel';
import ConsolePanel from './ConsolePanel.js';
import ShortcutsPanel from './ShortcutsPanel.js';

export class RightPanel {
  /**
   * Create a new RightPanel
   * @param {EventBus} eventBus - The event bus for communication
   */
  constructor(eventBus) {
    // Initialize logger
    this.logger = log.getLogger('RightPanel');
    this.logger.setLevel(log.levels.DEBUG); // Set to DEBUG for more detailed logs
    this.eventBus = eventBus;
    
    this.logger.debug('RightPanel constructor called');

    // Panel state
    this.isResizing = false;
    this.lastDownX = 0;
    this.startWidth = 400; // Default width
    this.currentView = null;
    this.unreadCount = 0;

    // Get DOM elements
    this.panel = document.getElementById('right-panel');
    this.panelTitle = document.getElementById('panel-title');
    this.closeButton = document.getElementById('close-panel');
    this.shortcutsContent = document.getElementById('shortcuts-content');
    this.consoleContent = document.getElementById('console-content');
    this.consoleButton = document.getElementById('mobileConsoleButton');
    this.notificationBadge = null;

    // Log element status
    this.logger.debug('DOM elements:', {
      panel: !!this.panel,
      panelTitle: !!this.panelTitle,
      closeButton: !!this.closeButton,
      shortcutsContent: !!this.shortcutsContent,
      consoleContent: !!this.consoleContent,
      consoleButton: !!this.consoleButton
    });

    try {
      // Initialize panels
      this.consolePanel = new ConsolePanel(eventBus);
      this.shortcutsPanel = new ShortcutsPanel(eventBus);
      this.logger.debug('Child panels initialized');

      // Initialize the panel
      this.initialize();

      // Set up resize handlers
      this.setupResizeHandlers();

      this.logger.info('RightPanel initialized');
    } catch (error) {
      this.logger.error('Error during RightPanel initialization:', error);
      throw error;
    }
  }

  /**
   * Initialize the right panel
   */
  initialize() {
    this.logger.info('Initializing RightPanel');

    try {
      if (!this.panel) {
        this.logger.error('Right panel element not found in the DOM');
        return;
      }

      // Remove any conflicting classes and reset styles
      this.panel.className = ''; // Clear all classes
      this.panel.id = 'right-panel'; // Ensure ID is set
      this.panel.style.cssText = ''; // Reset all inline styles
      
      // Add base classes
      this.panel.classList.add('right-panel');
      
      // Set basic styles
      this.panel.style.display = 'flex';
      this.panel.style.flexDirection = 'column';
      this.panel.style.position = 'fixed';
      this.panel.style.top = '0';
      this.panel.style.right = '0';
      this.panel.style.bottom = '0';
      this.panel.style.width = '400px';
      this.panel.style.backgroundColor = '#2d2d2d';
      this.panel.style.color = '#f0f0f0';
      this.panel.style.boxShadow = '-2px 0 10px rgba(0, 0, 0, 0.3)';
      this.panel.style.zIndex = '1000';
      this.panel.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
      this.panel.style.opacity = '1';
      this.panel.style.transform = 'translateX(0)';
      
      // Set ARIA attributes
      this.panel.setAttribute('aria-labelledby', 'panel-title');
      this.panel.setAttribute('role', 'complementary');
      this.panel.setAttribute('aria-hidden', 'false');

      // Add debug outline to help with visibility
      this.panel.classList.add('debug-outline');

      // Set up event listeners
      this.setupEventListeners();

      // Initialize panels but keep them hidden
      this.initializePanels();
      
      // Set default view to console but don't show it yet
      this.showView('console');
      
      // Ensure panel is hidden initially
      this.hide();
      
      this.logger.info('RightPanel initialization complete');
    } catch (error) {
      this.logger.error('Error initializing RightPanel:', error);
      throw error; // Re-throw to prevent silent failures
    }
  }

  /**
   * Toggle between console and shortcuts views
   * @param {string} [view] - The view to show ('console' or 'shortcuts'). If not provided, toggles between views.
   */
  toggleView(view) {
    if (!view) {
      // If no view specified, toggle between console and shortcuts
      view = this.currentView === 'console' ? 'shortcuts' : 'console';
    }
    
    this.showView(view);
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      const isActive = button.getAttribute('data-view') === view;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive.toString());
    });
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Set up console button click handler
    if (this.consoleButton) {
      this.consoleButton.addEventListener('click', () => {
        this.toggleView('console');
      });
    }

    // Set up tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const view = button.getAttribute('data-view');
        this.toggleView(view);
      });
    });

    // Set up close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.hide();
      });
    }

    // Set up keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
        e.preventDefault();
      }
    });

    // Listen for new console messages to update notification badge
    this.eventBus.on('console:new-message', () => {
      if (this.currentView !== 'console') {
        this.unreadCount++;
        this.updateNotificationBadge();
      }
    });

    // Listen for console cleared event
    this.eventBus.on('console:cleared', () => {
      this.unreadCount = 0;
      this.updateNotificationBadge();
    });

    // Listen for toggle events from the menu
    this.eventBus.on('rightpanel:toggle', (data) => {
      this.logger.debug('Received rightpanel:toggle event with data:', data);
      if (data && data.view) {
        this.toggle(data.view);
      } else {
        this.toggle();
      }
    });
  }

  /**
   * Initialize panel components
   */
  initializePanels() {
    try {
      // Initialize console panel
      if (this.consoleContent) {
        this.consolePanel.initialize(this.consoleContent);
      } else {
        this.logger.warn('Console content element not found');
      }

      // Initialize shortcuts panel
      if (this.shortcutsContent) {
        this.shortcutsPanel.initialize(this.shortcutsContent);
      } else {
        this.logger.warn('Shortcuts content element not found');
      }

      this.logger.info('Panels initialized');
    } catch (error) {
      this.logger.error('Error initializing panels:', error);
    }
  }

  /**
   * Show the panel with the specified view
   * @param {string} view - The view to show ('shortcuts' or 'console')
   */
  show(view) {
    if (!this.panel) {
      this.logger.warn('Cannot show panel: panel element not found');
      return;
    }

    this.logger.debug('Showing right panel with view:', view || 'console');
    
    // Update the view if specified
    if (view) {
      this.showView(view);
    } else if (!this.currentView) {
      // Default to console if no view is set
      this.showView('console');
    }

    // Update visibility classes
    this.panel.classList.remove('hidden');
    this.panel.classList.add('visible');
    this.panel.setAttribute('aria-hidden', 'false');

    // Emit event
    this.eventBus.emit('rightpanel:shown', { view: this.currentView });
    this.logger.debug('Right panel shown');
  }

  /**
   * Hide the panel
   */
  hide() {
    if (!this.panel) {
      this.logger.warn('Cannot hide panel: panel element not found');
      return;
    }

    this.logger.debug('Hiding right panel');
    
    // Update visibility classes
    this.panel.classList.remove('visible');
    this.panel.classList.add('hidden');
    this.panel.setAttribute('aria-hidden', 'true');

    // Emit event after the transition completes
    const onTransitionEnd = () => {
      this.panel.removeEventListener('transitionend', onTransitionEnd);
      this.eventBus.emit('rightpanel:hidden');
      this.logger.debug('Right panel hidden');
    };

    this.panel.addEventListener('transitionend', onTransitionEnd);
    
    // Force reflow to ensure the transition is triggered
    void this.panel.offsetWidth;
  }

  /**
   * Toggle the panel visibility
   * @param {string} [view] - The view to show when toggling on
   */
  toggle(view) {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show(view);
    }
  }

  /**
   * Check if the panel is currently visible
   * @returns {boolean} True if the panel is visible
   */
  isVisible() {
    return this.panel && !this.panel.classList.contains('hidden');
  }

  /**
   * Clear the console
   */
  clearConsole() {
    this.eventBus.emit('console:clear');
  }

  /**
   * Show a specific view in the panel
   * @param {string} view - The view to show ('console' or 'shortcuts')
   */
  showView(view) {
    if (!this.panel) return;

    // Hide all views
    if (this.shortcutsContent) this.shortcutsContent.style.display = 'none';
    if (this.consoleContent) this.consoleContent.style.display = 'none';

    // Show the selected view
    switch (view) {
      case 'shortcuts':
        if (this.shortcutsContent) {
          this.shortcutsContent.style.display = 'block';
          this.panelTitle.textContent = 'Shortcuts';
          this.currentView = 'shortcuts';
        }
        break;

      case 'console':
      default:
        if (this.consoleContent) {
          this.consoleContent.style.display = 'block';
          this.panelTitle.textContent = 'Console';
          this.currentView = 'console';
          this.unreadCount = 0;
          this.updateNotificationBadge();
        }
        break;
    }
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
      if (this.panel) {
        this.panel.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }

  /**
   * Clean up event listeners when the panel is destroyed
   */
  destroy() {
    if (typeof this.cleanupResizeHandlers === 'function') {
      this.cleanupResizeHandlers();
    }

    // Clean up panel references
    if (this.consolePanel && typeof this.consolePanel.destroy === 'function') {
      this.consolePanel.destroy();
    }

    if (this.shortcutsPanel && typeof this.shortcutsPanel.destroy === 'function') {
      this.shortcutsPanel.destroy();
    }

    // Remove DOM references
    this.panel = null;
    this.panelTitle = null;
    this.closeButton = null;
    this.shortcutsContent = null;
    this.consoleContent = null;
    this.consoleButton = null;
    this.notificationBadge = null;

    // Remove event bus reference
    this.eventBus = null;
  }
}

export default RightPanel;
