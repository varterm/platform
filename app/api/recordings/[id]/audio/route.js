import fs from 'node:fs';
import { getRecording, getRecordingAudioPath, readRecordingAudio } from '@/lib/account-store.js';
import { getSessionFromRequest } from '@/lib/account-session.js';
import { jsonError, requireAccountsEnabled } from '@/lib/account-api.js';

export async function GET(request, { params }) {
  const disabled = requireAccountsEnabled();
  if (disabled) {
    return disabled;
  }

  const recording = await getRecording(params.id);
  if (!recording) {
    return jsonError('Recording not found', 404);
  }

  const session = getSessionFromRequest(request);
  const isOwner = session?.userId === recording.userId;
  if (recording.visibility === 'private' && !isOwner) {
    return jsonError('Recording not found', 404);
  }

  const filePath = getRecordingAudioPath(params.id);
  const rangeHeader = request.headers.get('range');
  const stat = await fs.promises.stat(filePath);

  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Number(match[2]) : stat.size - 1;
      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });
      return new Response(stream, {
        status: 206,
        headers: {
          'Content-Type': recording.mimeType || 'audio/mpeg',
          'Content-Length': String(chunkSize),
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }
  }

  const audio = await readRecordingAudio(params.id);
  return new Response(audio, {
    headers: {
      'Content-Type': recording.mimeType || 'audio/mpeg',
      'Content-Length': String(stat.size),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
