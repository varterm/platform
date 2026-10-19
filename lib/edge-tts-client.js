// Microsoft retired the old Edge Read Aloud socket
// (speech.platform.bing.com) in October 2026. The browser now speaks through
// api.msedgeservices.com. That host still accepts the v1 Sec-MS-GEC token if
// the key is sent as Ocp-Apim-Subscription-Key. The npm client still builds
// the old URL with TrustedClientToken, which 403s, so this wrapper only
// changes the handshake. Same voices, same MP3.
//
// Temporary: Edge 155 already uses a v2 token format. When Microsoft starts
// requiring that here too, this will 403 again.

import { EdgeTTS, Constants } from '@andresaya/edge-tts';
import WebSocket from 'ws';

export const EDGE_TTS_WSS_URL =
  'wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1';

export function buildSynthesisUrl({ token, secMsGEC, version, connectionId }) {
  const params = new URLSearchParams({
    'Ocp-Apim-Subscription-Key': token,
    'Sec-MS-GEC': secMsGEC,
    'Sec-MS-GEC-Version': version,
    ConnectionId: connectionId,
  });
  return `${EDGE_TTS_WSS_URL}?${params}`;
}

// The token is a hash of the current 5-minute window. A clock that sits on the
// boundary, or a few minutes off, is rejected as 403. Callers retry the
// neighbouring windows.
export async function secMsGecToken(date = new Date()) {
  const ticks = Math.floor(date.getTime() / 1000) + 11644473600;
  const rounded = ticks - (ticks % 300);
  const windowsTicks = rounded * 10_000_000;
  const data = new TextEncoder().encode(`${windowsTicks}${Constants.TRUSTED_CLIENT_TOKEN}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(hash).toString('hex').toUpperCase();
}

const CLOCK_SKEW_SECONDS = [0, -300, 300];

export function isRetryableSynthesisError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return !/inactivity timeout/i.test(message);
}

// One dropped socket or a 403 on the 5-minute boundary should not become a
// failed read. A hung socket is not retried: three 30s waits would outlive
// the request.
export async function synthesizeWithRetries(run, options = {}) {
  const tries = options.tries ?? CLOCK_SKEW_SECONDS.length;
  const delayMs = options.delayMs ?? 200;
  let lastError = new Error('Speech synthesis failed. Please try again.');
  for (let attempt = 0; attempt < tries; attempt += 1) {
    try {
      const audio = await run(CLOCK_SKEW_SECONDS[attempt] ?? 0);
      if (audio && audio.length) {
        return audio;
      }
      lastError = new Error('Microsoft voice socket closed before any audio arrived');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (!isRetryableSynthesisError(lastError)) {
        throw lastError;
      }
    }
    if (attempt < tries - 1 && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

export class CloudEdgeTTS extends EdgeTTS {
  async synthesize(text, voice = 'en-US-AriaNeural', options = {}) {
    const skewSeconds = options.clockSkewSeconds || 0;
    const secMsGEC = await secMsGecToken(new Date(Date.now() + skewSeconds * 1000));
    return new Promise((resolve, reject) => {
      this.audio_stream = [];
      const reqId = this.generateUUID();
      const url = buildSynthesisUrl({
        token: Constants.TRUSTED_CLIENT_TOKEN,
        secMsGEC,
        version: Constants.VERSION_MS_GEC,
        connectionId: reqId,
      });
      this.ws = new WebSocket(url, {
        headers: Constants.getBaseHeaders(),
        rejectUnauthorized: false,
      });
      const SSML_text = this.getSSML(text, voice, options);
      const outputFormat = options.outputFormat || 'audio-24khz-48kbitrate-mono-mp3';
      this.output_format = outputFormat;
      let settled = false;
      const finish = (err) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(inactivityTimeout);
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };
      let inactivityTimeout;
      const resetInactivityTimeout = () => {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
          }
          finish(new Error('WebSocket inactivity timeout - no response from server'));
        }, 30000);
      };
      this.ws.on('open', () => {
        resetInactivityTimeout();
        this.ws.send(this.buildTTSConfigMessage(outputFormat));
        const timestamp = this.nowRFC1123();
        this.ws.send(
          `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${timestamp}\r\nPath:ssml\r\n\r\n${SSML_text}`
        );
      });
      this.ws.on('message', (data) => {
        resetInactivityTimeout();
        this.processAudioData(data);
      });
      this.ws.on('error', (err) => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.close();
        }
        finish(err instanceof Error ? err : new Error(String(err)));
      });
      this.ws.on('close', () => {
        if (!this.audio_stream.length) {
          finish(new Error('Microsoft voice socket closed before any audio arrived'));
          return;
        }
        finish();
      });
    });
  }
}
