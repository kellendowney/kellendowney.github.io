/* The team's live Streamlit app; updates remain owned by the team repository. */
(() => {
  'use strict';
  const host = document.getElementById('podcast-lab');
  if (!host) return;
  const evidenceRoot = 'https://github.com/JoanneY416/DSO576-project/blob/00122879d37b2b8a1ddf20aaa166dfe0323d610e/';

  host.innerHTML = `
    <div class="pd-shell">
      <div class="pd-topline"><span class="pd-kicker"><span class="pd-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> LIVE TEAM DEMO</span><span class="pd-data-label">6,000 Podcast Index sample feeds</span></div>
      <div class="pd-intro"><h2 id="podcast-lab-title">Build a better <em>shortlist.</em></h2><div><p>Explore our team’s Podcast Opportunity Explorer. Set your screening criteria, search the sample, and inspect the counts behind the research queue.</p><a class="pd-project-link" href="#projects" data-podcast-project>Inside the Podcast Explorer project <span aria-hidden="true">↗</span></a></div></div>
      <aside class="pd-audit" aria-labelledby="pd-audit-title">
        <div class="pd-audit-copy"><p class="pd-audit-eyebrow">MY VALIDATION CASE <span>08 NOV 2026</span></p><h3 id="pd-audit-title">Not marked explicit <em>≠</em> suitable for children.</h3><p>I independently reproduced two live searches, then asked whether the results supported a child-focused decision. The count checks out. The age-suitability interpretation does not.</p><a class="pd-audit-link" href="${evidenceRoot}Kellen_Downey_Module_11_Case.pdf" target="_blank" rel="noopener">Read my case study <span aria-hidden="true">↗</span></a></div>
        <div class="pd-audit-example"><p class="pd-audit-label" id="pd-example-label">COMPARE THE RECORDED RESULTS</p><div class="pd-audit-options" role="group" aria-labelledby="pd-example-label" aria-describedby="pd-example-help"><button type="button" data-audit-choice="any" aria-pressed="true">Any</button><button type="button" data-audit-choice="not-explicit" aria-pressed="false">Not explicit only</button></div><div class="pd-audit-result" aria-live="polite" aria-atomic="true"><strong data-audit-count>7</strong><p><b>eligible feeds</b><span data-audit-description>Any explicit-content preference.</span></p></div><div class="pd-audit-dots" aria-hidden="true">${Array.from({length:7}, () => '<i></i>').join('')}</div><p class="pd-audit-settings">Kids · English (all variants) · 90 days<br>20 minimum episodes · minimum score 0</p><p class="pd-example-help" id="pd-example-help">Recorded case example. These buttons do not change the live app below.</p></div>
        <details class="pd-audit-details"><summary>What the independent check uncovered <span aria-hidden="true">+</span></summary><div><p>The episode-only count stays at <strong>7</strong>. Selecting “Not explicit only” removes one feed, leaving <strong>6</strong>, but the app attributes that drop to its “Meeting episode minimum” card. I proposed separate funnel stages (CR-09) and a clearer explanation of explicit metadata (CR-10). Both requests remain open in this recorded version; the filter does not certify age suitability.</p><div class="pd-audit-resources"><a href="${evidenceRoot}check_kellen_case.py" target="_blank" rel="noopener">Independent Python check ↗</a><a href="${evidenceRoot}change-requests.md" target="_blank" rel="noopener">Proposed changes ↗</a><a href="https://www.youtube.com/watch?v=ZsCTqS07-Hw" target="_blank" rel="noopener">Watch the team demo ↗</a></div></div></details>
      </aside>
      <div class="pd-app-toolbar"><p id="pd-app-help">Choose your filters in the app’s sidebar, then select <strong>Search feeds</strong>.</p><a class="pd-open-app" href="https://dso576-project-podcast-index.streamlit.app/" target="_blank" rel="noopener" data-podcast-launch>Open full app <span aria-hidden="true">↗</span></a></div>
      <div class="pd-app-frame"><iframe src="https://dso576-project-podcast-index.streamlit.app/?embed=true" title="Podcast Opportunity Explorer — live USC team application" aria-describedby="pd-app-help pd-app-availability" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen"></iframe></div>
      <p class="pd-availability" id="pd-app-availability">If the app is waking up or does not load here, use <a href="https://dso576-project-podcast-index.streamlit.app/" target="_blank" rel="noopener" data-podcast-launch>Open full app</a>. On a small screen, expand the app’s sidebar to find the filters.</p>
      <div class="pd-footnote"><span class="pd-footnote-mark" aria-hidden="true">↳</span><div><p>Built collaboratively by our USC DSO 576 team. This live app uses a 6,000-feed course sample. Activity is measured against the sample’s August 31, 2026 snapshot; results are a research queue for further review.</p><a href="https://github.com/JoanneY416/DSO576-project" target="_blank" rel="noopener">Explore the team’s source code <span aria-hidden="true">↗</span></a></div></div>
    </div>`;

  const auditButtons = [...host.querySelectorAll('[data-audit-choice]')];
  auditButtons.forEach(button => button.addEventListener('click', () => {
    const restricted = button.dataset.auditChoice === 'not-explicit';
    auditButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    host.querySelector('[data-audit-count]').textContent = restricted ? '6' : '7';
    host.querySelector('[data-audit-description]').textContent = restricted
      ? 'Not explicit only. One feed removed; age suitability is unverified.'
      : 'Any explicit-content preference.';
    host.querySelector('.pd-audit-dots').classList.toggle('pd-audit-restricted', restricted);
  }));

  host.querySelector('[data-podcast-project]').addEventListener('click', event => {
    if (typeof showProject === 'function') {
      event.preventDefault();
      if (typeof selectFilter === 'function') selectFilter('featured');
      if (typeof featureProject === 'function') featureProject('podcast');
      showProject('podcast');
    }
  });
})();
