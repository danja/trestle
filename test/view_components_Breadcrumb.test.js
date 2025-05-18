import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Breadcrumb } from '../src/js/view/components/Breadcrumb.js';
import { EventBus } from 'evb';

describe('Breadcrumb', () => {
  let breadcrumb;
  let mockElement;
  let eventBus;

  beforeEach(() => {
    // Reset the DOM before each test
    document.body.innerHTML = `
      <div id="test-root">
        <nav class="breadcrumb" aria-label="Breadcrumb"></nav>
      </div>
    `;
    
    eventBus = new EventBus();
    mockElement = document.querySelector('.breadcrumb');
    breadcrumb = new Breadcrumb(mockElement, eventBus);
  });

  it('should be defined', () => {
    expect(Breadcrumb).toBeDefined();
  });

  it('should initialize with empty breadcrumb', () => {
    expect(mockElement.children.length).toBe(0);
  });

  it('should update breadcrumb when receiving node update', () => {
    const node = {
      id: 'node1',
      title: 'Test Node',
      path: [
        { id: 'root', title: 'Home' },
        { id: 'node1', title: 'Test Node' }
      ]
    };
    
    eventBus.emit('node:updated', { node });
    
    // Should have 5 items: home icon, separator, root, separator, and current node
    expect(mockElement.children.length).toBe(5);
    
    // Check home icon (first item)
    const homeLi = mockElement.children[0];
    expect(homeLi.tagName).toBe('LI');
    expect(homeLi.className).toBe('breadcrumb-item');
    
    const homeLink = homeLi.querySelector('a');
    expect(homeLink).not.toBeNull();
    expect(homeLink.getAttribute('href')).toBe('#');
    expect(homeLink.querySelector('svg')).not.toBeNull();
    
    // Check first separator (second item)
    const firstSeparator = mockElement.children[1];
    expect(firstSeparator.tagName).toBe('LI');
    expect(firstSeparator.className).toBe('breadcrumb-separator');
    
    // Check root node (third item)
    const rootLi = mockElement.children[2];
    expect(rootLi.tagName).toBe('LI');
    expect(rootLi.className).toBe('breadcrumb-item');
    
    const rootLink = rootLi.querySelector('a');
    expect(rootLink).not.toBeNull();
    expect(rootLink.textContent).toBe('Home');
    
    // Check second separator (fourth item)
    const secondSeparator = mockElement.children[3];
    expect(secondSeparator.tagName).toBe('LI');
    expect(secondSeparator.className).toBe('breadcrumb-separator');
    
    // Check current node (fifth item, should be a span, not a link)
    const currentLi = mockElement.children[4];
    expect(currentLi.tagName).toBe('LI');
    expect(currentLi.className).toBe('breadcrumb-item');
    
    const current = currentLi.querySelector('span');
    expect(current).not.toBeNull();
    expect(current.textContent).toBe('Test Node');
  });

  it('should emit navigate event when breadcrumb item is clicked', () => {
    const node = {
      id: 'node1',
      title: 'Test Node',
      path: [
        { id: 'root', title: 'Home' },
        { id: 'node1', title: 'Test Node' }
      ]
    };
    
    eventBus.emit('node:updated', { node });
    
    const eventSpy = vi.spyOn(eventBus, 'emit');
    const homeLink = mockElement.querySelector('a');
    
    homeLink.click();
    
    expect(eventSpy).toHaveBeenCalledWith('view:navigateTo', { nodeId: 'root' });
    eventSpy.mockRestore();
  });

  it('should handle empty path', () => {
    const node = {
      id: 'root',
      title: 'Root',
      path: []
    };
    
    eventBus.emit('node:updated', { node });
    
    // Should only have home icon
    expect(mockElement.children.length).toBe(1);
    expect(mockElement.querySelector('svg')).not.toBeNull();
  });

  it('should update when receiving navigation event', () => {
    const node = {
      id: 'node1',
      title: 'Test Node',
      path: [
        { id: 'root', title: 'Home' },
        { id: 'node1', title: 'Test Node' }
      ]
    };
    
    // Simulate navigation to a node
    eventBus.emit('navigate', { node });
    
    // Should have 5 items: home, separator, root, separator, and current node
    expect(mockElement.children.length).toBe(5);
  });

  it('should add aria-current to current node', () => {
    const node = {
      id: 'node1',
      title: 'Test Node',
      path: [
        { id: 'root', title: 'Home' },
        { id: 'node1', title: 'Test Node' }
      ]
    };
    
    eventBus.emit('node:updated', { node });
    
    const currentItem = mockElement.lastElementChild;
    expect(currentItem.getAttribute('aria-current')).toBe('page');
  });
});
