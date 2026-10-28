# Round 3 fix list (orchestrator; final round)

Source: `2026-10-26-round2.md`. Items 5, 8 and 9 of its list are waiting on owner decisions, so leave them alone: the Defend-tab spoiler, the teacher handover note and the E3 wording.

## 1. Safeguarding (do first)
- **Distress messages get a kind, out-of-character reply.** This covers sadness, self-harm, bullying, abuse, and being scared or unsafe, including misspellings and text-speak ("i hate my life", "no one likes me", "im being bullied", "i want to hurt myself").
  - The reply steps out of the game, never mentions the password, and isn't counted as an attack, a crack or a "confused" reply.
  - Suggested wording: "I'm just a practice bot, but that sounds really hard. Please tell your teacher or an adult you trust. You can also talk to Childline any time on 0800 1111 or at childline.org.uk." The URL is display text only, not a clickable or fetched link.
  - Shown in the chat as a calm system-style message, not a Warden bubble.
- **Limit echoing pupil words.** Topics for poems and stories, "my name is…" and "spell <word>" are echoed only if they're short (at most 3 words, 20 characters) and pass a small built-in blocklist of rude words and slurs.
  - Store the blocklist encoded, like the pool, so it isn't a readable list in the source.
  - Otherwise, use the generic version ("Here's a story about something else…") without repeating the words.
- **Tests:** at least 12 distress messages, including misspellings, get the support reply on every level and never crack. At least 6 rude topics aren't echoed.

## 2. A1 (required)
- **Focus ring:** at least 3:1 contrast against every light-mode surface. Dark mode is already fine. Add it to the existing contrast test.
- **After a correct guess:** focus moves to "Next level", or to "Switch sides" on the last level, before the guess form is hidden.

## 3. Understanding margin (E4)
- **General typo tolerance** for core words, not per-typo entries: password, magic, code, word, letters, many, spell, backwards, hint, clue.
  - Use edit distance ≤1 for words of 4–6 letters and ≤2 for 7 or more, or something similar. "magik", "codee", "meny leters" and "magic wrd" then work.
  - Watch for false matches (e.g. "word" vs "world") and add tests for them.
- **The admin override message** is understood as an authority claim on levels 1–4.

## 4. Level-aware confused reply
The suggestion in the "didn't get that" reply only names tricks that aren't closed on the current level.

## 5. Small leftovers
- **Blackout bars:** fixed width in blacked-out chat bubbles (`index.html:1360`).
- **Wording:** "can feel" at `index.html:474` becomes rule-based wording.
- **Text size:** locked-rung text at least 13px.
- **Mobile:** at ≤780px, shorten the intro to one line and trim the empty-chat greeting, so the message input sits within about one screen at 360×740.

## Done when
- `npm run check` exits 0.
- The probe summary is unchanged or better.
- The held-out list `2026-10-26-round2-heldout.json` (run it with your own script; don't add it to `tests/probes.json`) is at or under 13.6% not understood in a fresh chat.
- Every item is reported as done, partial or not done, with a reason.
