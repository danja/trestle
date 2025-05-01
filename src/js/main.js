// src/js/main.js
import { TrestleModel } from './model/TrestleModel.js'
import TrestleRDFModel from './model/TrestleRDFModel.js'
import { TrestleView } from './view/TrestleView.js'
import { TrestleController } from './controller/TrestleController.js'
import { Config } from './config.js'
import { EventBus } from 'evb'

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the event bus
    const eventBus = new EventBus()

    // Initialize the model, view, and controller
    const model = new TrestleRDFModel(Config.SPARQL_ENDPOINT, Config.BASE_URI, eventBus)
    const view = new TrestleView(document.getElementById('trestle-root'), eventBus)
    const controller = new TrestleController(model, view, eventBus)

    // Set up UI event listeners
    setupUIListeners(controller)

    // Initialize the application
    controller.initialize()

    // Set up auto-save if enabled
    if (Config.AUTO_SAVE) {
        setupAutoSave(controller, Config.AUTO_SAVE_INTERVAL)
    }
})

/**
 * Sets up UI event listeners
 * @param {TrestleController} controller - The controller instance
 */
function setupUIListeners(controller) {
    // Button elements
    const saveButton = document.getElementById('saveButton')
    const mobileaaveButton = document.getElementById('mobileaaveButton')
    const addButton = document.getElementById('addButton')
    const mobileAddButton = document.getElementById('mobileAddButton')
    const shortcutsButton = document.getElementById('shortcutsButton')
    const mobileShortcutsButton = document.getElementById('mobileShortcutsButton')
    const cardClose = document.getElementById('card-close')
    const shortcutsText = document.getElementById('shortcuts-text')
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

    // Add root item buttons
    if (addButton) {
        addButton.addEventListener('click', () => controller.addRootItem())
    }

    if (mobileAddButton) {
        mobileAddButton.addEventListener('click', () => {
            controller.addRootItem()
            menuBox.classList.add('hidden')
        })
    }

    // Shortcuts buttons
    if (shortcutsButton) {
        shortcutsButton.addEventListener('click', () => {
            if (shortcutsText) {
                shortcutsText.classList.toggle('hidden')
            }
        })
    }

    if (mobileShortcutsButton) {
        mobileShortcutsButton.addEventListener('click', () => {
            if (shortcutsText) {
                shortcutsText.classList.toggle('hidden')
                menuBox.classList.add('hidden')
            }
        })
    }

    // Mobile menu
    if (hamburgerButton && menuBox) {
        hamburgerButton.addEventListener('click', (event) => {
            menuBox.classList.toggle('hidden')
            event.stopPropagation()
        })
    }

    // Close menu when clicking outside
    if (menuBox) {
        document.addEventListener('click', (event) => {
            if (!menuBox.classList.contains('hidden') &&
                !menuBox.contains(event.target) &&
                event.target !== hamburgerButton) {
                menuBox.classList.add('hidden')
            }
        })
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