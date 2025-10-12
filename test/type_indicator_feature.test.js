// Integration test for type indicator feature
import { describe, test, expect, vi, beforeEach } from 'vitest'
import TreeNode from '../src/js/view/components/TreeNode.js'

describe('Type Indicator Feature', () => {
    let eventBus
    let template
    let parent

    beforeEach(() => {
        // Create mock event bus
        eventBus = {
            on: vi.fn(),
            emit: vi.fn(),
            off: vi.fn()
        }

        // Create template for TreeNode
        template = document.createElement('template')
        template.innerHTML = `
            <div class="ts-entry">
                <button class="ts-expander" aria-label="Toggle expand"></button>
                <span class="ts-type-icon" aria-hidden="true"></span>
                <span class="ts-title"></span>
                <span class="date"></span>
                <button class="ts-type" aria-label="Set type" title="Set RDF type">🏷️</button>
                <button class="ts-delete">🗑️</button>
            </div>
        `

        // Create parent element
        parent = document.createElement('ul')
        document.body.appendChild(parent)
    })

    afterEach(() => {
        if (parent && parent.parentNode) {
            document.body.removeChild(parent)
        }
    })

    test('should show default type icon for untyped nodes', () => {
        const nodeData = { id: 'test-1', title: 'Test Node' }
        const treeNode = new TreeNode(nodeData, new Map(), eventBus, template)
        
        treeNode.render(parent)
        
        const typeButton = parent.querySelector('.ts-type')
        const typeIcon = parent.querySelector('.ts-type-icon')
        expect(typeButton).toBeDefined()
        expect(typeButton.textContent).toBe('🏷️')
        expect(typeButton.title).toContain('Set type')
        expect(typeButton.classList.contains('ts-type-set')).toBe(false)
        expect(typeIcon).toBeDefined()
        expect(typeIcon.classList.contains('is-visible')).toBe(false)
        expect(typeIcon.classList.contains('ts-type-icon--generic')).toBe(false)
    })

    test('should show project icon for prj:Project type', () => {
        const nodeData = { id: 'test-2', title: 'Test Project', type: 'prj:Project' }
        const treeNode = new TreeNode(nodeData, new Map(), eventBus, template)
        
        treeNode.render(parent)
        
        const typeButton = parent.querySelector('.ts-type')
        const typeIcon = parent.querySelector('.ts-type-icon')
        expect(typeButton.textContent).toBe('📁')
        expect(typeButton.title).toContain('Project (prj:Project)')
        expect(typeButton.classList.contains('ts-type-set')).toBe(true)
        expect(typeIcon.classList.contains('is-visible')).toBe(true)
        expect(typeIcon.classList.contains('ts-type-icon--project')).toBe(true)
        expect(typeIcon.dataset.type).toBe('prj:Project')
    })

    test('should show task icon for prj:Task type', () => {
        const nodeData = { id: 'test-3', title: 'Test Task', type: 'prj:Task' }
        const treeNode = new TreeNode(nodeData, new Map(), eventBus, template)
        
        treeNode.render(parent)
        
        const typeButton = parent.querySelector('.ts-type')
        const typeIcon = parent.querySelector('.ts-type-icon')
        expect(typeButton.textContent).toBe('✓')
        expect(typeButton.title).toContain('Task (prj:Task)')
        expect(typeButton.classList.contains('ts-type-set')).toBe(true)
        expect(typeIcon.classList.contains('is-visible')).toBe(true)
        expect(typeIcon.classList.contains('ts-type-icon--task')).toBe(true)
        expect(typeIcon.dataset.type).toBe('prj:Task')
    })

    test('should emit type selector event when type button clicked', () => {
        const nodeData = { id: 'test-4', title: 'Test Node' }
        const treeNode = new TreeNode(nodeData, new Map(), eventBus, template)
        
        treeNode.render(parent)
        
        const typeButton = parent.querySelector('.ts-type')
        typeButton.click()
        
        expect(eventBus.emit).toHaveBeenCalledWith('view:showTypeSelector', {
            nodeId: 'test-4',
            buttonElement: typeButton,
            currentType: 'ts:Node'
        })
    })

    test('should update type appearance when type is set', () => {
        const nodeData = { id: 'test-5', title: 'Test Node' }
        const treeNode = new TreeNode(nodeData, new Map(), eventBus, template)
        
        treeNode.render(parent)
        
        // Simulate type being set
        treeNode.handleNodeTypeSet({
            nodeId: 'test-5',
            type: 'prj:Project',
            typeUri: 'http://purl.org/stuff/project/Project'
        })
        
        const typeButton = parent.querySelector('.ts-type')
        const typeIcon = parent.querySelector('.ts-type-icon')
        expect(typeButton.textContent).toBe('📁')
        expect(typeButton.classList.contains('ts-type-set')).toBe(true)
        expect(nodeData.type).toBe('prj:Project')
        expect(typeIcon.classList.contains('ts-type-icon--project')).toBe(true)
        expect(typeIcon.dataset.type).toBe('prj:Project')
    })

    test('should handle unknown type gracefully', () => {
        const nodeData = { id: 'test-6', title: 'Test Node', type: 'custom:UnknownType' }
        const treeNode = new TreeNode(nodeData, new Map(), eventBus, template)
        
        treeNode.render(parent)
        
        const typeButton = parent.querySelector('.ts-type')
        const typeIcon = parent.querySelector('.ts-type-icon')
        expect(typeButton.textContent).toBe('🏷️') // Falls back to default icon
        expect(typeButton.title).toContain('Set type (custom:UnknownType)')
        expect(typeButton.classList.contains('ts-type-set')).toBe(true) // Still marked as set
        expect(typeIcon.classList.contains('ts-type-icon--generic')).toBe(true)
        expect(typeIcon.classList.contains('is-visible')).toBe(true)
        expect(typeIcon.dataset.type).toBe('custom:UnknownType')
    })
})
