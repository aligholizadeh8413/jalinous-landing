# Jalinous — A New Perspective

A static, two-state architectural landing page. The initial view presents Jalinous Pharmaceutical Co.'s facade and courtyard; scrolling continuously approaches the building, frames it to the left, and reveals a compact introduction. Pointer motion adds a small horizontal perspective change.

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
- `src/scene/surroundings.js`: courtyard planting and abstract industrial-scale surroundings.
- `src/scene/materials.js`: shared materials and local textures.
- `src/scene/camera-rig.js`: deterministic scroll pose plus a bounded, damped pointer offset.
- `src/motion.js`: reversible scroll-linked framing and copy reveal.
- `src/content.js`: editable introductory copy. Heading markup is in `index.html`.

No backend, database, external font request, orbit controller, manual zoom, drag panning, or functional navigation is included.

## Reference fidelity

The supplied `002.jpg`, `004.jpg`, and the eight-second building video informed the geometry. Four external switchback stair pairs, warm stone panels, red-brown piers, narrow entrance-side windows, canopy, and courtyard approach receive priority. The main facade is real layered geometry. The emblem and roof sign are rectified photographic extracts, preserving the original branding rather than redrawing it. The Persian lettering on the photographed rooftop sign is original architectural imagery; every interface string is English.

This is an approximate, limited-view architectural reconstruction, not a measured survey or a complete digital twin. The roof and hidden support volume are deliberately simplified. Background buildings are abstract massing and are not represented as an accurate neighborhood. Trees are stylized. The emblem remains a photograph on a shallow surface rather than a sculpted relief.

## Rendering and accessibility

- Approximately 34,000 triangles and 31 static material batches before the renderer's lighting work.
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

Geometry and all four desktop/mobile endpoint compositions were inspected using offline Blender renders of the exact generated meshes. These renders validate geometry and framing, not pixel-for-pixel WebGL lighting. The available interactive preview browser initially had WebGL disabled; the photograph fallback was verified there. See `VALIDATION.md` for the final deployment verification status.

## Asset rights

Photographs, video-derived information, and Jalinous branding were supplied by the project owner for this project. The two third-party dashboard references informed art direction only and are not redistributed. Manrope is distributed under its bundled SIL Open Font License. Dependency licenses remain with their respective owners.
