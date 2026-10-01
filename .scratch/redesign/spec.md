# Spec: Workspace redesign

Status: ready-for-agent

## Problem Statement

The app wears the workshop's blueprint theme: a dark cyanotype sheet with a drafting grid, mono annotations and square corners. It suited the workshop decks but doesn't fit a product a founder would come back to. It reads as a slide, not a tool. The founder wants the app to feel like a confident, friendly, light SaaS product. The visual direction is inspired by the Nutritics brand (nutritics.com) without copying it.

Two throwaway prototypes were built and compared side by side. The founder picked **Variant B, "Workspace"**, with one change: the Brief's header strip, which holds the Copy as Markdown button, stays in view on desktop while the founder scrolls the Brief.

## Solution

Replace the blueprint theme with a light "workspace" theme and re-lay the page as a product tool:

- A slim white **app bar** across the top, with a small molecule-style mark, the "Show me the MVP" wordmark, and an orange **New idea** pill that clears the page.
- A two-pane workspace below it:
  - **Left:** the **Idea panel**, a blue rounded panel that stays put on desktop, holding the Idea form and the example Ideas.
  - **Right:** the **Brief document**, one white rounded document on a light grey canvas.
- The Brief document has a **progress rail** down its left edge: numbered circles joined by a line, one per section. Each circle shows whether its section has arrived, is being drafted, or is still to come. The Success Test closes the document as a magenta band.
- The Brief document's **header strip** shows which Idea the Brief is for, drafting and stale notices, and Copy as Markdown. On desktop it is **sticky**: it stays pinned under the app bar while the founder scrolls a long Brief, so copying is always one click away.

All existing behaviour stays the same, except the new New idea pill: streaming, Stop, ⌘/Ctrl+Enter, example Ideas, needs more info, errors, the stale-Idea notice and Copy as Markdown.

## User Stories

1. As a founder, I want the app to look like a modern, friendly product tool, so that I trust it with my Idea and want to come back.
2. As a founder, I want a light, high-contrast page, so that the Brief is comfortable to read for a long time.
3. As a founder, I want a slim app bar with the product name, so that I always know where I am.
4. As a founder, I want a New idea button in the app bar, so that I can clear the Idea and the Brief and start again in one click.
5. As a founder, I want my Idea form in a distinct blue panel, so that the input is unmistakable at a glance.
6. As a founder on desktop, I want the Idea panel to stay in view while I scroll the Brief, so that I can edit and resubmit without scrolling back up.
7. As a founder, I want a large, rounded white text area labelled "Your big idea", so that it is obvious where to type.
8. As a founder, I want a bold orange "Strip it back" button, so that the main action stands out.
9. As a founder, I want the ⌘/Ctrl+Enter hint beside the button, so that I discover the shortcut.
10. As a founder, I want "Strip it back" to become a white outline "Stop" button while a Brief streams, so that I can stop it.
11. As a founder, I want a hint when the Idea is empty, so that I know why I can't submit.
12. As a first-time visitor, I want the example Ideas as a vertical list of easy-to-read rows, so that I can scan them and pick one.
13. As a first-time visitor, I want the example I picked to look selected, so that I can see which one is in the text area.
14. As a first-time visitor, I want the empty Brief document to show the six numbered sections I'll get, so that I understand the output before I submit.
15. As a founder, I want each section's circle on the progress rail to fill in blue as that section arrives, so that I can see how far through the Brief is.
16. As a founder, I want the section being drafted to show an orange, pulsing circle and a "Drafting…" tag, so that I know the app is working and where.
17. As a founder, I want sections still to come to show as hollow grey circles with a faint line where the text will go, so that the document keeps its shape while streaming.
18. As a founder, I want the MVP shown as a big bold headline, so that the one-line answer is the first thing I read.
19. As a founder, I want the Riskiest Assumption marked with an orange bar, so that the danger stands out.
20. As a founder, I want Build first shown as a checklist with green check dots, so that it reads as a to-do list.
21. As a founder, I want each Cut struck through with its reason beside it, so that I see what was dropped and why.
22. As a founder, I want the Success Test as a magenta band closing the document, so that the most important section is unmissable.
23. As a founder, I want the Success Test's pass bar, if-it-fails and how-to-run as three side-by-side cards on desktop, so that I can compare them at a glance.
24. As a founder, I want the header strip to say which Idea the Brief is for, so that I never confuse it with an edited Idea.
25. As a founder on desktop, I want the header strip to stay pinned at the top while I scroll a long Brief, so that Copy as Markdown and the Brief's Idea are always in view.
26. As a founder, I want Copy as Markdown as an outline pill in the header strip once the Brief is complete, so that I can take the Brief elsewhere.
27. As a founder, I want confirmation beside the copy button that the copy worked or failed, so that I know what's on my clipboard.
28. As a founder, I want a "Drafting your Brief…" note in the header strip while it streams, so that I know it hasn't stalled.
29. As a founder who edited their Idea after a Brief, I want the header strip to say the Idea changed and the Brief to fade, so that I know to strip it back again.
30. As a founder with a vague Idea, I want a friendly callout in place of the sections, asking for what's missing, so that I know what to add.
31. As a founder, I want a failed Brief to show a soft red message above the document, so that I know to retry.
32. As a founder on a phone, I want the app bar, Idea panel and Brief document to stack vertically, with the header strip and Idea panel scrolling normally, so that nothing pinned eats the small screen.
33. As a founder on a phone, I want the Success Test cards to stack, so that they stay readable.
34. As a founder who prefers reduced motion, I want the drafting pulse turned off, so that the page doesn't animate at me.
35. As a keyboard user, I want every control focusable with a visible focus ring, so that I can use the app without a mouse.
36. As a screen reader user, I want each Brief section exposed as a region named by its heading, and the decorative mark, molecule and rail hidden, so that I hear content, not ornaments.
37. As a founder, I want all text to meet WCAG AA contrast, so that the colourful theme stays readable.
38. As a developer, I want the theme set once through shadcn's colour tokens, so that every shadcn component picks it up and new UI matches automatically.
39. As a developer, I want CLAUDE.md to describe the new theme, so that future agents build UI that matches it, not the blueprint.

