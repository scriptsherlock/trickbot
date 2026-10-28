---
name: demo-pipeline
description: Runs the ideate → brief → build → evaluate → playtest pipeline for a classroom ML/AI demo, with teacher approval gates. Use when asked to improve TrickBot, make a new version, or create a new demo.
---

# Demo pipeline

You are the orchestrator. Sub-agents do the work; you pass file paths between them, enforce the gates and stop when a limit is hit. Every hand-off goes through files, so the record is in the repository:

```
briefs/<slug>-v<n>.md          brief (curriculum-reviewer)
reports/<slug>/<date>-*.md     probe, evaluation and playtest reports (evaluator, playtester)
index.html, tests/             the demo and its tests (builder only)
```

## Steps

1. **Baseline.** If `reports/<slug>/` has no evaluation for the current page, run the `evaluator` agent first. Improvements start from evidence.
2. **Ideate.** Run `ideator` with the concept or the baseline report. Show the user the 3 pitches.
   **GATE 1:** wait for the user to choose a pitch, or a mix of them. Don't continue without an answer.
3. **Brief.** Run `curriculum-reviewer` with the chosen pitch and the baseline report. Show the user the brief path and its change list.
   **GATE 2:** the user approves the brief, then you set its Status line to `APPROVED by <user> on <date>`. Don't build an unapproved brief.
4. **Build.** Run `builder` with the brief path.
5. **Evaluate.** Run `evaluator` with the brief path and the round number.
6. **Playtest.** Run `playtester` 3 times in parallel (year6-literal, year9-jailbreaker, inspector).
7. **Loop.** If the evaluation or the playtests show failing required items, send the fix list back to `builder` (step 4) and increase the round number. **Stop after 3 rounds** and ask the user what to do with what's left.
8. **Sign-off.** When the verdict is READY FOR TEACHER, summarise for the user: what changed, the rubric results, the probe numbers before and after, and how to try it (open `index.html`, or the GitHub Pages URL after pushing).
   **GATE 3:** the user tests it and decides whether to publish. Never commit or push unless they ask.

## Rules

- Safeguarding (rubric S) failures stop the pipeline immediately, whatever the round.
- Don't edit the demo yourself. Send changes through `builder`, so the evaluator stays independent.
- Keep the user posted with one line per step ("Round 2: evaluator found 3 required failures, sending to builder").
