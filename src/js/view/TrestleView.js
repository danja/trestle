export class TrestleView {
    constructor(rootElement, eventBus) {
        this.rootElement = rootElement
        this.eventBus = eventBus
        this.template = document.getElementById('entry-template')
        this.nodeElements = new Map()
        this.selectedNodeId = null
        this.draggedNodeId = null
        this.dragTarget = null
        this.editingId = null

        this.eventBus.on('model:loaded', this.renderTree.bind(this))
        this.eventBus.on('model:created', this.renderTree.bind(this))
        this.eventBus.on('node:added', this.handleNodeAdded.bind(this))
        this.eventBus.on('node:updated', this.handleNodeUpdated.bind(this))
        this.eventBus.on('node:deleted', this.handleNodeDeleted.bind(this))
        this.eventBus.on('view:nodeIndented', this.handleNodeIndented.bind(this))
        this.eventBus.on('view:nodeOutdented', this.handleNodeOutdented.bind(this))

        document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this))
    }

    renderTree(data) {
        console.log('Rendering tree with data:', data) // Debugging output
        this.rootElement.innerHTML = ''
        this.nodeElements.clear()

        let rootNode = data.nodes.find(node => node.type === 'RootNode')
        console.log('Root node:', rootNode) // Debugging log for root node
        if (!rootNode) {
            console.error('No root node found. Data received:', data)
            const fallbackRootNode = data.nodes[0]
            if (fallbackRootNode) {
                console.warn('Falling back to first node as root:', fallbackRootNode)
                rootNode = fallbackRootNode
            } else {
                return
            }
        }

        const tree = this.buildTreeStructure(data.nodes, rootNode.id)

        const rootUl = document.createElement('ul')
        rootUl.className = 'ts-root'
        this.rootElement.appendChild(rootUl)

        for (const childId of tree.children || []) {
            this.renderNode(childId, rootUl, tree.nodes)
        }

        this.setupEventListeners()

        this.initDragAndDrop()

        this.addContextualAddButtons()

        if (!(tree.children && tree.children.length)) {
            console.warn('No children found for root node. Rendering root node only.')
            this.renderNode(rootNode.id, rootUl, tree.nodes)
        }
    }

    buildTreeStructure(nodes, rootId) {
        const nodesMap = new Map()

        for (const node of nodes) {
            nodesMap.set(node.id, { ...node })
        }

        for (const node of nodesMap.values()) {
            if (node.children) {
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

    renderNode(nodeId, parentElement, nodesMap) {
        const node = nodesMap.get(nodeId)
        if (!node) return null

        const li = document.createElement('li')
        li.dataset.nodeId = nodeId

        const dropzone = document.createElement('div')
        dropzone.className = 'dropzone'
        li.appendChild(dropzone)

        const entry = this.template.content.cloneNode(true).querySelector('.ts-entry')
        entry.id = nodeId

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

        if (parentElement) {
            parentElement.appendChild(li)
        }

        return li
    }

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

    setupEventListeners() {
        this.rootElement.addEventListener('click', this.handleClick.bind(this))
        this.rootElement.addEventListener('dblclick', this.handleDblClick.bind(this))
        this.rootElement.addEventListener('keydown', this.handleKeyDown.bind(this))
        this.rootElement.addEventListener('focus', this.handleFocus.bind(this), true)
        this.rootElement.addEventListener('blur', this.handleBlur.bind(this), true)

        document.addEventListener('click', (event) => {
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

    handleGlobalKeyDown(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault()
            document.getElementById('saveButton').click()
        }

        if (event.key === 'Escape' && this.editingId) {
            const editingTitle = document.getElementById(this.editingId)?.querySelector('.ts-title')
            if (editingTitle && editingTitle.isContentEditable) {
                editingTitle.blur()
                this.selectNode(this.editingId)
                this.editingId = null
            }
        }
    }

    handleClick(event) {
        const target = event.target

        if (target.classList.contains('ts-expander')) {
            const li = target.closest('li')
            li.classList.toggle('ts-closed')
            li.classList.toggle('ts-open')
            event.stopPropagation()
            return
        }

        if (target.classList.contains('ts-card') || (event.altKey && target.classList.contains('ts-title'))) {
            this.showCard(target.closest('.ts-entry').id)
            event.stopPropagation()
            return
        }

        if (target.classList.contains('ts-addChild')) {
            const entryId = target.closest('.ts-entry').id
            this.eventBus.emit('view:addChild', { parentId: entryId })
            event.stopPropagation()
            return
        }

        if (target.classList.contains('ts-delete')) {
            const entryId = target.closest('.ts-entry').id
            if (confirm('Are you sure you want to delete this item and all its children?')) {
                this.eventBus.emit('view:deleteNode', { nodeId: entryId })
            }
            event.stopPropagation()
            return
        }

        if (target.classList.contains('ts-entry') || target.classList.contains('ts-title')) {
            const entry = target.classList.contains('ts-entry') ? target : target.closest('.ts-entry')
            this.selectNode(entry.id)
            event.stopPropagation()
            return
        }
    }

    handleDblClick(event) {
        const target = event.target

        if (target.classList.contains('ts-title')) {
            this.startEditing(target)
            event.stopPropagation()
        }
    }

    startEditing(titleElement) {
        titleElement.contentEditable = true
        titleElement.focus()
        this.editingId = titleElement.closest('.ts-entry').id

        const range = document.createRange()
        range.selectNodeContents(titleElement)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
    }

    handleKeyDown(event) {
        if (!event.target.isContentEditable) return

        const entry = event.target.closest('.ts-entry')
        if (!entry) return

        const nodeId = entry.id
        const nodeLi = this.nodeElements.get(nodeId)
        if (!nodeLi) return

        switch (event.key) {
            case 'Tab':
                event.preventDefault()
                if (event.shiftKey) {
                    // Outdent logic
                    const parentLi = nodeLi.parentElement.closest('li')
                    if (!parentLi) return // Already at the top level

                    const grandParentUl = parentLi.parentElement
                    if (!grandParentUl) return

                    const newParentId = grandParentUl.closest('li')?.dataset.nodeId || 'trestle-root'

                    grandParentUl.insertBefore(nodeLi, parentLi.nextElementSibling)

                    this.eventBus.emit('view:moveNode', {
                        nodeId,
                        newParentId,
                        newIndex: Array.from(grandParentUl.children).indexOf(nodeLi)
                    })
                } else {
                    // Indent logic
                    const prevLi = nodeLi.previousElementSibling
                    if (!prevLi) return // No previous sibling to indent under

                    const newParentId = prevLi.dataset.nodeId
                    let childUl = prevLi.querySelector('ul')
                    if (!childUl) {
                        childUl = document.createElement('ul')
                        prevLi.appendChild(childUl)
                        prevLi.classList.remove('ts-closed')
                        prevLi.classList.add('ts-open')
                    }

                    childUl.appendChild(nodeLi)

                    this.eventBus.emit('view:moveNode', {
                        nodeId,
                        newParentId,
                        newIndex: Array.from(childUl.children).indexOf(nodeLi)
                    })
                }
                break

            case 'Enter':
                if (event.shiftKey) {
                    return
                }

                event.preventDefault()
                event.target.contentEditable = false
                this.editingId = null

                const newTitle = event.target.textContent.trim()
                this.eventBus.emit('view:updateNode', { nodeId, properties: { title: newTitle } })

                const isFirstNode =
                    nodeLi.parentElement.classList.contains('ts-root') &&
                    !nodeLi.previousElementSibling

                if (isFirstNode) {
                    this.eventBus.emit('view:addChild', { parentId: nodeId })
                } else {
                    this.eventBus.emit('view:addSibling', { nodeId })
                }
                break

            case 'Escape':
                event.preventDefault()
                event.target.contentEditable = false
                this.editingId = null
                this.selectNode(nodeId)
                break

            case 'ArrowUp':
                if (event.ctrlKey) {
                    event.preventDefault()
                    this.moveNodeUp(nodeId)
                } else {
                    event.preventDefault()
                    this.navigateUp(nodeId)
                }
                break

            case 'ArrowDown':
                if (event.ctrlKey) {
                    event.preventDefault()
                    this.moveNodeDown(nodeId)
                } else {
                    event.preventDefault()
                    this.navigateDown(nodeId)
                }
                break
        }
    }

    moveNodeUp(nodeId) {
        const nodeLi = this.nodeElements.get(nodeId)
        if (!nodeLi) return

        const parent = nodeLi.parentElement
        const prevLi = nodeLi.previousElementSibling

        if (!prevLi) return

        const parentNode = parent.closest('li')
        const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root'

        const children = Array.from(parent.children)
        const currentIndex = children.indexOf(nodeLi)
        const newIndex = currentIndex - 1

        this.eventBus.emit('view:moveNode', {
            nodeId,
            newParentId: parentId,
            newIndex
        })

        parent.insertBefore(nodeLi, prevLi)
    }

    moveNodeDown(nodeId) {
        const nodeLi = this.nodeElements.get(nodeId)
        if (!nodeLi) return

        const parent = nodeLi.parentElement
        const nextLi = nodeLi.nextElementSibling

        if (!nextLi) return

        const parentNode = parent.closest('li')
        const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root'

        const children = Array.from(parent.children)
        const currentIndex = children.indexOf(nodeLi)
        const newIndex = currentIndex + 1

        this.eventBus.emit('view:moveNode', {
            nodeId,
            newParentId: parentId,
            newIndex
        })

        if (nextLi.nextElementSibling) {
            parent.insertBefore(nodeLi, nextLi.nextElementSibling)
        } else {
            parent.appendChild(nodeLi)
        }
    }

    handleFocus(event) {
        if (event.target.classList.contains('ts-title')) {
            const entry = event.target.closest('.ts-entry')
            this.selectNode(entry.id)
        }
    }

    handleBlur(event) {
        if (event.target.classList.contains('ts-title') && event.target.isContentEditable) {
            const entry = event.target.closest('.ts-entry')
            const nodeId = entry.id
            const newTitle = event.target.textContent.trim()

            this.eventBus.emit('view:updateNode', { nodeId, properties: { title: newTitle } })

            event.target.contentEditable = false
            this.editingId = null
        }
    }

    initDragAndDrop() {
        this.cleanupDragListeners()

        const handles = this.rootElement.querySelectorAll('.ts-handle')
        handles.forEach(handle => {
            handle._dragStartHandler = this.handleDragStart.bind(this)

            handle.setAttribute('draggable', 'true')
            handle.addEventListener('mousedown', handle._dragStartHandler)
            handle.addEventListener('dragstart', handle._dragStartHandler)
        })

        const entries = this.rootElement.querySelectorAll('.ts-entry')
        entries.forEach(entry => {
            entry.setAttribute('draggable', 'true')
        })

        const dropzones = this.rootElement.querySelectorAll('.dropzone')
        dropzones.forEach(dropzone => {
            dropzone._dragOverHandler = this.handleDragOver.bind(this)
            dropzone._dragLeaveHandler = this.handleDragLeave.bind(this)
            dropzone._dropHandler = this.handleDrop.bind(this)

            dropzone.addEventListener('dragover', dropzone._dragOverHandler)
            dropzone.addEventListener('dragleave', dropzone._dragLeaveHandler)
            dropzone.addEventListener('drop', dropzone._dropHandler)
        })

        const items = this.rootElement.querySelectorAll('li')
        items.forEach(item => {
            item._dragEnterHandler = this.handleDragEnter.bind(this)

            item.addEventListener('dragenter', item._dragEnterHandler)
        })
    }

    cleanupDragListeners() {
        const handles = this.rootElement.querySelectorAll('.ts-handle')
        handles.forEach(handle => {
            if (handle._dragStartHandler) {
                handle.removeEventListener('mousedown', handle._dragStartHandler)
                handle.removeEventListener('dragstart', handle._dragStartHandler)
                delete handle._dragStartHandler
            }
        })

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

        const items = this.rootElement.querySelectorAll('li')
        items.forEach(item => {
            if (item._dragEnterHandler) {
                item.removeEventListener('dragenter', item._dragEnterHandler)
                delete item._dragEnterHandler
            }
        })
    }

    handleDragStart(event) {
        event.stopPropagation()

        const entry = event.target.closest('.ts-entry')
        if (!entry) {
            console.log('No entry found in drag start')
            return
        }

        this.draggedNodeId = entry.id
        console.log('Drag started for node:', this.draggedNodeId)

        if (event.dataTransfer) {
            event.dataTransfer.clearData()

            event.dataTransfer.setData('text/plain', entry.id)
            event.dataTransfer.setData('application/x-node-id', entry.id)
            event.dataTransfer.effectAllowed = 'move'

            try {
                const dragImage = entry.cloneNode(true)
                dragImage.style.width = `${entry.offsetWidth}px`
                dragImage.style.opacity = '0.7'
                dragImage.style.position = 'absolute'
                dragImage.style.top = '-1000px'
                document.body.appendChild(dragImage)
                event.dataTransfer.setDragImage(dragImage, 10, 10)

                setTimeout(() => {
                    document.body.removeChild(dragImage)
                }, 10)
            } catch (err) {
                console.warn('Error setting drag image:', err)
            }
        }

        entry.classList.add('ts-dragging')

        this.selectNode(entry.id)

        const listItem = entry.closest('li')
        if (listItem) {
            listItem.classList.add('ts-dragging-item')
        }

        document.body.classList.add('ts-dragging-active')

        const dragEndHandler = () => {
            this.handleDragEnd()
            document.removeEventListener('dragend', dragEndHandler)
        }

        document.addEventListener('dragend', dragEndHandler)
    }

    handleDragEnd() {
        console.log('Drag ended')

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

        document.body.classList.remove('ts-dragging-active')

        this.draggedNodeId = null
        this.dragTarget = null
    }

    handleDragOver(event) {
        event.preventDefault()
        event.stopPropagation()

        if (!this.draggedNodeId) return

        let dropzone = event.target
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement
        }

        if (!dropzone) return

        dropzone.classList.add('active')

        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.dropEffect = 'move'
    }

    handleDragLeave(event) {
        let dropzone = event.target
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement
        }

        if (!dropzone) return

        dropzone.classList.remove('active')
    }

    handleDragEnter(event) {
        const li = event.target.closest('li')
        if (!li || !this.draggedNodeId) return

        this.dragTarget = li

        li.classList.add('ts-highlight')

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

    handleDrop(event) {
        event.preventDefault()
        event.stopPropagation()

        let dropzone = event.target
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement
        }

        if (!dropzone) return

        dropzone.classList.remove('active')

        if (!this.draggedNodeId) {
            console.log('No dragged node ID')
            return
        }

        const draggedLi = this.nodeElements.get(this.draggedNodeId)
        if (!draggedLi) {
            console.log('Dragged node element not found')
            return
        }

        const targetLi = dropzone.closest('li')
        if (!targetLi) {
            console.log('Target list item not found')
            return
        }

        if (draggedLi.contains(targetLi)) {
            console.warn('Cannot drop onto a child element')
            return
        }

        const dropPosition = event.offsetX / targetLi.offsetWidth
        if (dropPosition > 0.5) {
            // Indent logic
            const newParentId = targetLi.dataset.nodeId
            let childUl = targetLi.querySelector('ul')
            if (!childUl) {
                childUl = document.createElement('ul')
                targetLi.appendChild(childUl)
                targetLi.classList.remove('ts-closed')
                targetLi.classList.add('ts-open')
            }

            childUl.appendChild(draggedLi)

            this.eventBus.emit('view:moveNode', {
                nodeId: this.draggedNodeId,
                newParentId,
                newIndex: Array.from(childUl.children).indexOf(draggedLi)
            })
        } else {
            // Outdent logic
            const parentUl = targetLi.parentElement
            parentUl.insertBefore(draggedLi, targetLi)

            const newParentId = parentUl.closest('li')?.dataset.nodeId || 'trestle-root'

            this.eventBus.emit('view:moveNode', {
                nodeId: this.draggedNodeId,
                newParentId,
                newIndex: Array.from(parentUl.children).indexOf(draggedLi)
            })
        }

        this.draggedNodeId = null
        draggedLi.classList.remove('ts-dragging')

        document.querySelectorAll('.ts-highlight').forEach(el => {
            el.classList.remove('ts-highlight')
        })

        this.initDragAndDrop()

        this.addContextualAddButtons()
    }

    selectNode(nodeId) {
        if (this.selectedNodeId) {
            const prevSelected = document.getElementById(this.selectedNodeId)
            if (prevSelected) {
                prevSelected.classList.remove('ts-selected')
            }
        }

        this.selectedNodeId = nodeId
        const entry = document.getElementById(nodeId)
        if (entry) {
            entry.classList.add('ts-selected')

            entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }

    findInsertPosition(parentElement, index) {
        if (index === undefined || index <= 0 || !parentElement) {
            return null
        }

        // Get all direct list item children
        const children = Array.from(parentElement.children)

        // If there are fewer children than the index, we can't insert at that position
        if (children.length < index) {
            return null
        }

        // Return the element after which we should insert (index-1 because we're 0-indexed)
        return children[index - 1]
    }

    navigateUp(currentNodeId) {
        const currentLi = this.nodeElements.get(currentNodeId)
        if (!currentLi) return

        let prevLi = currentLi.previousElementSibling

        if (prevLi) {
            while (prevLi.classList.contains('ts-open') && prevLi.querySelector('ul')?.lastElementChild) {
                prevLi = prevLi.querySelector('ul').lastElementChild
            }

            const prevId = prevLi.querySelector('.ts-entry').id
            this.selectNode(prevId)
        } else {
            const parentLi = currentLi.parentElement.closest('li')
            if (parentLi) {
                const parentId = parentLi.querySelector('.ts-entry').id
                this.selectNode(parentId)
            }
        }
    }

    navigateDown(currentNodeId) {
        const currentLi = this.nodeElements.get(currentNodeId)
        if (!currentLi) return

        if (currentLi.classList.contains('ts-open')) {
            const firstChild = currentLi.querySelector('ul > li')
            if (firstChild) {
                const childId = firstChild.querySelector('.ts-entry').id
                this.selectNode(childId)
                return
            }
        }

        let nextLi = currentLi.nextElementSibling
        if (nextLi) {
            const nextId = nextLi.querySelector('.ts-entry').id
            this.selectNode(nextId)
            return
        }

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

    showCard(nodeId) {
        const entry = document.getElementById(nodeId)
        if (!entry) return

        const title = entry.querySelector('.ts-title').textContent
        const date = entry.querySelector('.date').textContent

        this.eventBus.emit('view:getNodeData', {
            nodeId,
            callback: (node) => {
                const card = document.getElementById('card')
                const cardTitle = document.getElementById('card-title')
                const cardNid = document.getElementById('card-nid')
                const cardDate = document.getElementById('card-date')
                const cardDescription = document.getElementById('card-description')

                cardTitle.textContent = title
                cardNid.textContent = nodeId
                cardDate.textContent = date

                cardDescription.value = node.description || ''

                // Store node ID with the card
                card.dataset.nodeId = nodeId

                // Show the card
                card.classList.remove('hidden')

                cardDescription.focus()
            }
        })
    }

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

            // Get or create parent's child list
            let ul = parentLi.querySelector('ul')
            if (!ul) {
                ul = document.createElement('ul')
                parentLi.appendChild(ul)
                parentLi.classList.remove('ts-closed')
                parentLi.classList.add('ts-open')
            }

            parentElement = ul
        }

        // Check if this is a sibling being inserted after another node
        // by looking at the surrounding nodes and index
        const insertAfterElement = this.findInsertPosition(parentElement, node.index)

        // Create node map for rendering
        const nodesMap = new Map()
        nodesMap.set(node.id, node)

        // If we have a specific insertion point
        if (insertAfterElement) {
            // Create the node but don't attach to DOM yet
            const tempContainer = document.createElement('div')
            this.renderNode(node.id, tempContainer, nodesMap)
            const newNodeElement = tempContainer.firstChild

            // Insert it after the identified element
            insertAfterElement.after(newNodeElement)

            // Update our node elements map
            this.nodeElements.set(node.id, newNodeElement)

            // Select and start editing
            const titleElement = newNodeElement.querySelector('.ts-title')
            this.selectNode(node.id)

            setTimeout(() => {
                this.startEditing(titleElement)
            }, 10)
        } else {
            // Standard rendering - append to parent
            const newNodeElement = this.renderNode(node.id, parentElement, nodesMap)

            if (newNodeElement) {
                const titleElement = newNodeElement.querySelector('.ts-title')
                this.selectNode(node.id)

                setTimeout(() => {
                    this.startEditing(titleElement)
                }, 10)
            }
        }

        // Refresh drag and drop handlers
        this.initDragAndDrop()

        // Add buttons for inserting new nodes between existing ones
        this.addContextualAddButtons()
    }

    handleNodeUpdated(data) {
        const { nodeId, properties } = data

        const nodeEntry = document.getElementById(nodeId)
        if (!nodeEntry) return

        if (properties.title !== undefined) {
            const titleElement = nodeEntry.querySelector('.ts-title')
            titleElement.textContent = properties.title
        }
    }

    handleNodeDeleted(data) {
        const { nodeId } = data

        const nodeLi = this.nodeElements.get(nodeId)
        if (nodeLi) {
            const parent = nodeLi.parentElement
            const isLastInList = parent.children.length === 1

            nodeLi.remove()
            this.nodeElements.delete(nodeId)

            if (isLastInList && parent.classList.contains('ts-root')) {
                this.showEmptyState(parent)
            }
        }
    }

    handleNodeIndented(data) {
        const { nodeId, newParentId } = data

        const nodeLi = this.nodeElements.get(nodeId)
        const newParentLi = this.nodeElements.get(newParentId)

        if (!nodeLi || !newParentLi) return

        let parentUl = newParentLi.querySelector('ul')
        if (!parentUl) {
            parentUl = document.createElement('ul')
            newParentLi.appendChild(parentUl)
            newParentLi.classList.remove('ts-closed')
            newParentLi.classList.add('ts-open')
        }

        parentUl.appendChild(nodeLi)

        this.initDragAndDrop()

        this.addContextualAddButtons()
    }

    handleNodeOutdented(data) {
        const { nodeId, newParentId } = data

        const nodeLi = this.nodeElements.get(nodeId)
        if (!nodeLi) return

        const oldParentLi = nodeLi.parentElement.closest('li')
        if (!oldParentLi) return

        let newParentList
        if (newParentId === 'trestle-root') {
            newParentList = this.rootElement.querySelector('ul')
        } else {
            const newParentLi = this.nodeElements.get(newParentId)
            if (!newParentLi) return

            newParentList = newParentLi.parentElement
        }

        if (!newParentList) return

        if (oldParentLi.nextElementSibling) {
            newParentList.insertBefore(nodeLi, oldParentLi.nextElementSibling)
        } else {
            newParentList.appendChild(nodeLi)
        }

        this.initDragAndDrop()

        this.addContextualAddButtons()
    }
}