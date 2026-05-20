import { NextResponse } from 'next/server';
import {
  createRecording,
  listRecordingsForUser,
} from '@/lib/account-store.js';
import { jsonError, requireAuthenticatedUser } from '@/lib/account-api.js';

function publicRecording(recording, baseUrl) {
  return {
    id: recording.id,
    title: recording.title,
    visibility: recording.visibility,
    mimeType: recording.mimeType,
    bytes: recording.bytes,
    voiceLabel: recording.voiceLabel,
    sourceTextPreview: recording.sourceTextPreview,
    createdAt: recording.createdAt,
    listenUrl:
      recording.visibility === 'unlisted' ? `${baseUrl}/listen/${recording.id}` : null,
    audioUrl: `/api/recordings/${recording.id}/audio`,
  };
}

export async function GET(request) {
  const auth = await requireAuthenticatedUser(request);
  if (auth.error) {
    return auth.error;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const recordings = await listRecordingsForUser(auth.user.id);
  return NextResponse.json({
    success: true,
    recordings: recordings.map((r) => publicRecording(r, baseUrl)),
  });
}

export async function POST(request) {
  const auth = await requireAuthenticatedUser(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    const payload = await request.json();
    const audioBase64 = String(payload.audioBase64 || '').trim();
    if (!audioBase64) {
      return jsonError('audioBase64 is required');
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const recording = await createRecording(auth.user.id, {
      title: payload.title,
      visibility: payload.visibility,
      mimeType: payload.mimeType || 'audio/mpeg',
      audioBuffer,
      voiceLabel: payload.voiceLabel,
      sourceTextPreview: payload.sourceTextPreview,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
    return NextResponse.json({
      success: true,
      recording: publicRecording(recording, baseUrl),
    });
  } catch (error) {
    if (error.code === 'RECORDING_TOO_LARGE' || error.code === 'RECORDING_LIMIT') {
      return jsonError(error.message, 413);
    }
    console.error('Create recording error:', error);
    return jsonError(error.message || 'Failed to save recording', 500);
  }
}
