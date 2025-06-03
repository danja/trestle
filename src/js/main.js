// src/js/main.js
import { TrestleModel } from './model/TrestleModel.js'
import TrestleRDFModel from './model/TrestleRDFModel.js'
import TrestleView from './view/index.js'
import { TrestleController } from './controller/TrestleController.js'
import { Config } from './config.js'
import { EventBus } from 'evb'
import { EventLogger } from './utils/EventLogger.js'

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed')

    // Initialize the event bus
    const eventBus = new EventBus()
    console.log('EventBus initialized')
    
    // Initialize event logger
    const eventLogger = new EventLogger(eventBus, {
      loggerName: 'Trestle:EventLogger',
      logLevel: 'debug',
      ignorePatterns: [
        // Ignore high-frequency events that would clutter the logs
        /^mousemove|mousedown|mouseup|click|scroll|resize|input|keydown|keyup|keypress$/,
        // Ignore internal events that might cause noise
        /^console:/,
        'trestle:rendering',
        'trestle:rendered',
        'trestle:updating',
        'trestle:updated'
      ]
    });
    console.log('EventLogger initialized');

    // Initialize the model, view, and controller
    const model = new TrestleRDFModel(Config.SPARQL_ENDPOINT, Config.BASE_URI, eventBus)
    console.log('TrestleModel initialized')

    const view = new TrestleView(document.getElementById('trestle-root'), eventBus)
    console.log('TrestleView initialized')

    const controller = new TrestleController(model, view, eventBus)
    console.log('TrestleController initialized')

    // Set up UI event listeners
    setupUIListeners(controller, eventBus)

    // Initialize the application
    controller.initialize()
    console.log('Controller initialization complete')

    // Set up auto-save if enabled
    if (Config.AUTO_SAVE) {
        setupAutoSave(controller, Config.AUTO_SAVE_INTERVAL)
    }
})

/**
 * Sets up UI event listeners
 * @param {TrestleController} controller - The controller instance
 */
function setupUIListeners(controller, eventBus) {
    // Button elements
    const saveButton = document.getElementById('saveButton')
    const mobileaaveButton = document.getElementById('mobileaaveButton')
    const clearAllButton = document.getElementById('addButton')
    const mobileAddButton = document.getElementById('mobileAddButton')
    const shortcutsButton = document.getElementById('shortcutsButton')
    const mobileShortcutsButton = document.getElementById('mobileShortcutsButton')
    const cardClose = document.getElementById('card-close')
    // Removed shortcutsText: shortcuts now shown in right panel only
    const hamburgerButton = document.getElementById('hamburgerButton')
    const menuBox = document.getElementById('menu-box')

    // Save buttons
    if (saveButton) {
        saveButton.addEventListener('click', () => controller.saveData())
    }

    if (mobileaaveButton) {
        mobileaaveButton.addEventListener('click', () => {
            controller.saveData()
            menuBox.classList.add('hidden')
        })
    }

    // Clear All button
    if (clearAllButton) {
        clearAllButton.textContent = 'Clear All'
        clearAllButton.addEventListener('click', () => {
            controller.model.createEmptyModel() // Clear all and create a new outline
            controller.view.renderTree({ nodes: Array.from(controller.model.nodes.values()) }) // Refresh the view
        })
    }

    // Add root item buttons
    if (mobileAddButton) {
        mobileAddButton.addEventListener('click', () => {
            controller.addRootItem()
            menuBox.classList.add('hidden')
        })
    }

    /**
     * Handle panel button clicks for both mobile and desktop
     * @param {string} view - The view to show ('console' or 'shortcuts')
     */
    const handlePanelButtonClick = (view) => {
        console.log(`Panel button clicked for view: ${view}`);
        const rightPanel = window.rightPanel;
        if (!rightPanel) {
            console.error('Right panel not initialized');
            return;
        }
        
        console.log('Current panel state:', {
            panelElement: rightPanel.panel ? 'found' : 'not found',
            isVisible: rightPanel.isVisible(),
            hasHiddenClass: rightPanel.panel?.classList.contains('hidden'),
            currentView: rightPanel.currentView
        });
        
        // Toggle the panel with the specified view
        console.log(`Calling rightPanel.toggle('${view}')`);
        rightPanel.toggle(view);
        
        // Close the mobile menu if open
        const menuBox = document.getElementById('menu-box');
        if (menuBox) {
            console.log('Hiding mobile menu');
            menuBox.classList.add('hidden');
        }
    };

    // Desktop shortcuts button
    if (shortcutsButton) {
        shortcutsButton.addEventListener('click', () => handlePanelButtonClick('shortcuts'));
    }

    // Mobile shortcuts button
    if (mobileShortcutsButton) {
        mobileShortcutsButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handlePanelButtonClick('shortcuts');
        });
    }

    // Mobile console button
    const mobileConsoleButton = document.getElementById('mobileConsoleButton');
    if (mobileConsoleButton) {
        mobileConsoleButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handlePanelButtonClick('console');
        });
    }

    // Mobile menu toggle
    if (hamburgerButton && menuBox) {
        hamburgerButton.addEventListener('click', (event) => {
            // Toggle menu visibility
            const menuWasHidden = menuBox.classList.contains('hidden');
            
            // Close any open panels when opening the menu
            if (menuWasHidden && rightPanel && rightPanel.isVisible()) {
                rightPanel.hide();
            }
            
            menuBox.classList.toggle('hidden');
            event.stopPropagation();
        });
    }

    // Close menu when clicking outside
    if (menuBox) {
        document.addEventListener('click', (event) => {
            if (!menuBox.contains(event.target) && 
                event.target !== hamburgerButton && 
                !menuBox.classList.contains('hidden')) {
                menuBox.classList.add('hidden');
            }
        });
    }

    // Card close button
    if (cardClose) {
        cardClose.addEventListener('click', () => {
            const card = document.getElementById('card')
            const cardDescription = document.getElementById('card-description')

            // Save description
            if (card && card.dataset.nodeId) {
                controller.updateNodeDescription(card.dataset.nodeId, cardDescription.value)
            }

            // Hide card
            card.classList.add('hidden')
        })
    }

    // Create a new root item when clicking in empty space
    document.getElementById('trestle').addEventListener('click', (event) => {
        // Only handle direct clicks on the root trestle div (not bubbled events)
        if (event.target.id === 'trestle' || event.target.id === 'trestle-root') {
            // Check if there are any items
            const rootElement = document.getElementById('trestle-root')
            if (!rootElement.querySelector('li:not(.ts-empty-state)')) {
                controller.addRootItem()
            }
        }
    })

    // Global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Ctrl+S for save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault()
            controller.saveData()
        }

        // Ctrl+N for new root item
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault()
            controller.addRootItem()
        }
    })
}

/**
 * Sets up auto-save functionality
 * @param {TrestleController} controller - The controller instance
 * @param {number} interval - The auto-save interval in milliseconds
 */
function setupAutoSave(controller, interval) {
    // Set up timer for auto-save
    setInterval(() => {
        controller.saveData()
    }, interval)

    // Save before unload
    window.addEventListener('beforeunload', () => {
        controller.saveData()
    })
}