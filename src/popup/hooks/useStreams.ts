import { useState, useEffect, useCallback } from 'react';
import type { VideoStream } from '../../shared/types';

export function useStreams() {
  const [streams, setStreams] = useState<VideoStream[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_STREAMS' });
      if (Array.isArray(response)) {
        setStreams(response);
      } else if (response?.error) {
        setError(response.error);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch streams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreams();

    // Listen for stream updates
    const handleMessage = (message: { type: string; payload?: VideoStream[] }) => {
      if (message.type === 'STREAMS_UPDATED') {
        setStreams(message.payload || []);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [fetchStreams]);

  return { streams, loading, error, refresh: fetchStreams };
}