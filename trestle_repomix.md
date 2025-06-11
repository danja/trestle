This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
4. Repository files, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
- Pay special attention to the Repository Description. These contain important context and guidelines specific to this project.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: test, public, docs, .env, knowledge, **/_*/**, _*, **/_*, **/webpack/*, *.log, **/*repopack*, **/*repomix*, **/*old*, **/*prompt*
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

<additional_info>
<user_provided_header>
Trestle Source Code
</user_provided_header>

</additional_info>

</file_summary>

<directory_structure>
src/
  core/
    errors/
      error-types.js
  css/
    parts/
      _breadcrumb.css
      _card.css
      _console.css
      _favorites.css
      _header.css
      _menu.css
      _options.css
      _panel.css
      _reset.css
      _responsive.css
      _rightpanel.css
      _searchbar.css
      _shortcuts.css
      _toolbar.css
      _tree.css
      _variables.css
    right-panel.css
    trestle.css
  domain/
    rdf/
      RDFModel.js
  html/
    index.html
    right-panel.html
  js/
    controller/
      TrestleController.js
    model/
      TrestleModel.js
      TrestleRDFModel.js
    utils/
      EventLogger.js
      utils.js
    view/
      components/
        Breadcrumb.js
        CardDetail.js
        ConsolePanel.js
        ContextMenu.js
        DragDropHandler.js
        ExpanderButton.js
        Favorites.js
        HamburgerMenu.js
        InlineEditor.js
        NavigationControls.js
        NodeSelector.js
        OptionsMenu.js
        RightPanel.js
        SearchBar.js
        ShortcutsPanel.js
        TreeNode.js
      index.js
      TrestleView.js
    config.js
    main.js
  utils/
    utils.js
test-results/
  .last-run.json
.gitignore
CLAUDE.md
jsdoc.json
LICENSE
package.json
plan.md
README.md
repomix.config.json
vitest.config.js
webpack.config.js
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="src/core/errors/error-types.js">
export class RDFError extends Error {






    constructor(message, details = {}) {
        super(message)
        this.name = 'RDFError'
        this.details = details


        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RDFError)
        }
    }
}




export class ModelError extends Error {




    constructor(message, details = {}) {
        super(message)
        this.name = 'ModelError'
        this.details = details


        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ModelError)
        }
    }
}
</file>

<file path="src/css/parts/_breadcrumb.css">
.breadcrumb {
    display: flex;
    align-items: center;
    margin-left: 12px;
    font-size: 1rem;
    color: #888;
}

.breadcrumb-link {
    color: #3a7ca5;
    text-decoration: none;
    margin: 0 2px;
    font-weight: 500;
}

.breadcrumb-link:hover {
    text-decoration: underline;
}

.breadcrumb-separator {
    margin: 0 4px;
    color: #bbb;
}

.breadcrumb-current {
    color: #444;
    font-weight: 600;
    margin-left: 2px;
}
</file>

<file path="src/css/parts/_card.css">
.card {
    background: var(--panel-bg, #fff);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    border: 1px solid var(--border-color, #e0e0e0);
    margin: 1em 0;
    padding: 1.25em 1.5em;
    transition: box-shadow 0.2s;
    position: relative;
}

.card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
}

.card-header {
    font-size: 1.15em;
    font-weight: 600;
    margin-bottom: 0.5em;
    color: var(--primary, #2a2a2a);
    display: flex;
    align-items: center;
    gap: 0.5em;
}

.card-content {
    font-size: 1em;
    color: var(--text, #333);
    margin-bottom: 0.5em;
}

.card-footer {
    border-top: 1px solid var(--border-color, #e0e0e0);
    margin-top: 1em;
    padding-top: 0.75em;
    font-size: 0.95em;
    color: var(--muted, #888);
    display: flex;
    justify-content: flex-end;
    gap: 1em;
}

.card-actions {
    display: flex;
    gap: 0.5em;
    margin-top: 0.5em;
}

.card-action-btn {
    background: var(--button-bg, #f5f5f5);
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    padding: 0.3em 0.8em;
    font-size: 0.97em;
    cursor: pointer;
    transition: background 0.15s, border 0.15s;
}

.card-action-btn:hover {
    background: var(--button-hover, #eaeaea);
    border-color: var(--primary, #2a2a2a);
}

.card.selected {
    border-color: var(--primary, #2a2a2a);
    box-shadow: 0 0 0 2px var(--primary, #2a2a2a33);
}

.card .card-badge {
    background: var(--accent, #ffb300);
    color: #fff;
    border-radius: 2em;
    font-size: 0.85em;
    padding: 0.1em 0.7em;
    margin-left: 0.5em;
    vertical-align: middle;
    display: inline-block;
}

.card.collapsed .card-content,
.card.collapsed .card-footer,
.card.collapsed .card-actions {
    display: none;
}

.card.collapsed {
    cursor: pointer;
    min-height: 2.5em;
}
</file>

<file path="src/css/parts/_console.css">
.console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: var(--bg-color-console-header, #252526);
    border-bottom: 1px solid var(--border-color, #333);
    border-radius: 4px 4px 0 0;
}

.log-level-selector {
    display: flex;
    align-items: center;
    gap: 8px;
}

.log-level-selector label {
    color: var(--text-color, #e0e0e0);
    font-size: 13px;
    white-space: nowrap;
}

.log-level-selector select {
    background-color: var(--bg-color-input, #3c3c3c);
    color: var(--text-color, #e0e0e0);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 13px;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
}

.log-level-selector select:focus {
    border-color: var(--primary-color, #4a9cff);
    box-shadow: 0 0 0 1px var(--primary-color, #4a9cff);
}

.console-actions {
    display: flex;
    gap: 8px;
}

#console-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#console-output {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    background-color: var(--bg-color-console, #1e1e1e);
    color: var(--text-color, #e0e0e0);
}

.console-empty-state {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    text-align: center;
    padding: 20px;
    pointer-events: none;
}

.console-entry {
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 0.9em;
    line-height: 1.6;
    font-family: 'Fira Code', 'Courier New', monospace;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    word-break: break-word;
    position: relative;
    overflow: hidden;
}

.console-entry:hover {
    filter: brightness(0.98);
}

.console-message {
    flex: 1;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
}
</file>

<file path="src/css/parts/_favorites.css">
#favoritesButton {
    font-size: 1.3rem;
    color: #888;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

#favoritesButton:hover {
    color: var(--primary-color);
    background-color: var(--hover-bg);
}

#favoritesButton.is-favorite {
    color: #ffc107;
}

#favoritesButton[aria-pressed="true"] {
    background-color: rgba(0, 0, 0, 0.1);
}


.favorites-panel {
    position: fixed;
    top: 54px;
    right: 16px;
    width: 280px;
    max-height: 400px;
    background: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.favorites-panel.hidden {
    display: none;
}

.favorites-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
}

.favorites-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.favorites-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--secondary-color);
    padding: 0 4px;
    line-height: 1;
}

.favorites-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
}

.no-favorites {
    padding: 16px;
    text-align: center;
    color: var(--secondary-color);
    font-style: italic;
}

.favorites-items {
    list-style: none;
    padding: 0;
    margin: 0;
}

.favorite-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    transition: background-color 0.2s ease;
}

.favorite-item:hover {
    background-color: var(--hover-bg);
}

.favorite-item a {
    flex: 1;
    color: var(--primary-color);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 8px;
}

.favorite-item a:hover {
    text-decoration: underline;
}

.favorite-remove {
    background: none;
    border: none;
    color: #dc3545;
    cursor: pointer;
    opacity: 0.7;
    padding: 2px 6px;
    border-radius: 4px;
    line-height: 1;
}

.favorite-remove:hover {
    opacity: 1;
    background-color: rgba(220, 53, 69, 0.1);
}


@media (max-width: 768px) {
    .favorites-panel {
        width: calc(100% - 32px);
        right: 16px;
    }
}
</file>

<file path="src/css/parts/_header.css">
#header-outer {
    background-color: var(--primary-color);
    color: #fff;
    padding: 0 16px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

#header {
    font-size: 1.4rem;
    font-weight: 600;
    letter-spacing: 0.3px;
}
</file>

<file path="src/css/parts/_menu.css">
#menu-box {
    position: fixed;
    top: 54px;
    right: 0;
    background-color: white;
    border-radius: 0 0 0 8px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    width: auto;
    left: auto;
}

#menu-box.hidden {
    display: none;
}

#menu-box .toolbar ul {
    list-style-type: none;
    margin: 0;
    padding: 0.2em 0;
}

#menu-box .toolbar li {
    text-align: center;
    margin: 5px;
}

#menu-box .toolbar button {
    width: 130px;
    background-color: #f5f5f5;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

#menu-box .toolbar button:hover {
    background-color: #e0e0e0;
}


#container {
    position: fixed;
    top: 54px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    padding: 1.5em;
    background-color: var(--background-color);
    z-index: 1;
}


#trestle {
    padding: 0;
    margin: 0;
    position: relative;
    min-height: 100vh;
    background-color: var(--background-color);
    transition: margin-right 0.3s ease;
}
</file>

<file path="src/css/parts/_options.css">
#optionsButton {
    font-size: 1.3rem;
    color: #888;
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

#optionsButton:hover {
    background-color: var(--hover-bg);
}

#optionsButton .vertical-line {
    display: inline-block;
    width: 1px;
    height: 18px;
    background: #ccc;
    margin-left: 4px;
}


.options-menu {
    position: fixed;
    top: 54px;
    right: 16px;
    width: 240px;
    background: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
    display: none;
}

.options-menu.visible {
    display: block;
}

.options-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
}

.options-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.options-list {
    padding: 8px 0;
}

.option-item {
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
}

.option-item:hover {
    background-color: var(--hover-bg);
}

.option-item i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
}

.options-menu-list {
    list-style: none;
    padding: 8px 0;
    margin: 0;
}

.options-menu-item {
    margin: 0;
    padding: 0;
}

.options-menu-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    text-align: left;
    color: #333;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.options-menu-button:hover,
.options-menu-button:focus {
    background-color: var(--hover-bg);
    outline: none;
}

.options-menu-button[aria-disabled="true"] {
    color: #999;
    cursor: not-allowed;
    opacity: 0.7;
}

.options-menu-icon {
    margin-right: 12px;
    width: 20px;
    text-align: center;
}

.options-menu-label {
    flex: 1;
}


.options-menu-divider {
    height: 1px;
    background-color: var(--border-color);
    margin: 4px 0;
}


@media (max-width: 768px) {
    .options-menu {
        width: calc(100% - 32px);
        right: 16px;
    }

    .favorites-panel {
        width: calc(100% - 32px);
        right: 16px;
        left: 16px;
        max-height: 50vh;
    }
}
</file>

<file path="src/css/parts/_panel.css">
.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color, #eaeaea);
    background-color: var(--background-color, #fff);
}

.panel-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--secondary-color, #555);
}

.panel-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--secondary-color, #555);
    padding: 4px;
    border-radius: 4px;
}

.panel-close:hover {
    background-color: var(--hover-bg, rgba(0, 0, 0, 0.05));
}

.panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}
</file>

<file path="src/css/parts/_reset.css">
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    background-color: var(--highlight-color);
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
}

body {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</file>

<file path="src/css/parts/_responsive.css">
@media (max-width: 768px) {
    #header {
        font-size: 1.1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }

    .breadcrumb {
        display: none;
    }

    .search-bar input[type="text"] {
        width: 100px;
    }

    .search-bar input[type="text"]:focus {
        width: 140px;
    }

    #container {
        flex-direction: column;
        margin-top: 54px;
    }

    #right-panel {
        position: static;
        width: 100%;
        height: auto;
        max-height: 50vh;
        border-left: none;
        border-top: 1px solid var(--border-color);
    }
}
</file>

<file path="src/css/parts/_rightpanel.css">
#right-panel {

    position: fixed;
    top: 54px;
    right: 0;
    bottom: 0;
    width: 400px;
    max-width: 90vw;


    background-color: #ffffff;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
    border-left: 3px solid #3a7ca5;
    z-index: 9999;


    display: flex;
    flex-direction: column;
    overflow-y: auto;


    transform: translateX(100%);
    opacity: 0;
    visibility: hidden;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

#right-panel::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    z-index: 10;
}

#right-panel.resizing {
    transition: none;
    user-select: none;
}

.right-panel.visible {
    right: 0;
}

.right-panel.visible+#trestle {
    margin-right: 400px;
}

#right-panel.hidden {
    display: none;
    transform: translateX(100%);
    opacity: 0;
    visibility: hidden;
}


.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background-color: var(--card-header-bg);
    color: var(--card-header-color);
    position: relative;
    z-index: 1;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.panel-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.panel-action-button {
    background: none;
    border: none;
    color: var(--card-header-color);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.panel-action-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.panel-action-button svg {
    width: 20px;
    height: 20px;
}

.panel-header h3 {
    margin: 0;
    font-size: 1.2em;
}


.panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}


.panel-section {
    margin-bottom: 20px;
}

.panel-section.hidden {
    display: none;
}

.panel-section h4 {
    margin: 0 0 10px 0;
    color: var(--text-color);
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}


.panel-title {
    margin: 0;
    font-size: 1.2em;
    font-weight: 500;
}


.panel-close {
    background: none;
    border: none;
    color: var(--card-header-color);
    font-size: 1.5em;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    opacity: 0.8;
}

.panel-close:hover {
    opacity: 1;
}



#right-panel.visible,
body.panel-visible #right-panel {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
    border-left: 3px solid var(--primary-color, #3a7ca5);
}


#right-panel.hidden {
    display: none;
    transform: translateX(100%);
    opacity: 0;
    visibility: hidden;
}


.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color, #eaeaea);
    background-color: var(--background-color, #fff);
}

.panel-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--secondary-color, #555);
}

.panel-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--secondary-color, #555);
    padding: 4px;
    border-radius: 4px;
}

.panel-close:hover {
    background-color: var(--hover-bg, rgba(0, 0, 0, 0.05));
}


@media (max-width: 768px) {
    #right-panel {
        width: 100%;
        max-width: 100%;
    }

    .right-panel.visible+#trestle {
        margin-right: 0;
    }
}
</file>

<file path="src/css/parts/_searchbar.css">
.search-bar {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    padding: 2px 8px;
    margin-right: 8px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.search-bar:focus-within {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(58, 124, 165, 0.2);
}

.search-bar input[type="text"] {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9rem;
    padding: 6px 8px 6px 4px;
    width: 140px;
    color: #fff;
    transition: width 0.2s ease;
}

.search-bar input[type="text"]::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.search-bar input[type="text"]:focus {
    width: 200px;
}

.search-icon {
    color: rgba(255, 255, 255, 0.8);
    margin-right: 4px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
</file>

<file path="src/css/parts/_shortcuts.css">
.shortcuts-list {
    list-style: none;
    padding: 0;
}

.shortcuts-list li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.shortcuts-list kbd {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 3px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    color: #333;
    display: inline-block;
    font-family: monospace;
    font-size: 0.9em;
    line-height: 1.4;
    padding: 1px 6px;
    margin-right: 10px;
    white-space: nowrap;
}
</file>

<file path="src/css/parts/_toolbar.css">
.top-navbar.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 16px;
    height: 54px;
    border-bottom: 1px solid #eee;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    position: relative;
    z-index: 10;
}

.toolbar-left,
.toolbar-right {
    display: flex;
    align-items: center;
}

.toolbar-left {
    gap: 4px;
}

.toolbar-right {
    gap: 8px;
}

.toolbar-icon {
    background: none;
    border: none;
    color: #444;
    font-size: 1.3rem;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    align-items: center;
}

.toolbar-icon:hover {
    background: #f5f5f5;
}
</file>

<file path="src/css/parts/_tree.css">
#trestle {
    display: block;
    margin: 0;
    list-style: none;
    user-select: none;
    font-size: 1rem;
    line-height: 1.5;
}

#trestle ul {
    list-style: none;
    padding-left: 24px;
    margin-left: 4px;
    border-left: 1px solid #eee;
}

#trestle li {
    display: block;
    position: relative;
    margin: 2px 0;
}

.ts-entry {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 28px;
    padding: 4px 0;
    border-radius: 4px;
    transition: background-color 0.15s ease;
}

.ts-entry:hover {
    background-color: var(--hover-bg);
}

.ts-title {
    cursor: text;
    outline: none;
    padding: 3px 6px;
    line-height: 1.5;
    flex-grow: 1;
    border-radius: 3px;
    transition: background-color 0.15s ease;
}

.ts-title:focus {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0 2px var(--focus-color);
}

.ts-title:empty::before {
    content: "New item...";
    color: #aaa;
    font-style: italic;
}

.ts-handle {
    visibility: hidden;
    cursor: move;
    color: #777;
    padding: 0 4px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ts-entry:hover .ts-handle {
    visibility: visible;
    opacity: 0.7;
}

.ts-entry .ts-handle:hover {
    opacity: 1;
    color: #444;
}

.ts-actions {
    display: none;
    padding: 0 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ts-entry:hover .ts-actions {
    display: flex;
    opacity: 0.7;
}

.ts-entry .ts-actions:hover {
    opacity: 1;
}

.ts-actions button {
    background: none;
    border: none;
    cursor: pointer;
    margin: 0 2px;
    padding: 3px;
    font-size: 14px;
    color: #666;
    border-radius: 3px;
    transition: background-color 0.15s ease;
}

.ts-actions button:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #555;
}

.ts-expander {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    position: relative;
    margin-right: 2px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ts-expander:hover {
    opacity: 1;
}

.ts-expander::before {
    content: "▾";
    font-size: 11px;
    color: #555;
    font-weight: bold;
}

.ts-closed>.ts-entry>.ts-expander::before {
    content: "▸";
    color: #555;
    font-weight: bold;
}

.ts-closed>ul {
    display: none;
}

.ts-highlight {
    background-color: var(--highlight-bg);
}

.ts-selected {
    background-color: var(--selected-bg);
    border-left: 2px solid var(--selected-border);
}

.ts-selected .ts-title {
    margin-left: -2px;
}

.ts-dragging {
    opacity: 0.5;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: grabbing;
}

.ts-dragging-item {
    opacity: 0.7;
    position: relative;
    z-index: 5;
}

.ts-dragging-active .ts-handle {
    cursor: grabbing;
}

.dropzone {
    height: 8px;
    background-color: transparent;
    transition: all 0.2s ease;
    border-radius: 4px;
    position: relative;
    z-index: 10;
}

.dropzone.active {
    background: #e3f2fd;
    border-color: #90caf9;
}


.ts-drop-indent {
    background-color: #e0ffe0 !important;

    border-left: 4px solid #4caf50 !important;
}

.ts-drop-outdent {
    background-color: #ffe0e0 !important;

    border-right: 4px solid #f44336 !important;
}


.ts-dragging-active .dropzone {
    border: 1px dashed transparent;
}

.ts-dragging-active .dropzone:hover {
    border-color: rgba(33, 150, 243, 0.5);
    background-color: rgba(33, 150, 243, 0.1);
}

.drag-placeholder {
    border: 1px dashed #aaa;
    background-color: #f9f9f9;
    height: 30px;
    margin: 4px 0;
    border-radius: 4px;
}

[contenteditable="true"]:focus {
    background-color: white;
    outline: none;
}

.text-box {
    background-color: white;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    line-height: 1.5;
}


.ts-closed:not(:has(ul))>.ts-entry>.ts-expander::before {
    content: "•";
    opacity: 0.8;
    color: #444;
    font-size: 14px;
}


.ts-add-between {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
    z-index: 5;
}

.ts-add-between::before {
    content: "+";
    color: #666;
    font-size: 16px;
    background-color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    font-weight: bold;
}

.dropzone:hover .ts-add-between {
    opacity: 1;
}

.ts-add-between:hover::before {
    color: var(--primary-color);
    border-color: var(--primary-color);
}
</file>

<file path="src/css/parts/_variables.css">
:root {
    --primary-color: #3a7ca5;
    --secondary-color: #555;
    --highlight-color: #f5f7fa;
    --background-color: #fff;
    --border-color: #eaeaea;
    --selected-bg: #e1f5fe;
    --selected-border: #4fc3f7;
    --highlight-bg: #f5f5f5;
    --card-header-bg: #3a7ca5;
    --card-header-color: #fff;
    --hover-bg: rgba(0, 0, 0, 0.03);
    --focus-color: #2196f3;
}
</file>

<file path="src/domain/rdf/RDFModel.js">
import rdf from 'rdf-ext'
import { RDFError } from '../../core/errors/error-types.js'
import { namespaces, generateNid } from '../../utils/utils.js'

class RDFModel {
    constructor() {
        this.ns = {}


        Object.entries(namespaces).forEach(([prefix, uri]) => {
            this.ns[prefix] = rdf.namespace(uri)
        })
    }






    createPostData(postData) {
        try {
            const dataset = rdf.dataset()



            const postId = postData.customId || generateNid(postData.content || '')
            const subject = rdf.namedNode(postId)

            // Get optional graph
            const graph = postData.graph ?
                rdf.namedNode(postData.graph) :
                null

            // Helper to add quads to dataset
            const addQuad = (s, p, o) => {
                if (graph) {
                    dataset.add(rdf.quad(s, p, o, graph))
                } else {
                    dataset.add(rdf.quad(s, p, o))
                }
            }

            // Add type based on postData.type, default to 'entry' if not specified
            const postType = postData.type || 'entry'
            addQuad(
                subject,
                this.ns.rdf('type'),
                this.ns.squirt(postType)
            )


            if (postData.content) {
                addQuad(
                    subject,
                    this.ns.squirt('content'),
                    rdf.literal(postData.content)
                )
            }


            addQuad(
                subject,
                this.ns.dc('created'),
                rdf.literal(new Date().toISOString(), rdf.namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))
            )


            if (postData.title) {
                addQuad(
                    subject,
                    this.ns.dc('title'),
                    rdf.literal(postData.title)
                )
            }


            if (postData.tags && Array.isArray(postData.tags)) {
                postData.tags.forEach(tag => {
                    if (tag && typeof tag === 'string' && tag.trim().length > 0) {
                        addQuad(
                            subject,
                            this.ns.squirt('tag'),
                            rdf.literal(tag.trim())
                        )
                    }
                })
            }


            if (postType === 'link' && postData.url) {
                try {
                    const urlNode = rdf.namedNode(postData.url)
                    addQuad(
                        subject,
                        this.ns.squirt('url'),
                        urlNode
                    )
                } catch (urlError) {
                    console.warn(`Invalid URL provided for link post ${postId}: ${postData.url}`)

                    throw new RDFError(`Invalid URL format for link post: ${postData.url}`, { originalError: urlError, postData })
                }
            }


            if (postType === 'wiki') {
                addQuad(
                    subject,
                    this.ns.dc('modified'),
                    rdf.literal(new Date().toISOString(), rdf.namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))
                )
            }


            if (postType === 'profile') {

                const foaf = this.ns.foaf || rdf.namespace('http://xmlns.com/foaf/0.1/')





                if (postData.foafName) {
                    addQuad(
                        subject,
                        foaf('name'),
                        rdf.literal(postData.foafName)
                    )
                }

                if (postData.foafNick) {
                    addQuad(
                        subject,
                        foaf('nick'),
                        rdf.literal(postData.foafNick)
                    )
                }

                if (postData.foafMbox) {
                    try {
                        const mboxNode = rdf.namedNode(postData.foafMbox)
                        addQuad(subject, foaf('mbox'), mboxNode)
                    } catch (mboxError) {
                        console.warn(`Invalid mbox URI provided for profile ${postId}: ${postData.foafMbox}`)
                        throw new RDFError(`Invalid mbox URI format for profile: ${postData.foafMbox}`, { originalError: mboxError, postData })
                    }
                }

                if (postData.foafHomepage) {
                    try {
                        const homepageNode = rdf.namedNode(postData.foafHomepage)
                        addQuad(subject, foaf('homepage'), homepageNode)
                    } catch (homepageError) {
                        console.warn(`Invalid homepage URL provided for profile ${postId}: ${postData.foafHomepage}`)
                        throw new RDFError(`Invalid homepage URL format for profile: ${postData.foafHomepage}`, { originalError: homepageError, postData })
                    }
                }

                if (postData.foafImg) {
                    try {
                        const imgNode = rdf.namedNode(postData.foafImg)
                        addQuad(subject, foaf('img'), imgNode)
                    } catch (imgError) {
                        console.warn(`Invalid image URL provided for profile ${postId}: ${postData.foafImg}`)
                        throw new RDFError(`Invalid image URL format for profile: ${postData.foafImg}`, { originalError: imgError, postData })
                    }
                }


                if (postData.foafAccounts && Array.isArray(postData.foafAccounts)) {
                    postData.foafAccounts.forEach(account => {

                        if (account && account.serviceHomepage) {
                            try {

                                const accountNode = rdf.blankNode()


                                addQuad(subject, foaf('account'), accountNode)


                                addQuad(
                                    accountNode,
                                    foaf('accountServiceHomepage'),
                                    rdf.namedNode(account.serviceHomepage)
                                )


                                if (account.accountName) {
                                    addQuad(
                                        accountNode,
                                        foaf('accountName'),
                                        rdf.literal(account.accountName)
                                    )
                                }
                            } catch (accountError) {
                                console.warn(`Invalid account data provided for profile ${postId}:`, account)

                            }
                        }
                    })
                }
            }


            for (const key in postData) {
                if (Object.hasOwnProperty.call(postData, key)) {

                    const knownProps = ['customId', 'graph', 'type', 'content', 'title', 'tags', 'url',
                        'foafName', 'foafNick', 'foafMbox', 'foafHomepage', 'foafImg', 'foafAccounts']
                    if (!knownProps.includes(key) && postData[key] !== undefined && postData[key] !== null) {

                        const value = postData[key]
                        let objectNode

                        if (typeof value === 'string' && (value.startsWith('http:') || value.startsWith('https:') || value.startsWith('urn:'))) {
                            try {
                                objectNode = rdf.namedNode(value)
                            } catch (uriError) {
                                console.warn(`Could not create named node for custom property ${key} with value ${value}. Treating as literal.`)
                                objectNode = rdf.literal(value.toString())
                            }
                        } else {

                            objectNode = rdf.literal(value.toString())
                        }
                        addQuad(subject, this.ns.squirt(key), objectNode)
                    }
                }
            }


            return {
                id: postId,
                dataset,
                subject: subject,
                graph: graph,
                originalData: postData
            }
        } catch (error) {

            if (error instanceof RDFError) {
                throw error
            }
            throw new RDFError(`Failed to create post data: ${error.message}`, {
                originalError: error,
                postData
            })
        }
    }
}
export default RDFModel
</file>

<file path="src/html/right-panel.html">
<div id="right-panel" class="hidden" aria-labelledby="panel-title" role="complementary">

  <div class="panel-header">
    <h2 id="panel-title">Console</h2>
    <button id="close-panel" class="panel-close" title="Close panel" aria-label="Close panel">
      &times;
    </button>
  </div>


  <div class="panel-tabs">
    <button class="tab-button active" data-view="console" aria-selected="true" aria-controls="console-content">
      Console
    </button>
    <button class="tab-button" data-view="shortcuts" aria-selected="false" aria-controls="shortcuts-content">
      Shortcuts
    </button>
  </div>


  <div class="panel-content">

    <div id="console-content" class="panel-section active" role="tabpanel" aria-labelledby="console-tab">
      <div class="console-header">
        <div class="log-level-selector">
          <label for="log-level">Log Level:</label>
          <select id="log-level">
            <option value="trace">Trace</option>
            <option value="debug" selected>Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="silent">Silent</option>
          </select>
        </div>
        <div class="console-actions">
          <button id="clear-console" class="console-button" title="Clear console" aria-label="Clear console">
            <i class="icon-clear"></i>
            <span>Clear</span>
          </button>
        </div>
      </div>
      <div id="console-output" class="console-output" aria-live="polite" aria-atomic="false">
        <div class="console-empty-state">
          <i class="icon-terminal"></i>
          <p>Console is empty</p>
          <p class="hint">Events and logs will appear here</p>
        </div>
      </div>
    </div>


    <div id="shortcuts-content" class="panel-section" role="tabpanel" aria-labelledby="shortcuts-tab" hidden>
      <div class="shortcuts-list">

      </div>
    </div>
  </div>


  <div class="resize-handle" aria-hidden="true"></div>
</div>


<button id="mobileConsoleButton" class="mobile-console-button" title="Toggle console" aria-label="Toggle console">
  <i class="icon-terminal"></i>
</button>
</file>

<file path="src/js/utils/utils.js">
export function generateID() {
    const now = new Date()
    const timestamp = formatDate(now, "yyyy-mm-dd-HH-MM-ss-l")
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${timestamp}-${random}`
}





export function generateDate() {
    return new Date().toISOString()
}








export function formatDate(date, mask, utc = true) {
    const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g
    const timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g
    const timezoneClip = /[^-+\dA-Z]/g

    const pad = (val, len) => {
        val = String(val)
        len = len || 2
        while (val.length < len) val = "0" + val
        return val
    }


    if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
        mask = date
        date = undefined
    }


    date = date ? new Date(date) : new Date()
    if (isNaN(date)) throw SyntaxError("invalid date")

    mask = String(masks[mask] || mask || masks["default"])


    if (mask.slice(0, 4) === "UTC:") {
        mask = mask.slice(4)
        utc = true
    }

    const _ = utc ? "getUTC" : "get"
    const d = date[_ + "Date"]()
    const D = date[_ + "Day"]()
    const m = date[_ + "Month"]()
    const y = date[_ + "FullYear"]()
    const H = date[_ + "Hours"]()
    const M = date[_ + "Minutes"]()
    const s = date[_ + "Seconds"]()
    const L = date[_ + "Milliseconds"]()
    const o = utc ? 0 : date.getTimezoneOffset()

    const flags = {
        d: d,
        dd: pad(d),
        ddd: dayNames[D],
        dddd: dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: monthNames[m],
        mmmm: monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad(L > 99 ? Math.round(L / 10) : L),
        t: H < 12 ? "a" : "p",
        tt: H < 12 ? "am" : "pm",
        T: H < 12 ? "A" : "P",
        TT: H < 12 ? "AM" : "PM",
        Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    }

    return mask.replace(token, function ($0) {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
    })
}


const masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
}


const dayNames = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]






export function escapeHtml(text) {
    if (!text) return ''

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}






export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item))
    }

    const cloned = {}
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key])
        }
    }

    return cloned
}
</file>

<file path="src/js/view/components/Favorites.js">
export class Favorites {







  constructor(rootElement, eventBus, { storageKey = 'trestle-favorites' } = {}) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.storageKey = storageKey;
    this.favorites = new Map();
    this.isPanelOpen = false;


    this.favoritesButton = this.rootElement?.querySelector('#favoritesButton');
    this.favoritesPanel = null;

    if (!this.favoritesButton) {
      console.warn('Favorites button not found');
      return;
    }

    this.initialize();
  }




  initialize() {

    this.createFavoritesPanel();


    this.loadFavorites();


    this.favoritesButton.addEventListener('click', this.togglePanel.bind(this));


    document.addEventListener('click', this.handleOutsideClick.bind(this));


    this.eventBus.on('favorites:add', this.handleAddFavorite.bind(this));
    this.eventBus.on('favorites:remove', this.handleRemoveFavorite.bind(this));
    this.eventBus.on('favorites:toggle', this.handleToggleFavorite.bind(this));
    this.eventBus.on('favorites:update', this.handleUpdateFavorites.bind(this));
  }




  createFavoritesPanel() {
    this.favoritesPanel = document.createElement('div');
    this.favoritesPanel.className = 'favorites-panel hidden';
    this.favoritesPanel.innerHTML = `
      <div class="favorites-header">
        <h3>Favorites</h3>
        <button class="favorites-close" aria-label="Close">×</button>
      </div>
      <div class="favorites-list">
        <p class="no-favorites">No favorites yet</p>
      </div>
    `;


    document.body.appendChild(this.favoritesPanel);


    const closeButton = this.favoritesPanel.querySelector('.favorites-close');
    closeButton.addEventListener('click', () => this.closePanel());
  }




  togglePanel() {
    if (this.isPanelOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }




  openPanel() {
    if (!this.favoritesPanel) return;

    this.favoritesPanel.classList.remove('hidden');
    this.isPanelOpen = true;


    this.favoritesButton.classList.add('active');


    this.eventBus.emit('favorites:panelOpened');
  }




  closePanel() {
    if (!this.favoritesPanel) return;

    this.favoritesPanel.classList.add('hidden');
    this.isPanelOpen = false;


    this.favoritesButton.classList.remove('active');


    this.eventBus.emit('favorites:panelClosed');
  }





  handleOutsideClick(event) {
    if (!this.isPanelOpen) return;

    const isClickInside = this.favoritesPanel.contains(event.target) ||
                         this.favoritesButton.contains(event.target);

    if (!isClickInside) {
      this.closePanel();
    }
  }




  loadFavorites() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const favorites = JSON.parse(stored);
        this.favorites = new Map(favorites);
        this.updateFavoritesList();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }




  saveFavorites() {
    try {
      const serialized = JSON.stringify(Array.from(this.favorites.entries()));
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }




  updateFavoritesList() {
    if (!this.favoritesPanel) return;

    const favoritesList = this.favoritesPanel.querySelector('.favorites-list');
    if (!favoritesList) return;


    favoritesList.innerHTML = '';

    if (this.favorites.size === 0) {
      const noFavorites = document.createElement('p');
      noFavorites.className = 'no-favorites';
      noFavorites.textContent = 'No favorites yet';
      favoritesList.appendChild(noFavorites);
      return;
    }


    const list = document.createElement('ul');
    list.className = 'favorites-items';

    this.favorites.forEach((favorite, nodeId) => {
      const item = document.createElement('li');
      item.className = 'favorite-item';
      item.dataset.nodeId = nodeId;

      const link = document.createElement('a');
      link.href = '#';
      link.textContent = favorite.title || `Node ${nodeId}`;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToFavorite(nodeId);
      });

      const removeButton = document.createElement('button');
      removeButton.className = 'favorite-remove';
      removeButton.textContent = '×';
      removeButton.setAttribute('aria-label', 'Remove from favorites');
      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeFavorite(nodeId);
      });

      item.appendChild(link);
      item.appendChild(removeButton);
      list.appendChild(item);
    });

    favoritesList.appendChild(list);
  }





  navigateToFavorite(nodeId) {
    this.eventBus.emit('view:navigateTo', { nodeId });
    this.closePanel();
  }







  addFavorite({ nodeId, title }) {
    if (!nodeId) return;

    this.favorites.set(nodeId, {
      id: nodeId,
      title: title || `Node ${nodeId}`,
      timestamp: Date.now()
    });

    this.saveFavorites();
    this.updateFavoritesList();
    this.updateButtonState(nodeId, true);


    this.eventBus.emit('favorites:added', { nodeId });
  }





  removeFavorite(nodeId) {
    if (!nodeId || !this.favorites.has(nodeId)) return;

    this.favorites.delete(nodeId);
    this.saveFavorites();
    this.updateFavoritesList();
    this.updateButtonState(nodeId, false);


    this.eventBus.emit('favorites:removed', { nodeId });
  }







  toggleFavorite({ nodeId, title }) {
    if (!nodeId) return;

    if (this.favorites.has(nodeId)) {
      this.removeFavorite(nodeId);
    } else {
      this.addFavorite({ nodeId, title });
    }
  }






  updateButtonState(nodeId, isFavorite) {
    if (!this.favoritesButton) return;

    if (isFavorite) {
      this.favoritesButton.classList.add('is-favorite');
      this.favoritesButton.setAttribute('aria-pressed', 'true');
    } else {
      this.favoritesButton.classList.remove('is-favorite');
      this.favoritesButton.setAttribute('aria-pressed', 'false');
    }
  }





  handleAddFavorite(data) {
    this.addFavorite(data);
  }





  handleRemoveFavorite({ nodeId }) {
    this.removeFavorite(nodeId);
  }





  handleToggleFavorite(data) {
    this.toggleFavorite(data);
  }





  handleUpdateFavorites({ favorites }) {
    if (Array.isArray(favorites)) {
      this.favorites = new Map(favorites);
      this.saveFavorites();
      this.updateFavoritesList();
    }
  }
}

export default Favorites;
</file>

<file path="src/js/view/components/NavigationControls.js">
export class NavigationControls {







  constructor(rootElement, eventBus, { maxHistory = 50 } = {}) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.maxHistory = maxHistory;


    this.history = [];
    this.currentIndex = -1;


    this.backButton = this.rootElement.querySelector('#backButton');
    this.forwardButton = this.rootElement.querySelector('#forwardButton');
    this.homeButton = this.rootElement.querySelector('#homeButton');

    if (!this.backButton || !this.forwardButton || !this.homeButton) {
      console.warn('Navigation control buttons not found');
      return;
    }

    this.initialize();
  }




  initialize() {

    this.backButton.addEventListener('click', this.handleBackClick.bind(this));
    this.forwardButton.addEventListener('click', this.handleForwardClick.bind(this));
    this.homeButton.addEventListener('click', this.handleHomeClick.bind(this));


    this.updateButtonStates();


    this.eventBus.on('navigate', this.handleNavigation.bind(this));
  }




  handleBackClick() {
    if (this.canGoBack()) {
      this.currentIndex--;
      this.updateButtonStates();
      this.eventBus.emit('view:navigateBack', { nodeId: this.getCurrentNodeId() });
    }
  }




  handleForwardClick() {
    if (this.canGoForward()) {
      this.currentIndex++;
      this.updateButtonStates();
      this.eventBus.emit('view:navigateForward', { nodeId: this.getCurrentNodeId() });
    }
  }




  handleHomeClick() {
    this.eventBus.emit('view:navigateHome');

    this.navigateTo('root');
  }






  handleNavigation({ nodeId }) {
    if (nodeId === this.getCurrentNodeId()) {
      return;
    }

    this.navigateTo(nodeId);
  }





  navigateTo(nodeId) {

    if (nodeId === this.getCurrentNodeId()) {
      return;
    }


    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }


    this.history.push(nodeId);


    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }

    this.updateButtonStates();


    this.eventBus.emit('navigate', { nodeId });
  }




  updateButtonStates() {
    this.backButton.disabled = !this.canGoBack();
    this.forwardButton.disabled = !this.canGoForward();


    this.backButton.setAttribute('aria-disabled', this.backButton.disabled);
    this.forwardButton.setAttribute('aria-disabled', this.forwardButton.disabled);
  }





  canGoBack() {
    return this.currentIndex > 0;
  }





  canGoForward() {
    return this.currentIndex < this.history.length - 1;
  }





  getCurrentNodeId() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }




  clearHistory() {
    const currentNodeId = this.getCurrentNodeId();
    this.history = currentNodeId ? [currentNodeId] : [];
    this.currentIndex = this.history.length - 1;
    this.updateButtonStates();
  }
}

export default NavigationControls;
</file>

<file path="src/js/view/components/OptionsMenu.js">
export class OptionsMenu {





  constructor(rootElement, eventBus) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.isOpen = false;


    this.optionsButton = this.rootElement?.querySelector('#optionsButton');
    this.optionsMenu = null;

    if (!this.optionsButton) {
      console.warn('Options button not found');
      return;
    }

    this.initialize();
  }




  initialize() {

    this.createOptionsMenu();


    this.optionsButton.addEventListener('click', this.toggleMenu.bind(this));


    document.addEventListener('click', this.handleOutsideClick.bind(this));


    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }




  createOptionsMenu() {
    this.optionsMenu = document.createElement('div');
    this.optionsMenu.className = 'options-menu hidden';
    this.optionsMenu.setAttribute('role', 'menu');
    this.optionsMenu.setAttribute('aria-orientation', 'vertical');
    this.optionsMenu.setAttribute('aria-labelledby', 'optionsButton');


    const menuItems = [
      { id: 'export', label: 'Export Data', icon: '📤' },
      { id: 'import', label: 'Import Data', icon: '📥' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: '⌨️' },
      { id: 'about', label: 'About Trestle', icon: 'ℹ️' }
    ];


    const menuList = document.createElement('ul');
    menuList.className = 'options-menu-list';

    menuItems.forEach(item => {
      const menuItem = document.createElement('li');
      menuItem.className = 'options-menu-item';
      menuItem.setAttribute('role', 'none');

      const button = document.createElement('button');
      button.className = 'options-menu-button';
      button.setAttribute('role', 'menuitem');
      button.setAttribute('tabindex', '-1');
      button.dataset.action = item.id;


      if (item.icon) {
        const icon = document.createElement('span');
        icon.className = 'options-menu-icon';
        icon.textContent = item.icon;
        icon.setAttribute('aria-hidden', 'true');
        button.appendChild(icon);
      }


      const label = document.createElement('span');
      label.className = 'options-menu-label';
      label.textContent = item.label;
      button.appendChild(label);


      button.addEventListener('click', (e) => this.handleMenuItemClick(e, item.id));

      menuItem.appendChild(button);
      menuList.appendChild(menuItem);
    });

    this.optionsMenu.appendChild(menuList);


    document.body.appendChild(this.optionsMenu);


    this.positionMenu();


    window.addEventListener('resize', this.positionMenu.bind(this));
  }




  positionMenu() {
    if (!this.optionsMenu || !this.optionsButton) return;

    const buttonRect = this.optionsButton.getBoundingClientRect();


    this.optionsMenu.style.position = 'fixed';
    this.optionsMenu.style.top = `${buttonRect.bottom + window.scrollY}px`;
    this.optionsMenu.style.right = `${window.innerWidth - buttonRect.right}px`;
  }




  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }




  openMenu() {
    if (!this.optionsMenu) return;

    this.optionsMenu.classList.remove('hidden');
    this.isOpen = true;
    this.optionsButton.setAttribute('aria-expanded', 'true');


    const firstItem = this.optionsMenu.querySelector('.options-menu-button');
    if (firstItem) {
      firstItem.focus();
    }


    this.eventBus.emit('options:menuOpened');
  }




  closeMenu() {
    if (!this.optionsMenu) return;

    this.optionsMenu.classList.add('hidden');
    this.isOpen = false;
    this.optionsButton.setAttribute('aria-expanded', 'false');


    this.optionsButton.focus();


    this.eventBus.emit('options:menuClosed');
  }





  handleOutsideClick(event) {
    if (!this.isOpen) return;

    const isClickInside = this.optionsMenu.contains(event.target) ||
                         this.optionsButton.contains(event.target);

    if (!isClickInside) {
      this.closeMenu();
    }
  }





  handleKeyDown(event) {
    if (!this.isOpen) return;

    const menuItems = Array.from(this.optionsMenu.querySelectorAll('.options-menu-button'));
    if (!menuItems.length) return;

    const currentIndex = menuItems.indexOf(document.activeElement);
    let nextIndex = -1;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeMenu();
        break;

      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex]?.focus();
        break;

      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        menuItems[nextIndex]?.focus();
        break;

      case 'Home':
        event.preventDefault();
        menuItems[0]?.focus();
        break;

      case 'End':
        event.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
    }
  }






  handleMenuItemClick(event, action) {
    event.preventDefault();
    event.stopPropagation();


    this.closeMenu();


    switch (action) {
      case 'export':
        this.eventBus.emit('options:export');
        break;

      case 'import':
        this.eventBus.emit('options:import');
        break;

      case 'settings':
        this.eventBus.emit('options:settings');
        break;

      case 'shortcuts':
        this.eventBus.emit('options:shortcuts');
        break;

      case 'about':
        this.eventBus.emit('options:about');
        break;
    }
  }
}

export default OptionsMenu;
</file>

<file path="src/js/view/components/SearchBar.js">
export class SearchBar {







  constructor(rootElement, eventBus, { debounceDelay = 300 } = {}) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.debounceDelay = debounceDelay;
    this.searchTimeout = null;
    this.lastSearchTerm = '';

    // Cache DOM elements
    this.searchInput = this.rootElement?.querySelector('#searchInput');
    this.searchIcon = this.rootElement?.querySelector('.search-icon');

    if (!this.searchInput) {
      console.warn('Search input element not found');
      return;
    }

    this.initialize();
  }




  initialize() {

    this.searchInput.addEventListener('input', this.handleInput.bind(this));
    this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));


    if (this.searchIcon) {
      this.searchIcon.addEventListener('click', () => this.searchInput.focus());
    }


    this.eventBus.on('search:results', this.handleSearchResults.bind(this));


    this.eventBus.on('search:clear', this.clear.bind(this));
  }





  handleInput(event) {
    const searchTerm = event.target.value.trim();


    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }


    if (searchTerm === '') {
      this.clear();
      return;
    }

    // Only search if the term has changed
    if (searchTerm !== this.lastSearchTerm) {
      this.searchTimeout = setTimeout(() => {
        this.performSearch(searchTerm);
      }, this.debounceDelay);
    }
  }

  /**
   * Handle keydown events for special keys
   * @param {KeyboardEvent} event - The keydown event
   */
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.clear();
      this.searchInput.blur();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.performSearch(this.searchInput.value.trim());
    }
  }





  performSearch(searchTerm) {
    if (!searchTerm) {
      this.clear();
      return;
    }

    this.lastSearchTerm = searchTerm;


    this.eventBus.emit('view:search', {
      query: searchTerm,
      timestamp: Date.now()
    });
  }





  handleSearchResults(data) {


    console.log('Search results:', data);
  }




  clear() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.lastSearchTerm = '';

    // Emit clear event
    this.eventBus.emit('view:clearSearch');
  }




  focus() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }





  setValue(value) {
    if (this.searchInput) {
      this.searchInput.value = value;
      this.lastSearchTerm = value;
    }
  }
}

