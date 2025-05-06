# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trestle is a web-based hierarchical todo list application with RDF/SPARQL backend support. It allows users to create, organize, and manage nested tasks with rich text descriptions using markdown.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 9090)
npm run dev

# Build for production
npm run build

# Run all tests
npm test

# Generate documentation
npm run docs
```

## Project Architecture

Trestle follows an MVC architecture pattern with RDF data model integration:

### Core Components

1. **Model Layer**
   - `TrestleModel.js`: Core data model that manages the hierarchical structure of todo items
   - `TrestleRDFModel.js`: RDF-specific implementation that interfaces with SPARQL endpoints

2. **View Layer**
   - `TrestleView.js`: Handles UI rendering and DOM interactions

3. **Controller Layer**
   - `TrestleController.js`: Manages application logic and mediates between model and view

4. **Data Flow**
   - The application uses an event-driven architecture with event bus for communication between components
   - RDF model allows storing data in a standard RDF triplestore using SPARQL
   - Model updates trigger view updates through the event system

### RDF Data Model

The data model uses RDF with the following predicates:
- `dc:title`: Item title
- `dc:created`: Creation timestamp
- `dc:description`: Markdown description
- `ts:index`: Position in parent's children list
- `ts:parent`: Reference to parent node

## Testing

The project uses Jasmine for testing:
- Tests are located in the `test/` directory
- Unit tests for model components in `test/unit/`
- Integration tests in `test/integration/`

## Build System

- Webpack is used for bundling and building
- Babel for transpilation
- The entry point is `src/js/main.js`
- CSS is processed and bundled separately