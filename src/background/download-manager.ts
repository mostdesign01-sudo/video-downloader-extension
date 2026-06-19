import type { VideoStream, DownloadProgress } from '../shared/types';
import { getFilenameFromUrl } from '../shared/utils';
import { MAX_FILE_SIZE_WARNING, OFFSCREEN_DOCUMENT_PATH } from '../shared/constants';

const activeDownloads = new Map<string, { streamId: string; controller?: AbortController }>();
const offscreenCreating: Promise<void> | null = null;

async function ensureOffscreenDocument(): Promise<void> {
  const existingClients = await chrome.offscreen.hasDocument?.();
  if (!existingClients) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: ['BLOB_READERS' as chrome.offscreen.Reason],
      justification: 'Download and process video streams',
    });
  }
}

export async function startDownload(
  stream: VideoStream,
  filename?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const downloadId = stream.id;
    const outputFilename = filename || getFilenameFromUrl(stream.url, stream.type);

    if (stream.type === 'mp4' || stream.type === 'webm') {
      // Simple direct download
      const downloadItemId = await chrome.downloads.download({
        url: stream.url,
        filename: outputFilename,
        saveAs: true,
      });

      activeDownloads.set(downloadId, { streamId: stream.id });

      // Report progress
      broadcastProgress({
        streamId: stream.id,
        status: 'completed',
        progress: 100,
        downloadedBytes: 0,
        totalBytes: 0,
      });

      return { success: true };
    }

    if (stream.type === 'm3u8') {
      // Complex m3u8 download via offscreen document
      await ensureOffscreenDocument();

      const controller = new AbortController();
      activeDownloads.set(downloadId, { streamId: stream.id, controller });

      // Send download command to offscreen document
      chrome.runtime.sendMessage({
        type: 'START_DOWNLOAD',
        payload: {
          stream,
          filename: outputFilename,
        },
      });

      broadcastProgress({
        streamId: stream.id,
        status: 'downloading',
        progress: 0,
        downloadedBytes: 0,
        totalBytes: 0,
      });

      return { success: true };
    }

    return { success: false, error: `Unsupported stream type: ${stream.type}` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function cancelDownload(streamId: string): Promise<{ success: boolean }> {
  const download = activeDownloads.get(streamId);
  if (download?.controller) {
    download.controller.abort();
  }
  activeDownloads.delete(streamId);

  // Notify offscreen document
  chrome.runtime.sendMessage({
    type: 'CANCEL_DOWNLOAD',
    payload: { streamId },
  }).catch(() => {});

  broadcastProgress({
    streamId,
    status: 'cancelled',
    progress: 0,
    downloadedBytes: 0,
    totalBytes: 0,
  });

  return { success: true };
}

export function broadcastProgress(progress: DownloadProgress): void {
  chrome.runtime.sendMessage({
    type: 'DOWNLOAD_PROGRESS',
    payload: progress,
  }).catch(() => {
    // Popup may not be open, which is fine
  });
}

// Listen for progress updates from offscreen document
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'DOWNLOAD_PROGRESS') {
    broadcastProgress(message.payload);
  } else if (message.type === 'DOWNLOAD_COMPLETE') {
    const { blobUrl, filename } = message.payload;
    if (blobUrl) {
      chrome.downloads.download({
        url: blobUrl,
        filename,
        saveAs: true,
      });
    }
    broadcastProgress({
      streamId: message.payload.streamId,
      status: 'completed',
      progress: 100,
      downloadedBytes: 0,
      totalBytes: 0,
    });
    activeDownloads.delete(message.payload.streamId);
  } else if (message.type === 'DOWNLOAD_ERROR') {
    broadcastProgress({
      streamId: message.payload.streamId,
      status: 'error',
      progress: 0,
      downloadedBytes: 0,
      totalBytes: 0,
      error: message.payload.error,
    });
    activeDownloads.delete(message.payload.streamId);
  }
});

// Clean up on tab close
chrome.tabs.onRemoved.addListener((tabId) => {
  for (const [id, download] of activeDownloads) {
    // If downloads are tracked per tab, clean up here
  }
});