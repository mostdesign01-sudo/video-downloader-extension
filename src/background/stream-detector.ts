import type { StreamDetectedMessage } from '../shared/types';
import { detectStreamType, generateId } from '../shared/utils';
import { addStream } from './storage';

const VIDEO_EXTENSIONS = ['.m3u8', '.mp4', '.webm', '.mpd', '.ts', '.m4v', '.mkv', '.mov', '.flv', '.avi', '.ogv'];
const VIDEO_CONTENT_TYPES = ['video/', 'application/vnd.apple.mpegurl', 'application/x-mpegurl', 'application/dash+xml'];

export function setupStreamDetector(): void {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      // Only check main_frame, sub_frame, xmlhttprequest, and media types
      if (details.tabId < 0) return;

      const url = details.url;
      if (!url || url.startsWith('chrome-extension://')) return;

      handleDetectedUrl(url, details.tabId, 'webRequest');
    },
    {
      urls: ['<all_urls>'],
      types: ['main_frame', 'sub_frame', 'xmlhttprequest', 'media', 'other'],
    },
  );

  // Listen for stream detection from content scripts
  chrome.runtime.onMessage.addListener((message, sender, _sendResponse) => {
    if (message.type === 'STREAM_DETECTED' && sender.tab?.id) {
      const msg = message as StreamDetectedMessage;
      handleDetectedUrl(msg.payload.url, sender.tab.id, 'dom');
    }
    // Return false for async (we handle synchronously)
    return false;
  });
}

async function handleDetectedUrl(
  url: string,
  tabId: number,
  source: 'dom' | 'webRequest',
): Promise<void> {
  try {
    const type = detectStreamType(url);
    if (type === 'unknown') return;

    const tab = await chrome.tabs.get(tabId).catch(() => null);
    if (!tab?.url) return;

    const streamId = generateId();

    await addStream({
      id: streamId,
      url,
      type,
      source,
      title: type === 'm3u8' ? 'HLS Stream' : `${type.toUpperCase()} Video`,
      size: '',
      tabId,
      pageUrl: tab.url,
      pageTitle: tab.title || '',
      timestamp: Date.now(),
    });
  } catch {
    // Silently ignore errors
  }
}