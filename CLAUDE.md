# Show me the MVP

Starter app for a live Claude Code workshop. The home page (`src/react-app/App.tsx`) is a blank sheet; the app gets built on top of it.

## Layout

- `src/react-app/`: React 19 front end, built by Vite. `@/` imports resolve here.
- `src/worker/index.ts`: Hono API on Cloudflare Workers. Keep every route under `/api/`; everything else is served as the single-page app (`cloudflare.config.ts` → `assets.notFoundHandling`).
- Package manager is pnpm.

## UI: shadcn/ui first

Build UI from shadcn components (Radix base, Lyra style, Phosphor icons). Before writing a control, dialog, form field, table or layout primitive, add the shadcn one and compose with it:

```bash
pnpm dlx shadcn@latest add <component>
```

Components land in `src/react-app/components/ui/`, generated and owned by us: adjust their classes there when the whole app should change. `cn` is imported from the `cn` package (shadcn's own class merger).

## Theme: blueprint

The look matches the workshop decks: cyanotype blue sheet with a drafting grid, white linework, amber annotations, square corners. It is set once in `src/react-app/index.css` by mapping shadcn's colour tokens onto the blueprint palette, so every shadcn component inherits it.

- Colour through the tokens (`bg-background`, `bg-card`, `text-primary`, `text-muted-foreground`, `text-heading`, `border-border`). Amber is `primary`. New colours get a new token in `index.css`.
- Type: `font-heading` (Barlow Semi Condensed) for headings, `font-sans` (IBM Plex Sans) for body, `font-mono` (IBM Plex Mono) for labels and data. `h1`–`h3` take the heading font automatically.
- Two-tone headlines: wrap the key phrase in `<em>` to colour it amber.
- `.kicker` gives the deck's mono uppercase label with a bar.
- The app is dark-only (`<html class="dark">`); write for the blue sheet.

## Tests

Vitest, configured in `vitest.config.ts` with two projects: `api` (Node, `src/worker/**/*.test.ts`) and `client` (happy-dom with React Testing Library, user-event and jest-dom matchers, `src/react-app/**/*.test.{ts,tsx}`). Put `*.test.ts(x)` next to the module it covers; the environment follows from the folder. `pnpm test` runs once, `pnpm test:watch` watches. Import `describe`, `it` and `expect` from `vitest`; globals are off.

Every test must fail when the behaviour it names breaks. Ask "would this still pass if the feature were broken?" If it would, the test is tautological, so don't write it.

- Assert what a caller sees. API: send a request through `app.request()` and check the status and body. Client: render, query by role and label, and interact through `userEvent`.
- Mock only system boundaries: network, time and third-party services. Exercise our own modules for real.
- Derive expected values from the behaviour, not by copying literals out of the code. Skip markup snapshots and shadcn internals.
- No coverage tool or threshold: write a test because the behaviour matters, not to reach a number.

When the worker gets its first Cloudflare binding (D1, KV…), move the `api` project to `@cloudflare/vitest-pool-workers` so tests hit real local bindings. First check that the pool can read `cloudflare.config.ts`, since the repo has no Wrangler config.

## Checks

Finish every change with `pnpm verify` clean: it runs `format:check`, `lint`, `test` and `build`, and CI runs the same. The pre-commit hook doesn't run tests. `pnpm fix` applies Prettier and ESLint auto-fixes across the repo.

The pre-commit hook runs Prettier and `eslint --fix` on staged files and re-stages the result. If it rejects a commit, fix the errors it reports and commit again. Never bypass it with `--no-verify`.

After editing `cloudflare.config.ts`, run `pnpm cf-typegen` to regenerate the `Env` types (`.cloudflare/types`, git-ignored). Use the `cf` CLI (`cf dev`, `cf build`, `cf deploy`), not Wrangler.

TypeScript stays on 6.x: typescript-eslint does not support TS 7 yet. `paths` in the tsconfigs work without `baseUrl`, which TS 6 deprecates.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), plus `done` for finished work, recorded on each issue's `Status:` line. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
