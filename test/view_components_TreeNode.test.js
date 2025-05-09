import { describe, it, expect, vi } from 'vitest';
import TreeNode from '../src/js/view/components/TreeNode.js';

describe('TreeNode', () => {
  it('should be defined', () => {
    expect(TreeNode).toBeDefined();
  });

  it('should emit view:deleteNode on delete button click', () => {
    const eventBus = { emit: vi.fn() };
    const node = { id: 'n1', label: 'Test' };
    // Create a template with the required structure
    const template = document.createElement('template');
    template.innerHTML = '<div class="ts-entry"><span class="ts-title"></span><span class="date"></span><button class="ts-delete"></button></div>';
    // Use the template for the TreeNode
    const parent = document.createElement('ul');
    document.body.appendChild(parent);
    const treeNode = new TreeNode(node, new Map(), eventBus, template);
    treeNode.render(parent);
    const entry = parent.querySelector('.ts-entry');
    const btn = entry.querySelector('.ts-delete');
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = () => true;
    btn.click();
    window.confirm = originalConfirm;
    expect(eventBus.emit).toHaveBeenCalledWith('view:deleteNode', { nodeId: 'n1' });
    document.body.removeChild(parent);
  });
});