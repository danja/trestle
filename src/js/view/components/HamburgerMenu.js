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
    
    // Cache DOM elements globally
    this.hamburgerButton = document.querySelector('#hamburgerButton');
    this.menuBox = document.querySelector('#menu-box');
    
    console.log('[HamburgerMenu] constructor:', {
      rootElement,
      rootElementHTML: rootElement ? rootElement.outerHTML : null,
      hamburgerButton: this.hamburgerButton,
      menuBox: this.menuBox,
      readyState: document.readyState
    });
    
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
    console.log('[HamburgerMenu] initialize: attaching click event');
    this.hamburgerButton.addEventListener('click', this.toggleMenu.bind(this));
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      // Don't do anything if the click is inside the right panel
      const rightPanel = document.getElementById('right-panel');
      if (rightPanel && rightPanel.contains(event.target)) {
        console.log('[HamburgerMenu] Click inside right panel, ignoring');
        return;
      }
      
      if (this.isOpen && 
          !this.menuBox.contains(event.target) && 
          !this.hamburgerButton.contains(event.target)) {
        console.log('[HamburgerMenu] Click outside menu, closing');
        this.closeMenu();
      }
    }, true); // Use capture phase to catch event early
    
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
    console.log('[HamburgerMenu] toggleMenu called, isOpen:', this.isOpen);
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
    console.log('[HamburgerMenu] openMenu');
    this.isOpen = true;
    this.menuBox.classList.remove('hidden');
    this.hamburgerButton.setAttribute('aria-expanded', 'true');
    this.eventBus.emit('view:toggleMenu', { isOpen: true });
  }

  /**
   * Close the menu
   */
  closeMenu() {
    console.log('[HamburgerMenu] closeMenu');
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
