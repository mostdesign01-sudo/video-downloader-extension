import React from 'react';
import { StreamList } from './components/StreamList';
import { EmptyState } from './components/EmptyState';
import { useStreams } from './hooks/useStreams';
import { useDownloadState } from './hooks/useDownloadState';

const App: React.FC = () => {
  const { streams, loading, error, refresh } = useStreams();
  const { downloads, startDownload, cancelDownload } = useDownloadState();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Video Downloader</h1>
        <button className="refresh-btn" onClick={refresh} disabled={loading}>
          {loading ? 'Scanning...' : 'Refresh'}
        </button>
      </header>
      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
        {streams.length === 0 ? (
          <EmptyState />
        ) : (
          <StreamList
            streams={streams}
            downloads={downloads}
            onDownload={startDownload}
            onCancel={cancelDownload}
          />
        )}
      </main>
    </div>
  );
};

export default App;