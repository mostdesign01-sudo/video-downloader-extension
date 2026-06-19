import type { StreamType } from './types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function detectStreamType(url: string): StreamType {
  const lower = url.toLowerCase();
  if (lower.includes('.m3u8') || lower.includes('m3u8')) return 'm3u8';
  if (lower.includes('.mpd') || lower.includes('mpd')) return 'mpd';
  if (lower.includes('.mp4') || lower.includes('mp4')) return 'mp4';
  if (lower.includes('.webm') || lower.includes('webm')) return 'webm';
  if (lower.includes('.ts') || lower.includes('.ts?')) return 'ts';
  return 'unknown';
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getFilenameFromUrl(url: string, type: StreamType): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1] || 'video';
    if (lastPart.includes('.')) {
      return type === 'm3u8' ? lastPart.replace(/\.m3u8?$/i, '.mp4') : lastPart;
    }
    return type === 'm3u8' ? `${lastPart}.mp4` : `${lastPart}.${type}`;
  } catch {
    return `video.${type === 'm3u8' ? 'mp4' : type}`;
  }
}

export function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return relativeUrl;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}