import { describe, it, expect } from 'vitest';
import { parseM3u8, selectBestVariant } from '../m3u8-parser';

const BASE_URL = 'https://example.com/video/';

describe('parseM3u8', () => {
  it('should parse a simple media playlist', () => {
    const content = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.0,
segment0.ts
#EXTINF:10.0,
segment1.ts
#EXTINF:10.0,
segment2.ts
#EXT-X-ENDLIST`;

    const result = parseM3u8(content, BASE_URL);

    expect(result.version).toBe(3);
    expect(result.targetDuration).toBe(10);
    expect(result.mediaSequence).toBe(0);
    expect(result.isMaster).toBe(false);
    expect(result.endlist).toBe(true);
    expect(result.segments).toHaveLength(3);
    expect(result.segments[0].url).toBe('https://example.com/video/segment0.ts');
    expect(result.segments[0].duration).toBe(10);
    expect(result.segments[0].sequence).toBe(0);
  });

  it('should parse a master playlist with variants', () => {
    const content = `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.4d400d"
low/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720,CODECS="avc1.4d401f"
mid/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,CODECS="avc1.4d4028"
high/index.m3u8`;

    const result = parseM3u8(content, BASE_URL);

    expect(result.isMaster).toBe(true);
    expect(result.variants).toHaveLength(3);
    expect(result.variants[0].bandwidth).toBe(800000);
    expect(result.variants[0].resolution).toEqual({ width: 640, height: 360 });
    expect(result.variants[1].bandwidth).toBe(2000000);
    expect(result.variants[2].bandwidth).toBe(5000000);
    expect(result.variants[2].url).toBe('https://example.com/video/high/index.m3u8');
  });

  it('should handle segments with EXT-X-KEY (AES-128)', () => {
    const content = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-KEY:METHOD=AES-128,URI="key.bin",IV=0x0123456789abcdef0123456789abcdef
#EXTINF:10.0,
segment0.ts
#EXTINF:10.0,
segment1.ts
#EXT-X-ENDLIST`;

    const result = parseM3u8(content, BASE_URL);

    expect(result.segments).toHaveLength(2);
    expect(result.segments[0].key).toBeDefined();
    expect(result.segments[0].key!.method).toBe('AES-128');
    expect(result.segments[0].key!.uri).toBe('https://example.com/video/key.bin');
    expect(result.segments[0].key!.iv).toBeDefined();
  });

  it('should handle segments with EXT-X-MAP (fMP4 init)', () => {
    const content = `#EXTM3U
#EXT-X-VERSION:7
#EXT-X-TARGETDURATION:6
#EXT-X-MAP:URI="init.mp4"
#EXTINF:6.0,
segment0.m4s
#EXTINF:6.0,
segment1.m4s
#EXT-X-ENDLIST`;

    const result = parseM3u8(content, BASE_URL);

    expect(result.segments).toHaveLength(2);
    expect(result.segments[0].map).toBeDefined();
    expect(result.segments[0].map!.uri).toBe('https://example.com/video/init.mp4');
  });

  it('should handle standalone segments (no playlist)', () => {
    const content = `#EXTM3U
#EXT-X-VERSION:3
segment.ts`;

    const result = parseM3u8(content, BASE_URL);

    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].url).toBe('https://example.com/video/segment.ts');
  });

  it('should handle EXT-X-BYTERANGE', () => {
    const content = `#EXTM3U
#EXT-X-VERSION:4
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
#EXT-X-BYTERANGE:1000@5000
segment.ts
#EXT-X-ENDLIST`;

    const result = parseM3u8(content, BASE_URL);

    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].byteRange).toEqual({ length: 1000, offset: 5000 });
  });

  it('should handle EXT-X-DISCONTINUITY', () => {
    const content = `#EXTM3U
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
segment0.ts
#EXT-X-DISCONTINUITY
#EXTINF:10.0,
segment1.ts
#EXT-X-ENDLIST`;

    const result = parseM3u8(content, BASE_URL);

    // Discontinuity tags should be ignored, segments still parsed
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0].url).toContain('segment0.ts');
    expect(result.segments[1].url).toContain('segment1.ts');
  });
});

describe('selectBestVariant', () => {
  it('should select the highest bandwidth variant', () => {
    const variants = [
      { url: 'low.m3u8', bandwidth: 500000 },
      { url: 'mid.m3u8', bandwidth: 1500000 },
      { url: 'high.m3u8', bandwidth: 4000000 },
    ];

    const best = selectBestVariant(variants);
    expect(best.bandwidth).toBe(4000000);
    expect(best.url).toBe('high.m3u8');
  });

  it('should throw on empty variants', () => {
    expect(() => selectBestVariant([])).toThrow('No variants available');
  });
});