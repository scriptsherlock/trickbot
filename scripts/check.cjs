'use strict';
// Static delivery checks from templates/rubric.md (section D: delivery). FAIL exits 1; WARN is reported only.
const fs = require('node:fs');
const path = require('node:path');
const { PAGE, loadEngine } = require('./engine.cjs');

const html = fs.readFileSync(PAGE, 'utf8');
const results = [];
const add = (level, id, detail) => results.push({ level, id, detail });
const all = re => [...html.matchAll(re)].map(m => m[0].slice(0, 90));

const external = all(/<(?:script|link|img|iframe|source|video|audio)\b[^>]*\b(?:src|href)\s*=\s*["']?(?:https?:)?\/\/[^"'\s>]+/gi)
  .concat(all(/@import\s+url\(\s*["']?(?:https?:)?\/\/[^)]+|url\(\s*["']?(?:https?:)?\/\/[^)]+/gi));
if (external.length) add('FAIL', 'D1 no-network', `Loads ${external.length} external resource(s), which breaks offline use and school filters: ${external.join(' | ')}`);

const network = all(/\b(?:fetch|sendBeacon|importScripts)\s*\(|\bnew\s+(?:XMLHttpRequest|WebSocket|EventSource)\b/g);
if (network.length) add('FAIL', 'D1 no-network', `Uses network APIs: ${network.join(', ')}`);

if (/<script\b[^>]*type\s*=\s*["']?module/i.test(html)) add('FAIL', 'D2 opens-from-file', 'Module scripts do not run from file:// (students opening a downloaded copy).');

const storage = all(/\b(?:localStorage|sessionStorage|indexedDB|document\.cookie)\b/g);
if (storage.length) add('FAIL', 'D3 nothing-stored', `Stores data on the device: ${[...new Set(storage)].join(', ')}`);

if (/\beval\s*\(|\bnew\s+Function\s*\(/.test(html)) add('FAIL', 'D4 no-eval', 'Uses eval or new Function.');

for (const ref of html.matchAll(/\b(?:src|href)\s*=\s*["']([^"'#:]+?)["']/gi)) {
  if (ref[1].startsWith('/') || ref[1].startsWith('./') || /^[\w-]+(?:\/[\w.-]+)*\.\w+$/.test(ref[1])) {
    if (ref[1].startsWith('/')) add('FAIL', 'D5 relative-paths', `Root-relative path "${ref[1]}" breaks on GitHub Pages project URLs and file://.`);
    else if (!fs.existsSync(path.resolve(path.dirname(PAGE), ref[1]))) add('FAIL', 'D5 relative-paths', `Missing local file "${ref[1]}".`);
  }
}

const kb = Buffer.byteLength(html) / 1024;
if (kb > 1024) add('FAIL', 'D6 size', `Page is ${kb.toFixed(0)} KB (limit 1024 KB for slow school networks).`);
else if (kb > 300) add('WARN', 'D6 size', `Page is ${kb.toFixed(0)} KB (aim for under 300 KB).`);

// Inspect-resilience (rubric section I): students will read the source.
try {
  const E = loadEngine();
  // E.POOL is the decoded word list (the page stores it encoded and decodes it at load).
  const lower = html.toLowerCase();
  const visible = (E.POOL || []).filter(p => lower.includes(p.w.toLowerCase()));
  if (visible.length) add('WARN', 'I1 answers-in-source', `${visible.length} of ${E.POOL.length} passwords are readable in View Source; a student can try every one.`);
  if ((E.POOL || []).length < 40) add('WARN', 'I1 answers-in-source', `Only ${(E.POOL || []).length} passwords in the pool; aim for 40 or more.`);
} catch (error) { add('FAIL', 'D7 engine-loads', error.message); }
// Teacher tools (level table, "Unlock all levels") may only be built by script, and only at the #teacher address.
const staticHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '');
if (/Unlock all levels/i.test(staticHtml) || (/Unlock all levels/i.test(html) && !/location\.hash\s*===?\s*['"]#teacher['"]/.test(html))) add('WARN', 'I2 spoilers-reachable', 'Teacher tools (level table, "Unlock all levels") are one click away from students.');

const fails = results.filter(r => r.level === 'FAIL');
for (const r of results) console.log(`${r.level.padEnd(4)}  ${r.id.padEnd(22)} ${r.detail}`);
console.log(fails.length ? `\n${fails.length} delivery check(s) failed.` : `\nDelivery checks passed (${results.length} warning(s)).`);
process.exitCode = fails.length ? 1 : 0;
