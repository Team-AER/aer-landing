# Mobile UI audit — October 17, 2026

Audited the hub and all twelve canonical product pages in real Chromium through
Playwright CLI. Checked 320, 375, 390, 768 and 1440 px widths, with touch and mobile
viewport emulation at the three phone widths. Scrolled each page to reveal its
content before taking full-page screenshots. Reviewed the screenshots and measured
both document width and overflowing internal containers; a clipped body alone does
not establish that the contents fit.

| Route | Findings and changes |
| --- | --- |
| `/` | Gave the logo and links room at 320 px; allowed the two-column hero buttons to wrap. Verified all three catalogue swipe rows reach their final app. |
| `/pensieve/` | Existing phone reader fits. Verified ordering controls; improved the shared section menu. |
| `/hedwig/` | Existing phone reader and correction popovers fit. Verified correction and undo; improved the shared section menu. |
| `/quill/` | Wrapped player chrome that was clipped inside the preview; increased phone speaker-filter and chapter targets to 44 px. Verified filtering and seeking. The detailed meeting map and tabs retain local scrolling. |
| `/accio/` | Existing console fits; report screenshots intentionally scroll within their own containers. Verified report-view switching and loading the lazy magazine image; improved the shared section menu. |
| `/erised/` | Changed the narrow mood list to two columns and allowed the arcade HUD to wrap so content is not clipped. Verified reflection disclosure and the shared section menu. |
| `/cantis/` | Restored phone section navigation with a menu; enlarged interactive preview controls, gave ranges a 44 px touch area, used 16 px phone form text, wrapped playback controls and stacked parameter fields under their labels. Verified tag entry, shift and loop controls. |
| `/polyjuicevoice/` | Restored phone section navigation with a menu; enlarged preview buttons, used 16 px phone form text and moved playback time to its own row. Verified preset selection, form editing and speaking preview. |
| `/subtly/` | Existing phone preview fits. Verified platform switching; improved the shared section menu. |
| `/avifors/` | Existing timeline and code containers scroll locally. Verified timeline scrolling; improved the shared section menu. |
| `/athena/` | Existing tables scroll locally and show scroll cues. Verified defang and loading the recorded walkthrough; improved the shared section menu. |
| `/omniocular/` | Existing phone preview fits and architecture diagram scrolls locally. Verified authorization preview; improved the shared section menu. |
| `/promptmask/` | Removed the competing top-bar CTA on the narrowest phones so the brand keeps its full width. Access remains in the section menu and hero. Verified category switches. |

Shared menus now close with Escape and restore toggle focus, dismiss when focus or
a pointer leaves, and scroll inside a short viewport. Opening a shared menu focuses
its first link, keeping links that precede the toggle in DOM order reachable by
keyboard. Cantis and PolyJuiceVoice use React-managed menus with the same Escape and
focus behavior. Their menu links follow the toggle in keyboard order.

Validation completed:

- 65 route/viewport combinations: no document-width overflow or browser exceptions.
- 70 interaction assertions, including all twelve phone menus at 320 × 400 px,
  Escape/focus restoration, anchor navigation and the workflows listed above.
- Internal clipping rechecked after fixes. Remaining overflow belongs to intentional
  local scrollers, decorative artwork/marquees or the hidden accessible table header.
- Docker image build, healthy container, all thirteen routes, clean-URL redirect,
  unknown-path 404, private docs, CSP differences and excluded browser artifacts.
- `node --check shared/shell.js` and `git diff --check`.
- Hadolint passes at warning/error threshold. Latest hadolint also reports existing
  informational DL3066 for unchanged `USER nginx`; the baseline reports it too.

Local screenshots and browser logs are under `output/playwright/`; both that folder
and `.playwright-cli/` are excluded from Git and the served Docker image. This audit
covers public landing pages and previews. The underlying products are separate
repositories.
