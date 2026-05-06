import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { checkExtensionAuth } from '@/lib/extension-auth';
import { pickRelevantChunks } from '@/lib/document-ingestion';
import { getDocumentSession } from '@/lib/document-session-store';

const DEFAULT_MODEL = process.env.VARTERM_ASK_MODEL || 'claude-3-5-sonnet-latest';

function jsonCors(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function formatContext(chunks) {
  return chunks
    .map((chunk) => `File: ${chunk.path}\nChunk: ${chunk.index}\n${chunk.text}`)
    .join('\n\n---\n\n');
}

async function answerWithAnthropic(question, chunks) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  const client = new Anthropic({ apiKey });
  const context = formatContext(chunks);
  const response = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 700,
    temperature: 0.2,
    system:
      'You answer questions from provided document excerpts. If the answer is uncertain, say so briefly and cite files used.',
    messages: [
      {
        role: 'user',
        content: `Question:\n${question}\n\nDocument excerpts:\n${context}`,
      },
    ],
  });

  const text = response.content
    .map((item) => (item.type === 'text' ? item.text : ''))
    .join('\n')
    .trim();

  return text || 'No answer generated.';
}

function answerWithoutModel(question, chunks) {
  const summary = chunks
    .slice(0, 3)
    .map((chunk) => `- ${chunk.path} (chunk ${chunk.index + 1})`)
    .join('\n');

  const excerpt = chunks[0]?.text?.slice(0, 600) || '';
  return [
    `No LLM backend is configured, so this is a retrieval-only response for: "${question}".`,
    'Top relevant sources:',
    summary || '- No ranked sources available',
    excerpt ? `\nFirst excerpt:\n${excerpt}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  const authResult = checkExtensionAuth(request);
  if (!authResult.ok) {
    return jsonCors(authResult.body, { status: authResult.status });
  }

  try {
    const payload = await request.json();
    const sessionId = String(payload.sessionId || '');
    const question = String(payload.question || '').trim();

    if (!sessionId) {
      return jsonCors({ error: 'sessionId is required' }, { status: 400 });
    }
    if (!question) {
      return jsonCors({ error: 'question is required' }, { status: 400 });
    }

    const session = await getDocumentSession(sessionId);
    if (!session) {
      return jsonCors(
        { error: 'Session not found or expired. Re-ingest documents and try again.' },
        { status: 404 }
      );
    }

    const selectedChunks = pickRelevantChunks(question, session.chunks, {
      maxChunks: payload.maxChunks,
      maxContextChars: payload.maxContextChars,
    });

    const answer =
      (await answerWithAnthropic(question, selectedChunks)) ||
      answerWithoutModel(question, selectedChunks);

    return jsonCors({
      success: true,
      result: {
        answer,
        sessionId,
        sources: selectedChunks.map((chunk) => ({
          path: chunk.path,
          chunk: chunk.index,
          score: chunk.score,
          startChar: chunk.startChar,
          endChar: chunk.endChar,
        })),
      },
    });
  } catch (error) {
    console.error('Ask API error:', error);
    return jsonCors({ error: error.message || 'Failed to answer question' }, { status: 500 });
  }
}
