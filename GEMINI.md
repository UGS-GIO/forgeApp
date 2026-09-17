# forgeApp — PR review guide
Static ArcGIS JS 4.15 + calcite map app (index.html + map.js) for the Utah FORGE geothermal site,
with a vendored Esri share-widget. DORMANT — treat as archival; do the minimum and don't modernize.
Review ONLY the changed lines (general bug/security/quality assumed). Cite file:line; group nits;
prefer minimal, in-style fixes over refactors.

## Match the existing code
- jQuery / ArcGIS-4 era. Match surrounding patterns; no new frameworks or build steps. Treat
  share-widget-master/ as vendored third-party code — review only intentional local edits to it.

## Security (the priority for a public legacy app)
- NO secrets, API keys, or ArcGIS tokens committed in client-side JS/HTML — flag any hardcoded
  credential or `token=` (none present today; catch anything a PR introduces).
- XSS / DOM injection: popups/info panels are built from feature attributes via `innerHTML` — any
  new field rendered from a Feature/API response or a URL query param must be escaped.

## Correctness
- Fail loud on fetch/query errors — don't silently blank the map; handle empty/failed responses.
