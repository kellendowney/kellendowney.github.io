# Portfolio analytics

Configured for the owner's Umami Cloud website `a21aea41-2b76-45d0-8927-96cad30f70f5` at `kellendowney.github.io`.

The website ID is public configuration, not a password or API key. The dashboard belongs to the owner's Umami account; this integration does not create a public analytics share link. No account credentials belong in this repository.

## Reading individual activity

In the verified Umami Cloud interface, select this website and open **Sessions → visitor avatar → Activity**. The activity view shows a date heading and individual times as `HH:MM:SS`. Hover **Last seen** to see its full date and time. **Settings → Preferences** was checked and already uses `America/Los_Angeles` (Pacific time); no timezone change was needed. Umami retains native timestamps for pageviews and custom events. Its session activity API exposes each event's `createdAt`; session details also include `firstAt` and `lastAt`. API ISO timestamps ending in `Z` are UTC.

A recorded portfolio pageview marks arrival/collection, not necessarily the exact instant the link was clicked in another app before the page loaded. Clicking an evidence link records an attempted opening, not a confirmed download or read. Sessions are anonymous activity groupings, not verified people.

Locations remain approximate country/region/city estimates from network information. This setup does not request GPS permission, identify visitors, collect precise coordinates, or resolve street addresses. VPNs, mobile networks, proxies, blocked analytics, and missing referrers can limit accuracy. Earlier uncollected details cannot be reconstructed.

## Share links with a known source

Use the appropriate tagged URL in each placement. These labels reveal where a link was placed, not the visitor's identity; a forwarded link retains its original tag. Ordinary referrers can also appear when the referring browser supplies them.

| Placement | Tagged URL |
| --- | --- |
| LinkedIn | https://kellendowney.github.io/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio |
| Instagram bio | https://kellendowney.github.io/?utm_source=instagram&utm_medium=social&utm_campaign=portfolio |
| Resume document | https://kellendowney.github.io/?utm_source=resume&utm_medium=document&utm_campaign=portfolio |
| Application form | https://kellendowney.github.io/?utm_source=application&utm_medium=application&utm_campaign=portfolio |
| Email signature/outreach | https://kellendowney.github.io/?utm_source=email&utm_medium=email&utm_campaign=portfolio |
| GitHub profile | https://kellendowney.github.io/?utm_source=github&utm_medium=referral&utm_campaign=portfolio |

Inspect Umami's **UTM** report or filter activity by UTM source, medium, or campaign. The untagged main URL still works normally, but its missing source cannot always be inferred. These links are provided for use; this code does not edit external profiles, documents, or messages.

Only these predefined labels pass the before-send filter:

- `utm_source`: `linkedin`, `instagram`, `resume`, `application`, `email`, `github`.
- `utm_medium`: `social`, `document`, `application`, `email`, `referral`.
- `utm_campaign`: `portfolio`.

Values are normalized to lowercase. Unknown values, other query parameters (including names, emails, recipient IDs, ad-click IDs, and free-form UTM content/terms), hashes, and referrer paths are discarded before collection. `data-exclude-search` is false so the before-send hook can inspect the query, but only accepted values survive that hook. No per-person link identifiers are used.

## Event meanings

| Event | Data | What it records |
| --- | --- | --- |
| `project_select` | Allowlisted `project` ID | Intentional project shelf selection, including arrow/Home/End navigation. |
| `project_open` | Allowlisted `project` ID | Opening or navigating a project's detail dialog. |
| `demo_used` | None | First click on an outbound live-app link per page load. It does **not** observe interactions inside the cross-origin Streamlit iframe. |
| `contact_click` | `channel`: `email` or `linkedin` | Click on the portfolio's known contact links. It does not confirm a sent message. |
| `evidence_open` | Predefined `item` label | Click on the known case, audit, change-request, team-video, or local project-document link. No arbitrary destination URL is sent. |
| `audit_compare` | `option`: `any` or `not-explicit` | Click on a recorded-case comparison option. It does not change or measure the live app's filters. |
| `resume_click` | None | Legacy handler retained for the former public resume link; the portfolio currently has no resume download link. |

The new event detail applies to activity after deployment. It cannot fill gaps in historical records.

## Privacy and reliability

The code adds no visible elements. Tracking runs only on the production hostname, respects supported Do Not Track and Global Privacy Control signals, and keeps the existing Umami account/dashboard private. It does not enable session recording or visitor identification. Analytics loading or collection failures leave the portfolio functional. A bounded queue holds up to 20 events while the tracker loads and is discarded if loading fails.

Validation covers syntax, accepted and rejected campaign values, stripping unrelated URL data, hostname/ID/privacy gates, event queuing, single demo counts, bounded event labels, and blocked-tracker handling. Live collection is verified separately after deployment.

Official references: [Sessions](https://docs.umami.is/docs/sessions), [session activity API](https://v2.umami.is/docs/api/sessions-api), [metric definitions](https://docs.umami.is/docs/metric-definitions), [UTM](https://docs.umami.is/docs/utm), [tracker configuration](https://docs.umami.is/docs/tracker-configuration).
