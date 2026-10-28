'use strict';
// Claude Code PostToolUse hook: after an edit to the page, engine or tests, run the checks and
// report failures back to Claude (exit code 2). Edits to other files are ignored.
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  let file = '';
  try { file = JSON.parse(input).tool_input?.file_path || ''; } catch { return; }
  if (!/(?:\.html|\.cjs|\.js|probes\.json)$/i.test(file)) return;
  const steps = [['scripts/check.cjs'], ['--test', 'tests/engine.test.cjs']];
  const failed = steps.map(args => spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' })).filter(r => r.status !== 0);
  if (!failed.length) return;
  process.stderr.write('TrickBot checks failed after editing ' + path.basename(file) + ':\n' + failed.map(r => (r.stdout + r.stderr).slice(-3000)).join('\n'));
  process.exitCode = 2;
});
