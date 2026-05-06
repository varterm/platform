import { NextResponse } from 'next/server';
import { checkExtensionAuth } from '@/lib/extension-auth';
import { chunkDocuments } from '@/lib/document-ingestion';
import { createDocumentSession, getSessionTtlMs } from '@/lib/document-session-store';

const MAX_DOCUMENTS_PER_REQUEST = 30;
const MAX_FILE_CHARS = 200_000;

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

function sanitizeDocument(document) {
  const path = String(document.path || 'untitled.txt');
  const content = String(document.content || '');
  return {
    path,
    content: content.slice(0, MAX_FILE_CHARS),
    truncated: content.length > MAX_FILE_CHARS,
  };
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
    const rawDocuments = Array.isArray(payload.documents) ? payload.documents : [];

    if (!rawDocuments.length) {
      return jsonCors({ error: 'documents is required' }, { status: 400 });
    }

    if (rawDocuments.length > MAX_DOCUMENTS_PER_REQUEST) {
      return jsonCors(
        { error: `Too many documents. Max per request: ${MAX_DOCUMENTS_PER_REQUEST}` },
        { status: 400 }
      );
    }

    const documents = rawDocuments.map(sanitizeDocument);
    const ingestion = chunkDocuments(documents, payload.options || {});
    const anyTruncated = ingestion.truncated || documents.some((doc) => doc.truncated);

    if (!ingestion.chunks.length) {
      return jsonCors({ error: 'No usable text content found' }, { status: 400 });
    }

    const session = await createDocumentSession({
      chunks: ingestion.chunks,
      docSummaries: ingestion.docSummaries,
      totalChars: ingestion.totalChars,
      options: {
        chunkSize: ingestion.chunkSize,
        overlap: ingestion.overlap,
      },
    });

    return jsonCors({
      success: true,
      result: {
        sessionId: session.sessionId,
        expiresInMs: getSessionTtlMs(),
        documentCount: ingestion.docSummaries.length,
        chunkCount: ingestion.chunks.length,
        totalChars: ingestion.totalChars,
        truncated: anyTruncated,
        documents: ingestion.docSummaries,
      },
    });
  } catch (error) {
    console.error('Ingest API error:', error);
    return jsonCors(
      { error: error.message || 'Failed to ingest documents' },
      { status: 500 }
    );
  }
}
