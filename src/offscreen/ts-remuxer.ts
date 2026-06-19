import type { SegmentInfo } from './segment-downloader';

// mux.js types - the library is CJS and doesn't have great TS support
interface Transmuxer {
  push(data: Uint8Array): void;
  flush(): void;
  on(event: string, callback: (data: TransmuxResult) => void): void;
  off(event: string, callback: (data: TransmuxResult) => void): void;
  dispose(): void;
}

interface TransmuxResult {
  initSegment?: Uint8Array;
  data: Uint8Array;
}

// We use dynamic import for mux.js since it's CJS
async function getMuxjs(): Promise<{ Transmuxer: new (options?: unknown) => Transmuxer }> {
  // @ts-ignore - mux.js is CJS module
  const muxjs = await import('mux.js');
  return muxjs.default || muxjs;
}

export async function remuxToMP4(segments: SegmentInfo[]): Promise<Blob> {
  if (segments.length === 0) {
    throw new Error('No segments to remux');
  }

  const muxjs = await getMuxjs();

  const transmuxer = new muxjs.Transmuxer({
    keepOriginalTimestamps: true,
  });

  const transmuxedSegments: TransmuxResult[] = [];
  let initSegment: Uint8Array | null = null;

  const onData = (result: TransmuxResult) => {
    if (result.initSegment) {
      initSegment = result.initSegment;
    }
    transmuxedSegments.push(result);
  };

  transmuxer.on('data', onData);

  try {
    for (const segment of segments) {
      const view = new Uint8Array(segment.data);
      transmuxer.push(view);
    }
    transmuxer.flush();
  } finally {
    transmuxer.off('data', onData);
    transmuxer.dispose();
  }

  // Concatenate: init segment + all media segments
  if (!initSegment) {
    // If no init segment, concatenate all data directly
    const totalLength = transmuxedSegments.reduce((sum, seg) => sum + seg.data.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const seg of transmuxedSegments) {
      combined.set(seg.data, offset);
      offset += seg.data.byteLength;
    }
    return new Blob([combined], { type: 'video/mp4' });
  }

  // Standard case: init + media segments
  const mediaDataLength = transmuxedSegments.reduce((sum, seg) => sum + seg.data.byteLength, 0);
  const totalLength = initSegment.byteLength + mediaDataLength;
  const combined = new Uint8Array(totalLength);

  combined.set(initSegment, 0);
  let offset = initSegment.byteLength;
  for (const seg of transmuxedSegments) {
    combined.set(seg.data, offset);
    offset += seg.data.byteLength;
  }

  return new Blob([combined], { type: 'video/mp4' });
}

// Fallback: concatenate raw TS segments (no remuxing)
// Used when mux.js fails or is unavailable
export async function concatRawTS(segments: SegmentInfo[]): Promise<Blob> {
  if (segments.length === 0) {
    throw new Error('No segments to concatenate');
  }

  const totalLength = segments.reduce((sum, seg) => sum + seg.data.byteLength, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;

  for (const segment of segments) {
    combined.set(segment.data, offset);
    offset += segment.data.byteLength;
  }

  return new Blob([combined], { type: 'video/mp2t' });
}