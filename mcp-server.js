#!/usr/bin/env node
// mcp-server.js
// Standalone MCP server for Claude Desktop
// Run with: node mcp-server.js

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const BASE_URL = process.env.VARTERM_URL || 'https://varterm.com';

const VOICES = {
  premium: [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Warm, conversational' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Clear, professional' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Natural, friendly' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'British, refined' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Deep, authoritative' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Ultra realistic' },
  ],
};

async function generateSpeech(text, voiceId, speed = 1.0) {
  // Option 1: Use the hosted Varterm API
  if (!ELEVENLABS_API_KEY) {
    const response = await fetch(`${BASE_URL}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId, speed }),
    });
    
    if (!response.ok) {
      throw new Error(`Varterm API error: ${response.status}`);
    }
    
    return response.arrayBuffer();
  }
  
  // Option 2: Direct ElevenLabs API call
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',  // Updated: old models deprecated on free tier
        voice_settings: { stability: 0.5, similarity_boost: 0.75, speed },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return response.arrayBuffer();
}

function findVoice(query) {
  return VOICES.premium.find(
    v => v.id === query || v.name.toLowerCase() === query.toLowerCase()
  );
}

// Create MCP server
const server = new Server(
  {
    name: 'varterm-tts',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'text_to_speech',
        description: 'Convert text to natural-sounding speech using Varterm AI voices',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to convert to speech (max 5000 characters)',
            },
            voice: {
              type: 'string',
              description: 'Voice name: Sarah, Laura, Charlie, George, Liam, or Rachel',
            },
            speed: {
              type: 'number',
              description: 'Speech speed (0.5 to 2.0, default 1.0)',
            },
          },
          required: ['text'],
        },
      },
      {
        name: 'list_voices',
        description: 'List all available Varterm text-to-speech voices',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'list_voices') {
    const voiceList = VOICES.premium
      .map(v => `• ${v.name}: ${v.description}`)
      .join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `Available Varterm voices:\n\n${voiceList}\n\nUse any of these names with the text_to_speech tool.`,
        },
      ],
    };
  }

  if (name === 'text_to_speech') {
    const { text, voice = 'Sarah', speed = 1.0 } = args;

    if (!text) {
      return {
        content: [{ type: 'text', text: 'Error: Text is required' }],
        isError: true,
      };
    }

    if (text.length > 5000) {
      return {
        content: [{ type: 'text', text: 'Error: Text must be under 5000 characters' }],
        isError: true,
      };
    }

    try {
      const foundVoice = findVoice(voice) || VOICES.premium[0];
      const audioBuffer = await generateSpeech(text, foundVoice.id, speed);
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      return {
        content: [
          {
            type: 'text',
            text: `✓ Generated speech using ${foundVoice.name}'s voice (${text.length} characters)\n\nThe audio is ready. Here's a data URL you can use:\n\ndata:audio/mpeg;base64,${base64Audio.substring(0, 100)}...\n\n(Full audio data is ${base64Audio.length} characters)`,
          },
          {
            type: 'resource',
            resource: {
              uri: `data:audio/mpeg;base64,${base64Audio}`,
              mimeType: 'audio/mpeg',
              text: `Speech audio for: "${text.substring(0, 50)}..."`,
            },
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating speech: ${error.message}` }],
        isError: true,
      };
    }
  }

  return {
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Varterm MCP server running on stdio');
}

main().catch(console.error);
