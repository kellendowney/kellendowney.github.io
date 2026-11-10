/* A recorded validation case, followed by the team's live application. */
(() => {
  'use strict';
  const host = document.getElementById('podcast-lab');
  if (!host) return;
  const evidenceRoot = 'https://github.com/JoanneY416/DSO576-project/blob/00122879d37b2b8a1ddf20aaa166dfe0323d610e/';
  const appUrl = 'https://dso576-project-podcast-index.streamlit.app/';
  let restricted = false;
  let currentStep = 0;
  const steps = ['Screen', 'Verify', 'Interpret'];

  host.innerHTML = `
    <div class="pd-shell">
      <div class="pd-topline"><span class="pd-kicker">02 / THE INTERACTIVE CASE</span><span class="pd-data-label">Podcast Opportunity Explorer</span></div>
      <div class="pd-intro"><h2 id="podcast-lab-title">Look beyond<br>the <em>number.</em></h2><div><p>A shortlist can be numerically correct and still need a closer look. Walk through my independent check of our team’s podcast application.</p><a class="pd-project-link" href="#projects" data-podcast-project>Explore the full project <span aria-hidden="true">↗</span></a></div></div>
      <div class="pd-audit" aria-labelledby="pd-audit-title">
        <div class="pd-audit-heading"><h3 id="pd-audit-title">From search result to sound judgment.</h3><p>RECORDED AUDIT · 08 NOV 2026</p></div>
        <div class="pd-step-tabs" role="tablist" aria-label="Validation walkthrough">${steps.map((name,i)=>`<button type="button" id="pd-step-${i}" role="tab" aria-controls="pd-step-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-audit-step="${i}"><span class="pd-step-number">0${i+1}</span><span>${name}</span><span class="pd-step-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
        <div class="pd-step-panel" id="pd-step-panel" role="tabpanel" aria-labelledby="pd-step-0"></div>
        <div class="pd-audit-bottom"><p>Recorded case example. Walkthrough controls do not change the live app.</p><button type="button" class="pd-next-step" data-audit-next>Next: Verify <span aria-hidden="true">→</span></button></div>
        <div class="pd-step-announcement sr-only" aria-live="polite" aria-atomic="true"></div>
      </div>
      <div class="pd-evidence-links"><a href="${evidenceRoot}Kellen_Downey_Module_11_Case.pdf" target="_blank" rel="noopener">Read my validation case <span aria-hidden="true">↗</span></a><a href="${evidenceRoot}check_kellen_case.py" target="_blank" rel="noopener">Inspect the Python check <span aria-hidden="true">↗</span></a><a href="${evidenceRoot}change-requests.md" target="_blank" rel="noopener">See proposed changes <span aria-hidden="true">↗</span></a></div>
      <details class="pd-live-app">
        <summary><span><span class="pd-live-label">TRY IT YOURSELF</span><strong>Explore the live team app</strong></span><span class="pd-expand-icon" aria-hidden="true">+</span></summary>
        <div class="pd-live-content"><div class="pd-app-toolbar"><p id="pd-app-help">Choose filters in the app’s sidebar, then select <strong>Search feeds</strong>.</p><a class="pd-open-app" href="${appUrl}" target="_blank" rel="noopener" data-podcast-launch>Open full app <span aria-hidden="true">↗</span></a></div>
        <div class="pd-app-frame"><iframe data-src="${appUrl}?embed=true" title="Podcast Opportunity Explorer — live USC team application" aria-describedby="pd-app-help pd-app-availability" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen"></iframe></div>
        <p class="pd-availability" id="pd-app-availability">If the app is waking up or does not load here, use <a href="${appUrl}" target="_blank" rel="noopener" data-podcast-launch>Open full app</a>. On a small screen, expand the app’s sidebar to find the filters.</p></div>
      </details>
      <div class="pd-footnote"><p>Built collaboratively by our USC DSO 576 team using a 6,000-feed course sample. Activity is measured against the sample’s August 31, 2026 snapshot. Results are a research queue for further review.</p><div><a href="https://github.com/JoanneY416/DSO576-project" target="_blank" rel="noopener">Team source code ↗</a><a href="https://www.youtube.com/watch?v=ZsCTqS07-Hw" target="_blank" rel="noopener">Team demo video ↗</a><a href="${appUrl}" target="_blank" rel="noopener" data-podcast-launch>Open full app ↗</a></div></div>
    </div>`;

  const panel = host.querySelector('#pd-step-panel');
  const tabButtons = [...host.querySelectorAll('[data-audit-step]')];
  const announcement = host.querySelector('.pd-step-announcement');
  const nextButton = host.querySelector('[data-audit-next]');

  function screenMarkup() {
    return `<div class="pd-step-copy"><span class="pd-scene-label">01 / ASK A PRECISE QUESTION</span><h4>Which feeds pass<br>the screening rules?</h4><p>I used a child-focused research scenario and changed only the explicit-content preference. Try the two recorded settings.</p><dl class="pd-settings"><div><dt>Category</dt><dd>Kids</dd></div><div><dt>Language</dt><dd>English · all variants</dd></div><div><dt>Activity window</dt><dd>90 days</dd></div><div><dt>Minimum episodes</dt><dd>20</dd></div><div><dt>Minimum score</dt><dd>0</dd></div></dl></div>
      <div class="pd-scene pd-screen-scene"><span class="pd-scene-label" id="pd-preference-label">EXPLICIT-CONTENT PREFERENCE</span><div class="pd-audit-options" role="group" aria-labelledby="pd-preference-label"><button type="button" data-audit-choice="any" aria-pressed="${!restricted}">Any</button><button type="button" data-audit-choice="not-explicit" aria-pressed="${restricted}">Not explicit only</button></div><div class="pd-audit-result" aria-live="polite" aria-atomic="true"><strong data-audit-count>${restricted?6:7}</strong><span>eligible feeds<small data-audit-description>${restricted?'One feed removed by the explicit-content filter.':'Recorded result with either explicit-content status.'}</small></span></div><div class="pd-feed-markers${restricted?' pd-restricted':''}" aria-hidden="true">${Array.from({length:7},(_,i)=>`<div style="--i:${i}"><i></i><span>0${i+1}</span></div>`).join('')}</div><p class="pd-scene-note">The markers show counts, not individual feed identities.</p></div>`;
  }
  function verifyMarkup() {
    return `<div class="pd-step-copy"><span class="pd-scene-label">02 / REPRODUCE THE RESULT</span><h4>The counts match.<br>The label needs care.</h4><p>I independently recomputed the searches from the CSV and checked the returned feed IDs.</p><p>The app’s “Meeting episode minimum” card also applies the explicit-content preference. That combines two screening decisions under one label.</p><a class="pd-inline-source" href="${evidenceRoot}check_kellen_case.py" target="_blank" rel="noopener">Read the independent check ↗</a></div>
      <div class="pd-scene pd-verify-scene"><span class="pd-scene-label">APP RESULT / INDEPENDENT CHECK</span><div class="pd-verification-table"><div class="pd-table-head"><span>Preference</span><span>App</span><span>CSV</span></div><div><span>Any</span><strong>7</strong><strong>7 <i aria-label="matches">✓</i></strong></div><div><span>Not explicit only</span><strong>6</strong><strong>6 <i aria-label="matches">✓</i></strong></div></div><div class="pd-funnel"><span class="pd-scene-label">THE SEPARATE STEPS I PROPOSED</span><div><span>Episode minimum met</span><strong>7</strong></div><span class="pd-funnel-connector" aria-hidden="true">↓</span><div><span>After “Not explicit only”</span><strong>6</strong></div></div><p class="pd-scene-note">Proposed label separation · CR-09</p></div>`;
  }
  function interpretMarkup() {
    return `<div class="pd-step-copy"><span class="pd-scene-label">03 / CHECK WHAT IT MEANS</span><h4>“Not explicit” does<br>not mean child-safe.</h4><p>Feed metadata can help narrow a research queue. It does not establish age suitability, editorial quality, or whether a partnership makes sense.</p><p>I documented clearer funnel stages and a better explanation of explicit metadata. Both changes remained proposed in the audited version.</p><a class="pd-inline-source" href="${evidenceRoot}change-requests.md" target="_blank" rel="noopener">Read CR-09 and CR-10 ↗</a></div>
      <div class="pd-scene pd-interpret-scene"><span class="pd-scene-label">THE DECISION CHECK</span><div class="pd-decision-list"><div><span class="pd-decision-symbol" aria-hidden="true">✓</span><p><strong>Counts reproduced</strong><span>Both searches match the independent calculation.</span></p></div><div><span class="pd-decision-symbol" aria-hidden="true">↳</span><p><strong>Label needs clarification</strong><span>Show where each screening rule changes the queue.</span></p></div><div><span class="pd-decision-symbol" aria-hidden="true">?</span><p><strong>Age suitability unverified</strong><span>Review the actual content before making a child-focused decision.</span></p></div></div><div class="pd-takeaway">A stronger decision starts with knowing<br><em>what the data can support.</em></div></div>`;
  }
  const scenes = [screenMarkup, verifyMarkup, interpretMarkup];

  function selectStep(index, moveFocus = false) {
    currentStep = index;
    tabButtons.forEach((button,i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `pd-step-${index}`);
    panel.innerHTML = scenes[index]();
    panel.dataset.step = String(index);
    nextButton.innerHTML = index === 2 ? 'Back to Screen <span aria-hidden="true">↶</span>' : `Next: ${steps[index+1]} <span aria-hidden="true">→</span>`;
    if (moveFocus) tabButtons[index].focus({preventScroll:true});
    announcement.textContent = `Step ${index+1} of 3: ${steps[index]}.`;
  }
  tabButtons.forEach((button,index) => button.addEventListener('click', () => selectStep(index)));
  host.querySelector('.pd-step-tabs').addEventListener('keydown', event => {
    let index = currentStep;
    if (event.key === 'ArrowRight') index = (index + 1) % 3;
    else if (event.key === 'ArrowLeft') index = (index + 2) % 3;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = 2;
    else return;
    event.preventDefault();
    selectStep(index, true);
  });
  nextButton.addEventListener('click', () => selectStep((currentStep + 1) % 3));
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-audit-choice]');
    if (!button) return;
    restricted = button.dataset.auditChoice === 'not-explicit';
    panel.querySelectorAll('[data-audit-choice]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    panel.querySelector('[data-audit-count]').textContent = restricted ? '6' : '7';
    panel.querySelector('[data-audit-description]').textContent = restricted ? 'One feed removed by the explicit-content filter.' : 'Recorded result with either explicit-content status.';
    panel.querySelector('.pd-feed-markers').classList.toggle('pd-restricted', restricted);
  });
  host.querySelector('.pd-live-app').addEventListener('toggle', event => {
    if (!event.target.open) return;
    const frame = host.querySelector('iframe');
    if (!frame.hasAttribute('src')) frame.src = frame.dataset.src;
  });
  host.querySelector('[data-podcast-project]').addEventListener('click', event => {
    if (typeof showProject === 'function') {
      event.preventDefault();
      if (typeof selectFilter === 'function') selectFilter('featured');
      if (typeof featureProject === 'function') featureProject('podcast');
      showProject('podcast');
    }
  });
  selectStep(0);
})();
