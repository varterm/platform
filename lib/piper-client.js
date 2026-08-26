// Promise wrapper around the offline (Piper) worker.
let worker = null;
let nextId = 1;
const pending = new Map();

/** Offline voices need OPFS for model caching: Chrome 108+, Safari 17+, Firefox 111+. */
export function isOfflineSupported() {
  return (
    typeof window !== 'undefined' &&
    typeof Worker !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof navigator.storage?.getDirectory === 'function'
  );
}

function failAllPending(error) {
  for (const entry of pending.values()) {
    entry.reject(error);
  }
  pending.clear();
}

function getWorker() {
  if (worker) {
    return worker;
  }

  worker = new Worker(new URL('./piper-worker.js', import.meta.url), { type: 'module' });

  worker.onmessage = (event) => {
    const data = event.data || {};
    const entry = pending.get(data.id);
    if (!entry) {
      return;
    }
    if (data.type === 'progress') {
      entry.onProgress?.(data);
      return;
    }
    pending.delete(data.id);
    if (data.type === 'error') {
      entry.reject(new Error(data.message || 'Offline voice failed'));
      return;
    }
    entry.resolve(data);
  };

  worker.onerror = (event) => {
    failAllPending(new Error(event.message || 'Offline voice worker crashed'));
  };

  return worker;
}

function request(message, onProgress) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    try {
      getWorker().postMessage({ ...message, id });
    } catch (error) {
      pending.delete(id);
      reject(error);
    }
  });
}

export function prepareVoice(voiceId, onProgress) {
  return request({ type: 'prepare', voiceId }, onProgress);
}

export async function synthesizeOffline(voiceId, text, onProgress) {
  const result = await request({ type: 'synthesize', voiceId, text }, onProgress);
  return new Blob([result.buffer], { type: 'audio/wav' });
}

export async function storedVoices() {
  const result = await request({ type: 'stored' });
  return result.voices || [];
}

export function removeVoice(voiceId) {
  return request({ type: 'remove', voiceId });
}

export function flushVoices() {
  return request({ type: 'flush' });
}

export function terminatePiper() {
  worker?.terminate();
  worker = null;
  failAllPending(new Error('Offline voice worker stopped'));
}
