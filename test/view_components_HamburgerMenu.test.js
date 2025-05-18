
import { HamburgerMenu } from '../src/js/view/components/HamburgerMenu.js';
import { EventBus } from 'evb';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('HamburgerMenu', () => {
  let hamburgerMenu;
  let mockElement;
  let eventBus;

  beforeEach(() => {
    // Reset the DOM before each test
    document.body.innerHTML = `
      <div id="test-root">
        <button id="hamburgerButton"></button>
        <div id="menu-box" class="hidden"></div>
      </div>
    `;
    
    eventBus = new EventBus();
    mockElement = document.getElementById('test-root');
    hamburgerMenu = new HamburgerMenu(mockElement, eventBus);
  });

  it('should be defined', () => {
    expect(HamburgerMenu).toBeDefined();
  });

  it('should initialize with menu hidden', () => {
    const menuBox = document.getElementById('menu-box');
    expect(menuBox.classList.contains('hidden')).toBe(true);
  });

  it('should toggle menu visibility when hamburger button is clicked', () => {
    const hamburgerButton = document.getElementById('hamburgerButton');
    const menuBox = document.getElementById('menu-box');
    
    // Initial state should be hidden
    expect(menuBox.classList.contains('hidden')).toBe(true);
    
    // First click should show the menu
    hamburgerButton.click();
    expect(menuBox.classList.contains('hidden')).toBe(false);
    
    // Second click should hide the menu
    hamburgerButton.click();
    expect(menuBox.classList.contains('hidden')).toBe(true);
  });

  it('should emit toggle-menu event when hamburger button is clicked', () => {
    const eventSpy = vi.spyOn(eventBus, 'emit');
    const hamburgerButton = document.getElementById('hamburgerButton');
    
    hamburgerButton.click();
    
    expect(eventSpy).toHaveBeenCalledWith('view:toggleMenu', {
      isOpen: true
    });
    
    // Clean up
    eventSpy.mockRestore();
  });
});
