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

export class CloudEdgeTTS extends EdgeTTS {
  async synthesize(text, voice = 'en-US-AriaNeural', options = {}) {
    const secMsGEC = await this.generateSecMsGec(Constants.TRUSTED_CLIENT_TOKEN);
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
      let timedOut = false;
      let inactivityTimeout;
      const resetInactivityTimeout = () => {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
          timedOut = true;
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
          }
          reject(new Error('WebSocket inactivity timeout - no response from server'));
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
        clearTimeout(inactivityTimeout);
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.close();
        }
        reject(err);
      });
      this.ws.on('close', () => {
        clearTimeout(inactivityTimeout);
        if (!timedOut) {
          resolve();
        }
      });
    });
  }
}