export default SearchBar;
</file>

<file path="src/utils/utils.js">
export const namespaces = {
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    dc: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    squirt: 'http://purl.org/stuff/squirt#',
    ts: 'http://purl.org/stuff/trestle#'
}





export function generateID() {
    const now = new Date()
    const timestamp = formatDate(now, "yyyy-mm-dd-HH-MM-ss-l")
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${timestamp}-${random}`
}





export function generateDate() {
    return new Date().toISOString()
}






export function generateNid(content) {

    let hash = 0
    if (content.length === 0) return 'nid-' + generateID()

    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }


    hash = Math.abs(hash)

    return 'nid-' + hash.toString(16) + '-' + Date.now().toString(36)
}








export function formatDate(date, mask, utc = true) {
    const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g
    const timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g
    const timezoneClip = /[^-+\dA-Z]/g

    const pad = (val, len) => {
        val = String(val)
        len = len || 2
        while (val.length < len) val = "0" + val
        return val
    }


    if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
        mask = date
        date = undefined
    }


    date = date ? new Date(date) : new Date()
    if (isNaN(date)) throw SyntaxError("invalid date")

    mask = String(masks[mask] || mask || masks["default"])


    if (mask.slice(0, 4) === "UTC:") {
        mask = mask.slice(4)
        utc = true
    }

    const _ = utc ? "getUTC" : "get"
    const d = date[_ + "Date"]()
    const D = date[_ + "Day"]()
    const m = date[_ + "Month"]()
    const y = date[_ + "FullYear"]()
    const H = date[_ + "Hours"]()
    const M = date[_ + "Minutes"]()
    const s = date[_ + "Seconds"]()
    const L = date[_ + "Milliseconds"]()
    const o = utc ? 0 : date.getTimezoneOffset()

    const flags = {
        d: d,
        dd: pad(d),
        ddd: dayNames[D],
        dddd: dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: monthNames[m],
        mmmm: monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad(L > 99 ? Math.round(L / 10) : L),
        t: H < 12 ? "a" : "p",
        tt: H < 12 ? "am" : "pm",
        T: H < 12 ? "A" : "P",
        TT: H < 12 ? "AM" : "PM",
        Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    }

    return mask.replace(token, function ($0) {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
    })
}




const masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
}




const dayNames = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]




const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]






export function escapeHtml(text) {
    if (!text) return ''

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}






export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item))
    }

    const cloned = {}
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key])
        }
    }

    return cloned
}
</file>

<file path="test-results/.last-run.json">
{
  "status": "failed",
  "failedTests": []
}
</file>

<file path="CLAUDE.md">
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
</file>

<file path="jsdoc.json">
{
  "tags": {
    "allowUnknownTags": true,
    "dictionaries": ["jsdoc", "closure"]
  },
  "source": {
    "include": ["js", "README.md"],
    "exclude": ["node_modules"],
    "includePattern": ".+\\.js(doc|x)?$",
    "excludePattern": "(^|\\/|\\\\)_"
  },
  "plugins": [
    "plugins/markdown"
  ],
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false,
    "default": {
      "outputSourceFiles": true,
      "includeDate": false
    }
  },
  "opts": {
    "destination": "./docs/jsdoc",
    "encoding": "utf8",
    "recurse": true,
    "template": "node_modules/docdash"
  }
}
</file>

<file path="LICENSE">
MIT License

Copyright (c) 2025 Danny Ayers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</file>

<file path="vitest.config.js">
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
</file>

<file path="src/js/model/TrestleRDFModel.js">
import { TrestleModel } from './TrestleModel.js'
import { Config } from '../config.js'
import rdf from 'rdf-ext'




class TrestleRDFModel extends TrestleModel {






    constructor(endpoint, baseUri, eventBus) {

        super(endpoint, baseUri, eventBus)


        this.rdfDataset = rdf.dataset()
    }




    async initialize() {
        try {

            await super.initialize()


            this.buildRDFDataset()
        } catch (error) {
            console.error('Error in RDF initialization:', error)
        }
    }




    createEmptyModel() {

        super.createEmptyModel()


        this.buildRDFDataset()
    }




    buildRDFDataset() {

        this.rdfDataset = rdf.dataset()


        for (const [nodeId, node] of this.nodes.entries()) {
            this.addNodeToRDF(node)
        }
    }





    addNodeToRDF(node) {
        if (!node) return


        const ns = {
            rdf: rdf.namespace(Config.PREFIXES.rdf || 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
            dc: rdf.namespace(Config.PREFIXES.dc),
            ts: rdf.namespace(Config.PREFIXES.ts),
            xsd: rdf.namespace(Config.PREFIXES.xsd || 'http://www.w3.org/2001/XMLSchema#')
        }
        const subject = rdf.namedNode(`${this.baseUri}${node.id}`)


        const add = (p, o) => {
            if (o !== undefined && o !== null) {
                this.rdfDataset.add(rdf.quad(subject, p, o))
            }
        }


        add(ns.rdf('type'), ns.ts(node.type))


        if (node.title !== undefined) {
            add(ns.dc('title'), rdf.literal(node.title))
        }


        if (node.created) {
            add(ns.dc('created'), rdf.literal(node.created, ns.xsd('dateTime')))
        } else {

            add(ns.dc('created'), rdf.literal(new Date().toISOString(), ns.xsd('dateTime')))
        }


        if (node.description !== undefined) {
            add(ns.ts('description'), rdf.literal(node.description))
        }


        if (node.parent !== undefined && node.parent !== null) {
            add(ns.ts('parent'), rdf.namedNode(`${this.baseUri}${node.parent}`))
        }


        if (node.index !== undefined) {
            add(ns.ts('index'), rdf.literal(node.index.toString()))
        }
    }








    addNode(parentId, title, index) {

        const newNode = super.addNode(parentId, title, index)


        this.addNodeToRDF(newNode)

        return newNode
    }






    updateNode(nodeId, properties) {

        super.updateNode(nodeId, properties)


        const node = this.getNode(nodeId)
        if (node) {

            const quadsToRemove = this.rdfDataset.match(rdf.namedNode(`${this.baseUri}${nodeId}`))
            for (const quad of quadsToRemove) {
                this.rdfDataset.delete(quad)
            }


            this.addNodeToRDF(node)
        }
    }






    updateNodeDescription(nodeId, description) {

        super.updateNodeDescription(nodeId, description)


        const node = this.getNode(nodeId)
        if (node) {

            const descQuads = this.rdfDataset.match(
                rdf.namedNode(`${this.baseUri}${nodeId}`),
                rdf.namespace(Config.PREFIXES.dc)('description')
            )

            for (const quad of descQuads) {
                this.rdfDataset.delete(quad)
            }


            if (description) {
                this.rdfDataset.add(rdf.quad(
                    rdf.namedNode(`${this.baseUri}${nodeId}`),
                    rdf.namespace(Config.PREFIXES.dc)('description'),
                    rdf.literal(description)
                ))
            }
        }
    }





    deleteNode(nodeId) {

        const allNodesToDelete = this.getAllDescendantIds(nodeId)
        allNodesToDelete.push(nodeId)


        super.deleteNode(nodeId)


        for (const idToDelete of allNodesToDelete) {
            this.removeNodeFromRDF(idToDelete)
        }
    }






    getAllDescendantIds(nodeId) {
        const node = this.getNode(nodeId)
        if (!node || !node.children || node.children.length === 0) {
            return []
        }

        let descendantIds = []
        for (const childId of node.children) {
            descendantIds.push(childId)
            descendantIds = descendantIds.concat(this.getAllDescendantIds(childId))
        }
        return descendantIds
    }





    removeNodeFromRDF(nodeId) {
        const subject = rdf.namedNode(`${this.baseUri}${nodeId}`)


        const quadsToRemove = []


        for (const quad of this.rdfDataset.match(subject)) {
            quadsToRemove.push(quad)
        }


        for (const quad of this.rdfDataset.match(null, null, subject)) {
            quadsToRemove.push(quad)
        }


        for (const quad of quadsToRemove) {
            this.rdfDataset.delete(quad)
        }
    }







    moveNode(nodeId, newParentId, newIndex) {

        super.moveNode(nodeId, newParentId, newIndex)


        const node = this.getNode(nodeId)
        if (node) {

            this.removeNodeFromRDF(nodeId)
            this.addNodeToRDF(node)
        }


        const newParent = this.getNode(newParentId)
        if (newParent && newParent.children) {
            for (const childId of newParent.children) {
                const child = this.getNode(childId)
                if (child) {
                    this.removeNodeFromRDF(childId)
                    this.addNodeToRDF(child)
                }
            }
        }
    }





    toTurtle() {

        return super.toTurtle()
    }





    getRDFDataset() {
        return this.rdfDataset
    }
}

export default TrestleRDFModel
</file>

<file path="src/js/utils/EventLogger.js">
import log from 'loglevel';

export class EventLogger {








  constructor(eventBus, options = {}) {
    this.eventBus = eventBus;
    this.options = {
      loggerName: 'EventLogger',
      logLevel: 'debug',
      ignorePatterns: [],
      ...options
    };


    this.logger = log.getLogger(this.options.loggerName);
    this.logger.setLevel(this.options.logLevel);


    this.originalEmit = this.eventBus.emit;


    this.handleEvent = this.handleEvent.bind(this);


    this.initialize();
  }




  initialize() {

    this.logger.debug('Initializing EventLogger');


    this.eventBus.emit = (eventName, ...args) => {

      this.handleEvent(eventName, args);


      return this.originalEmit.call(this.eventBus, eventName, ...args);
    };

    this.logger.debug('EventLogger initialized and listening to events');
  }







  handleEvent(eventName, args) {

    if (this.shouldIgnoreEvent(eventName)) {
      return;
    }

    try {

      const formattedArgs = this.formatEventData(args);


      this.logger.debug(`[${eventName}]`, ...formattedArgs);


      if (this.eventBus && typeof this.eventBus.emit === 'function') {

        if (!eventName.startsWith('console:')) {

          const msg = `[${eventName}] ${formattedArgs.join(' ')}`;
          this.eventBus.emit('console:debug', msg);
        }
      }
    } catch (error) {
      this.logger.error(`Error logging event ${eventName}:`, error);
    }
  }







  shouldIgnoreEvent(eventName) {
    return this.options.ignorePatterns.some(pattern => {
      if (typeof pattern === 'string') {
        return eventName === pattern;
      } else if (pattern instanceof RegExp) {
        return pattern.test(eventName);
      }
      return false;
    });
  }







  formatEventData(args) {
    if (!args || args.length === 0) {
      return [''];
    }

    // Try to stringify objects for better logging
    const seen = new WeakSet();
    return args.map(arg => {
      if (arg === null || arg === undefined) {
        return String(arg);
      }
      // Handle errors specially
      if (arg instanceof Error) {
        return `${arg.name}: ${arg.message}\n${arg.stack || 'No stack trace'}`;
      }

      if (typeof window !== 'undefined' && window.HTMLElement && arg instanceof window.HTMLElement) {
        return arg.outerHTML || String(arg);
      }

      if (typeof arg === 'object' || Array.isArray(arg)) {
        try {
          return JSON.stringify(arg, function (key, value) {
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) return '[Circular]';
              seen.add(value);
            }
            return value;
          }, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    });
  }




  destroy() {
    if (this.eventBus && this.originalEmit) {
      this.eventBus.emit = this.originalEmit;
      this.logger.debug('EventLogger destroyed');
    }
  }
}

export default EventLogger;
</file>

<file path="src/js/view/components/CardDetail.js">
export class CardDetail {




    constructor(eventBus) {
        this.eventBus = eventBus;
        this.cardElement = document.getElementById('card');
        this.titleElement = document.getElementById('card-title');
        this.descriptionElement = document.getElementById('card-description');
        this.idElement = document.getElementById('card-nid');
        this.dateElement = document.getElementById('card-date');
        this.closeButton = document.getElementById('card-close');

        this.currentNodeId = null;

        this.initialize();
    }




    initialize() {
        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.handleClose.bind(this));
        }
    }







    show(nodeId, title, date) {
        this.currentNodeId = nodeId;

        if (this.titleElement) {
            this.titleElement.textContent = title;
        }

        if (this.idElement) {
            this.idElement.textContent = nodeId;
        }

        if (this.dateElement) {
            this.dateElement.textContent = date;
        }

        this.eventBus.emit('view:getNodeData', {
            nodeId,
            callback: (node) => this.populateDescription(node)
        });


        if (this.cardElement) {
            this.cardElement.dataset.nodeId = nodeId;
            this.cardElement.classList.remove('hidden');
        }
    }





    populateDescription(node) {
        if (this.descriptionElement) {
            this.descriptionElement.value = node.description || '';
            this.descriptionElement.focus();
        }
    }

    /**
     * Handle the close button click
     */
    handleClose() {
        if (this.cardElement && this.cardElement.dataset.nodeId) {
            // Save description
            this.eventBus.emit('view:updateNodeDescription', {
                nodeId: this.cardElement.dataset.nodeId,
                description: this.descriptionElement.value
            });


            this.cardElement.classList.add('hidden');
            this.currentNodeId = null;
        }
    }




    hide() {
        if (this.cardElement) {
            this.cardElement.classList.add('hidden');
            this.currentNodeId = null;
        }
    }
}

export default CardDetail;
</file>

<file path="src/js/view/components/ContextMenu.js">
export class ContextMenu {




    constructor(eventBus) {
        this.eventBus = eventBus;
        this.shortcutsPanel = document.getElementById('shortcuts-text');
        this.shortcutsButton = document.getElementById('shortcutsButton');
        this.mobileShortcutsButton = document.getElementById('mobileShortcutsButton');
        this.menuBox = document.getElementById('menu-box');
        this.hamburgerButton = document.getElementById('hamburgerButton');

        this.initialize();
    }




    initialize() {

        document.addEventListener('click', this.handleDocumentClick.bind(this));


        if (this.shortcutsButton) {
            this.shortcutsButton.addEventListener('click', this.toggleShortcutsPanel.bind(this));
        }

        if (this.mobileShortcutsButton) {
            this.mobileShortcutsButton.addEventListener('click', () => {
                this.toggleShortcutsPanel();
                if (this.menuBox) {
                    this.menuBox.classList.add('hidden');
                }
            });
        }


        if (this.hamburgerButton && this.menuBox) {
            this.hamburgerButton.addEventListener('click', this.handleHamburgerClick.bind(this));
        }
    }




    toggleShortcutsPanel() {
        if (this.shortcutsPanel) {
            this.shortcutsPanel.classList.toggle('hidden');
        }
    }





    handleHamburgerClick(event) {
        this.menuBox.classList.toggle('hidden');
        event.stopPropagation();
    }





    handleDocumentClick(event) {

        if (this.shortcutsPanel &&
            !this.shortcutsPanel.classList.contains('hidden') &&
            !this.shortcutsPanel.contains(event.target) &&
            event.target.id !== 'shortcutsButton' &&
            event.target.id !== 'mobileShortcutsButton') {
            this.shortcutsPanel.classList.add('hidden');
        }


        if (this.menuBox &&
            !this.menuBox.classList.contains('hidden') &&
            !this.menuBox.contains(event.target) &&
            event.target !== this.hamburgerButton) {
            this.menuBox.classList.add('hidden');
        }
    }






    static addContextualAddButtons(rootElement, eventBus) {
        const dropzones = rootElement.querySelectorAll('.dropzone');

        dropzones.forEach(dropzone => {
            const addButton = document.createElement('div');
            addButton.className = 'ts-add-between';
            addButton.title = 'Add item here';

            addButton.addEventListener('click', (event) => {
                event.stopPropagation();

                const listItem = dropzone.closest('li');
                if (!listItem) return;

                const nodeId = listItem.dataset.nodeId;
                const parentElement = listItem.parentElement;
                const parentNode = parentElement.closest('li');
                const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root';

                const siblings = Array.from(parentElement.children);
                const index = siblings.indexOf(listItem);

                eventBus.emit('view:insertNodeAt', {
                    parentId,
                    index: index
                });
            });

            dropzone.appendChild(addButton);
        });
    }
}

export default ContextMenu;
</file>

<file path="src/js/view/components/ExpanderButton.js">
export class ExpanderButton {





    constructor(rootElement, eventBus) {
        this.rootElement = rootElement;
        this.eventBus = eventBus;

        this.initialize();
    }




    initialize() {
        this.rootElement.addEventListener('click', this.handleExpanderClick.bind(this));
    }





    handleExpanderClick(event) {
        const target = event.target;

        if (target.classList.contains('ts-expander')) {
            const li = target.closest('li');
            this.toggleExpanded(li);
            event.stopPropagation();
        }
    }





    toggleExpanded(nodeElement) {
        if (!nodeElement) return;

        nodeElement.classList.toggle('ts-closed');
        nodeElement.classList.toggle('ts-open');
    }





    expand(nodeElement) {
        if (!nodeElement) return;

        nodeElement.classList.remove('ts-closed');
        nodeElement.classList.add('ts-open');
    }





    collapse(nodeElement) {
        if (!nodeElement) return;

        nodeElement.classList.add('ts-closed');
        nodeElement.classList.remove('ts-open');
    }






    isExpanded(nodeElement) {
        if (!nodeElement) return false;

        return nodeElement.classList.contains('ts-open');
    }




    expandAll() {
        const closedNodes = this.rootElement.querySelectorAll('.ts-closed');
        closedNodes.forEach(node => {
            node.classList.remove('ts-closed');
            node.classList.add('ts-open');
        });
    }




    collapseAll() {
        const openNodes = this.rootElement.querySelectorAll('.ts-open');
        openNodes.forEach(node => {
            node.classList.add('ts-closed');
            node.classList.remove('ts-open');
        });
    }
}

export default ExpanderButton;
</file>

<file path="src/js/view/components/InlineEditor.js">
export class InlineEditor {





    constructor(rootElement, eventBus) {
        this.rootElement = rootElement;
        this.eventBus = eventBus;
        this.editingId = null;

        this.initialize();
    }




    initialize() {
        this.rootElement.addEventListener('dblclick', this.handleDblClick.bind(this));
        this.rootElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.rootElement.addEventListener('focus', this.handleFocus.bind(this), true);
        this.rootElement.addEventListener('blur', this.handleBlur.bind(this), true);


        document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this));
    }





    handleDblClick(event) {
        const target = event.target;

        if (target.classList.contains('ts-title')) {
            this.startEditing(target);
            event.stopPropagation();
        }
    }





    startEditing(titleElement) {
        titleElement.contentEditable = true;
        titleElement.focus();
        this.editingId = titleElement.closest('.ts-entry').id;


        const range = document.createRange();
        range.selectNodeContents(titleElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }





    handleKeyDown(event) {
        if (!event.target.isContentEditable) return;

        const entry = event.target.closest('.ts-entry');
        if (!entry) return;

        const nodeId = entry.id;
        const nodeLi = entry.closest('li');
        if (!nodeLi) return;

        switch (event.key) {
            case 'Tab':
                this.handleTabKey(event, nodeId, nodeLi);
                break;

            case 'Enter':
                this.handleEnterKey(event, nodeId, nodeLi);
                break;

            case 'Escape':
                this.handleEscapeKey(event, nodeId);
                break;

            case 'ArrowUp':
                this.handleArrowKeys(event, nodeId, 'up');
                break;

            case 'ArrowDown':
                this.handleArrowKeys(event, nodeId, 'down');
                break;
        }
    }







    handleTabKey(event, nodeId, nodeLi) {
        event.preventDefault();

        if (event.shiftKey) {

            const parentLi = nodeLi.parentElement.closest('li');
            if (!parentLi) return;

            const grandParentUl = parentLi.parentElement;
            if (!grandParentUl) return;

            const newParentId = grandParentUl.closest('li')?.dataset.nodeId || 'trestle-root';

            grandParentUl.insertBefore(nodeLi, parentLi.nextElementSibling);

            this.eventBus.emit('view:moveNode', {
                nodeId,
                newParentId,
                newIndex: Array.from(grandParentUl.children).indexOf(nodeLi)
            });
        } else {

            const prevLi = nodeLi.previousElementSibling;
            if (!prevLi) return;

            const newParentId = prevLi.dataset.nodeId;
            let childUl = prevLi.querySelector('ul');
            if (!childUl) {
                childUl = document.createElement('ul');
                prevLi.appendChild(childUl);
                prevLi.classList.remove('ts-closed');
                prevLi.classList.add('ts-open');
            }

            childUl.appendChild(nodeLi);

            this.eventBus.emit('view:moveNode', {
                nodeId,
                newParentId,
                newIndex: Array.from(childUl.children).indexOf(nodeLi)
            });
        }
    }







    handleEnterKey(event, nodeId, nodeLi) {
        if (event.shiftKey) {
            return;
        }

        event.preventDefault();
        event.target.contentEditable = false;
        this.editingId = null;

        const newTitle = event.target.textContent.trim();
        this.eventBus.emit('view:updateNode', { nodeId, properties: { title: newTitle } });

        const isFirstNode =
            nodeLi.parentElement.classList.contains('ts-root') &&
            !nodeLi.previousElementSibling;

        if (isFirstNode) {
            this.eventBus.emit('view:addChild', { parentId: nodeId });
        } else {
            this.eventBus.emit('view:addSibling', { nodeId });
        }
    }






    handleEscapeKey(event, nodeId) {
        event.preventDefault();
        event.target.contentEditable = false;
        this.editingId = null;


        this.eventBus.emit('view:selectNode', { nodeId });
    }







    handleArrowKeys(event, nodeId, direction) {
        if (event.ctrlKey) {
            event.preventDefault();

            if (direction === 'up') {
                this.eventBus.emit('view:moveNodeUp', { nodeId });
            } else {
                this.eventBus.emit('view:moveNodeDown', { nodeId });
            }
        } else {
            event.preventDefault();

            if (direction === 'up') {
                this.eventBus.emit('view:navigateUp', { nodeId });
            } else {
                this.eventBus.emit('view:navigateDown', { nodeId });
            }
        }
    }





    handleFocus(event) {
        if (event.target.classList.contains('ts-title')) {
            const entry = event.target.closest('.ts-entry');
            this.eventBus.emit('view:selectNode', { nodeId: entry.id });
        }
    }





    handleBlur(event) {
        if (event.target.classList.contains('ts-title') && event.target.isContentEditable) {
            const entry = event.target.closest('.ts-entry');
            const nodeId = entry.id;
            const newTitle = event.target.textContent.trim();

            this.eventBus.emit('view:updateNode', { nodeId, properties: { title: newTitle } });

            event.target.contentEditable = false;
            this.editingId = null;
        }
    }





    handleGlobalKeyDown(event) {
        if (event.key === 'Escape' && this.editingId) {
            const editingTitle = document.getElementById(this.editingId)?.querySelector('.ts-title');
            if (editingTitle && editingTitle.isContentEditable) {
                editingTitle.blur();
                this.eventBus.emit('view:selectNode', { nodeId: this.editingId });
                this.editingId = null;
            }
        }
    }





    getEditingId() {
        return this.editingId;
    }
}

export default InlineEditor;
</file>

<file path="src/js/view/components/NodeSelector.js">
export class NodeSelector {






    constructor(rootElement, nodeElements, eventBus) {
        this.rootElement = rootElement;
        this.nodeElements = nodeElements;
        this.eventBus = eventBus;
        this.selectedNodeId = null;

        this.initialize();
    }




    initialize() {
        this.rootElement.addEventListener('click', this.handleClick.bind(this));
    }





    handleClick(event) {
        const target = event.target;


        if (target.classList.contains('ts-entry') || target.classList.contains('ts-title')) {
            const entry = target.classList.contains('ts-entry') ? target : target.closest('.ts-entry');
            this.selectNode(entry.id);
            event.stopPropagation();
        }
    }





    selectNode(nodeId) {
        if (this.selectedNodeId) {
            const prevSelected = document.getElementById(this.selectedNodeId);
            if (prevSelected) {
                prevSelected.classList.remove('ts-selected');
            }
        }

        this.selectedNodeId = nodeId;
        const entry = document.getElementById(nodeId);
        if (entry) {
            entry.classList.add('ts-selected');
            entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }





    getSelectedNodeId() {
        return this.selectedNodeId;
    }





    navigateUp(currentNodeId) {
        const currentLi = this.nodeElements.get(currentNodeId);
        if (!currentLi) return;

        let prevLi = currentLi.previousElementSibling;

        if (prevLi) {
            while (prevLi.classList.contains('ts-open') && prevLi.querySelector('ul')?.lastElementChild) {
                prevLi = prevLi.querySelector('ul').lastElementChild;
            }

            const prevId = prevLi.querySelector('.ts-entry').id;
            this.selectNode(prevId);
        } else {
            const parentLi = currentLi.parentElement.closest('li');
            if (parentLi) {
                const parentId = parentLi.querySelector('.ts-entry').id;
                this.selectNode(parentId);
            }
        }
    }





    navigateDown(currentNodeId) {
        const currentLi = this.nodeElements.get(currentNodeId);
        if (!currentLi) return;

        if (currentLi.classList.contains('ts-open')) {
            const firstChild = currentLi.querySelector('ul > li');
            if (firstChild) {
                const childId = firstChild.querySelector('.ts-entry').id;
                this.selectNode(childId);
                return;
            }
        }

        let nextLi = currentLi.nextElementSibling;
        if (nextLi) {
            const nextId = nextLi.querySelector('.ts-entry').id;
            this.selectNode(nextId);
            return;
        }

        let parent = currentLi.parentElement.closest('li');
        while (parent) {
            const parentNext = parent.nextElementSibling;
            if (parentNext) {
                const nextId = parentNext.querySelector('.ts-entry').id;
                this.selectNode(nextId);
                return;
            }
            parent = parent.parentElement.closest('li');
        }
    }





    moveNodeUp(nodeId) {
        const nodeLi = this.nodeElements.get(nodeId);
        if (!nodeLi) return;

        const parent = nodeLi.parentElement;
        const prevLi = nodeLi.previousElementSibling;

        if (!prevLi) return;

        const parentNode = parent.closest('li');
        const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root';

        const children = Array.from(parent.children);
        const currentIndex = children.indexOf(nodeLi);
        const newIndex = currentIndex - 1;

        this.eventBus.emit('view:moveNode', {
            nodeId,
            newParentId: parentId,
            newIndex
        });

        parent.insertBefore(nodeLi, prevLi);
    }





    moveNodeDown(nodeId) {
        const nodeLi = this.nodeElements.get(nodeId);
        if (!nodeLi) return;

        const parent = nodeLi.parentElement;
        const nextLi = nodeLi.nextElementSibling;

        if (!nextLi) return;

        const parentNode = parent.closest('li');
        const parentId = parentNode ? parentNode.dataset.nodeId : 'trestle-root';

        const children = Array.from(parent.children);
        const currentIndex = children.indexOf(nodeLi);
        const newIndex = currentIndex + 1;

        this.eventBus.emit('view:moveNode', {
            nodeId,
            newParentId: parentId,
            newIndex
        });

        if (nextLi.nextElementSibling) {
            parent.insertBefore(nodeLi, nextLi.nextElementSibling);
        } else {
            parent.appendChild(nodeLi);
        }
    }
}

export default NodeSelector;
</file>

<file path="src/js/view/components/ShortcutsPanel.js">
import log from 'loglevel';

export default class ShortcutsPanel {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.logger = log.getLogger('ShortcutsPanel');
    this.container = null;
    this.shortcuts = [];


    this.initialize = this.initialize.bind(this);
    this.render = this.render.bind(this);
  }





  initialize(container) {
    if (!container) {
      this.logger.error('Shortcuts container element not provided');
      return;
    }


    this.container = container;
    this.loadShortcuts();
    this.setupEventListeners();
    this.render();

    this.logger.info('Shortcuts panel initialized');
  }




  loadShortcuts() {

    this.shortcuts = [
      { key: 'Ctrl+S', description: 'Save current file' },
      { key: 'Ctrl+F', description: 'Search' },
      { key: 'Ctrl+Z', description: 'Undo' },
      { key: 'Ctrl+Shift+Z', description: 'Redo' },
      { key: 'F5', description: 'Refresh' },
      { key: 'Escape', description: 'Close panel/dialog' },
    ];
  }




  setupEventListeners() {

    this.eventBus.on('shortcuts:update', (shortcuts) => {
      if (Array.isArray(shortcuts)) {
        this.shortcuts = shortcuts;
        this.render();
      }
    });
  }




  render() {
    if (!this.container) {
      this.logger.warn('Cannot render shortcuts: container not found');
      return;
    }

    try {

      this.container.innerHTML = '';

      // Create header
      const header = document.createElement('div');
      header.className = 'shortcuts-header';
      header.innerHTML = '<h3>Keyboard Shortcuts</h3>';


      const list = document.createElement('div');
      list.className = 'shortcuts-list';


      this.shortcuts.forEach(shortcut => {
        const item = document.createElement('div');
        item.className = 'shortcut-item';

        const key = document.createElement('span');
        key.className = 'shortcut-key';
        key.textContent = this.escapeHtml(shortcut.key);

        const desc = document.createElement('span');
        desc.className = 'shortcut-description';
        desc.textContent = this.escapeHtml(shortcut.description);

        item.appendChild(key);
        item.appendChild(desc);
        list.appendChild(item);
      });


      this.container.appendChild(header);
      this.container.appendChild(list);

    } catch (error) {
      this.logger.error('Error rendering shortcuts:', error);
    }
  }




  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }




  destroy() {

  }
}
</file>

<file path="src/js/view/index.js">
export { default } from './TrestleView.js';
export { CardDetail } from './components/CardDetail.js';
export { ContextMenu } from './components/ContextMenu.js';
export { DragDropHandler } from './components/DragDropHandler.js';
export { ExpanderButton } from './components/ExpanderButton.js';
export { Favorites } from './components/Favorites.js';
export { HamburgerMenu } from './components/HamburgerMenu.js';
export { InlineEditor } from './components/InlineEditor.js';
export { NavigationControls } from './components/NavigationControls.js';
export { NodeSelector } from './components/NodeSelector.js';
export { OptionsMenu } from './components/OptionsMenu.js';
export { SearchBar } from './components/SearchBar.js';
export { TreeNode } from './components/TreeNode.js';
</file>

<file path="src/js/config.js">
export const Config = {


    SPARQL_ENDPOINT: 'https://fuseki.hyperdata.it/farelo',

    BASE_URI: 'http://hyperdata.it/trestle/',



    PREFIXES: {
        dc: 'http://purl.org/dc/terms/',
        ts: 'http://purl.org/stuff/trestle/'
    },


    AUTO_SAVE: false,
    AUTO_SAVE_INTERVAL: 60000,


    KEY_CODES: {
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        UP: 38,
        DOWN: 40
    }
}

export default Config;
</file>

<file path=".gitignore">
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp
.cache

# vitepress build output
**/.vitepress/dist

# vitepress cache directory
**/.vitepress/cache

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

**/.claude/settings.local.json
</file>

<file path="plan.md">
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
</file>

<file path="repomix.config.json">
{
    "output": {
        "filePath": "./trestle_repomix.md",
        "headerText": "Trestle Source Code",
        "removeComments": true
    },
    "ignore": {
        "useDefaultPatterns": true,
        "customPatterns": [
            "test",
            "public",
            "docs",
            ".env",
            "knowledge",
            "**/_*/**",
            "_*",
            "**/_*",
            "**/webpack/*",
            "*.log",
            "**/*repopack*",
            "**/*repomix*",
            "**/*old*",
            "**/*prompt*"
        ]
    }
}
</file>

<file path="webpack.config.js">
import path from 'path'
import { fileURLToPath } from 'url'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
    entry: './src/js/main.js',
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/public'),
        publicPath: '/',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['last 2 versions', 'not dead']
                                }
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist/public')
        },
        port: 9090,
        open: true,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/html/index.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/css'),
                    to: path.resolve(__dirname, 'dist/public/css'),
                    globOptions: {
                        ignore: ['**/.*'],
                    },
                }
            ]
        })
    ],
    mode: 'development',
    devtool: 'inline-source-map',
}
</file>

<file path="src/css/right-panel.css">
#right-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: #2d2d2d;
  color: #f0f0f0;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, max-height 0.3s ease-in-out;
  opacity: 0;
  overflow: hidden;
}


@media (max-width: 768px) {
  #right-panel {
    position: static;
    width: 100% !important;
    max-height: 0;
    transform: none;
    opacity: 1;
    display: flex !important;
    box-shadow: none;
    border-top: 1px solid #444;
    margin-top: 10px;
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
    overflow: hidden;
  }

  #right-panel.visible {
    max-height: 50vh;
    opacity: 1;
    display: flex !important;
  }

  #right-panel.hidden {
    max-height: 0;
    opacity: 0;
    display: none !important;
  }

  .panel-content {
    max-height: calc(50vh - 80px);
    overflow-y: auto;
  }
}

#right-panel.visible {
  transform: translateX(0);
  opacity: 1;
}

#right-panel.hidden {
  transform: translateX(100%);
  opacity: 0;
}


.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #3a3a3a;
  border-bottom: 1px solid #444;
  user-select: none;
}

.panel-header h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.panel-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
}

.panel-close:hover {
  color: #fff;
}


.panel-tabs {
  display: flex;
  border-bottom: 1px solid #444;
  background: #333;
}

.tab-button {
  flex: 1;
  padding: 10px;
  text-align: center;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.tab-button.active {
  color: #fff;
  border-bottom: 2px solid #4a9cff;
  background: rgba(255, 255, 255, 0.05);
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.1);
}


.panel-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #2d2d2d;
}

.panel-section {
  display: none;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2d2d2d;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.panel-section.active {
  display: flex;
  position: relative;
  opacity: 1;
}


.console-header {
  padding: 8px 15px;
  background: #333;
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.console-actions {
  display: flex;
  gap: 8px;
}

.console-button {
  background: #444;
  border: 1px solid #555;
  color: #ddd;
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.console-button:hover {
  background: #555;
  color: #fff;
}

.console-output {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.console-message {
  margin-bottom: 8px;
  border-left: 3px solid transparent;
  padding-left: 8px;
}

.console-message.error {
  border-left-color: #ff6b6b;
  color: #ff6b6b;
}

.console-message.warn {
  border-left-color: #ffd166;
  color: #ffd166;
}

.console-message.info {
  border-left-color: #4ecdc4;
  color: #4ecdc4;
}

.console-message.debug {
  border-left-color: #a5d8ff;
  color: #a5d8ff;
}

.console-message.log {
  color: #f0f0f0;
}

.console-timestamp {
  color: #777;
  margin-right: 8px;
  font-size: 11px;
}

.console-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #777;
  text-align: center;
  padding: 20px;
}

.console-empty-state i {
  font-size: 32px;
  margin-bottom: 10px;
  opacity: 0.5;
}


.shortcuts-list {
  padding: 15px;
  overflow-y: auto;
}

.shortcut-item {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}

.shortcut-key {
  background: #3a3a3a;
  color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 3px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  margin-right: 12px;
  min-width: 100px;
  text-align: center;
  border: 1px solid #555;
}

.shortcut-description {
  flex: 1;
  color: #ddd;
  font-size: 13px;
  line-height: 1.5;
}


.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4d4d;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 0 0 2px #2d2d2d;
}

.notification-badge.hidden {
  display: none;
}


.resize-handle {
  position: absolute;
  left: -4px;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  z-index: 10;
}

.resize-handle:hover,
.resize-handle.active {
  background: rgba(74, 156, 255, 0.2);
}


@media (max-width: 768px) {
  #right-panel {
    width: 100%;
    z-index: 1001;
  }

  .panel-header h2 {
    font-size: 16px;
  }

  .tab-button {
    font-size: 14px;
    padding: 12px;
  }
}


@keyframes highlight {
  0% { background-color: rgba(74, 156, 255, 0.1); }
  100% { background-color: transparent; }
}

.console-message.new {
  animation: highlight 1.5s ease-out;
}


.key { color: #88c0d0; }
.string { color: #a3be8c; }
.number { color: #d08770; }
.boolean { color: #81a1c1; }
.null { color: #b48ead; }
.undefined { color: #d08770; }


.file-link {
  color: #88c0d0;
  text-decoration: none;
  border-bottom: 1px dashed #88c0d0;
  cursor: pointer;
}

.file-link:hover {
  color: #a5d8ff;
  border-bottom-style: solid;
}


.log-level-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-level-selector select {
  background: #3a3a3a;
  border: 1px solid #555;
  color: #f0f0f0;
  border-radius: 3px;
  padding: 3px 6px;
  font-size: 12px;
  outline: none;
}

.log-level-selector select:focus {
  border-color: #4a9cff;
}


.debug-outline {
  outline: 1px solid red !important;
}
</file>

<file path="src/js/view/components/Breadcrumb.js">
export class Breadcrumb {





  constructor(rootElement, eventBus) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.currentNode = null;
    this.lastRenderedPath = ''; // Track the last rendered path to prevent unnecessary re-renders
    this._updateCount = 0; // Track update count to detect infinite loops
    this._lastUpdateTime = Date.now();
    this._disabled = false; // Flag to completely disable the component if it's causing problems

    if (!this.rootElement) {
      console.warn('Breadcrumb root element not found');
      return;
    }


    this.handleNodeUpdated = this.handleNodeUpdated.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);



  }




  initialize() {
    try {

      this.destroy();



      this.unsubscribeBreadcrumbUpdate = this.eventBus.on('breadcrumb:update', this.handleNodeUpdated);
      this.unsubscribeNavigate = this.eventBus.on('navigate', this.handleNavigate);


      this.render();
    } catch (error) {
      console.error('Error initializing breadcrumb:', error);
    }
  }





  getPathString() {

  try {
    if (this.currentNode && this.currentNode.path) {
      const path = this.currentNode.path;


      if (typeof path === 'object' && !Array.isArray(path) && Object.keys(path).length === 0) {
        console.log('[Breadcrumb] currentNode.path is an empty object, returning empty string');
        return '';
      }

      let info = {
        type: Array.isArray(path) ? 'array' : typeof path,
        length: Array.isArray(path) ? path.length : undefined,
        preview: []
      };
      if (Array.isArray(path)) {
        for (let i = 0; i < Math.min(10, path.length); i++) {
          const item = path[i];
          if (item && typeof item === 'object') {
            info.preview.push({
              idx: i,
              type: item.constructor ? item.constructor.name : typeof item,
              id: item.id,
              title: item.title,
              selfRef: item === path
            });
          } else {
            info.preview.push({ idx: i, type: typeof item, value: item });
          }
        }
      }
      console.log('[Breadcrumb] currentNode.path shallow info:', info);
    }
  } catch (e) {
    console.error('[Breadcrumb] Error inspecting currentNode.path:', e);
  }
    try {
      if (!this.currentNode || !this.currentNode.path) return '';

      // Handle non-array paths
      if (!Array.isArray(this.currentNode.path)) {
        try {
          return String(this.currentNode.path);
        } catch (e) {
          return '';
        }
      }

      const seen = new WeakSet();
      const maxDepth = 10; // Prevent excessive recursion

      const getItemString = (item, depth = 0) => {
        try {
          // Prevent circular references and excessive depth
          if (depth > maxDepth || !item || typeof item !== 'object') {
            return '';
          }

          // Check for circular references
          if (seen.has(item)) {
            return '[Circular]';
          }

          // Add to seen set
          seen.add(item);

          // Handle different types of items
          if (typeof item.id === 'string' || typeof item.id === 'number') {
            const idStr = String(item.id);
            const titleStr = (item.title && typeof item.title === 'string')
              ? item.title
              : '';
            return `${idStr}${titleStr ? ':' + titleStr : ''}`;
          } else if (typeof item === 'string' || typeof item === 'number') {
            return String(item);
          }

          return '';
        } catch (e) {
          return '';
        }
      };

      // Process path items with a limit
      const maxItems = 100; // Prevent processing too many items
      const result = [];

      for (let i = 0; i < Math.min(this.currentNode.path.length, maxItems); i++) {
        const itemStr = getItemString(this.currentNode.path[i]);
        if (itemStr) {
          result.push(itemStr);
        }
      }

      return result.join('/');
    } catch (error) {
      console.error('Error getting path string:', error);
      return '';
    }
  }

  /**
   * Handle node updated event
   * @param {Object} data - The event data
   * @param {Object} data.node - The updated node
   */
  handleNodeUpdated({ node } = {}) {
    console.log('[Breadcrumb][DEBUG] handleNodeUpdated called', node);

    if (this._disabled) {
      return;
    }


    const now = Date.now();
    const timeSinceLastUpdate = now - this._lastUpdateTime;
    this._lastUpdateTime = now;


    if (timeSinceLastUpdate < 50) {
      this._updateCount++;

      if (this._updateCount > 10) {
        console.error('[Breadcrumb] Infinite loop detected! Disabling component to prevent browser freeze.');
        this._disabled = true;


        if (this.rootElement) {
          this.rootElement.innerHTML = '';
          const homeItem = this.createHomeItem();
          if (homeItem) {
            this.rootElement.appendChild(homeItem);
          }
        }

        // Unsubscribe from events
        if (this.unsubscribeNodeUpdated) {
          this.unsubscribeNodeUpdated();
        }
        if (this.unsubscribeNavigate) {
          this.unsubscribeNavigate();
        }

        return;
      }
    } else {
      // Reset counter if updates aren't happening rapidly
      this._updateCount = 0;
    }

    if (this._updatingBreadcrumb) {
      console.warn('[Breadcrumb] Skipping handleNodeUpdated due to re-entrancy');
      return;
    }

    this._updatingBreadcrumb = true;
    try {
      if (!node) {
        console.warn('[Breadcrumb] handleNodeUpdated called with no node');
        this._updatingBreadcrumb = false;
        return;
      }


      if (!node || typeof node !== 'object') {
        console.warn('[Breadcrumb] Invalid node object');
        this._updatingBreadcrumb = false;
        return;
      }


      const isRootNode = node.id === 'root' || node.title === 'Home' || node.title === 'Root';
      console.log('[Breadcrumb][DEBUG] isRootNode:', isRootNode, 'node.id:', node.id, 'node.title:', node.title);



      if (!isRootNode) {

        if (node.path && typeof node.path === 'object' && !Array.isArray(node.path) && Object.keys(node.path).length === 0) {

          node.path = [];
          console.log('[Breadcrumb] Converted empty object path to empty array');
        }


        if (!node.path || (typeof node.path !== 'string' && !Array.isArray(node.path))) {
          node.path = [];
          console.log('[Breadcrumb] Initialized missing or invalid path as empty array');
        }
      } else {

        node.path = [{ id: node.id, title: node.title || 'Home' }];
        console.log('[Breadcrumb][DEBUG] Set root node path to array with root node', node);
      }


      if (this.currentNode === node) {
        console.info('[Breadcrumb] Same node reference, skipping update');
        this._updatingBreadcrumb = false;
        return;
      }


      this.currentNode = node;
      console.log('[Breadcrumb][DEBUG] About to call render with currentNode:', this.currentNode);
      this.render();
    } catch (error) {
      console.error('[Breadcrumb] Error handling node update:', error);
    }
    this._updatingBreadcrumb = false;
  }






  handleNavigate({ node } = {}) {
    try {
      if (!node) return;


      if (this.currentNode === node) {
        const currentPath = this.getPathString();
        if (currentPath === this.lastRenderedPath) {
          return;
        }
      }

      this.currentNode = node;
      this.render();
    } catch (error) {
      console.error('Error handling navigation:', error);
    }
  }






  handleBreadcrumbClick(nodeId, event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (nodeId) {
        this.eventBus.emit('view:navigateTo', { nodeId });
      }
    } catch (error) {
      console.error('Error handling breadcrumb click:', error);
    }
  }







  createBreadcrumbItem(item, isLast = false) {
    try {
      if (!item || typeof item !== 'object') return null;

      const li = document.createElement('li');
      li.className = 'breadcrumb-item';

      const title = (item.title && typeof item.title === 'string') ? item.title : 'Untitled';

      if (isLast) {
        li.setAttribute('aria-current', 'page');
        const span = document.createElement('span');
        span.textContent = title;
        li.appendChild(span);
      } else {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = title;
        link.addEventListener('click', (e) => this.handleBreadcrumbClick(item.id, e));
        li.appendChild(link);
      }

      return li;
    } catch (error) {
      console.error('Error creating breadcrumb item:', error);
      return null;
    }
  }





  createHomeItem() {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';

    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('aria-label', 'Home');
    link.addEventListener('click', (e) => this.handleBreadcrumbClick('root', e));


    link.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
      </svg>
      <span class="visually-hidden">Home</span>
    `;

    li.appendChild(link);
    if (!li) {
      console.warn('[Breadcrumb][DEBUG] createHomeItem returned null or undefined');
    }
    return li;
  }





  createSeparator() {
    const li = document.createElement('li');
    li.className = 'breadcrumb-separator';
    li.setAttribute('aria-hidden', 'true');
    li.textContent = '/';
    return li;
  }





  getSafePathItems() {
    try {
      if (!this.currentNode || !this.currentNode.path) return [];


      if (!Array.isArray(this.currentNode.path)) {
        return [];
      }

      const items = [];
      const seen = new WeakSet();


      for (const item of this.currentNode.path) {
        try {

          if (!item || typeof item !== 'object') continue;


          if (seen.has(item)) continue;
          seen.add(item);


          items.push({
            id: (typeof item.id === 'string' || typeof item.id === 'number') ? String(item.id) : '',
            title: (typeof item.title === 'string') ? item.title : 'Untitled'
          });


          if (items.length > 50) break;

        } catch (error) {
          console.warn('Error processing path item:', error);
          continue;
        }
      }

      return items;
    } catch (error) {
      console.error('Error getting safe path items:', error);
      return [];
    }
  }




  render() {
    console.log('[CASCADE][Breadcrumb] render called', this.currentNode);


    console.log('[Breadcrumb][DEBUG] render called, currentNode:', this.currentNode);


    if (this._disabled) {
      return;
    }


    if (this._isRendering) {
      console.warn('[Breadcrumb] Prevented recursive render');
      return;
    }

    this._isRendering = true;

    try {

      if (!this.rootElement) {
        console.log('[Breadcrumb][DEBUG] render: no rootElement');
        this._isRendering = false;
        return;
      }


      this.rootElement.innerHTML = '';

      // Create a document fragment for better performance
      const fragment = document.createDocumentFragment();

      // Only render if currentNode is set
      if (!this.currentNode) {
        console.log('[Breadcrumb][DEBUG] render: no currentNode');
        this.rootElement.innerHTML = '';
        this.lastRenderedPath = 'empty';
        this._isRendering = false;
        return;
      }


      const homeItem = this.createHomeItem();
      if (homeItem) {
        fragment.appendChild(homeItem);
      } else {
        console.warn('[Breadcrumb][DEBUG] No home item created');
      }


      if (!this.currentNode.path) {
        console.log('[Breadcrumb][DEBUG] render: no path');
        this.rootElement.appendChild(fragment);
        this.lastRenderedPath = 'home-only';
        this._isRendering = false;
        return;
      }


      if (!Array.isArray(this.currentNode.path)) {
        console.log('[Breadcrumb][DEBUG] render: path is not array, converting to []', this.currentNode.path);
        this.currentNode.path = [];
      }


      const isRootNode = this.currentNode.id === 'root' || this.currentNode.title === 'Home' || this.currentNode.title === 'Root';

      if (this.currentNode.path.length === 0) {
        console.log('[Breadcrumb][DEBUG] render: path is empty, isRootNode:', isRootNode);

        if (isRootNode) {
          this.rootElement.appendChild(fragment);
          this.lastRenderedPath = 'home-only';
          this._isRendering = false;
          return;
        }

        this.currentNode.path = [{
          id: 'root',
          title: 'Home'
        }];
        console.log('[Breadcrumb][DEBUG] Added root node to empty path for non-root node');
      }


      let pathItems = this.getSafePathItems().slice(0, 10);
      if (pathItems.length > 0) {
        const sep = this.createSeparator();
        if (sep) fragment.appendChild(sep);
      }

      for (let i = 0; i < pathItems.length; i++) {
        try {
          const item = pathItems[i];
          if (!item || typeof item !== 'object') continue;

          const breadcrumbItem = this.createBreadcrumbItem(item, false);
          if (breadcrumbItem) fragment.appendChild(breadcrumbItem);

          if (i < pathItems.length - 1) {
            const sep = this.createSeparator();
            if (sep) fragment.appendChild(sep);
          }
        } catch (err) {
          console.error('[Breadcrumb][DEBUG] Error rendering breadcrumb item', err);
        }
      }

      if (!isRootNode) {
        const sep = this.createSeparator();
        if (sep) fragment.appendChild(sep);
        const currentItem = this.createBreadcrumbItem({ id: this.currentNode.id, title: this.currentNode.title }, true);
        if (currentItem) {
          currentItem.setAttribute('aria-current', 'page');
          fragment.appendChild(currentItem);
        }
      }

      if (fragment && fragment.childNodes && fragment.childNodes.length > 0) {
        this.rootElement.appendChild(fragment);
      } else {
        console.warn('[Breadcrumb][DEBUG] render: fragment is empty after rendering');
      }
      this.lastRenderedPath = 'rendered';
    } catch (error) {
      console.error('[Breadcrumb] Error in render:', error);

      if (this.rootElement) {
        this.rootElement.innerHTML = '';
        const homeItem = this.createHomeItem();
        if (homeItem) {
          this.rootElement.appendChild(homeItem);
        }
      }
    } finally {
      this._isRendering = false;
    }
  }

  /**
   * Clean up event listeners and references
   */
  destroy() {
    // Clean up event listeners using the stored unsubscribe functions
    if (this.unsubscribeBreadcrumbUpdate) {
      this.unsubscribeBreadcrumbUpdate();
      this.unsubscribeBreadcrumbUpdate = null;
    }

    if (this.unsubscribeNavigate) {
      this.unsubscribeNavigate();
      this.unsubscribeNavigate = null;
    }

    // Clear the root element
    if (this.rootElement) {
      this.rootElement.innerHTML = '';
    }


    this.currentNode = null;
    this.lastRenderedPath = null;
  }
}

