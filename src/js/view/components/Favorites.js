/**
 * Favorites component
 * Handles the display and management of favorite/bookmarked items
 */
export class Favorites {
  /**
   * Create a new Favorites component
   * @param {HTMLElement} rootElement - The root element for the favorites button
   * @param {EventBus} eventBus - The event bus for communication
   * @param {Object} options - Configuration options
   * @param {string} [options.storageKey='trestle-favorites'] - Key for localStorage
   */
  constructor(rootElement, eventBus, { storageKey = 'trestle-favorites' } = {}) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.storageKey = storageKey;
    this.favorites = new Map();
    this.isPanelOpen = false;
    
    // Cache DOM elements
    this.favoritesButton = this.rootElement?.querySelector('#favoritesButton');
    this.favoritesPanel = null;
    
    if (!this.favoritesButton) {
      console.warn('Favorites button not found');
      return;
    }
    
    this.initialize();
  }

  /**
   * Initialize the favorites component
   */
  initialize() {
    // Create the favorites panel
    this.createFavoritesPanel();
    
    // Load favorites from storage
    this.loadFavorites();
    
    // Set up event listeners
    this.favoritesButton.addEventListener('click', this.togglePanel.bind(this));
    
    // Close panel when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    
    // Listen for favorite events
    this.eventBus.on('favorites:add', this.handleAddFavorite.bind(this));
    this.eventBus.on('favorites:remove', this.handleRemoveFavorite.bind(this));
    this.eventBus.on('favorites:toggle', this.handleToggleFavorite.bind(this));
    this.eventBus.on('favorites:update', this.handleUpdateFavorites.bind(this));
  }

  /**
   * Create the favorites panel
   */
  createFavoritesPanel() {
    this.favoritesPanel = document.createElement('div');
    this.favoritesPanel.className = 'favorites-panel hidden';
    this.favoritesPanel.innerHTML = `
      <div class="favorites-header">
        <h3>Favorites</h3>
        <button class="favorites-close" aria-label="Close">×</button>
      </div>
      <div class="favorites-list">
        <p class="no-favorites">No favorites yet</p>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(this.favoritesPanel);
    
    // Set up close button
    const closeButton = this.favoritesPanel.querySelector('.favorites-close');
    closeButton.addEventListener('click', () => this.closePanel());
  }

  /**
   * Toggle the favorites panel
   */
  togglePanel() {
    if (this.isPanelOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  /**
   * Open the favorites panel
   */
  openPanel() {
    if (!this.favoritesPanel) return;
    
    this.favoritesPanel.classList.remove('hidden');
    this.isPanelOpen = true;
    
    // Update the button state
    this.favoritesButton.classList.add('active');
    
    // Emit event
    this.eventBus.emit('favorites:panelOpened');
  }

  /**
   * Close the favorites panel
   */
  closePanel() {
    if (!this.favoritesPanel) return;
    
    this.favoritesPanel.classList.add('hidden');
    this.isPanelOpen = false;
    
    // Update the button state
    this.favoritesButton.classList.remove('active');
    
    // Emit event
    this.eventBus.emit('favorites:panelClosed');
  }

  /**
   * Handle clicks outside the panel
   * @param {MouseEvent} event - The click event
   */
  handleOutsideClick(event) {
    if (!this.isPanelOpen) return;
    
    const isClickInside = this.favoritesPanel.contains(event.target) || 
                         this.favoritesButton.contains(event.target);
    
    if (!isClickInside) {
      this.closePanel();
    }
  }

  /**
   * Load favorites from localStorage
   */
  loadFavorites() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const favorites = JSON.parse(stored);
        this.favorites = new Map(favorites);
        this.updateFavoritesList();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  /**
   * Save favorites to localStorage
   */
  saveFavorites() {
    try {
      const serialized = JSON.stringify(Array.from(this.favorites.entries()));
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  /**
   * Update the favorites list in the UI
   */
  updateFavoritesList() {
    if (!this.favoritesPanel) return;
    
    const favoritesList = this.favoritesPanel.querySelector('.favorites-list');
    if (!favoritesList) return;
    
    // Clear existing content
    favoritesList.innerHTML = '';
    
    if (this.favorites.size === 0) {
      const noFavorites = document.createElement('p');
      noFavorites.className = 'no-favorites';
      noFavorites.textContent = 'No favorites yet';
      favoritesList.appendChild(noFavorites);
      return;
    }
    
    // Create a list of favorites
    const list = document.createElement('ul');
    list.className = 'favorites-items';
    
    this.favorites.forEach((favorite, nodeId) => {
      const item = document.createElement('li');
      item.className = 'favorite-item';
      item.dataset.nodeId = nodeId;
      
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = favorite.title || `Node ${nodeId}`;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToFavorite(nodeId);
      });
      
      const removeButton = document.createElement('button');
      removeButton.className = 'favorite-remove';
      removeButton.textContent = '×';
      removeButton.setAttribute('aria-label', 'Remove from favorites');
      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeFavorite(nodeId);
      });
      
      item.appendChild(link);
      item.appendChild(removeButton);
      list.appendChild(item);
    });
    
    favoritesList.appendChild(list);
  }

  /**
   * Navigate to a favorited node
   * @param {string} nodeId - The ID of the node to navigate to
   */
  navigateToFavorite(nodeId) {
    this.eventBus.emit('view:navigateTo', { nodeId });
    this.closePanel();
  }

  /**
   * Add a favorite
   * @param {Object} data - The favorite data
   * @param {string} data.nodeId - The node ID
   * @param {string} data.title - The node title
   */
  addFavorite({ nodeId, title }) {
    if (!nodeId) return;
    
    this.favorites.set(nodeId, { 
      id: nodeId, 
      title: title || `Node ${nodeId}`,
      timestamp: Date.now()
    });
    
    this.saveFavorites();
    this.updateFavoritesList();
    this.updateButtonState(nodeId, true);
    
    // Emit event
    this.eventBus.emit('favorites:added', { nodeId });
  }

  /**
   * Remove a favorite
   * @param {string} nodeId - The node ID to remove
   */
  removeFavorite(nodeId) {
    if (!nodeId || !this.favorites.has(nodeId)) return;
    
    this.favorites.delete(nodeId);
    this.saveFavorites();
    this.updateFavoritesList();
    this.updateButtonState(nodeId, false);
    
    // Emit event
    this.eventBus.emit('favorites:removed', { nodeId });
  }

  /**
   * Toggle a favorite
   * @param {Object} data - The favorite data
   * @param {string} data.nodeId - The node ID
   * @param {string} [data.title] - The node title (required when adding)
   */
  toggleFavorite({ nodeId, title }) {
    if (!nodeId) return;
    
    if (this.favorites.has(nodeId)) {
      this.removeFavorite(nodeId);
    } else {
      this.addFavorite({ nodeId, title });
    }
  }

  /**
   * Update the favorite button state
   * @param {string} nodeId - The node ID
   * @param {boolean} isFavorite - Whether the node is a favorite
   */
  updateButtonState(nodeId, isFavorite) {
    if (!this.favoritesButton) return;
    
    if (isFavorite) {
      this.favoritesButton.classList.add('is-favorite');
      this.favoritesButton.setAttribute('aria-pressed', 'true');
    } else {
      this.favoritesButton.classList.remove('is-favorite');
      this.favoritesButton.setAttribute('aria-pressed', 'false');
    }
  }

  /**
   * Handle add favorite event
   * @param {Object} data - The favorite data
   */
  handleAddFavorite(data) {
    this.addFavorite(data);
  }

  /**
   * Handle remove favorite event
   * @param {Object} data - The favorite data
   */
  handleRemoveFavorite({ nodeId }) {
    this.removeFavorite(nodeId);
  }

  /**
   * Handle toggle favorite event
   * @param {Object} data - The favorite data
   */
  handleToggleFavorite(data) {
    this.toggleFavorite(data);
  }

  /**
   * Handle update favorites event
   * @param {Object} data - The favorites data
   */
  handleUpdateFavorites({ favorites }) {
    if (Array.isArray(favorites)) {
      this.favorites = new Map(favorites);
      this.saveFavorites();
      this.updateFavoritesList();
    }
  }
}

export default Favorites;
