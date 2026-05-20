import { NextResponse } from 'next/server';
import { deleteRecording, getRecording } from '@/lib/account-store.js';
import { getSessionFromRequest } from '@/lib/account-session.js';
import { jsonError, requireAccountsEnabled, requireAuthenticatedUser } from '@/lib/account-api.js';

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  return NextResponse.json({
    success: true,
    recording: {
      id: recording.id,
      title: recording.title,
      visibility: recording.visibility,
      mimeType: recording.mimeType,
      bytes: recording.bytes,
      voiceLabel: recording.voiceLabel,
      sourceTextPreview: recording.sourceTextPreview,
      createdAt: recording.createdAt,
      isOwner,
      listenUrl: recording.visibility === 'unlisted' ? `${baseUrl}/listen/${recording.id}` : null,
      audioUrl: `/api/recordings/${recording.id}/audio`,
    },
  });
}

export async function DELETE(request, { params }) {
  const auth = await requireAuthenticatedUser(request);
  if (auth.error) {
    return auth.error;
  }

  const deleted = await deleteRecording(auth.user.id, params.id);
  if (!deleted) {
    return jsonError('Recording not found', 404);
  }

  return NextResponse.json({ success: true });
}
