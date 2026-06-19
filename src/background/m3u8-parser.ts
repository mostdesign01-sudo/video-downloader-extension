import type { M3u8Playlist, M3u8Segment, M3u8Variant, M3u8Key, M3u8Map } from '../shared/types';
import { resolveUrl } from '../shared/utils';

export function parseM3u8(content: string, baseUrl: string): M3u8Playlist {
  const lines = content.split('\n').map((l) => l.trim());
  const playlist: M3u8Playlist = {
    version: 3,
    targetDuration: 0,
    mediaSequence: 0,
    segments: [],
    isMaster: false,
    variants: [],
    endlist: false,
  };

  let currentKey: M3u8Key | undefined;
  let currentMap: M3u8Map | undefined;
  let segmentSequence = 0;

  // State machine: we accumulate pending segment info between EXTINF and the URL line
  let pendingDuration: number | null = null;
  let pendingByteRange: { length: number; offset: number } | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === '' || line === '#EXTM3U') {
      continue;
    }

    const isTag = line.startsWith('#');

    if (isTag) {
      // Reset pending segment state when we hit a new tag that starts a fresh segment
      if (line.startsWith('#EXTINF:')) {
        // If there was a pending segment from before (e.g. standalone URL), it's stale
        pendingDuration = parseSegmentDuration(line);
        pendingByteRange = undefined;
      } else if (line.startsWith('#EXT-X-VERSION:')) {
        playlist.version = parseInt(line.split(':')[1], 10) || 3;
      } else if (line.startsWith('#EXT-X-TARGETDURATION:')) {
        playlist.targetDuration = parseInt(line.split(':')[1], 10) || 0;
      } else if (line.startsWith('#EXT-X-MEDIA-SEQUENCE:')) {
        playlist.mediaSequence = parseInt(line.split(':')[1], 10) || 0;
        segmentSequence = playlist.mediaSequence;
      } else if (line.startsWith('#EXT-X-ENDLIST')) {
        playlist.endlist = true;
      } else if (line.startsWith('#EXT-X-PLAYLIST-TYPE:')) {
        playlist.playlistType = line.split(':')[1];
      } else if (line.startsWith('#EXT-X-STREAM-INF:')) {
        playlist.isMaster = true;
        const variant = parseVariantTag(line);
        // Next line is the variant URL
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          if (nextLine && !nextLine.startsWith('#')) {
            variant.url = resolveUrl(baseUrl, nextLine);
            playlist.variants.push(variant);
            i++; // Skip the URL line
          }
        }
      } else if (line.startsWith('#EXT-X-I-FRAME-STREAM-INF:')) {
        playlist.isMaster = true;
      } else if (line.startsWith('#EXT-X-KEY:')) {
        currentKey = parseKeyTag(line, baseUrl);
      } else if (line.startsWith('#EXT-X-MAP:')) {
        currentMap = parseMapTag(line, baseUrl);
      } else if (line.startsWith('#EXT-X-BYTERANGE:')) {
        pendingByteRange = parseByteRange(line);
      } else if (line.startsWith('#EXT-X-DISCONTINUITY')) {
        // Mark discontinuity - segments after this may have different encoding
        continue;
      }
      // Other tags are ignored
    } else {
      // This is a URL line - it could be a segment URL
      const segment: M3u8Segment = {
        url: resolveUrl(baseUrl, line),
        duration: pendingDuration ?? 0,
        sequence: segmentSequence++,
      };
      if (currentKey) segment.key = { ...currentKey };
      if (currentMap) segment.map = { ...currentMap };
      if (pendingByteRange) segment.byteRange = { ...pendingByteRange };

      playlist.segments.push(segment);

      // Reset pending state
      pendingDuration = null;
      pendingByteRange = undefined;
    }
  }

  return playlist;
}

function parseVariantTag(line: string): M3u8Variant {
  const variant: M3u8Variant = { url: '', bandwidth: 0 };
  const attrs = parseAttributes(line.substring('#EXT-X-STREAM-INF:'.length));

  variant.bandwidth = parseInt(attrs.BANDWIDTH || '0', 10);
  variant.codecs = attrs.CODECS;

  if (attrs.RESOLUTION) {
    const [w, h] = attrs.RESOLUTION.split('x').map(Number);
    variant.resolution = { width: w, height: h };
  }

  if (attrs['FRAME-RATE']) {
    variant.frameRate = parseFloat(attrs['FRAME-RATE']);
  }

  if (attrs.AUDIO) {
    variant.audio = attrs.AUDIO;
  }

  if (attrs.SUBTITLES) {
    variant.subtitles = attrs.SUBTITLES;
  }

  return variant;
}

function parseSegmentDuration(line: string): number {
  const match = line.match(/#EXTINF:\s*([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function parseKeyTag(line: string, baseUrl: string): M3u8Key {
  const attrs = parseAttributes(line.substring('#EXT-X-KEY:'.length));
  const key: M3u8Key = {
    method: attrs.METHOD || 'NONE',
  };

  if (attrs.URI) {
    key.uri = resolveUrl(baseUrl, attrs.URI.replace(/^"/, '').replace(/"$/, ''));
  }

  if (attrs.IV) {
    const ivHex = attrs.IV.replace(/^0x/i, '');
    key.iv = hexToBytes(ivHex);
  }

  if (attrs.KEYFORMAT) {
    key.keyFormat = attrs.KEYFORMAT.replace(/^"/, '').replace(/"$/, '');
  }

  if (attrs['KEYFORMATVERSIONS']) {
    key.keyFormatVersions = attrs['KEYFORMATVERSIONS'].replace(/^"/, '').replace(/"$/, '');
  }

  return key;
}

function parseMapTag(line: string, baseUrl: string): M3u8Map {
  const attrs = parseAttributes(line.substring('#EXT-X-MAP:'.length));
  const map: M3u8Map = {
    uri: resolveUrl(baseUrl, attrs.URI?.replace(/^"/, '').replace(/"$/, '') || ''),
  };

  if (attrs.BYTERANGE) {
    const parts = attrs.BYTERANGE.replace(/^"/, '').replace(/"$/, '').split('@');
    if (parts.length === 2) {
      map.byteRange = { length: parseInt(parts[0], 10), offset: parseInt(parts[1], 10) };
    } else {
      map.byteRange = { length: parseInt(parts[0], 10), offset: 0 };
    }
  }

  return map;
}

function parseByteRange(line: string): { length: number; offset: number } {
  const value = line.substring('#EXT-X-BYTERANGE:'.length);
  const parts = value.split('@');
  if (parts.length === 2) {
    return { length: parseInt(parts[0], 10), offset: parseInt(parts[1], 10) };
  }
  return { length: parseInt(parts[0], 10), offset: 0 };
}

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /([A-Z0-9-]+)\s*=\s*(?:"([^"]*)"|([^,]*))/gi;
  let match;

  while ((match = regex.exec(attrString)) !== null) {
    const key = match[1];
    const value = match[2] !== undefined ? match[2] : match[3];
    attrs[key] = value;
  }

  return attrs;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export function selectBestVariant(variants: M3u8Variant[]): M3u8Variant {
  if (variants.length === 0) {
    throw new Error('No variants available');
  }

  // Sort by bandwidth descending, pick highest quality
  return [...variants].sort((a, b) => b.bandwidth - a.bandwidth)[0];
}