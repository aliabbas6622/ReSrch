# Research Swarm architecture

## Product boundary

Research Swarm is a bounded, human-steerable research workflow—not a source of
ground truth. The system separates the browser experience, API orchestration,
model adapter, evidence ledger, and persistence boundary so each can evolve
without turning the application into an opaque autonomous loop.

```text
React workspace → typed HTTP boundary → swarm state machine → model adapter
       ↓                    ↓                    ↓
local/private ledger   validation + limits   claims + audit events
```

## Request and execution flow

1. A user formulates a question and selects a specialist roster.
2. `POST /api/swarm/init` normalizes configuration and creates an explicit
   session state machine.
3. `POST /api/swarm/step` advances exactly one bounded phase. The client may
   schedule steps, but it cannot bypass the server's transition logic.
4. Specialists produce structured claims. Cross-examination records support
   and contradiction rather than silently overwriting evidence.
5. Synthesis preserves unresolved disputes and bibliography entries.
6. Signed-in ledgers are isolated under `users/{uid}`. Signed-out work remains
   local to the browser.

## Harness invariants

- **Bounded work:** debate rounds, roster size, messages, claims, request size,
  laborer depth, and request rate have hard ceilings.
- **Observable transitions:** phase changes and decisions append audit events.
- **Evidence before confidence:** a confidence label never substitutes for a
  source. Contested claims remain visible in the report.
- **One-step steerability:** execution advances one state transition per API
  call and can be paused between transitions.
- **Least-privilege persistence:** public, unauthenticated Firestore writes are
  prohibited.
- **Accessible navigation:** top-level workspaces have stable URLs, browser
  history support, keyboard focus indicators, and reduced-motion behavior.

## Next production slices

The current server carries session state in requests for portability. The next
production increment should store authoritative sessions server-side with
optimistic version numbers, enqueue model tasks, stream typed events over SSE,
and reject stale transitions. Model output should move from best-effort JSON
parsing to provider-supported structured output validated against a shared
schema package. Evaluation should cover citation validity, claim entailment,
source diversity, contradiction recall, task completion, latency, and cost.

## Design references

These primary references informed the direction and should be re-checked when
the architecture changes:

- Anthropic, [Building effective agents](https://www.anthropic.com/research/building-effective-agents): prefer simple composable workflows, evaluation, and bounded agent loops.
- NIST, [AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence): measure and manage trustworthiness risks across the lifecycle.
- W3C, [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/): keyboard access, visible focus, target sizing, reflow, and reduced interaction barriers.
- Google, [Agent Development Kit](https://google.github.io/adk-docs/): explicit workflow agents, multi-agent composition, sessions, and evaluation.

The execution environment blocked outbound access while this revision was made;
these canonical links are recorded for maintainers rather than represented as a
live literature review.
