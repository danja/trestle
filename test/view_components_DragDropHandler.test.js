import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DragDropHandler } from '../src/js/view/components/DragDropHandler.js';

function buildTree() {
  const root = document.createElement('ul');
  root.innerHTML = `
    <li data-node-id="n1" class="ts-open">
      <div class="dropzone"></div>
      <div class="ts-entry" id="n1"><span class="ts-handle"></span></div>
      <ul>
        <li data-node-id="n2">
          <div class="dropzone"></div>
          <div class="ts-entry" id="n2"><span class="ts-handle"></span></div>
        </li>
      </ul>
    </li>
    <li data-node-id="n3">
      <div class="dropzone"></div>
      <div class="ts-entry" id="n3"><span class="ts-handle"></span></div>
    </li>
  `;

  const parent = root.querySelector('[data-node-id="n1"]');
  const child = root.querySelector('[data-node-id="n2"]');
  const sibling = root.querySelector('[data-node-id="n3"]');

  return {
    root,
    parent,
    child,
    sibling,
  };
}

describe('DragDropHandler', () => {
  let dom;
  let handler;
  let eventBus;
  let nodeElements;

  beforeEach(() => {
    dom = buildTree();
    document.body.innerHTML = '';
    document.body.appendChild(dom.root);

    eventBus = { emit: vi.fn() };
    nodeElements = new Map([
      ['n1', dom.parent],
      ['n2', dom.child],
      ['n3', dom.sibling],
    ]);

    handler = new DragDropHandler(dom.root, nodeElements, eventBus);
  });

  it('emits indentNode when dropping on the right side of another node', () => {
    handler.draggedNodeId = 'n2';

    const dropzone = dom.sibling.querySelector('.dropzone');
    Object.defineProperty(dom.sibling, 'offsetWidth', { value: 200, configurable: true });

    handler.handleDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: dropzone,
      offsetX: 180, // > 0.1 ratio
      dataTransfer: {},
    });

    expect(eventBus.emit).toHaveBeenCalledWith('view:indentNode', { nodeId: 'n2' });
  });

  it('emits outdentNode when dropping left and node has a parent', () => {
    handler.draggedNodeId = 'n2';

    const dropzone = dom.parent.querySelector('.dropzone');
    Object.defineProperty(dom.parent, 'offsetWidth', { value: 200, configurable: true });

    handler.handleDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: dropzone,
      offsetX: 10, // <= 0.1 ratio
      dataTransfer: {},
    });

    expect(eventBus.emit).toHaveBeenCalledWith('view:outdentNode', { nodeId: 'n2' });
  });

  it('moves node under previous sibling when dropping onto itself on the right', () => {
    handler.draggedNodeId = 'n3';

    const dropzone = dom.sibling.querySelector('.dropzone');
    Object.defineProperty(dom.sibling, 'offsetWidth', { value: 200, configurable: true });

    handler.handleDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: dropzone,
      offsetX: 160,
      dataTransfer: {},
    });

    expect(eventBus.emit).toHaveBeenCalledWith('view:moveNode', expect.objectContaining({
      nodeId: 'n3',
      newParentId: 'n1',
    }));
  });

  it('does not emit events when dropping onto itself without previous sibling', () => {
    handler.draggedNodeId = 'n1';

    const dropzone = dom.parent.querySelector('.dropzone');
    Object.defineProperty(dom.parent, 'offsetWidth', { value: 200, configurable: true });

    handler.handleDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: dropzone,
      offsetX: 150,
      dataTransfer: {},
    });

    expect(eventBus.emit).not.toHaveBeenCalled();
  });

  it('does not emit events when dropping onto a child node', () => {
    handler.draggedNodeId = 'n1';

    const dropzone = dom.child.querySelector('.dropzone');
    Object.defineProperty(dom.child, 'offsetWidth', { value: 200, configurable: true });

    handler.handleDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: dropzone,
      offsetX: 20,
      dataTransfer: {},
    });

    expect(eventBus.emit).not.toHaveBeenCalled();
  });
});
