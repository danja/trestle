// test/components.test.js
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { EventBus } from 'evb';
import { TreeNode } from '../src/js/view/components/TreeNode.js';
import { DragDropHandler } from '../src/js/view/components/DragDropHandler.js';
import { NodeSelector } from '../src/js/view/components/NodeSelector.js';
import { ExpanderButton } from '../src/js/view/components/ExpanderButton.js';
import { InlineEditor } from '../src/js/view/components/InlineEditor.js';

// Setup DOM environment
const dom = new JSDOM(`<!DOCTYPE html>
<html>
<body>
  <div id="trestle-root"></div>
  <template id="entry-template">
    <div class="ts-entry">
      <button class="ts-expander" aria-label="Toggle expand"></button>
      <div class="ts-handle" aria-hidden="true">⋮</div>
      <div class="ts-title" contenteditable="true"></div>
      <div class="ts-actions">
        <button class="ts-card" aria-label="Show card" title="Show details">📝</button>
        <button class="ts-addChild" aria-label="Add child" title="Add child item">+</button>
        <button class="ts-delete" aria-label="Delete" title="Delete item">×</button>
      </div>
      <span class="date hidden"></span>
    </div>
  </template>
</body>
</html>`);

global.window = dom.window;
global.document = dom.window.document;

describe('Component Tests', () => {
  let eventBus;
  let rootElement;
  let template;
  
  beforeEach(() => {
    eventBus = new EventBus();
    rootElement = document.getElementById('trestle-root');
    template = document.getElementById('entry-template');
  });
  
  describe('TreeNode component', () => {
    it('should render a node correctly', () => {
      const nodeData = {
        id: 'test-node-1',
        title: 'Test Node',
        created: '2023-05-01T12:00:00.000Z',
        children: []
      };
      
      const treeNode = new TreeNode(nodeData, new Map(), eventBus, template);
      const nodeElement = treeNode.render(rootElement);
      
      expect(nodeElement).to.exist;
      expect(nodeElement.dataset.nodeId).to.equal('test-node-1');
      expect(nodeElement.querySelector('.ts-title').textContent).to.equal('Test Node');
    });
    
    it('should update a node title', () => {
      const nodeData = {
        id: 'test-node-2',
        title: 'Original Title',
        created: '2023-05-01T12:00:00.000Z',
        children: []
      };
      
      const treeNode = new TreeNode(nodeData, new Map(), eventBus, template);
      treeNode.render(rootElement);
      
      treeNode.update({ title: 'Updated Title' });
      
      const titleElement = document.getElementById('test-node-2').querySelector('.ts-title');
      expect(titleElement.textContent).to.equal('Updated Title');
    });
  });

  describe('NodeSelector component', () => {
    it('should select a node', () => {
      // Setup node structure for testing
      const ul = document.createElement('ul');
      rootElement.appendChild(ul);
      
      // Create first node
      const nodeData1 = {
        id: 'test-node-3',
        title: 'Node 1',
        created: '2023-05-01T12:00:00.000Z',
        children: []
      };
      
      const treeNode1 = new TreeNode(nodeData1, new Map(), eventBus, template);
      const element1 = treeNode1.render(ul);
      
      // Create second node
      const nodeData2 = {
        id: 'test-node-4',
        title: 'Node 2',
        created: '2023-05-01T12:00:00.000Z',
        children: []
      };
      
      const treeNode2 = new TreeNode(nodeData2, new Map(), eventBus, template);
      const element2 = treeNode2.render(ul);
      
      // Create node map for NodeSelector
      const nodeElements = new Map();
      nodeElements.set('test-node-3', element1);
      nodeElements.set('test-node-4', element2);
      
      // Create NodeSelector
      const nodeSelector = new NodeSelector(rootElement, nodeElements, eventBus);
      
      // Test selection
      nodeSelector.selectNode('test-node-3');
      expect(document.getElementById('test-node-3').classList.contains('ts-selected')).to.be.true;
      
      // Test selecting a different node
      nodeSelector.selectNode('test-node-4');
      expect(document.getElementById('test-node-3').classList.contains('ts-selected')).to.be.false;
      expect(document.getElementById('test-node-4').classList.contains('ts-selected')).to.be.true;
    });
  });

  describe('ExpanderButton component', () => {
    it('should toggle node expansion state', () => {
      // Setup node structure for testing
      const ul = document.createElement('ul');
      rootElement.appendChild(ul);
      
      // Create a node with children
      const nodeData = {
        id: 'test-node-5',
        title: 'Parent Node',
        created: '2023-05-01T12:00:00.000Z',
        children: ['child-1']
      };
      
      const nodesMap = new Map();
      nodesMap.set('test-node-5', nodeData);
      nodesMap.set('child-1', {
        id: 'child-1',
        title: 'Child Node',
        created: '2023-05-01T12:00:00.000Z',
        children: []
      });
      
      const treeNode = new TreeNode(nodeData, nodesMap, eventBus, template);
      const element = treeNode.render(ul);
      
      // Ensure node is initially expanded (ts-open)
      expect(element.classList.contains('ts-open')).to.be.true;
      
      // Create ExpanderButton
      const expander = new ExpanderButton(rootElement, eventBus);
      
      // Toggle node
      expander.toggleExpanded(element);
      
      // Check that node is now collapsed
      expect(element.classList.contains('ts-closed')).to.be.true;
      expect(element.classList.contains('ts-open')).to.be.false;
      
      // Toggle node again
      expander.toggleExpanded(element);
      
      // Check that node is expanded again
      expect(element.classList.contains('ts-open')).to.be.true;
      expect(element.classList.contains('ts-closed')).to.be.false;
    });
  });
});