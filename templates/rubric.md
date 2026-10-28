# Demo rubric

Every demo is scored against this list. **Required** items must pass before a demo goes to the teacher for sign-off. The evaluator writes PASS, FAIL or N/A with evidence (a command output, a file and line, or a probe result) for each one.

Assume the audience is **sharp Year 6–9 pupils**. They open DevTools, read the source, share tricks across the room, and give up on anything that doesn't respond within seconds.

## D: Delivery (pupils cannot run a server)

| ID | Required | Check | How |
|---|---|---|---|
| D1 | ✅ | No network requests at runtime: no CDNs, web fonts, analytics or `fetch` | `npm run check` |
| D2 | ✅ | Works when `index.html` is opened from disk (`file://`): no module scripts and no loading local JSON | `npm run check` |
| D3 | ✅ | Nothing is stored on the device, and no accounts | `npm run check` |
| D4 | ✅ | Runs on GitHub Pages under a project path: relative URLs only | `npm run check` |
| D5 | ✅ | Works on a school Chromebook or iPad at 360px wide and on a 1366px laptop | Read the CSS, use a screenshot if one is available |
| D6 |  | Page under 300 KB, under 1 MB at most | `npm run check` |

## I: Inspect-resilience (pupils will read the source)

Nothing in a browser page is secret. The aim is that reading the source is **not worth it**, or that **the game treats it as a lesson**.

| ID | Required | Check |
|---|---|---|
| I1 | ✅ | Answers can't be read off View Source. Either derive them at runtime from a large space (hundreds of options or more), or make the win depend on *how* you got there, not just the answer |
| I2 | ✅ | No brute-force oracle: no guess box without a cost, and no reply that changes when a guess is right |
| I3 | ✅ | Spoilers (level solutions, unlock buttons) aren't one click from the pupil view. Put them on a separate teacher page or behind a deliberate step |
| I4 |  | Game state isn't a top-level global that can be edited to win (`S.levels[0].cracked = true`) |
| I5 |  | Cheating is acknowledged in-game (a console message, a "you found the source" badge) and links to the real lesson, e.g. "client-side secrets aren't secret" |

## E: Engagement (pupils get bored very easily)

| ID | Required | Check | How |
|---|---|---|---|
| E1 | ✅ | First meaningful action within 10 seconds of the page opening, with no wall of text first | Playtest |
| E2 | ✅ | Every action gets visible feedback within 1 second | Playtest |
| E3 | ✅ | Each level needs a **new** idea. No single strategy beats every level, **except a named final-level route that combines at least two ideas, each closed on its own at that level** (with defences that only add up, the final route is always open on earlier levels) | `npm run probe`: "Wins every level, not the named boss route" is none |
| E4 | ✅ | Under 15% of realistic pupil messages or actions get a "didn't understand" response | `npm run probe` |
| E5 |  | Replay value: randomised content, multiple routes, or a challenge mode for fast finishers |
| E6 |  | Something for fast finishers that takes 10+ minutes (a boss level, peer challenge codes, a design-your-own mode) |
| E7 |  | Progress is visible: levels, a collection, a score that rewards cleverness rather than speed |

## C: Concept accuracy

| ID | Required | Check |
|---|---|---|
| C1 | ✅ | States what the simulation is and isn't (e.g. "Warden is rule-based, not a language model") |
| C2 | ✅ | No misconceptions in the copy: no "the AI thinks/knows/wants" without qualification |
| C3 | ✅ | Shows the system failing, and explains why |
| C4 |  | Connects to one real-world case or standard (e.g. OWASP LLM Top 10) |

## A: Accessibility

| ID | Required | Check |
|---|---|---|
| A1 | ✅ | Everything works with the keyboard alone, with visible focus |
| A2 | ✅ | Colour is never the only signal |
| A3 | ✅ | `prefers-reduced-motion` is respected |
| A4 |  | Pupil-facing copy reads at about a 10–12 year old level (short sentences, common words) |

## S: Safeguarding (a hard gate, never waived)

| ID | Required | Check |
|---|---|---|
| S1 | ✅ | No free text leaves the device, and no LLM or API calls while pupils use the page |
| S2 | ✅ | Content suits ages 10–14. Insult and joke responses stay kind |
| S3 | ✅ | Attack skills are framed ethically (permission, practice systems only) |

## T: Teacher support

| ID | Required | Check |
|---|---|---|
| T1 | ✅ | Teacher notes: objective, a 30–40 minute lesson flow, discussion questions, how the simulation works |
| T2 |  | Differentiation for Year 6–7 and Year 8–9 |