export default Breadcrumb;
</file>

<file path="src/js/view/components/DragDropHandler.js">
export class DragDropHandler {






    constructor(rootElement, nodeElements, eventBus) {
        this.rootElement = rootElement;
        this.nodeElements = nodeElements;
        this.eventBus = eventBus;
        this.draggedNodeId = null;
        this.dragTarget = null;
        this.dragEnterTimer = null;
    }




    initialize() {
        this.cleanupListeners();
        this.setupDragListeners();
    }




    setupDragListeners() {
        const handles = this.rootElement.querySelectorAll('.ts-handle');
        handles.forEach(handle => {
            handle._dragStartHandler = this.handleDragStart.bind(this);

            handle.setAttribute('draggable', 'true');
            handle.addEventListener('mousedown', handle._dragStartHandler);
            handle.addEventListener('dragstart', handle._dragStartHandler);
        });

        const entries = this.rootElement.querySelectorAll('.ts-entry');
        entries.forEach(entry => {
            entry.setAttribute('draggable', 'true');
        });

        const dropzones = this.rootElement.querySelectorAll('.dropzone');
        dropzones.forEach(dropzone => {
            dropzone._dragOverHandler = this.handleDragOver.bind(this);
            dropzone._dragLeaveHandler = this.handleDragLeave.bind(this);
            dropzone._dropHandler = this.handleDrop.bind(this);

            dropzone.addEventListener('dragover', dropzone._dragOverHandler);
            dropzone.addEventListener('dragleave', dropzone._dragLeaveHandler);
            dropzone.addEventListener('drop', dropzone._dropHandler);
        });

        const items = this.rootElement.querySelectorAll('li');
        items.forEach(item => {
            item._dragEnterHandler = this.handleDragEnter.bind(this);
            item.addEventListener('dragenter', item._dragEnterHandler);
        });
    }




