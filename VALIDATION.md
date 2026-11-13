# V2 validation record

## Recoverable baseline and runtime

- Baseline: `e1dbaaf80800c3c28395f5d2486a7199ad4c1870`.
- Validated V2 implementation: `adb5afdceb48aef635d14664b8dc138d7c79a2a3`.
- Working branch: `feat/high-fidelity-architecture-v2`.
- Successful comparison run: https://github.com/aligholizadeh8413/jalinous-landing/actions/runs/43331560063
- Both baseline and candidate jobs completed successfully. The baseline source is unchanged except per-frame read-only diagnostic output.
- Six Node tests passed: camera envelope, approach/framing, reduced pointer influence, batching/instancing/shadow preservation, finite architecture/foliage, local asset presence and color spaces.
- Vite production build with `/jalinous-landing/` base passed.

## Actual browser verification

Chromium on Ubuntu 24.04 with SwiftShader rendered the actual Three.js scene. These are browser screenshots, not Blender renders. Two integration tests passed with no skipped or flaky tests.

- Desktop 1280×800: hero, left/center/right pointer positions, mid-scroll, final close-up, scroll reversal.
- Pointer yaw measured 3.02° to 30.98°; designed initial range 3–31°, close range 10–24°. V1 was 11–21° initially and 13.8–18.2° close.
- Portrait 390×844: hero, mid-scroll, final composition, native CDP touch start/move/end gesture, no horizontal overflow.
- Reduced-motion desktop: readable final introduction and pointer motion disabled.
- Deliberately lost WebGL context: original building photograph and readable fallback shown.
- Desktop runtime reported no page exceptions or failed HTTP asset requests.
- Recorded scene: 158,628 desktop triangles / 108,268 compact triangles, 45 draw calls (main render, excluding one-time shadow work). All texture files together are under 600 KB.

## Iterative visual review

The first WebGL pass exposed excessive sky illumination and tree crowns covering the hero typography. The second pass reduced ambient illumination, improved crown density/height, and removed unsupported lower stairwell glazing. Roof slopes, soffits, closed stair profiles, entrance canopy, physical-scale stone/paving and courtyard structures were checked in the second-pass images. The website's HTML, typography, content and scroll structure remain unchanged.

Earlier QA failures were diagnosed and corrected: unsupported Ubuntu runner for pinned Playwright, stale per-30-frame diagnostics, a desktop test timeout under software rendering, and a compositor gesture that did not produce touch scrolling. The successful run uses per-frame diagnostics, a suitable timeout and explicit native touch events.

## Deployment

The existing Pages workflow is retained. A new `verify-live` job tests the actual deployment URL after the Pages deploy job succeeds and uploads `live-webgl-validation`. Final deployment status will be recorded after that job completes. Public URL remains https://ali-gholizadeh.ir/jalinous-landing/.

## Limits

This is an approximate limited-view reconstruction, not a measured survey. The roof interior and unseen rear remain simplified; rooftop machinery is omitted. Pine crowns are procedural needle-card models, not photogrammetry. Branding is preserved as photographed surface detail rather than a sculpted emblem. Courtyard proportions and tree heights are approximate and adjusted for legibility. Background masses are illustrative. Physical-device Safari/iOS/Android testing and a 30/60 FPS hardware benchmark have not been performed. SwiftShader validation establishes actual rendering and interaction behavior, not representative GPU performance; the DOM renderMs metric is CPU submission time, not FPS.
