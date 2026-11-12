# Jalinous — A New Perspective

A static, two-state architectural landing page. The initial view presents Jalinous Pharmaceutical Co.'s facade and courtyard; scrolling continuously approaches the building, frames it to the left, and reveals a compact introduction. Pointer motion adds a controlled horizontal perspective change from 3 to 31 degrees, narrowing to 10–24 degrees at the final close-up.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
```

## Stack and structure

- Vite, vanilla JavaScript, Three.js, GSAP ScrollTrigger, self-hosted Manrope.
- `src/scene/building.js`: procedural facade, paired exterior stair flights, landings, parapets, windows, entrance, cornices, photographed signage.
- `src/scene/surroundings.js`: chamfered garden beds, covered courtyard structure and abstract industrial surroundings.
- `src/scene/roof.js`: closed shallow sloped roofs, fascia, panelled soffits and entrance canopy.
- `src/scene/vegetation.js`: tapered mature pine branches and instanced alpha-tested needle sprays.
- `scripts/generate-textures.py`: reproducible project-owned stone, bark, shingles, pavers and foliage textures.
- `src/scene/materials.js`: shared materials and local textures.
- `src/scene/camera-rig.js`: deterministic scroll pose plus a bounded, damped pointer offset.
- `src/motion.js`: reversible scroll-linked framing and copy reveal.
- `src/content.js`: editable introductory copy. Heading markup is in `index.html`.

No backend, database, external font request, orbit controller, manual zoom, drag panning, or functional navigation is included.

## Reference fidelity

The supplied `002.jpg`, `004.jpg`, and the eight-second building video informed the geometry. Four external switchback stair pairs, warm stone panels, red-brown piers, narrow entrance-side windows, canopy, and courtyard approach receive priority. The main facade is real layered geometry. The emblem and roof sign are rectified photographic extracts, preserving the original branding rather than redrawing it. The Persian lettering on the photographed rooftop sign is original architectural imagery; every interface string is English.

This is an approximate, limited-view architectural reconstruction, not a measured survey or a complete digital twin. Visible roof slopes, eaves and soffits are modeled; the central roof surface and hidden support volume remain conservative simplifications. Uncertain rooftop machinery is omitted. Background buildings are abstract massing and are not represented as an accurate neighborhood. Pines use reference-informed procedural branching and needle cards; they are not scanned botanical assets. The emblem remains a photograph on a shallow surface rather than a sculpted relief.

## Rendering and accessibility

- Approximately 160,000 desktop / 110,000 compact triangles and 45 material/instance batches before shadow passes. Texture assets total under 600 KB.
- Static shadow maps, shared materials, capped device pixel ratio, paused rendering in background tabs, and no repeated drawing while the camera is idle.
- Responsive portrait framing and a lower introduction overlay on mobile.
- Reduced-motion preference disables pointer motion and continuous camera travel; the two camera compositions switch at the introduction threshold.
- WebGL or required-texture failures display the original building photograph and readable copy. JavaScript-disabled browsers also show the photograph.
- Navigation items are intentionally plain text and have no fake links or tab stops.

## GitHub Pages

The public repository is `aligholizadeh8413/jalinous-landing`. `.github/workflows/deploy.yml` installs locked dependencies, runs tests, builds, uploads the Pages artifact, and deploys it. The Pages source must be **GitHub Actions**. Pushes to `main` trigger deployment.

Vite uses `/jalinous-landing/` in GitHub Actions and a relative base for local/static previews. All textures and fonts are local. GitHub may inherit a custom domain from the account's root Pages site; use the deployed URL reported by the Actions environment rather than assuming the final hostname.

## Verification

The camera constraint suite samples scroll progress, pointer extremes, and portrait/tablet/desktop ratios. It verifies bounded front-facing angles, safe camera height/depth, approach direction, framing direction, and reduced pointer influence. The production build was checked with the GitHub Pages base path.

Real Chromium WebGL screenshots are produced in GitHub Actions using SwiftShader, including the baseline and V2 in matching viewports. The browser suite checks pointer extremes, scroll approach/reversal, portrait touch scrolling and reduced motion. Run `npx playwright install chromium` and `npx playwright test` in an environment with browser/WebGL support. See `VALIDATION.md` for the latest actual run results and verification limits.

The baseline is pinned to `e1dbaaf80800c3c28395f5d2486a7199ad4c1870`. The visual QA workflow retains before/after artifacts. A `live_url` workflow input can verify the deployed site under its real subpath.

## Asset rights

Photographs, video-derived information, and Jalinous branding were supplied by the project owner for this project. The two third-party dashboard references informed art direction only and are not redistributed. Manrope is distributed under its bundled SIL Open Font License. Dependency licenses remain with their respective owners.

See [asset provenance](docs/asset-sources.md) and [reference inventory](docs/reference-inventory.md) for detailed modeling boundaries and texture sources.
