# Visual asset provenance

- `emblem.webp`, `roof-sign.webp`, `building-reference.webp`: conservative rectified/cropped extracts of the owner's supplied building photographs. Original architectural lettering is preserved. No synthesized logo or typography.
- `limestone-v2*`, `cladding-v2*`, `pavers-v2*`, `pine-bark*`, `roof-shingles*`, `pine-sprig.webp`: original deterministic procedural textures generated for this project by `scripts/generate-textures.py`, informed by the color, scale and patterns in the supplied references. They do not incorporate third-party texture-library assets. The generator is included for reproducibility.
- Pine meshes, roof shells, stair profiles, facade and courtyard: original parametric geometry in this repository. No externally downloaded tree model.
- V1 stone/paving textures remain in source history; V2 loads the named V2 texture sets.
- Manrope: SIL Open Font License, included at `public/font-license.txt`.
- Three.js Sky shader: provided by the installed Three.js package under its MIT license.
- Supplied Dribbble inspiration images are not website assets and are not distributed.

Color maps use sRGB. Normal and roughness maps use `NoColorSpace`. Physical repeats: cream stone 1.8m, red cladding 1.25m, paving 2.56m (0.32 x 0.16m blocks), bark 1m, roofing 1.6m. Normal strength is deliberately restrained; no heavy displacement. Dimensions are scene approximations, not surveyed measurements.

Foliage uses one 512px alpha atlas, alpha testing rather than blended transparency, and instanced transforms. Desktop has more twigs/needle sprays than compact mode. All assets are local and work under the GitHub Pages subpath.
