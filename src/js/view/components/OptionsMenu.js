/**
 * OptionsMenu component
 * Displays a dropdown menu with various application options
 */
export class OptionsMenu {
  /**
   * Create a new OptionsMenu
   * @param {HTMLElement} rootElement - The root element containing the options button
   * @param {EventBus} eventBus - The event bus for communication
   */
  constructor(rootElement, eventBus) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.isOpen = false;
    
    // Cache DOM elements
    this.optionsButton = this.rootElement?.querySelector('#optionsButton');
    this.optionsMenu = null;
    
    if (!this.optionsButton) {
      console.warn('Options button not found');
      return;
    }
    
    this.initialize();
  }

  /**
   * Initialize the options menu
   */
  initialize() {
    // Create the options menu
    this.createOptionsMenu();
    
    // Set up event listeners
    this.optionsButton.addEventListener('click', this.toggleMenu.bind(this));
    
    // Close menu when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    
    // Close menu on escape key
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Create the options menu
   */
  createOptionsMenu() {
    this.optionsMenu = document.createElement('div');
    this.optionsMenu.className = 'options-menu hidden';
    this.optionsMenu.setAttribute('role', 'menu');
    this.optionsMenu.setAttribute('aria-orientation', 'vertical');
    this.optionsMenu.setAttribute('aria-labelledby', 'optionsButton');
    
    // Menu items
    const menuItems = [
      { id: 'export', label: 'Export Data', icon: '📤' },
      { id: 'import', label: 'Import Data', icon: '📥' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: '⌨️' },
      { id: 'about', label: 'About Trestle', icon: 'ℹ️' }
    ];
    
    // Create menu items
    const menuList = document.createElement('ul');
    menuList.className = 'options-menu-list';
    
    menuItems.forEach(item => {
      const menuItem = document.createElement('li');
      menuItem.className = 'options-menu-item';
      menuItem.setAttribute('role', 'none');
      
      const button = document.createElement('button');
      button.className = 'options-menu-button';
      button.setAttribute('role', 'menuitem');
      button.setAttribute('tabindex', '-1');
      button.dataset.action = item.id;
      
      // Add icon if present
      if (item.icon) {
        const icon = document.createElement('span');
        icon.className = 'options-menu-icon';
        icon.textContent = item.icon;
        icon.setAttribute('aria-hidden', 'true');
        button.appendChild(icon);
      }
      
      // Add label
      const label = document.createElement('span');
      label.className = 'options-menu-label';
      label.textContent = item.label;
      button.appendChild(label);
      
      // Add event listener
      button.addEventListener('click', (e) => this.handleMenuItemClick(e, item.id));
      
      menuItem.appendChild(button);
      menuList.appendChild(menuItem);
    });
    
    this.optionsMenu.appendChild(menuList);
    
    // Add to DOM
    document.body.appendChild(this.optionsMenu);
    
    // Position the menu
    this.positionMenu();
    
    // Update position on window resize
    window.addEventListener('resize', this.positionMenu.bind(this));
  }

  /**
   * Position the options menu
   */
  positionMenu() {
    if (!this.optionsMenu || !this.optionsButton) return;
    
    const buttonRect = this.optionsButton.getBoundingClientRect();
    
    // Position below the button, aligned to the right
    this.optionsMenu.style.position = 'fixed';
    this.optionsMenu.style.top = `${buttonRect.bottom + window.scrollY}px`;
    this.optionsMenu.style.right = `${window.innerWidth - buttonRect.right}px`;
  }

  /**
   * Toggle the options menu
   */
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Open the options menu
   */
  openMenu() {
    if (!this.optionsMenu) return;
    
    this.optionsMenu.classList.remove('hidden');
    this.isOpen = true;
    this.optionsButton.setAttribute('aria-expanded', 'true');
    
    // Focus the first menu item
    const firstItem = this.optionsMenu.querySelector('.options-menu-button');
    if (firstItem) {
      firstItem.focus();
    }
    
    // Emit event
    this.eventBus.emit('options:menuOpened');
  }

  /**
   * Close the options menu
   */
  closeMenu() {
    if (!this.optionsMenu) return;
    
    this.optionsMenu.classList.add('hidden');
    this.isOpen = false;
    this.optionsButton.setAttribute('aria-expanded', 'false');
    
    // Return focus to the options button
    this.optionsButton.focus();
    
    // Emit event
    this.eventBus.emit('options:menuClosed');
  }

  /**
   * Handle clicks outside the menu
   * @param {MouseEvent} event - The click event
   */
  handleOutsideClick(event) {
    if (!this.isOpen) return;
    
    const isClickInside = this.optionsMenu.contains(event.target) || 
                         this.optionsButton.contains(event.target);
    
    if (!isClickInside) {
      this.closeMenu();
    }
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - The keydown event
   */
  handleKeyDown(event) {
    if (!this.isOpen) return;
    
    const menuItems = Array.from(this.optionsMenu.querySelectorAll('.options-menu-button'));
    if (!menuItems.length) return;
    
    const currentIndex = menuItems.indexOf(document.activeElement);
    let nextIndex = -1;
    
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeMenu();
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex]?.focus();
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        menuItems[nextIndex]?.focus();
        break;
        
      case 'Home':
        event.preventDefault();
        menuItems[0]?.focus();
        break;
        
      case 'End':
        event.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
    }
  }

  /**
   * Handle menu item click
   * @param {Event} event - The click event
   * @param {string} action - The action ID
   */
  handleMenuItemClick(event, action) {
    event.preventDefault();
    event.stopPropagation();
    
    // Close the menu
    this.closeMenu();
    
    // Emit the appropriate event based on the action
    switch (action) {
      case 'export':
        this.eventBus.emit('options:export');
        break;
        
      case 'import':
        this.eventBus.emit('options:import');
        break;
        
      case 'settings':
        this.eventBus.emit('options:settings');
        break;
        
      case 'shortcuts':
        this.eventBus.emit('options:shortcuts');
        break;
        
      case 'about':
        this.eventBus.emit('options:about');
        break;
    }
  }
}

export default OptionsMenu;
