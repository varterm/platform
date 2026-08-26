#!/usr/bin/env node
/**
 * Smoke-test homepage branding + analytics wiring.
 *
 * Usage:
 *   node scripts/verify-homepage-smoke.mjs
 *   BASE_URL=http://localhost:3010 node scripts/verify-homepage-smoke.mjs
 *   BASE_URL=https://varterm.com node scripts/verify-homepage-smoke.mjs
 */

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-REDTPLJXE9';

/** @typedef {{ name: string; pass: boolean; detail?: string }} Check */

/** @returns {Promise<string>} */
async function fetchHomeHtml() {
  const response = await fetch(`${BASE_URL}/`, {
    headers: { Accept: 'text/html' },
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(`GET ${BASE_URL}/ returned HTTP ${response.status}`);
  }
  return response.text();
}

/** @param {string} html @returns {Check[]} */
function runChecks(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch?.[1]?.trim() ?? '(missing)';
  const h1Match = html.match(/id="hero-heading"[^>]*>([^<]+)/i);
  const h1 = h1Match?.[1]?.trim() ?? '(missing)';

  return [
    {
      name: 'title uses Converter branding',
      pass: title.includes('Free Text to Speech Converter') && !title.includes('Online'),
      detail: title,
    },
    {
      name: 'h1 uses Converter without Online',
      pass: h1.includes('Free Text to Speech Converter') && !h1.includes('Online'),
      detail: h1,
    },
    {
      name: 'Google Analytics gtag loader present',
      pass: html.includes(`googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`),
    },
    {
      name: 'Google Analytics config present',
      pass: html.includes(GA_MEASUREMENT_ID) && html.includes('dataLayer'),
    },
    {
      name: 'Beam analytics removed',
      pass: !html.toLowerCase().includes('beamanalytics'),
    },
  ];
}

async function main() {
  console.log(`Verifying ${BASE_URL}/ (GA ${GA_MEASUREMENT_ID})`);

  const html = await fetchHomeHtml();
  const checks = runChecks(html);

  let failed = 0;
  for (const check of checks) {
    const status = check.pass ? 'PASS' : 'FAIL';
    const detail = check.detail ? ` — ${check.detail}` : '';
    console.log(`${status}: ${check.name}${detail}`);
    if (!check.pass) failed += 1;
  }

  if (failed > 0) {
    process.exitCode = 1;
    console.error(`\n${failed} check(s) failed.`);
  } else {
    console.log('\nAll homepage smoke checks passed.');
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
