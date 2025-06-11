/**
 * SearchEngine class
 * Provides extensible search functionality with regex matching
 * Can be easily swapped out for other search implementations
 */
export class SearchEngine {
  /**
   * Create a new SearchEngine
   * @param {Object} options - Configuration options
   * @param {boolean} [options.caseSensitive=false] - Whether search should be case sensitive
   * @param {boolean} [options.wholeWord=false] - Whether to match whole words only
   * @param {boolean} [options.includeDescriptions=true] - Whether to search in descriptions
   * @param {number} [options.maxResults=50] - Maximum number of results to return
   */
  constructor(options = {}) {
    this.options = {
      caseSensitive: false,
      wholeWord: false,
      includeDescriptions: true,
      maxResults: 50,
      ...options
    };
  }

  /**
   * Search through a collection of nodes
   * @param {Array} nodes - Array of node objects to search
   * @param {string} query - Search query string
   * @returns {Array} Array of search results with relevance scores
   */
  search(nodes, query) {
    if (!query || !query.trim()) {
      return [];
    }

    try {
      const regex = this.buildRegex(query);
      const results = [];

      for (const node of nodes) {
        const matchResult = this.matchNode(node, regex, query);
        if (matchResult) {
          results.push(matchResult);
        }
      }

      // Sort by relevance score (higher is better)
      results.sort((a, b) => b.score - a.score);

      // Limit results
      return results.slice(0, this.options.maxResults);
    } catch (error) {
      console.warn('Search error:', error.message);
      // Fallback to simple string matching if regex fails
      return this.fallbackSearch(nodes, query);
    }
  }

  /**
   * Build a regex pattern from the search query
   * @param {string} query - The search query
   * @returns {RegExp} The compiled regex pattern
   */
  buildRegex(query) {
    // Escape special regex characters for safety
    let escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Handle whole word matching
    if (this.options.wholeWord) {
      escapedQuery = `\\b${escapedQuery}\\b`;
    }

    // Build flags
    const flags = this.options.caseSensitive ? 'g' : 'gi';

    return new RegExp(escapedQuery, flags);
  }

  /**
   * Match a single node against the search regex
   * @param {Object} node - The node to match
   * @param {RegExp} regex - The search regex
   * @param {string} originalQuery - The original query string
   * @returns {Object|null} Match result with score, or null if no match
   */
  matchNode(node, regex, originalQuery) {
    const matches = [];
    let totalScore = 0;

    // Search in title
    if (node.title) {
      const titleMatches = this.findMatches(node.title, regex);
      if (titleMatches.length > 0) {
        matches.push({
          field: 'title',
          text: node.title,
          matches: titleMatches,
          score: titleMatches.length * 10 // Title matches are weighted higher
        });
        totalScore += titleMatches.length * 10;
      }
    }

    // Search in description if enabled
    if (this.options.includeDescriptions && node.description) {
      const descMatches = this.findMatches(node.description, regex);
      if (descMatches.length > 0) {
        matches.push({
          field: 'description',
          text: node.description,
          matches: descMatches,
          score: descMatches.length * 5 // Description matches are weighted lower
        });
        totalScore += descMatches.length * 5;
      }
    }

    if (matches.length === 0) {
      return null;
    }

    // Calculate additional relevance factors
    const relevanceBoost = this.calculateRelevanceBoost(node, originalQuery);
    totalScore += relevanceBoost;

    return {
      node: {
        id: node.id,
        title: node.title,
        description: node.description,
        parent: node.parent,
        type: node.type
      },
      matches,
      score: totalScore,
      query: originalQuery
    };
  }

  /**
   * Find all matches in a text string
   * @param {string} text - The text to search in
   * @param {RegExp} regex - The search regex
   * @returns {Array} Array of match objects
   */
  findMatches(text, regex) {
    const matches = [];
    let match;

    // Reset regex to start from beginning
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        index: match.index,
        length: match[0].length
      });

      // Prevent infinite loop on global regex with zero-length matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }

    return matches;
  }

  /**
   * Calculate relevance boost based on various factors
   * @param {Object} node - The node being matched
   * @param {string} query - The search query
   * @returns {number} Relevance boost score
   */
  calculateRelevanceBoost(node, query) {
    let boost = 0;

    // Boost for exact matches
    if (node.title && node.title.toLowerCase() === query.toLowerCase()) {
      boost += 20;
    }

    // Boost for matches at the beginning of title
    if (node.title && node.title.toLowerCase().startsWith(query.toLowerCase())) {
      boost += 10;
    }

    // Boost for shorter titles (more specific matches)
    if (node.title && node.title.length < 50) {
      boost += 5;
    }

    return boost;
  }

  /**
   * Fallback search using simple string matching
   * @param {Array} nodes - Array of nodes to search
   * @param {string} query - Search query
   * @returns {Array} Array of search results
   */
  fallbackSearch(nodes, query) {
    const lowerQuery = query.toLowerCase();
    const results = [];

    for (const node of nodes) {
      let score = 0;
      const matches = [];

      // Check title
      if (node.title && node.title.toLowerCase().includes(lowerQuery)) {
        matches.push({
          field: 'title',
          text: node.title,
          matches: [{ text: query, index: node.title.toLowerCase().indexOf(lowerQuery) }]
        });
        score += 10;
      }

      // Check description
      if (this.options.includeDescriptions && node.description && 
          node.description.toLowerCase().includes(lowerQuery)) {
        matches.push({
          field: 'description',
          text: node.description,
          matches: [{ text: query, index: node.description.toLowerCase().indexOf(lowerQuery) }]
        });
        score += 5;
      }

      if (matches.length > 0) {
        results.push({
          node: {
            id: node.id,
            title: node.title,
            description: node.description,
            parent: node.parent,
            type: node.type
          },
          matches,
          score,
          query
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, this.options.maxResults);
  }

  /**
   * Update search options
   * @param {Object} newOptions - New options to merge
   */
  setOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current search options
   * @returns {Object} Current options
   */
  getOptions() {
    return { ...this.options };
  }

  /**
   * Create highlighted text with search matches
   * @param {string} text - Original text
   * @param {Array} matches - Array of match objects
   * @param {string} highlightClass - CSS class for highlighting
   * @returns {string} HTML string with highlighted matches
   */
  highlightMatches(text, matches, highlightClass = 'search-highlight') {
    if (!matches || matches.length === 0) {
      return this.escapeHtml(text);
    }

    // Sort matches by index to process them in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    
    let result = '';
    let lastIndex = 0;

    for (const match of sortedMatches) {
      // Add text before the match
      if (match.index > lastIndex) {
        result += this.escapeHtml(text.slice(lastIndex, match.index));
      }

      // Add highlighted match
      result += `<span class="${highlightClass}">${this.escapeHtml(match.text)}</span>`;
      lastIndex = match.index + match.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result += this.escapeHtml(text.slice(lastIndex));
    }

    return result;
  }

  /**
   * Escape HTML characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default SearchEngine;