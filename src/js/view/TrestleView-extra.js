import { TreeNode } from './components/TreeNode.js';
import { DragDropHandler } from './components/DragDropHandler.js';
import { CardDetail } from './components/CardDetail.js';
import { ContextMenu } from './components/ContextMenu.js';
import { ExpanderButton } from './components/ExpanderButton.js';
import { HamburgerMenu } from './components/HamburgerMenu.js';
import { InlineEditor } from './components/InlineEditor.js';
import { NavigationControls } from './components/NavigationControls.js';
import { Breadcrumb } from './components/Breadcrumb.js';
import { NodeSelector } from './components/NodeSelector.js';
import { SearchBar } from './components/SearchBar.js';
import { Favorites } from './components/Favorites.js';
import { OptionsMenu } from './components/OptionsMenu.js';
import { RightPanel } from './components/RightPanel.js';

export default class TrestleView {
    constructor(rootElement, eventBus) {
        this.rootElement = rootElement;
        this.eventBus = eventBus;
        this.template = document.getElementById('entry-template');
        this.nodeElements = new Map();
        this.allNodes = {}; // Track all nodes for navigation
        
        // Initialize component instances
        this.cardDetail = new CardDetail(eventBus);
        this.contextMenu = new ContextMenu(eventBus);
        this.hamburgerMenu = new HamburgerMenu(document.body, eventBus);
        this.navigationControls = new NavigationControls(document.body, eventBus);
        this.rightPanel = new RightPanel(eventBus);
        
        // Initialize toolbar components
        const toolbarElement = document.querySelector('.top-navbar.toolbar');
        this.searchBar = toolbarElement ? new SearchBar(toolbarElement, eventBus) : null;
        this.favorites = toolbarElement ? new Favorites(toolbarElement, eventBus) : null;
        this.optionsMenu = toolbarElement ? new OptionsMenu(toolbarElement, eventBus) : null;
        
        // Will be initialized after DOM is populated
        this.nodeSelector = null;
        this.inlineEditor = null;
        this.expanderButton = null;
        this.dragDropHandler = null;

        // Initialize Breadcrumb component
        const breadcrumbElement = document.querySelector('.breadcrumb');
        this.breadcrumb = breadcrumbElement ? new Breadcrumb(breadcrumbElement, eventBus) : null;
        this.currentZoomNodeId = null; // null means root
        this.navigationHistory = [];
        this.historyPosition = -1;

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
            this.allNodes = data.nodes.reduce((acc, node) => {
                acc[node.id] = node;
                return acc;
            }, {});
            this.renderTree(data);
            this.updateBreadcrumb();
        });
        
        this.eventBus.on('model:created', this.renderTree.bind(this));
        this.eventBus.on('node:added', this.handleNodeAdded.bind(this));
        this.eventBus.on('node:updated', this.handleNodeUpdated.bind(this));
        this.eventBus.on('node:deleted', this.handleNodeDeleted.bind(this));
        this.eventBus.on('view:nodeIndented', this.handleNodeIndented.bind(this));
        this.eventBus.on('view:nodeOutdented', this.handleNodeOutdented.bind(this));
        
        // Navigation events
        this.eventBus.on('view:navigateTo', (data) => {
            const { nodeId } = data;
            if (nodeId === 'root' || !nodeId) {
                this.zoomOutToNode(null);
            } else {
                this.zoomInToNode(nodeId);
            }
        });
        
        this.eventBus.on('view:navigateBack', () => {
            if (this.historyPosition > 0) {
                this.historyPosition--;
                const prevNodeId = this.navigationHistory[this.historyPosition];
                this.zoomInToNode(prevNodeId, false);
            }
        });
        
        this.eventBus.on('view:navigateForward', () => {
            if (this.historyPosition < this.navigationHistory.length - 1) {
                this.historyPosition++;
                const nextNodeId = this.navigationHistory[this.historyPosition];
                this.zoomInToNode(nextNodeId, false);
            }
        });
        
        // View event listeners
        this.eventBus.on('view:selectNode', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.selectNode(data.nodeId);
            }
            this.updateBreadcrumb();
        });
        
        this.eventBus.on('view:navigateUp', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.navigateUp(data.nodeId);
            }
        });
        
        // Add more event listeners as needed...
    }

    /**
     * Renders the tree with the given nodes
     * @param {Object} data - The data containing nodes to render
     */
    renderTree(data) {
        if (!data || !data.nodes || !Array.isArray(data.nodes)) {
            console.error('Invalid data for renderTree:', data);
            return;
        }

        this.rootElement.innerHTML = '';
        this.nodeElements.clear();

        if (data.nodes.length === 0) {
            this.renderEmptyState();
            return;
        }

        const rootUl = document.createElement('ul');
        rootUl.className = 'ts-root';
        this.rootElement.appendChild(rootUl);

        // Build the tree structure
        const tree = this.buildTreeStructure(data.nodes, this.currentZoomNodeId);

        // Render the tree
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

        // Initialize components that need the DOM to be ready
        if (!this.nodeSelector) {
            this.nodeSelector = new NodeSelector(this.rootElement, this.eventBus);
        }
        if (!this.inlineEditor) {
            this.inlineEditor = new InlineEditor(this.rootElement, this.eventBus);
        }
        if (!this.expanderButton) {
            this.expanderButton = new ExpanderButton(this.rootElement, this.eventBus);
        }
        if (!this.dragDropHandler) {
            this.dragDropHandler = new DragDropHandler(this.rootElement, this.eventBus);
        }

        // Update breadcrumb after rendering
        this.updateBreadcrumb();
    }

    /**
     * Builds a tree structure from a flat list of nodes
     * @param {Array} nodes - The nodes to build the tree from
     * @param {string} parentId - The ID of the parent node
     * @returns {Object} The tree structure
     */
    buildTreeStructure(nodes, parentId = null) {
        const nodeMap = new Map();
        const rootNodes = [];
        
        // First pass: create a map of nodes
        nodes.forEach(node => {
            nodeMap.set(node.id, { ...node, children: [] });
        });
        
        // Second pass: build the tree
        nodes.forEach(node => {
            const currentNode = nodeMap.get(node.id);
            if (node.parent && nodeMap.has(node.parent)) {
                const parentNode = nodeMap.get(node.parent);
                parentNode.children.push(node.id);
            } else if (node.parent === parentId || (!node.parent && !parentId)) {
                rootNodes.push(node.id);
            }
        });
        
        return {
            nodes: nodeMap,
            children: rootNodes
        };
    }

    handleNodeAdded(data) {
        if (!data || !data.node) return;
        const { node } = data;
        // --- Construct the full path from root to this node (excluding itself) ---
        const path = [];
        let current = node;
        const visited = new Set();
        while (current && current.parent && this.allNodes[current.parent] && !visited.has(current.parent)) {
            visited.add(current.parent);
            const parentNode = this.allNodes[current.parent];
            path.unshift({ id: parentNode.id, title: parentNode.title || `Node ${parentNode.id}` });
            current = parentNode;
        }
        node.path = path;
        console.log('[TrestleView][handleNodeAdded] Adding node:', node);
        console.log('[TrestleView][handleNodeAdded] allNodes before refresh:', JSON.parse(JSON.stringify(this.allNodes)));
        if (this.model && typeof this.model.getAllNodes === 'function') {
            const allModelNodes = this.model.getAllNodes();
            console.log('[TrestleView][handleNodeAdded] model.getAllNodes():', allModelNodes);
            this.allNodes = {};
            for (const n of allModelNodes) {
                this.allNodes[n.id] = n;
            }
            console.log('[TrestleView][handleNodeAdded] allNodes after refresh:', JSON.parse(JSON.stringify(this.allNodes)));
        } else {
            this.allNodes[node.id] = node;
        }
        // If we're at the root or the node's parent is in the current view, update the view
        if (!this.currentZoomNodeId || node.parent === this.currentZoomNodeId) {
            console.log('[TrestleView][handleNodeAdded] Rendering tree with nodes:', Object.values(this.allNodes));
            this.renderTree({ nodes: Object.values(this.allNodes) });
        }
    }

    handleNodeUpdated(data) {
        if (!data || !data.node) return;
        
        const { node } = data;
        this.allNodes[node.id] = node;
        
        // If the updated node is in the current view, update the view
        if (!this.currentZoomNodeId || node.id === this.currentZoomNodeId || 
            node.parent === this.currentZoomNodeId) {
            this.renderTree({ nodes: Object.values(this.allNodes) });
        }
    }

    /**
     * Handles when a node is deleted
     * @param {Object} data - The node data
     */
    handleNodeDeleted(data) {
        if (!data || !data.nodeId) return;
        
        delete this.allNodes[data.nodeId];
        
        // If we're viewing the deleted node or its children, navigate up
        if (this.currentZoomNodeId === data.nodeId) {
            const node = this.allNodes[data.parentId];
            if (node) {
                this.zoomInToNode(node.id);
            } else {
                this.zoomOutToNode(null);
            }
        } else {
            // Otherwise, just update the current view
            this.renderTree({ nodes: Object.values(this.allNodes) });
        }
    }

    
    /**
     * Handles when a node is indented
     * @param {Object} data - The node data
     */
    handleNodeIndented(data) {
        if (!data || !data.nodeId) return;
        
        // Update the node's parent in our local state
        const node = this.allNodes[data.nodeId];
        if (node) {
            node.parent = data.parentId;
            this.renderTree({ nodes: Object.values(this.allNodes) });
        }
    }
    
    /**
     * Handles when a node is outdented
     * @param {Object} data - The node data
     */
    handleNodeOutdented(data) {
        if (!data || !data.nodeId) return;
        
        // Update the node's parent in our local state
        const node = this.allNodes[data.nodeId];
        if (node) {
            node.parent = data.parentId;
            this.renderTree({ nodes: Object.values(this.allNodes) });
        }
    }

    /**
     * Renders an empty state when there are no nodes
     */
    renderEmptyState() {
        const container = document.createElement('div');
        container.className = 'empty-state';
        
        const title = document.createElement('h3');
        title.textContent = 'No items yet';
        
        const message = document.createElement('p');
        message.textContent = 'Click the "+" button to add your first item';
        
        container.appendChild(title);
        container.appendChild(message);
        this.rootElement.appendChild(container);
    }

    /**
     * Zooms in to a specific node
     * @param {string} nodeId - The ID of the node to zoom into
     * @param {boolean} addToHistory - Whether to add to navigation history
     */
    zoomInToNode(nodeId, addToHistory = true) {
        if (!nodeId || !this.allNodes[nodeId]) {
            this.zoomOutToNode(null, addToHistory);
            return;
        }
        
        // Update navigation history if needed
        if (addToHistory) {
            // If we're not at the end of history, truncate the history
            if (this.historyPosition < this.navigationHistory.length - 1) {
                this.navigationHistory = this.navigationHistory.slice(0, this.historyPosition + 1);
            }
            
            // Add to history if it's a new node
            if (this.navigationHistory[this.historyPosition] !== nodeId) {
                this.navigationHistory.push(nodeId);
                this.historyPosition++;
            }
            
            // Update navigation controls state
            this.eventBus.emit('navigation:historyChanged', {
                canGoBack: this.historyPosition > 0,
                canGoForward: this.historyPosition < this.navigationHistory.length - 1
            });
        }
        
        // Update the view
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
        this.updateBreadcrumb();
    }

    /**
     * Zooms out to a specific node
     * @param {string} nodeId - The ID of the node to zoom out to
     * @param {boolean} addToHistory - Whether to add to navigation history
     */
    zoomOutToNode(nodeId, addToHistory = true) {
        console.log('zoomOutToNode called with nodeId:', nodeId, 'addToHistory:', addToHistory);
        try {
            if (nodeId === null || nodeId === '') {
                console.log('Zooming out to root');
                if (addToHistory) {
                    console.log('Adding to history. Current history:', this.navigationHistory, 'position:', this.historyPosition);
                    // Add root to history if needed
                    if (this.navigationHistory[this.historyPosition] !== null) {
                        console.log('Adding null to history');
                        this.navigationHistory.push(null);
                        this.historyPosition++;
                    }
                    
                    // Update navigation controls state
                    console.log('Emitting navigation:historyChanged event');
                    this.eventBus.emit('navigation:historyChanged', {
                        canGoBack: this.historyPosition > 0,
                        canGoForward: this.historyPosition < this.navigationHistory.length - 1
                    });
                }
                
                console.log('Setting currentZoomNodeId to null');
                this.currentZoomNodeId = null;
                
                console.log('Emitting model:loaded event');
                const nodeValues = Object.values(this.allNodes);
                console.log('Node values length:', nodeValues.length);
                this.eventBus.emit('model:loaded', { nodes: nodeValues });
            } else {
                console.log('Zooming in to node:', nodeId);
                this.zoomInToNode(nodeId, addToHistory);
            }
            
            console.log('Updating breadcrumb');
            this.updateBreadcrumb();
            console.log('zoomOutToNode completed successfully');
        } catch (error) {
            console.error('Error in zoomOutToNode:', error);
            throw error; // Re-throw to fail the test
        }
    }

    /**
     * Updates the breadcrumb navigation based on the current node
     */
    updateBreadcrumb() {
        if (!this.breadcrumb) return;
        
        // Prevent recursive calls
        if (this._updatingBreadcrumb) {
            console.warn('[TrestleView] Prevented recursive updateBreadcrumb call');
            return;
        }
        
        this._updatingBreadcrumb = true;
        
        try {
            const node = {
                id: this.currentZoomNodeId || 'root',
                title: this.currentZoomNodeId ? 
                    (this.allNodes[this.currentZoomNodeId]?.title || `Node ${this.currentZoomNodeId}`) : 
                    'Home',
                path: []
            };
            
            // Build the path from current node to root
            if (this.currentZoomNodeId && this.allNodes[this.currentZoomNodeId]) {
                const path = [];
                let currentNode = this.allNodes[this.currentZoomNodeId];
                const visited = new Set(); // To prevent circular references
                
                // Traverse up the tree to build the path
                while (currentNode && !visited.has(currentNode.id)) {
                    visited.add(currentNode.id);
                    
                    // Add current node to path
                    path.unshift({
                        id: currentNode.id,
                        title: currentNode.title || `Node ${currentNode.id}`
                    });
                    
                    // Move to parent if it exists and we haven't visited it yet
                    if (currentNode.parent && this.allNodes[currentNode.parent] && !visited.has(currentNode.parent)) {
                        currentNode = this.allNodes[currentNode.parent];
                    } else {
                        break;
                    }
                }
                
                // Set the path (excluding the current node which is already in the node object)
                node.path = path.slice(0, -1);
            } else {
                // If we're at the root level, ensure we have a valid path structure
                node.path = [];
                
                // Add a root node entry if we're not already at the root
                if (node.id !== 'root') {
                    node.path.push({
                        id: 'root',
                        title: 'Home'
                    });
                }
            }
            
            // Use a different event name to avoid triggering handleNodeUpdated
            // This breaks the circular dependency: renderTree → updateBreadcrumb → node:updated → handleNodeUpdated → renderTree
            this.eventBus.emit('breadcrumb:update', { node });
            
            // Also emit a navigation:locationChanged event for other components
            this.eventBus.emit('navigation:locationChanged', {
                nodeId: node.id,
                nodeTitle: node.title,
                path: node.path
            });
        } catch (error) {
            console.error('Error in updateBreadcrumb:', error);
        } finally {
            this._updatingBreadcrumb = false;
        }
    }
}

export { TrestleView };
