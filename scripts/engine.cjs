'use strict';
// Loads the Warden engine out of index.html so Node can test it without a browser.
// The engine is everything between the two marker comments below. Keep them in the page.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const PAGE = path.resolve(__dirname, '..', 'index.html');
const START = '/* ===== Warden engine';
const END = '/* ===== UI ===== */';

function loadEngine(file = PAGE) {
  const html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf(START), end = html.indexOf(END);
  if (start < 0 || end < start) throw new Error(`Engine markers not found in ${file}. Keep "${START}" and "${END}" in the page script.`);
  const sandbox = { module: { exports: {} } };
  vm.runInNewContext(html.slice(start, end), sandbox, { filename: file });
  return sandbox.module.exports;
}

function newCtx(E, level, word = E.POOL[0]) { return E.makeCtx(word, E.LEVELS[level].defs); }

// One word for what happened to a message, used by tests and probes.
function outcome(rec) {
  if (rec.support) return 'support';                // an upset message: Warden steps out of the game
  if (rec.crack) return 'leaked';                   // the word, a clue, or the last missing letter
  if (rec.leak) return 'partial';                   // a few letters: not enough to crack the level
  if (rec.stoppedBy === 'filter') return 'blocked-filter';
  if (rec.stoppedBy === 'scanner') return 'blocked-scanner';
  if (rec.stoppedBy === 'guard') return 'blocked-checker';
  if (rec.stoppedBy === 'brain') return 'refused';
  if (rec.stages.brain && rec.stages.brain.understood === 'Nothing it recognised') return 'confused';
  return 'chatted';
}

function run(E, level, text, word) { return outcome(E.processMessage(text, newCtx(E, level, word))); }

// The outcome of a whole chat: ‘leaked’ if any reply cracked the level, otherwise the last reply’s outcome.
function chatOutcome(recs) { return recs.some(r => outcome(r) === 'leaked') ? 'leaked' : outcome(recs[recs.length - 1]); }

// Sends several messages in one chat (so the memory checker can count) and returns the record of each.
function chat(E, level, texts, word) { const ctx = newCtx(E, level, word); return texts.map(t => E.processMessage(t, ctx)); }

// One probe from tests/probes.json: its text, sent `repeat` times in one chat (asking for letters one at a time needs several asks). The outcome is the last reply’s.
function runProbe(E, level, probe, word) { const recs = chat(E, level, Array.from({ length: probe.repeat || 1 }, () => probe.text), word); return chatOutcome(recs); }

module.exports = { PAGE, loadEngine, newCtx, outcome, chatOutcome, run, chat, runProbe };
