# CLAUDE.md

## What this is

**Trick the Bot**: a prompt-injection game for Years 6–9. Pupils trick "Warden", a guard chatbot, into leaking a password across 15 levels of defences in 4 acts. They then switch sides in the Defend tab and collect the tricks they used in a Trick book. Warden is a **rule-based simulation** (regex intent matching in `analyse()` and `decide()`), not a language model.

## Delivery constraints (non-negotiable)

- Pupils **cannot run a server**. The product is one file, [index.html](index.html), served from GitHub Pages (`scriptsherlock/trickbot`) or opened from disk. Inline all CSS and JS. No CDNs, web fonts, module scripts, `fetch`, storage or eval. `npm run check` enforces this.
- Pupils are sharp. They **read the source and use DevTools**, and they bore quickly. Design accordingly; see sections I and E of [templates/rubric.md](templates/rubric.md).

## Page structure

All of the code is in `index.html`:
- **CSS (top of the file):** tokens on `:root`, with dark-mode overrides.
- **Engine:** between `/* ===== Warden engine` and `/* ===== UI ===== */`. Pure logic, no DOM: data (`POOL`, `DEFENCES`, `LEVELS`, `TRICKS`, `BATTERY`), patterns (`RX`), then `processMessage(text, ctx)`. That function runs the stages: message filter, then `analyse` + `decide` (Warden's brain), then the answer scanner, then the reply checkers (letter, code, memory, meaning, line, word, backwards, last-letter). It returns a record with `stages`, `final`, `leak`, `tags` and `stoppedBy`. **Keep both marker comments and the `module.exports` line.** [scripts/engine.cjs](scripts/engine.cjs) uses them to load the engine into Node.
- **UI:** an IIFE with one state object `S`. It renders the Attack view (a numbered level strip with no acts shown to pupils, chat, and a "What happened" drawer that opens on demand), the Defend view (locked until level 15 is cracked; see `defendOpen()`) (toggles run `BATTERY` plus the pupil's own winning messages against the `LIGHTHOUSE` password) and the Trick book. Escape all user text with `esc()`.

## Commands (developer only; Node 22+, no dependencies)

```sh
npm run check   # delivery checks (scripts/check.cjs), then the engine tests
npm test        # tests/engine.test.cjs: pins the 15-level design (what each level closes and what still works)
npm run probe   # runs tests/probes.json on every level; reports "not understood" % and tricks that win every level
```

`todo` tests describe known design problems. Turn them into normal tests when they're fixed.

## Agent pipeline

Ideate → brief → build → evaluate → playtest, with teacher approval gates. To run it, ask Claude to use the `demo-pipeline` skill.
- **Agents:** [.claude/agents/](.claude/agents/).
- **Templates:** [templates/](templates/) (brief, rubric, report).
- **Output:** briefs go to `briefs/`, evidence to `reports/<slug>/`.
- **Hook:** [.claude/settings.json](.claude/settings.json) runs the checks after every edit to the page, scripts or tests, and feeds any failures back to Claude.

## Conventions

- Copy is British English, for children: short sentences, no "the AI thinks". Warden's replies stay kind.
- Use curly quotes in JS strings as `’`/`“`, matching the existing code.
- On laptops the page is locked to the screen height and only panels scroll. Pupils get confused by long pages, so keep new content inside an existing panel or behind a toggle. Check with a 1366×680 window that nothing pushes the page taller.
- Keep accessibility: ARIA tabs, `<dialog>`, `aria-live` chat, reduced motion, and text alongside colour.
- Teacher tools (level table, unlock button) are built by script only at `index.html#teacher`. Level codes (`levelCode`, `parseLevelCode`) carry progress between lessons; nothing is stored. `POOL` is stored encoded in the page and decoded at load.
- Safeguarding: a message that sounds upset (sadness, bullying, self-harm, feeling unsafe) gets an out-of-character support reply on every level (`rec.support`, outcome `support`). Pupil words are echoed back only if short and not on the veiled blocklist (`okEcho`).
