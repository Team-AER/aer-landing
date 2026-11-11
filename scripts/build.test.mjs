import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const dist = new URL('../dist/', import.meta.url);
const read = file => readFile(new URL(file, dist), 'utf8');
const manifest = JSON.parse(await read('build-manifest.json'));

test('landing pages contain real headings and first-party compiled entry points', async () => {
  for (const file of ['aer.app.html', 'cantis/index.html', 'polyjuicevoice/index.html']) {
    const html = await read(file);
    assert.match(html, /<h1[\s>]/);
    assert.match(html, /<script type="module" src="\/build\/[^\"]+\.js"/);
    assert.doesNotMatch(html, /unpkg\.com|text\/babel|src="[^\"]+\.jsx/);
    for (const [, url] of html.matchAll(/(?:src|href)="(\/build\/[^\"]+)"/g)) await read(url.slice(1));
  }
});

test('homepage navigation survives without JavaScript and workshop is independently recoverable', async () => {
  const html = await read('aer.app.html');
  for (const link of ['/muffliato/', '/pensieve/', '#projects', '#team']) assert.ok(html.includes(`href="${link}"`));
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /aria-busy="false"/);
  assert.match(html, /class="ws-retry" hidden/);
  assert.match(html, /<noscript>/);
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic|tweaks-panel/);
});

test('cold homepage stays within its transfer budget', async () => {
  assert.ok(manifest.home.gzipBytes + manifest.workshop.gzipBytes < 80 * 1024);
  const html = await read('aer.app.html');
  const fonts = await Promise.all(['space-grotesk-latin.woff2', 'jetbrains-mono-latin.woff2'].map(f => readFile(new URL(`assets/fonts/${f}`, dist))));
  const logo = await readFile(new URL('assets/brand/icon-192-20261010.png', dist));
  const total = gzipSync(html).length + fonts.reduce((n, f) => n + f.length, 0) + logo.length + manifest['home-style'].gzipBytes + manifest.home.gzipBytes + manifest.workshop.gzipBytes;
  assert.ok(total < 200 * 1024, `Initial resources total ${total} bytes`);
});

test('production output excludes JSX, build dependencies and local artifacts', async () => {
  const files = await readdir(dist, { recursive: true });
  for (const file of files) assert.doesNotMatch(file, /(^|\/)(node_modules|docs|output|scripts|\.git|\.playwright-cli)(\/|$)|\.(jsx|map)$/);
});

test('Muffliato samples retain Parakeet transcripts and original audio without public evaluation metadata', async () => {
  const html = await read('muffliato/index.html');
  const hashes = {
  "2300-131720-0035": {
    "before": "c1fbdba2d138e5343614e53c7dd61bccab0077377c932d7a1c96ebab3ead85b3",
    "after": "9d811cdf029539d06ac14c27bbaa405e619b684e732885fedf526081b63a1407"
  },
  "1995-1837-0024": {
    "before": "10c809017f8913c35b974d4b391559b5b6cd31aa1147189de72801b1cb1d91ae",
    "after": "17388012930fa82f6d8e78ef3cdd8e714def59d05b1eed181475969a02db8a5a"
  },
  "ami-TS3004d-000202-010-nested": {
    "before": "ec158560fa19113ce29364e886825ee5e556e18c9604f81f5fd9d27a2477a05b",
    "after": "7ba7918ac8ed613db82938bd7cbb04612709442d7ec82a6800bd504673d30745"
  },
  "2229-152864-0026": {
    "before": "d4c5f32432319416a16af3d86b398dd56cbb316bafcf500ef43a20f38a8c641c",
    "after": "4bafbdfdafd4b3c08993e2c0ab07e104040eb853bea4c1dced86bcd28895047d"
  },
  "2830-3980-0039": {
    "before": "fef83c59a80ee663c41d83adfee4beed8c2d8f141a2b6d400bb0881e4f9934e4",
    "after": "2b43a2f833d7861fb4205bf43dea56aa22a7f2064f9efbccacc3da0ec4abec69"
  }
};
  const folders = await readdir(new URL('muffliato/assets/samples/', dist));
  assert.deepEqual(folders.sort(), Object.keys(hashes).sort());
  assert.equal([...html.matchAll(/<audio controls controlslist="nodownload" preload="none"/g)].length, 10);
  assert.doesNotMatch(html, /\bdownload(?:=|\s|<)|metrics\.json|sample__(?:metrics|details|download)|\btau\b|τ/i);
  assert.equal([...html.matchAll(/class="sample__transcript-label">Recorded Parakeet-TDT transcript/g)].length, 10);
  assert.equal([...html.matchAll(/class="sample__transcript sample__transcript--empty">No text returned\./g)].length, 5);
  assert.match(html, /earlier muting evaluation achieved 97 to 99 percent attack success against OpenAI Whisper/);
  assert.match(html, /We also target NVIDIA Parakeet-TDT/);
  for (const folder of folders) {
    const base = `muffliato/assets/samples/${folder}`;
    assert.deepEqual((await readdir(new URL(`${base}/`, dist))).sort(), ['after.wav', 'before.wav']);
    for (const mode of ['before', 'after']) {
      const audio = await readFile(new URL(`${base}/${mode}.wav`, dist));
      assert.equal(createHash('sha256').update(audio).digest('hex'), hashes[folder][mode]);
      assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
      assert.equal(audio.toString('ascii', 8, 12), 'WAVE');
      assert.ok(html.includes(`src="/${base}/${mode}.wav"`));
      assert.ok(html.includes(`aria-labelledby="sample-${folder} ${folder}-${mode}"`));
    }
  }
});
