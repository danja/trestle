/**
 * DragDropHandler component
 * Manages drag and drop functionality for tree nodes
 */
export class DragDropHandler {
    /**
     * Create a new DragDropHandler
     * @param {HTMLElement} rootElement - The root element containing the tree
     * @param {Map} nodeElements - Map of node ID to node element
     * @param {EventBus} eventBus - The event bus for communication
     */
    constructor(rootElement, nodeElements, eventBus) {
        this.rootElement = rootElement;
        this.nodeElements = nodeElements;
        this.eventBus = eventBus;
        this.draggedNodeId = null;
        this.dragTarget = null;
        this.dragEnterTimer = null;
    }

    /**
     * Initialize drag and drop functionality
     */
    initialize() {
        this.cleanupListeners();
        this.setupDragListeners();
    }

    /**
     * Set up drag and drop event listeners
     */
    setupDragListeners() {
        const handles = this.rootElement.querySelectorAll('.ts-handle');
        handles.forEach(handle => {
            handle._dragStartHandler = this.handleDragStart.bind(this);

            handle.setAttribute('draggable', 'true');
            handle.addEventListener('mousedown', handle._dragStartHandler);
            handle.addEventListener('dragstart', handle._dragStartHandler);
        });

        const entries = this.rootElement.querySelectorAll('.ts-entry');
        entries.forEach(entry => {
            entry.setAttribute('draggable', 'true');
        });

        const dropzones = this.rootElement.querySelectorAll('.dropzone');
        dropzones.forEach(dropzone => {
            dropzone._dragOverHandler = this.handleDragOver.bind(this);
            dropzone._dragLeaveHandler = this.handleDragLeave.bind(this);
            dropzone._dropHandler = this.handleDrop.bind(this);

            dropzone.addEventListener('dragover', dropzone._dragOverHandler);
            dropzone.addEventListener('dragleave', dropzone._dragLeaveHandler);
            dropzone.addEventListener('drop', dropzone._dropHandler);
        });

        const items = this.rootElement.querySelectorAll('li');
        items.forEach(item => {
            item._dragEnterHandler = this.handleDragEnter.bind(this);
            item.addEventListener('dragenter', item._dragEnterHandler);
        });
    }

    /**
     * Clean up existing drag and drop event listeners
     */
    cleanupListeners() {
        const handles = this.rootElement.querySelectorAll('.ts-handle');
        handles.forEach(handle => {
            if (handle._dragStartHandler) {
                handle.removeEventListener('mousedown', handle._dragStartHandler);
                handle.removeEventListener('dragstart', handle._dragStartHandler);
                delete handle._dragStartHandler;
            }
        });

        const dropzones = this.rootElement.querySelectorAll('.dropzone');
        dropzones.forEach(dropzone => {
            if (dropzone._dragOverHandler) {
                dropzone.removeEventListener('dragover', dropzone._dragOverHandler);
                delete dropzone._dragOverHandler;
            }
            if (dropzone._dragLeaveHandler) {
                dropzone.removeEventListener('dragleave', dropzone._dragLeaveHandler);
                delete dropzone._dragLeaveHandler;
            }
            if (dropzone._dropHandler) {
                dropzone.removeEventListener('drop', dropzone._dropHandler);
                delete dropzone._dropHandler;
            }
        });

        const items = this.rootElement.querySelectorAll('li');
        items.forEach(item => {
            if (item._dragEnterHandler) {
                item.removeEventListener('dragenter', item._dragEnterHandler);
                delete item._dragEnterHandler;
            }
        });
    }

