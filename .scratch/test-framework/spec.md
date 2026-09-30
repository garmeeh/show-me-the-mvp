# Test framework for the client and the API

Status: done

## Problem Statement

The repo has no way to run automated tests. The client (React app) and the API (Hono worker) are about to grow from a blank starter into real features, and there is nowhere to put a test, no command to run one, and nothing in CI that would catch a regression. There is also no shared rule for what a good test looks like, so the first tests written are likely to be tautological: tests that restate the implementation, assert what a mock was told to return, or snapshot markup, and so still pass when the behaviour they claim to cover is broken.

## Solution

Add Vitest as the single test runner, configured with two projects: one for the API, running in Node against the Hono app directly, and one for the client, running in happy-dom with React Testing Library. One command runs both, and `pnpm verify` (and therefore CI) runs it. The rule against tautological tests is written down in the project's agent instructions so every future session reads it. The setup ships with one small API test file that checks real routing behaviour, and no client tests, because the client has no behaviour yet worth pinning.

## User Stories

1. As a developer, I want a single command that runs every test once, so that I can check the whole app before pushing.
2. As a developer, I want a watch-mode command, so that tests re-run while I work on a feature.
3. As a developer, I want `pnpm verify` to run the tests, so that one command still tells me whether a change is ready.
4. As a maintainer, I want CI to fail when a test fails, so that regressions cannot merge.
5. As a maintainer, I want CI to pick tests up through `pnpm verify` with no workflow change, so that local and CI checks stay identical.
6. As a developer, I want the commit hook to stay fast and not run tests, so that committing does not become a chore.
7. As a developer writing API tests, I want to exercise the Hono app through its request interface, so that I test the API as a caller sees it without starting a server.
8. As a developer writing API tests, I want them to run in Node with no extra runtime, so that they are fast and need no setup.
9. As a developer writing client tests, I want a DOM environment and React Testing Library, so that I can render components and query them by role and label as a user would.
10. As a developer writing client tests, I want user-event available, so that I can drive interactions the way a user does rather than firing synthetic events.
11. As a developer, I want client and API tests to each get the right environment automatically, so that I never configure it per file.
12. As a developer, I want test files to sit next to the code they cover, so that a missing test is easy to spot.
13. As a developer, I want the test run to pass while a project has no tests yet, so that the empty client project does not break `verify`.
14. As a developer, I want `@/` imports to resolve in tests the same way they do in the app, so that test code reads like app code.
15. As a developer, I want test files type-checked and linted like the rest of the repo, so that tests do not rot.
16. As a Claude Code agent, I want a written definition of a tautological test in the project instructions, so that I do not write one.
17. As a Claude Code agent, I want a rule that mocks are only for system boundaries (network, time, third-party services), so that I do not mock our own modules and test the mock.
18. As a Claude Code agent, I want a rule against snapshotting markup and testing shadcn internals, so that tests track behaviour rather than structure.
19. As a Claude Code agent, I want a rule against asserting literals copied from the code, so that tests do not just mirror the implementation.
20. As a reviewer, I want to judge each test by "would this fail if the behaviour it names broke?", so that I have one clear bar for rejecting a test.
21. As a maintainer, I want no coverage threshold, so that nobody writes tests just to hit lines.
22. As a developer, I want the first API test to check that unknown API routes return 404, so that the setup is proven on real routing behaviour.
23. As a developer, I want the first API test to check that the wrong method on an existing route returns 404, so that method routing is covered without depending on placeholder data.
24. As a developer replacing the placeholder API route, I want no test pinned to its payload, so that building the first real feature does not start with deleting a meaningless test.

## Implementation Decisions

- **Runner:** Vitest, which reuses the existing Vite pipeline (Vite 8). One Vitest config at the repo root defines two projects:
  - **API project:** Node environment. It covers the worker's test files and calls the Hono app's `request()` method on the app the worker exports by default. It does not start workerd or a dev server.
  - **Client project:** happy-dom environment, with React Testing Library, `@testing-library/user-event` and Testing Library's DOM matchers set up once for the project. It covers the React app's test files and resolves the `@/` alias the same way the app build does.
- **Test file naming:** `*.test.ts` or `*.test.tsx`, placed next to the module under test.
- **Empty projects:** `passWithNoTests` is enabled so the client project passes while it has no tests.
- **Scripts:** `test` runs Vitest once in run mode; `test:watch` runs Vitest in watch mode. `verify` becomes format check, lint, test, then build.
- **Pre-commit hook:** unchanged; it does not run tests.
- **CI:** no workflow change; it already runs `pnpm verify`.
- **Type-checking and lint:** test files are included in the TypeScript project that covers their side (app or worker) and in ESLint, and they must pass `pnpm verify` like any other source. Vitest globals are not used; tests import `describe`, `it` and `expect` explicitly.
- **Coverage:** no coverage package and no threshold.
- **Agent instructions:** add a short "Tests" section to the project's CLAUDE.md with the rule against tautological tests:
  - A test must fail if the behaviour it names breaks; it must not restate the implementation.
  - Assert what a user or API caller would see.
  - Mock only at system boundaries: network, time and third-party services. Never mock our own modules.
  - No snapshots of markup, no tests of shadcn component internals, and no assertions that copy literals from the code.
  - Also document where tests live, the two environments, and the `test` / `test:watch` scripts.
- **Future runtime switch (recorded, not built):** when the worker gains its first Cloudflare binding (D1, KV and so on), move the API project to `@cloudflare/vitest-pool-workers` so tests hit real local bindings instead of fakes. Before that move, check whether the pool can read `cloudflare.config.ts`; the repo has no Wrangler config.

## Testing Decisions

- **What makes a good test:** it checks external behaviour through the highest seam available and fails when that behaviour breaks. The test is "would this still pass if the feature were broken?" If it would, it is tautological and must not be written.
- **Seams:**
  - **API:** the Hono app's request interface, which already exists. Tests send a request and assert on the response status and body, as any caller would.
  - **Client:** rendering a component with React Testing Library and querying by accessible role and label. There are no client tests in this change.
- **Tests shipped with this change:** one API test file with two cases:
  - `GET /api/nope` returns 404.
  - `POST /api/` returns 404 because only GET is routed.
  - Deliberately excluded: any assertion on the placeholder payload of `GET /api/`. Nothing in the client consumes it, so such a test would only mirror the handler's literal.
- **Prior art:** none; these are the first tests in the repo.

## Out of Scope

- Client tests, until the client has real behaviour.
- Tests for the placeholder `GET /api/` payload.
- `@cloudflare/vitest-pool-workers` and running tests in workerd.
- Vitest browser mode and Playwright.
- End-to-end tests.
- Coverage reporting and thresholds.
- Running tests in the pre-commit hook.
- Any GLOSSARY.md entry or ADR. This is engineering practice, not product language, and every choice here is easy to reverse.

## Further Notes

- TypeScript must stay on 6.x (see CLAUDE.md); choose Vitest and Testing Library versions that work with TS 6 and Vite 8.
- The `tdd` skill is installed and is the expected way to add the first real feature's tests.

## Comments

Implemented as specified: Vitest 5 with `api` (Node) and `client` (happy-dom + React Testing Library) projects in `vitest.config.ts`, a client setup file at `src/react-app/test/setup.ts`, two routing tests in `src/worker/index.test.ts`, `test` / `test:watch` scripts, `test` added to `verify`, and a Tests section in CLAUDE.md. Checked that the API tests fail when a catch-all `/api/*` route is added, and that a probe client test (render, user-event, jest-dom matcher, `@/` import) runs.
