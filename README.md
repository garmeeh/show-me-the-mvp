# Show me the MVP

Starter app for the Claude Code workshop. The home page is a blank sheet: during the workshop we build an app on top of it with Claude Code.

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/) for the front end (`src/react-app/`)
- [shadcn/ui](https://ui.shadcn.com/) components on [Tailwind CSS v4](https://tailwindcss.com/) (`src/react-app/components/ui/`)
- [Hono](https://hono.dev/) API on [Cloudflare Workers](https://developers.cloudflare.com/workers/) (`src/worker/index.ts`)

The theme is blueprint, matching the workshop decks: shadcn's colour tokens are mapped to the blueprint palette in `src/react-app/index.css`. Use the tokens (`bg-background`, `text-primary`, `border-border`…) rather than raw colours, and wrap the key phrase of a headline in `<em>` to colour it amber.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

Add shadcn components with:

```bash
pnpm dlx shadcn@latest add <component>
```

## Checks and deploy

```bash
pnpm lint
pnpm build
pnpm check        # type-check, build and a dry-run deploy
pnpm run deploy   # deploy to Cloudflare Workers
```

First deploy to your own Cloudflare account? Paste the prompt in [docs/deploy-with-cf.md](docs/deploy-with-cf.md) into your agent.

Config lives in `cloudflare.config.ts`; `pnpm build` regenerates the `Env` types, or run `pnpm cf-typegen` on its own after changing it.