## Implementation Decisions

- **Prototype is the reference.** Variant B ("Workspace") in the prototype folder is the visual and structural reference. Rebuild it properly in the real app; don't promote the prototype code. The prototype's hand-written colour literals become tokens. Its copy pill is replaced by restyling the real Copy as Markdown component.
- **Light-only theme.** The app drops dark mode. The `dark` class on the root element goes, the theme-color meta becomes the brand blue, and the drafting grid, centre glow and sheet frame are deleted.
- **Palette, as shadcn tokens in the global stylesheet.**
  - Page background (canvas): `#f4f6f8`. Card and popover: white.
  - Body text: `#3f3f3f`. Muted text: `#5b5b5b`. Heading ink: `#16324a`.
  - Primary: orange `#ec671b` with white foreground. Ring: blue `#1a6aa1`.
  - Border: `#dfe3e8`. Input: `#cfd6de`. Muted and secondary: `#ededed`. Accent: `#e8f0f7`. Destructive: `#b3261e`.
  - New tokens: `brand` blue `#1a6aa1` (Idea panel, finished rail circles, outline pills), `primary-text` dark orange `#b54c0e` (any small orange text), `magenta` `#b9115b` (Success Test band), `lime` `#94c93e` (check dots, example dots, the needs-more-info icon disc).
  - Radius base about `1rem`. The Idea panel and Brief document use about 36px. Buttons are full pills.
- **Contrast rules (carry into the theme docs).**
  - White on orange is 3.2:1, so it is allowed only on filled buttons with bold labels of 16px or more.
  - Small orange text always uses `primary-text` (5.2:1).
  - Lime never carries white text (2:1). Use it only as a fill behind dark ink, or for dots and icons.
  - White on brand blue (5.8:1) and white on magenta (6.4:1) are fine.
