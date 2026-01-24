// app/api/edge-tts/route.js
// Microsoft Edge TTS API endpoint - FREE neural voices

import { NextResponse } from 'next/server';
import { EdgeTTS } from '@andresaya/edge-tts';

// Popular Microsoft Edge neural voices
export const EDGE_VOICES = [
  // English US
  { id: 'en-US-AriaNeural', name: 'Aria', lang: 'en-US', gender: 'female', style: 'Friendly, positive' },
  { id: 'en-US-JennyNeural', name: 'Jenny', lang: 'en-US', gender: 'female', style: 'Warm, clear' },
  { id: 'en-US-GuyNeural', name: 'Guy', lang: 'en-US', gender: 'male', style: 'Casual, natural' },
  { id: 'en-US-DavisNeural', name: 'Davis', lang: 'en-US', gender: 'male', style: 'Calm, professional' },
  { id: 'en-US-TonyNeural', name: 'Tony', lang: 'en-US', gender: 'male', style: 'Friendly, upbeat' },
  { id: 'en-US-SaraNeural', name: 'Sara', lang: 'en-US', gender: 'female', style: 'Cheerful, expressive' },
  // English UK
  { id: 'en-GB-SoniaNeural', name: 'Sonia', lang: 'en-GB', gender: 'female', style: 'British, warm' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', lang: 'en-GB', gender: 'male', style: 'British, professional' },
  // English Australia
  { id: 'en-AU-NatashaNeural', name: 'Natasha', lang: 'en-AU', gender: 'female', style: 'Australian, friendly' },
  { id: 'en-AU-WilliamNeural', name: 'William', lang: 'en-AU', gender: 'male', style: 'Australian, clear' },
];

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

// GET /api/edge-tts - List available voices
export async function GET() {
  return NextResponse.json({
    success: true,
    voices: EDGE_VOICES,
    note: 'Free Microsoft Edge neural voices',
  });
}

// POST /api/edge-tts - Generate speech
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, voice = 'en-US-AriaNeural', rate = 1 } = body;

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
    
    await tts.synthesize(text, voice, options);
    
    // Get audio as buffer
    const audioBuffer = tts.toBuffer();

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
