import React from 'react';
import type { VideoStream } from '../../shared/types';
import type { DownloadProgress } from '../../shared/types';
import { StreamItem } from './StreamItem';

interface StreamListProps {
  streams: VideoStream[];
  downloads: Map<string, DownloadProgress>;
  onDownload: (stream: VideoStream) => void;
  onCancel: (streamId: string) => void;
}

export const StreamList: React.FC<StreamListProps> = ({
  streams,
  downloads,
  onDownload,
  onCancel,
}) => {
  return (
    <div className="stream-list">
      {streams.map((stream) => (
        <StreamItem
          key={stream.id}
          stream={stream}
          download={downloads.get(stream.id)}
          onDownload={onDownload}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};