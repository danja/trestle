// Test for drag and drop outdent functionality
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { DragDropHandler } from '../src/js/view/components/DragDropHandler.js'

describe('Drag and Drop Outdent', () => {
    let eventBus
    let rootElement
    let nodeElements
    let dragDropHandler

    beforeEach(() => {
        // Create mock event bus
        eventBus = {
            emit: vi.fn()
        }

        // Create mock DOM structure
        rootElement = document.createElement('div')
        rootElement.innerHTML = `
            <ul class="ts-root">
                <li data-node-id="parent">
                    <div class="dropzone"></div>
                    <div class="ts-entry" id="parent">
                        <span class="ts-handle">≡</span>
                        <span class="ts-title">Parent</span>
                    </div>
                    <ul>
                        <li data-node-id="child">
                            <div class="dropzone"></div>
                            <div class="ts-entry" id="child">
                                <span class="ts-handle">≡</span>
                                <span class="ts-title">Child</span>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        `
        document.body.appendChild(rootElement)

        // Create nodeElements map
        nodeElements = new Map()
        const parentLi = rootElement.querySelector('[data-node-id="parent"]')
        const childLi = rootElement.querySelector('[data-node-id="child"]')
        nodeElements.set('parent', parentLi)
        nodeElements.set('child', childLi)

        // Initialize drag drop handler
        dragDropHandler = new DragDropHandler(rootElement, nodeElements, eventBus)
    })

    afterEach(() => {
        if (rootElement && rootElement.parentNode) {
            document.body.removeChild(rootElement)
        }
    })

    test('should emit outdent event when dragging left on nested node', () => {
        const childEntry = rootElement.querySelector('#child')
        const parentDropzone = rootElement.querySelector('[data-node-id="parent"] .dropzone')
        
        // Set up dragged node
        dragDropHandler.draggedNodeId = 'child'
        
        // Create mock drop event on left side (position < 0.1)
        const mockDropEvent = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            target: parentDropzone,
            offsetX: 5, // Small offset = left side
            dataTransfer: {
                effectAllowed: 'move',
                dropEffect: 'move'
            }
        }
        
        // Mock the parent dropzone to have a width
        Object.defineProperty(parentDropzone.closest('li'), 'offsetWidth', {
            value: 200,
            writable: true
        })
        
        // Handle the drop
        dragDropHandler.handleDrop(mockDropEvent)
        
        // Should emit outdent event since child node has a parent
        expect(eventBus.emit).toHaveBeenCalledWith('view:outdentNode', {
            nodeId: 'child'
        })
    })

    test('should not allow dropping node onto itself', () => {
        const parentEntry = rootElement.querySelector('#parent')
        const parentDropzone = rootElement.querySelector('[data-node-id="parent"] .dropzone')
        
        // Set up dragged node (trying to drop parent onto itself)
        dragDropHandler.draggedNodeId = 'parent'
        
        // Create mock drop event on left side
        const mockDropEvent = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            target: parentDropzone,
            offsetX: 5,
            dataTransfer: {
                effectAllowed: 'move',
                dropEffect: 'move'
            }
        }
        
        Object.defineProperty(parentDropzone.closest('li'), 'offsetWidth', {
            value: 200,
            writable: true
        })
        
        // Handle the drop
        dragDropHandler.handleDrop(mockDropEvent)
        
        // Should not emit any events since dropping onto itself is prevented
        expect(eventBus.emit).not.toHaveBeenCalled()
    })

    test('should emit indent event when dragging right', () => {
        const childEntry = rootElement.querySelector('#child')
        const parentDropzone = rootElement.querySelector('[data-node-id="parent"] .dropzone')
        
        // Set up dragged node
        dragDropHandler.draggedNodeId = 'child'
        
        // Create mock drop event on right side (position > 0.1)
        const mockDropEvent = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            target: parentDropzone,
            offsetX: 150, // Large offset = right side
            dataTransfer: {
                effectAllowed: 'move',
                dropEffect: 'move'
            }
        }
        
        Object.defineProperty(parentDropzone.closest('li'), 'offsetWidth', {
            value: 200,
            writable: true
        })
        
        // Handle the drop
        dragDropHandler.handleDrop(mockDropEvent)
        
        // Should emit indent event (proper indenting like keyboard shortcut)
        expect(eventBus.emit).toHaveBeenCalledWith('view:indentNode', {
            nodeId: 'child'
        })
    })
})