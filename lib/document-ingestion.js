import crypto from 'node:crypto';

const DEFAULT_CHUNK_SIZE = 1800;
const DEFAULT_CHUNK_OVERLAP = 250;
const DEFAULT_MAX_CHUNKS = 2000;
const DEFAULT_MAX_TOTAL_CHARS = 1_000_000;

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, parsed));
}

function normalizeWhitespace(input) {
  return input.replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();
}

function tokenizeForSearch(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_\-./\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreChunk(queryTerms, chunk) {
  if (!queryTerms.length) {
    return 0;
  }

  const corpus = `${chunk.path}\n${chunk.text}`.toLowerCase();
  let score = 0;

  for (const term of queryTerms) {
    let index = corpus.indexOf(term);
    while (index >= 0) {
      score += 1;
      index = corpus.indexOf(term, index + term.length);
    }
  }

  // Mild path boost when query mentions filename fragments.
  if (queryTerms.some((term) => chunk.path.toLowerCase().includes(term))) {
    score += 2;
  }

  return score;
}

export function chunkDocuments(documents = [], options = {}) {
  const chunkSize = clampNumber(options.chunkSize, 400, 5000, DEFAULT_CHUNK_SIZE);
  const overlap = clampNumber(options.overlap, 0, Math.floor(chunkSize / 2), DEFAULT_CHUNK_OVERLAP);
  const maxChunks = clampNumber(options.maxChunks, 1, 20_000, DEFAULT_MAX_CHUNKS);
  const maxTotalChars = clampNumber(
    options.maxTotalChars,
    2_000,
    5_000_000,
    DEFAULT_MAX_TOTAL_CHARS
  );

  const chunks = [];
  const docSummaries = [];
  let totalChars = 0;
  let truncated = false;

  for (const document of documents) {
    const path = typeof document.path === 'string' ? document.path : 'untitled.txt';
    const normalizedText = normalizeWhitespace(String(document.content || ''));

    if (!normalizedText) {
      docSummaries.push({ path, skipped: true, reason: 'empty-document' });
      continue;
    }

    const docChunks = [];
    const step = Math.max(1, chunkSize - overlap);
    let chunkIndex = 0;

    for (let start = 0; start < normalizedText.length; start += step) {
      if (chunks.length >= maxChunks || totalChars >= maxTotalChars) {
        truncated = true;
        break;
      }

      const end = Math.min(start + chunkSize, normalizedText.length);
      const text = normalizedText.slice(start, end).trim();
      if (!text) {
        continue;
      }

      const remaining = maxTotalChars - totalChars;
      const finalText = text.slice(0, Math.max(0, remaining)).trim();

      if (!finalText) {
        truncated = true;
        break;
      }

      const chunk = {
        id: crypto.randomUUID(),
        path,
        index: chunkIndex,
        startChar: start,
        endChar: start + finalText.length,
        text: finalText,
      };

      chunks.push(chunk);
      docChunks.push(chunk);
      totalChars += finalText.length;
      chunkIndex += 1;

      if (finalText.length < text.length) {
        truncated = true;
        break;
      }

      if (end >= normalizedText.length) {
        break;
      }
    }

    docSummaries.push({
      path,
      characters: normalizedText.length,
      chunks: docChunks.length,
    });

    if (truncated) {
      break;
    }
  }

  return {
    chunks,
    docSummaries,
    chunkSize,
    overlap,
    maxChunks,
    maxTotalChars,
    totalChars,
    truncated,
  };
}

export function pickRelevantChunks(question, chunks, options = {}) {
  const maxChunks = clampNumber(options.maxChunks, 1, 50, 8);
  const maxContextChars = clampNumber(options.maxContextChars, 1_000, 50_000, 15_000);
  const terms = tokenizeForSearch(question).slice(0, 25);

  const ranked = [...chunks]
    .map((chunk) => ({
      chunk,
      score: scoreChunk(terms, chunk),
    }))
    .sort((a, b) => b.score - a.score || a.chunk.path.localeCompare(b.chunk.path));

  const selected = [];
  let usedChars = 0;

  for (const item of ranked) {
    if (selected.length >= maxChunks || usedChars >= maxContextChars) {
      break;
    }
    if (item.score <= 0 && selected.length > 0) {
      continue;
    }

    const remaining = maxContextChars - usedChars;
    const truncatedText = item.chunk.text.slice(0, remaining);
    if (!truncatedText.trim()) {
      break;
    }

    selected.push({
      ...item.chunk,
      text: truncatedText,
      score: item.score,
    });
    usedChars += truncatedText.length;
  }

  if (!selected.length) {
    return chunks.slice(0, Math.min(maxChunks, chunks.length)).map((chunk) => ({
      ...chunk,
      score: 0,
    }));
  }

  return selected;
}
