// Central registry of data-testid values. Kebab-case, function-first.
export const NAV = {
  container: "glass-nav",
  logo: "nav-logo",
  audioToggle: "nav-audio-toggle",
  progress: "nav-progress",
  chapter: "nav-chapter-label",
  cta: "nav-cta-book",
};

export const INTRO = {
  container: "intro-sequence",
  headline: "intro-headline",
  skip: "intro-skip",
};

export const SCENE = {
  exterior: "scene-exterior",
  entrance: "scene-entrance",
  kitchen: "scene-kitchen",
  livingRoom: "scene-living-room",
  exitCta: "scene-exit-cta",
};

export const HOTSPOT = {
  trigger: (id) => `hotspot-trigger-${id}`,
  card: (id) => `hotspot-card-${id}`,
  close: (id) => `hotspot-close-${id}`,
};

export const CTA = {
  book: "cta-book-consultation",
  discover: "cta-discover-homes",
};

export const MANIFESTO = {
  chapter: (n) => `manifesto-chapter-${n}`,
};

export const MARQUEE = {
  container: "editorial-marquee",
};