    /**
     * Handle the start of a drag operation
     * @param {DragEvent} event - The drag event
     */
    handleDragStart(event) {
        event.stopPropagation();

        const entry = event.target.closest('.ts-entry');
        if (!entry) {
            console.log('No entry found in drag start');
            return;
        }

        this.draggedNodeId = entry.id;
        console.log('Drag started for node:', this.draggedNodeId);

        if (event.dataTransfer) {
            event.dataTransfer.clearData();

            event.dataTransfer.setData('text/plain', entry.id);
            event.dataTransfer.setData('application/x-node-id', entry.id);
            event.dataTransfer.effectAllowed = 'move';

            try {
                const dragImage = entry.cloneNode(true);
                dragImage.style.width = `${entry.offsetWidth}px`;
                dragImage.style.opacity = '0.7';
                dragImage.style.position = 'absolute';
                dragImage.style.top = '-1000px';
                document.body.appendChild(dragImage);
                event.dataTransfer.setDragImage(dragImage, 10, 10);

                setTimeout(() => {
                    document.body.removeChild(dragImage);
                }, 10);
            } catch (err) {
                console.warn('Error setting drag image:', err);
            }
        }

        entry.classList.add('ts-dragging');

        // Call selectNode or similar function
        this.eventBus.emit('view:selectNode', { nodeId: entry.id });

        const listItem = entry.closest('li');
        if (listItem) {
            listItem.classList.add('ts-dragging-item');
        }

        document.body.classList.add('ts-dragging-active');

        const dragEndHandler = () => {
            this.handleDragEnd();
            document.removeEventListener('dragend', dragEndHandler);
        };

        document.addEventListener('dragend', dragEndHandler);
    }

    /**
     * Handle the end of a drag operation
     */
    handleDragEnd() {
        console.log('Drag ended');

        document.querySelectorAll('.ts-dragging').forEach(el => {
            el.classList.remove('ts-dragging');
        });

        document.querySelectorAll('.ts-dragging-item').forEach(el => {
            el.classList.remove('ts-dragging-item');
        });

        document.querySelectorAll('.ts-highlight').forEach(el => {
            el.classList.remove('ts-highlight');
        });

        document.querySelectorAll('.dropzone.active').forEach(el => {
            el.classList.remove('active');
        });

        document.body.classList.remove('ts-dragging-active');

        this.draggedNodeId = null;
        this.dragTarget = null;
    }

