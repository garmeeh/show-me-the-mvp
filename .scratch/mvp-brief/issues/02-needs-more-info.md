# 02: Needs more info

**What to build:** When an Idea is too vague to judge ("hi", a recipe, a single word), the founder sees a specific message saying what information is missing, such as who it's for or what it does. The message appears in place of the MVP Brief sections, so no Brief is invented. Editing the Idea and submitting again produces a normal Brief.

See `.scratch/mvp-brief/spec.md` (user story 21).

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The Brief schema has an optional needs-more-info message as its first field, and the instructions tell the model to set it, leaving the other sections empty, when the Idea can't be judged
- [ ] No length validation is added on either the client or the server
- [ ] The UI shows the message in place of the sections when it is set
- [ ] API test: a needs-more-info model response comes through the stream
- [ ] Client test: a streamed needs-more-info response replaces the sections with the message
- [ ] `pnpm verify` is clean
