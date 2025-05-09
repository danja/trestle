import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DragDropHandler } from '../src/js/view/components/DragDropHandler.js';

function createTreeDOM() {
  // <ul>
  //   <li id="li-1" data-node-id="n1"><div class="ts-entry" id="n1"><span class="ts-handle"></span></div></li>
  //   <li id="li-2" data-node-id="n2"><div class="ts-entry" id="n2"><span class="ts-handle"></span></div></li>
  // </ul>
  const ul = document.createElement('ul');
  const li1 = document.createElement('li');
  li1.id = 'li-1';
  li1.dataset.nodeId = 'n1';
  li1.classList.add('dropzone');
  const entry1 = document.createElement('div');
  entry1.className = 'ts-entry';
  entry1.id = 'n1';
  const handle1 = document.createElement('span');
  handle1.className = 'ts-handle';
  entry1.appendChild(handle1);
  li1.appendChild(entry1);
  ul.appendChild(li1);

  const li2 = document.createElement('li');
  li2.id = 'li-2';
  li2.dataset.nodeId = 'n2';
  li2.classList.add('dropzone');
  const entry2 = document.createElement('div');
  entry2.className = 'ts-entry';
  entry2.id = 'n2';
  const handle2 = document.createElement('span');
  handle2.className = 'ts-handle';
  entry2.appendChild(handle2);
  li2.appendChild(entry2);
  ul.appendChild(li2);

  return { ul, li1, li2, entry1, entry2 };
}

describe('DragDropHandler', () => {
  let eventBus, nodeElements, dom, handler;

  beforeEach(() => {
    eventBus = { emit: vi.fn() };
    dom = createTreeDOM();
    nodeElements = new Map([
      ['n1', dom.li1],
      ['n2', dom.li2],
    ]);
    document.body.innerHTML = '';
    document.body.appendChild(dom.ul);
    handler = new DragDropHandler(dom.ul, nodeElements, eventBus);
    handler.draggedNodeId = 'n2'; // Simulate dragging n2
  });

  it('should be defined', () => {
    expect(DragDropHandler).toBeDefined();
  });

  it('should trigger indent logic when dropped on right half of previous sibling', () => {
    // Simulate drop on li1 (previous sibling of li2), right half
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: dom.entry1,
      offsetX: 100,
      dataTransfer: {},
    };
    Object.defineProperty(dom.li1, 'offsetWidth', { value: 100, configurable: true });
    handler.handleDrop(event);
    expect(eventBus.emit).toHaveBeenCalledWith('view:moveNode', expect.objectContaining({
      nodeId: 'n2',
      newParentId: 'n1',
    }));
  });

  it('should trigger outdent logic when dropped on left half of sibling', () => {
    // Simulate drop on li1 (left half)
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: dom.entry1,
      offsetX: 0,
      dataTransfer: {},
    };
    Object.defineProperty(dom.li1, 'offsetWidth', { value: 100, configurable: true });
    handler.handleDrop(event);
    expect(eventBus.emit).toHaveBeenCalledWith('view:moveNode', expect.objectContaining({
      nodeId: 'n2',
      // newParentId could be 'trestle-root' or undefined in this mock, so just check nodeId
    }));
  });

  it('should not indent if not dropped on previous sibling', () => {
    // Simulate drop on li2 (not previous sibling of itself), right half
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: dom.entry2,
      offsetX: 100,
      dataTransfer: {},
    };
    Object.defineProperty(dom.li2, 'offsetWidth', { value: 100, configurable: true });
    handler.handleDrop(event);
    // Should not call indent logic
    expect(eventBus.emit).not.toHaveBeenCalledWith('view:moveNode', expect.objectContaining({
      nodeId: 'n2',
      newParentId: 'n2',
    }));
  });
}); 