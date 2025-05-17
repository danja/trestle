/**
 * NavigationControls component
 * Handles back/forward navigation and home button functionality
 */
export class NavigationControls {
  /**
   * Create a new NavigationControls
   * @param {HTMLElement} rootElement - The root element containing the navigation controls
   * @param {EventBus} eventBus - The event bus for communication
   * @param {Object} options - Configuration options
   * @param {number} [options.maxHistory=50] - Maximum number of history entries to keep
   */
  constructor(rootElement, eventBus, { maxHistory = 50 } = {}) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.maxHistory = maxHistory;
    
    // History tracking
    this.history = [];
    this.currentIndex = -1;
    
    // Cache DOM elements
    this.backButton = this.rootElement.querySelector('#backButton');
    this.forwardButton = this.rootElement.querySelector('#forwardButton');
    this.homeButton = this.rootElement.querySelector('#homeButton');
    
    if (!this.backButton || !this.forwardButton || !this.homeButton) {
      console.warn('Navigation control buttons not found');
      return;
    }
    
    this.initialize();
  }

  /**
   * Initialize the navigation controls
   */
  initialize() {
    // Set up event listeners
    this.backButton.addEventListener('click', this.handleBackClick.bind(this));
    this.forwardButton.addEventListener('click', this.handleForwardClick.bind(this));
    this.homeButton.addEventListener('click', this.handleHomeClick.bind(this));
    
    // Initial state
    this.updateButtonStates();
    
    // Listen for navigation events
    this.eventBus.on('navigate', this.handleNavigation.bind(this));
  }

  /**
   * Handle back button click
   */
  handleBackClick() {
    if (this.canGoBack()) {
      this.currentIndex--;
      this.updateButtonStates();
      this.eventBus.emit('view:navigateBack', { nodeId: this.getCurrentNodeId() });
    }
  }

  /**
   * Handle forward button click
   */
  handleForwardClick() {
    if (this.canGoForward()) {
      this.currentIndex++;
      this.updateButtonStates();
      this.eventBus.emit('view:navigateForward', { nodeId: this.getCurrentNodeId() });
    }
  }

  /**
   * Handle home button click
   */
  handleHomeClick() {
    this.eventBus.emit('view:navigateHome');
    // Add root to history when navigating home
    this.navigateTo('root');
  }

  /**
   * Handle navigation events
   * @param {Object} data - Navigation data
   * @param {string} data.nodeId - The ID of the node being navigated to
   */
  handleNavigation({ nodeId }) {
    if (nodeId === this.getCurrentNodeId()) {
      return; // No change
    }
    
    this.navigateTo(nodeId);
  }

  /**
   * Navigate to a specific node
   * @param {string} nodeId - The ID of the node to navigate to
   */
  navigateTo(nodeId) {
    // Don't add the same node to history if it's the current one
    if (nodeId === this.getCurrentNodeId()) {
      return;
    }

    // If we're not at the end of the history, truncate the future history
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    // Add the new node to history
    this.history.push(nodeId);
    
    // Enforce maximum history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
    
    this.updateButtonStates();
    
    // Emit navigation event
    this.eventBus.emit('navigate', { nodeId });
  }

  /**
   * Update the enabled/disabled state of navigation buttons
   */
  updateButtonStates() {
    this.backButton.disabled = !this.canGoBack();
    this.forwardButton.disabled = !this.canGoForward();
    
    // Update ARIA attributes for accessibility
    this.backButton.setAttribute('aria-disabled', this.backButton.disabled);
    this.forwardButton.setAttribute('aria-disabled', this.forwardButton.disabled);
  }

  /**
   * Check if back navigation is possible
   * @returns {boolean} True if back navigation is possible
   */
  canGoBack() {
    return this.currentIndex > 0;
  }

  /**
   * Check if forward navigation is possible
   * @returns {boolean} True if forward navigation is possible
   */
  canGoForward() {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get the current node ID
   * @returns {string|null} The current node ID or null if no history
   */
  getCurrentNodeId() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * Clear the navigation history
   */
  clearHistory() {
    const currentNodeId = this.getCurrentNodeId();
    this.history = currentNodeId ? [currentNodeId] : [];
    this.currentIndex = this.history.length - 1;
    this.updateButtonStates();
  }
}

export default NavigationControls;
