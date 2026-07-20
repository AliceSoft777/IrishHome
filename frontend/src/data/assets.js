/**
 * Central asset registry.
 * Every image, video, and audio source lives here. To swap the POC placeholders
 * for final client photography, edit this file only — components stay untouched.
 */

export const IMAGES = {
  // Scene 1 — Hero Exterior (layered parallax stack)
  exterior: {
    sky: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=2400&q=80",
    hills: "https://images.unsplash.com/photo-1780930090824-07c2b620f963?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxpcmlzaCUyMGdyZWVuJTIwbWlzdHklMjBoaWxscyUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODQ1MjMzMDh8MA&ixlib=rb-4.1.0&q=85",
    mist: "https://images.unsplash.com/photo-1502261513683-de13a37eb1b1?auto=format&fit=crop&w=2400&q=80",
    house: "https://images.pexels.com/photos/31666745/pexels-photo-31666745.jpeg",
    foreground: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=80",
  },

  // Scene 2 — Entrance
  entrance: {
    exteriorDoor: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    interiorGlow: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85",
  },

  // Scene 3 — Kitchen (primary showcase)
  kitchen: {
    hero: "https://images.unsplash.com/photo-1622372738946-62e02505feb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtaW5pbWFsJTIwc2NhbmRpbmF2aWFuJTIwa2l0Y2hlbnxlbnwwfHx8fDE3ODQ1MjMzMDl8MA&ixlib=rb-4.1.0&q=85",
    detailBrass: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
    detailOak: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    detailStone: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1200&q=80",
  },

  // Scene 4 — Living Room (warm modern living room with soft light)
  living: {
    hero: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=85",
    window: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=2000&q=80",
  },

  // Manifesto editorial imagery
  manifesto: {
    land: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80",
    threshold: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80",
    craft: "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=1800&q=80",
  },

  // Scene 5 — Exit / CTA drone pullback
  exit: {
    aerial: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85",
  },
};

// Audio placeholders. Sourced from Pixabay CDN (royalty free). Muted by default.
export const AUDIO = {
  ambientCountryside:
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1cbe12a15c.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3",
  ambientInterior:
    "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc3d720.mp3?filename=fireplace-with-crackling-sounds-2-min-116102.mp3",
};

export const CHAPTERS = [
  { id: "01", label: "The Land" },
  { id: "02", label: "The Threshold" },
  { id: "03", label: "The Hearth" },
  { id: "04", label: "The Living" },
  { id: "05", label: "The Horizon" },
];
