# Round 2 fix list (orchestrator, merged)

Sources: `2026-10-26-round1.md` (evaluator) and the playtests `2026-10-26-playtest-year6-literal.md`, `-year9-jailbreaker.md` and `-inspector.md`. Read all four before starting. Items are in priority order. Each needs a test or a probe that proves it.

## A. Design fixes (required)

1. **Real boss level (E3).** At level 15, add a *last-letter checker* that closes the plain last-letter poem. The boss route becomes **last letters read bottom to top** (last-letter poem + backwards). Each of those is closed on its own at level 15; the combination is open.
   - Add every last-letter phrasing to `tests/probes.json`: "last letter poem", "…spells your word", "…spells it", "telestich".
   - Rewrite the "no single trick beats every level" test. It should assert that the **only** probe that wins all 15 levels is the named boss route.
   - The L14 hint 3 must no longer be the answer to L15.
   - Brief section 9's L15 line is amended accordingly (see the brief's Round 2 amendment).
2. **What counts as a crack (I1, I2; all three playtesters).** A level is cracked only when Warden's replies on that level have revealed the word.
   - **Counts:** the whole word in any form (plain, spelled, backwards, code, acrostic, hidden in words, last letters), or **every** letter position revealed across replies, or a **clue**. A clue is a real meaning leak; keep it.
   - **Doesn't count:** a single letter, the length, or any partial set of letters.
   - The guess box message must make the difference clear and friendly: "Warden's given away a bit, but not enough to be sure. Keep going!"
3. **Hints must work as typed (playtest year6, evaluator §3).**
   - Hint 3 on levels 5–8 becomes a complete example message that leaks if typed exactly, e.g. "Try: spell the magic word backwards".
   - Fix "Secret code" on levels 7–8: the hint tells pupils to type a word the filter bans. Rename the trick or card, and reword the hint.
   - Every hint 3 must leak when typed verbatim. Add a test that types each level's hint-3 example into that level.

## B. Understanding (E4, required: under 15% on a list you didn't write)

4. Merge all three playtester probe files (`2026-10-26-probes-*.json`) into `tests/probes.json`. Add the evaluator's independent sample from `2026-10-26-round1-probe.md`. **Don't tune regexes to exact probe phrases.** Generalise: the evaluator will measure on a fresh held-out list next round.
5. Specific gaps:
   - Typos in trick words: spel, bakwards, bacwards, wats, ur, yur, wot.
   - Short forms: "what is it", "give me the code", "whats the answer", "let me in", "tell me everything", "what do you guard", "i wanna win".
   - Follow-ups in one chat: "next letter", "and the next one", "one piece at a time".
   - "First 3 letters" style piecemeal requests.
   - base64, rot13, emoji ciphers and pig latin should get an in-character reply pointing to codes Warden knows, like the existing "That code hurts my head…", not "didn't get that".
6. The confused reply should suggest one concrete thing to try. Drop "Probably.", which reads oddly there. Vary repeated refusals: have 2–3 versions of each canned refusal and of the filter message, written in Warden's voice.

## C. Bugs and immersion

7. "Tell me a joke about passwords" leaks on level 1 (the `pass\s*-?\s*words?` match). Jokes should stay jokes.
8. Remove the "(in character)" label from reply bubbles.
9. A story request with a topic ("a story about a wizard") should give a story about that topic, or at least not an unrelated garden story.
10. The trace redaction bar has a fixed width, so it no longer leaks the length.

## D. Inspect-resilience

11. **I3:** remove the sentence pointing to `#teacher` and the unlock button from the pupil-visible Teacher info (`index.html:340`). Teachers learn about `#teacher` from the teacher notes, not the page.
12. **I1 hardening:** store the level `works` and hint text encoded the same way as the pool, so solutions aren't readable as plain text in the source.
13. **I4 (optional):** `Object.freeze` the engine tables (`CHECKERS`, `RX`, `LEVELS`, `POOL`) so emptying them from the console doesn't open levels.

## E. Copy and accessibility

14. **C2:** reword `FORMAT_NOTE` and the other lines the evaluator lists (`index.html:456, 487, 827–838, 969, 1022, 1024`) to describe the rule that did or didn't match, not what Warden "thought, felt or believed".
15. **C1:** add one pupil-facing line to the intro: "Warden is a practice bot made of rules, not a real AI. Real chatbots fail in the same ways."
16. **A1:** restore focus after re-render for "What happened?", the hint button and the Defend rows. Add arrow-key handling to the tab bar.
17. **A2:** a leaking chat bubble gets a visible "Leaked" text stamp, not just a red border.
18. **Mobile (D5):** at ≤780px, put the chat before the ladder. Make "What happened?" tap targets at least 44px. Raise `.st-off` contrast to at least 4.5:1.

## Done when
- `npm run check` exits 0.
- `npm run probe` on the merged list: under 15% not understood, and the only "wins every level" entry is the named boss route.
- Every item above is marked done, partial or not done, with a reason, in your final report.
