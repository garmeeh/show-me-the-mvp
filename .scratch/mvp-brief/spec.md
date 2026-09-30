# Spec: MVP Brief

Status: ready-for-agent

## Problem Statement

Founders and indie hackers arrive with an Idea that is too big. They can't see which part to build first, they overbuild before learning anything, and they have no concrete way to tell whether the Idea is worth pursuing. The app today is a blank sheet with a textarea that does nothing.

## Solution

The founder pastes an Idea and presses one button. An MVP Brief streams back beside it, section by section. It names the MVP in one line and says who it's for. It states the Riskiest Assumption, lists what to build first, and lists the Cuts along with why each can wait. It ends with a Success Test: a question answered by real behaviour ("Can 10 restaurants get real customers to place orders through it?"), a pass bar, and a scrappy way to run it. If the Idea is too vague to judge, the Brief leaves its sections blank and asks for the specific information it needs. The founder can edit the Idea and submit again, stop a Brief partway through, and copy the finished Brief as Markdown.

## User Stories

1. As a founder, I want to paste my Idea into a large text area, so that I can describe it in my own words at any length.
2. As a founder, I want a single clear submit button, so that I know how to get my MVP Brief.
3. As a founder, I want to submit with ⌘/Ctrl+Enter, so that I don't have to reach for the mouse.
4. As a first-time visitor, I want clickable example Ideas, so that I can see what the app does in one click without writing anything.
5. As a first-time visitor, I want clicking an example to fill the text area, so that I can tweak it before submitting.
6. As a first-time visitor, I want the empty Brief area to show the section titles I'll get, so that I understand the output before I submit.
7. As a founder, I want the Brief to start appearing within a couple of seconds, so that the app feels responsive.
8. As a founder, I want each section to fill in live as it streams, so that I can start reading before the Brief is finished.
9. As a founder, I want the MVP stated in one line, so that I know exactly what I'm shipping.
10. As a founder, I want one narrow first user named, so that I stop designing for everyone.
11. As a founder, I want the Riskiest Assumption spelled out, so that I know what could kill the Idea.
12. As a founder, I want three to five things to build first, so that my first build stays small.
13. As a founder, I want the tempting features listed as Cuts, each with its reason, so that I understand why they can wait and don't feel they were overlooked.
14. As a founder, I want a Success Test phrased as a question answered by real behaviour, so that I know what "proven" means for my Idea.
15. As a founder, I want the Success Test to carry a numeric pass bar and a timeframe, so that I can't fudge the result afterwards.
16. As a founder, I want the Success Test to say what to do if it fails (kill it or pivot), so that I have a decision ready before I see the result.
17. As a founder, I want a scrappy way to run the Success Test, such as a landing page, a concierge service or a manual process, so that I can validate before writing much code.
18. As a founder, I want the Success Test to reject vanity signals such as praise, friends' sign-ups or "would you use it?", so that I test real demand.
19. As a founder, I want the Success Test to stand out visually, so that I can find the most important section at a glance.
20. As a founder, I want the tone to be direct and specific, so that the Brief is actionable rather than generic encouragement.
21. As a founder with a vague Idea, I want to be told exactly what information is missing, so that I can add it and try again rather than get an invented Brief.
22. As a founder, I want my Idea to stay visible and editable beside the Brief, so that I can refine it and resubmit without retyping.
23. As a founder, I want to submit again after editing, so that I get a fresh Brief for the revised Idea.
24. As a founder, I want to stop a Brief while it is streaming, so that I don't wait on a run I already know is wrong.
25. As a founder, I want to copy the finished Brief as Markdown, so that I can paste it into my notes, an issue or a doc.
26. As a founder, I want confirmation that the copy worked, so that I know my clipboard has it.
27. As a founder, I want an error message if the Brief fails, so that I know to try again rather than wait forever.
28. As a founder on a phone, I want the Idea and the Brief to stack vertically, so that the app is usable on a narrow screen.
29. As a workshop presenter, I want the page to look polished on a projector in the blueprint style, so that the demo lands.
30. As a developer, I want the Gateway key read from a local secret, so that the key never lands in the repo.
31. As a developer, I want the model chosen in one place, so that swapping models is a one-line change.

## Implementation Decisions

- **Stack.** AI SDK 7 (`ai`, `@ai-sdk/react`) with `zod` for the schema, routed through the Vercel AI Gateway.
- **Model.** The model is `openai/gpt-6-luna` with low reasoning effort. There is no fallback model. The model ID lives in one constant in the worker.
- **Secret.** `AI_GATEWAY_API_KEY` is declared as a secret binding in the Cloudflare config, and the `Env` types are regenerated.
  - The worker creates the Gateway provider per request, with the key passed explicitly from the request's env. It does not rely on `process.env`.
  - Local dev reads the key from `.dev.vars`, which is gitignored. A committed `.dev.vars.example` documents the key.
  - The app is local-only, so there is no deploy secret step.
