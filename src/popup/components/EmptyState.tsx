import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="12" width="48" height="40" rx="4" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <polygon points="24,22 24,42 44,32" fill="#94a3b8" opacity="0.3" />
          <circle cx="44" cy="22" r="8" fill="#94a3b8" opacity="0.2" />
          <path d="M40 22 L48 22 M44 18 L44 26" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="empty-state-title">No Videos Detected</h2>
      <p className="empty-state-desc">
        Navigate to a page with videos and they will appear here automatically.
      </p>
      <ul className="empty-state-hints">
        <li>Look for the extension icon badge when videos are found</li>
        <li>Supported formats: MP4, WebM, HLS (m3u8), DASH (mpd)</li>
        <li>Try refreshing the page if videos don't appear</li>
      </ul>
    </div>
  );
};