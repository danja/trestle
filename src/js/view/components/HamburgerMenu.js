/**
 * HamburgerMenu component
 * Handles the toggle functionality for the mobile menu
 */
export class HamburgerMenu {
  /**
   * Create a new HamburgerMenu
   * @param {HTMLElement} rootElement - The root element containing the menu
   * @param {EventBus} eventBus - The event bus for communication
   */
  constructor(rootElement, eventBus) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.isOpen = false;
    
    // Cache DOM elements
    this.hamburgerButton = this.rootElement.querySelector('#hamburgerButton');
    this.menuBox = this.rootElement.querySelector('#menu-box');
    
    if (!this.hamburgerButton || !this.menuBox) {
      console.warn('Hamburger menu elements not found');
      return;
    }
    
    this.initialize();
  }

  /**
   * Initialize the hamburger menu
   */
  initialize() {
    this.hamburgerButton.addEventListener('click', this.toggleMenu.bind(this));
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (this.isOpen && 
          !this.menuBox.contains(event.target) && 
          !this.hamburgerButton.contains(event.target)) {
        this.closeMenu();
      }
    });
    
    // Listen for ESC key to close menu
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  /**
   * Toggle the menu visibility
   */
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Open the menu
   */
  openMenu() {
    this.isOpen = true;
    this.menuBox.classList.remove('hidden');
    this.hamburgerButton.setAttribute('aria-expanded', 'true');
    this.eventBus.emit('view:toggleMenu', { isOpen: true });
  }

  /**
   * Close the menu
   */
  closeMenu() {
    this.isOpen = false;
    this.menuBox.classList.add('hidden');
    this.hamburgerButton.setAttribute('aria-expanded', 'false');
    this.eventBus.emit('view:toggleMenu', { isOpen: false });
  }

  /**
   * Check if the menu is currently open
   * @returns {boolean} True if menu is open, false otherwise
   */
  isMenuOpen() {
    return this.isOpen;
  }
}

export default HamburgerMenu;
