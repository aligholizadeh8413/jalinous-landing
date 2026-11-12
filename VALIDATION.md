# Validation record

- Camera constraint tests: 3 passed across pointer extremes and five viewport aspect ratios.
- Production Vite build: passed with `/jalinous-landing/` base.
- Static scene export: 31 material batches; 34,152 triangles.
- Geometry review: desktop start/end and portrait start/end rendered from the same geometry using Blender. Mobile initial framing was widened after review.
- Browser fallback: original photograph, English introduction, and navigation rendered correctly when WebGL was unavailable.
- Deployment: pending final GitHub Actions and public URL checks.

Browser WebGL interaction, frame rate on physical mobile devices, and touch scrolling remain separate from the offline geometry verification. No frame-rate benchmark is claimed.
