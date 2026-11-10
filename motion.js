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
  motionButton.setAttribute('aria-label', reduced.matches ? 'Reduced motion is enabled in your system settings' : paused ? 'Play decorative motion' : 'Pause decorative motion');
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
['#project-shelf', '#dialog-content'].forEach(selector => motionObserver.observe(document.querySelector(selector), { childList: true }));
updateMotion();
const progress = document.querySelector('#scroll-progress');
const sectionLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main > section[id]')].filter(section => sectionLinks.some(link => link.hash === '#' + section.id));
const heroPortrait = document.querySelector('.hero-portrait');
const heroSection = document.querySelector('.cinematic-hero');
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
  if (heroPortrait && heroSection && !manualPause && !reduced.matches && innerWidth > 760 && scrollY < heroSection.offsetHeight) heroPortrait.style.setProperty('--portrait-y', Math.min(scrollY * .055, 38) + 'px');
  scrollQueued = false;
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
addEventListener('resize', updateScroll);
updateScroll();
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.about,.spotlight,.featured-endorsement,.academic-endorsement').forEach(element => { element.classList.add('reveal'); revealObserver.observe(element); });
  const activityObserver = new IntersectionObserver(entries => entries.forEach(entry => { entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting); }));
  document.querySelectorAll('.hero,.section').forEach(element => activityObserver.observe(element));
}
document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-inactive', document.hidden));
// Restrained depth on the gallery, with no scroll interception.
const gallery = document.querySelector('#project-shelf');
gallery?.addEventListener('pointermove', event => {
  if (manualPause || reduced.matches || event.pointerType === 'touch') return;
  const card = event.target.closest('.project-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--pointer-x', ((event.clientX - rect.left) / rect.width * 100) + '%');
  card.style.setProperty('--pointer-y', ((event.clientY - rect.top) / rect.height * 100) + '%');
}, { passive: true });
