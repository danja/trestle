import { TreeNode } from './components/TreeNode.js';
import { DragDropHandler } from './components/DragDropHandler.js';
import { CardDetail } from './components/CardDetail.js';
import { ContextMenu } from './components/ContextMenu.js';
import { ExpanderButton } from './components/ExpanderButton.js';
import { InlineEditor } from './components/InlineEditor.js';
import { NodeSelector } from './components/NodeSelector.js';
import { HamburgerMenu } from './components/HamburgerMenu.js';
import { Breadcrumb } from './components/Breadcrumb.js'; // [CASCADE] Imported Breadcrumb component
import { RightPanel } from './components/RightPanel.js'; // Import RightPanel component

export default class TrestleView {
    constructor(rootElement, eventBus) {
        this.rootElement = rootElement;
        this.eventBus = eventBus;
        this.template = document.getElementById('entry-template');
        this.nodeElements = new Map();

        // Initialize component instances
        this.cardDetail = new CardDetail(eventBus);
        this.contextMenu = new ContextMenu(eventBus);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.hamburgerMenu = new HamburgerMenu(document.getElementById('header-outer'), eventBus);
                // Initialize RightPanel after DOM is loaded
                this.rightPanel = new RightPanel(eventBus);
            });
        } else {
            this.hamburgerMenu = new HamburgerMenu(document.getElementById('header-outer'), eventBus);
            // Initialize RightPanel immediately
            this.rightPanel = new RightPanel(eventBus);
        }
        this.nodeSelector = null; // Will be initialized after DOM is populated
        this.inlineEditor = null; // Will be initialized after DOM is populated
        this.expanderButton = null; // Will be initialized after DOM is populated
        this.dragDropHandler = null; // Will be initialized after DOM is populated

