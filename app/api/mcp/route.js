// app/api/mcp/route.js
// MCP (Model Context Protocol) endpoint for Claude integration
// This implements a simplified MCP-over-HTTP for Claude Desktop

import { NextResponse } from 'next/server';
import { generateSpeech, getVoices, findVoice, DEFAULT_VOICE_ID } from '@/lib/elevenlabs';

const MCP_SERVER_INFO = {
  name: 'varterm-tts',
  version: '1.0.0',
  description: 'Convert text to natural speech with Varterm',
  vendor: 'Varterm',
};

const TOOLS = [
  {
    name: 'text_to_speech',
    description: 'Convert text to spoken audio using premium AI voices. Returns a URL to the generated audio file.',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to convert to speech (max 5000 characters)',
        },
        voice: {
          type: 'string',
          description: 'Voice name to use (e.g., "Sarah", "Charlie", "Rachel"). Optional - defaults to Sarah.',
        },
        speed: {
          type: 'number',
          description: 'Speech speed from 0.5 (slow) to 2.0 (fast). Default is 1.0.',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'list_voices',
    description: 'Get a list of all available text-to-speech voices with their names and descriptions.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

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

// GET /api/mcp - Return server info and capabilities
export async function GET() {
  return NextResponse.json({
    ...MCP_SERVER_INFO,
    tools: TOOLS,
    instructions: `
Varterm Text-to-Speech allows you to convert any text into natural-sounding audio.

Available tools:
- text_to_speech: Convert text to audio. Provide the text and optionally a voice name.
- list_voices: See all available voices.

Example usage:
1. First list voices to see options: use list_voices
2. Then generate speech: use text_to_speech with text="Hello world" and voice="Sarah"
    `.trim(),
  });
}

// POST /api/mcp - Handle tool calls
export async function POST(request) {
  try {
    const body = await request.json();
    const { method, params, tool, arguments: args } = body;

    // Handle different MCP request formats
    const toolName = tool || method;
    const toolArgs = args || params || {};

    if (!toolName) {
      return NextResponse.json(
        { error: 'Tool name is required' },
        { status: 400 }
      );
    }

    // Route to appropriate handler
    switch (toolName) {
      case 'text_to_speech':
        return handleTextToSpeech(toolArgs);
      
      case 'list_voices':
        return handleListVoices();
      
      case 'initialize':
        return NextResponse.json({
          protocolVersion: '1.0',
          serverInfo: MCP_SERVER_INFO,
          capabilities: { tools: true },
        });
      
      case 'tools/list':
        return NextResponse.json({ tools: TOOLS });
      
      default:
        return NextResponse.json(
          { error: `Unknown tool: ${toolName}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('MCP Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleTextToSpeech(args) {
  const { text, voice, speed = 1.0 } = args;

  if (!text) {
    return NextResponse.json({
      error: 'Text is required',
    }, { status: 400 });
  }

  if (text.length > 5000) {
    return NextResponse.json({
      error: 'Text must be under 5000 characters',
    }, { status: 400 });
  }

  // Resolve voice
  let voiceId = DEFAULT_VOICE_ID;
  let voiceName = 'Sarah';
  
  if (voice) {
    const found = findVoice(voice);
    if (found) {
      voiceId = found.id;
      voiceName = found.name;
    }
  }

  try {
    // Generate the audio
    const audioBuffer = await generateSpeech(text, {
      voiceId,
      speed: Math.max(0.5, Math.min(2.0, speed)),
    });

    // Convert to base64 for response
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({
      success: true,
      result: {
        message: `Generated speech using ${voiceName}'s voice (${text.length} characters)`,
        audioDataUrl: dataUrl,
        voice: voiceName,
        characterCount: text.length,
        // Provide instructions for the AI
        note: 'The audio has been generated. The audioDataUrl contains the MP3 audio as a data URL that can be played in a browser.',
      },
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

function handleListVoices() {
  const voices = getVoices();
  
  const formatted = voices.all.map(v => ({
    name: v.name,
    description: v.description,
    gender: v.gender,
  }));

  return NextResponse.json({
    success: true,
    result: {
      voices: formatted,
      count: formatted.length,
      recommendation: 'Sarah and Rachel are great for general use. Charlie and George work well for narrative content.',
    },
  });
}
