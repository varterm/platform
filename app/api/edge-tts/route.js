// app/api/edge-tts/route.js
// Microsoft Edge TTS API endpoint - FREE neural voices

import { NextResponse } from 'next/server';
import { EdgeTTS } from '@andresaya/edge-tts';
import { CLOUD_LANGUAGES } from '@/lib/cloud-languages';

// Popular Microsoft Edge neural voices
export const EDGE_VOICES = [
  // English US
  { id: 'en-US-AriaNeural', name: 'Aria', lang: 'en-US', gender: 'female', style: 'Friendly, positive' },
  { id: 'en-US-JennyNeural', name: 'Jenny', lang: 'en-US', gender: 'female', style: 'Warm, clear' },
  { id: 'en-US-GuyNeural', name: 'Guy', lang: 'en-US', gender: 'male', style: 'Casual, natural' },
  { id: 'en-US-AndrewNeural', name: 'Andrew', lang: 'en-US', gender: 'male', style: 'Calm, professional' },
  { id: 'en-US-ChristopherNeural', name: 'Christopher', lang: 'en-US', gender: 'male', style: 'Friendly, upbeat' },
  { id: 'en-US-EmmaNeural', name: 'Emma', lang: 'en-US', gender: 'female', style: 'Cheerful, expressive' },
  // English UK
  { id: 'en-GB-SoniaNeural', name: 'Sonia', lang: 'en-GB', gender: 'female', style: 'British, warm' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', lang: 'en-GB', gender: 'male', style: 'British, professional' },
  // English Australia
  { id: 'en-AU-NatashaNeural', name: 'Natasha', lang: 'en-AU', gender: 'female', style: 'Australian, friendly' },
  { id: 'en-AU-WilliamNeural', name: 'William', lang: 'en-AU', gender: 'male', style: 'Australian, clear' },
];

// Some older voice IDs are no longer returned by Microsoft Edge.
// Keep aliases so existing extensions/clients still produce audio.
const EDGE_VOICE_ALIASES = {
  'en-US-DavisNeural': 'en-US-AndrewNeural',
  'en-US-TonyNeural': 'en-US-ChristopherNeural',
  'en-US-SaraNeural': 'en-US-EmmaNeural',
};

// Microsoft's voices are locale specific in a way that fails silently: give an
// English voice a page of Chinese, Cyrillic, Arabic or Devanagari and it returns
// zero bytes with no error at all. Without this check the caller is told to try
// different text, when the text was fine and the voice was wrong.
// A few foreign words inside English still synthesise, so this only fires when
// the other script is most of what was sent.
const VOICE_SCRIPTS = [
  // Japanese before Chinese: Japanese text contains Han characters too.
  { name: 'Japanese', pattern: /[\p{Script=Hiragana}\p{Script=Katakana}]/u, langs: ['ja'], example: 'ja-JP-NanamiNeural' },
  { name: 'Chinese', pattern: /\p{Script=Han}/u, langs: ['zh', 'ja'], example: 'zh-CN-XiaoxiaoNeural' },
  { name: 'Korean', pattern: /\p{Script=Hangul}/u, langs: ['ko'], example: 'ko-KR-SunHiNeural' },
  { name: 'Cyrillic', pattern: /\p{Script=Cyrillic}/u, langs: ['ru', 'uk', 'bg', 'sr', 'kk'], example: 'ru-RU-SvetlanaNeural' },
  { name: 'Arabic', pattern: /\p{Script=Arabic}/u, langs: ['ar', 'fa', 'ur'], example: 'ar-EG-SalmaNeural' },
  { name: 'Devanagari', pattern: /\p{Script=Devanagari}/u, langs: ['hi', 'mr', 'ne'], example: 'hi-IN-SwaraNeural' },
  { name: 'Hebrew', pattern: /\p{Script=Hebrew}/u, langs: ['he'], example: 'he-IL-HilaNeural' },
  { name: 'Thai', pattern: /\p{Script=Thai}/u, langs: ['th'], example: 'th-TH-PremwadeeNeural' },
  { name: 'Greek', pattern: /\p{Script=Greek}/u, langs: ['el'], example: 'el-GR-AthinaNeural' },
];

function voiceScriptMismatch(text, voiceId) {
  const letters = text.match(/\p{L}/gu) || [];
  if (letters.length < 4) return undefined;

  const language = (voiceId.split('-')[0] || '').toLowerCase();
  for (const script of VOICE_SCRIPTS) {
    const inScript = letters.filter((letter) => script.pattern.test(letter)).length;
    if (inScript / letters.length < 0.5) continue;
    if (script.langs.includes(language)) return undefined;
    return {
      script: script.name,
      error:
        `The ${voiceId} voice cannot speak ${script.name} text. ` +
        `Choose a matching voice, for example ${script.example}.`,
    };
  }
  return undefined;
}

// Nothing but punctuation or whitespace also comes back as zero bytes.
function hasSpeakableText(text) {
  return /[\p{L}\p{N}]/u.test(text);
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// The editor extension builds its voice picker from this list, so anything
// missing here is a language its users cannot read aloud at all. Reusing the
// catalog the site already ships keeps the two from drifting apart.
function listVoices() {
  const voices = [...EDGE_VOICES];
  for (const { language, voices: localVoices } of CLOUD_LANGUAGES) {
    for (const voice of localVoices) {
      voices.push({
        id: voice.id,
        name: voice.name,
        lang: voice.id.split('-').slice(0, 2).join('-'),
        gender: /female/i.test(voice.desc) ? 'female' : 'male',
        style: `${language} • ${voice.desc}`,
      });
    }
  }
  return voices;
}

// GET /api/edge-tts - List available voices
export async function GET() {
  return NextResponse.json({
    success: true,
    voices: listVoices(),
    note: 'Free Microsoft Edge neural voices',
  });
}

// POST /api/edge-tts - Generate speech
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, voice = 'en-US-AriaNeural', rate = 1 } = body;
    const requestedVoice = typeof voice === 'string' ? voice : 'en-US-AriaNeural';
    const resolvedVoice = EDGE_VOICE_ALIASES[requestedVoice] || requestedVoice;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    // Microsoft Edge TTS has practical limits - very long texts may timeout
    // For extremely long content, consider chunking on the frontend
    if (text.length > 100000) {
      return NextResponse.json(
        { success: false, error: 'Text must be under 100,000 characters. For longer content, try splitting into sections.' },
        { status: 400 }
      );
    }

    // Both of these come back from Microsoft as zero bytes with no error, so
    // catch them here where we can still say what was actually wrong. 422
    // rather than 500 also stops clients retrying a request that cannot
    // succeed on a second attempt.
    if (!hasSpeakableText(text)) {
      return NextResponse.json(
        { success: false, error: 'That text has nothing to read aloud.' },
        { status: 422 }
      );
    }

    const mismatch = voiceScriptMismatch(text, resolvedVoice);
    if (mismatch) {
      return NextResponse.json(
        { success: false, error: mismatch.error, script: mismatch.script },
        { status: 422 }
      );
    }

    // Convert rate from number (0.5-2) to percentage
    let rateValue = undefined;
    if (typeof rate === 'number' && rate !== 1) {
      // Convert 0.5-2 range to -50% to +100%
      rateValue = Math.round((rate - 1) * 100);
    }

    // Create TTS instance and synthesize
    const tts = new EdgeTTS();
    
    const options = {};
    if (rateValue !== undefined) {
      options.rate = rateValue;
    }
    
    try {
      await tts.synthesize(text, resolvedVoice, options);
    } catch (synthError) {
      console.error('Synthesize error:', synthError);
      return NextResponse.json(
        { success: false, error: 'Speech synthesis failed. Please try again.' },
        { status: 500 }
      );
    }
    
    // Get audio as buffer - check if data exists
    let audioBuffer;
    try {
      audioBuffer = tts.toBuffer();
    } catch (bufferError) {
      console.error('Buffer error:', bufferError);
      return NextResponse.json(
        { success: false, error: 'Failed to generate audio. The text may be too short or contain unsupported characters.' },
        { status: 500 }
      );
    }
    
    // Reached only when the checks above did not explain the silence, so the
    // message stays vague on purpose. Retrying will not help, hence 422.
    if (!audioBuffer || audioBuffer.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `The ${resolvedVoice} voice produced no audio for that text. Try a different voice.`,
        },
        { status: 422 }
      );
    }

    // Return audio
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (error) {
    console.error('Edge TTS Error:', error);

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate speech' 
      },
      { status: 500 }
    );
  }
}
