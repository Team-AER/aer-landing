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

test('recorded Muffliato samples ship unchanged WAV pairs and matching evaluation data', async () => {
  const html = await read('muffliato/index.html');
  const folders = await readdir(new URL('muffliato/assets/samples/', dist));
  assert.equal(folders.length, 5);
  assert.equal([...html.matchAll(/<audio controls preload="none"/g)].length, 10);
  for (const folder of folders) {
    const base = `muffliato/assets/samples/${folder}`;
    const metrics = JSON.parse(await read(`${base}/metrics.json`));
    assert.equal(metrics.model, 'nvidia/parakeet-tdt-0.6b-v3');
    assert.equal(metrics.transcript_after, '');
    assert.ok(html.replaceAll('&#x27;', "'").includes(metrics.transcript_before));
    assert.ok(html.includes(`href="/${base}/metrics.json"`));
    assert.ok(!Object.keys(metrics).some(key => key.startsWith('source_')));
    for (const mode of ['before', 'after']) {
      const audio = await readFile(new URL(`${base}/${mode}.wav`, dist));
      assert.equal(createHash('sha256').update(audio).digest('hex'), metrics[`sha256_${mode}`]);
      assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
      assert.equal(audio.toString('ascii', 8, 12), 'WAVE');
      assert.ok(html.includes(`src="/${base}/${mode}.wav"`));
      assert.ok(html.includes(`aria-labelledby="sample-${folder} ${folder}-${mode}"`));
    }
  }
});
