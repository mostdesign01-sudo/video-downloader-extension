import React from 'react';
import type { DownloadProgress } from '../../shared/types';
import { formatBytes } from '../../shared/utils';

interface ProgressBarProps {
  download: DownloadProgress;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ download }) => {
  const { progress, status, downloadedBytes, totalBytes, error } = download;

  const statusLabel = (() => {
    switch (status) {
      case 'pending': return 'Preparing...';
      case 'downloading': return 'Downloading segments...';
      case 'remuxing': return 'Converting to MP4...';
      case 'merging': return 'Merging...';
      case 'completed': return 'Completed!';
      case 'error': return error || 'Download failed';
      case 'cancelled': return 'Cancelled';
      default: return '';
    }
  })();

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${status === 'error' ? 'progress-error' : ''}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="progress-bar-info">
        <span className="progress-status">{statusLabel}</span>
        {downloadedBytes > 0 && (
          <span className="progress-size">
            {formatBytes(downloadedBytes)}
            {totalBytes > 0 && ` / ${formatBytes(totalBytes)}`}
          </span>
        )}
      </div>
    </div>
  );
};