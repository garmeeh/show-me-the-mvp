# 05: Copy as Markdown

**What to build:** When an MVP Brief has finished streaming, a "Copy as Markdown" button appears. Pressing it puts the whole Brief on the clipboard as readable Markdown, with a heading per section, lists for Build first and Cuts, and the Success Test spelled out. The founder sees a brief confirmation that it copied.

See `.scratch/mvp-brief/spec.md` (user stories 25–26).

**Blocked by:** 01

**Status:** done

- [x] "Copy as Markdown" appears only once the Brief is complete
- [x] A pure function formats an MVP Brief as Markdown, including every section
- [x] Copying writes that Markdown to the clipboard and shows a short confirmation
- [x] Client test (clipboard stubbed): after a Brief streams, pressing Copy writes Markdown containing the Brief's content
- [x] `pnpm verify` is clean
