/* Motion remains optional, including scrolling and dynamically selected work. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let manualPause = false;
try { manualPause = localStorage.getItem('portfolio-motion-paused') === 'true'; } catch (_) {}
function updateMotion() {
  const paused = manualPause || reduced.matches;
  document.body.classList.toggle('motion-paused', paused);
  document.documentElement.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion';
  motionButton.disabled = reduced.matches;
  document.querySelectorAll('svg').forEach(svg => {
    if (paused) svg.pauseAnimations?.(); else svg.unpauseAnimations?.();
  });
}
motionButton.addEventListener('click', () => {
  manualPause = !manualPause;
  try { localStorage.setItem('portfolio-motion-paused', String(manualPause)); } catch (_) {}
  updateMotion();
});
reduced.addEventListener('change', updateMotion);
const motionObserver = new MutationObserver(updateMotion);
['#project-stage', '#dialog-content'].forEach(selector => motionObserver.observe(document.querySelector(selector), { childList: true }));
updateMotion();
const progress = document.querySelector('#scroll-progress');
const sectionLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let scrollQueued = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  let current = '';
  sections.forEach(section => { if (section.getBoundingClientRect().top <= 160) current = section.id; });
  sectionLinks.forEach(link => {
    if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
addEventListener('resize', updateScroll);
updateScroll();
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.about,.spotlight,.quote-grid figure').forEach(element => { element.classList.add('reveal'); revealObserver.observe(element); });
  const activityObserver = new IntersectionObserver(entries => entries.forEach(entry => { entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting); }));
  document.querySelectorAll('.hero,.section').forEach(element => activityObserver.observe(element));
}
document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-inactive', document.hidden));
const workStage = document.querySelector('#project-stage');
workStage.addEventListener('pointermove', event => {
  if (manualPause || reduced.matches || event.pointerType === 'touch') return;
  const art = event.target.closest('.stage-art'); if (!art) return;
  const rect = art.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
  art.style.setProperty('--pointer-x', x + 'px'); art.style.setProperty('--pointer-y', y + 'px');
  art.style.setProperty('--art-x', ((x / rect.width - .5) * 12) + 'px'); art.style.setProperty('--art-y', ((y / rect.height - .5) * 12) + 'px');
}, { passive: true });
workStage.addEventListener('pointerleave', () => {
  const art = workStage.querySelector('.stage-art'); if (art) { art.style.setProperty('--art-x', '0px'); art.style.setProperty('--art-y', '0px'); }
});
