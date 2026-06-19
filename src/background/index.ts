import { setupStreamDetector } from './stream-detector';
import { setupMessageRouter } from './message-router';
import { clearTabStreams } from './storage';

// Initialize stream detection
setupStreamDetector();

// Initialize message routing
setupMessageRouter();

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  clearTabStreams(tabId);
});

// Log that the service worker is active
console.log('[Video Downloader] Service worker initialized');