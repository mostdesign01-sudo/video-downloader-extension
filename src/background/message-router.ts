import type { Message } from '../shared/types';
import { getStreams, getStreamsByTab } from './storage';
import { startDownload, cancelDownload } from './download-manager';

export function setupMessageRouter(): void {
  chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    handleMessage(message, sender).then(sendResponse).catch((err) => {
      sendResponse({ error: err.message });
    });
    return true; // Keep channel open for async response
  });
}

async function handleMessage(
  message: Message,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  switch (message.type) {
    case 'GET_STREAMS': {
      const tabId = sender.tab?.id;
      if (tabId !== undefined) {
        return getStreamsByTab(tabId);
      }
      return getStreams();
    }

    case 'START_DOWNLOAD': {
      const { stream, filename } = message.payload;
      return startDownload(stream, filename);
    }

    case 'CANCEL_DOWNLOAD': {
      return cancelDownload(message.payload.streamId);
    }

    case 'TAB_UPDATED': {
      return { success: true };
    }

    default:
      return { error: 'Unknown message type' };
  }
}