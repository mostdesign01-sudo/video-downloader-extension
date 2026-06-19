import { downloadSegments } from './segment-downloader';
import { remuxToMP4 } from './ts-remuxer';
import type { StartDownloadMessage, CancelDownloadMessage } from '../shared/types';
import { parseM3u8, selectBestVariant } from '../background/m3u8-parser';
import { getFilenameFromUrl } from '../shared/utils';

let currentAbortController: AbortController | null = null;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'START_DOWNLOAD') {
    handleStartDownload(message as StartDownloadMessage).catch((err) => {
      chrome.runtime.sendMessage({
        type: 'DOWNLOAD_ERROR',
        payload: {
          streamId: message.payload.stream.id,
          error: err.message || 'Download failed',
        },
      });
    });
    sendResponse({ success: true });
  } else if (message.type === 'CANCEL_DOWNLOAD') {
    const cancelMsg = message as CancelDownloadMessage;
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }
    sendResponse({ success: true });
  }
  return true;
});

async function handleStartDownload(message: StartDownloadMessage): Promise<void> {
  const { stream, filename } = message.payload;
  const streamId = stream.id;

  currentAbortController = new AbortController();
  const signal = currentAbortController.signal;

  try {
    // Step 1: Fetch and parse m3u8
    chrome.runtime.sendMessage({
      type: 'DOWNLOAD_PROGRESS',
      payload: {
        streamId,
        status: 'downloading',
        progress: 0,
        downloadedBytes: 0,
        totalBytes: 0,
      },
    });

    const response = await fetch(stream.url, { signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch m3u8: ${response.status} ${response.statusText}`);
    }

    const m3u8Content = await response.text();
    const playlist = parseM3u8(m3u8Content, stream.url);

    let targetUrl: string;
    let outputFilename = filename || getFilenameFromUrl(stream.url, 'm3u8');

    if (playlist.isMaster && playlist.variants.length > 0) {
      // Select best quality variant
      const bestVariant = selectBestVariant(playlist.variants);
      targetUrl = bestVariant.url;

      // Re-fetch the media playlist
      const variantResponse = await fetch(targetUrl, { signal });
      if (!variantResponse.ok) {
        throw new Error(`Failed to fetch variant playlist: ${variantResponse.status}`);
      }
      const variantContent = await variantResponse.text();
      const mediaPlaylist = parseM3u8(variantContent, targetUrl);

      if (mediaPlaylist.segments.length === 0) {
        throw new Error('No segments found in playlist');
      }

      await downloadAndRemux(mediaPlaylist, streamId, outputFilename, signal);
    } else if (playlist.segments.length > 0) {
      await downloadAndRemux(playlist, streamId, outputFilename, signal);
    } else {
      throw new Error('No playable content found in playlist');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return; // Cancelled, no error needed
    }
    throw err;
  }
}

async function downloadAndRemux(
  playlist: { segments: Array<{ url: string; duration: number }> },
  streamId: string,
  filename: string,
  signal: AbortSignal,
): Promise<void> {
  // Step 2: Download all TS segments
  const segments = await downloadSegments(playlist.segments, streamId, signal);

  // Step 3: Remux TS to MP4
  chrome.runtime.sendMessage({
    type: 'DOWNLOAD_PROGRESS',
    payload: {
      streamId,
      status: 'remuxing',
      progress: 80,
      downloadedBytes: segments.reduce((sum, s) => sum + s.byteLength, 0),
      totalBytes: segments.reduce((sum, s) => sum + s.byteLength, 0),
    },
  });

  const mp4Blob = await remuxToMP4(segments);

  // Step 4: Create blob URL and trigger download
  const blobUrl = URL.createObjectURL(mp4Blob);

  chrome.runtime.sendMessage({
    type: 'DOWNLOAD_COMPLETE',
    payload: {
      streamId,
      blobUrl,
      filename,
    },
  });

  // Clean up blob URL after a delay
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}