- **MVP Brief schema.** A single zod schema is shared by the worker and the React app, and the order of its fields is the order sections stream in. The shape is roughly:
  - `needsMoreInfo`: optional string. It is set, and the other fields are left empty, when the Idea is too vague to judge.
  - `mvp`: string. The MVP in one line.
  - `forWhom`: string. One narrow first user.
  - `riskiestAssumption`: string.
  - `buildFirst`: string[], three to five items.
  - `cuts`: `{ feature, reason }[]`.
  - `successTest`: `{ question, passBar, ifItFails, howToRun }`.
- **API contract.** `POST /api/brief` takes the Idea as its JSON body and returns a text stream of the MVP Brief JSON as it is generated. It uses `streamText` with `Output.object`, sent through the stateless text-stream response helpers, not the deprecated result methods.
  - `onError` logs stream errors so that they aren't swallowed.
  - The route follows the existing `/api/` convention.
- **Prompt instructions.**
  - Tone: indie hacker or early founder audience, direct and specific.
  - The Success Test is a question answered by real behaviour. It must have a numeric pass bar and a timeframe, and must say what to do on failure. Its "how to run" is a scrappy method, often not code. Vanity signals don't count.
  - When the Idea is too vague to judge, the model sets `needsMoreInfo` instead of inventing a Brief.
  - There is no length validation on the client or the server.
- **Client.**
  - The client uses `useObject` against `/api/brief` with the shared schema, and renders the partial object with guards for undefined fields.
  - The layout is two columns on desktop and stacks on mobile.
    - **Left (sticky).** The kicker and headline, the Idea text area, the example-Idea chips, and a "Strip it back" button that becomes "Stop" while streaming.
    - **Right.** An empty sheet listing the section titles before the first submit. Once submitted, the sections fill in as they stream, in story order: MVP → For whom → Riskiest Assumption → Build first → Cuts → Success Test.
  - The Success Test gets the most visual emphasis: an amber border and card.
  - When `needsMoreInfo` is set, it replaces the sections.
  - When the Brief is complete, "Copy as Markdown" appears, uses the clipboard, and briefly confirms the copy.
  - Errors show as a plain message. Submitting again is the retry.
- **UI primitives.** UI is built from shadcn components (Card, Button, Textarea and Badge as needed) using the blueprint tokens.
- **Markdown formatting.** A pure function converts an MVP Brief to Markdown for the copy action.

## Testing Decisions

- **What a good test looks like.** A test asserts what a caller sees, and would fail if the behaviour broke. The only mocks are at the network boundary, which here means the AI Gateway and `/api/brief`, plus the clipboard. Our own modules run for real: the shared schema, the Markdown formatter and the components.
- **API (the `api` project).** Tests go through `app.request("/api/brief", …, { AI_GATEWAY_API_KEY })`, with global `fetch` stubbed to act as the Gateway and return a canned streamed model response. They check that:
  - The streamed body parses to a Brief with the expected sections.
  - A `needsMoreInfo` response comes through.
  - The outgoing Gateway request carries the key and the Luna model ID.
  - A Gateway failure does not produce a silent, empty success.
  - Prior art: the existing API routing tests.
- **Client (the `client` project).** Tests render `<App />` with `fetch` stubbed for `/api/brief` to return a streamed JSON body, and drive the page with `userEvent`. They check that:
  - Clicking an example chip fills the Idea.
  - Submitting shows the Brief sections, found by heading or role.
  - `needsMoreInfo` replaces the sections.
  - Copy as Markdown writes the Brief to a stubbed clipboard.
  - A failed request shows an error.
  - Prior art: the client setup with Testing Library and jest-dom.
- **Not tested.** No markup snapshots, and no tests of shadcn internals.
- **Done.** The work is done when `pnpm verify` runs clean.

## Out of Scope

- Deploying to production and setting the production secret.
- Rate limiting and abuse protection.
- Input length limits.
- Any persistence: history, shareable links, or a localStorage draft.
- Follow-up conversation or refining a Brief by chat.
- Fallback models, and choosing a model in the UI.
- Accounts and authentication.

## Further Notes

- The terms used here (Idea, MVP, MVP Brief, Riskiest Assumption, Cut, Success Test) are defined in `GLOSSARY.md`.
- Model choice came from a Gateway catalogue comparison on 2026-09-30. Luna (about $0.00075 per Brief, roughly 1.5s to first token) was chosen over Sonnet 5.5 (about $0.015 per Brief), with judgment quality as the trade-off. A quick side-by-side on a few real Ideas is worthwhile if the Briefs feel thin.
- Streaming uses the AI SDK 7 APIs: `streamText` with `Output.object`, the stateless response helpers, and `useObject`. `streamObject` and the `toXResponse` result methods are deprecated.
