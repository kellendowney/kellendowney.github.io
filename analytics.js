/* Optional Umami integration. No tracking runs until an account's website ID is configured. */
(() => {
  'use strict';
  const websiteId = document.currentScript?.dataset.websiteId || '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(websiteId)) return;
  if (location.hostname !== 'kellendowney.github.io') return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  const projectIds = new Set(['media', 'podcast', 'uas-funding', 'planner', 'loneliness', 'competitive', 'shared-housing', 'travel', 'rental', 'forecast', 'energy', 'millennium', 'voting', 'california']);
  // Public placement labels only: never accept names, emails, IDs, or free-form campaign values.
  const campaignValues = {
    utm_source: new Set(['linkedin', 'instagram', 'resume', 'application', 'email', 'github']),
    utm_medium: new Set(['social', 'document', 'application', 'email', 'referral']),
    utm_campaign: new Set(['portfolio']),
  };
  const localEvidence = new Map([
    ['/assets/Media_Exposure_Manuscript_and_Appendix.pdf', 'media_manuscript'],
    ['/assets/Political_Attitudes_Research_Proposal.docx', 'media_proposal'],
    ['/assets/Loneliness_Political_Violence_Poster.pdf', 'loneliness_poster'],
    ['/assets/Loneliness_Political_Violence_Capstone.docx', 'loneliness_capstone'],
    ['/assets/Shared_Housing_Revenue.pptx', 'shared_housing_deck'],
    ['/assets/Travel_Analysis_Strategic_Pivot.pptx', 'travel_pivot'],
    ['/assets/Travel_Analysis_Expanded.pptx', 'travel_expanded'],
    ['/assets/Travel_Analysis_Initial.pptx', 'travel_initial'],
    ['/assets/US_Economic_Forecast_2026.docx', 'economic_outlook'],
    ['/assets/Australia_Energy_Strategy.pptx', 'energy_strategy'],
    ['/assets/Millennium_Villages_Analysis.docx', 'millennium_paper'],
    ['/assets/Compulsory_Voting_Proposal.docx', 'voting_proposal'],
    ['/assets/California_Polarization_Poster.jpg', 'california_poster'],
  ]);
  const teamEvidence = new Map([
    ['Kellen_Downey_Module_11_Case.pdf', 'case'],
    ['check_kellen_case.py', 'audit'],
    ['change-requests.md', 'changes'],
  ]);
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

  function evidenceLabel(url) {
    if (url.origin === location.origin) return localEvidence.get(url.pathname);
    if (url.protocol !== 'https:') return;
    if (url.hostname === 'github.com') {
      const match = url.pathname.match(/^\/JoanneY416\/DSO576-project\/blob\/(?:main|[a-f0-9]{40})\/([^/]+)$/);
      if (match) return teamEvidence.get(match[1]);
    }
    if (['youtube.com', 'www.youtube.com'].includes(url.hostname) &&
        url.pathname === '/watch' && url.searchParams.get('v') === 'ZsCTqS07-Hw') return 'team_video';
  }

  // Allow only predefined campaign labels. Strip every other query, hash, and referrer path.
  // Umami attaches the native collection timestamp; no client timestamp is necessary.
  window.portfolioAnalyticsBeforeSend = (type, payload) => {
    if (type !== 'event') return false;
    const cleaned = { ...payload };
    try {
      const url = new URL(payload.url || '/', location.origin);
      const accepted = new URLSearchParams();
      for (const [key, values] of Object.entries(campaignValues)) {
        const value = (url.searchParams.get(key) || '').toLowerCase();
        if (values.has(value)) accepted.set(key, value);
      }
      const query = accepted.toString();
      cleaned.url = url.pathname + (query ? '?' + query : '');
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
        if (url.protocol === 'mailto:' && url.pathname === 'kmdowney@usc.edu') {
          record('contact_click', { channel: 'email' });
        } else if (url.protocol === 'https:' && ['linkedin.com', 'www.linkedin.com'].includes(url.hostname) &&
                   /^\/in\/kellendowney\/?$/.test(url.pathname)) {
          record('contact_click', { channel: 'linkedin' });
        }
        const item = evidenceLabel(url);
        if (item) record('evidence_open', { item });
      } catch (_) { /* Ignore malformed links without changing navigation. */ }
    }
    if (target.closest('#project-shelf [data-feature], #shelf-prev, #shelf-next')) selectedProject();
    if (link && link.hostname === 'dso576-project-podcast-index.streamlit.app') useDemo();
    const choice = target.closest('[data-audit-choice]')?.dataset.auditChoice;
    if (choice === 'any' || choice === 'not-explicit') record('audit_compare', { option: choice });
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) && event.target.closest('#project-shelf')) selectedProject();
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
  // beforeSend needs the query in order to retain accepted UTM tags. It removes everything else.
  tracker.dataset.excludeSearch = 'false';
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

