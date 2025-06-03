/**
 * EventLogger utility class for logging all events on the event bus
 */
import log from 'loglevel';

export class EventLogger {
  /**
   * Create a new EventLogger instance
   * @param {EventBus} eventBus - The event bus to monitor
   * @param {Object} [options] - Configuration options
   * @param {string} [options.loggerName='EventLogger'] - Name for the logger
   * @param {string} [options.logLevel='debug'] - Log level to use
   * @param {Array<string>} [options.ignorePatterns=[]] - Event name patterns to ignore
   */
  constructor(eventBus, options = {}) {
    this.eventBus = eventBus;
    this.options = {
      loggerName: 'EventLogger',
      logLevel: 'debug',
      ignorePatterns: [],
      ...options
    };

    // Initialize logger
    this.logger = log.getLogger(this.options.loggerName);
    this.logger.setLevel(this.options.logLevel);

    // Store original emit method
    this.originalEmit = this.eventBus.emit;

    // Bind methods
    this.handleEvent = this.handleEvent.bind(this);

    // Initialize the logger
    this.initialize();
  }

  /**
   * Initialize the event logger by wrapping the event bus emit method
   */
  initialize() {
    // Log initialization
    this.logger.debug('Initializing EventLogger');

    // Wrap the emit method to log all events
    this.eventBus.emit = (eventName, ...args) => {
      // Log the event before it's processed by other listeners
      this.handleEvent(eventName, args);

      // Call the original emit method
      return this.originalEmit.call(this.eventBus, eventName, ...args);
    };

    this.logger.debug('EventLogger initialized and listening to events');
  }

  /**
   * Handle an event by logging it
   * @param {string} eventName - The name of the event
   * @param {Array} args - The event arguments
   * @private
   */
  handleEvent(eventName, args) {
    // Skip ignored patterns
    if (this.shouldIgnoreEvent(eventName)) {
      return;
    }

    try {
      // Format the event data for logging
      const formattedArgs = this.formatEventData(args);

      // Log the event to the browser console
      this.logger.debug(`[${eventName}]`, ...formattedArgs);

      // Also emit to the in-app console panel if available
      if (this.eventBus && typeof this.eventBus.emit === 'function') {
        // Avoid infinite loop: don't emit for console: events
        if (!eventName.startsWith('console:')) {
          // Compose a readable message
          const msg = `[${eventName}] ${formattedArgs.join(' ')}`;
          this.eventBus.emit('console:debug', msg);
        }
      }
    } catch (error) {
      this.logger.error(`Error logging event ${eventName}:`, error);
    }
  }

  /**
   * Check if an event should be ignored based on its name
   * @param {string} eventName - The event name to check
   * @returns {boolean} True if the event should be ignored
   * @private
   */
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

  /**
   * Format event data for logging
   * @param {Array} args - The event arguments
   * @returns {Array} Formatted arguments for logging
   * @private
   */
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
      // Handle DOM elements
      if (typeof window !== 'undefined' && window.HTMLElement && arg instanceof window.HTMLElement) {
        return arg.outerHTML || String(arg);
      }
      // For objects and arrays, try to stringify with circular ref protection
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

  /**
   * Clean up by restoring the original emit method
   */
  destroy() {
    if (this.eventBus && this.originalEmit) {
      this.eventBus.emit = this.originalEmit;
      this.logger.debug('EventLogger destroyed');
    }
  }
}

export default EventLogger;
