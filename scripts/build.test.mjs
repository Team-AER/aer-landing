import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

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
