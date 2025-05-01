// src/js/view/TrestleView.js
export class TrestleView {
    /**
     * Creates a new TrestleView instance
     * @param {HTMLElement} rootElement - The root DOM element for the view
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(rootElement, eventBus) {
        this.rootElement = rootElement
        this.eventBus = eventBus
        this.template = document.getElementById('entry-template')
        this.nodeElements = new Map()
        this.selectedNodeId = null
        this.draggedNodeId = null
        this.dragTarget = null
        this.editingId = null

        // Event listeners
        this.eventBus.on('model:loaded', this.renderTree.bind(this))
        this.eventBus.on('model:created', this.renderTree.bind(this))
        this.eventBus.on('node:added', this.handleNodeAdded.bind(this))
        this.eventBus.on('node:updated', this.handleNodeUpdated.bind(this))
        this.eventBus.on('node:deleted', this.handleNodeDeleted.bind(this))
        this.eventBus.on('view:nodeIndented', this.handleNodeIndented.bind(this))
        this.eventBus.on('view:nodeOutdented', this.handleNodeOutdented.bind(this))

        // Initialize keyboard shortcuts
        document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this))
    }

    /**
     * Renders the entire tree from data
     * @param {Object} data - The tree data to render
     */
    renderTree(data) {
        // Clear existing content
        this.rootElement.innerHTML = ''
        this.nodeElements.clear()

        const rootNode = data.nodes.find(node => node.type === 'RootNode')
        if (!rootNode) {
            console.error('No root node found')
            return
        }

        // Build tree structure
        const tree = this.buildTreeStructure(data.nodes, rootNode.id)

        // Create root element
        const rootUl = document.createElement('ul')
        rootUl.className = 'ts-root'
        this.rootElement.appendChild(rootUl)

        // Render all children of root
        for (const childId of tree.children || []) {
            this.renderNode(childId, rootUl, tree.nodes)
        }

        // Setup event listeners
        this.setupEventListeners()

        // Initialize drag and drop
        this.initDragAndDrop()

        // Add contextual add buttons
        this.addContextualAddButtons()

        // Show an empty state if there are no items
        if (!(tree.children && tree.children.length)) {
            this.showEmptyState(rootUl)
        }
    }

    /**
     * Shows an empty state with a prompt to add the first item
     * @param {HTMLElement} rootUl - The root list element
     */
    showEmptyState(rootUl) {
        const emptyLi = document.createElement('li')
        emptyLi.className = 'ts-empty-state'

        const emptyText = document.createElement('div')
        emptyText.className = 'ts-empty-text'
        emptyText.textContent = 'Click here to add your first item'
        emptyText.addEventListener('click', () => {
            this.eventBus.emit('view:addChild', { parentId: 'trestle-root' })
        })

        emptyLi.appendChild(emptyText)
        rootUl.appendChild(emptyLi)
    }

    /**
     * Builds a tree structure from flat node data
     * @param {Array} nodes - The flat array of nodes
     * @param {string} rootId - The ID of the root node
     * @returns {Object} The tree structure
     */
    buildTreeStructure(nodes, rootId) {
        const nodesMap = new Map()

        // Create a map of nodes
        for (const node of nodes) {
            nodesMap.set(node.id, { ...node })
        }

        // Build parent-child relationships
        for (const node of nodesMap.values()) {
            if (node.children) {
                // Filter out non-existent children
                node.children = node.children.filter(childId => nodesMap.has(childId))
            } else {
                node.children = []
            }
        }

        return {
            rootId,
            nodes: nodesMap
        }
    }

