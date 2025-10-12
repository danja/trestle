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

# Run tests with UI
npm test:ui

# Generate documentation
npm run docs

# Generate repository summary
npm run rp
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

The project uses Vitest with jsdom environment:
- Tests are located in the `test/` directory
- Test files follow the pattern `*.test.js`
- Global test utilities available (globals: true in vitest config)
- Use `npm test:ui` for interactive testing interface
- `npm test` runs the full suite in headless mode (Vitest CLI). The command can log verbose component diagnostics; allow up to ~10s for completion.

## Build System

- Vite handles dev server and production builds (`vite.config.js`)
- Root HTML entry is `index.html`; JS bootstrap lives in `src/js/main.js`
- Styles under `src/css/` are imported from `src/js/main.js` so Vite bundles them automatically
- Development server (and preview) run on port 9090 by default (`npm run dev`, `npm run preview`)
- Build output is emitted to `dist/`

## Configuration

- SPARQL endpoint configuration is in `src/js/config.js`
- Vite configuration in `vite.config.js`
- JSDoc configuration in `jsdoc.json`
