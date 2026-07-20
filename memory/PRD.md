# Home Modular Ireland — Cinematic Walkthrough (POC)

## Stack
React 19 + CRA · GSAP 3.15 (ScrollTrigger) · Lenis 1.3 · Framer Motion 11 · TailwindCSS 3.4

## Architecture — Continuous-World Engine (`/src/engine/`)
- `CameraController.js` — single virtual camera (x, y, z, rotX, rotY, progress). Pub/sub, no React re-renders.
- `CameraContext.jsx` — provides the camera to the tree.
- `ScrollEngine.jsx` — one and only scroll listener. Lenis + direct progress calc → camera.setProgress.
- `SceneManager.jsx` — fixed camera-root that hosts all scenes with shared perspective + the scroll spacer that defines walk length.
- `Scene.jsx` — perspective-hosted room primitive (absolute inset-0, opacity driven).
- `Layer.jsx` — depth stratum with auto scale-compensation for CSS perspective.
- `TimelineFactory.js` — creates paused, unit-normalised GSAP timelines.
- `useSceneAnimation.js` — hook that binds a scene's timeline to camera Z with edge-fade crossfades.
- `world.js` — world Z registry & chapter markers.

## World Coordinates (extensible — add rooms here)
| Scene | worldZ | depth |
|-------|--------|-------|
| Exterior | 0 | 1600 |
| Manifesto 01 The Land | 1500 | 1000 |
| Entrance | 2400 | 1500 |
| Manifesto 02 The Threshold | 3800 | 1000 |
| Kitchen (primary) | 4700 | 2200 |
| Editorial Marquee | 6800 | 900 |
| Living Room | 7600 | 1700 |
| Manifesto 03 The Craft | 9200 | 1000 |
| Exit CTA / Book | 10100 | 1900 |

Total world depth: 12000. Adjacent scenes overlap 100 units for crossfade.

## Adding a Room
1. Add entry to `WORLD` in `/src/engine/world.js`.
2. Create `SceneBedroom.jsx` inside `/src/components/experience/` using `Scene`, `Layer`, `useSceneAnimation`.
3. Drop `<SceneBedroom />` into the `SceneManager` tree in `Experience.jsx`.

## Locked Design
- Palette: #123524 primary · #C6A35A accent · #FAF8F5 bg · #151515 dark · #777777 muted
- Fonts: Cormorant Garamond (display) · Inter (body)
- Custom cursor · film grain · glassmorphism nav · placeholder hotspot copy · ambient audio muted by default

## What's Done (2025-12)
- Continuous-world engine replaces per-scene ScrollTriggers with a single camera.
- 5 hero scenes + 3 manifesto chapters + marquee, all crossfading through world Z.
- Interactive material hotspots (Kitchen: oak / brass / limestone · Living: timber / windows).
- Custom cursor, glass nav with chapter progress, ambient audio toggle, booking dialog (MOCKED).

## Known Not Implemented
- Bedroom, Bathroom, Dining scenes (engine supports easy addition).
- Live booking backend (dialog currently shows toast only).
- Real client photography (swap `/src/data/assets.js`).

## Test Credentials
None — no auth in this POC.