    cleanupListeners() {
        const handles = this.rootElement.querySelectorAll('.ts-handle');
        handles.forEach(handle => {
            if (handle._dragStartHandler) {
                handle.removeEventListener('mousedown', handle._dragStartHandler);
                handle.removeEventListener('dragstart', handle._dragStartHandler);
                delete handle._dragStartHandler;
            }
        });

        const dropzones = this.rootElement.querySelectorAll('.dropzone');
        dropzones.forEach(dropzone => {
            if (dropzone._dragOverHandler) {
                dropzone.removeEventListener('dragover', dropzone._dragOverHandler);
                delete dropzone._dragOverHandler;
            }
            if (dropzone._dragLeaveHandler) {
                dropzone.removeEventListener('dragleave', dropzone._dragLeaveHandler);
                delete dropzone._dragLeaveHandler;
            }
            if (dropzone._dropHandler) {
                dropzone.removeEventListener('drop', dropzone._dropHandler);
                delete dropzone._dropHandler;
            }
        });

        const items = this.rootElement.querySelectorAll('li');
        items.forEach(item => {
            if (item._dragEnterHandler) {
                item.removeEventListener('dragenter', item._dragEnterHandler);
                delete item._dragEnterHandler;
            }
        });
    }





    handleDragStart(event) {
        event.stopPropagation();

        const entry = event.target.closest('.ts-entry');
        if (!entry) {
            console.log('No entry found in drag start');
            return;
        }

        this.draggedNodeId = entry.id;
        console.log('Drag started for node:', this.draggedNodeId);

        if (event.dataTransfer) {
            event.dataTransfer.clearData();

            event.dataTransfer.setData('text/plain', entry.id);
            event.dataTransfer.setData('application/x-node-id', entry.id);
            event.dataTransfer.effectAllowed = 'move';

            try {
                const dragImage = entry.cloneNode(true);
                dragImage.style.width = `${entry.offsetWidth}px`;
                dragImage.style.opacity = '0.7';
                dragImage.style.position = 'absolute';
                dragImage.style.top = '-1000px';
                document.body.appendChild(dragImage);
                event.dataTransfer.setDragImage(dragImage, 10, 10);

                setTimeout(() => {
                    document.body.removeChild(dragImage);
                }, 10);
            } catch (err) {
                console.warn('Error setting drag image:', err);
            }
        }

        entry.classList.add('ts-dragging');


        this.eventBus.emit('view:selectNode', { nodeId: entry.id });

        const listItem = entry.closest('li');
        if (listItem) {
            listItem.classList.add('ts-dragging-item');
        }

        document.body.classList.add('ts-dragging-active');

        const dragEndHandler = () => {
            this.handleDragEnd();
            document.removeEventListener('dragend', dragEndHandler);
        };

        document.addEventListener('dragend', dragEndHandler);
    }




