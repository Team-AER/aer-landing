# Website clarity and motion verification — 24 October 2026

The Cantis and PolyJuiceVoice studios now say that they are interactive previews which create no audio. Generation/speech preview actions acknowledge progress, completion and cancellation explicitly; native-only modes/export are disabled with an explanation. Text, presets, tags and illustrative playback remain available. Keyboard focus is visible in the studio.

The Avifors trace uses the existing control for Pause, Resume and Replay. Pausing holds its one clock, all readouts and automatic timeline following, including during the startup delay. Cantis' hero plays once, settles, and offers pause/replay. Product pages and the catalogue expose a background-motion control and respond to a changed device reduced-motion preference. The catalogue's existing project action receives primary emphasis, with a shorter introduction. Palettes, fonts, navigation and overall layouts stay in place.

Verified locally:

- Chromium at 1440×1000, 390×844 and 320×844; no page-wide horizontal overflow.
- Both studios: immediate acknowledgement, truthful completion, repeat, playback pause, and live reduced-motion completion. Cantis cancellation retains its inputs.
- Long synthetic prompts retained after keyboard-triggered preview; visible focus; disabled native-only controls; menu Escape/focus restoration and rapid reversal.
- Background pause stops infinite decorative animation; resuming does not queue obsolete work. Cantis hero time and spinning artwork pause together; one playback settles at 00:30 and Replay can be paused immediately.
- Avifors early pause, held readouts/follow position, resume, replay and reduced-motion final state.
- Docker image build and nginx smoke checks for all public pages, 404/private docs behavior and the existing strict/eval CSP boundaries.

`verification.json` records the browser results. Interface states used synthetic sample content; the previews create no media.

This is a website UI change. Native app synthesis/export, production hosting, physical-device frame pacing and a complete accessibility audit were not tested. Nothing was deployed or merged.

Generated review images are retained locally outside Git and are not included in this repository.
