/**
 * The world registry — every room's position along the continuous Z axis.
 *
 * To add a future room (bedroom, bathroom, dining), simply insert a new
 * entry with a `worldZ` between existing ranges, or extend the total
 * `WORLD_DEPTH` and append. Ranges may overlap slightly for crossfades.
 *
 * All values are in arbitrary world units. The scroll length is scaled to
 * `WORLD_DEPTH` in <ScrollEngine />.
 */

export const WORLD_DEPTH = 12000;

// [worldZ, depth] pairs. Order = z-index (later scenes render on top).
export const WORLD = {
  exterior:   { id: "exterior",   worldZ: 0,     depth: 1600 },
  manifesto1: { id: "manifesto1", worldZ: 1500,  depth: 1000 },
  entrance:   { id: "entrance",   worldZ: 2400,  depth: 1500 },
  manifesto2: { id: "manifesto2", worldZ: 3800,  depth: 1000 },
  kitchen:    { id: "kitchen",    worldZ: 4700,  depth: 2200 },
  marquee:    { id: "marquee",    worldZ: 6800,  depth: 900  },
  living:     { id: "living",     worldZ: 7600,  depth: 1700 },
  manifesto3: { id: "manifesto3", worldZ: 9200,  depth: 1000 },
  exit:       { id: "exit",       worldZ: 10100, depth: 1900 },
};

// Chapter labels tied to camera Z (5 chapters). Used by GlassNav.
export const CHAPTER_MARKERS = [
  { id: "01", label: "The Land",      z: 0     },
  { id: "02", label: "The Threshold", z: 2400  },
  { id: "03", label: "The Hearth",    z: 4700  },
  { id: "04", label: "The Living",    z: 7600  },
  { id: "05", label: "The Horizon",   z: 10100 },
];

// Convenience helper for GlassNav: pick current chapter for a camera.z
export function currentChapter(cameraZ) {
  let current = CHAPTER_MARKERS[0];
  for (const c of CHAPTER_MARKERS) {
    if (cameraZ >= c.z) current = c;
  }
  return current;
}