    handleDragEnd() {
        console.log('Drag ended');

        document.querySelectorAll('.ts-dragging').forEach(el => {
            el.classList.remove('ts-dragging');
        });

        document.querySelectorAll('.ts-dragging-item').forEach(el => {
            el.classList.remove('ts-dragging-item');
        });

        document.querySelectorAll('.ts-highlight').forEach(el => {
            el.classList.remove('ts-highlight');
        });

        document.querySelectorAll('.dropzone.active').forEach(el => {
            el.classList.remove('active');
        });

        document.body.classList.remove('ts-dragging-active');

        this.draggedNodeId = null;
        this.dragTarget = null;
    }





    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.draggedNodeId) return;

        let dropzone = event.target;
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement;
        }

        if (!dropzone) return;


        const targetLi = dropzone.closest('li');
        let dropPosition = null;
        if (targetLi) {
            dropPosition = event.offsetX / targetLi.offsetWidth;
        }
        console.log('[DragDropHandler] DragOver:', {
            draggedNodeId: this.draggedNodeId,
            dropzone,
            targetLi: targetLi ? targetLi.dataset.nodeId : null,
            dropPosition,
            offsetX: event.offsetX,
            offsetWidth: targetLi ? targetLi.offsetWidth : null
        });

        dropzone.classList.add('active');
        dropzone.classList.remove('ts-drop-indent', 'ts-drop-outdent');

        if (targetLi) {
            if (dropPosition > 0.5) {
                dropzone.classList.add('ts-drop-indent');
            } else {
                dropzone.classList.add('ts-drop-outdent');
            }
        }

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
    }





    handleDragLeave(event) {
        let dropzone = event.target;
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement;
        }

        if (!dropzone) return;

        dropzone.classList.remove('active', 'ts-drop-indent', 'ts-drop-outdent');
    }





    handleDragEnter(event) {
        const li = event.target.closest('li');
        if (!li || !this.draggedNodeId) return;

        this.dragTarget = li;

        li.classList.add('ts-highlight');

        if (this.dragEnterTimer) {
            clearTimeout(this.dragEnterTimer);
        }

        this.dragEnterTimer = setTimeout(() => {
            if (li.classList.contains('ts-closed')) {
                li.classList.remove('ts-closed');
                li.classList.add('ts-open');
            }
        }, 700);
    }





    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        let dropzone = event.target;
        while (dropzone && !dropzone.classList.contains('dropzone')) {
            dropzone = dropzone.parentElement;
        }

        if (!dropzone) return;

        dropzone.classList.remove('active', 'ts-drop-indent', 'ts-drop-outdent');

        if (!this.draggedNodeId) {
            console.log('No dragged node ID');
            return;
        }

        const draggedLi = this.nodeElements.get(this.draggedNodeId);
        if (!draggedLi) {
            console.log('Dragged node element not found');
            return;
        }

        const targetLi = dropzone.closest('li');
        if (!targetLi) {
            console.log('Target list item not found');
            return;
        }


        const dropPosition = event.offsetX / targetLi.offsetWidth;
        if (draggedLi === targetLi && dropPosition > 0.1) {
            const prevSibling = draggedLi.previousElementSibling;
            if (prevSibling) {
                let childUl = prevSibling.querySelector('ul');
                if (!childUl) {
                    childUl = document.createElement('ul');
                    prevSibling.appendChild(childUl);
                    prevSibling.classList.remove('ts-closed');
                    prevSibling.classList.add('ts-open');
                }
                childUl.appendChild(draggedLi);
                this.eventBus.emit('view:moveNode', {
                    nodeId: this.draggedNodeId,
                    newParentId: prevSibling.dataset.nodeId,
                    newIndex: Array.from(childUl.children).indexOf(draggedLi)
                });
                this.draggedNodeId = null;
                draggedLi.classList.remove('ts-dragging');
                document.querySelectorAll('.ts-highlight').forEach(el => {
                    el.classList.remove('ts-highlight');
                });
                this.initialize();
            } else {
                console.warn('No previous sibling to indent under');
            }
            return;
        }

        if (draggedLi === targetLi) {
            console.warn('Cannot drop onto itself');
            return;
        }

        if (draggedLi.contains(targetLi)) {
            console.warn('Cannot drop onto a child element');
            return;
        }


        if (draggedLi === targetLi) {
            console.warn('Cannot indent a node under itself');
            return;
        }


        console.log('[DragDropHandler] Drop event:', {
            draggedNodeId: this.draggedNodeId,
            targetNodeId: targetLi.dataset.nodeId,
            dropPosition,
            offsetX: event.offsetX,
            offsetWidth: targetLi.offsetWidth
        });
        if (dropPosition > 0.1) {

            const newParentId = targetLi.dataset.nodeId;
            let childUl = targetLi.querySelector('ul');
            if (!childUl) {
                childUl = document.createElement('ul');
                targetLi.appendChild(childUl);
                targetLi.classList.remove('ts-closed');
                targetLi.classList.add('ts-open');
            }

            childUl.appendChild(draggedLi);

            this.eventBus.emit('view:moveNode', {
                nodeId: this.draggedNodeId,
                newParentId,
                newIndex: Array.from(childUl.children).indexOf(draggedLi)
            });
        } else {

            const parentUl = targetLi.parentElement;
            parentUl.insertBefore(draggedLi, targetLi);

            const newParentId = parentUl.closest('li')?.dataset.nodeId || 'trestle-root';

            this.eventBus.emit('view:moveNode', {
                nodeId: this.draggedNodeId,
                newParentId,
                newIndex: Array.from(parentUl.children).indexOf(draggedLi)
            });
        }

        this.draggedNodeId = null;
        draggedLi.classList.remove('ts-dragging');

        document.querySelectorAll('.ts-highlight').forEach(el => {
            el.classList.remove('ts-highlight');
        });


        this.initialize();
    }
}
</file>

<file path="src/js/view/components/HamburgerMenu.js">
export class HamburgerMenu {





  constructor(rootElement, eventBus) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.isOpen = false;


    this.hamburgerButton = document.querySelector('#hamburgerButton');
    this.menuBox = document.querySelector('#menu-box');

    console.log('[HamburgerMenu] constructor:', {
      rootElement,
      rootElementHTML: rootElement ? rootElement.outerHTML : null,
      hamburgerButton: this.hamburgerButton,
      menuBox: this.menuBox,
      readyState: document.readyState
    });

    if (!this.hamburgerButton || !this.menuBox) {
      console.warn('Hamburger menu elements not found');
      return;
    }

    this.initialize();
  }




  initialize() {
    console.log('[HamburgerMenu] initialize: attaching click event');
    this.hamburgerButton.addEventListener('click', this.toggleMenu.bind(this));


    document.addEventListener('click', (event) => {

      const rightPanel = document.getElementById('right-panel');
      if (rightPanel && rightPanel.contains(event.target)) {
        console.log('[HamburgerMenu] Click inside right panel, ignoring');
        return;
      }

      if (this.isOpen &&
          !this.menuBox.contains(event.target) &&
          !this.hamburgerButton.contains(event.target)) {
        console.log('[HamburgerMenu] Click outside menu, closing');
        this.closeMenu();
      }
    }, true);


    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }




  toggleMenu() {
    console.log('[HamburgerMenu] toggleMenu called, isOpen:', this.isOpen);
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }




  openMenu() {
    console.log('[HamburgerMenu] openMenu');
    this.isOpen = true;
    this.menuBox.classList.remove('hidden');
    this.hamburgerButton.setAttribute('aria-expanded', 'true');
    this.eventBus.emit('view:toggleMenu', { isOpen: true });
  }




  closeMenu() {
    console.log('[HamburgerMenu] closeMenu');
    this.isOpen = false;
    this.menuBox.classList.add('hidden');
    this.hamburgerButton.setAttribute('aria-expanded', 'false');
    this.eventBus.emit('view:toggleMenu', { isOpen: false });
  }





  isMenuOpen() {
    return this.isOpen;
  }
}

export default HamburgerMenu;
</file>

<file path="src/js/view/components/TreeNode.js">
export class TreeNode {







    constructor(nodeData, nodesMap, eventBus, template) {
        this.nodeData = nodeData;
        this.nodesMap = nodesMap;
        this.eventBus = eventBus;
        this.template = template;
        this.element = null;
    }






    render(parentElement) {
        const { id, title, created, children = [] } = this.nodeData;

        const li = document.createElement('li');
        li.dataset.nodeId = id;


        const dropzone = document.createElement('div');
        dropzone.className = 'dropzone';
        li.appendChild(dropzone);


        const entry = this.template.content.cloneNode(true).querySelector('.ts-entry');
        entry.id = id;

        const titleElement = entry.querySelector('.ts-title');
        titleElement.textContent = title || '';

        // Set created date (hidden)
        const dateElement = entry.querySelector('.date');
        dateElement.textContent = created || '';

        // --- Add delete button event listener ---
        const deleteButton = entry.querySelector('.ts-delete');
        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (confirm('Are you sure you want to delete this item and all its children?')) {
                    this.eventBus.emit('view:deleteNode', { nodeId: id });
                }
            });
        }



        li.appendChild(entry);


        if (children && children.length > 0) {
            const ul = document.createElement('ul');
            li.appendChild(ul);
            li.classList.add('ts-open');

            for (const childId of children) {
                this._renderChild(childId, ul);
            }
        } else {
            li.classList.add('ts-closed');
        }

        if (parentElement) {
            parentElement.appendChild(li);
        }

        this.element = li;
        return li;
    }








    _renderChild(childId, parentElement) {
        const childData = this.nodesMap.get(childId);
        if (!childData) return null;

        const childNode = new TreeNode(childData, this.nodesMap, this.eventBus, this.template);
        return childNode.render(parentElement);
    }





    update(properties) {
        if (!this.element) return;

        const entry = document.getElementById(this.nodeData.id);
        if (!entry) return;

        if (properties.title !== undefined) {
            const titleElement = entry.querySelector('.ts-title');
            titleElement.textContent = properties.title;
            this.nodeData.title = properties.title;
        }
    }






    addChild(childData) {
        if (!this.element) return null;


        let ul = this.element.querySelector('ul');
        if (!ul) {
            ul = document.createElement('ul');
            this.element.appendChild(ul);
            this.element.classList.remove('ts-closed');
            this.element.classList.add('ts-open');
        }

        const childNode = new TreeNode(childData, this.nodesMap, this.eventBus, this.template);
        childNode.render(ul);

        return childNode;
    }




    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }




    select() {
        if (!this.element) return;

        const entry = document.getElementById(this.nodeData.id);
        if (entry) {
            entry.classList.add('ts-selected');
            entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }




    deselect() {
        if (!this.element) return;

        const entry = document.getElementById(this.nodeData.id);
        if (entry) {
            entry.classList.remove('ts-selected');
        }
    }
}

export default TreeNode;
</file>

<file path="src/js/view/components/ConsolePanel.js">
import log from 'loglevel';

export default class ConsolePanel {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.logger = log.getLogger('ConsolePanel');
    this.consoleOutput = null;
    this.consoleEmptyState = null;
    this.unreadCount = 0;
    this.seen = new WeakSet();


    this.initialize = this.initialize.bind(this);
    this.logToConsole = this.logToConsole.bind(this);
    this.clear = this.clear.bind(this);
  }





  initialize(container) {
    if (!container) {
      this.logger.error('Console container element not provided');
      return;
    }


    this.container = container;
    this.consoleOutput = this.container.querySelector('.console-output');
    this.consoleEmptyState = this.container.querySelector('.console-empty-state');

    if (!this.consoleOutput) {
      this.logger.error('Console output element not found in container');
      return;
    }


    this.setupEventListeners();
    this.logger.info('Console panel initialized');
  }




  setupEventListeners() {

    ['log', 'error', 'warn', 'info', 'debug'].forEach(level => {
      this.eventBus.on(`console:${level}`, (message) => {
        this.logToConsole(message, level);
      });
    });


    this.eventBus.on('console:clear', () => this.clear());
  }








  logToConsole(message, type = 'log', force = false) {
    if (!this.consoleOutput) {
      console.error('Console output not initialized');
      return false;
    }

    try {

      if (typeof message !== 'string') {
        try {
          message = JSON.stringify(message, this.getCircularReplacer(), 2);
        } catch (e) {
          message = String(message);
        }
      }


      const logEntry = document.createElement('div');
      logEntry.className = `console-entry console-${type}`;

      const timestamp = new Date().toISOString().substring(11, 23);
      const formattedMessage = this.escapeHtml(message)
        .replace(/\n/g, '<br>')
        .replace(/\s/g, '&nbsp;');

      logEntry.innerHTML = `
        <span class="console-timestamp">${timestamp}</span>
        <span class="console-level">${type.toUpperCase()}</span>
        <span class="console-message">${formattedMessage}</span>
      `;

      this.consoleOutput.appendChild(logEntry);


      if (this.consoleEmptyState && !this.consoleEmptyState.classList.contains('hidden')) {
        this.consoleEmptyState.classList.add('hidden');
      }


      if (this.isScrolledToBottom()) {
        this.scrollToBottom();
      }


      this.eventBus.emit('console:new-message');

      return true;
    } catch (error) {
      console.error('Error logging to console:', error);
      return false;
    }
  }




  clear() {
    if (this.consoleOutput) {
      this.consoleOutput.innerHTML = '';
      this.unreadCount = 0;
      this.eventBus.emit('console:cleared');

      if (this.consoleEmptyState) {
        this.consoleEmptyState.classList.remove('hidden');
      }
    }
  }




  getCircularReplacer() {
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (this.seen.has(value)) {
          return '[Circular]';
        }
        this.seen.add(value);
      }
      return value;
    };
  }




  isScrolledToBottom() {
    if (!this.consoleOutput) return true;
    const { scrollTop, scrollHeight, clientHeight } = this.consoleOutput;
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
  }




  scrollToBottom() {
    if (this.consoleOutput) {
      this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }
  }




  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }




  destroy() {

  }
}
</file>

<file path="README.md">
# Trestle - Hierarchical Todo List

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/danja/trestle)

**Status 2025-05-18 : mostly there, but buggy, far from finished**

*Notes below mostly slop*

Trestle is a web-based hierarchical todo list application with RDF/SPARQL backend support. It allows you to create, organize, and manage nested tasks with rich text descriptions using markdown.

## Features

- **Hierarchical Structure**: Organize tasks in a tree-like structure with unlimited nesting
- **Drag and Drop**: Easily reorganize tasks by dragging and dropping
- **Keyboard Navigation**: Navigate and edit using keyboard shortcuts
- **Markdown Support**: Write rich task descriptions using markdown
- **SPARQL Backend**: Store your data in a standard RDF triplestore
- **Card View**: View and edit detailed information for each task
- **Responsive Design**: Works on both desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 16 or later
- A SPARQL endpoint (like Apache Jena Fuseki) for data storage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/trestle.git
   cd trestle
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the application:

   - Edit `js/config.js` to set your SPARQL endpoint URL and other preferences

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Usage

### Keyboard Shortcuts

- **Enter**: Create a new sibling item
- **Tab**: Indent (make a child of previous item)
- **Shift+Tab**: Outdent (move to parent level)
- **Up/Down**: Navigate through items
- **Click** on an item to select it
- **Double-click** on an item to edit it

### Card View

Click the card icon (📄) next to any item to open its detail card. Here you can add and edit markdown descriptions.

### Drag and Drop

- Drag items using the handle (●) to reposition them
- Drop between items to place as a sibling
- Hold over an item to make the dragged item a child

## Data Model

Trestle uses RDF to represent the data structure with the following predicates:

- `dc:title`: Item title
- `dc:created`: Creation timestamp
- `dc:description`: Markdown description
- `ts:index`: Position in parent's children list
- `ts:parent`: Reference to parent node

## Development

### Project Structure

- `js/model/`: Data model and SPARQL interaction
- `js/view/`: UI rendering and event handling
- `js/controller/`: Application logic
- `js/utils/`: Utility functions and helpers

### Running Tests

```bash
npm test
```

### Generating Documentation

