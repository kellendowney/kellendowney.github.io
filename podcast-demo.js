/* The team's live Streamlit app; updates remain owned by the team repository. */
(() => {
  'use strict';
  const host = document.getElementById('podcast-lab');
  if (!host) return;

  host.innerHTML = `
    <div class="pd-shell">
      <div class="pd-topline"><span class="pd-kicker"><span class="pd-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> LIVE TEAM DEMO</span><span class="pd-data-label">6,000 Podcast Index sample feeds</span></div>
      <div class="pd-intro"><h2 id="podcast-lab-title">Build a better <em>shortlist.</em></h2><div><p>Explore our team’s Podcast Opportunity Explorer. Set your screening criteria, search the sample, and see how each rule narrows the research queue.</p><a class="pd-project-link" href="#projects" data-podcast-project>Inside the Podcast Explorer project <span aria-hidden="true">↗</span></a></div></div>
      <div class="pd-app-toolbar"><p id="pd-app-help">Choose your filters in the app’s sidebar, then select <strong>Search feeds</strong>.</p><a class="pd-open-app" href="https://dso576-project-podcast-index.streamlit.app/" target="_blank" rel="noopener" data-podcast-launch>Open full app <span aria-hidden="true">↗</span></a></div>
      <div class="pd-app-frame"><iframe src="https://dso576-project-podcast-index.streamlit.app/?embed=true" title="Podcast Opportunity Explorer — live USC team application" aria-describedby="pd-app-help pd-app-availability" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen"></iframe></div>
      <p class="pd-availability" id="pd-app-availability">If the app is waking up or does not load here, use <a href="https://dso576-project-podcast-index.streamlit.app/" target="_blank" rel="noopener" data-podcast-launch>Open full app</a>. On a small screen, expand the app’s sidebar to find the filters.</p>
      <div class="pd-footnote"><span class="pd-footnote-mark" aria-hidden="true">↳</span><div><p>Built collaboratively by our USC DSO 576 team. This live app uses a 6,000-feed course sample. Activity is measured against the sample’s August 31, 2026 snapshot; results are a research queue for further review.</p><a href="https://github.com/JoanneY416/DSO576-project" target="_blank" rel="noopener">Explore the team’s source code <span aria-hidden="true">↗</span></a></div></div>
    </div>`;

  host.querySelector('[data-podcast-project]').addEventListener('click', event => {
    if (typeof showProject === 'function') {
      event.preventDefault();
      if (typeof selectFilter === 'function') selectFilter('featured');
      if (typeof featureProject === 'function') featureProject('podcast');
      showProject('podcast');
    }
  });
})();
