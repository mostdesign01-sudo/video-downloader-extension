import React from 'react';
import type { VideoStream, DownloadProgress } from '../../shared/types';

interface DownloadButtonProps {
  stream: VideoStream;
  download?: DownloadProgress;
  onDownload: (stream: VideoStream) => void;
  onCancel: (streamId: string) => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  stream,
  download,
  onDownload,
  onCancel,
}) => {
  if (!download) {
    return (
      <button
        className="btn btn-download"
        onClick={() => onDownload(stream)}
      >
        Download
      </button>
    );
  }

  switch (download.status) {
    case 'pending':
      return (
        <button className="btn btn-pending" disabled>
          Preparing...
        </button>
      );
    case 'downloading':
      return (
        <button
          className="btn btn-cancel"
          onClick={() => onCancel(stream.id)}
        >
          Cancel
        </button>
      );
    case 'remuxing':
      return (
        <button className="btn btn-processing" disabled>
          Converting...
        </button>
      );
    case 'merging':
      return (
        <button className="btn btn-processing" disabled>
          Merging...
        </button>
      );
    case 'completed':
      return (
        <button className="btn btn-completed" disabled>
          Completed
        </button>
      );
    case 'error':
      return (
        <button
          className="btn btn-retry"
          onClick={() => onDownload(stream)}
          title={download.error}
        >
          Retry
        </button>
      );
    case 'cancelled':
      return (
        <button
          className="btn btn-download"
          onClick={() => onDownload(stream)}
        >
          Download
        </button>
      );
    default:
      return (
        <button
          className="btn btn-download"
          onClick={() => onDownload(stream)}
        >
          Download
        </button>
      );
  }
};