```bash
npm run docs
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original Trestle concept by Danny Ayers
- Inspired by [Workflowy](https://workflowy.com)
</file>

<file path="package.json">
{
  "name": "trestle",
  "version": "0.9.0",
  "description": "A hierarchical todo list with SPARQL backend",
  "type": "module",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack serve --mode development",
    "test": "vitest --run",
    "test:ui": "vitest --ui",
    "docs": "jsdoc -c jsdoc.json",
    "rp": "repomix -c repomix.config.json ."
  },
  "keywords": [
    "todo",
    "rdf",
    "sparql",
    "outliner",
    "hierarchical"
  ],
  "author": "Danny Ayers",
  "license": "MIT",
  "dependencies": {
    "@rdfjs/data-model": "^2.0.1",
    "@rdfjs/namespace": "^2.0.0",
    "@rdfjs/parser-n3": "^2.0.1",
    "evb": "file:../evb",
    "loglevel": "^1.8.1",
    "marked": "^5.0.0",
    "rdf-ext": "^2.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.5",
    "@babel/preset-env": "^7.23.5",
    "@vitest/ui": "^1.0.0",
    "babel-loader": "^9.1.3",
    "chai": "^4.5.0",
    "copy-webpack-plugin": "^13.0.0",
    "css-loader": "^6.8.1",
    "html-webpack-plugin": "^5.6.3",
    "jsdoc": "^4.0.2",
    "jsdom": "^24.0.0",
    "style-loader": "^3.3.3",
    "vitest": "^1.0.0",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.2"
  }
}
</file>

<file path="src/js/model/TrestleModel.js">
import { Config } from '../config.js'
import { generateID, generateDate } from '../utils/utils.js'

export class TrestleModel {






    constructor(endpoint, baseUri, eventBus) {
        this.endpoint = endpoint
        this.baseUri = baseUri
        this.eventBus = eventBus
        this.rootId = null
        this.nodes = new Map()


        this.eventBus.on('node:updated', this.handleNodeUpdate.bind(this))
        this.eventBus.on('node:moved', this.handleNodeMove.bind(this))
        this.eventBus.on('node:deleted', this.handleNodeDelete.bind(this))
    }




    async initialize() {
        try {
            await this.loadData()
            this.eventBus.emit('model:loaded', { nodes: Array.from(this.nodes.values()) })
        } catch (error) {
            console.error('Failed to initialize model:', error)
            this.createEmptyModel()
        }
    }




    createEmptyModel() {
        const rootId = this.generateNodeId('root')
        this.rootId = rootId

        console.log('Creating empty model with rootId:', rootId)


        this.nodes.set(rootId, {
            id: rootId,
            type: 'RootNode',
            title: 'Root Node',
            created: generateDate(),
            children: []
        })

        console.log('Emitting model:created with root node type:', this.nodes.get(this.rootId).type)

        console.log('Emitting model:created with data:', {
            rootId: this.rootId,
            nodes: Array.from(this.nodes.values())
        })

        this.eventBus.emit('model:created', {
            rootId: this.rootId,
            nodes: Array.from(this.nodes.values())
        })
    }






    generateNodeId(prefix = 'nid') {
        return `${prefix}-${generateID()}`
    }





    async loadData() {
        try {
            const fURL = `${this.endpoint}?query=${encodeURIComponent(this.buildLoadQuery())}`

            const response = await fetch(fURL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`SPARQL query failed: ${response.statusText}`)
            }

            const data = await response.json()

            this.processLoadedData(data)

            return true
        } catch (error) {
            console.error('Error loading data:', error)
            throw error
        }
    }





    buildLoadQuery() {
        return `
            PREFIX dc: <${Config.PREFIXES.dc}>
            PREFIX ts: <${Config.PREFIXES.ts}>

            SELECT ?node ?type ?title ?created ?index ?parent WHERE {
                ?node a ?type .
                OPTIONAL { ?node dc:title ?title } .
                OPTIONAL { ?node dc:created ?created } .
                OPTIONAL { ?node ts:index ?index } .
                OPTIONAL { ?node ts:parent ?parent } .
             #   FILTER(STRSTARTS(STR(?type), "${Config.PREFIXES.ts}"))
            }
        `
    }





    processLoadedData(data) {

        this.nodes.clear()
        this.rootId = null


        const nodesMap = new Map()


        for (const binding of data.results.bindings) {
            const nodeUri = binding.node.value
            const nodeId = this.extractLocalId(nodeUri)
            const type = this.extractLocalType(binding.type.value)


            let node = nodesMap.get(nodeId) || { id: nodeId, children: [] }
            node.type = type

            if (binding.title) {
                node.title = binding.title.value
            }

            if (binding.created) {
                node.created = binding.created.value
            }

            if (binding.index) {
                node.index = parseInt(binding.index.value, 10)
            }

            if (binding.parent) {
                node.parent = this.extractLocalId(binding.parent.value)
            }


            if (type === 'RootNode') {
                this.rootId = nodeId
            }

            nodesMap.set(nodeId, node)
        }


        for (const [id, node] of nodesMap.entries()) {
            if (node.parent) {
                const parentNode = nodesMap.get(node.parent)
                if (parentNode) {
                    if (!parentNode.children) {
                        parentNode.children = []
                    }
                    parentNode.children.push(id)
                }
            }
        }


        for (const node of nodesMap.values()) {
            if (node.children && node.children.length > 0) {
                node.children.sort((a, b) => {
                    const nodeA = nodesMap.get(a)
                    const nodeB = nodesMap.get(b)
                    return (nodeA.index || 0) - (nodeB.index || 0)
                })
            }
        }


        this.nodes = nodesMap
    }






    extractLocalId(uri) {
        const parts = uri.split('/')
        return parts[parts.length - 1]
    }






    extractLocalType(uri) {
        const parts = uri.split('/')
        return parts[parts.length - 1]
    }








    addNode(parentId, title, index) {
        const nodeId = this.generateNodeId()
        const now = generateDate()

        const newNode = {
            id: nodeId,
            type: 'Node',
            title: title || '',
            created: now,
            parent: parentId,
            index: index,
            children: []
        }

        // Add to model
        this.nodes.set(nodeId, newNode)

        // Update parent's children
        const parentNode = this.nodes.get(parentId)
        if (parentNode) {
            if (!parentNode.children) {
                parentNode.children = []
            }

            if (typeof index === 'number') {
                parentNode.children.splice(index, 0, nodeId)
                this.updateChildIndices(parentNode)
            } else {
                newNode.index = parentNode.children.length
                parentNode.children.push(nodeId)
            }
        }

        return newNode
    }





    updateChildIndices(parentNode) {
        if (parentNode.children) {
            parentNode.children.forEach((childId, index) => {
                const child = this.nodes.get(childId)
                if (child) {
                    child.index = index
                }
            })
        }
    }







    moveNode(nodeId, newParentId, newIndex) {
        const node = this.nodes.get(nodeId)
        if (!node) return

        const oldParentId = node.parent
        const oldParent = this.nodes.get(oldParentId)


        if (oldParent && oldParent.children) {
            const oldIndex = oldParent.children.indexOf(nodeId)
            if (oldIndex !== -1) {
                oldParent.children.splice(oldIndex, 1)
                this.updateChildIndices(oldParent)
            }
        }


        const newParent = this.nodes.get(newParentId)
        if (newParent) {
            if (!newParent.children) {
                newParent.children = []
            }

            if (typeof newIndex === 'number') {
                newParent.children.splice(newIndex, 0, nodeId)
            } else {
                newParent.children.push(nodeId)
                newIndex = newParent.children.length - 1
            }


            node.parent = newParentId
            node.index = newIndex


            this.updateChildIndices(newParent)
        }


        this.eventBus.emit('node:moved', { nodeId, newParentId, newIndex })
    }





    deleteNode(nodeId) {
        const node = this.nodes.get(nodeId)
        if (!node) return


        if (node.children && node.children.length > 0) {
            const childrenToDelete = [...node.children]
            for (const childId of childrenToDelete) {
                this.deleteNode(childId)
            }
        }


        const parentId = node.parent
        if (parentId) {
            const parent = this.nodes.get(parentId)
            if (parent && parent.children) {
                const index = parent.children.indexOf(nodeId)
                if (index !== -1) {
                    parent.children.splice(index, 1)
                    this.updateChildIndices(parent)
                }
            }
        }


        this.nodes.delete(nodeId)
    }






    updateNode(nodeId, properties) {
        const node = this.nodes.get(nodeId)
        if (!node) return


        Object.assign(node, properties)
    }






    updateNodeDescription(nodeId, description) {
        const node = this.nodes.get(nodeId)
        if (!node) return

        node.description = description
    }






    getNode(nodeId) {
        return this.nodes.get(nodeId)
    }





    getAllNodes() {
        return Array.from(this.nodes.values())
    }





    getRootNode() {
        return this.nodes.get(this.rootId)
    }





    toTurtle() {
        let turtle = `@prefix dc: <${Config.PREFIXES.dc}> .\n`
        turtle += `@prefix ts: <${Config.PREFIXES.ts}> .\n\n`


        const rootNode = this.nodes.get(this.rootId)
        if (rootNode) {
            turtle += `<${this.baseUri}${rootNode.id}> a ts:RootNode .\n`
        }


        for (const [id, node] of this.nodes.entries()) {

            if (id === this.rootId) continue

            if (node.type === 'Node') {
                turtle += `<${this.baseUri}${node.id}> a ts:Node;\n`


                if (node.title) {
                    turtle += `   dc:title "${this.escapeTurtle(node.title)}" ;\n`
                }


                if (node.created) {
                    turtle += `   dc:created "${node.created}" ;\n`
                }


                turtle += `   ts:index "${node.index}" ;\n`


                if (node.parent) {
                    turtle += `   ts:parent <${this.baseUri}${node.parent}> .\n`
                } else {

                    turtle += `   ts:parent <${this.baseUri}${this.rootId}> .\n`
                }


                if (node.description) {
                    turtle += `<${this.baseUri}${node.id}> dc:description """${this.escapeTurtle(node.description)}""" .\n`
                }
            }
        }

        return turtle
    }






    escapeTurtle(text) {
        if (!text) return ''
        return text
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
    }





    async saveData() {
        try {
            const turtle = this.toTurtle()

            const response = await fetch(this.endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/turtle'
                },
                body: turtle
            })

            if (!response.ok) {
                throw new Error(`Failed to save data: ${response.statusText}`)
            }

            return true
        } catch (error) {
            console.error('Error saving data:', error)
            this.eventBus.emit('model:error', { message: 'Failed to save data', error })
            return false
        }
    }





    handleNodeUpdate(data) {
        const { nodeId, properties } = data
        this.updateNode(nodeId, properties)
    }





    handleNodeMove(data) {
        const { nodeId, newParentId, newIndex } = data
        this.moveNode(nodeId, newParentId, newIndex)
    }





    handleNodeDelete(data) {
        const { nodeId } = data
        this.deleteNode(nodeId)
    }





    loadOutline() {
        try {
            const savedData = localStorage.getItem('trestle-outline')
            if (savedData) {
                return JSON.parse(savedData)
            }
        } catch (error) {
            console.error('Failed to load outline:', error)
        }
        return null
    }
}

export default TrestleModel;
</file>

<file path="src/js/controller/TrestleController.js">
export class TrestleController {






    constructor(model, view, eventBus) {
        this.model = model
        this.view = view
        this.eventBus = eventBus


        this.setupEventHandlers()
    }




    initialize() {
        console.log('[TrestleController] Initializing controller');
        const savedOutline = this.model.loadOutline();
        console.log('[TrestleController] Saved outline:', savedOutline);

        if (savedOutline && savedOutline.nodes && savedOutline.nodes.length > 0) {
            console.log('[TrestleController] Loading saved outline with nodes:', savedOutline.nodes.length);
            this.eventBus.emit('model:loaded', savedOutline);
        } else {
            console.log('[TrestleController] Creating new outline');

            const rootNode = this.model.addNode(null, 'Root Node', 0);


            const childNode = this.model.addNode(rootNode.id, 'Sample Item', 0);

            const nodes = Array.from(this.model.nodes.values());
            console.log('[TrestleController] Created new nodes:', nodes);

            this.eventBus.emit('model:created', { nodes });
        }
    }




    setupEventHandlers() {

        this.eventBus.on('view:addChild', this.handleAddChild.bind(this))
        this.eventBus.on('view:addSibling', this.handleAddSibling.bind(this))
        this.eventBus.on('view:updateNode', this.handleUpdateNode.bind(this))
        this.eventBus.on('view:deleteNode', this.handleDeleteNode.bind(this))


        this.eventBus.on('view:moveNode', this.handleMoveNode.bind(this))
        this.eventBus.on('view:indentNode', this.handleIndentNode.bind(this))
        this.eventBus.on('view:outdentNode', this.handleOutdentNode.bind(this))


        this.eventBus.on('view:getNodeData', this.handleGetNodeData.bind(this))


        this.eventBus.on('view:insertNodeAt', this.handleInsertNodeAt.bind(this))
    }





    async saveData() {
        try {
            const success = await this.model.saveData()
            if (success) {
                this.showNotification('Data saved successfully')
            } else {
                this.showNotification('Failed to save data', 'error')
            }
            return success
        } catch (error) {
            console.error('Save error:', error)
            this.showNotification('Error saving data', 'error')
            return false
        }
    }






    showNotification(message, type = 'info') {


        if (type === 'error') {
            alert(`Error: ${message}`)
        } else {
            alert(message)
        }
    }




    addRootItem() {
        const rootNode = this.model.getRootNode()
        if (!rootNode) return


        const node = this.model.addNode(rootNode.id, '', rootNode.children.length)

        this.eventBus.emit('node:added', {
            node,
            parentId: 'trestle-root'
        })
    }






    updateNodeDescription(nodeId, description) {
        this.model.updateNodeDescription(nodeId, description)
    }





    handleAddChild(data) {
        const { parentId } = data
        const parent = this.model.getNode(parentId)
        if (!parent) return


        const childIndex = parent.children ? parent.children.length : 0
        const node = this.model.addNode(parentId, '', childIndex)

        this.eventBus.emit('node:added', {
            node,
            parentId
        })
    }





    handleAddSibling(data) {
        const { nodeId } = data
        const node = this.model.getNode(nodeId)
        if (!node) return


        const parentId = node.parent
        const parent = this.model.getNode(parentId)
        if (!parent) return


        const siblingIndex = parent.children.indexOf(nodeId)
        if (siblingIndex === -1) return


        const newNode = this.model.addNode(parentId, '', siblingIndex + 1)

        this.eventBus.emit('node:added', {
            node: newNode,
            parentId
        })
    }





    handleInsertNodeAt(data) {
        const { parentId, index } = data
        const parent = this.model.getNode(parentId)
        if (!parent) return


        const node = this.model.addNode(parentId, '', index)

        this.eventBus.emit('node:added', {
            node,
            parentId
        })
    }





    handleUpdateNode(data) {
        const { nodeId, properties } = data

        this.model.updateNode(nodeId, properties)

        this.eventBus.emit('node:updated', {
            nodeId,
            properties
        })
    }





    handleDeleteNode(data) {
        const { nodeId } = data

        this.model.deleteNode(nodeId)

        this.eventBus.emit('node:deleted', {
            nodeId
        })
    }





    handleMoveNode(data) {
        const { nodeId, newParentId, newIndex } = data

        this.model.moveNode(nodeId, newParentId, newIndex)


        this.eventBus.emit('node:moved', { nodeId, newParentId, newIndex })
    }





    handleIndentNode(data) {
        const { nodeId } = data
        const node = this.model.getNode(nodeId)
        if (!node || !node.parent) return

        const parent = this.model.getNode(node.parent)
        if (!parent || !parent.children) return


        const index = parent.children.indexOf(nodeId)
        if (index <= 0) return


        const newParentId = parent.children[index - 1]
        const newParent = this.model.getNode(newParentId)
        if (!newParent) return


        this.model.moveNode(nodeId, newParentId, newParent.children ? newParent.children.length : 0)


        this.eventBus.emit('view:nodeIndented', {
            nodeId,
            newParentId
        })
    }





    handleOutdentNode(data) {
        const { nodeId } = data
        const node = this.model.getNode(nodeId)
        if (!node || !node.parent) return

        const parent = this.model.getNode(node.parent)
        if (!parent || !parent.parent) return

        const grandparentId = parent.parent
        const grandparent = this.model.getNode(grandparentId)
        if (!grandparent) return


        const parentIndex = grandparent.children.indexOf(parent.id)
        if (parentIndex === -1) return


        this.model.moveNode(nodeId, grandparentId, parentIndex + 1)


        this.eventBus.emit('view:nodeOutdented', {
            nodeId,
            newParentId: grandparentId
        })
    }





    handleGetNodeData(data) {
        const { nodeId, callback } = data

        const node = this.model.getNode(nodeId)
        if (node && callback) {
            callback(node)
        }
    }
}

export default TrestleController;
</file>

<file path="src/html/index.html">
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trestle - Hierarchical Todo List</title>
    <link rel="stylesheet" href="css/trestle.css">
    <link rel="stylesheet" href="css/right-panel.css">
    <link
        href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet">
    <meta name="description" content="Trestle - A hierarchical todo list with SPARQL backend">
</head>

<body>
    <header id="header-outer">
        <div id="header">Trestle</div>

        <nav class="top-navbar toolbar">
            <div class="toolbar-left">

                <button class="toolbar-icon" id="backButton" aria-label="Back">&#x2039;</button>
                <button class="toolbar-icon" id="forwardButton" aria-label="Forward">&#x203A;</button>
                <button class="toolbar-icon" id="homeButton" aria-label="Home">🏠</button>
                <nav class="breadcrumb" aria-label="Breadcrumb">
                    <a href="#" class="breadcrumb-link">Musa</a>
                    <span class="breadcrumb-separator">&gt;</span>
                    <a href="#" class="breadcrumb-link">tests</a>
                    <span class="breadcrumb-separator">&gt;</span>
                    <span class="breadcrumb-current">add banner</span>
                </nav>
            </div>
            <div class="toolbar-right">
                <div class="search-bar">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="searchInput" placeholder="Search" aria-label="Search" />
                </div>
                <button class="toolbar-icon" id="favoritesButton" aria-label="Favorites">☆</button>
                <button class="toolbar-icon" id="hamburgerButton" aria-label="Menu">☰</button>

            </div>
        </nav>
    </header>

    <div id="menu-box" class="hidden">
        <div class="toolbar">
            <ul>
                <li><button id="mobileaaveButton">Save</button></li>
                <li><button id="mobileAddButton">Add Root Item</button></li>
                <li><button id="mobileShortcutsButton" data-view="shortcuts">Shortcuts</button></li>
                <li><button id="mobileConsoleButton" data-view="console">
                        Console
                        <span class="notification-badge hidden"></span>
                    </button></li>
            </ul>
        </div>
    </div>





    <div id="container">
        <div class="page">
            <div id="trestle">
                <div id="trestle-root" class="ts-root"></div>
            </div>
        </div>
    </div>


    <div id="right-panel" class="hidden" aria-labelledby="panel-title" role="complementary">

        <div class="panel-header">
            <h2 id="panel-title">Console</h2>
            <button id="close-panel" class="panel-close" title="Close panel" aria-label="Close panel">
                &times;
            </button>
        </div>




        <div class="panel-content">

            <div id="console-content" class="panel-section active" role="tabpanel" aria-labelledby="console-tab">
                <div class="console-header">
                    <div class="log-level-selector">
                        <label for="log-level">Log Level:</label>
                        <select id="log-level">
                            <option value="trace">Trace</option>
                            <option value="debug" selected>Debug</option>
                            <option value="info">Info</option>
                            <option value="warn">Warn</option>
                            <option value="error">Error</option>
                            <option value="silent">Silent</option>
                        </select>
                    </div>
                    <div class="console-actions">
                        <button id="clear-console" class="console-button" title="Clear console"
                            aria-label="Clear console">
                            <i class="icon-clear">🗑️</i>
                            <span>Clear</span>
                        </button>
                    </div>
                </div>
                <div id="console-output" class="console-output" aria-live="polite" aria-atomic="false">
                    <div class="console-empty-state">
                        <i class="icon-terminal">🖥️</i>
                        <p>Console is empty</p>
                        <p class="hint">Events and logs will appear here</p>
                    </div>
                </div>
            </div>


            <div id="shortcuts-content" class="panel-section" role="tabpanel" aria-labelledby="shortcuts-tab" hidden>
                <div class="shortcuts-list">

                </div>
            </div>
        </div>


        <div class="resize-handle" aria-hidden="true"></div>
    </div>

    <div id="card" class="hidden">
        <div id="card-title">Title</div>
        <div id="card-content">
            <textarea id="card-description" placeholder="Add description..."></textarea>
        </div>
        <div id="card-nid" class="date"></div>
        <div id="card-date" class="date"></div>
        <button id="card-close">Close</button>
    </div>

    <template id="entry-template">
        <div class="ts-entry">
            <button class="ts-expander" aria-label="Toggle expand"></button>
            <div class="ts-handle" aria-hidden="true">⋮</div>
            <div class="ts-title" contenteditable="true"></div>
            <div class="ts-actions">
                <button class="ts-card" aria-label="Show card" title="Show details">📝</button>
                <button class="ts-addChild" aria-label="Add child" title="Add child item">+</button>
                <button class="ts-delete" aria-label="Delete" title="Delete item">×</button>
            </div>
            <span class="date hidden"></span>
        </div>
    </template>

</body>

</html>
</file>

<file path="src/js/view/components/RightPanel.js">
import log from 'loglevel';
import ConsolePanel from './ConsolePanel.js';
import ShortcutsPanel from './ShortcutsPanel.js';

export class RightPanel {




  constructor(eventBus) {

    this.logger = log.getLogger('RightPanel');
    this.logger.setLevel(log.levels.DEBUG);
    this.eventBus = eventBus;


    window.rightPanel = this;

    this.logger.debug('RightPanel constructor called');


    this.isResizing = false;
    this.lastDownX = 0;
    this.startWidth = 400;
    this.currentView = null;
    this.unreadCount = 0;


    this.panel = document.getElementById('right-panel');
    this.panelTitle = document.getElementById('panel-title');
    this.closeButton = document.getElementById('close-panel');
    this.shortcutsContent = document.getElementById('shortcuts-content');
    this.consoleContent = document.getElementById('console-content');
    this.consoleButton = document.getElementById('mobileConsoleButton');
    this.notificationBadge = null;


    this.logger.debug('DOM elements:', {
      panel: !!this.panel,
      panelTitle: !!this.panelTitle,
      closeButton: !!this.closeButton,
      shortcutsContent: !!this.shortcutsContent,
      consoleContent: !!this.consoleContent,
      consoleButton: !!this.consoleButton
    });

    try {

      this.consolePanel = new ConsolePanel(eventBus);
      this.shortcutsPanel = new ShortcutsPanel(eventBus);
      this.logger.debug('Child panels initialized');


      this.initialize();


      this.setupResizeHandlers();

      this.logger.info('RightPanel initialized');
    } catch (error) {
      this.logger.error('Error during RightPanel initialization:', error);
      throw error;
    }
  }




  initialize() {
    this.logger.info('Initializing RightPanel');

    try {
      if (!this.panel) {
        this.logger.error('Right panel element not found in the DOM');
        return;
      }


      this.panel.className = ''; // Clear all classes
      this.panel.id = 'right-panel';
      this.panel.style.cssText = ''; // Reset all inline styles

      // Add base classes
      this.panel.classList.add('right-panel', 'hidden');


      this.panel.style.display = 'none';
      this.panel.style.flexDirection = 'column';
      this.panel.style.position = 'fixed';
      this.panel.style.top = '0';
      this.panel.style.right = '0';
      this.panel.style.bottom = '0';
      this.panel.style.width = '400px';
      this.panel.style.backgroundColor = '#2d2d2d';
      this.panel.style.color = '#f0f0f0';
      this.panel.style.boxShadow = '-2px 0 10px rgba(0, 0, 0, 0.3)';
      this.panel.style.zIndex = '1000';
      this.panel.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
      this.panel.style.opacity = '0';
      this.panel.style.transform = 'translateX(100%)';


      this.panel.setAttribute('aria-labelledby', 'panel-title');
      this.panel.setAttribute('role', 'complementary');
      this.panel.setAttribute('aria-hidden', 'true');


      this.setupEventListeners();


      this.initializePanels();


      this.initializeTabs();

      this.logger.info('RightPanel initialization complete');
    } catch (error) {
      this.logger.error('Error initializing RightPanel:', error);
      throw error;
    }
  }





  toggleView(view) {
    if (!view) {

      view = this.currentView === 'console' ? 'shortcuts' : 'console';
    }

    this.showView(view);


    document.querySelectorAll('.tab-button').forEach(button => {
      const isActive = button.getAttribute('data-view') === view;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive.toString());
    });
  }




  setupEventListeners() {

    if (this.consoleButton) {
      this.consoleButton.addEventListener('click', () => {
        this.toggleView('console');
      });
    }




    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.hide();
      });
    }


    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
        e.preventDefault();
      }
    });


    this.eventBus.on('console:new-message', () => {
      if (this.currentView !== 'console') {
        this.unreadCount++;
        this.updateNotificationBadge();
      }
    });


    this.eventBus.on('console:cleared', () => {
      this.unreadCount = 0;
      this.updateNotificationBadge();
    });


    this.eventBus.on('rightpanel:toggle', (data) => {
      this.logger.debug('Received rightpanel:toggle event with data:', data);
      try {
        if (data && data.view) {
          this.logger.debug(`Toggling panel to show ${data.view} view`);
          this.toggle(data.view);
        } else {
          this.logger.debug('Toggling panel visibility');
          this.toggle();
        }
      } catch (error) {
        this.logger.error('Error handling rightpanel:toggle event:', error);
      }
    });


    this.eventBus.on('*', (data, event) => {
      if (event && event.type && !event.type.startsWith('rightpanel:')) {
        this.logger.debug(`Received event: ${event.type}`, data);
      }
    });
  }




  initializePanels() {
    try {

      const panelContent = this.panel?.querySelector('.panel-content');

      if (!panelContent) {
        this.logger.error('Panel content container not found');
        return;
      }


      let consoleContent = panelContent.querySelector('#console-content');
      if (consoleContent) {
        this.consolePanel.initialize(consoleContent);
        this.consoleContent = consoleContent;
      } else {
        this.logger.warn('Console content element not found in panel');
      }


      let shortcutsContent = panelContent.querySelector('#shortcuts-content');
      if (shortcutsContent) {
        this.shortcutsPanel.initialize(shortcutsContent);
        this.shortcutsContent = shortcutsContent;
      } else {
        this.logger.warn('Shortcuts content element not found in panel');
      }

      this.logger.info('Panels initialized');
    } catch (error) {
      this.logger.error('Error initializing panels:', error);
    }
  }





  show(view = 'console') {
    if (!this.panel) {
      this.logger.warn('Cannot show panel: panel element not found');
      return;
    }

    this.logger.debug(`Showing panel with view: ${view}`);


    if (this.panel.classList.contains('hidden')) {
      this.panel.classList.remove('hidden');
      this.panel.style.display = 'flex';
      this.panel.style.opacity = '1';
      this.panel.style.transform = 'translateX(0)';
      this.panel.setAttribute('aria-hidden', 'false');
    }


    if (view) {
      this.currentView = view;
      this.showView(view);
    }


    setTimeout(() => {
      const firstFocusable = this.panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 50);


    this.eventBus.emit('rightpanel:shown', { view: this.currentView });
  }




  hide() {
    if (!this.panel) {
      this.logger.warn('Cannot hide: panel element not found');
      return;
    }

    this.logger.debug('Hiding right panel');

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {

      this.panel.classList.add('hidden');
      this.panel.style.display = 'none';
      this.panel.style.opacity = '0';
      this.panel.style.visibility = 'hidden';
      this.panel.style.transform = 'none';
      this.currentView = null;
      document.body.classList.remove('right-panel-visible');
      this.eventBus.emit('rightpanel:hidden');
      this.logger.debug('Right panel hidden (mobile)');
    } else {

      this.panel.style.opacity = '0';
      this.panel.style.visibility = 'hidden';
      this.panel.style.transform = 'translateX(100%)';


      const onTransitionEnd = () => {
        this.panel.removeEventListener('transitionend', onTransitionEnd);
        this.panel.classList.add('hidden');
        this.panel.style.display = 'none';
        this.currentView = null;
        document.body.classList.remove('right-panel-visible');
        this.eventBus.emit('rightpanel:hidden');
        this.logger.debug('Right panel hidden (desktop)');
      };

      this.panel.addEventListener('transitionend', onTransitionEnd, { once: true });


      void this.panel.offsetWidth;
    }
  }





  toggle(view = 'console') {
    if (!this.panel) {
      this.logger.warn('Cannot toggle: panel element not found');
      return;
    }

    this.logger.debug(`Toggling panel. Current view: ${this.currentView}, Requested view: ${view}`);
    console.log(`RightPanel.toggle('${view}') called`);


    const currentState = {
      classList: Array.from(this.panel.classList),
      style: {
        display: this.panel.style.display,
        opacity: this.panel.style.opacity,
        transform: this.panel.style.transform,
        visibility: this.panel.style.visibility
      },
      isVisible: this.isVisible(),
      hasHiddenClass: this.panel.classList.contains('hidden'),
      currentView: this.currentView
    };

    console.log('Panel state:', currentState);


    if (currentState.hasHiddenClass || !currentState.isVisible) {
      this.logger.debug('Panel is hidden or not visible, showing with view:', view);
      this.show(view);
    }

    else if (view && this.currentView !== view) {
      this.logger.debug(`Switching from ${this.currentView} to ${view} view`);
      this.show(view);
    }

    else {
      this.logger.debug('Hiding panel');
      this.hide();
    }


    const menuBox = document.getElementById('menu-box');
    if (menuBox) {
      console.log('Hiding menu box');
      menuBox.classList.add('hidden');
    }


    void this.panel.offsetHeight;
  }





  isVisible() {
    if (!this.panel) {
      console.log('isVisible: No panel element');
      return false;
    }


    const isHiddenByClass = this.panel.classList.contains('hidden');
    const isHiddenByStyle = this.panel.style.display === 'none' ||
      this.panel.style.opacity === '0' ||
      this.panel.style.visibility === 'hidden';


    const rect = this.panel.getBoundingClientRect();
    const isInViewport = this.panel.offsetWidth > 0 &&
      this.panel.offsetHeight > 0 &&
      rect.right > 0;

    const isVisible = !isHiddenByClass && !isHiddenByStyle && isInViewport;

    console.log('isVisible check:', {
      isHiddenByClass,
      isHiddenByStyle: {
        display: this.panel.style.display,
        opacity: this.panel.style.opacity,
        visibility: this.panel.style.visibility
      },
      viewport: {
        offsetWidth: this.panel.offsetWidth,
        offsetHeight: this.panel.offsetHeight,
        rectRight: rect.right,
        rect: rect
      },
      isInViewport,
      finalResult: isVisible,
      classList: Array.from(this.panel.classList)
    });

    return isVisible;
  }




  clearConsole() {
    this.eventBus.emit('console:clear');
  }









  showView(view) {
    if (!this.panel) {
      this.logger.warn('Cannot show view: panel element not found');
      return;
    }

    this.logger.debug('Showing view:', view);
    console.log(`showView('${view}') called`);


    console.log('Making panel visible');
    this.panel.classList.remove('hidden');
    this.panel.style.display = 'flex';
    this.panel.style.opacity = '1';
    this.panel.style.visibility = 'visible';
    this.panel.style.transform = 'translateX(0)';
    this.panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('right-panel-visible');


    void this.panel.offsetHeight;


    const allPanels = Array.from(this.panel.querySelectorAll('.panel-section'));
    this.logger.debug(`Found ${allPanels.length} panels`);

    allPanels.forEach((panel) => {
      panel.style.display = 'none';
      panel.style.opacity = '0';
      panel.style.visibility = 'hidden';
      panel.classList.remove('active');
    });


    const targetPanel = this.panel.querySelector(`#${view}-content`);
    if (targetPanel) {
      targetPanel.style.display = 'flex';
      targetPanel.style.opacity = '1';
      targetPanel.style.visibility = 'visible';
      targetPanel.classList.add('active');
    } else {
      console.warn(`Panel not found: ${view}-content`);
    }


    this.currentView = view;


    if (this.panelTitle) {
      this.panelTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
    }


    this.panel.style.position = 'fixed';
    this.panel.style.top = '0';
    this.panel.style.right = '0';
    this.panel.style.bottom = '0';
    this.panel.style.width = '400px';
    this.panel.style.zIndex = '1000';


    this.currentView = view;
    this.logger.debug(`Current view set to: ${this.currentView}`);


    if (this.panelTitle) {
      this.panelTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
    }


    if (view === 'console') {
      this.unreadCount = 0;
      this.updateNotificationBadge();
    }


    if (this.consoleButton && !this.notificationBadge) {
      this.notificationBadge = document.createElement('span');
      this.notificationBadge.className = 'notification-badge hidden';
      this.consoleButton.appendChild(this.notificationBadge);
    }

    this.logger.debug(`View updated to: ${view}`);
  }




  updateNotificationBadge() {
    if (!this.notificationBadge) return;

    if (this.unreadCount > 0) {
      this.notificationBadge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount.toString();
      this.notificationBadge.classList.remove('hidden');
    } else {
      this.notificationBadge.classList.add('hidden');
    }
  }







  showConsoleNotification() {
    if (this.currentView !== 'console') {
      this.unreadCount++;
      this.updateNotificationBadge();
    }
  }




  updateNotificationBadge() {
    if (!this.notificationBadge) {
      this.notificationBadge = document.querySelector('.notification-badge');
    }

    if (this.notificationBadge) {
      if (this.unreadCount > 0) {
        this.notificationBadge.textContent = this.unreadCount;
        this.notificationBadge.classList.remove('hidden');
      } else {
        this.notificationBadge.textContent = '';
        this.notificationBadge.classList.add('hidden');
      }
    }
  }




  setupResizeHandlers() {
    if (!this.panel) return;

    const handleMouseDown = (e) => {
      if (e.button !== 0) return;

      this.isResizing = true;
      this.lastDownX = e.clientX;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseMove = (e) => {
      if (!this.isResizing) return;

      const deltaX = this.lastDownX - e.clientX;
      this.lastDownX = e.clientX;

      const newWidth = this.panel.offsetWidth + deltaX;
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.7;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        this.panel.style.width = `${newWidth}px`;
      }

      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseUp = () => {
      if (!this.isResizing) return;

      this.isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Save the width for next time
      if (this.panel) {
        this.startWidth = this.panel.offsetWidth;
      }
    };

    // Add event listeners
    const resizeHandle = this.panel.querySelector('.resize-handle');
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleMouseDown);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);


    this.cleanupResizeHandlers = () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }




  destroy() {
    if (this.cleanupResizeHandlers) {
      this.cleanupResizeHandlers();
    }

    if (this.panel) {
      this.panel.removeEventListener('transitionend', this.onTransitionEnd);
    }
  }




  setupResizeHandlers() {
    if (!this.panel) return;

    const handleMouseDown = (e) => {

      const rect = this.panel.getBoundingClientRect();
      const handleWidth = 8;

      if (e.clientX >= rect.left - handleWidth && e.clientX <= rect.left + handleWidth) {
        this.isResizing = true;
        this.startWidth = rect.width;
        this.lastDownX = e.clientX;
        this.panel.classList.add('resizing');


        document.body.style.userSelect = 'none';

        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleMouseMove = (e) => {
      if (!this.isResizing) return;

      const deltaX = this.lastDownX - e.clientX;
      const newWidth = this.startWidth + deltaX;


      if (newWidth >= 300 && newWidth <= 800) {
        this.panel.style.width = `${newWidth}px`;
      }

      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseUp = () => {
      if (this.isResizing) {
        this.isResizing = false;
        this.panel.classList.remove('resizing');
        document.body.style.userSelect = '';
      }
    };

    // Add event listeners
    this.panel.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);


    this.cleanupResizeHandlers = () => {
      if (this.panel) {
        this.panel.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }




  initializeTabs() {
    this.logger.debug('Initializing tab states');


    const allPanels = this.panel.querySelectorAll('.panel-section');
    const tabButtons = this.panel.querySelectorAll('.tab-button');

    allPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.style.display = 'none';
      panel.style.opacity = '0';
      panel.style.visibility = 'hidden';
    });

    tabButtons.forEach(button => {

      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);


      const view = newButton.getAttribute('data-view');
      const isActive = view === 'console';

      if (isActive) {
        newButton.classList.add('active');
        newButton.setAttribute('aria-selected', 'true');
      } else {
        newButton.classList.remove('active');
        newButton.setAttribute('aria-selected', 'false');
      }


      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const view = e.currentTarget.getAttribute('data-view');
        if (view) {
          this.toggleView(view);
        }
      });
    });


    const consolePanel = this.panel.querySelector('#console-content');
    if (consolePanel) {
      consolePanel.style.display = 'flex';
      consolePanel.style.visibility = 'visible';
      consolePanel.style.opacity = '1';
      consolePanel.classList.add('active');
    }


    this.hide();
  }




  destroy() {
    if (typeof this.cleanupResizeHandlers === 'function') {
      this.cleanupResizeHandlers();
    }


    if (this.consolePanel && typeof this.consolePanel.destroy === 'function') {
      this.consolePanel.destroy();
    }

    if (this.shortcutsPanel && typeof this.shortcutsPanel.destroy === 'function') {
      this.shortcutsPanel.destroy();
    }


    this.panel = null;
    this.panelTitle = null;
    this.closeButton = null;
    this.shortcutsContent = null;
    this.consoleContent = null;
    this.consoleButton = null;
    this.notificationBadge = null;


    this.eventBus = null;
  }
}

