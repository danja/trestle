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

    // Expose instance globally for direct access
    window.rightPanel = this;

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
      this.panel.classList.add('right-panel', 'hidden');

      // Set basic styles
      this.panel.style.display = 'none'; // Start hidden
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

      // Set ARIA attributes
      this.panel.setAttribute('aria-labelledby', 'panel-title');
      this.panel.setAttribute('role', 'complementary');
      this.panel.setAttribute('aria-hidden', 'true');

      // Set up event listeners first
      this.setupEventListeners();

      // Initialize child panels
      this.initializePanels();

      // Initialize tab states after panels are set up
      this.initializeTabs();

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

    // Remove tab button event listeners: tabs are no longer shown

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
  show(view = 'console') {
    if (!this.panel) {
      this.logger.warn('Cannot show panel: panel element not found');
      return;
    }

    this.logger.debug(`Showing panel with view: ${view}`);

    // First make sure the panel is visible
    if (this.panel.classList.contains('hidden')) {
      this.panel.classList.remove('hidden');
      this.panel.style.display = 'flex';
      this.panel.style.opacity = '1';
      this.panel.style.transform = 'translateX(0)';
      this.panel.setAttribute('aria-hidden', 'false');
    }

    // Update the current view and show the requested view
    if (view) {
      this.currentView = view;
      this.showView(view);
    }

    // Add a small delay before focusing to ensure the panel is visible
    setTimeout(() => {
      const firstFocusable = this.panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 50);

    // Emit event that panel is shown
    this.eventBus.emit('rightpanel:shown', { view: this.currentView });
  }

  /**
   * Hide the panel
   */
  hide() {
    if (!this.panel) {
      this.logger.warn('Cannot hide: panel element not found');
      return;
    }

    this.logger.debug('Hiding right panel');

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // For mobile, just hide it directly
      this.panel.classList.add('hidden');
      this.panel.style.display = 'none';
      this.panel.style.opacity = '0';
      this.panel.style.visibility = 'hidden';
      this.panel.style.transform = 'none';
      this.currentView = null;
      document.body.classList.remove('right-panel-visible');
      this.eventBus.emit('rightpanel:hidden');
      this.logger.debug('Right panel hidden (mobile)');
    } else {
      // For desktop, use the slide animation
      this.panel.style.opacity = '0';
      this.panel.style.visibility = 'hidden';
      this.panel.style.transform = 'translateX(100%)';

      // Wait for the transition to complete before hiding the panel completely
      const onTransitionEnd = () => {
        this.panel.removeEventListener('transitionend', onTransitionEnd);
        this.panel.classList.add('hidden');
        this.panel.style.display = 'none';
        this.currentView = null;
        document.body.classList.remove('right-panel-visible');
        this.eventBus.emit('rightpanel:hidden');
        this.logger.debug('Right panel hidden (desktop)');
      };

      this.panel.addEventListener('transitionend', onTransitionEnd, { once: true });

      // Force reflow to ensure the transition is triggered
      void this.panel.offsetWidth;
    }
  }

  /**
   * Toggle the panel visibility
   * @param {string} [view] - The view to show when toggling on
   */
  toggle(view = 'console') {
    if (!this.panel) {
      this.logger.warn('Cannot toggle: panel element not found');
      return;
    }

    this.logger.debug(`Toggling panel. Current view: ${this.currentView}, Requested view: ${view}`);
    console.log(`RightPanel.toggle('${view}') called`);

    // Get current state
    const currentState = {
      classList: Array.from(this.panel.classList),
      style: {
        display: this.panel.style.display,
        opacity: this.panel.style.opacity,
        transform: this.panel.style.transform,
        visibility: this.panel.style.visibility
      },
      isVisible: this.isVisible(),
      hasHiddenClass: this.panel.classList.contains('hidden'),
      currentView: this.currentView
    };

    console.log('Panel state:', currentState);

    // If panel is hidden or not visible, always show it with the requested view
    if (currentState.hasHiddenClass || !currentState.isVisible) {
      this.logger.debug('Panel is hidden or not visible, showing with view:', view);
      this.show(view);
    }
    // If panel is showing a different view, switch to the requested view (do not hide)
    else if (view && this.currentView !== view) {
      this.logger.debug(`Switching from ${this.currentView} to ${view} view`);
      this.show(view);
    }
    // If panel is already showing the requested view, hide it
    else {
      this.logger.debug('Hiding panel');
      this.hide();
    }

    // Close mobile menu if open
    const menuBox = document.getElementById('menu-box');
    if (menuBox) {
      console.log('Hiding menu box');
      menuBox.classList.add('hidden');
    }

    // Force a reflow to ensure styles are applied
    void this.panel.offsetHeight;
  }

  /**
   * Check if the panel is currently visible
   * @returns {boolean} True if the panel is visible
   */
  isVisible() {
    if (!this.panel) {
      console.log('isVisible: No panel element');
      return false;
    }

    // Check if the panel is explicitly hidden via class or style
    const isHiddenByClass = this.panel.classList.contains('hidden');
    const isHiddenByStyle = this.panel.style.display === 'none' ||
      this.panel.style.opacity === '0' ||
      this.panel.style.visibility === 'hidden';

    // Check if the panel is in the viewport
    const rect = this.panel.getBoundingClientRect();
    const isInViewport = this.panel.offsetWidth > 0 &&
      this.panel.offsetHeight > 0 &&
      rect.right > 0;

    const isVisible = !isHiddenByClass && !isHiddenByStyle && isInViewport;

    console.log('isVisible check:', {
      isHiddenByClass,
      isHiddenByStyle: {
        display: this.panel.style.display,
        opacity: this.panel.style.opacity,
        visibility: this.panel.style.visibility
      },
      viewport: {
        offsetWidth: this.panel.offsetWidth,
        offsetHeight: this.panel.offsetHeight,
        rectRight: rect.right,
        rect: rect
      },
      isInViewport,
      finalResult: isVisible,
      classList: Array.from(this.panel.classList)
    });

    return isVisible;
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
    console.log(`showView('${view}') called`);

    // First, ensure the panel is visible
    console.log('Making panel visible');
    this.panel.classList.remove('hidden');
    this.panel.style.display = 'flex';
    this.panel.style.opacity = '1';
    this.panel.style.visibility = 'visible';
    this.panel.style.transform = 'translateX(0)';
    this.panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('right-panel-visible');

    // Force a reflow to ensure the panel is in the document flow
    void this.panel.offsetHeight;

    // Get all panels
    const allPanels = Array.from(this.panel.querySelectorAll('.panel-section'));
    this.logger.debug(`Found ${allPanels.length} panels`);
    // Hide all panels first
    allPanels.forEach((panel) => {
      panel.style.display = 'none';
      panel.style.opacity = '0';
      panel.style.visibility = 'hidden';
      panel.classList.remove('active');
    });

    // Show the requested panel
    const targetPanel = this.panel.querySelector(`#${view}-content`);
    if (targetPanel) {
      targetPanel.style.display = 'flex';
      targetPanel.style.opacity = '1';
      targetPanel.style.visibility = 'visible';
      targetPanel.classList.add('active');
    } else {
      console.warn(`Panel not found: ${view}-content`);
    }

    // Update the current view
    this.currentView = view;

    // Update the panel title
    if (this.panelTitle) {
      this.panelTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
    }

    // Ensure the panel is in the document flow
    this.panel.style.position = 'fixed';
    this.panel.style.top = '0';
    this.panel.style.right = '0';
    this.panel.style.bottom = '0';
    this.panel.style.width = '400px';
    this.panel.style.zIndex = '1000';

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
  /**
   * Show a notification for new console messages
   */
  showConsoleNotification() {
    if (this.currentView !== 'console') {
      this.unreadCount++;
      this.updateNotificationBadge();
    }
  }

  /**
   * Update the notification badge with the current unread count
   */
  updateNotificationBadge() {
    if (!this.notificationBadge) {
      this.notificationBadge = document.querySelector('.notification-badge');
    }

    if (this.notificationBadge) {
      if (this.unreadCount > 0) {
        this.notificationBadge.textContent = this.unreadCount;
        this.notificationBadge.classList.remove('hidden');
      } else {
        this.notificationBadge.textContent = '';
        this.notificationBadge.classList.add('hidden');
      }
    }
  }

  /**
   * Set up resize handlers for the panel
   */
  setupResizeHandlers() {
    if (!this.panel) return;

    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // Only left mouse button

      this.isResizing = true;
      this.lastDownX = e.clientX;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseMove = (e) => {
      if (!this.isResizing) return;

      const deltaX = this.lastDownX - e.clientX;
      this.lastDownX = e.clientX;

      const newWidth = this.panel.offsetWidth + deltaX;
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.7;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        this.panel.style.width = `${newWidth}px`;
      }

      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseUp = () => {
      if (!this.isResizing) return;

      this.isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Save the width for next time
      if (this.panel) {
        this.startWidth = this.panel.offsetWidth;
      }
    };

    // Add event listeners
    const resizeHandle = this.panel.querySelector('.resize-handle');
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleMouseDown);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Store cleanup function
    this.cleanupResizeHandlers = () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', handleMouseDown);
      }
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

    if (this.panel) {
      this.panel.removeEventListener('transitionend', this.onTransitionEnd);
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

    // First, hide all panels and deactivate all buttons
    const allPanels = this.panel.querySelectorAll('.panel-section');
    const tabButtons = this.panel.querySelectorAll('.tab-button');

    allPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.style.display = 'none';
      panel.style.opacity = '0';
      panel.style.visibility = 'hidden';
    });

    tabButtons.forEach(button => {
      // Remove any existing click handlers to prevent duplicates
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // Set initial state
      const view = newButton.getAttribute('data-view');
      const isActive = view === 'console'; // Only console is active by default

      if (isActive) {
        newButton.classList.add('active');
        newButton.setAttribute('aria-selected', 'true');
      } else {
        newButton.classList.remove('active');
        newButton.setAttribute('aria-selected', 'false');
      }

      // Add click handler
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const view = e.currentTarget.getAttribute('data-view');
        if (view) {
          this.toggleView(view);
        }
      });
    });

    // Initialize the console panel but don't show it yet
    const consolePanel = this.panel.querySelector('#console-content');
    if (consolePanel) {
      consolePanel.style.display = 'flex'; // Use flex to maintain layout
      consolePanel.style.visibility = 'visible';
      consolePanel.style.opacity = '1';
      consolePanel.classList.add('active');
    }

    // Hide the panel initially
    this.hide();
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
