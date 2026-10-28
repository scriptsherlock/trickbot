'use strict';
// Runs every message in tests/probes.json on every level and prints a Markdown report.
// Measures the two things that bore pupils: messages the bot doesn't understand, and tricks that win everywhere.
const fs = require('node:fs');
const path = require('node:path');
const { loadEngine, runProbe } = require('./engine.cjs');

const E = loadEngine();
const { probes } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'tests', 'probes.json'), 'utf8'));
const levels = E.LEVELS.map((_, i) => i);
const short = { leaked: 'LEAK', partial: 'part', support: 'help', refused: 'no', 'blocked-filter': 'filter', 'blocked-scanner': 'scanner', 'blocked-checker': 'checker', confused: '??', chatted: 'chat' };
const rows = probes.map(p => ({ ...p, out: levels.map(l => runProbe(E, l, p)) }));

const lines = [];
lines.push(`# Probe report`, '', `${probes.length} messages × ${levels.length} levels. \`??\` means Warden did not understand. A message marked (xN) is sent N times in one chat; the result is for the last reply.`, '');
lines.push(`| Persona | Message | ${levels.map(l => `L${l + 1}`).join(' | ')} |`, `|---|---|${levels.map(() => '---').join('|')}|`);
for (const r of rows) lines.push(`| ${r.persona} | ${r.text.replace(/\|/g, '\\|')}${r.repeat > 1 ? ` (x${r.repeat})` : ''} | ${r.out.map(o => short[o]).join(' | ')} |`);

const confused = rows.filter(r => r.out.every(o => o === 'confused'));
const everywhere = rows.filter(r => r.out.every(o => o === 'leaked'));
const rate = rows.flatMap(r => r.out).filter(o => o === 'confused').length / (rows.length * levels.length);
lines.push('', '## Summary', '');
lines.push(`- **Not understood:** ${(rate * 100).toFixed(0)}% of all responses (rubric target: under 15%).`);
lines.push(`- **Never understood on any level (${confused.length}):** ${confused.map(r => `"${r.text}"`).join(', ') || 'none'}`);
const boss = everywhere.filter(r => r.boss), stray = everywhere.filter(r => !r.boss);
lines.push(`- **Wins every level (${everywhere.length}):** ${everywhere.map(r => `"${r.text}"${r.boss ? ' [boss route]' : ''}`).join(', ') || 'none'}`);
lines.push(`- **Wins every level, not the named boss route (${stray.length}):** ${stray.map(r => `"${r.text}"`).join(', ') || 'none'} (target: none). ${boss.length} named boss-route probe(s) win every level, as designed.`);
for (const l of levels) lines.push(`- **Level ${l + 1}:** ${rows.filter(r => r.out[l] === 'leaked').length} of ${rows.length} messages crack it (${rows.filter(r => r.out[l] === 'partial').length} more give away only a few letters).`);
console.log(lines.join('\n'));
process.exitCode = 0;
