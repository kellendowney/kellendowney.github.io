# Portfolio analytics setup

Configured for the owner's Umami Cloud website `a21aea41-2b76-45d0-8927-96cad30f70f5` at `kellendowney.github.io`.

The website ID is public configuration, not a password or API key. The dashboard belongs to the owner's Umami account; this integration does not create a public analytics share link. To change accounts later, replace the `data-website-id` attribute on the `analytics.js` script in `index.html` with the new website's actual ID.

After publishing, verify pageviews and custom events in Umami. This repository never needs account passwords or API keys.

Events: `resume_click` counts clicks on the public PDF link (not confirmed completed downloads); `project_select` counts intentional shelf selection; `project_open` counts opening or navigating project details; `demo_used` counts the first filter/control interaction per page load.

The code adds no visible elements. Tracking runs only on the production hostname, respects supported Do Not Track and Global Privacy Control signals, excludes URL queries/hashes, reduces referrers to origins, and sends only allowlisted project IDs. It does not identify visitors, record form text, or enable session recordings. Blocked or failed analytics leaves the portfolio functional. Visits before activation cannot be recovered by this integration.

Validation performed: JavaScript syntax checks, source comparisons confirming the visible page and existing project behavior are unchanged, and isolated checks for missing-ID/domain/privacy gates, event queuing, single demo counts, URL sanitization, and blocked-tracker handling. Live collection is verified separately after deployment.
