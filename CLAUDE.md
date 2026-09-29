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

## Checks

Finish a change with `pnpm lint` and `pnpm build` both clean. After editing `cloudflare.config.ts`, run `pnpm cf-typegen` to regenerate the `Env` types (`.cloudflare/types`, git-ignored). Use the `cf` CLI (`cf dev`, `cf build`, `cf deploy`), not Wrangler.

TypeScript stays on 6.x: typescript-eslint does not support TS 7 yet. `paths` in the tsconfigs work without `baseUrl`, which TS 6 deprecates.
