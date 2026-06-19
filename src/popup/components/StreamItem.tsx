import React from 'react';
import type { VideoStream, DownloadProgress } from '../../shared/types';
import { DownloadButton } from './DownloadButton';
import { ProgressBar } from './ProgressBar';

interface StreamItemProps {
  stream: VideoStream;
  download?: DownloadProgress;
  onDownload: (stream: VideoStream) => void;
  onCancel: (streamId: string) => void;
}

export const StreamItem: React.FC<StreamItemProps> = ({
  stream,
  download,
  onDownload,
  onCancel,
}) => {
  const typeLabel = getTypeLabel(stream.type);
  const typeClass = getTypeClass(stream.type);

  return (
    <div className="stream-item">
      <div className="stream-item-header">
        <span className={`stream-type-badge ${typeClass}`}>{typeLabel}</span>
        <span className="stream-source">{stream.source === 'dom' ? 'DOM' : 'Network'}</span>
      </div>
      <div className="stream-item-body">
        <p className="stream-title" title={stream.url}>
          {stream.title || stream.url}
        </p>
        <p className="stream-url" title={stream.url}>
          {stream.url.length > 60 ? stream.url.substring(0, 60) + '...' : stream.url}
        </p>
      </div>
      <div className="stream-item-footer">
        <DownloadButton
          stream={stream}
          download={download}
          onDownload={onDownload}
          onCancel={onCancel}
        />
      </div>
      {download && download.status !== 'completed' && download.status !== 'cancelled' && (
        <ProgressBar download={download} />
      )}
    </div>
  );
};

function getTypeLabel(type: string): string {
  switch (type) {
    case 'm3u8': return 'HLS';
    case 'mp4': return 'MP4';
    case 'webm': return 'WebM';
    case 'mpd': return 'DASH';
    case 'ts': return 'TS';
    default: return type.toUpperCase();
  }
}

function getTypeClass(type: string): string {
  switch (type) {
    case 'm3u8': return 'type-hls';
    case 'mp4': return 'type-mp4';
    case 'webm': return 'type-webm';
    case 'mpd': return 'type-dash';
    default: return 'type-other';
  }
}