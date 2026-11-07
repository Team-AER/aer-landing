// The document is already usable. This module only adds optional interactions.
const workshop = document.querySelector('.ws-root');
const windowFrame = workshop.querySelector('.ws-window');
const status = workshop.querySelector('[role="status"]');
const retry = workshop.querySelector('.ws-retry');
const motionButton = document.querySelector('.motion-control button');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false;
let attempt = 0;
let pending = false;
let cleanup;

function updateMotion() {
  const off = paused || reduced.matches;
  document.documentElement.classList.toggle('motion-paused', off);
  workshop.dataset.motion = off ? 'off' : 'on';
  workshop.dispatchEvent(new Event('workshop-motion-change'));
  motionButton.disabled = reduced.matches;
  motionButton.setAttribute('aria-pressed', String(off));
  motionButton.textContent = reduced.matches ? 'Motion reduced by device' : paused ? 'Resume background motion' : 'Pause background motion';
  if (off) document.querySelector('.cursor-sticker')?.classList.remove('visible');
}
motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
reduced.addEventListener('change', updateMotion);
updateMotion();

async function openWorkshop() {
  if (pending || workshop.dataset.loadState === 'ready') return;
  pending = true;
  const restoreFocus = document.activeElement === retry;
  const current = ++attempt;
  let timeout;
  workshop.dataset.loadState = 'loading';
  windowFrame.setAttribute('aria-busy', 'true');
  retry.hidden = true;
  status.textContent = 'Setting out the tools…';
  workshop.querySelector('.ws-loading-stamp').textContent = 'TOOLS UNPACKING';
  const slow = setTimeout(() => {
    if (current !== attempt) return;
    workshop.dataset.loadState = 'slow';
    workshop.querySelector('.ws-loading-stamp').textContent = 'TAKE YOUR TIME';
    status.textContent = 'A little slower today. The projects are ready to explore.';
  }, 2500);
  try {
    // A fresh URL on retry avoids the browser's cached failed module response.
    const url = __WORKSHOP_URL__ + (current > 1 ? `?retry=${current}` : '');
    const module = await Promise.race([
      import(url),
      new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Workshop timed out')), 10000); })
    ]);
    cleanup?.();
    cleanup = module.initWorkshop(workshop);
    workshop.querySelectorAll('.ws-tool-tab').forEach(button => { button.disabled = false; });
    workshop.dataset.loadState = 'ready';
    status.textContent = 'Ready when you are.';
    // Preserve keyboard focus if the visitor activated Retry.
    if (restoreFocus) workshop.querySelector('.ws-tool-tab').focus();
  } catch {
    workshop.dataset.loadState = 'error';
    workshop.querySelector('.ws-loading-stamp').textContent = 'DEMO UNAVAILABLE';
    status.textContent = 'The demo couldn’t open. All project pages are still available.';
    retry.hidden = false;
    if (restoreFocus) retry.focus();
  } finally {
    pending = false;
    clearTimeout(slow);
    clearTimeout(timeout);
    windowFrame.setAttribute('aria-busy', 'false');
  }
}
retry.addEventListener('click', openWorkshop);

// Paint real content before importing the demo. On phones it waits until nearby.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    requestAnimationFrame(() => requestAnimationFrame(openWorkshop));
  }, { rootMargin: '120px' });
  observer.observe(workshop.querySelector('.ws-workshop'));
} else requestAnimationFrame(openWorkshop);

// Keep the authored catalogue swipe indicators and offscreen motion behavior.
document.querySelectorAll('.app-group').forEach(group => {
  const list = group.querySelector('.app-grid');
  const dots = [...group.querySelectorAll('.app-dots i')];
  list.addEventListener('scroll', () => {
    const width = list.firstElementChild.getBoundingClientRect().width + 16;
    const index = list.scrollLeft >= list.scrollWidth - list.clientWidth - 4 ? dots.length - 1 : Math.round(list.scrollLeft / width);
    dots.forEach((dot, i) => dot.classList.toggle('on', index === i));
  }, { passive: true });
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-off', !entry.isIntersecting)));
  document.querySelectorAll('.marquee').forEach(el => observer.observe(el));
}

// One transform per frame; skip touch pointers and respect live motion settings.
const sticker = document.querySelector('.cursor-sticker');
let frame = 0;
let pointer;
window.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch' || paused || reduced.matches || !sticker) return;
  pointer = event;
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    if (paused || reduced.matches) return;
    sticker.style.transform = `translate(${pointer.clientX}px, ${pointer.clientY - 24}px) rotate(-5deg)`;
    sticker.classList.add('visible');
  });
}, { passive: true });
window.addEventListener('mouseover', event => {
  if (sticker) sticker.textContent = event.target.closest('[data-cursor]')?.dataset.cursor || 'hi :)';
});
document.body.addEventListener('mouseleave', () => sticker?.classList.remove('visible'));