    /**
     * Renders a node and its children
     * @param {string} nodeId - The ID of the node to render
     * @param {HTMLElement} parentElement - The parent element to append to
     * @param {Map} nodesMap - The map of all nodes
     * @returns {HTMLElement} The rendered node element
     */
    renderNode(nodeId, parentElement, nodesMap) {
        const node = nodesMap.get(nodeId)
        if (!node) return null

        // Create list item
        const li = document.createElement('li')
        li.dataset.nodeId = nodeId

        // Create dropzone
        const dropzone = document.createElement('div')
        dropzone.className = 'dropzone'
        li.appendChild(dropzone)

        // Clone the entry template
        const entry = this.template.content.cloneNode(true).querySelector('.ts-entry')
        entry.id = nodeId

        // Set title
        const titleElement = entry.querySelector('.ts-title')
        titleElement.textContent = node.title || ''

        // Set created date (hidden)
        const dateElement = entry.querySelector('.date')
        dateElement.textContent = node.created || ''

        // Append entry to list item
        li.appendChild(entry)

        // Add to nodeElements map
        this.nodeElements.set(nodeId, li)

        // Render children if any
        if (node.children && node.children.length > 0) {
            const ul = document.createElement('ul')
            li.appendChild(ul)
            li.classList.add('ts-open')

            for (const childId of node.children) {
                this.renderNode(childId, ul, nodesMap)
            }
        } else {
            li.classList.add('ts-closed')
        }

        // Append to parent element
        parentElement.appendChild(li)

        return li
    }

    /**
     * Adds contextual add buttons between items
     */
    addContextualAddButtons() {
        const dropzones = this.rootElement.querySelectorAll('.dropzone')

        dropzones.forEach(dropzone => {
            const addButton = document.createElement('div')
            addButton.className = 'ts-add-between'
            addButton.title = 'Add item here'

            addButton.addEventListener('click', (event) => {
                event.stopPropagation()

                const listItem = dropzone.closest('li')
                if (!listItem) return

                const nodeId = listItem.dataset.nodeId
                const parentElement = listItem.parentElement
                const parentNode = parentElement.closest('li')
                const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root'

                // Find the index position
                const siblings = Array.from(parentElement.children)
                const index = siblings.indexOf(listItem)

                this.eventBus.emit('view:insertNodeAt', {
                    parentId,
                    index: index
                })
            })

            dropzone.appendChild(addButton)
        })
    }

    /**
     * Sets up event listeners for the tree
     */
    setupEventListeners() {
        // Mouse events
        this.rootElement.addEventListener('click', this.handleClick.bind(this))
        this.rootElement.addEventListener('dblclick', this.handleDblClick.bind(this))

        // Keyboard events - focusable elements
        this.rootElement.addEventListener('keydown', this.handleKeyDown.bind(this))

        // Focus events
        this.rootElement.addEventListener('focus', this.handleFocus.bind(this), true)
        this.rootElement.addEventListener('blur', this.handleBlur.bind(this), true)

        // Add global click handler to close menus/panels when clicking elsewhere
        document.addEventListener('click', (event) => {
            // Close shortcuts panel if open and clicking outside of it
            const shortcutsPanel = document.getElementById('shortcuts-text')
            if (shortcutsPanel && !shortcutsPanel.classList.contains('hidden')) {
                if (!shortcutsPanel.contains(event.target) &&
                    event.target.id !== 'shortcutsButton' &&
                    event.target.id !== 'mobileShortcutsButton') {
                    shortcutsPanel.classList.add('hidden')
                }
            }
        })
    }

    /**
     * Handles global keyboard shortcuts
     */
    handleGlobalKeyDown(event) {
        // Ctrl+S for save
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault()
            document.getElementById('saveButton').click()
        }

