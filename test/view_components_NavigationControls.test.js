import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NavigationControls } from '../src/js/view/components/NavigationControls.js';
import { EventBus } from 'evb';

describe('NavigationControls', () => {
  let navigationControls;
  let mockElement;
  let eventBus;
  let backButton;
  let forwardButton;
  let homeButton;

  beforeEach(() => {
    // Reset the DOM before each test
    document.body.innerHTML = `
      <div id="test-root">
        <button id="backButton" aria-label="Back" disabled></button>
        <button id="forwardButton" aria-label="Forward" disabled></button>
        <button id="homeButton" aria-label="Home"></button>
      </div>
    `;
    
    eventBus = new EventBus();
    mockElement = document.getElementById('test-root');
    backButton = document.getElementById('backButton');
    forwardButton = document.getElementById('forwardButton');
    homeButton = document.getElementById('homeButton');
    
    navigationControls = new NavigationControls(mockElement, eventBus);
  });

  it('should be defined', () => {
    expect(NavigationControls).toBeDefined();
  });

  it('should initialize with back and forward buttons disabled', () => {
    expect(backButton.disabled).toBe(true);
    expect(forwardButton.disabled).toBe(true);
  });

  it('should enable back button when navigating forward', () => {
    // Simulate navigation to a new node
    navigationControls.navigateTo('node1');
    // Initial navigation doesn't enable back button (only one item in history)
    expect(backButton.disabled).toBe(true);
    
    // Second navigation should enable back button
    navigationControls.navigateTo('node2');
    expect(backButton.disabled).toBe(false);
    expect(forwardButton.disabled).toBe(true);
  });

  it('should enable forward button after going back', () => {
    // Need at least two navigations to have history
    navigationControls.navigateTo('node1');
    navigationControls.navigateTo('node2');
    
    // Go back
    backButton.click();
    
    // After going back, back button should be disabled (at start of history)
    // and forward button should be enabled
    expect(backButton.disabled).toBe(true);
    expect(forwardButton.disabled).toBe(false);
  });

  it('should emit navigate event with nodeId when back button is clicked', () => {
    const eventSpy = vi.spyOn(eventBus, 'emit');
    
    // Need at least one navigation to enable back button
    navigationControls.navigateTo('node1');
    navigationControls.navigateTo('node2');
    backButton.click();
    
    expect(eventSpy).toHaveBeenCalledWith('navigate', { nodeId: 'node1' });
    eventSpy.mockRestore();
  });

  it('should emit view:navigateForward event when forward button is clicked', () => {
    const eventSpy = vi.spyOn(eventBus, 'emit');
    
    // Need to navigate and go back to enable forward button
    navigationControls.navigateTo('node1');
    navigationControls.navigateTo('node2');
    backButton.click();
    
    // Clear the mock to only track the forward click
    eventSpy.mockClear();
    
    forwardButton.click();
    
    expect(eventSpy).toHaveBeenCalledWith('view:navigateForward', { nodeId: 'node2' });
    eventSpy.mockRestore();
  });

  it('should emit navigateHome event when home button is clicked', () => {
    const eventSpy = vi.spyOn(eventBus, 'emit');
    
    homeButton.click();
    
    expect(eventSpy).toHaveBeenCalledWith('view:navigateHome');
    eventSpy.mockRestore();
  });

  it('should update history when navigating to a new node', () => {
    navigationControls.navigateTo('node1');
    navigationControls.navigateTo('node2');
    
    // Initial state: [node1, node2*] (current at node2)
    expect(navigationControls.canGoBack()).toBe(true);
    expect(navigationControls.canGoForward()).toBe(false);
    
    // Go back to node1
    backButton.click();
    expect(navigationControls.canGoBack()).toBe(false);
    expect(navigationControls.canGoForward()).toBe(true);
    
    // Navigate to node3 (should clear forward history)
    navigationControls.navigateTo('node3');
    expect(navigationControls.canGoBack()).toBe(true);
    expect(navigationControls.canGoForward()).toBe(false);
  });

  it('should handle maximum history size', () => {
    // Default max history is 50
    for (let i = 0; i < 60; i++) {
      navigationControls.navigateTo(`node${i}`);
    }
    
    // Should have maxHistorySize items in history
    expect(navigationControls.history.length).toBe(50);
    expect(navigationControls.history[0]).toBe('node10'); // First item should be the 10th node (60 - 50)
    expect(navigationControls.history[49]).toBe('node59'); // Last item should be the most recent
  });
});
