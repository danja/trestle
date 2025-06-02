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
      this.panel.style.opacity = '0';
      this.panel.style.transform = 'translateX(100%)';
      
      // Initialize tab states
      this.initializeTabs();
      
      // Set ARIA attributes
      this.panel.setAttribute('aria-labelledby', 'panel-title');
      this.panel.setAttribute('role', 'complementary');
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize child panels
      this.initializePanels();
      
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
      try {
        if (data && data.view) {
          this.logger.debug(`Toggling panel to show ${data.view} view`);
          this.toggle(data.view);
        } else {
          this.logger.debug('Toggling panel visibility');
          this.toggle();
        }
      } catch (error) {
        this.logger.error('Error handling rightpanel:toggle event:', error);
      }
    });
    
    // Log all events for debugging
    this.eventBus.on('*', (data, event) => {
      if (event && event.type && !event.type.startsWith('rightpanel:')) {
        this.logger.debug(`Received event: ${event.type}`, data);
      }
    });
  }

  /**
   * Initialize panel components
   */
  initializePanels() {
    try {
      // Make sure we're using elements within the right panel
      const panelContent = this.panel?.querySelector('.panel-content');
      
      if (!panelContent) {
        this.logger.error('Panel content container not found');
        return;
      }

      // Initialize console panel
      let consoleContent = panelContent.querySelector('#console-content');
      if (consoleContent) {
        this.consolePanel.initialize(consoleContent);
        this.consoleContent = consoleContent; // Update the reference
      } else {
        this.logger.warn('Console content element not found in panel');
      }

      // Initialize shortcuts panel
      let shortcutsContent = panelContent.querySelector('#shortcuts-content');
      if (shortcutsContent) {
        this.shortcutsPanel.initialize(shortcutsContent);
        this.shortcutsContent = shortcutsContent; // Update the reference
      } else {
        this.logger.warn('Shortcuts content element not found in panel');
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
    
    // Make sure the panel is visible
    this.panel.classList.remove('hidden');
    this.panel.style.opacity = '1';
    this.panel.style.transform = 'translateX(0)';
    
    // Show the specified view
    if (view) {
      this.showView(view);
    } else if (!this.currentView) {
      // Default to console if no view is specified and none is active
      this.showView('console');
    }
    
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
    
    // Hide the panel with a smooth transition
    this.panel.style.opacity = '0';
    this.panel.style.transform = 'translateX(100%)';
    
    // Wait for the transition to complete before hiding the panel completely
    const onTransitionEnd = () => {
      this.panel.removeEventListener('transitionend', onTransitionEnd);
      this.panel.classList.add('hidden');
      this.currentView = null; // Reset the current view
      this.eventBus.emit('rightpanel:hidden');
      this.logger.debug('Right panel hidden');
    };

    this.panel.addEventListener('transitionend', onTransitionEnd, { once: true });
    
    // Force reflow to ensure the transition is triggered
    void this.panel.offsetWidth;
  }

  /**
   * Toggle the panel visibility
   * @param {string} [view] - The view to show when toggling on
   */
  toggle(view) {
    this.logger.debug(`Toggling panel. Current view: ${this.currentView}, Requested view: ${view}`);
    
    // If we're already visible and the requested view is the same as current, hide the panel
    if (this.isVisible() && (!view || view === this.currentView)) {
      this.logger.debug('Hiding panel - already visible with same view');
      this.hide();
    } 
    // If we're visible but a different view is requested, just switch views
    else if (this.isVisible() && view && view !== this.currentView) {
      this.logger.debug(`Switching to view: ${view}`);
      this.showView(view);
    }
    // If we're not visible, show the panel with the requested view
    else {
      this.logger.debug(`Showing panel with view: ${view || 'default'}`);
      this.show(view || 'console');
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
    if (!this.panel) {
      this.logger.warn('Cannot show view: panel element not found');
      return;
    }
    
    this.logger.debug('Showing view:', view);
    
    // First, remove active class from all panels and buttons
    const allPanels = this.panel.querySelectorAll('.panel-section');
    const tabButtons = this.panel.querySelectorAll('.tab-button');
    
    this.logger.debug(`Found ${allPanels.length} panels and ${tabButtons.length} tab buttons`);
    
    allPanels.forEach(panel => {
      panel.classList.remove('active');
      this.logger.debug(`Removed active class from panel: ${panel.id}`);
    });
    
    tabButtons.forEach(button => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
      this.logger.debug(`Deactivated tab button: ${button.getAttribute('data-view')}`);
    });
    
    // Find and activate the selected tab and panel
    let foundActive = false;
    
    tabButtons.forEach(button => {
      const buttonView = button.getAttribute('data-view');
      this.logger.debug(`Checking tab button with view: ${buttonView}, looking for: ${view}`);
      
      if (buttonView === view) {
        // Activate the button
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        this.logger.debug(`Activated tab button: ${buttonView}`);
        
        // Activate the corresponding panel
        const panelId = button.getAttribute('aria-controls');
        const panel = panelId ? this.panel.querySelector(`#${panelId}`) : null;
        if (panel) {
          panel.classList.add('active');
          foundActive = true;
          this.logger.debug(`Activated panel: ${panelId}`);
          
          // Ensure the panel is visible
          if (panel.offsetParent === null) {
            this.logger.warn(`Panel ${panelId} is not visible in the DOM`);
          }
        } else {
          this.logger.warn(`Panel not found for id: ${panelId}`);
        }
      }
    });
    
    // If no panel was found, default to console
    if (!foundActive) {
      this.logger.warn(`No panel found for view: ${view}, defaulting to console`);
      const consolePanel = this.panel.querySelector('#console-content');
      if (consolePanel) {
        consolePanel.classList.add('active');
        this.logger.debug('Activated default console panel');
        
        const consoleButton = this.panel.querySelector('.tab-button[data-view="console"]');
        if (consoleButton) {
          consoleButton.classList.add('active');
          consoleButton.setAttribute('aria-selected', 'true');
          this.logger.debug('Activated console tab button');
        } else {
          this.logger.warn('Console tab button not found');
        }
        
        view = 'console';
      } else {
        this.logger.error('Default console panel not found');
      }
    }
    
    // Update the current view
    this.currentView = view;
    this.logger.debug(`Current view set to: ${this.currentView}`);
    
    // Update the panel title
    if (this.panelTitle) {
      this.panelTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
    }
    
    // Update notification badge if showing console
    if (view === 'console') {
      this.unreadCount = 0;
      this.updateNotificationBadge();
    }
    
    // Initialize notification badge if not exists
    if (this.consoleButton && !this.notificationBadge) {
      this.notificationBadge = document.createElement('span');
      this.notificationBadge.className = 'notification-badge hidden';
      this.consoleButton.appendChild(this.notificationBadge);
    }
    
    this.logger.debug(`View updated to: ${view}`);
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
   * Initialize the tab states
   */
  initializeTabs() {
    this.logger.debug('Initializing tab states');
    
    // First, remove active class from all panels and buttons
    const allPanels = this.panel.querySelectorAll('.panel-section');
    const tabButtons = this.panel.querySelectorAll('.tab-button');
    
    allPanels.forEach(panel => {
      panel.classList.remove('active');
    });
    
    tabButtons.forEach(button => {
      // Remove any existing click handlers to prevent duplicates
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add new click handler
      newButton.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        if (view) {
          this.showView(view);
        }
      });
    });
    
    // Show the default view (console) after a small delay to ensure DOM is ready
    setTimeout(() => {
      this.showView('console');
      this.logger.debug('Default view should be shown now');
    }, 50);
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