        // Escape to cancel current editing
        if (event.key === 'Escape' && this.editingId) {
            const editingTitle = document.getElementById(this.editingId)?.querySelector('.ts-title')
            if (editingTitle && editingTitle.isContentEditable) {
                editingTitle.blur()
                this.selectNode(this.editingId)
                this.editingId = null
            }
        }
    }

    /**
     * Handles click events on the tree
     */
    handleClick(event) {
        const target = event.target

        // Toggle expander
        if (target.classList.contains('ts-expander')) {
            const li = target.closest('li')
            li.classList.toggle('ts-closed')
            li.classList.toggle('ts-open')
            event.stopPropagation()
            return
        }

        // Show card
        if (target.classList.contains('ts-card') || (event.altKey && target.classList.contains('ts-title'))) {
            this.showCard(target.closest('.ts-entry').id)
            event.stopPropagation()
            return
        }

        // Add child
        if (target.classList.contains('ts-addChild')) {
            const entryId = target.closest('.ts-entry').id
            this.eventBus.emit('view:addChild', { parentId: entryId })
            event.stopPropagation()
            return
        }

        // Delete node
        if (target.classList.contains('ts-delete')) {
            const entryId = target.closest('.ts-entry').id
            if (confirm('Are you sure you want to delete this item and all its children?')) {
                this.eventBus.emit('view:deleteNode', { nodeId: entryId })
            }
            event.stopPropagation()
            return
        }

        // Select node
        if (target.classList.contains('ts-entry') || target.classList.contains('ts-title')) {
            const entry = target.classList.contains('ts-entry') ? target : target.closest('.ts-entry')
            this.selectNode(entry.id)
            event.stopPropagation()
            return
        }
    }

    /**
     * Handles double-click events on the tree
     */
    handleDblClick(event) {
        const target = event.target

        // Edit title
        if (target.classList.contains('ts-title')) {
            this.startEditing(target)
            event.stopPropagation()
        }
    }

    /**
     * Starts editing a node title
     * @param {HTMLElement} titleElement - The title element to edit
     */
    startEditing(titleElement) {
        titleElement.contentEditable = true
        titleElement.focus()
        this.editingId = titleElement.closest('.ts-entry').id

        // Select all text
        const range = document.createRange()
        range.selectNodeContents(titleElement)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
    }

    /**
     * Handles keyboard events while editing nodes
     */
    handleKeyDown(event) {
        // Only process events in editable elements
        if (!event.target.isContentEditable) return

        const entry = event.target.closest('.ts-entry')
        if (!entry) return

        switch (event.key) {
            case 'Enter':
                if (event.shiftKey) {
                    // Allow shift+enter for line breaks
                    return
                }

                // Save the current edit
                event.preventDefault()
                event.target.contentEditable = false
                this.editingId = null

                // Update node title
                const nodeId = entry.id
                const newTitle = event.target.textContent.trim()
                this.eventBus.emit('view:updateNode', { nodeId, properties: { title: newTitle } })

                const nodeLi = this.nodeElements.get(nodeId)
                if (nodeLi) {
                    // Check if this is the first node
                    const isFirstNode =
                        nodeLi.parentElement.classList.contains('ts-root') &&
                        !nodeLi.previousElementSibling

                    if (isFirstNode) {
                        // Add a child to the first node
                        this.eventBus.emit('view:addChild', { parentId: nodeId })
                    } else {
                        // Add a sibling for all other nodes
                        this.eventBus.emit('view:addSibling', { nodeId })
                    }
                }
                break

            case 'Tab':
                event.preventDefault()
                if (event.shiftKey) {
                    // Outdent
                    this.eventBus.emit('view:outdentNode', { nodeId: entry.id })
                } else {
                    // Indent
                    this.eventBus.emit('view:indentNode', { nodeId: entry.id })
                }
                break

            case 'Escape':
                // Cancel edit
                event.preventDefault()
                event.target.contentEditable = false
                this.editingId = null
                this.selectNode(entry.id)
                break

            case 'ArrowUp':
                if (event.ctrlKey) {
                    // Move node up
                    event.preventDefault()
                    this.moveNodeUp(entry.id)
                } else {
                    // Navigate up
                    event.preventDefault()
                    this.navigateUp(entry.id)
                }
                break

            case 'ArrowDown':
                if (event.ctrlKey) {
                    // Move node down
                    event.preventDefault()
                    this.moveNodeDown(entry.id)
                } else {
                    // Navigate down
                    event.preventDefault()
                    this.navigateDown(entry.id)
                }
                break
        }
    }

    /**
     * Moves a node up in its parent's children list
     * @param {string} nodeId - The ID of the node to move
     */
    moveNodeUp(nodeId) {
        const nodeLi = this.nodeElements.get(nodeId)
        if (!nodeLi) return

        const parent = nodeLi.parentElement
        const prevLi = nodeLi.previousElementSibling

        if (!prevLi) return // Already at the top

        const parentNode = parent.closest('li')
        const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root'

        // Find index
        const children = Array.from(parent.children)
        const currentIndex = children.indexOf(nodeLi)
        const newIndex = currentIndex - 1

        this.eventBus.emit('view:moveNode', {
            nodeId,
            newParentId: parentId,
            newIndex
        })

        // Update the DOM directly for immediate feedback
        parent.insertBefore(nodeLi, prevLi)
    }

    /**
     * Moves a node down in its parent's children list
     * @param {string} nodeId - The ID of the node to move
     */
    moveNodeDown(nodeId) {
        const nodeLi = this.nodeElements.get(nodeId)
        if (!nodeLi) return

        const parent = nodeLi.parentElement
        const nextLi = nodeLi.nextElementSibling

        if (!nextLi) return // Already at the bottom

        const parentNode = parent.closest('li')
        const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root'

        // Find index
        const children = Array.from(parent.children)
        const currentIndex = children.indexOf(nodeLi)
        const newIndex = currentIndex + 1

        this.eventBus.emit('view:moveNode', {
            nodeId,
            newParentId: parentId,
            newIndex
        })

        // Update the DOM directly for immediate feedback
        if (nextLi.nextElementSibling) {
            parent.insertBefore(nodeLi, nextLi.nextElementSibling)
        } else {
            parent.appendChild(nodeLi)
        }
    }

    /**
     * Handles focus events
     */
    handleFocus(event) {
        if (event.target.classList.contains('ts-title')) {
            const entry = event.target.closest('.ts-entry')
            this.selectNode(entry.id)
        }
    }

    /**
     * Handles blur events
     */
    handleBlur(event) {
        if (event.target.classList.contains('ts-title') && event.target.isContentEditable) {
            // Save changes on blur
            const entry = event.target.closest('.ts-entry')
            const nodeId = entry.id
            const newTitle = event.target.textContent.trim()

            this.eventBus.emit('view:updateNode', { nodeId, properties: { title: newTitle } })

            // Make non-editable
            event.target.contentEditable = false
            this.editingId = null
        }
    }

    /**
     * Initializes drag and drop functionality
     */
    initDragAndDrop() {
        // First remove any existing listeners to prevent duplicates
        this.cleanupDragListeners()

        // Setup drag handles
        const handles = this.rootElement.querySelectorAll('.ts-handle')
        handles.forEach(handle => {
            // Store the bound functions for later removal
            handle._dragStartHandler = this.handleDragStart.bind(this)

            handle.setAttribute('draggable', 'true')
            handle.addEventListener('mousedown', handle._dragStartHandler)
            handle.addEventListener('dragstart', handle._dragStartHandler)
        })

        // Setup entries as draggable
        const entries = this.rootElement.querySelectorAll('.ts-entry')
        entries.forEach(entry => {
            entry.setAttribute('draggable', 'true')
        })

        // Setup drop zones
        const dropzones = this.rootElement.querySelectorAll('.dropzone')
        dropzones.forEach(dropzone => {
            // Store the bound functions for later removal
            dropzone._dragOverHandler = this.handleDragOver.bind(this)
            dropzone._dragLeaveHandler = this.handleDragLeave.bind(this)
            dropzone._dropHandler = this.handleDrop.bind(this)

            dropzone.addEventListener('dragover', dropzone._dragOverHandler)
            dropzone.addEventListener('dragleave', dropzone._dragLeaveHandler)
            dropzone.addEventListener('drop', dropzone._dropHandler)
        })

        // Setup drag enter for items
        const items = this.rootElement.querySelectorAll('li')
        items.forEach(item => {
            // Store the bound function for later removal
            item._dragEnterHandler = this.handleDragEnter.bind(this)

            item.addEventListener('dragenter', item._dragEnterHandler)
        })
    }

    /**
     * Cleans up drag and drop event listeners
     */
    cleanupDragListeners() {
        // Clean up drag handles
        const handles = this.rootElement.querySelectorAll('.ts-handle')
        handles.forEach(handle => {
            if (handle._dragStartHandler) {
                handle.removeEventListener('mousedown', handle._dragStartHandler)
                handle.removeEventListener('dragstart', handle._dragStartHandler)
                delete handle._dragStartHandler
            }
        })

        // Clean up drop zones
        const dropzones = this.rootElement.querySelectorAll('.dropzone')
        dropzones.forEach(dropzone => {
            if (dropzone._dragOverHandler) {
                dropzone.removeEventListener('dragover', dropzone._dragOverHandler)
                delete dropzone._dragOverHandler
            }
            if (dropzone._dragLeaveHandler) {
                dropzone.removeEventListener('dragleave', dropzone._dragLeaveHandler)
                delete dropzone._dragLeaveHandler
            }
            if (dropzone._dropHandler) {
                dropzone.removeEventListener('drop', dropzone._dropHandler)
                delete dropzone._dropHandler
            }
        })

        // Clean up list items
        const items = this.rootElement.querySelectorAll('li')
        items.forEach(item => {
            if (item._dragEnterHandler) {
                item.removeEventListener('dragenter', item._dragEnterHandler)
                delete item._dragEnterHandler
            }
        })
    }

    /**
     * Handles the start of dragging
     */
    handleDragStart(event) {
        // Prevent bubbling to avoid multiple drag starts
        event.stopPropagation()

        // Find the closest entry
        const entry = event.target.closest('.ts-entry')
        if (!entry) {
            console.log('No entry found in drag start')
            return
        }

        // Store the dragged node ID
        this.draggedNodeId = entry.id
        console.log('Drag started for node:', this.draggedNodeId)

        // Set drag data transfer
        if (event.dataTransfer) {
            // Clear any existing data
            event.dataTransfer.clearData()

            // Set the node ID as data
            event.dataTransfer.setData('text/plain', entry.id)
            event.dataTransfer.setData('application/x-node-id', entry.id)
            event.dataTransfer.effectAllowed = 'move'

            // Create custom drag image
            try {
                const dragImage = entry.cloneNode(true)
                dragImage.style.width = `${entry.offsetWidth}px`
                dragImage.style.opacity = '0.7'
                dragImage.style.position = 'absolute'
                dragImage.style.top = '-1000px'
                document.body.appendChild(dragImage)
                event.dataTransfer.setDragImage(dragImage, 10, 10)

                // Clean up
                setTimeout(() => {
                    document.body.removeChild(dragImage)
                }, 10)
            } catch (err) {
                console.warn('Error setting drag image:', err)
                // Continue without custom drag image if it fails
            }
        }

        // Add dragging class
        entry.classList.add('ts-dragging')

        // Select the node
        this.selectNode(entry.id)

        // Update UI to show drag state
        const listItem = entry.closest('li')
        if (listItem) {
            listItem.classList.add('ts-dragging-item')
        }

        // Set a global class on body to indicate drag is in progress
        document.body.classList.add('ts-dragging-active')

        // Add a cleanup function for the end of drag
        const dragEndHandler = () => {
            this.handleDragEnd()
            document.removeEventListener('dragend', dragEndHandler)
        }

        document.addEventListener('dragend', dragEndHandler)
    }

    /**
     * Handles the end of dragging
     */
    handleDragEnd() {
        console.log('Drag ended')

        // Clean up dragging classes
        document.querySelectorAll('.ts-dragging').forEach(el => {
            el.classList.remove('ts-dragging')
        })

        document.querySelectorAll('.ts-dragging-item').forEach(el => {
            el.classList.remove('ts-dragging-item')
        })

        document.querySelectorAll('.ts-highlight').forEach(el => {
            el.classList.remove('ts-highlight')
        })

        document.querySelectorAll('.dropzone.active').forEach(el => {
            el.classList.remove('active')
        })

        // Remove global dragging class
        document.body.classList.remove('ts-dragging-active')

        // Reset drag state
        this.draggedNodeId = null
        this.dragTarget = null
    }

    /**
     * Handles dragging over a drop zone
     */
    handleDragOver(event) {
        // Allow drop
        event.preventDefault()
        event.stopPropagation()

        if (!this.draggedNodeId) return

        // Find the dropzone element
        let dropzone = event.target
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement
        }

        if (!dropzone) return

        // Add active class
        dropzone.classList.add('active')

        // Set the drop effect
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.dropEffect = 'move'
    }

    /**
     * Handles leaving a drop zone
     */
    handleDragLeave(event) {
        // Find the dropzone element
        let dropzone = event.target
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement
        }

        if (!dropzone) return

        // Remove active class
        dropzone.classList.remove('active')
    }

    /**
     * Handles entering a node during drag
     */
    handleDragEnter(event) {
        const li = event.target.closest('li')
        if (!li || !this.draggedNodeId) return

        // Store the drag target
        this.dragTarget = li

        // Add highlight class
        li.classList.add('ts-highlight')

        // Auto-expand closed nodes after hovering
        if (this.dragEnterTimer) {
            clearTimeout(this.dragEnterTimer)
        }

        this.dragEnterTimer = setTimeout(() => {
            if (li.classList.contains('ts-closed')) {
                li.classList.remove('ts-closed')
                li.classList.add('ts-open')
            }
        }, 700)
    }

    /**
     * Handles dropping a node
     */
    handleDrop(event) {
        // Prevent default behavior
        event.preventDefault()
        event.stopPropagation()

        // Ensure we're working with the dropzone element
        let dropzone = event.target
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement
        }

        if (!dropzone) return

        // Remove active class
        dropzone.classList.remove('active')

        // Check if we have a dragged node
        if (!this.draggedNodeId) {
            console.log('No dragged node ID')
            return
        }

        const draggedLi = this.nodeElements.get(this.draggedNodeId)
        if (!draggedLi) {
            console.log('Dragged node element not found')
            return
        }

        // Get target list item
        const targetLi = dropzone.closest('li')
        if (!targetLi) {
            console.log('Target list item not found')
            return
        }

        // Get target entry
        const targetEntry = targetLi.querySelector('.ts-entry')
        if (!targetEntry) {
            console.log('Target entry not found')
            return
        }

        // Prevent dropping onto a child element
        if (draggedLi.contains(targetLi)) {
            console.warn('Cannot drop onto a child element')
            return
        }

        // Get parent UL and determine position
        const parentUl = targetLi.parentElement

        // Check if we're dropping before or onto the target
        // We're dropping before if the dropzone is the first child of the list item
        const dropzones = Array.from(targetLi.querySelectorAll('.dropzone'))
        const isDropAfter = dropzones.indexOf(dropzone) === 0

        console.log('Drop position:', isDropAfter ? 'before' : 'as child')

        let newParentId
        let newIndex

        if (isDropAfter) {
            // Drop as sibling before the target
            const parentNode = parentUl.closest('li')
            newParentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root'

            // Get index in siblings
            const siblings = Array.from(parentUl.children)
            newIndex = siblings.indexOf(targetLi)

            console.log('Drop as sibling - Parent:', newParentId, 'Index:', newIndex)
        } else {
            // Drop as child of the target
            newParentId = targetLi.dataset.nodeId

            // Get or create a child list
            let childUl = targetLi.querySelector('ul')
            if (!childUl) {
                childUl = document.createElement('ul')
                targetLi.appendChild(childUl)
                targetLi.classList.remove('ts-closed')
                targetLi.classList.add('ts-open')
            }

            // Add to the end of children
            newIndex = childUl.children.length

            console.log('Drop as child - Parent:', newParentId, 'Index:', newIndex)
        }

        // Emit move event
        console.log('Moving node:', this.draggedNodeId, 'to parent:', newParentId, 'at index:', newIndex)
        this.eventBus.emit('view:moveNode', {
            nodeId: this.draggedNodeId,
            newParentId: newParentId,
            newIndex: newIndex
        })

        // Update the DOM for immediate feedback
        if (isDropAfter) {
            // Insert before target
            parentUl.insertBefore(draggedLi, targetLi)
        } else {
            // Append to target's children
            const childUl = targetLi.querySelector('ul')
            childUl.appendChild(draggedLi)
        }

        // Clean up
        this.draggedNodeId = null
        draggedLi.classList.remove('ts-dragging')

        // Remove highlights
        document.querySelectorAll('.ts-highlight').forEach(el => {
            el.classList.remove('ts-highlight')
        })

        // Reinitialize drag and drop for the moved elements
        this.initDragAndDrop()

        // Add contextual add buttons
        this.addContextualAddButtons()
    }

    /**
     * Selects a node
     * @param {string} nodeId - The ID of the node to select
     */
    selectNode(nodeId) {
        // Deselect previous
        if (this.selectedNodeId) {
            const prevSelected = document.getElementById(this.selectedNodeId)
            if (prevSelected) {
                prevSelected.classList.remove('ts-selected')
            }
        }

        // Select new
        this.selectedNodeId = nodeId
        const entry = document.getElementById(nodeId)
        if (entry) {
            entry.classList.add('ts-selected')

            // Ensure it's visible
            entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }

    /**
     * Navigates to the node above the current one
     * @param {string} currentNodeId - The ID of the current node
     */
    navigateUp(currentNodeId) {
        const currentLi = this.nodeElements.get(currentNodeId)
        if (!currentLi) return

        let prevLi = currentLi.previousElementSibling

        if (prevLi) {
            // Find the deepest last child of the previous sibling if expanded
            while (prevLi.classList.contains('ts-open') && prevLi.querySelector('ul')?.lastElementChild) {
                prevLi = prevLi.querySelector('ul').lastElementChild
            }

            // Select the found node
            const prevId = prevLi.querySelector('.ts-entry').id
            this.selectNode(prevId)
        } else {
            // Go to parent if no previous sibling
            const parentLi = currentLi.parentElement.closest('li')
            if (parentLi) {
                const parentId = parentLi.querySelector('.ts-entry').id
                this.selectNode(parentId)
            }
        }
    }

    /**
     * Navigates to the node below the current one
     * @param {string} currentNodeId - The ID of the current node
     */
    navigateDown(currentNodeId) {
        const currentLi = this.nodeElements.get(currentNodeId)
        if (!currentLi) return

        // Check for children first if expanded
        if (currentLi.classList.contains('ts-open')) {
            const firstChild = currentLi.querySelector('ul > li')
            if (firstChild) {
                const childId = firstChild.querySelector('.ts-entry').id
                this.selectNode(childId)
                return
            }
        }

        // Check for next sibling
        let nextLi = currentLi.nextElementSibling
        if (nextLi) {
            const nextId = nextLi.querySelector('.ts-entry').id
            this.selectNode(nextId)
            return
        }

        // Walk up the tree and find the next sibling of a parent
        let parent = currentLi.parentElement.closest('li')
        while (parent) {
            const parentNext = parent.nextElementSibling
            if (parentNext) {
                const nextId = parentNext.querySelector('.ts-entry').id
                this.selectNode(nextId)
                return
            }
            parent = parent.parentElement.closest('li')
        }
    }

    /**
     * Shows the card view for a node
     * @param {string} nodeId - The ID of the node to show
     */
    showCard(nodeId) {
        const entry = document.getElementById(nodeId)
        if (!entry) return

        // Get node info
        const title = entry.querySelector('.ts-title').textContent
        const date = entry.querySelector('.date').textContent

        // Get full node data
        this.eventBus.emit('view:getNodeData', {
            nodeId,
            callback: (node) => {
                const card = document.getElementById('card')
                const cardTitle = document.getElementById('card-title')
                const cardNid = document.getElementById('card-nid')
                const cardDate = document.getElementById('card-date')
                const cardDescription = document.getElementById('card-description')

                // Set card content
                cardTitle.textContent = title
                cardNid.textContent = nodeId
                cardDate.textContent = date

                // Set description
                cardDescription.value = node.description || ''

                // Store node ID with the card
                card.dataset.nodeId = nodeId

                // Show the card
                card.classList.remove('hidden')

                // Focus description field
                cardDescription.focus()
            }
        })
    }

    /**
     * Handles a node being added
     * @param {Object} data - The node data
     */
    handleNodeAdded(data) {
        const { node, parentId } = data

        // Find parent element
        let parentElement
        if (parentId === 'trestle-root') {
            parentElement = this.rootElement.querySelector('ul')

            // Remove empty state if present
            const emptyState = parentElement.querySelector('.ts-empty-state')
            if (emptyState) {
                emptyState.remove()
            }
        } else {
            const parentLi = this.nodeElements.get(parentId)
            if (!parentLi) {
                console.error('Parent not found:', parentId)
                return
            }

            // Get or create child list
            let ul = parentLi.querySelector('ul')
            if (!ul) {
                ul = document.createElement('ul')
                parentLi.appendChild(ul)
                parentLi.classList.remove('ts-closed')
                parentLi.classList.add('ts-open')
            }

            parentElement = ul
        }

        // Create node map for rendering
        const nodesMap = new Map()
        nodesMap.set(node.id, node)

        // Render the new node
        const newNodeElement = this.renderNode(node.id, parentElement, nodesMap)

        // Start editing immediately
        if (newNodeElement) {
            const titleElement = newNodeElement.querySelector('.ts-title')
            this.selectNode(node.id)

            // Make editable and focus
            setTimeout(() => {
                this.startEditing(titleElement)
            }, 10)
        }

        // Initialize drag and drop for new nodes
        this.initDragAndDrop()

        // Add contextual add buttons
        this.addContextualAddButtons()
    }

    /**
     * Handles a node being updated
     * @param {Object} data - The update data
     */
    handleNodeUpdated(data) {
        const { nodeId, properties } = data

        // Find entry
        const nodeEntry = document.getElementById(nodeId)
        if (!nodeEntry) return

        // Update title if changed
        if (properties.title !== undefined) {
            const titleElement = nodeEntry.querySelector('.ts-title')
            titleElement.textContent = properties.title
        }
    }

    /**
     * Handles a node being deleted
     * @param {Object} data - The delete data
     */
    handleNodeDeleted(data) {
        const { nodeId } = data

        // Find node
        const nodeLi = this.nodeElements.get(nodeId)
        if (nodeLi) {
            // Check if this is the last item in a list
            const parent = nodeLi.parentElement
            const isLastInList = parent.children.length === 1

            // Remove the node
            nodeLi.remove()
            this.nodeElements.delete(nodeId)

            // If it was the last item and the parent is the root, show empty state
            if (isLastInList && parent.classList.contains('ts-root')) {
                this.showEmptyState(parent)
            }
        }
    }

    /**
     * Handles a node being indented
     * @param {Object} data - The indent data
     */
    handleNodeIndented(data) {
        const { nodeId, newParentId } = data

        // Find nodes
        const nodeLi = this.nodeElements.get(nodeId)
        const newParentLi = this.nodeElements.get(newParentId)

        if (!nodeLi || !newParentLi) return

        // Get or create child list for new parent
        let parentUl = newParentLi.querySelector('ul')
        if (!parentUl) {
            parentUl = document.createElement('ul')
            newParentLi.appendChild(parentUl)
            newParentLi.classList.remove('ts-closed')
            newParentLi.classList.add('ts-open')
        }

        // Move the node to the end of the new parent's children
        parentUl.appendChild(nodeLi)

        // Reinitialize drag and drop
        this.initDragAndDrop()

        // Add contextual add buttons
        this.addContextualAddButtons()
    }

    /**
     * Handles a node being outdented
     * @param {Object} data - The outdent data
     */
    handleNodeOutdented(data) {
        const { nodeId, newParentId } = data

        // Find nodes
        const nodeLi = this.nodeElements.get(nodeId)
        if (!nodeLi) return

        const oldParentLi = nodeLi.parentElement.closest('li')
        if (!oldParentLi) return

        // Find new parent list
        let newParentList
        if (newParentId === 'trestle-root') {
            newParentList = this.rootElement.querySelector('ul')
        } else {
            const newParentLi = this.nodeElements.get(newParentId)
            if (!newParentLi) return

            // Get parent's parent list
            newParentList = newParentLi.parentElement
        }

        if (!newParentList) return

        // Insert after the old parent
        if (oldParentLi.nextElementSibling) {
            newParentList.insertBefore(nodeLi, oldParentLi.nextElementSibling)
        } else {
            newParentList.appendChild(nodeLi)
        }

        // Reinitialize drag and drop
        this.initDragAndDrop()

        // Add contextual add buttons
        this.addContextualAddButtons()
    }
}