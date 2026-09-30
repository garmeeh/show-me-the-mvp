# 04: Stop and errors

**What to build:** While an MVP Brief is streaming, the "Strip it back" button becomes "Stop", and pressing it halts the stream while keeping what has arrived. If the request fails (for example the Gateway errors or the key is missing), the founder sees a plain error message instead of a Brief that never finishes. Submitting again is the retry.

See `.scratch/mvp-brief/spec.md` (user stories 24, 27).

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The submit button switches to Stop while streaming and stops the stream when pressed
- [ ] A failed request shows a plain error message in the Brief column
- [ ] API test: a Gateway failure does not produce a silent, empty success
- [ ] Client tests: a failed `/api/brief` request shows an error; Stop appears while streaming
- [ ] `pnpm verify` is clean
