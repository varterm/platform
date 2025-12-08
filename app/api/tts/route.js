// app/api/tts/route.js
// Text-to-Speech API endpoint for GPT Actions and general use

import { NextResponse } from 'next/server';
import { generateSpeech, findVoice, DEFAULT_VOICE_ID, getVoices } from '@/lib/elevenlabs';

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/tts - List available voices
export async function GET() {
  const voices = getVoices();
  
  return NextResponse.json({
    success: true,
    voices: voices.all.map(v => ({
      id: v.id,
      name: v.name,
      description: v.description,
      gender: v.gender,
    })),
    default_voice: DEFAULT_VOICE_ID,
  });
}

// POST /api/tts - Generate speech from text
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, voice, voiceId, speed = 1.0, stability = 0.5 } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Text must be under 5000 characters' },
        { status: 400 }
      );
    }

    // Resolve voice ID
    let resolvedVoiceId = voiceId || DEFAULT_VOICE_ID;
    
    if (voice && !voiceId) {
      const foundVoice = findVoice(voice);
      if (foundVoice) {
        resolvedVoiceId = foundVoice.id;
      }
    }

    // Generate speech
    const audioBuffer = await generateSpeech(text, {
      voiceId: resolvedVoiceId,
      speed: Math.max(0.5, Math.min(2.0, speed)),
      stability: Math.max(0, Math.min(1, stability)),
    });

    // Return audio directly
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (error) {
    console.error('TTS Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate speech' 
      },
      { status: 500 }
    );
  }
}
