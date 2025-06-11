// Integration test for TypeService and TypeSelector
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { TypeService } from '../src/domain/services/TypeService.js'
import { TypeSelector } from '../src/js/view/components/TypeSelector.js'

describe('Type Selection Integration', () => {
    let eventBus
    let typeService
    let typeSelector

    beforeEach(() => {
        // Create mock event bus
        eventBus = {
            on: vi.fn(),
            emit: vi.fn(),
            off: vi.fn()
        }

        // Initialize services
        typeService = new TypeService(eventBus)
        typeSelector = new TypeSelector(eventBus)
    })

    test('should initialize TypeService with RDF types', () => {
        expect(typeService).toBeDefined()
        expect(typeService.getAvailableTypes()).toHaveLength(3)
        
        const types = typeService.getAvailableTypes()
        const typeLabels = types.map(t => t.label)
        
        expect(typeLabels).toContain('Project')
        expect(typeLabels).toContain('Task')
        expect(typeLabels).toContain('Generic Item')
    })

    test('should handle type setting via event bus', () => {
        const nodeId = 'test-node-123'
        const typePrefix = 'prj:Project'

        // Simulate setting node type
        typeService.handleSetNodeType({
            nodeId,
            typePrefix
        })

        // Check that success event was emitted
        expect(eventBus.emit).toHaveBeenCalledWith('type:nodeTypeSet', expect.objectContaining({
            nodeId,
            typePrefix,
            typeInfo: expect.objectContaining({
                label: 'Project',
                prefix: 'prj:Project'
            })
        }))
    })

    test('should handle type validation', () => {
        expect(typeService.isValidType('prj:Project')).toBe(true)
        expect(typeService.isValidType('prj:Task')).toBe(true)
        expect(typeService.isValidType('invalid:Type')).toBe(false)
    })

    test('should create proper RDF datasets', () => {
        const nodeId = 'test-node-456'
        const typePrefix = 'prj:Task'

        const result = typeService.createTypeDataset(nodeId, typePrefix)

        expect(result).toBeDefined()
        expect(result.dataset).toBeDefined()
        expect(result.subject).toBeDefined()
        expect(result.typeInfo.label).toBe('Task')
    })

    test('should handle errors for invalid types', () => {
        const nodeId = 'test-node-789'
        const invalidType = 'invalid:Type'

        typeService.handleSetNodeType({
            nodeId,
            typePrefix: invalidType
        })

        // Check that error event was emitted
        expect(eventBus.emit).toHaveBeenCalledWith('type:error', expect.objectContaining({
            error: `Unknown type: ${invalidType}`
        }))
    })
})