export default RightPanel;
</file>

<file path="src/js/main.js">
import { TrestleModel } from './model/TrestleModel.js'
import TrestleRDFModel from './model/TrestleRDFModel.js'
import TrestleView from './view/index.js'
import { TrestleController } from './controller/TrestleController.js'
import { Config } from './config.js'
import { EventBus } from 'evb'
import { EventLogger } from './utils/EventLogger.js'

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed')


    const eventBus = new EventBus()
    console.log('EventBus initialized')


    const eventLogger = new EventLogger(eventBus, {
        loggerName: 'Trestle:EventLogger',
        logLevel: 'debug',
        ignorePatterns: [

            /^mousemove|mousedown|mouseup|click|scroll|resize|input|keydown|keyup|keypress$/,

            /^console:/,
            'trestle:rendering',
            'trestle:rendered',
            'trestle:updating',
            'trestle:updated'
        ]
    });
    console.log('EventLogger initialized');


    const model = new TrestleRDFModel(Config.SPARQL_ENDPOINT, Config.BASE_URI, eventBus)
    console.log('TrestleModel initialized')

    const view = new TrestleView(document.getElementById('trestle-root'), eventBus)
    console.log('TrestleView initialized')

    const controller = new TrestleController(model, view, eventBus)
    console.log('TrestleController initialized')


    setupUIListeners(controller, eventBus)


    controller.initialize()
    console.log('Controller initialization complete')


    if (Config.AUTO_SAVE) {
        setupAutoSave(controller, Config.AUTO_SAVE_INTERVAL)
    }
})





function setupUIListeners(controller, eventBus) {

    const saveButton = document.getElementById('saveButton')
    const mobileaaveButton = document.getElementById('mobileaaveButton')
    const clearAllButton = document.getElementById('addButton')
    const mobileAddButton = document.getElementById('mobileAddButton')
    const shortcutsButton = document.getElementById('shortcutsButton')
    const mobileShortcutsButton = document.getElementById('mobileShortcutsButton')
    const cardClose = document.getElementById('card-close')

    const hamburgerButton = document.getElementById('hamburgerButton')
    const menuBox = document.getElementById('menu-box')


    if (saveButton) {
        saveButton.addEventListener('click', () => controller.saveData())
    }

    if (mobileaaveButton) {
        mobileaaveButton.addEventListener('click', () => {
            controller.saveData()
            menuBox.classList.add('hidden')
        })
    }


    if (clearAllButton) {
        clearAllButton.textContent = 'Clear All'
        clearAllButton.addEventListener('click', () => {
            controller.model.createEmptyModel()
            controller.view.renderTree({ nodes: Array.from(controller.model.nodes.values()) })
        })
    }


    if (mobileAddButton) {
        mobileAddButton.addEventListener('click', () => {
            controller.addRootItem()
            menuBox.classList.add('hidden')
        })
    }





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


        console.log(`Calling rightPanel.toggle('${view}')`);
        rightPanel.toggle(view);


        const menuBox = document.getElementById('menu-box');
        if (menuBox) {
            console.log('Hiding mobile menu');
            menuBox.classList.add('hidden');
        }
    };


    if (shortcutsButton) {
        shortcutsButton.addEventListener('click', () => handlePanelButtonClick('shortcuts'));
    }


    if (mobileShortcutsButton) {
        mobileShortcutsButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handlePanelButtonClick('shortcuts');
        });
    }


    const mobileConsoleButton = document.getElementById('mobileConsoleButton');
    if (mobileConsoleButton) {
        mobileConsoleButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handlePanelButtonClick('console');
        });
    }


    if (hamburgerButton && menuBox) {
        hamburgerButton.addEventListener('click', (event) => {

            const menuWasHidden = menuBox.classList.contains('hidden');


            if (menuWasHidden && rightPanel && rightPanel.isVisible()) {
                rightPanel.hide();
            }

            menuBox.classList.toggle('hidden');
            event.stopPropagation();
        });
    }


    if (menuBox) {
        document.addEventListener('click', (event) => {
            if (!menuBox.contains(event.target) &&
                event.target !== hamburgerButton &&
                !menuBox.classList.contains('hidden')) {
                menuBox.classList.add('hidden');
            }
        });
    }


    if (cardClose) {
        cardClose.addEventListener('click', () => {
            const card = document.getElementById('card')
            const cardDescription = document.getElementById('card-description')


            if (card && card.dataset.nodeId) {
                controller.updateNodeDescription(card.dataset.nodeId, cardDescription.value)
            }


            card.classList.add('hidden')
        })
    }


    document.getElementById('trestle').addEventListener('click', (event) => {

        if (event.target.id === 'trestle' || event.target.id === 'trestle-root') {

            const rootElement = document.getElementById('trestle-root')
            if (!rootElement.querySelector('li:not(.ts-empty-state)')) {
                controller.addRootItem()
            }
        }
    })


    document.addEventListener('keydown', (event) => {

        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault()
            controller.saveData()
        }


        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault()
            controller.addRootItem()
        }
    })
}






function setupAutoSave(controller, interval) {

    setInterval(() => {
        controller.saveData()
    }, interval)


    window.addEventListener('beforeunload', () => {
        controller.saveData()
    })
}
</file>

<file path="src/css/trestle.css">
@import 'parts/_variables.css';
@import 'parts/_reset.css';
@import 'parts/_header.css';
@import 'parts/_toolbar.css';
@import 'parts/_breadcrumb.css';
@import 'parts/_searchbar.css';
@import 'parts/_panel.css';
@import 'parts/_console.css';
@import 'parts/_shortcuts.css';
@import 'parts/_rightpanel.css';
@import 'parts/_card.css';
@import 'parts/_tree.css';
@import 'parts/_favorites.css';
@import 'parts/_options.css';
@import 'parts/_menu.css';
@import 'parts/_responsive.css';


