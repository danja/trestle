import { describe, it, expect, vi } from 'vitest';
import TrestleView from '../src/js/view/TrestleView.js';

describe('TrestleView', () => {
  it('should be defined', () => {
    expect(TrestleView).toBeDefined();
  });

  it('should call eventBus.emit on keyboard shortcut', () => {
    const eventBus = { emit: vi.fn(), on: vi.fn() };
    const rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
    // Set up a template in the document for TrestleView
    const template = document.createElement('template');
    template.id = 'entry-template';
    template.innerHTML = '<div class="ts-entry"><span class="ts-title"></span><span class="date"></span><button class="ts-delete"></button></div>';
    document.body.appendChild(template);
    // Patch TrestleView to accept eventBus as second argument
    const view = new TrestleView(rootElement, eventBus);
    // Set up a fake nodeSelector with a selected node
    view.nodeSelector = { selectedNodeId: 'n1' };
    // Simulate keydown for delete
    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    document.dispatchEvent(event);
    expect(eventBus.emit).toHaveBeenCalledWith('view:deleteNode', { nodeId: 'n1' });
    document.body.removeChild(rootElement);
    document.body.removeChild(template);
  });
});