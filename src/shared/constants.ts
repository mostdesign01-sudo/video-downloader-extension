export const STREAM_TYPE_PATTERNS: Record<string, string> = {
  '.m3u8': 'm3u8',
  '.mp4': 'mp4',
  '.webm': 'webm',
  '.mpd': 'mpd',
  '.ts': 'ts',
};

export const MAX_CONCURRENT_SEGMENT_DOWNLOADS = 6;
export const MAX_SEGMENT_RETRIES = 3;
export const SEGMENT_RETRY_DELAY_MS = 1000;
export const MAX_FILE_SIZE_WARNING = 500 * 1024 * 1024; // 500MB

export const STORAGE_KEYS = {
  STREAMS: 'detected_streams',
  DOWNLOADS: 'active_downloads',
} as const;

export const OFFSCREEN_DOCUMENT_PATH = 'src/offscreen/index.html';

export const CORS_PROXY_URL = ''; // Optional CORS proxy fallback