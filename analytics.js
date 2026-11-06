/* Optional Umami integration. No tracking runs until an account's website ID is configured. */
(() => {
  'use strict';
  const websiteId = document.currentScript?.dataset.websiteId || '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(websiteId)) return;
  if (location.hostname !== 'kellendowney.github.io') return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  const projectIds = new Set(['media', 'podcast', 'uas-funding', 'planner', 'loneliness', 'competitive', 'shared-housing', 'travel', 'rental', 'forecast', 'energy', 'millennium', 'voting', 'california']);
  let ready = false;
  let unavailable = false;
  let demoUsed = false;
  const pending = [];

  function record(name, data = {}) {
    if (unavailable) return;
    if (!ready) {
      if (pending.length < 20) pending.push([name, data]);
      return;
    }
    try {
      Promise.resolve(window.umami?.track(name, data)).catch(() => {});
    } catch (_) { /* Analytics must never interrupt a portfolio interaction. */ }
  }

  function selectedProject() {
    const id = document.querySelector('#project-shelf [aria-selected="true"]')?.dataset.feature;
    if (projectIds.has(id)) record('project_select', { project: id });
  }

  function useDemo() {
    if (!demoUsed) {
      demoUsed = true;
      record('demo_used');
    }
  }

  // Keep full referrer paths, query strings, and hashes out of analytics payloads.
  window.portfolioAnalyticsBeforeSend = (type, payload) => {
    if (type !== 'event') return false;
    const cleaned = { ...payload };
    try {
      cleaned.url = new URL(payload.url || '/', location.origin).pathname;
      cleaned.referrer = payload.referrer ? new URL(payload.referrer).origin : '';
    } catch (_) {
      cleaned.url = '/';
      cleaned.referrer = '';
    }
    return cleaned;
  };

  document.addEventListener('click', event => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    const target = event.target;
    const link = target.closest('a[href]');
    if (link) {
      try {
        const url = new URL(link.href, location.origin);
        if (url.origin === location.origin && url.pathname === '/assets/Kellen_Downey_Resume.pdf') {
          record('resume_click');
        }
      } catch (_) { /* Ignore malformed links without changing navigation. */ }
    }
    if (target.closest('#project-shelf [data-feature], #shelf-prev, #shelf-next')) selectedProject();
    if (target.closest('#podcast-lab .pd-reset, #podcast-lab .pd-empty-reset, #podcast-lab .pd-show-all')) useDemo();
  }, { passive: true });

  document.addEventListener('change', event => {
    if (event.isTrusted && event.target instanceof Element && event.target.matches('#podcast-lab .pd-filters select')) useDemo();
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.target.closest('#project-shelf')) selectedProject();
  }, { passive: true });

  document.addEventListener('portfolio-project-open', event => {
    const id = event.detail?.id;
    if (projectIds.has(id)) record('project_open', { project: id });
  });

  const tracker = document.createElement('script');
  tracker.src = 'https://cloud.umami.is/script.js';
  tracker.async = true;
  tracker.dataset.websiteId = websiteId;
  tracker.dataset.domains = 'kellendowney.github.io';
  tracker.dataset.excludeSearch = 'true';
  tracker.dataset.excludeHash = 'true';
  tracker.dataset.doNotTrack = 'true';
  tracker.dataset.beforeSend = 'portfolioAnalyticsBeforeSend';
  tracker.addEventListener('load', () => {
    ready = typeof window.umami?.track === 'function';
    if (ready) pending.splice(0).forEach(([name, data]) => record(name, data));
    else { unavailable = true; pending.length = 0; }
  }, { once: true });
  tracker.addEventListener('error', () => {
    unavailable = true;
    pending.length = 0;
  }, { once: true });
  document.head.appendChild(tracker);
})();
