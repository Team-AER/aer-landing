# Parakeet Suppression landing page

## Plan and positioning

Add `/parakeet-suppression/` to the existing static AER site and its Run & secure catalogue. Preserve the production nginx and shared shell. Present a research effort into conversational privacy, with an explicit distinction between the goal and demonstrated capability. The visitor should understand the question, inspect the approach and limitations, and contact the team.

The requested Claude market artifact was inaccessible; the user instructed us to skip it. No market-size, competitor, adoption or demand claims are inferred from that artifact.

## Evidence and claims

Reviewed the supplied project checkout's README and dated research documents, with an Astra research review. Trained experimental checkpoints exist; the older project guidance saying the model is untrained is stale. The implementation supports learned bounded audio changes, evaluation against speech recognition, quality measurement and saved-audio replay. Reliable protection for real-world conversations is not established. The Omi windowed pilot reported 0/8 planned suppression successes for each of three model arms and stopped expansion. Quiet long-audio settings did not demonstrate severe transcription damage.

Source repository: `NidhiBharani/parakeet-suppression-nn` (private; default branch `codex/initial-architecture`). Evidence files: `README.md`, `docs/omi-windowed-tdt-execution-2026-10-24.md`, `docs/sn11-results-and-next-experiments-2026-10-21.md`. Public-facing copy must not suggest a public source download, validated meeting protection, a shipped app, universal model coverage, or guaranteed inaudibility. Source access is by request.

## Design and interactions

Astra design implementation uses cobalt, ice blue and generous negative space, with the site's shared AER strip and footer. A synthetic signal illustration explains the research question without pretending to execute a model or display a measured result. No microphone access, audio upload, fake testimonials, waitlist backend or fabricated success metrics.

Use native controls, visible focus, semantic landmarks, responsive layouts and reduced-motion support. Scripts remain first-party and compatible with the existing strict CSP. Contact uses the established `hello@aer.app` address; the page does not collect submissions.

## Delivery

This change belongs in the user-specified `Team-AER/aer-landing` repository. It uses the existing site's deployment path rather than creating a second, separately hosted AER site. Review through a feature branch and pull request; no merge or production deployment is implied by local validation.

## Validation — 2026-11-05

- Docker image built successfully using the repository Dockerfile.
- Chromium with axe-core: zero WCAG A/AA automated violations and no horizontal overflow at 1440, 768, 390 and 360 px. No page JavaScript errors.
- Keyboard slider updates the SVG and accessible value; mobile menu closes with Escape and restores focus.
- Internal anchors resolve; content remains readable with JavaScript disabled; reduced-motion mode checked.
- Homepage renders the new catalogue entry; homepage and every existing app route return HTTP 200 under nginx. The new route receives the existing strict CSP and denied microphone permission.
- Astra evidence review found no material overclaims; final-set language was narrowed to development audio and simulated conditions.
- Automated accessibility checks complement visual/keyboard review; they do not certify full accessibility conformance. No ML experiment or production deployment was run.