- **Type.**
  - Anton (`@fontsource/anton`, already installed by the prototype) is the display face: uppercase, regular weight, tight leading. It is used for the wordmark, the Idea panel label, rail section labels, the MVP headline, the Success Test question and the needs-more-info heading.
  - IBM Plex Sans stays for body text. Plain `h1`–`h3` default to Plex Sans, and Anton is applied by a display utility, so headings aren't forced into Anton.
  - Barlow Semi Condensed and the mono kicker style are removed. IBM Plex Mono stays only if still used, for example for the Kbd hint. Otherwise remove it.
  - The font-heading theme value is updated so `font-heading` means Anton.
- **Page structure.**
  - **App bar:** sticky at the top, white with a bottom border. It holds the mark, the wordmark ("Show me the MVP", with "MVP" in `primary-text`) and the New idea pill.
  - **Workspace grid:** max width about 1400px. A fixed ~400px left column and a fluid right column on large screens; a single column below that.
  - **Idea panel:** sticky beneath the app bar on large screens. Blue background with a faint decorative molecule in the corner (inline SVG, marked decorative).
- **New idea (new behaviour).** It clears the Idea, the Brief for the previous Idea and any stale or copied state, and returns the page to its first-visit state. If a Brief is streaming, it stops it first. The submitted-Idea and complete-Brief state in the App component is what gets reset.
- **Brief document.**
  - A white rounded card. The **header strip** sits on top, then either the progress rail or, when the Brief needs more info, the needs-more-info callout.
  - **Sticky header strip (the one change from the prototype).** On large screens the header strip is sticky, pinned just under the app bar, with its own background and bottom border so content scrolls cleanly underneath it.
    - The prototype clips the document's overflow to round its corners, and that clipping breaks sticky positioning. The real build must round the corners without clipping overflow on any ancestor of the header strip. Give the header strip and the last band their own rounded corners, or use `overflow: clip` only where it doesn't affect stickiness.
    - On small screens the header strip scrolls normally.
  - **Header strip contents.**
    - A "Brief for" label in `primary-text` above the submitted Idea. Before the first submit, an "MVP Brief" label with "Your Brief will appear here, section by section."
    - "Idea changed: strip it back again to update the Brief." when stale.
    - "Drafting your Brief…" with an orange dot while streaming.
    - Copy as Markdown as a blue outline pill with its status text, once the Brief is complete.
- **Progress rail.** There are six steps, in story order: MVP → For whom → Riskiest Assumption → Build first → Cuts → Success Test. Each step has one of three states, derived from the streaming Brief exactly as the current section placeholders are:
  - `done`: the section has data. Filled blue circle, and the line below it is blue.
  - `drafting`: streaming, and this is the first section without data. Orange circle, pulsing, with a "Drafting…" tag and an orange-tinted skeleton line.
  - `pending`: hollow grey circle with grey skeleton lines.

  The Success Test step sits in a band at the foot of the document: magenta with a white circle once it has data, pale grey before that. The circles, connecting lines and skeletons are decorative, and their state is not announced.

- **Section bodies.**
  - MVP: Anton headline in heading ink.
  - For whom: large body text.
  - Riskiest Assumption: large body text with an orange left bar.
  - Build first: a two-column checklist (one column on mobile) of light grey rounded rows with lime check dots.
  - Cuts: a divided list. The feature is struck through in `primary-text`, with the reason beside it on desktop and beneath it on mobile.
  - Success Test: the question in white Anton, then Pass bar, If it fails and How to run it as a definition list of translucent white cards, three columns on desktop.
