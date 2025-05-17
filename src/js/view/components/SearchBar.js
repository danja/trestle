/**
 * SearchBar component
 * Handles search functionality and display of search results
 */
export class SearchBar {
  /**
   * Create a new SearchBar
   * @param {HTMLElement} rootElement - The root element containing the search bar
   * @param {EventBus} eventBus - The event bus for communication
   * @param {Object} options - Configuration options
   * @param {number} [options.debounceDelay=300] - Delay in ms before triggering search
   */
  constructor(rootElement, eventBus, { debounceDelay = 300 } = {}) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.debounceDelay = debounceDelay;
    this.searchTimeout = null;
    this.lastSearchTerm = '';
    
    // Cache DOM elements
    this.searchInput = this.rootElement?.querySelector('#searchInput');
    this.searchIcon = this.rootElement?.querySelector('.search-icon');
    
    if (!this.searchInput) {
      console.warn('Search input element not found');
      return;
    }
    
    this.initialize();
  }

  /**
   * Initialize the search bar
   */
  initialize() {
    // Set up event listeners
    this.searchInput.addEventListener('input', this.handleInput.bind(this));
    this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Click on search icon focuses the input
    if (this.searchIcon) {
      this.searchIcon.addEventListener('click', () => this.searchInput.focus());
    }
    
    // Listen for search results
    this.eventBus.on('search:results', this.handleSearchResults.bind(this));
    
    // Listen for clear search events
    this.eventBus.on('search:clear', this.clear.bind(this));
  }

  /**
   * Handle input events on the search field
   * @param {Event} event - The input event
   */
  handleInput(event) {
    const searchTerm = event.target.value.trim();
    
    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // If the search term is empty, clear immediately
    if (searchTerm === '') {
      this.clear();
      return;
    }
    
    // Only search if the term has changed
    if (searchTerm !== this.lastSearchTerm) {
      this.searchTimeout = setTimeout(() => {
        this.performSearch(searchTerm);
      }, this.debounceDelay);
    }
  }

  /**
   * Handle keydown events for special keys
   * @param {KeyboardEvent} event - The keydown event
   */
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.clear();
      this.searchInput.blur();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.performSearch(this.searchInput.value.trim());
    }
  }

  /**
   * Perform a search with the given term
   * @param {string} searchTerm - The term to search for
   */
  performSearch(searchTerm) {
    if (!searchTerm) {
      this.clear();
      return;
    }
    
    this.lastSearchTerm = searchTerm;
    
    // Emit search event
    this.eventBus.emit('view:search', { 
      query: searchTerm,
      timestamp: Date.now()
    });
  }

  /**
   * Handle search results
   * @param {Object} data - The search results data
   */
  handleSearchResults(data) {
    // This method can be extended to display search results
    // For now, we'll just log them
    console.log('Search results:', data);
  }

  /**
   * Clear the search
   */
  clear() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.lastSearchTerm = '';
    
    // Emit clear event
    this.eventBus.emit('view:clearSearch');
  }

  /**
   * Focus the search input
   */
  focus() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }

  /**
   * Set the search input value
   * @param {string} value - The value to set
   */
  setValue(value) {
    if (this.searchInput) {
      this.searchInput.value = value;
      this.lastSearchTerm = value;
    }
  }
}

export default SearchBar;
