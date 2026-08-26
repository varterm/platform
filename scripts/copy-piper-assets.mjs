#!/usr/bin/env node
// Stage the WASM that offline (Piper) voices need into public/piper/.
// Self-hosting these means offline mode does not reach for a CDN at play time,
// and the runtime always matches the onnxruntime-web version we bundle.
import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ortSrc = join(root, 'node_modules', 'onnxruntime-web', 'dist');
const piperSrc = join(root, 'node_modules', '@diffusionstudio', 'piper-wasm', 'build');
const ortDest = join(root, 'public', 'piper', 'ort');
const piperDest = join(root, 'public', 'piper');

// Every browser with OPFS support also has WASM SIMD, and we never request the
// WebGPU/WebNN execution providers, so the plain and jsep builds are dead weight.
const ORT_FILES = ['ort-wasm-simd.wasm', 'ort-wasm-simd-threaded.wasm'];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function copyIfChanged(from, to) {
  const source = await stat(from);
  if (await exists(to)) {
    const target = await stat(to);
    if (target.size === source.size) {
      return false;
    }
  }
  await copyFile(from, to);
  return true;
}

async function main() {
  if (!(await exists(ortSrc)) || !(await exists(piperSrc))) {
    console.warn('[piper-assets] dependencies not installed yet, skipping');
    return;
  }

  await mkdir(ortDest, { recursive: true });

  let copied = 0;
  for (const name of ORT_FILES) {
    if (await copyIfChanged(join(ortSrc, name), join(ortDest, name))) {
      copied += 1;
    }
  }

  // Drop anything a previous run staged that we no longer ship.
  for (const name of await readdir(ortDest)) {
    if (!ORT_FILES.includes(name)) {
      await rm(join(ortDest, name), { force: true });
    }
  }

  for (const name of ['piper_phonemize.wasm', 'piper_phonemize.data']) {
    if (await copyIfChanged(join(piperSrc, name), join(piperDest, name))) {
      copied += 1;
    }
  }

  console.log(
    copied
      ? `[piper-assets] staged ${copied} file(s) into public/piper/`
      : '[piper-assets] already up to date'
  );
}

await main();