- **Needs more info.** It replaces the rail with a callout: a lime disc with a question icon, an Anton heading, the message in large text, and a hint to add detail and strip it back again. The callout's region keeps the accessible name "Needs more info". The visible heading can read "Tell us a little more" if the region is labelled "Needs more info", but simplest is to keep the visible heading "Needs more info".
- **Accessible names stay stable.** The existing client tests are the regression net, so these names don't change:
  - the "Your big idea" textbox;
  - the "Example ideas" group (its visible heading may read "Or start from an example" only if the group's accessible name stays "Example ideas");
  - the "Strip it back", "Stop" and "Copy as Markdown" buttons;
  - the "MVP Brief" region and each section's region named by its section title;
  - the "Your MVP Brief will cover" list in the empty state: the pre-submit rail is exposed as a list with this name, one item per section title;
  - the copy `status`;
  - the "Brief for" label;
  - the "Drafting…" text;
  - the "Idea changed" notice;
  - the error `alert`.
- **Components.**
  - Shared shadcn primitives (Button, Textarea, Card, Alert, Kbd) are restyled at the source where the whole app should change: pill buttons, rounded inputs with a blue focus ring, and rounded cards.
  - The Brief rendering module keeps its interface: it takes a partial Brief and a drafting flag and renders either the rail or the needs-more-info callout, while the empty-state component renders the pending rail.
  - The App component owns the app bar, the Idea panel, the header strip and the New idea reset.
- **Docs.** The CLAUDE.md "Theme: blueprint" section is rewritten as the workspace theme. It covers the tokens, the contrast rules, Anton through the display utility, light-only, the no-overflow-clipping caveat for sticky elements, and the removal of the `<em>` amber and `.kicker` conventions. The favicon and page title are updated to the new mark if that is cheap. Otherwise leave them.
- **Prototype stays until sign-off.** The prototype folder, its host and the dev-only switcher in the entry point stay while this is built, so the founder can compare. Removing them is the last ticket, once the founder signs off the real build. The prototype is preserved on the `redesign` branch history.

## Testing Decisions

- **What makes a good test.** Assert what the founder sees and does. Render `<App />`, query by role and accessible name, drive it with `userEvent`, and stub only the network (`/api/brief`) and the clipboard. A test must fail if the behaviour it names breaks. Visual styling (colours, radii, fonts, sticky positioning) is not unit-tested; happy-dom doesn't do layout, so such tests would be tautological.
- **Seam.** Keep the single existing seam: the client tests that render the whole App with `fetch` stubbed for the streamed Brief. Add no new seams.
- **Existing tests.** All current client tests must keep passing unchanged, because the accessible names above are preserved. If one has to change, the change must be a deliberate copy change recorded in the ticket, not a side effect of the restyle.
- **New tests.**
  - **New idea:** after a Brief has rendered, clicking New idea empties the "Your big idea" textbox, removes the Brief's section regions and shows the "Your MVP Brief will cover" list again. While a Brief is streaming, clicking New idea stops it, and no further sections appear.
  - **Copy as Markdown placement:** the Copy as Markdown button sits inside the "MVP Brief" region's header, alongside the "Brief for" label, so it moves with the sticky strip. Assert containment within the region, not CSS.
- **Prior art.** `App.test.tsx`: its streamed-response helpers, its clipboard stub, and its region-by-name queries.
- **Manual check.** Run the dev server and confirm in a browser at desktop width (1440) and phone width (390):
  - the header strip stays pinned while scrolling a full sample Brief;
  - the Idea panel stays in view;
  - both scroll normally on mobile;
  - focus rings are visible;
  - the drafting pulse stops with reduced motion.
- **Done.** `pnpm verify` runs clean.

## Out of Scope

- Dark mode or a theme toggle.
- Using Nutritics' name, logo, photography or exact molecule mark. The look is inspired, not copied.
- Changing the Brief schema, the API, the model or the prompt.
- New Brief features: history, sharing, saving, or editing sections inline.
- Marketing or landing pages.
- Visual regression tooling.

## Further Notes

- **Brand research (2026-10-01, nutritics.com live CSS):**
  - Primary `#ec671b`, secondary `#1a6aa1` and tertiary `#b9115b` are WordPress preset colours. Lime `#94c93e` and light grey `#ededed` were found as rendered backgrounds, and body text is `#5b5b5b`.
  - Headings are Anton, uppercase, weight 400. Body text is IBM Plex Sans. Buttons are pills (24px+ radius), and cards use 30–60px radii.
- **How to view the prototypes:** see the README in the prototype folder (`src/react-app/prototype/README.md`).
- **Readability watch-item:** the MVP line in uppercase Anton gets heavy past about 15 words. If real Briefs read poorly, drop the MVP body to Plex Sans semibold and keep Anton for labels only.
- Domain terms (Idea, MVP, MVP Brief, Riskiest Assumption, Cut, Success Test) follow `GLOSSARY.md`.
