import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from 'evb';
import { Breadcrumb } from '../src/js/view/components/Breadcrumb.js';

describe('Breadcrumb', () => {
  let eventBus;
  let container;
  let component;

  beforeEach(() => {
    document.body.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb"></nav>
    `;

    eventBus = new EventBus();
    container = document.querySelector('.breadcrumb');
    component = new Breadcrumb(container, eventBus);
  });

  it('renders Home as the active item on initialization', () => {
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].getAttribute('aria-current')).toBe('page');
    expect(items[0].textContent.trim()).toBe('Home');
  });

  it('shows Home link and current node when zoomed in', () => {
    eventBus.emit('view:zoomedIn', { nodeId: 'node-1', nodeTitle: 'Node 1' });

    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);

    const [homeItem, separator, currentItem] = items;

    const homeLink = homeItem.querySelector('a');
    expect(homeLink).not.toBeNull();
    expect(homeLink.textContent.trim()).toBe('Home');

    expect(separator.classList.contains('breadcrumb-separator')).toBe(true);
    expect(separator.getAttribute('aria-hidden')).toBe('true');

    expect(currentItem.getAttribute('aria-current')).toBe('page');
    expect(currentItem.textContent.trim()).toBe('Node 1');
  });

  it('emits navigateHome when the Home link is clicked', () => {
    eventBus.emit('view:zoomedIn', { nodeId: 'node-1', nodeTitle: 'Node 1' });

    const emitSpy = vi.spyOn(eventBus, 'emit');
    const homeLink = container.querySelector('a');
    homeLink.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(emitSpy).toHaveBeenCalledWith('view:navigateHome');
  });

  it('returns to Home view when zoomed out', () => {
    eventBus.emit('view:zoomedIn', { nodeId: 'node-1', nodeTitle: 'Node 1' });
    eventBus.emit('view:zoomedOut');

    const items = container.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent.trim()).toBe('Home');
    expect(items[0].getAttribute('aria-current')).toBe('page');
  });

  it('returns to Home when receiving navigatedHome event', () => {
    eventBus.emit('view:zoomedIn', { nodeId: 'node-1', nodeTitle: 'Node 1' });
    eventBus.emit('view:navigatedHome');

    const items = container.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent.trim()).toBe('Home');
  });
});