// Breadcrumb state

        this.currentZoomNodeId = null; // null means root
        this.breadcrumbNav = document.querySelector('.breadcrumb');
        this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);
        // [CASCADE] Initialize Breadcrumb component if nav element exists
        if (this.breadcrumbNav && this.eventBus) {
            this.breadcrumb = new Breadcrumb(this.breadcrumbNav, this.eventBus);
            this.breadcrumb.initialize();
            console.log('[CASCADE][TrestleView] Breadcrumb initialized:', this.breadcrumb);
        } else {
            this.breadcrumb = null;
            console.warn('[CASCADE][TrestleView] Breadcrumb NOT initialized. breadcrumbNav:', this.breadcrumbNav, 'eventBus:', this.eventBus);
        }
        if (this.breadcrumbNav) {
            this.breadcrumbNav.addEventListener('click', this.handleBreadcrumbClick);
        }

        // Set up event listeners
        this.setupEventListeners();

        // Add global keyboard handler for list management shortcuts
        document.addEventListener('keydown', (event) => {
            // Only trigger if not editing (no contenteditable focused)
            if (document.activeElement && document.activeElement.isContentEditable) return;
            if (!this.nodeSelector) return;
            const selectedNodeId = this.nodeSelector.selectedNodeId;
            if (!selectedNodeId) return;
            // Shortcuts
            if ((event.key === 'Delete' || (event.ctrlKey && event.key.toLowerCase() === 'x'))) {
                event.preventDefault();
                this.eventBus.emit('view:deleteNode', { nodeId: selectedNodeId });
            } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
                event.preventDefault();
                this.eventBus.emit('view:duplicateNode', { nodeId: selectedNodeId });
            } else if (event.key === 'Tab') {
                event.preventDefault();
                if (event.shiftKey) {
                    this.eventBus.emit('view:outdentNode', { nodeId: selectedNodeId });
                } else {
                    this.eventBus.emit('view:indentNode', { nodeId: selectedNodeId });
                }
            } else if (event.key === 'ArrowUp') {
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.eventBus.emit('view:moveNodeUp', { nodeId: selectedNodeId });
                } else {
                    event.preventDefault();
                    this.eventBus.emit('view:navigateUp', { nodeId: selectedNodeId });
                }
            } else if (event.key === 'ArrowDown') {
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.eventBus.emit('view:moveNodeDown', { nodeId: selectedNodeId });
                } else {
                    event.preventDefault();
                    this.eventBus.emit('view:navigateDown', { nodeId: selectedNodeId });
                }
            }
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Model event listeners
        this.eventBus.on('model:loaded', (data) => {
            console.log('[TrestleView] Model loaded:', data);
            if (data && data.nodes) {
                this.allNodes = {};
                for (const node of data.nodes) {
                    this.allNodes[node.id] = node;
                }
                this.renderTree();
                this.updateBreadcrumb();
            }
        });
        
        this.eventBus.on('model:created', (data) => {
            console.log('[TrestleView] Model created:', data);
            if (data && data.nodes) {
                this.allNodes = {};
                for (const node of data.nodes) {
                    this.allNodes[node.id] = node;
                }
                this.renderTree();
                this.updateBreadcrumb();
            }
        });
        
        // Node events
        this.eventBus.on('node:added', this.handleNodeAdded.bind(this));
        this.eventBus.on('node:updated', this.handleNodeUpdated.bind(this));
        this.eventBus.on('node:deleted', this.handleNodeDeleted.bind(this));
        
        // Add event listeners for node movement
        this.eventBus.on('view:nodeIndented', this.handleNodeIndented.bind(this));
        this.eventBus.on('view:nodeOutdented', this.handleNodeOutdented.bind(this));
        
        // View event listeners for node selection and navigation
        this.eventBus.on('view:selectNode', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.selectNode(data.nodeId);
            }
        });
        
        this.eventBus.on('view:navigateUp', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.navigateUp(data.nodeId);
            }
        });
        
        this.eventBus.on('view:navigateDown', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.navigateDown(data.nodeId);
            }
        });
        
        this.eventBus.on('view:moveNodeUp', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.moveNodeUp(data.nodeId);
            }
        });
        
        this.eventBus.on('view:moveNodeDown', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.moveNodeDown(data.nodeId);
            }
        });
        
        // Log events for debugging
        console.log('[TrestleView] Event handlers set up');
    }



    /**
     * Render the tree from model data
     * @param {Object} data - The tree data from the model
     */
    renderTree(nodeId = null) {
        this.rootElement.innerHTML = '';
        this.nodeElements.clear();

        if (!this.allNodes) {
            console.warn('[CASCADE][TrestleView] this.allNodes is not set in renderTree, skipping render.');
            return;
        }
        const nodes = Object.values(this.allNodes);
        let rootNode = nodes.find(node => node.type === 'RootNode');
        if (!rootNode) {
            console.error('No root node found. Nodes available:', nodes);
            rootNode = nodes[0];
            if (!rootNode) return;
        }

        const tree = this.buildTreeStructure(Object.values(this.allNodes), rootNode.id);

        const rootUl = document.createElement('ul');
        rootUl.className = 'ts-root';
        this.rootElement.appendChild(rootUl);

        // Render child nodes
        for (const childId of tree.children || []) {
            const childData = tree.nodes.get(childId);
            if (childData) {
                const treeNode = new TreeNode(childData, tree.nodes, this.eventBus, this.template);
                const childElement = treeNode.render(rootUl);
                if (childElement) {
                    this.nodeElements.set(childId, childElement);
                }
            }
        }

        // Initialize components that need the DOM
        this.nodeSelector = new NodeSelector(this.rootElement, this.nodeElements, this.eventBus);
        this.inlineEditor = new InlineEditor(this.rootElement, this.eventBus);
        this.expanderButton = new ExpanderButton(this.rootElement, this.eventBus);
        this.dragDropHandler = new DragDropHandler(this.rootElement, this.nodeElements, this.eventBus);
        this.dragDropHandler.initialize();

        // Add contextual buttons
        ContextMenu.addContextualAddButtons(this.rootElement, this.eventBus);

        // Handle empty state
        if (!(tree.children && tree.children.length)) {
            console.warn('No children found for root node. Rendering root node only.');
            const treeNode = new TreeNode(rootNode, tree.nodes, this.eventBus, this.template);
            const nodeElement = treeNode.render(rootUl);
            if (nodeElement) {
                this.nodeElements.set(rootNode.id, nodeElement);
            }
        }
        // [CASCADE] Emit breadcrumb:update event for new Breadcrumb component
        if (this.breadcrumb && this.eventBus) {
            let path = [];
            let nodeId = this.currentZoomNodeId || (rootNode && rootNode.id);
            while (nodeId && this.allNodes[nodeId]) {
                path.unshift(this.allNodes[nodeId]);
                nodeId = this.allNodes[nodeId].parent || null;
            }
            console.log('[CASCADE][TrestleView] Emitting breadcrumb:update with path:', path);
            this.eventBus.emit('breadcrumb:update', { node: { path } });
        }
    }

    /**
     * Build the tree structure from flat node data
     * @param {Array} nodes - The array of nodes
     * @param {string} rootId - The ID of the root node
     * @returns {Object} The tree structure object
     */
    buildTreeStructure(nodes, rootId) {
        const nodesMap = new Map();

        for (const node of nodes) {
            nodesMap.set(node.id, { ...node });
        }

        for (const node of nodesMap.values()) {
            if (node.children) {
                node.children = node.children.filter(childId => nodesMap.has(childId));
            } else {
                node.children = [];
            }
        }

        return {
            rootId,
            nodes: nodesMap,
            children: nodesMap.get(rootId)?.children || []
        };
    }

    /**
     * Handle node added event
     * @param {Object} data - The node data
     */
    handleNodeAdded(data) {
        const { node, parentId } = data;

        // Find parent element
        let parentElement;
        if (parentId === 'trestle-root') {
            parentElement = this.rootElement.querySelector('ul');

            // Remove empty state if present
            const emptyState = parentElement.querySelector('.ts-empty-state');
            if (emptyState) {
                emptyState.remove();
            }
        } else {
            const parentLi = this.nodeElements.get(parentId);
            if (!parentLi) {
                console.error('Parent not found:', parentId);
                return;
            }

            // Get or create parent's child list
            let ul = parentLi.querySelector('ul');
            if (!ul) {
                ul = document.createElement('ul');
                parentLi.appendChild(ul);
                parentLi.classList.remove('ts-closed');
                parentLi.classList.add('ts-open');
            }

            parentElement = ul;
        }

        // Check if this is a sibling being inserted after another node
        const insertAfterElement = this.findInsertPosition(parentElement, node.index);

        // Create node map for rendering
        const nodesMap = new Map();
        nodesMap.set(node.id, node);

        // Create the tree node
        const treeNode = new TreeNode(node, nodesMap, this.eventBus, this.template);

        // If we have a specific insertion point
        if (insertAfterElement) {
            // Create the node but don't attach to DOM yet
            const tempContainer = document.createElement('div');
            const newNodeElement = treeNode.render(tempContainer);

            // Insert it after the identified element
            insertAfterElement.after(newNodeElement);

            // Update our node elements map
            this.nodeElements.set(node.id, newNodeElement);

            // Select the node
            if (this.nodeSelector) {
                this.nodeSelector.selectNode(node.id);
            }

            // Start editing
            setTimeout(() => {
                const titleElement = newNodeElement.querySelector('.ts-title');
                if (this.inlineEditor) {
                    this.inlineEditor.startEditing(titleElement);
                }
            }, 10);
        } else {
            // Standard rendering - append to parent
            const newNodeElement = treeNode.render(parentElement);

            if (newNodeElement) {
                this.nodeElements.set(node.id, newNodeElement);

                // Select the node
                if (this.nodeSelector) {
                    this.nodeSelector.selectNode(node.id);
                }

                // Start editing
                setTimeout(() => {
                    const titleElement = newNodeElement.querySelector('.ts-title');
                    if (this.inlineEditor) {
                        this.inlineEditor.startEditing(titleElement);
                    }
                }, 10);
            }
        }

        // Refresh drag and drop handlers
        if (this.dragDropHandler) {
            this.dragDropHandler.initialize();
        }

        // Add buttons for inserting new nodes between existing ones
        ContextMenu.addContextualAddButtons(this.rootElement, this.eventBus);
    }

    /**
     * Handle node updated event
     * @param {Object} data - The update data
     */
    handleNodeUpdated(data) {
        const { nodeId, properties } = data;

        const nodeEntry = document.getElementById(nodeId);
        if (!nodeEntry) return;

        if (properties.title !== undefined) {
            const titleElement = nodeEntry.querySelector('.ts-title');
            titleElement.textContent = properties.title;
        }
    }

    /**
     * Handle node deleted event
     * @param {Object} data - The delete data
     */
    handleNodeDeleted(data) {
        const { nodeId } = data;

        const nodeLi = this.nodeElements.get(nodeId);
        if (nodeLi) {
            const parent = nodeLi.parentElement;
            const isLastInList = parent.children.length === 1;

            nodeLi.remove();
            this.nodeElements.delete(nodeId);

            if (isLastInList && parent.classList.contains('ts-root')) {
                this.showEmptyState(parent);
            }
        }
    }

    /**
     * Handle node indented event
     * @param {Object} data - The indent data
     */
    handleNodeIndented(data) {
        const { nodeId, newParentId } = data;

        const nodeLi = this.nodeElements.get(nodeId);
        const newParentLi = this.nodeElements.get(newParentId);

        if (!nodeLi || !newParentLi) return;

        let parentUl = newParentLi.querySelector('ul');
        if (!parentUl) {
            parentUl = document.createElement('ul');
            newParentLi.appendChild(parentUl);
            newParentLi.classList.remove('ts-closed');
            newParentLi.classList.add('ts-open');
        }

        parentUl.appendChild(nodeLi);

        // Refresh drag and drop handlers
        if (this.dragDropHandler) {
            this.dragDropHandler.initialize();
        }

        // Add buttons for inserting new nodes between existing ones
        ContextMenu.addContextualAddButtons(this.rootElement, this.eventBus);
    }

    /**
     * Handle node outdented event
     * @param {Object} data - The outdent data
     */
    handleNodeOutdented(data) {
        const { nodeId, newParentId } = data;

        const nodeLi = this.nodeElements.get(nodeId);
        if (!nodeLi) return;

        const oldParentLi = nodeLi.parentElement.closest('li');
        if (!oldParentLi) return;

        let newParentList;
        if (newParentId === 'trestle-root') {
            newParentList = this.rootElement.querySelector('ul');
        } else {
            const newParentLi = this.nodeElements.get(newParentId);
            if (!newParentLi) return;

            newParentList = newParentLi.parentElement;
        }

        if (!newParentList) return;

        if (oldParentLi.nextElementSibling) {
            newParentList.insertBefore(nodeLi, oldParentLi.nextElementSibling);
        } else {
            newParentList.appendChild(nodeLi);
        }

        // Refresh drag and drop handlers
        if (this.dragDropHandler) {
            this.dragDropHandler.initialize();
        }

        // Add buttons for inserting new nodes between existing ones
        ContextMenu.addContextualAddButtons(this.rootElement, this.eventBus);
    }

    /**
     * Find the position to insert a node at a specific index
     * @param {HTMLElement} parentElement - The parent element
     * @param {number} index - The index to insert at
     * @returns {HTMLElement|null} The element after which to insert
     */
    findInsertPosition(parentElement, index) {
        if (index === undefined || index <= 0 || !parentElement) {
            return null;
        }

        // Get all direct list item children
        const children = Array.from(parentElement.children);

        // If there are fewer children than the index, we can't insert at that position
        if (children.length < index) {
            return null;
        }

        // Return the element after which we should insert (index-1 because we're 0-indexed)
        return children[index - 1];
    }

    /**
     * Show empty state when all nodes are deleted
     * @param {HTMLElement} container - The container element
     */
    showEmptyState(container) {
        const emptyState = document.createElement('li');
        emptyState.className = 'ts-empty-state';

        const emptyText = document.createElement('div');
        emptyText.className = 'ts-empty-text';
        emptyText.textContent = 'Click to add your first item';
        emptyText.addEventListener('click', () => {
            this.eventBus.emit('view:addRootItem', {});
        });

        emptyState.appendChild(emptyText);
        container.appendChild(emptyState);
    }

    zoomInToNode(nodeId) {
        if (!nodeId || !this.allNodes[nodeId]) return;
        this.rootElement.innerHTML = '';
        this.nodeElements.clear();
        const tree = this.buildTreeStructure(Object.values(this.allNodes), nodeId);
        const rootUl = document.createElement('ul');
        rootUl.className = 'ts-root';
        this.rootElement.appendChild(rootUl);
        for (const childId of tree.children || []) {
            const childData = tree.nodes.get(childId);
            if (childData) {
                const treeNode = new TreeNode(childData, tree.nodes, this.eventBus, this.template);
                const childElement = treeNode.render(rootUl);
                if (childElement) {
                    this.nodeElements.set(childId, childElement);
                }
            }
        }
        this.currentZoomNodeId = nodeId;
        // [CASCADE] Emit breadcrumb:update event for new Breadcrumb component
        if (this.breadcrumb && this.eventBus) {
            let path = [];
            let nodeId = this.currentZoomNodeId;
            while (nodeId && this.allNodes[nodeId]) {
                path.unshift(this.allNodes[nodeId]);
                nodeId = this.allNodes[nodeId].parent || null;
            }
            console.log('[CASCADE][TrestleView] Emitting breadcrumb:update with path:', path);
            this.eventBus.emit('breadcrumb:update', { node: { path } });
        }
        this.updateBreadcrumb();
    }

    zoomOutToNode(nodeId) {
        if (nodeId === null || nodeId === '') {
            this.currentZoomNodeId = null;
            this.eventBus.emit('model:loaded', { nodes: Object.values(this.allNodes) });
        } else {
            this.zoomInToNode(nodeId);
        }
    }

    updateBreadcrumb() {
        // [CASCADE] Disabled old breadcrumb logic to allow new Breadcrumb component to control rendering.
        // if (!this.breadcrumbNav) return;
        // this.breadcrumbNav.innerHTML = '';
        // let path = [];
        // let nodeId = this.currentZoomNodeId;
        // while (nodeId && this.allNodes[nodeId]) {
        //     path.unshift(this.allNodes[nodeId]);
        //     nodeId = this.allNodes[nodeId].parent || null;
        // }
        // const rootNode = Object.values(this.allNodes).find(n => n.type === 'RootNode');
        // if (rootNode) {
        //     this.breadcrumbNav.appendChild(this._makeBreadcrumbLink(rootNode, null));
        // }
        // path.forEach((node, idx) => {
        //     this.breadcrumbNav.appendChild(this._makeBreadcrumbLink(node, node.id));
        // });
    }

    _makeBreadcrumbLink(node, nodeId) {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'breadcrumb-link';
        a.textContent = node.title || '(untitled)';
        a.dataset.nodeId = nodeId || '';
        return a;
    }

    _makeBreadcrumbSeparator() {
        const sep = document.createElement('span');
        sep.className = 'breadcrumb-separator';
        sep.textContent = '>';
        return sep;
    }

    handleBreadcrumbClick(event) {
        if (event.target.classList.contains('breadcrumb-link')) {
            event.preventDefault();
            const nodeId = event.target.dataset.nodeId || null;
            this.zoomOutToNode(nodeId);
        }
    }
}

export { TrestleView };