import type { VideoStream } from '../shared/types';
import { STORAGE_KEYS } from '../shared/constants';

export async function getStreams(): Promise<VideoStream[]> {
  const result = await chrome.storage.session.get(STORAGE_KEYS.STREAMS);
  return result[STORAGE_KEYS.STREAMS] || [];
}

export async function addStream(stream: VideoStream): Promise<void> {
  const streams = await getStreams();
  const existing = streams.find((s) => s.url === stream.url);
  if (!existing) {
    streams.push(stream);
    await chrome.storage.session.set({ [STORAGE_KEYS.STREAMS]: streams });
  }
}

export async function removeStream(streamId: string): Promise<void> {
  const streams = await getStreams();
  const filtered = streams.filter((s) => s.id !== streamId);
  await chrome.storage.session.set({ [STORAGE_KEYS.STREAMS]: filtered });
}

export async function getStreamsByTab(tabId: number): Promise<VideoStream[]> {
  const streams = await getStreams();
  return streams.filter((s) => s.tabId === tabId);
}

export async function clearTabStreams(tabId: number): Promise<void> {
  const streams = await getStreams();
  const filtered = streams.filter((s) => s.tabId !== tabId);
  await chrome.storage.session.set({ [STORAGE_KEYS.STREAMS]: filtered });
}

export async function clearAllStreams(): Promise<void> {
  await chrome.storage.session.remove(STORAGE_KEYS.STREAMS);
}