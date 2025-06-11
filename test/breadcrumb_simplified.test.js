// Test for simplified breadcrumb functionality
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import Breadcrumb from '../src/js/view/components/Breadcrumb.js'

describe('Simplified Breadcrumb', () => {
    let eventBus
    let rootElement
    let breadcrumb

    beforeEach(() => {
        // Create mock event bus
        eventBus = {
            on: vi.fn(),
            emit: vi.fn(),
            off: vi.fn()
        }

        // Create root element
        rootElement = document.createElement('div')
        rootElement.className = 'breadcrumb'
        document.body.appendChild(rootElement)

        // Initialize breadcrumb
        breadcrumb = new Breadcrumb(rootElement, eventBus)
    })

    afterEach(() => {
        if (rootElement && rootElement.parentNode) {
            document.body.removeChild(rootElement)
        }
        if (breadcrumb) {
            breadcrumb.destroy()
        }
    })

    test('should initialize with Home only', () => {
        expect(rootElement.textContent).toContain('Home')
        
        const homeItem = rootElement.querySelector('.breadcrumb-item')
        expect(homeItem).toBeTruthy()
        expect(homeItem.getAttribute('aria-current')).toBe('page')
    })

    test('should show Home > Node when zoomed in', () => {
        // Simulate zoom in event
        breadcrumb.handleZoomChange({
            nodeId: 'test-node-123',
            nodeTitle: 'Test Node'
        })

        expect(rootElement.textContent).toContain('Home')
        expect(rootElement.textContent).toContain('Test Node')
        expect(rootElement.textContent).toContain('>')

        // Home should be clickable, Test Node should be current
        const items = rootElement.querySelectorAll('.breadcrumb-item')
        expect(items).toHaveLength(2) // Home, current node (separator has different class)
        
        const homeLink = items[0].querySelector('.breadcrumb-link')
        const currentSpan = items[1].querySelector('.breadcrumb-current')
        
        expect(homeLink).toBeTruthy()
        expect(currentSpan).toBeTruthy()
        expect(currentSpan.textContent).toBe('Test Node')
    })

    test('should emit navigation events when breadcrumb is clicked', () => {
        // Set up zoomed state
        breadcrumb.handleZoomChange({
            nodeId: 'test-node-123',
            nodeTitle: 'Test Node'
        })

        // Click home breadcrumb
        const homeLink = rootElement.querySelector('.breadcrumb-link')
        homeLink.click()

        expect(eventBus.emit).toHaveBeenCalledWith('view:navigateHome')
    })

    test('should return to Home only when zoomed out', () => {
        // First zoom in
        breadcrumb.handleZoomChange({
            nodeId: 'test-node-123',
            nodeTitle: 'Test Node'
        })

        // Then zoom out
        breadcrumb.handleZoomChange({
            nodeId: 'root'
        })

        expect(rootElement.textContent).toContain('Home')
        expect(rootElement.textContent).not.toContain('Test Node')
        
        const items = rootElement.querySelectorAll('.breadcrumb-item')
        expect(items).toHaveLength(1) // Just Home
        expect(items[0].getAttribute('aria-current')).toBe('page')
    })

    test('should listen for correct zoom events', () => {
        expect(eventBus.on).toHaveBeenCalledWith('view:zoomedIn', expect.any(Function))
        expect(eventBus.on).toHaveBeenCalledWith('view:zoomedOut', expect.any(Function))
        expect(eventBus.on).toHaveBeenCalledWith('view:navigatedHome', expect.any(Function))
    })
})