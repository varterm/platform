// lib/elevenlabs.js
// ElevenLabs Text-to-Speech integration

export const VOICES = {
  // Premium voices
  premium: [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Warm, conversational', gender: 'female' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Clear, professional', gender: 'female' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Natural, friendly', gender: 'male' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'British, refined', gender: 'male' },
    { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', description: 'Energetic, young', gender: 'male' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Deep, authoritative', gender: 'male' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Elegant, mature', gender: 'female' },
    { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', description: 'Soft, gentle', gender: 'female' },
    { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', description: 'Trustworthy, calm', gender: 'male' },
    { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', description: 'Deep, narrative', gender: 'male' },
  ],
  // Ultra HD voices
  ultra: [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Ultra realistic', gender: 'female' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, confident', gender: 'female' },
    { id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave', description: 'British-Essex', gender: 'male' },
    { id: 'D38z5RcWu1voky8WS1ja', name: 'Fin', description: 'Irish, lyrical', gender: 'male' },
    { id: 'GBv7mTt0atIp3Br8iCZE', name: 'Thomas', description: 'Calm, American', gender: 'male' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Emotional range', gender: 'female' },
    { id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy', description: 'British, pleasant', gender: 'female' },
  ],
};

export const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah

export function hasConfiguredElevenLabsApiKey(overrideApiKey) {
  return Boolean((overrideApiKey || process.env.ELEVENLABS_API_KEY || '').trim());
}

/**
 * Generate speech from text using ElevenLabs API
 * @param {string} text - Text to convert to speech
 * @param {object} options - Options for TTS
 * @returns {Promise<ArrayBuffer>} - Audio data as ArrayBuffer
 */
export async function generateSpeech(text, options = {}) {
  const {
    voiceId = DEFAULT_VOICE_ID,
    modelId = 'eleven_turbo_v2_5',  // Updated: old models deprecated on free tier
    stability = 0.5,
    similarityBoost = 0.75,
    speed = 1.0,
    apiKey: overrideApiKey,
  } = options;

  const apiKey = overrideApiKey || process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          speed,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  return response.arrayBuffer();
}

/**
 * Get all available voices
 */
export function getVoices() {
  return {
    premium: VOICES.premium,
    ultra: VOICES.ultra,
    all: [...VOICES.premium, ...VOICES.ultra],
  };
}

/**
 * Find a voice by ID or name
 */
export function findVoice(query) {
  const allVoices = [...VOICES.premium, ...VOICES.ultra];
  return allVoices.find(
    v => v.id === query || v.name.toLowerCase() === query.toLowerCase()
  );
}
