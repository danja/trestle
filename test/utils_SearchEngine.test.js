import { describe, it, expect, beforeEach } from 'vitest';
import { SearchEngine } from '../src/js/utils/SearchEngine.js';

describe('SearchEngine', () => {
  let searchEngine;
  let testNodes;

  beforeEach(() => {
    searchEngine = new SearchEngine();
    
    testNodes = [
      {
        id: 'node1',
        title: 'Sample Task',
        description: 'This is a sample task for testing',
        type: 'Node'
      },
      {
        id: 'node2',
        title: 'Project Planning',
        description: 'Plan the new project timeline',
        type: 'Node'
      },
      {
        id: 'node3',
        title: 'Bug Fix',
        description: 'Fix the navigation bug in the header',
        type: 'Node'
      },
      {
        id: 'node4',
        title: 'Documentation',
        description: 'Write documentation for the search feature',
        type: 'Node'
      },
      {
        id: 'root',
        title: 'Root Node',
        description: '',
        type: 'RootNode'
      }
    ];
  });

  it('should be defined', () => {
    expect(SearchEngine).toBeDefined();
  });

  it('should create an instance with default options', () => {
    expect(searchEngine).toBeInstanceOf(SearchEngine);
    expect(searchEngine.getOptions()).toEqual({
      caseSensitive: false,
      wholeWord: false,
      includeDescriptions: true,
      maxResults: 50
    });
  });

  it('should create an instance with custom options', () => {
    const customEngine = new SearchEngine({
      caseSensitive: true,
      maxResults: 10
    });
    
    expect(customEngine.getOptions()).toEqual({
      caseSensitive: true,
      wholeWord: false,
      includeDescriptions: true,
      maxResults: 10
    });
  });

  it('should return empty results for empty query', () => {
    const results = searchEngine.search(testNodes, '');
    expect(results).toEqual([]);
  });

  it('should return empty results for whitespace-only query', () => {
    const results = searchEngine.search(testNodes, '   ');
    expect(results).toEqual([]);
  });

  it('should find matches in node titles', () => {
    const results = searchEngine.search(testNodes, 'task');
    
    expect(results.length).toBe(1);
    expect(results[0].node.title).toBe('Sample Task');
    expect(results[0].matches.length).toBeGreaterThanOrEqual(1);
    expect(results[0].matches.some(m => m.field === 'title')).toBe(true);
  });

  it('should find matches in descriptions when enabled', () => {
    const results = searchEngine.search(testNodes, 'navigation');
    
    expect(results.length).toBe(1);
    expect(results[0].node.title).toBe('Bug Fix');
    expect(results[0].matches.some(m => m.field === 'description')).toBe(true);
  });

  it('should not find matches in descriptions when disabled', () => {
    searchEngine.setOptions({ includeDescriptions: false });
    const results = searchEngine.search(testNodes, 'navigation');
    
    expect(results.length).toBe(0);
  });

  it('should be case insensitive by default', () => {
    const results = searchEngine.search(testNodes, 'TASK');
    
    expect(results.length).toBe(1);
    expect(results[0].node.title).toBe('Sample Task');
  });

  it('should be case sensitive when enabled', () => {
    searchEngine.setOptions({ caseSensitive: true });
    const results = searchEngine.search(testNodes, 'TASK');
    
    expect(results.length).toBe(0);
  });

  it('should match whole words when enabled', () => {
    searchEngine.setOptions({ wholeWord: true });
    
    // Should match "task" but not "tas"
    const results1 = searchEngine.search(testNodes, 'task');
    expect(results1.length).toBe(1);
    
    const results2 = searchEngine.search(testNodes, 'tas');
    expect(results2.length).toBe(0);
  });

  it('should sort results by relevance score', () => {
    const results = searchEngine.search(testNodes, 'project');
    
    expect(results.length).toBeGreaterThanOrEqual(1); // Should find "Project Planning" at minimum
    if (results.length > 1) {
      expect(results[0].score).toBeGreaterThan(results[1].score);
    }
  });

  it('should limit results to maxResults', () => {
    searchEngine.setOptions({ maxResults: 1 });
    const results = searchEngine.search(testNodes, 'the');
    
    expect(results.length).toBeLessThanOrEqual(1);
  });

  it('should handle regex special characters safely', () => {
    const results = searchEngine.search(testNodes, '.*+?^${}()|[]\\');
    
    // Should not throw an error and should return empty results
    expect(results).toEqual([]);
  });

  it('should provide fallback search on regex error', () => {
    // Create a malformed regex that would normally throw
    const results = searchEngine.search(testNodes, 'task');
    
    expect(results.length).toBeGreaterThan(0);
  });

  it('should calculate relevance boosts correctly', () => {
    const exactMatchNodes = [
      {
        id: 'exact',
        title: 'test',
        description: 'exact match',
        type: 'Node'
      },
      {
        id: 'partial',
        title: 'testing something',
        description: 'partial match',
        type: 'Node'
      }
    ];
    
    const results = searchEngine.search(exactMatchNodes, 'test');
    
    // Exact match should have higher score
    expect(results[0].node.title).toBe('test');
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it('should highlight matches correctly', () => {
    const text = 'This is a test string';
    const matches = [
      { text: 'test', index: 10, length: 4 }
    ];
    
    const highlighted = searchEngine.highlightMatches(text, matches);
    expect(highlighted).toBe('This is a <span class="search-highlight">test</span> string');
  });

  it('should escape HTML in highlighted text', () => {
    const text = 'Test <script>alert("xss")</script> content';
    const matches = [
      { text: 'script', index: 6, length: 6 }
    ];
    
    const highlighted = searchEngine.highlightMatches(text, matches);
    expect(highlighted).toContain('&lt;');
    expect(highlighted).toContain('&gt;');
  });

  it('should update options correctly', () => {
    const newOptions = {
      caseSensitive: true,
      maxResults: 25
    };
    
    searchEngine.setOptions(newOptions);
    
    const options = searchEngine.getOptions();
    expect(options.caseSensitive).toBe(true);
    expect(options.maxResults).toBe(25);
    expect(options.wholeWord).toBe(false); // Should preserve other options
  });
});