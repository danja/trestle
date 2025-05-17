# Trestle Toolbar Components Implementation Plan

## Overview

This document outlines a plan for implementing the components visible in the toolbar at the top of the Trestle application. The implementation will follow existing patterns and best practices found in the codebase.

## Architecture Patterns

Based on analysis of the existing codebase:

1. **MVC Architecture**: The application follows a Model-View-Controller pattern
2. **Component-Based**: UI elements are implemented as modular JavaScript classes
3. **Event-Driven**: Communication between components uses an EventBus
4. **Template-Based Rendering**: Components use templates for rendering HTML

## Toolbar Components

### 1. Hamburger Menu Button
- **Functionality**: Toggles the slide-out menu for mobile/compact views
- **Implementation**:
  - Create a `HamburgerMenu.js` component in `src/js/view/components/`
  - Listen for click events and emit via EventBus
  - Toggle the visibility of the menu container
  - Already has event listeners in main.js, but needs proper component class

### 2. Navigation Buttons (Back/Forward)
- **Functionality**: Navigate through view history
- **Implementation**:
  - Create a `NavigationControls.js` component in `src/js/view/components/`
  - Implement history tracking (store visited nodes)
  - Emit events like `view:navigateBack` and `view:navigateForward`
  - Add corresponding handlers in the controller

### 3. Home Button
- **Functionality**: Return to root view
- **Implementation**:
  - Add to `NavigationControls.js` component
  - Emit `view:navigateHome` event
  - Add handler in controller to reset view to root node

### 4. Breadcrumb Navigation
- **Functionality**: Display current location in hierarchy and allow direct navigation
- **Implementation**:
  - Create a `Breadcrumb.js` component in `src/js/view/components/`
  - Update breadcrumb when navigation occurs
  - Emit `view:navigateTo` event with target nodeId on click
  - Initial implementation exists in TrestleView, needs to be extracted

### 5. Search Bar
- **Functionality**: Search for items in the hierarchy
- **Implementation**:
  - Create a `SearchBar.js` component in `src/js/view/components/`
  - Implement input event listeners (debounced)
  - Emit `view:search` event with search term
  - Add search algorithm in model/controller
  - Highlight search results in the view

### 6. Favorites Button
- **Functionality**: View and manage favorite/bookmarked items
- **Implementation**:
  - Create a `Favorites.js` component in `src/js/view/components/`
  - Add favorites management to the model (add/remove favorites)
  - Implement favorites panel in the view
  - Emit events like `view:addFavorite` and `view:removeFavorite`

### 7. Options Button
- **Functionality**: Show additional options for the current view/item
- **Implementation**:
  - Create an `OptionsMenu.js` component in `src/js/view/components/`
  - Implement dropdown menu with contextual options
  - Handle item-specific actions based on current view

## Implementation Approach

1. **Component Creation**:
   - Create each component following the pattern of existing components
   - Each component should have its own class with render and event handling methods
   - Follow the EventBus pattern for communication

2. **Controller Integration**:
   - Add event handlers in TrestleController for new events
   - Implement necessary model methods for data manipulation

3. **View Integration**:
   - Initialize components in TrestleView constructor
   - Wire up event listeners

4. **Model Updates**:
   - Add new model methods as needed (e.g., for favorites, search)

## Development Order

1. Extract existing functionality into proper components (breadcrumb, hamburger menu)
2. Implement navigation controls (back, forward, home)
3. Implement search functionality
4. Implement favorites system
5. Implement options menu

## Testing Approach

1. Create unit tests for each component in the test directory
2. Follow existing testing patterns
3. Test component rendering and event handling
4. Test integration with controller and model
