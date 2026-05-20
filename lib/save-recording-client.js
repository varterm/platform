function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read audio'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Save generated audio to the signed-in user's library (requires accounts enabled on server).
 */
export async function saveRecordingToAccount({
  audioBlob,
  title,
  visibility = 'unlisted',
  mimeType = 'audio/mpeg',
  voiceLabel,
  sourceTextPreview,
}) {
  const audioBase64 = await blobToBase64(audioBlob);

  const res = await fetch('/api/recordings', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      visibility,
      mimeType,
      audioBase64,
      voiceLabel,
      sourceTextPreview,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save recording');
  }
  return data.recording;
}
