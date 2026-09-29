# Deploy with cf

Paste this prompt into Claude Code, or another coding agent, from the root of the repo. The agent installs Cloudflare's `cf` CLI and walks you through deploying the app to your own Cloudflare account, on the free `workers.dev` address.

You need a Cloudflare account (the free plan is fine) and Node.js 22 or newer.

```text
Deploy this app to my Cloudflare account using Cloudflare's `cf` CLI, on the free workers.dev address. Keep it simple and do the steps in order:

1. Check Node.js is version 22 or newer. Install cf globally with `npm install -g cf`, then run `pnpm install`.
2. Ask me to log in. The login opens a browser, so I'll run it myself with `! cf auth login`. Wait until I confirm it worked.
3. Deploy with `pnpm run deploy`. Use `pnpm run deploy`, not `pnpm deploy`: `pnpm deploy` is a different, built-in pnpm command. If it says I have more than one account, show me the list, ask which to use, and rerun with `CLOUDFLARE_ACCOUNT_ID=<id>` set for that command only. If it asks me to choose a workers.dev subdomain, ask me to run `pnpm run deploy` myself so I can answer the prompt.
4. Give me the live URL and check that it loads.

Use `cf`, not Wrangler. If a cf command fails, show me the error and don't switch to Wrangler.
```
