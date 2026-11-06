/* Portfolio-only demonstration. These nine records are fictional. */
(() => {
  'use strict';

  const records = Object.freeze([
    { id: 'studio', title: 'Signal & Studio', category: 'Culture', language: 'en', episodeCount: 128, daysSinceUpdate: 3, description: 'Conversations about the people who make creative work.' },
    { id: 'ledger', title: 'The Everyday Ledger', category: 'Business', language: 'en', episodeCount: 84, daysSinceUpdate: 6, description: 'Small business decisions, explained through everyday examples.' },
    { id: 'field', title: 'Field Notes at Nine', category: 'Science', language: 'en', episodeCount: 54, daysSinceUpdate: 9, description: 'Curious questions from the natural world and the lab.' },
    { id: 'second', title: 'Second Act Stories', category: 'Culture', language: 'en', episodeCount: 42, daysSinceUpdate: 21, description: 'Personal stories about starting something new.' },
    { id: 'circuit', title: 'Small Circuit', category: 'Technology', language: 'en', episodeCount: 18, daysSinceUpdate: 2, description: 'A new series exploring the tools behind modern life.' },
    { id: 'orbit', title: 'The Quiet Orbit', category: 'Science', language: 'en', episodeCount: 96, daysSinceUpdate: 75, description: 'Long-form conversations about space and discovery.' },
    { id: 'ideas', title: 'Mesa de Ideas', category: 'Business', language: 'es', episodeCount: 68, daysSinceUpdate: 5, description: 'Founder perspectives and ideas for growing a business.' },
    { id: 'demain', title: 'Les Idées de Demain', category: 'Technology', language: 'fr', episodeCount: 36, daysSinceUpdate: 12, description: 'A weekly look at technology and everyday choices.' },
    { id: 'rutas', title: 'Rutas Sonoras', category: 'Culture', language: 'es', episodeCount: 14, daysSinceUpdate: 40, description: 'Audio journeys through places, culture, and community.' }
  ]);
  const defaults = Object.freeze({ category: 'all', language: 'en', activityDays: 30, minimumEpisodes: 24 });
  const languages = { en: 'English', es: 'Spanish', fr: 'French' };

  function filterPodcasts(data, filters) {
    return data.filter(record =>
      (filters.category === 'all' || record.category === filters.category) &&
      (filters.language === 'all' || record.language === filters.language) &&
      record.daysSinceUpdate <= Number(filters.activityDays) &&
      record.episodeCount >= Number(filters.minimumEpisodes)
    ).sort((a, b) => a.daysSinceUpdate - b.daysSinceUpdate || b.episodeCount - a.episodeCount);
  }

  // Makes the filter contract testable without requiring a browser or a package.
  if (typeof module === 'object' && module.exports) module.exports = { filterPodcasts, records, defaults };
  if (typeof document === 'undefined') return;
  const host = document.getElementById('podcast-lab');
  if (!host) return;

  host.innerHTML = `
    <div class="pd-shell">
      <div class="pd-topline"><span class="pd-kicker"><span class="pd-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> INTERACTIVE DEMO</span><span class="pd-data-label">Illustrative data · portfolio demo</span></div>
      <div class="pd-intro"><h2 id="podcast-lab-title">Build a better <em>shortlist.</em></h2><div><p>From a broad collection to a focused starting point. Change the criteria and explore what makes the cut.</p><a class="pd-project-link" href="#projects" data-podcast-project>Inside the Podcast Explorer project <span aria-hidden="true">↗</span></a></div></div>
      <div class="pd-workbench">
        <form class="pd-filters" aria-label="Podcast screening criteria">
          <div class="pd-filter-heading"><h3>Your criteria</h3><button class="pd-reset" type="reset">Reset</button></div>
          <div class="pd-field"><label for="pd-category">Category</label><select id="pd-category" name="category"><option value="all">All categories</option><option>Business</option><option>Culture</option><option>Science</option><option>Technology</option></select></div>
          <div class="pd-field"><label for="pd-language">Language</label><select id="pd-language" name="language"><option value="all">All languages</option><option value="en" selected>English</option><option value="es">Spanish</option><option value="fr">French</option></select></div>
          <div class="pd-field"><label for="pd-activity">Latest episode</label><select id="pd-activity" name="activityDays"><option value="7">Within 7 days</option><option value="30" selected>Within 30 days</option><option value="90">Within 90 days</option></select></div>
          <div class="pd-field"><label for="pd-episodes">Minimum episodes</label><select id="pd-episodes" name="minimumEpisodes"><option value="0">Any catalog size</option><option value="24" selected>24 episodes</option><option value="50">50 episodes</option><option value="100">100 episodes</option></select></div>
          <p class="pd-filter-tip">Each rule narrows the field. Try a different language or a shorter activity window.</p>
        </form>
        <div class="pd-output">
          <div class="pd-results-top"><div class="pd-count-wrap"><span class="pd-count" aria-hidden="true">04</span><div><h3>Your shortlist</h3><p class="pd-status" role="status" aria-live="polite" aria-atomic="true"></p></div></div><span class="pd-order">MOST RECENT FIRST</span></div>
          <div class="pd-coverage" aria-hidden="true"><span></span></div>
          <div class="pd-results"></div>
          <div class="pd-results-bottom"><p class="pd-showing"></p><button type="button" class="pd-show-all" hidden>Show all matches</button></div>
        </div>
      </div>
      <div class="pd-footnote"><span class="pd-footnote-mark" aria-hidden="true">↳</span><p>These fictional records demonstrate screening choices. The USC team project is in development. A shortlist is a starting point for reviewing content fit and data quality.</p></div>
    </div>`;

  const form = host.querySelector('.pd-filters');
  const output = host.querySelector('.pd-results');
  const showAll = host.querySelector('.pd-show-all');
  let expanded = false;

  function readFilters() {
    return {
      category: form.elements.category.value,
      language: form.elements.language.value,
      activityDays: Number(form.elements.activityDays.value),
      minimumEpisodes: Number(form.elements.minimumEpisodes.value)
    };
  }

  function escape(text) {
    return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function render() {
    const filters = readFilters();
    const matches = filterPodcasts(records, filters);
    const displayed = expanded ? matches : matches.slice(0, 4);
    const rules = [filters.category !== 'all' ? filters.category : null, filters.language !== 'all' ? languages[filters.language] : null, `updated within ${filters.activityDays} days`, filters.minimumEpisodes ? `${filters.minimumEpisodes}+ episodes` : null].filter(Boolean);
    host.querySelector('.pd-count').textContent = String(matches.length).padStart(2, '0');
    host.querySelector('.pd-status').textContent = `${matches.length} of ${records.length} sample feeds match your criteria.`;
    host.querySelector('.pd-coverage span').style.width = `${matches.length / records.length * 100}%`;
    output.innerHTML = matches.length ? displayed.map(record => `
      <article class="pd-card">
        <div class="pd-card-top"><span class="pd-category pd-category-${record.category.toLowerCase()}">${escape(record.category)}</span><span class="pd-language">${languages[record.language]}</span></div>
        <h4>${escape(record.title)}</h4><p class="pd-description">${escape(record.description)}</p>
        <div class="pd-card-facts"><span><b>${record.episodeCount}</b> episodes</span><span>Updated <b>${record.daysSinceUpdate}d</b> ago</span></div>
        <p class="pd-match-reason"><span aria-hidden="true">✓</span> ${escape(rules.join(' · '))}</p>
      </article>`).join('') : `<div class="pd-empty"><span class="pd-empty-icon" aria-hidden="true">∅</span><h4>No feeds match this combination.</h4><p>Broaden the category, lower the episode minimum, or allow a longer activity window.</p><button type="button" class="pd-empty-reset">Reset criteria <span aria-hidden="true">↗</span></button></div>`;
    host.querySelector('.pd-showing').textContent = matches.length ? `Showing ${displayed.length} of ${matches.length} matches · ${records.length} fictional sample feeds` : 'Your criteria are applied together.';
    showAll.hidden = matches.length <= 4;
    showAll.textContent = expanded ? 'Show fewer' : `Show all ${matches.length} matches`;
    showAll.setAttribute('aria-expanded', String(expanded));
  }

  function reset() {
    Object.entries(defaults).forEach(([name, value]) => { form.elements[name].value = String(value); });
    expanded = false;
    render();
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('change', () => { expanded = false; render(); });
  form.addEventListener('reset', event => { event.preventDefault(); reset(); });
  showAll.addEventListener('click', () => { expanded = !expanded; render(); });
  output.addEventListener('click', event => {
    if (event.target.closest('.pd-empty-reset')) {
      reset();
      form.elements.category.focus();
    }
  });
  host.querySelector('[data-podcast-project]').addEventListener('click', event => {
    if (typeof showProject === 'function') {
      event.preventDefault();
      if (typeof selectFilter === 'function') selectFilter('featured');
      if (typeof featureProject === 'function') featureProject('podcast');
      showProject('podcast');
    }
  });
  render();
})();