@media (prefers-color-scheme: dark) {
    .search-bar {
        background: rgba(255, 255, 255, 0.1);
    }

    .search-bar:focus-within {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .search-bar input[type="text"] {
        color: #f0f0f0;
    }

    .search-bar input[type="text"]::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .search-icon {
        color: rgba(255, 255, 255, 0.6);
    }
}



.shortcuts-list {
    list-style: none;
    padding: 0;
}

.shortcuts-list li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.shortcuts-list kbd {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 3px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    color: #333;
    display: inline-block;
    font-family: monospace;
    font-size: 0.9em;
    line-height: 1.4;
    padding: 1px 6px;
    margin-right: 10px;
    white-space: nowrap;
}

.console-output {
    font-family: monospace;
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 10px;
    min-height: 300px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 0.9em;
    line-height: 1.4;
    position: relative;
}

.console-empty-state {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    text-align: center;
    padding: 20px;
    pointer-events: none;
}

.console-empty-state svg {
    opacity: 0.5;
    margin-bottom: 12px;
}

.console-empty-state p {
    margin: 0;
    font-size: 0.95em;
}


.console-output:not(:empty)+.console-empty-state {
    display: none;
}

.console-entry {
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 0.9em;
    line-height: 1.6;
    font-family: 'Fira Code', 'Courier New', monospace;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    word-break: break-word;
    position: relative;
    overflow: hidden;
}

.console-entry:hover {
    filter: brightness(0.98);
}

.console-time {
    color: #666;
    font-size: 0.8em;
    white-space: nowrap;
    opacity: 0.8;
    flex-shrink: 0;
    margin-top: 1px;
}

.console-message {
    flex: 1;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
}

.console-log {
    border-left-color: var(--primary-color, #4a90e2);
    background-color: rgba(74, 144, 226, 0.05);
}

.console-error {
    border-left-color: var(--error-color, #e74c3c);
    background-color: rgba(231, 76, 60, 0.1);
}

.console-warn {
    border-left-color: var(--warning-color, #f39c12);
    background-color: rgba(243, 156, 18, 0.1);
}

.console-info {
    border-left-color: var(--info-color, #3498db);
    background-color: rgba(52, 152, 219, 0.05);
}

.console-event {
    border-left-color: var(--secondary-color, #7f8c8d);
    background-color: rgba(127, 140, 141, 0.05);
    font-style: italic;
}

.console-type {
    display: inline-block;
    min-width: 50px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8em;
    letter-spacing: 0.5px;
    opacity: 0.8;
    margin-right: 12px;
}

.console-time {
    color: var(--text-muted, #7f8c8d);
    font-size: 0.8em;
    margin-right: 12px;
    font-family: 'Fira Code', 'Courier New', monospace;
    opacity: 0.8;
}

.console-message {
    font-family: 'Fira Code', 'Courier New', monospace;
    white-space: pre-wrap;
    word-break: break-word;
}


.console-message {
    font-family: 'Fira Code', 'Courier New', monospace;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.6;
    tab-size: 2;
}

.console-message .string {
    color: #a5d6ff;
}

.console-message .number {
    color: #f78c6c;
}

.console-message .boolean {
    color: #ff9c6e;
    font-weight: bold;
}

.log-level-selector {
    display: flex;
    align-items: center;
    gap: 8px;
}

.log-level-selector label {
    color: var(--text-color, #e0e0e0);
    font-size: 13px;
    white-space: nowrap;
}

.log-level-selector select {
    background-color: var(--bg-color-input, #3c3c3c);
    color: var(--text-color, #e0e0e0);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 13px;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
}

.log-level-selector select:focus {
    border-color: var(--primary-color, #4a9cff);
    box-shadow: 0 0 0 1px var(--primary-color, #4a9cff);
}

.console-actions {
    display: flex;
    gap: 8px;
}

#console-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#console-output {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    background-color: var(--bg-color-console, #1e1e1e);
    color: var(--text-color, #e0e0e0);
    border-radius: 4px;
    margin: 10px 0;
    max-height: calc(100vh - 200px);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
    display: block;
}

.console-message .null {
    color: #7f8c8d;
    font-style: italic;
}

.console-message .undefined {
    color: #7f8c8d;
    font-style: italic;
}

.console-message .key {
    color: #82aaff;
}

.console-message .error {
    color: #ff6b6b;
    font-weight: bold;
}


.console-message .object {
    display: inline-block;
    padding-left: 1.5em;
    text-indent: -1.5em;
}

.console-message .bracket,
.console-message .brace {
    color: #d4d4d4;
}

.console-message .colon {
    color: #d4d4d4;
    margin: 0 2px;
}

.console-message .comma {
    color: #d4d4d4;
    margin-right: 4px;
}


.console-entry.console-error .console-message {
    color: #ff8a7a;
    white-space: pre-wrap;
}

.console-entry.console-warn .console-message {
    color: #ffcb6b;
}


.console-message .file-link {
    color: #82aaff;
    text-decoration: none;
    cursor: pointer;
    border-bottom: 1px dashed #82aaff;
    padding: 0 2px;
    margin: 0 1px;
    border-radius: 2px;
    transition: all 0.2s ease;
}

.console-message .file-link:hover {
    background-color: rgba(130, 170, 255, 0.1);
    border-bottom-style: solid;
    text-decoration: none;
}


.console-message .stack-trace {
    display: block;
    margin-top: 6px;
    color: #aaa;
    font-size: 0.9em;
    line-height: 1.5;
    white-space: pre-wrap;
}

.console-entry.console-error .file-link {
    color: #ff8a7a;
    border-color: #ff8a7a;
}

.console-entry.console-error .file-link:hover {
    background-color: rgba(255, 138, 122, 0.1);
}

.console-entry.console-warn .file-link {
    color: #ffcb6b;
    border-color: #ffcb6b;
}

.console-entry.console-warn .file-link:hover {
    background-color: rgba(255, 203, 107, 0.1);
}

.console-log .console-type {
    background-color: #e0e0e0;
    color: #333;
}

.console-error .console-type {
    background-color: #ffcdd2;
    color: #b71c1c;
}

.console-warn .console-type {
    background-color: #fff3e0;
    color: #e65100;
}

.console-info .console-type {
    background-color: #bbdefb;
    color: #0d47a1;
}

.console-event .console-type {
    background-color: #c8e6c9;
    color: #1b5e20;
}


.notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ff3b30;
    color: white;
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: bold;
    line-height: 1;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    border: 2px solid var(--background-color);
    transition: all 0.2s ease;
}

.notification-badge.hidden {
    opacity: 0;
    transform: scale(0.5);
    pointer-events: none;
}


#menu-box .toolbar li {
    position: relative;
    padding-right: 10px;
}


@media (max-width: 768px) {
    .right-panel {
        width: 100%;
        right: -100%;
    }

    .right-panel.visible+#trestle {
        margin-right: 0;
        transform: translateX(-100%);
    }
}

.page {
    margin: 15px auto;
    max-width: 800px;
}


@media (min-width: 768px) {






    .top-navbar {
        display: flex;
    }

    .hamburger-menu {
        display: none;
    }
}

@media (max-width: 767px) {
    .top-navbar {
        display: none;
    }

    .hamburger-menu {
        display: block;
    }
}


#trestle {
    display: block;
    margin: 0;
    list-style: none;
    user-select: none;
    font-size: 1rem;
    line-height: 1.5;
}

#trestle ul {
    list-style: none;
    padding-left: 24px;
    margin-left: 4px;
    border-left: 1px solid #eee;
}

#trestle li {
    display: block;
    position: relative;
    margin: 2px 0;
}

.ts-entry {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 28px;
    padding: 4px 0;
    border-radius: 4px;
    transition: background-color 0.15s ease;
}

.ts-entry:hover {
    background-color: var(--hover-bg);
}

.ts-title {
    cursor: text;
    outline: none;
    padding: 3px 6px;
    line-height: 1.5;
    flex-grow: 1;
    border-radius: 3px;
    transition: background-color 0.15s ease;
}

.ts-title:focus {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0 2px var(--focus-color);
}

.ts-title:empty::before {
    content: "New item...";
    color: #aaa;
    font-style: italic;
}

.ts-handle {
    visibility: hidden;
    cursor: move;
    color: #777;
    padding: 0 4px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ts-entry:hover .ts-handle {
    visibility: visible;
    opacity: 0.7;
}

.ts-entry .ts-handle:hover {
    opacity: 1;
    color: #444;
}

.ts-actions {
    display: none;
    padding: 0 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ts-entry:hover .ts-actions {
    display: flex;
    opacity: 0.7;
}

.ts-entry .ts-actions:hover {
    opacity: 1;
}

.ts-actions button {
    background: none;
    border: none;
    cursor: pointer;
    margin: 0 2px;
    padding: 3px;
    font-size: 14px;
    color: #666;
    border-radius: 3px;
    transition: background-color 0.15s ease;
}

.ts-actions button:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #555;
}

.ts-expander {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    position: relative;
    margin-right: 2px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ts-expander:hover {
    opacity: 1;
}

.ts-expander::before {
    content: "▾";
    font-size: 11px;
    color: #555;
    font-weight: bold;
}

.ts-closed>.ts-entry>.ts-expander::before {
    content: "▸";
    color: #555;
    font-weight: bold;
}

.ts-closed>ul {
    display: none;
}

.ts-highlight {
    background-color: var(--highlight-bg);
}

.ts-selected {
    background-color: var(--selected-bg);
    border-left: 2px solid var(--selected-border);
}

.ts-selected .ts-title {
    margin-left: -2px;
}

.ts-dragging {
    opacity: 0.5;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: grabbing;
}

.ts-dragging-item {
    opacity: 0.7;
    position: relative;
    z-index: 5;
}

.ts-dragging-active .ts-handle {
    cursor: grabbing;
}

.dropzone {
    height: 8px;
    background-color: transparent;
    transition: all 0.2s ease;
    border-radius: 4px;
    position: relative;
    z-index: 10;
}

.dropzone.active {
    background: #e3f2fd;
    border-color: #90caf9;
}


.ts-drop-indent {
    background-color: #e0ffe0 !important;

    border-left: 4px solid #4caf50 !important;
}

.ts-drop-outdent {
    background-color: #ffe0e0 !important;

    border-right: 4px solid #f44336 !important;
}


.ts-dragging-active .dropzone {
    border: 1px dashed transparent;
}

.ts-dragging-active .dropzone:hover {
    border-color: rgba(33, 150, 243, 0.5);
    background-color: rgba(33, 150, 243, 0.1);
}

.drag-placeholder {
    border: 1px dashed #aaa;
    background-color: #f9f9f9;
    height: 30px;
    margin: 4px 0;
    border-radius: 4px;
}

[contenteditable="true"]:focus {
    background-color: white;
    outline: none;
}

.text-box {
    background-color: white;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    line-height: 1.5;
}


.ts-closed:not(:has(ul))>.ts-entry>.ts-expander::before {
    content: "•";
    opacity: 0.8;
    color: #444;
    font-size: 14px;
}


.ts-add-between {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
    z-index: 5;
}

.ts-add-between::before {
    content: "+";
    color: #666;
    font-size: 16px;
    background-color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    font-weight: bold;
}

.dropzone:hover .ts-add-between {
    opacity: 1;
}

.ts-add-between:hover::before {
    color: var(--primary-color);
    border-color: var(--primary-color);
}


#card {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: white;
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    z-index: 1000;
}

#card-title {
    padding: 12px 16px;
    background-color: var(--card-header-bg);
    color: var(--card-header-color);
    border-radius: 8px 8px 0 0;
    font-weight: 500;
    word-break: break-word;
}

#card-content {
    padding: 16px;
}

#card-description {
    width: 100%;
    min-height: 120px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
    transition: border-color 0.2s ease;
}

#card-description:focus {
    outline: none;
    border-color: var(--focus-color);
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.25);
}

#card-nid,
#card-date {
    font-size: 0.8em;
    color: #888;
    padding: 5px 16px;
}

#card-close {
    margin: 10px 16px 16px;
    padding: 8px 12px;
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    float: right;
    transition: background-color 0.2s;
}

#card-close:hover {
    background-color: #e0e0e0;
}

.hidden {
    display: none !important;
}


.ts-empty-state {
    padding: 1.5rem;
    text-align: center;
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    margin: 2rem 0;
}

.ts-empty-text {
    color: #888;
    cursor: pointer;
    padding: 1rem;
    font-size: 1.1rem;
    transition: color 0.2s;
}

.ts-empty-text:hover {
    color: var(--primary-color);
}


#shortcuts-text {
    position: fixed;
    top: 70px;
    left: 16px;
    padding: 12px 16px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    width: 220px;
    z-index: 20;
    line-height: 1.6;
}

#shortcuts-text h3 {
    margin-bottom: 8px;
    color: var(--primary-color);
}

#shortcuts-text ul {
    list-style-type: none;
    padding-left: 0;
}

#shortcuts-text li {
    margin-bottom: 6px;
}

#shortcuts-text strong {
    display: inline-block;
    min-width: 80px;
    color: #555;
}
</file>

<file path="src/js/view/TrestleView.js">
import { TreeNode } from './components/TreeNode.js';
import { DragDropHandler } from './components/DragDropHandler.js';
import { CardDetail } from './components/CardDetail.js';
import { ContextMenu } from './components/ContextMenu.js';
import { ExpanderButton } from './components/ExpanderButton.js';
import { InlineEditor } from './components/InlineEditor.js';
import { NodeSelector } from './components/NodeSelector.js';
import { HamburgerMenu } from './components/HamburgerMenu.js';
import { Breadcrumb } from './components/Breadcrumb.js';
import { RightPanel } from './components/RightPanel.js';

export default class TrestleView {
    constructor(rootElement, eventBus) {
        this.rootElement = rootElement;
        this.eventBus = eventBus;
        this.template = document.getElementById('entry-template');
        this.nodeElements = new Map();


        this.cardDetail = new CardDetail(eventBus);
        this.contextMenu = new ContextMenu(eventBus);


        const initRightPanel = () => {
            console.log('[TrestleView] Initializing RightPanel...');
            try {
                this.hamburgerMenu = new HamburgerMenu(document.getElementById('header-outer'), eventBus);
                this.rightPanel = new RightPanel(eventBus);
                console.log('[TrestleView] RightPanel initialized successfully');


                if (this.rightPanel) {
                    console.log('[TrestleView] RightPanel instance:', this.rightPanel);


                    setTimeout(() => {
                        console.log('[TrestleView] Sending test event to RightPanel');
                        eventBus.emit('test:rightpanel', { message: 'Test event from TrestleView' });
                    }, 1000);
                } else {
                    console.error('[TrestleView] Failed to initialize RightPanel');
                }
            } catch (error) {
                console.error('[TrestleView] Error initializing RightPanel:', error);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[TrestleView] DOMContentLoaded - Initializing components');
                setTimeout(initRightPanel, 100);
            });
        } else {
            console.log('[TrestleView] DOM already loaded - Initializing components');
            setTimeout(initRightPanel, 100);
        }
        this.nodeSelector = null;
        this.inlineEditor = null;
        this.expanderButton = null;
        this.dragDropHandler = null;



        this.currentZoomNodeId = null;
        this.breadcrumbNav = document.querySelector('.breadcrumb');
        this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);

        if (this.breadcrumbNav && this.eventBus) {
            this.breadcrumb = new Breadcrumb(this.breadcrumbNav, this.eventBus);
            this.breadcrumb.initialize();
            console.log('[CASCADE][TrestleView] Breadcrumb initialized:', this.breadcrumb);
        } else {
            this.breadcrumb = null;
            console.warn('[CASCADE][TrestleView] Breadcrumb NOT initialized. breadcrumbNav:', this.breadcrumbNav, 'eventBus:', this.eventBus);
        }
        if (this.breadcrumbNav) {
            this.breadcrumbNav.addEventListener('click', this.handleBreadcrumbClick);
        }


        this.setupEventListeners();


        document.addEventListener('keydown', (event) => {

            if (document.activeElement && document.activeElement.isContentEditable) return;
            if (!this.nodeSelector) return;
            const selectedNodeId = this.nodeSelector.selectedNodeId;
            if (!selectedNodeId) return;

            if ((event.key === 'Delete' || (event.ctrlKey && event.key.toLowerCase() === 'x'))) {
                event.preventDefault();
                this.eventBus.emit('view:deleteNode', { nodeId: selectedNodeId });
            } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
                event.preventDefault();
                this.eventBus.emit('view:duplicateNode', { nodeId: selectedNodeId });
            } else if (event.key === 'Tab') {
                event.preventDefault();
                if (event.shiftKey) {
                    this.eventBus.emit('view:outdentNode', { nodeId: selectedNodeId });
                } else {
                    this.eventBus.emit('view:indentNode', { nodeId: selectedNodeId });
                }
            } else if (event.key === 'ArrowUp') {
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.eventBus.emit('view:moveNodeUp', { nodeId: selectedNodeId });
                } else {
                    event.preventDefault();
                    this.eventBus.emit('view:navigateUp', { nodeId: selectedNodeId });
                }
            } else if (event.key === 'ArrowDown') {
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.eventBus.emit('view:moveNodeDown', { nodeId: selectedNodeId });
                } else {
                    event.preventDefault();
                    this.eventBus.emit('view:navigateDown', { nodeId: selectedNodeId });
                }
            }
        });
    }




    setupEventListeners() {

        this.eventBus.on('model:loaded', (data) => {
            console.log('[TrestleView] Model loaded:', data);
            if (data && data.nodes) {
                this.allNodes = {};
                for (const node of data.nodes) {
                    this.allNodes[node.id] = node;
                }
                this.renderTree();
                this.updateBreadcrumb();
            }
        });

        this.eventBus.on('model:created', (data) => {
            console.log('[TrestleView] Model created:', data);
            if (data && data.nodes) {
                this.allNodes = {};
                for (const node of data.nodes) {
                    this.allNodes[node.id] = node;
                }
                this.renderTree();
                this.updateBreadcrumb();
            }
        });


        this.eventBus.on('node:added', this.handleNodeAdded.bind(this));
        this.eventBus.on('node:updated', this.handleNodeUpdated.bind(this));
        this.eventBus.on('node:deleted', this.handleNodeDeleted.bind(this));


        this.eventBus.on('view:nodeIndented', this.handleNodeIndented.bind(this));
        this.eventBus.on('view:nodeOutdented', this.handleNodeOutdented.bind(this));


        this.eventBus.on('view:selectNode', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.selectNode(data.nodeId);
            }
        });

        this.eventBus.on('view:navigateUp', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.navigateUp(data.nodeId);
            }
        });

        this.eventBus.on('view:navigateDown', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.navigateDown(data.nodeId);
            }
        });

        this.eventBus.on('view:moveNodeUp', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.moveNodeUp(data.nodeId);
            }
        });

        this.eventBus.on('view:moveNodeDown', (data) => {
            if (this.nodeSelector) {
                this.nodeSelector.moveNodeDown(data.nodeId);
            }
        });


        console.log('[TrestleView] Event handlers set up');
    }







    renderTree(nodeId = null) {
        this.rootElement.innerHTML = '';
        this.nodeElements.clear();

        if (!this.allNodes) {
            console.warn('[CASCADE][TrestleView] this.allNodes is not set in renderTree, skipping render.');
            return;
        }
        const nodes = Object.values(this.allNodes);
        let rootNode = nodes.find(node => node.type === 'RootNode');
        if (!rootNode) {
            console.error('No root node found. Nodes available:', nodes);
            rootNode = nodes[0];
            if (!rootNode) return;
        }

        const tree = this.buildTreeStructure(Object.values(this.allNodes), rootNode.id);

        const rootUl = document.createElement('ul');
        rootUl.className = 'ts-root';
        this.rootElement.appendChild(rootUl);


        for (const childId of tree.children || []) {
            const childData = tree.nodes.get(childId);
            if (childData) {
                const treeNode = new TreeNode(childData, tree.nodes, this.eventBus, this.template);
                const childElement = treeNode.render(rootUl);
                if (childElement) {
                    this.nodeElements.set(childId, childElement);
                }
            }
        }


        this.nodeSelector = new NodeSelector(this.rootElement, this.nodeElements, this.eventBus);
        this.inlineEditor = new InlineEditor(this.rootElement, this.eventBus);
        this.expanderButton = new ExpanderButton(this.rootElement, this.eventBus);
        this.dragDropHandler = new DragDropHandler(this.rootElement, this.nodeElements, this.eventBus);
        this.dragDropHandler.initialize();


        ContextMenu.addContextualAddButtons(this.rootElement, this.eventBus);


        if (!(tree.children && tree.children.length)) {
            console.warn('No children found for root node. Rendering root node only.');
            const treeNode = new TreeNode(rootNode, tree.nodes, this.eventBus, this.template);
            const nodeElement = treeNode.render(rootUl);
            if (nodeElement) {
                this.nodeElements.set(rootNode.id, nodeElement);
            }
        }

        if (this.breadcrumb && this.eventBus) {
            let path = [];
            let nodeId = this.currentZoomNodeId || (rootNode && rootNode.id);
            while (nodeId && this.allNodes[nodeId]) {
                path.unshift(this.allNodes[nodeId]);
                nodeId = this.allNodes[nodeId].parent || null;
            }
            console.log('[CASCADE][TrestleView] Emitting breadcrumb:update with path:', path);
            this.eventBus.emit('breadcrumb:update', { node: { path } });
        }
    }







    buildTreeStructure(nodes, rootId) {
        const nodesMap = new Map();

        for (const node of nodes) {
            nodesMap.set(node.id, { ...node });
        }

        for (const node of nodesMap.values()) {
            if (node.children) {
                node.children = node.children.filter(childId => nodesMap.has(childId));
            } else {
                node.children = [];
            }
        }

        return {
            rootId,
            nodes: nodesMap,
            children: nodesMap.get(rootId)?.children || []
        };
    }





    handleNodeAdded(data) {
        const { node, parentId } = data;


        let parentElement;
        if (parentId === 'trestle-root') {
            parentElement = this.rootElement.querySelector('ul');


            const emptyState = parentElement.querySelector('.ts-empty-state');
            if (emptyState) {
                emptyState.remove();
            }
        } else {
            const parentLi = this.nodeElements.get(parentId);
            if (!parentLi) {
                console.error('Parent not found:', parentId);
                return;
            }


            let ul = parentLi.querySelector('ul');
            if (!ul) {
                ul = document.createElement('ul');
                parentLi.appendChild(ul);
                parentLi.classList.remove('ts-closed');
                parentLi.classList.add('ts-open');
            }

            parentElement = ul;
        }


        const insertAfterElement = this.findInsertPosition(parentElement, node.index);


        const nodesMap = new Map();
        nodesMap.set(node.id, node);


        const treeNode = new TreeNode(node, nodesMap, this.eventBus, this.template);


        if (insertAfterElement) {

            const tempContainer = document.createElement('div');
            const newNodeElement = treeNode.render(tempContainer);


            insertAfterElement.after(newNodeElement);


            this.nodeElements.set(node.id, newNodeElement);


            if (this.nodeSelector) {
                this.nodeSelector.selectNode(node.id);
            }


            setTimeout(() => {
                const titleElement = newNodeElement.querySelector('.ts-title');
                if (this.inlineEditor) {
                    this.inlineEditor.startEditing(titleElement);
                }
            }, 10);
        } else {

            const newNodeElement = treeNode.render(parentElement);

            if (newNodeElement) {
                this.nodeElements.set(node.id, newNodeElement);


                if (this.nodeSelector) {
                    this.nodeSelector.selectNode(node.id);
                }


                setTimeout(() => {
                    const titleElement = newNodeElement.querySelector('.ts-title');
                    if (this.inlineEditor) {
                        this.inlineEditor.startEditing(titleElement);
                    }
                }, 10);
            }
        }


        if (this.dragDropHandler) {
            this.dragDropHandler.initialize();
        }


        ContextMenu.addContextualAddButtons(this.rootElement, this.eventBus);
    }





    handleNodeUpdated(data) {
        const { nodeId, properties } = data;

        const nodeEntry = document.getElementById(nodeId);
        if (!nodeEntry) return;

        if (properties.title !== undefined) {
            const titleElement = nodeEntry.querySelector('.ts-title');
            titleElement.textContent = properties.title;
        }
    }





    handleNodeDeleted(data) {
        const { nodeId } = data;

        const nodeLi = this.nodeElements.get(nodeId);
        if (nodeLi) {
            const parent = nodeLi.parentElement;
            const isLastInList = parent.children.length === 1;

            nodeLi.remove();
            this.nodeElements.delete(nodeId);

            if (isLastInList && parent.classList.contains('ts-root')) {
                this.showEmptyState(parent);
            }
        }
    }





    handleNodeIndented(data) {
        const { nodeId, newParentId } = data;

        const nodeLi = this.nodeElements.get(nodeId);
        const newParentLi = this.nodeElements.get(newParentId);

        if (!nodeLi || !newParentLi) return;

        let parentUl = newParentLi.querySelector('ul');
        if (!parentUl) {
            parentUl = document.createElement('ul');
            newParentLi.appendChild(parentUl);
            newParentLi.classList.remove('ts-closed');
            newParentLi.classList.add('ts-open');
        }

        parentUl.appendChild(nodeLi);


        if (this.dragDropHandler) {
            this.dragDropHandler.initialize();
        }


        ContextMenu.addContextualAddButtons(this.rootElement, this.eventBus);
    }





    handleNodeOutdented(data) {
        const { nodeId, newParentId } = data;

        const nodeLi = this.nodeElements.get(nodeId);
        if (!nodeLi) return;

        const oldParentLi = nodeLi.parentElement.closest('li');
        if (!oldParentLi) return;

        let newParentList;
        if (newParentId === 'trestle-root') {
            newParentList = this.rootElement.querySelector('ul');
        } else {
            const newParentLi = this.nodeElements.get(newParentId);
            if (!newParentLi) return;

            newParentList = newParentLi.parentElement;
        }

        if (!newParentList) return;

        if (oldParentLi.nextElementSibling) {
            newParentList.insertBefore(nodeLi, oldParentLi.nextElementSibling);
        } else {
            newParentList.appendChild(nodeLi);
        }


        if (this.dragDropHandler) {
            this.dragDropHandler.initialize();
        }


        ContextMenu.addContextualAddButtons(this.rootElement, this.eventBus);
    }







    findInsertPosition(parentElement, index) {
        if (index === undefined || index <= 0 || !parentElement) {
            return null;
        }


        const children = Array.from(parentElement.children);


        if (children.length < index) {
            return null;
        }


        return children[index - 1];
    }





    showEmptyState(container) {
        const emptyState = document.createElement('li');
        emptyState.className = 'ts-empty-state';

        const emptyText = document.createElement('div');
        emptyText.className = 'ts-empty-text';
        emptyText.textContent = 'Click to add your first item';
        emptyText.addEventListener('click', () => {
            this.eventBus.emit('view:addRootItem', {});
        });

        emptyState.appendChild(emptyText);
        container.appendChild(emptyState);
    }

    zoomInToNode(nodeId) {
        if (!nodeId || !this.allNodes[nodeId]) return;
        this.rootElement.innerHTML = '';
        this.nodeElements.clear();
        const tree = this.buildTreeStructure(Object.values(this.allNodes), nodeId);
        const rootUl = document.createElement('ul');
        rootUl.className = 'ts-root';
        this.rootElement.appendChild(rootUl);
        for (const childId of tree.children || []) {
            const childData = tree.nodes.get(childId);
            if (childData) {
                const treeNode = new TreeNode(childData, tree.nodes, this.eventBus, this.template);
                const childElement = treeNode.render(rootUl);
                if (childElement) {
                    this.nodeElements.set(childId, childElement);
                }
            }
        }
        this.currentZoomNodeId = nodeId;

        if (this.breadcrumb && this.eventBus) {
            let path = [];
            let nodeId = this.currentZoomNodeId;
            while (nodeId && this.allNodes[nodeId]) {
                path.unshift(this.allNodes[nodeId]);
                nodeId = this.allNodes[nodeId].parent || null;
            }
            console.log('[CASCADE][TrestleView] Emitting breadcrumb:update with path:', path);
            this.eventBus.emit('breadcrumb:update', { node: { path } });
        }
        this.updateBreadcrumb();
    }

    zoomOutToNode(nodeId) {
        if (nodeId === null || nodeId === '') {
            this.currentZoomNodeId = null;
            this.eventBus.emit('model:loaded', { nodes: Object.values(this.allNodes) });
        } else {
            this.zoomInToNode(nodeId);
        }
    }

    updateBreadcrumb() {
















    }

    _makeBreadcrumbLink(node, nodeId) {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'breadcrumb-link';
        a.textContent = node.title || '(untitled)';
        a.dataset.nodeId = nodeId || '';
        return a;
    }

    _makeBreadcrumbSeparator() {
        const sep = document.createElement('span');
        sep.className = 'breadcrumb-separator';
        sep.textContent = '>';
        return sep;
    }

    handleBreadcrumbClick(event) {
        if (event.target.classList.contains('breadcrumb-link')) {
            event.preventDefault();
            const nodeId = event.target.dataset.nodeId || null;
            this.zoomOutToNode(nodeId);
        }
    }
}

export { TrestleView };
</file>

</files>
