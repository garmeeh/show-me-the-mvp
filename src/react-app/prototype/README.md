# PROTOTYPE: Nutritics-inspired theme variants (throwaway)

Two throwaway UI prototypes for the redesign spec at `.scratch/redesign/spec.md`. **Variant B ("Workspace") won**, with one change: the Brief document's header strip (the one holding Copy as Markdown) is sticky on desktop. Nothing in this folder is production code. Rebuild from the spec rather than promoting it.

## Run it

```bash
pnpm dev
```

Open the URL `cf dev` prints (usually http://localhost:5173) and add a variant:

| URL                 | Shows                                   |
| ------------------- | --------------------------------------- |
| `/?variant=B`       | Variant B, "Workspace" (the chosen one) |
| `/?variant=A`       | Variant A, "Hero panel"                 |
| `/?variant=current` | The real app, current blueprint theme   |
| `/` (no param)      | Variant A                               |

The black floating bar at the bottom is the prototype switcher, not part of either design:

- **← / →** (or the arrow keys, when no text field is focused) cycle the variants.
- **sample** loads a complete Brief instantly, without calling the model.
- **vague** loads the needs-more-info state.
- **empty** resets to the first-visit state.

Typing an Idea and pressing **Strip it back** calls the real `/api/brief` stream. This needs `AI_GATEWAY_API_KEY` in `.dev.vars`, and is the only way to see the drafting and Stop states.

The prototype only mounts in dev builds (`import.meta.env.DEV` in `src/react-app/main.tsx`); production builds render the real `App`.

## Files

- `prototype-host.tsx`: picks the variant from `?variant=`, drops the `dark` class and sets `data-proto` on `<html>` so each variant's CSS tokens apply.
- `prototype-switcher.tsx`: the floating bar.
- `use-proto-brief.ts`: the same streaming call as `App.tsx`, plus the sample and vague Briefs.
- `variant-a.tsx` / `.css`: Hero panel.
- `variant-b.tsx` / `.css`: Workspace.

## The two variants

|          | **A: Hero panel** (`?variant=A`)                                                                                                                   | **B: Workspace** (`?variant=B`)                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Feel     | Marketing landing page, closest to the Nutritics homepage                                                                                          | Product app / SaaS tool; brand shows in the details                                                                               |
| Form     | Inside a full-width blue band with rounded bottom corners, beside a huge headline with "MVP" on a lime highlight                                   | In a sticky blue side panel; examples as a vertical list                                                                          |
| Brief    | Grid of colourful tiles: blue MVP, grey For whom, lime Riskiest Assumption, white Build first with orange numbers, grey Cuts, magenta Success Test | One white document with numbered circles down the left showing which sections have arrived, ending in a magenta Success Test band |
| Strength | Bold and on-brand on first visit                                                                                                                   | Shows progress as the Brief streams in, and suits repeated use                                                                    |
| Weakness | The form scrolls off-screen once you're reading the Brief                                                                                          | Quieter; the MVP line in uppercase Anton is hard to read at that length                                                           |

## Removing it

Once the real redesign is signed off, delete this folder, restore `src/react-app/main.tsx` to render `<App />` directly, and keep `@fontsource/anton` (the real theme uses it). The prototypes stay in the `redesign` branch history.
