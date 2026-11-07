import { build, transform } from 'esbuild';
import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { gzipSync } from 'node:zlib';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const read = path => readFile(new URL(path, root), 'utf8');
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('build/', dist), { recursive: true });

// Explicit allowlist: source code, build dependencies and development files never ship.
for (const path of ['404.html', 'favicon.ico', 'assets', 'shared', 'styles', 'accio', 'athena', 'avifors', 'cantis', 'erised', 'hedwig', 'muffliato', 'omniocular', 'pensieve', 'polyjuicevoice', 'promptmask', 'quill', 'subtly']) {
  await cp(new URL(path, root), new URL(path, dist), {
    recursive: true,
    filter: source => !/\.(jsx|map)$/.test(source) && !/(?:^|\/)(?:output|docs|node_modules|\.playwright-cli|\.DS_Store)(?:\/|$)/.test(source)
  });
}

const manifest = {};
async function emit(name, code, ext = 'js') {
  const hash = createHash('sha256').update(code).digest('hex').slice(0, 12);
  const path = `build/${name}.${hash}.${ext}`;
  await writeFile(new URL(path, dist), code);
  manifest[name] = { url: `/${path}`, bytes: Buffer.byteLength(code), gzipBytes: gzipSync(code).length };
  return `/${path}`;
}

// JSX is an authoring format only. The homepage ships no React runtime.
async function prerender(source) {
  let markup;
  const document = {
    getElementById: () => null,
    createElement: () => ({ style: {}, textContent: '' }),
    head: { appendChild() {} },
    documentElement: { classList: { add() {} }, hasAttribute: () => false }
  };
  const matchMedia = () => ({ matches: false });
  const window = { matchMedia, innerWidth: 1280 };
  const context = vm.createContext({ React, ReactDOM: { createRoot: () => ({ render: element => { markup = renderToString(element); } }) }, document, window, matchMedia, console });
  const compiled = await transform(source, { loader: 'jsx', target: 'es2020' });
  vm.runInContext(compiled.code, context, { timeout: 10000 });
  if (!markup?.includes('<h1')) throw new Error('Prerender must contain a real heading');
  return markup;
}

const workshop = await emit('workshop', (await build({ entryPoints: [new URL('scripts/workshop.js', root).pathname], bundle: true, write: false, format: 'esm', minify: true, target: 'es2020' })).outputFiles[0].text);
const home = await emit('home', (await build({ entryPoints: [new URL('scripts/home.js', root).pathname], bundle: true, write: false, format: 'esm', minify: true, target: 'es2020', define: { __WORKSHOP_URL__: JSON.stringify(workshop) } })).outputFiles[0].text);
const homeMarkup = await prerender(await read('workshop.jsx') + '\n' + await read('app.jsx'));
let html = (await read('aer.app.html')).replace('<div id="root"></div>', `<div id="root">${homeMarkup}</div>`).replace('</body>', `<script type="module" src="${home}"></script>\n</body>`);
// Bundle local imports and minify all homepage CSS into one early-discovered file.
const css = await build({ stdin: { contents: '@import "./styles/site.css";\n@import "./styles/apps.css";\n@import "./styles/workshop.css";', resolveDir: root.pathname, loader: 'css' }, bundle: true, write: false, minify: true, external: ['/assets/*'] });
const stylesheet = await emit('home-style', css.outputFiles[0].text, 'css');
html = html.replace(/\s*<link rel="stylesheet" href="styles\/[^\"]+" \/>/g, '');
html = html.replace('</head>', `<link rel="stylesheet" href="${stylesheet}" />\n</head>`);
await writeFile(new URL('aer.app.html', dist), html);

for (const folder of ['cantis', 'polyjuicevoice']) {
  const source = (await Promise.all(['motion.jsx', 'illustrations.jsx', 'sections.jsx', 'app.jsx'].map(file => read(`${folder}/${file}`)))).join('\n');
  const markup = await prerender(source);
  const compiled = await build({ stdin: { contents: `import React from 'react'; import * as ReactDOM from 'react-dom/client';\n${source}`, resolveDir: root.pathname, loader: 'jsx' }, bundle: true, write: false, minify: true, format: 'esm', target: 'es2020', define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'eof' });
  const url = await emit(folder, compiled.outputFiles[0].text);
  let page = await read(`${folder}/index.html`);
  page = page.replace(/<script src="https:\/\/unpkg.com\/[^\n]+<\/script>\n/g, '').replace(/<script type="text\/babel"[^\n]+<\/script>\n/g, '');
  page = page.replace('<div id="root"></div>', `<div id="root">${markup}</div>`).replace('</body>', `<script type="module" src="${url}"></script>\n</body>`);
  // The rendered content is the no-JavaScript fallback; avoid duplicate noscript copy.
  page = page.replace(/<noscript>[\s\S]*?<\/noscript>/, '');
  await writeFile(new URL(`${folder}/index.html`, dist), page);
}

// No stale compiled assets survive a build; Docker copies only this directory.
await writeFile(new URL('build-manifest.json', dist), JSON.stringify(manifest, null, 2) + '\n');
if (manifest.home.gzipBytes + manifest.workshop.gzipBytes > 80 * 1024) throw new Error('Homepage JavaScript budget exceeded');
console.log(JSON.stringify(manifest, null, 2));
