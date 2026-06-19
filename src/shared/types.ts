// Video stream types detected by the extension

export type StreamType = 'mp4' | 'webm' | 'm3u8' | 'mpd' | 'ts' | 'unknown';

export type StreamSource = 'dom' | 'webRequest';

export interface VideoStream {
  id: string;
  url: string;
  type: StreamType;
  source: StreamSource;
  title: string;
  size: string;
  tabId: number;
  pageUrl: string;
  pageTitle: string;
  timestamp: number;
}

export interface DownloadProgress {
  streamId: string;
  status: 'pending' | 'downloading' | 'remuxing' | 'merging' | 'completed' | 'error' | 'cancelled';
  progress: number; // 0-100
  downloadedBytes: number;
  totalBytes: number;
  error?: string;
}

export interface DownloadTask {
  id: string;
  streamId: string;
  status: DownloadProgress['status'];
  progress: number;
  startTime: number;
}

// Messages between components

export type MessageType =
  | 'STREAM_DETECTED'
  | 'GET_STREAMS'
  | 'STREAMS_UPDATED'
  | 'START_DOWNLOAD'
  | 'DOWNLOAD_PROGRESS'
  | 'DOWNLOAD_COMPLETE'
  | 'DOWNLOAD_ERROR'
  | 'CANCEL_DOWNLOAD'
  | 'TAB_UPDATED';

export interface BaseMessage {
  type: MessageType;
}

export interface StreamDetectedMessage extends BaseMessage {
  type: 'STREAM_DETECTED';
  payload: Omit<VideoStream, 'id' | 'timestamp'>;
}

export interface GetStreamsMessage extends BaseMessage {
  type: 'GET_STREAMS';
}

export interface StreamsUpdatedMessage extends BaseMessage {
  type: 'STREAMS_UPDATED';
  payload: VideoStream[];
}

export interface StartDownloadMessage extends BaseMessage {
  type: 'START_DOWNLOAD';
  payload: {
    stream: VideoStream;
    filename?: string;
  };
}

export interface DownloadProgressMessage extends BaseMessage {
  type: 'DOWNLOAD_PROGRESS';
  payload: DownloadProgress;
}

export interface DownloadCompleteMessage extends BaseMessage {
  type: 'DOWNLOAD_COMPLETE';
  payload: {
    streamId: string;
    blobUrl?: string;
    filename: string;
  };
}

export interface DownloadErrorMessage extends BaseMessage {
  type: 'DOWNLOAD_ERROR';
  payload: {
    streamId: string;
    error: string;
  };
}

export interface CancelDownloadMessage extends BaseMessage {
  type: 'CANCEL_DOWNLOAD';
  payload: {
    streamId: string;
  };
}

export interface TabUpdatedMessage extends BaseMessage {
  type: 'TAB_UPDATED';
}

export type Message =
  | StreamDetectedMessage
  | GetStreamsMessage
  | StreamsUpdatedMessage
  | StartDownloadMessage
  | DownloadProgressMessage
  | DownloadCompleteMessage
  | DownloadErrorMessage
  | CancelDownloadMessage
  | TabUpdatedMessage;

// m3u8 parsed types

export interface M3u8Segment {
  url: string;
  duration: number;
  sequence: number;
  key?: M3u8Key;
  byteRange?: { length: number; offset: number };
  map?: M3u8Map;
}

export interface M3u8Key {
  method: string; // 'NONE' | 'AES-128' | 'SAMPLE-AES'
  uri?: string;
  iv?: Uint8Array;
  keyFormat?: string;
  keyFormatVersions?: string;
}

export interface M3u8Map {
  uri: string;
  byteRange?: { length: number; offset: number };
}

export interface M3u8Variant {
  url: string;
  bandwidth: number;
  resolution?: { width: number; height: number };
  codecs?: string;
  frameRate?: number;
  audio?: string;
  subtitles?: string;
}

export interface M3u8Playlist {
  version: number;
  targetDuration: number;
  mediaSequence: number;
  segments: M3u8Segment[];
  isMaster: boolean;
  variants: M3u8Variant[];
  endlist: boolean;
  playlistType?: string;
  key?: M3u8Key;
  map?: M3u8Map;
}