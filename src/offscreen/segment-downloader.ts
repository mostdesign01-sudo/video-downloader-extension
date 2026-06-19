import { MAX_CONCURRENT_SEGMENT_DOWNLOADS, MAX_SEGMENT_RETRIES, SEGMENT_RETRY_DELAY_MS } from '../shared/constants';

export interface SegmentInfo {
  url: string;
  duration: number;
  data: Uint8Array;
}

export async function downloadSegments(
  segments: Array<{ url: string; duration: number }>,
  streamId: string,
  signal: AbortSignal,
): Promise<SegmentInfo[]> {
  const results: SegmentInfo[] = new Array(segments.length);
  const totalSegments = segments.length;
  let completedCount = 0;

  // Process segments in batches with concurrency limit
  const queue = segments.map((seg, index) => ({ ...seg, index }));

  async function processNext(): Promise<void> {
    while (queue.length > 0) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

      const item = queue.shift()!;
      const data = await downloadSegmentWithRetry(item.url, signal);

      results[item.index] = {
        url: item.url,
        duration: item.duration,
        data,
      };

      completedCount++;
      const progress = Math.round((completedCount / totalSegments) * 80); // 0-80% for download phase

      chrome.runtime.sendMessage({
        type: 'DOWNLOAD_PROGRESS',
        payload: {
          streamId,
          status: 'downloading',
          progress,
          downloadedBytes: results.reduce((sum, r) => sum + (r?.data?.byteLength || 0), 0),
          totalBytes: 0,
        },
      }).catch(() => {});
    }
  }

  // Start concurrent workers
  const workers = Array.from(
    { length: Math.min(MAX_CONCURRENT_SEGMENT_DOWNLOADS, totalSegments) },
    () => processNext(),
  );

  await Promise.all(workers);

  return results;
}

async function downloadSegmentWithRetry(url: string, signal: AbortSignal): Promise<Uint8Array> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_SEGMENT_RETRIES; attempt++) {
    try {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

      const response = await fetch(url, {
        signal,
        // Try to include credentials for authenticated streams
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err;
      }

      // Exponential backoff
      if (attempt < MAX_SEGMENT_RETRIES - 1) {
        const delay = SEGMENT_RETRY_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to download segment');
}