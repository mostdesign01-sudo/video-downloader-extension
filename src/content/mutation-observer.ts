import { scanForVideos } from './video-scanner';

export function setupMutationObserver(): void {
  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;

    for (const mutation of mutations) {
      // Check for added nodes
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (el.tagName === 'VIDEO' || el.tagName === 'SOURCE') {
              shouldScan = true;
              break;
            }
            // Check for video/source elements inside added nodes
            if (el.querySelector('video, source[src]')) {
              shouldScan = true;
              break;
            }
          }
        }
      }

      // Check for src attribute changes
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        const target = mutation.target as Element;
        if (target.tagName === 'VIDEO' || target.tagName === 'SOURCE') {
          shouldScan = true;
        }
      }

      if (shouldScan) break;
    }

    if (shouldScan) {
      scanForVideos();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src'],
  });
}