# Home Modular Ireland — Cinematic Storytelling Experience (POC)

## Problem Statement (verbatim excerpt)
Award-winning cinematic Proof of Concept. Not a marketing site. A scroll-driven immersive walkthrough of a luxury modular home using GSAP + Lenis + Framer Motion + CSS pseudo-3D. Awwwards Site-of-the-Day quality.

## Stack
- React 19 + CRA (Craco)
- GSAP 3.15 + ScrollTrigger
- Lenis 1.3 (smooth scroll)
- Framer Motion 11
- TailwindCSS 3.4 + shadcn/ui (only sonner used)
- Locked palette: #123524 primary · #C6A35A accent · #FAF8F5 bg · #151515 dark · #777777 muted
- Locked fonts: Cormorant Garamond (display) + Inter (body)

## Architecture
- `/src/components/experience/*` — the entire cinematic engine
- `/src/data/assets.js` — CENTRAL asset registry (swap client photos here only)
- `/src/data/hotspots.js` — structured hotspot data (schema reusable across rooms)
- `/src/hooks/useLenis.js` — smooth scroll wired to GSAP ticker
- `/src/hooks/useAudio.jsx` — modular audio manager (scene → track map)

## Scene Registry (extensible — add future rooms here)
1. IntroSequence — signature masked line reveal
2. SceneExterior — layered parallax (sky/hills/mist/house/foreground)
3. ManifestoChapter "01 — The Land"
4. SceneEntrance — camera dolly + blur + warm bloom transition
5. ManifestoChapter "02 — The Threshold" (reversed)
6. SceneKitchen — horizontal camera pan + 3 material hotspots
7. EditorialMarquee — slow "Crafted in Ireland · Modular · Timeless · Quietly Assembled"
8. SceneLivingRoom — warm color grade + 2 material hotspots
9. ManifestoChapter "03 — The Craft"
10. SceneExitCTA — drone pullback + Book/Discover CTA + specs

## What's Been Implemented (2025-12)
- Full 5-scene cinematic walkthrough
- Signature intro on-load moment (line-by-line mask reveal)
- Floating glass navigation with progress bar + chapter label
- Custom cursor with expand-on-hover states (data-cursor attr)
- Global film grain overlay
- Extensible SceneManager pattern (each scene is an isolated component with own ScrollTrigger)
- Data-driven MaterialHotspot component (reusable in any room)
- Ambient audio system (muted by default, cross-fades per scene)
- Booking dialog (frontend-only, toast confirmation) — MOCKED backend
- Numbered manifesto chapters between scenes
- Editorial marquee
- Full responsive down to md breakpoint
- All interactive elements carry `data-testid`
- prefers-reduced-motion respected

## Not Implemented (Deferred)
- Backend integration for booking form (currently shows toast)
- Bedroom, Bathroom, Dining Room scenes (architecture supports easy addition)
- CMS / real content management
- Real audio files licensed by client

## Prioritized Backlog
- P1: Real client photography swap (edit `/src/data/assets.js` only)
- P2: Add Bedroom + Bathroom scenes (drop into `Experience.jsx` scene list)
- P2: Live booking backend + Resend email confirmation
- P3: Reduced-motion static hero fallback
- P3: i18n (Gaeilge / English toggle)

## Test Credentials
None — no auth in this POC.
