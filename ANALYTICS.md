# Portfolio analytics setup

Prepared on this branch; **not active** until a real Umami website ID is supplied and the integration is published to `main`.

1. Create a free Umami Cloud Hobby account and add `kellendowney.github.io` as a website.
2. Copy that website's tracking code from its settings. Only the public `data-website-id` value is needed; no password or API key belongs in this repository.
3. Set the empty `data-website-id` attribute on the `analytics.js` script in `index.html` to the account's actual website ID.
4. Publish the branch after reconciling any subsequent changes to `main`. Keep the dashboard private; no public share link is needed.
5. Confirm pageviews and the events below in the account's Umami dashboard. Verify actual ingestion before describing tracking as active.

Events: `resume_click` counts clicks on the public PDF link (not confirmed completed downloads); `project_select` counts intentional shelf selection; `project_open` counts opening or navigating project details; `demo_used` counts the first filter/control interaction per page load.

The code adds no visible elements. Tracking runs only on the production hostname, respects supported Do Not Track and Global Privacy Control signals, excludes URL queries/hashes, reduces referrers to origins, and sends only allowlisted project IDs. It does not identify visitors, record form text, or enable session recordings. Blocked or failed analytics leaves the portfolio functional. Visits before activation cannot be recovered by this integration.

Validation performed: JavaScript syntax checks, source comparisons confirming the visible page and existing project behavior are unchanged, and isolated checks for missing-ID/domain/privacy gates, event queuing, single demo counts, URL sanitization, and blocked-tracker handling. End-to-end ingestion awaits the real account ID.