    /**
     * Handle dragover event
     * @param {DragEvent} event - The drag event
     */
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.draggedNodeId) return;

        let dropzone = event.target;
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement;
        }

        if (!dropzone) return;

        // Debug log for dragover
        const targetLi = dropzone.closest('li');
        let dropPosition = null;
        if (targetLi) {
            dropPosition = event.offsetX / targetLi.offsetWidth;
        }
        console.log('[DragDropHandler] DragOver:', {
            draggedNodeId: this.draggedNodeId,
            dropzone,
            targetLi: targetLi ? targetLi.dataset.nodeId : null,
            dropPosition,
            offsetX: event.offsetX,
            offsetWidth: targetLi ? targetLi.offsetWidth : null
        });

        dropzone.classList.add('active');
        dropzone.classList.remove('ts-drop-indent', 'ts-drop-outdent');

        if (targetLi) {
            if (dropPosition > 0.5) {
                dropzone.classList.add('ts-drop-indent');
            } else {
                dropzone.classList.add('ts-drop-outdent');
            }
        }

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
    }

    /**
     * Handle dragleave event
     * @param {DragEvent} event - The drag event
     */
    handleDragLeave(event) {
        let dropzone = event.target;
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement;
        }

        if (!dropzone) return;

        dropzone.classList.remove('active', 'ts-drop-indent', 'ts-drop-outdent');
    }

    /**
     * Handle dragenter event
     * @param {DragEvent} event - The drag event
     */
    handleDragEnter(event) {
        const li = event.target.closest('li');
        if (!li || !this.draggedNodeId) return;

        this.dragTarget = li;

        li.classList.add('ts-highlight');

        if (this.dragEnterTimer) {
            clearTimeout(this.dragEnterTimer);
        }

        this.dragEnterTimer = setTimeout(() => {
            if (li.classList.contains('ts-closed')) {
                li.classList.remove('ts-closed');
                li.classList.add('ts-open');
            }
        }, 700);
    }

    /**
     * Handle drop event
     * @param {DragEvent} event - The drag event
     */
    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        let dropzone = event.target;
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement;
        }

        if (!dropzone) return;

        dropzone.classList.remove('active', 'ts-drop-indent', 'ts-drop-outdent');

        if (!this.draggedNodeId) {
            console.log('No dragged node ID');
            return;
        }

        const draggedLi = this.nodeElements.get(this.draggedNodeId);
        if (!draggedLi) {
            console.log('Dragged node element not found');
            return;
        }

        const targetLi = dropzone.closest('li');
        if (!targetLi) {
            console.log('Target list item not found');
            return;
        }

        // Special case: Dropping onto itself on the right (indent) should indent under previous sibling
        const dropPosition = event.offsetX / targetLi.offsetWidth;
        if (draggedLi === targetLi && dropPosition > 0.1) {
            const prevSibling = draggedLi.previousElementSibling;
            if (prevSibling) {
                let childUl = prevSibling.querySelector('ul');
                if (!childUl) {
                    childUl = document.createElement('ul');
                    prevSibling.appendChild(childUl);
                    prevSibling.classList.remove('ts-closed');
                    prevSibling.classList.add('ts-open');
                }
                childUl.appendChild(draggedLi);
                this.eventBus.emit('view:moveNode', {
                    nodeId: this.draggedNodeId,
                    newParentId: prevSibling.dataset.nodeId,
                    newIndex: Array.from(childUl.children).indexOf(draggedLi)
                });
                this.draggedNodeId = null;
                draggedLi.classList.remove('ts-dragging');
                document.querySelectorAll('.ts-highlight').forEach(el => {
                    el.classList.remove('ts-highlight');
                });
                this.initialize();
            } else {
                console.warn('No previous sibling to indent under');
            }
            return;
        }

        if (draggedLi === targetLi) {
            console.warn('Cannot drop onto itself');
            return;
        }

        if (draggedLi.contains(targetLi)) {
            console.warn('Cannot drop onto a child element');
            return;
        }

        // Prevent self-indent: do not allow dropping a node onto itself
        if (draggedLi === targetLi) {
            console.warn('Cannot indent a node under itself');
            return;
        }

        // --- Updated logic: indent if dropped on rightmost 90% of any node ---
        console.log('[DragDropHandler] Drop event:', {
            draggedNodeId: this.draggedNodeId,
            targetNodeId: targetLi.dataset.nodeId,
            dropPosition,
            offsetX: event.offsetX,
            offsetWidth: targetLi.offsetWidth
        });
        if (dropPosition > 0.1) {
            // Indent: move as last child of targetLi
            const newParentId = targetLi.dataset.nodeId;
            let childUl = targetLi.querySelector('ul');
            if (!childUl) {
                childUl = document.createElement('ul');
                targetLi.appendChild(childUl);
                targetLi.classList.remove('ts-closed');
                targetLi.classList.add('ts-open');
            }

            childUl.appendChild(draggedLi);

            this.eventBus.emit('view:moveNode', {
                nodeId: this.draggedNodeId,
                newParentId,
                newIndex: Array.from(childUl.children).indexOf(draggedLi)
            });
        } else {
            // Outdent or move before target
            const parentUl = targetLi.parentElement;
            parentUl.insertBefore(draggedLi, targetLi);

            const newParentId = parentUl.closest('li')?.dataset.nodeId || 'trestle-root';

            this.eventBus.emit('view:moveNode', {
                nodeId: this.draggedNodeId,
                newParentId,
                newIndex: Array.from(parentUl.children).indexOf(draggedLi)
            });
        }

        this.draggedNodeId = null;
        draggedLi.classList.remove('ts-dragging');

        document.querySelectorAll('.ts-highlight').forEach(el => {
            el.classList.remove('ts-highlight');
        });

        // Re-initialize drag and drop after DOM changes
        this.initialize();
    }
}