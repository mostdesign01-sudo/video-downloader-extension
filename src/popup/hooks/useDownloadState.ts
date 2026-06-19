import { useState, useEffect, useCallback } from 'react';
import type { VideoStream, DownloadProgress } from '../../shared/types';

interface DownloadState {
  downloads: Map<string, DownloadProgress>;
  startDownload: (stream: VideoStream) => Promise<void>;
  cancelDownload: (streamId: string) => Promise<void>;
}

export function useDownloadState(): DownloadState {
  const [downloads, setDownloads] = useState<Map<string, DownloadProgress>>(new Map());

  useEffect(() => {
    const handleMessage = (message: { type: string; payload: DownloadProgress }) => {
      if (message.type === 'DOWNLOAD_PROGRESS') {
        setDownloads((prev) => {
          const next = new Map(prev);
          next.set(message.payload.streamId, message.payload);
          return next;
        });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const startDownload = useCallback(async (stream: VideoStream) => {
    try {
      await chrome.runtime.sendMessage({
        type: 'START_DOWNLOAD',
        payload: { stream },
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start download';
      setDownloads((prev) => {
        const next = new Map(prev);
        next.set(stream.id, {
          streamId: stream.id,
          status: 'error',
          progress: 0,
          downloadedBytes: 0,
          totalBytes: 0,
          error: errorMsg,
        });
        return next;
      });
    }
  }, []);

  const cancelDownload = useCallback(async (streamId: string) => {
    try {
      await chrome.runtime.sendMessage({
        type: 'CANCEL_DOWNLOAD',
        payload: { streamId },
      });
    } catch {
      // Ignore errors
    }
  }, []);

  return { downloads, startDownload, cancelDownload };
}