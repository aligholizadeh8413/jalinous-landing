# Validation record

- Public URL: https://ali-gholizadeh.ir/jalinous-landing/
- Repository: https://github.com/aligholizadeh8413/jalinous-landing
- Implementation commit: 8e6a938d53e631b889c79527034ce74bf7c48f31
- GitHub Actions run: https://github.com/aligholizadeh8413/jalinous-landing/actions/runs/43324582743
- GitHub Actions build and Pages deployment: both completed successfully.
- Live HTTP verification: HTML, all three JavaScript chunks, CSS, fallback photograph, and all five material textures returned HTTP 200.
- Browser verification: HTTPS redirect, page title, readable English copy, loaded fallback photograph, and zero interactive navigation links confirmed.
- Camera constraint tests: 3 passed across pointer extremes and five viewport aspect ratios.
- Production Vite build: passed with /jalinous-landing/ base.
- Static scene export: 31 material batches; 34,152 triangles.
- Geometry review: desktop start/end and portrait start/end rendered from the same geometry using Blender. Mobile initial framing was widened after review.

## Verification limits

The available preview browser and live-site browser both report WebGL disabled (GL_VENDOR and GL_RENDERER Disabled; BindToCurrentSequence failed). Their graceful photograph fallback was verified. Interactive WebGL rendering, scroll reversal, pointer motion, reduced-motion behavior, mobile touch scrolling, and physical-device frame rate have not been verified end-to-end in that browser. Offline geometry renders validate geometry/framing but do not establish pixel-identical Three.js lighting or runtime interaction.

The scene is an approximate reference-informed reconstruction. Hidden architecture, the roof, and surrounding buildings are simplified. Branding uses photographed surface detail. No frame-rate benchmark or full digital-twin accuracy is claimed.
