// Comprehensive test for drag and drop indent/outdent functionality
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { DragDropHandler } from '../src/js/view/components/DragDropHandler.js'

describe('Drag and Drop Comprehensive', () => {
    let eventBus
    let rootElement
    let nodeElements
    let dragDropHandler

    beforeEach(() => {
        // Create mock event bus
        eventBus = {
            emit: vi.fn()
        }

        // Create more complex DOM structure for testing
        rootElement = document.createElement('div')
        rootElement.innerHTML = `
            <ul class="ts-root">
                <li data-node-id="first">
                    <div class="dropzone"></div>
                    <div class="ts-entry" id="first">
                        <span class="ts-handle">≡</span>
                        <span class="ts-title">First Item</span>
                    </div>
                </li>
                <li data-node-id="second">
                    <div class="dropzone"></div>
                    <div class="ts-entry" id="second">
                        <span class="ts-handle">≡</span>
                        <span class="ts-title">Second Item</span>
                    </div>
                    <ul>
                        <li data-node-id="child1">
                            <div class="dropzone"></div>
                            <div class="ts-entry" id="child1">
                                <span class="ts-handle">≡</span>
                                <span class="ts-title">Child 1</span>
                            </div>
                        </li>
                        <li data-node-id="child2">
                            <div class="dropzone"></div>
                            <div class="ts-entry" id="child2">
                                <span class="ts-handle">≡</span>
                                <span class="ts-title">Child 2</span>
                            </div>
                        </li>
                    </ul>
                </li>
                <li data-node-id="third">
                    <div class="dropzone"></div>
                    <div class="ts-entry" id="third">
                        <span class="ts-handle">≡</span>
                        <span class="ts-title">Third Item</span>
                    </div>
                </li>
            </ul>
        `
        document.body.appendChild(rootElement)

        // Create nodeElements map
        nodeElements = new Map()
        const nodes = ['first', 'second', 'child1', 'child2', 'third']
        nodes.forEach(nodeId => {
            const li = rootElement.querySelector(`[data-node-id="${nodeId}"]`)
            nodeElements.set(nodeId, li)
        })

        // Initialize drag drop handler
        dragDropHandler = new DragDropHandler(rootElement, nodeElements, eventBus)
    })

    afterEach(() => {
        if (rootElement && rootElement.parentNode) {
            document.body.removeChild(rootElement)
        }
    })

    function createDropEvent(targetNodeId, offsetX, offsetWidth = 200) {
        const targetDropzone = rootElement.querySelector(`[data-node-id="${targetNodeId}"] .dropzone`)
        
        return {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            target: targetDropzone,
            offsetX,
            dataTransfer: {
                effectAllowed: 'move',
                dropEffect: 'move'
            }
        }
    }

    function setElementWidth(nodeId, width) {
        const element = rootElement.querySelector(`[data-node-id="${nodeId}"]`)
        Object.defineProperty(element, 'offsetWidth', {
            value: width,
            writable: true
        })
    }

    test('should indent root-level node under previous sibling when dragging right', () => {
        // Drag "third" to the right of "second" - should make "third" a child of "second"
        dragDropHandler.draggedNodeId = 'third'
        setElementWidth('second', 200)
        
        const dropEvent = createDropEvent('second', 180) // Right side
        dragDropHandler.handleDrop(dropEvent)
        
        expect(eventBus.emit).toHaveBeenCalledWith('view:indentNode', {
            nodeId: 'third'
        })
    })

    test('should outdent nested node when dragging left', () => {
        // Drag "child1" to the left - should outdent it from "second" to root level
        dragDropHandler.draggedNodeId = 'child1'
        setElementWidth('second', 200)
        
        const dropEvent = createDropEvent('second', 10) // Left side
        dragDropHandler.handleDrop(dropEvent)
        
        expect(eventBus.emit).toHaveBeenCalledWith('view:outdentNode', {
            nodeId: 'child1'
        })
    })

    test('should reposition root-level nodes when dragging left on same level', () => {
        // Drag "first" to the left of "third" - should just reposition at same level
        dragDropHandler.draggedNodeId = 'first'
        setElementWidth('third', 200)
        
        const dropEvent = createDropEvent('third', 10) // Left side
        dragDropHandler.handleDrop(dropEvent)
        
        // Since "first" is already at root level, it should just reposition
        expect(eventBus.emit).toHaveBeenCalledWith('view:moveNode', expect.objectContaining({
            nodeId: 'first',
            newParentId: 'trestle-root'
        }))
    })

    test('should use precise drop position calculation', () => {
        // Test the 10% threshold
        setElementWidth('first', 200)
        
        // Test exactly at 10% (should be outdent)
        dragDropHandler.draggedNodeId = 'child2'
        const leftDropEvent = createDropEvent('first', 20) // 20/200 = 0.1
        dragDropHandler.handleDrop(leftDropEvent)
        expect(eventBus.emit).toHaveBeenCalledWith('view:outdentNode', {
            nodeId: 'child2'
        })
        
        eventBus.emit.mockClear()
        
        // Reset for second test
        dragDropHandler.draggedNodeId = 'child2'
        
        // Test just over 10% (should be indent)
        const rightDropEvent = createDropEvent('first', 21) // 21/200 = 0.105
        dragDropHandler.handleDrop(rightDropEvent)
        expect(eventBus.emit).toHaveBeenCalledWith('view:indentNode', {
            nodeId: 'child2'
        })
    })

    test('should handle edge case of missing target width', () => {
        dragDropHandler.draggedNodeId = 'child1'
        
        // Don't set offsetWidth - should default to reasonable behavior
        const dropEvent = createDropEvent('first', 50)
        
        // Should handle gracefully without errors
        expect(() => {
            dragDropHandler.handleDrop(dropEvent)
        }).not.toThrow()
    })
})