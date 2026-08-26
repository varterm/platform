// Offline (Piper) speech synthesis, off the main thread.
// The WASM paths point at files staged into public/piper by
// scripts/copy-piper-assets.mjs so playback never reaches for a CDN.
import { INFERENCE_PROGRESS_URL, TtsSession } from '@mintplex-labs/piper-tts-web';
import { flush, remove, stored } from '@mintplex-labs/piper-tts-web';

const WASM_PATHS = {
  onnxWasm: '/piper/ort/',
  piperData: '/piper/piper_phonemize.data',
  piperWasm: '/piper/piper_phonemize.wasm',
};

let session = null;
let sessionVoiceId = null;

async function getSession(voiceId, id) {
  if (session && sessionVoiceId === voiceId) {
    return session;
  }

  // TtsSession caches one global instance and reassigning voiceId on it does not
  // reload the model, so the old instance has to go before switching voices.
  TtsSession._instance = null;
  session = null;
  sessionVoiceId = null;

  const next = await TtsSession.create({
    voiceId,
    wasmPaths: WASM_PATHS,
    progress: (progress) => {
      if (progress?.url === INFERENCE_PROGRESS_URL) {
        return;
      }
      self.postMessage({
        id,
        type: 'progress',
        loaded: progress?.loaded ?? 0,
        total: progress?.total ?? 0,
      });
    },
  });

  session = next;
  sessionVoiceId = voiceId;
  return session;
}

self.onmessage = async (event) => {
  const { id, type, voiceId, text } = event.data || {};

  try {
    switch (type) {
      case 'prepare': {
        await getSession(voiceId, id);
        self.postMessage({ id, type: 'ready' });
        break;
      }
      case 'synthesize': {
        const active = await getSession(voiceId, id);
        const wav = await active.predict(text);
        const buffer = await wav.arrayBuffer();
        self.postMessage({ id, type: 'audio', buffer }, [buffer]);
        break;
      }
      case 'stored': {
        self.postMessage({ id, type: 'stored', voices: await stored() });
        break;
      }
      case 'remove': {
        await remove(voiceId);
        if (sessionVoiceId === voiceId) {
          TtsSession._instance = null;
          session = null;
          sessionVoiceId = null;
        }
        self.postMessage({ id, type: 'done' });
        break;
      }
      case 'flush': {
        await flush();
        TtsSession._instance = null;
        session = null;
        sessionVoiceId = null;
        self.postMessage({ id, type: 'done' });
        break;
      }
      default:
        self.postMessage({ id, type: 'error', message: `Unknown request: ${type}` });
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
