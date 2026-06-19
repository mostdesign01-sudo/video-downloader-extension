import { scanForVideos } from './video-scanner';
import { setupMutationObserver } from './mutation-observer';

// Initial scan
scanForVideos();

// Setup mutation observer for dynamic content
setupMutationObserver();

// Also re-scan periodically for late-loading content
setInterval(scanForVideos, 3000);