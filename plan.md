# Trestle Toolbar Components Implementation Plan

## Overview

This document outlines a plan for implementing the components visible in the toolbar at the top of the Trestle application. The implementation will follow existing patterns and best practices found in the codebase.

## Architecture Patterns

Based on analysis of the existing codebase:

1. **MVC Architecture**: The application follows a Model-View-Controller pattern
2. **Component-Based**: UI elements are implemented as modular JavaScript classes
3. **Event-Driven**: Communication between components uses an EventBus, the `evb` library
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

## Implementation Status

### Completed Components:

1. **Hamburger Menu Button** ✅
   - Toggles the slide-out menu for mobile/compact views
   - Handles click events and keyboard navigation
   - Closes when clicking outside or pressing Escape

2. **Navigation Controls (Back/Forward/Home)** ✅
   - Tracks navigation history
   - Handles back/forward navigation
   - Returns to home view

3. **Breadcrumb Navigation** ✅
   - Displays current location in hierarchy
   - Allows direct navigation to parent nodes
   - Updates on navigation events

4. **Search Bar** ✅
   - Implements debounced search
   - Handles keyboard navigation
   - Provides visual feedback

5. **Favorites System** ✅
   - Tracks favorite items
   - Persists favorites to localStorage
   - Provides quick access to frequently used nodes

6. **Options Menu** ✅
   - Displays application options
   - Handles keyboard navigation
   - Triggers appropriate actions

## Next Steps

1. **Testing**:
   - Add unit tests for new components
   - Test cross-browser compatibility
   - Test responsive behavior

2. **Enhancements**:
   - Add keyboard shortcuts documentation
   - Implement import/export functionality
   - Add settings panel

3. **Performance Optimization**:
   - Optimize search performance for large datasets
   - Implement virtual scrolling for long lists
   - Add loading states for async operations

4. **Accessibility**:
   - Ensure all components are keyboard navigable
   - Add ARIA attributes where needed
   - Test with screen readers
