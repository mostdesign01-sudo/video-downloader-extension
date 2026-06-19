import type { StreamDetectedMessage } from '../shared/types';
import { detectStreamType, generateId } from '../shared/utils';

export function scanForVideos(): void {
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    reportVideoElement(video);
  });

  // Also scan for source elements outside video tags
  const sources = document.querySelectorAll('source[src]');
  sources.forEach((source) => {
    const src = source.getAttribute('src');
    if (src) {
      reportUrl(src);
    }
  });
}

function reportVideoElement(video: HTMLVideoElement): void {
  // Check currentSrc
  if (video.currentSrc) {
    reportUrl(video.currentSrc);
  }

  // Check source children
  const sources = video.querySelectorAll('source[src]');
  sources.forEach((source) => {
    const src = source.getAttribute('src');
    if (src) {
      reportUrl(src);
    }
  });

  // Check src attribute
  const src = video.getAttribute('src');
  if (src && src !== video.currentSrc) {
    reportUrl(src);
  }
}

function reportUrl(url: string): void {
  const type = detectStreamType(url);
  if (type === 'unknown') return;

  const message: StreamDetectedMessage = {
    type: 'STREAM_DETECTED',
    payload: {
      url,
      type,
      source: 'dom',
      title: document.title || url,
      size: '',
      tabId: 0, // Will be filled by background based on sender
      pageUrl: window.location.href,
      pageTitle: document.title,
    },
  };

  chrome.runtime.sendMessage(message).catch(() => {
    // Extension may not be ready
  });
}