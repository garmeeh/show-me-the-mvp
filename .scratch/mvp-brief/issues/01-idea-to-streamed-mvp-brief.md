# 01: Idea → streamed MVP Brief (tracer bullet)

**What to build:** A founder pastes an Idea into the text area in the left-hand column and presses "Strip it back". The MVP Brief streams into the right-hand column section by section, in story order: MVP (one line), For whom, Riskiest Assumption, Build first (3–5 items), Cuts (each with its reason), and Success Test. The Success Test has four parts: a question answered by real behaviour, a pass bar with a number and timeframe, what to do if it fails, and a scrappy way to run it. It carries the strongest visual emphasis, with an amber border. Submitting an edited Idea replaces the Brief with a fresh one. On desktop the two columns sit side by side with the Idea column sticky; on mobile they stack with the Idea on top. The Brief comes from `openai/gpt-6-luna` (low reasoning) through the Vercel AI Gateway, using the key in the local `AI_GATEWAY_API_KEY` secret.

See `.scratch/mvp-brief/spec.md` (user stories 1–2, 7–20, 22–23, 28–31) and `GLOSSARY.md`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `AI_GATEWAY_API_KEY` is declared as a secret in the Cloudflare config, the `Env` types are regenerated, and a committed `.dev.vars.example` documents the key
- [x] The key is passed explicitly from the request env to the Gateway provider, not read from `process.env`
- [x] The model ID lives in one constant
- [x] One MVP Brief schema is shared by the worker and the client, and its field order matches the order sections stream in
- [x] `POST /api/brief` takes the Idea and streams the MVP Brief using AI SDK 7's `streamText` with `Output.object` and the stateless text-stream response helper, with `onError` logging
- [x] The instructions enforce a direct tone and a behaviour-based Success Test with a numeric pass bar, a timeframe, a fail action and a scrappy how-to-run, and exclude vanity signals
- [x] The client uses `useObject`, and each section renders as soon as its partial data arrives
- [x] The layout is two columns on desktop (Idea sticky) and stacks on mobile, and the Success Test card is visually emphasised in amber
- [x] API test (via `app.request`, with global `fetch` stubbed as the Gateway): the streamed body parses to a Brief, and the outgoing request carries the key and the Luna model ID
- [x] Client test (render `<App />`, with `fetch` stubbed for `/api/brief`): typing an Idea and submitting shows the Brief sections
- [x] `pnpm verify` is clean
