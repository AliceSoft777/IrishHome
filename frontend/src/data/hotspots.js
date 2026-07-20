import { IMAGES } from "./assets";

/**
 * Hotspot data model — same schema works for every future room.
 *  position: { x: "0-100%", y: "0-100%" } relative to parent image container
 */
export const KITCHEN_HOTSPOTS = [
  {
    id: "oak-flooring",
    position: { x: 32, y: 78 },
    material: "Natural Oak Flooring",
    title: "European Oak · Brushed Matte",
    description:
      "Warm European oak with a hand-brushed matte finish. A quiet foundation that carries the light and softens every footstep.",
    feature: "Premium engineered hardwood",
    spec: "180mm plank · UV-oil finish · FSC certified",
    image: IMAGES.kitchen.detailOak,
  },
  {
    id: "brass-fixtures",
    position: { x: 65, y: 38 },
    material: "Brushed Brass Fixtures",
    title: "Solid Brass · Living Finish",
    description:
      "Solid, unlacquered brass that develops a soft patina with time. Every tap a small heirloom.",
    feature: "Handmade in Europe",
    spec: "Warranty 25 years · Living finish",
    image: IMAGES.kitchen.detailBrass,
  },
  {
    id: "stone-worktop",
    position: { x: 50, y: 58 },
    material: "Kilkenny Limestone",
    title: "Irish Limestone · Honed",
    description:
      "Quarried in Kilkenny. Honed to a deep, near-black grey with visible fossil detail — a nod to the ground beneath the home.",
    feature: "Quarried in Ireland",
    spec: "30mm slab · Honed finish · Sealed",
    image: IMAGES.kitchen.detailStone,
  },
];

export const LIVING_HOTSPOTS = [
  {
    id: "timber-cladding",
    position: { x: 28, y: 40 },
    material: "Premium Timber Cladding",
    title: "Vertical Timber · Charred",
    description:
      "Charred and oiled larch — quiet, tactile, resilient. A wall you want to touch.",
    feature: "Shou sugi ban technique",
    spec: "20mm profile · Natural oil sealed",
    image: IMAGES.manifesto.craft,
  },
  {
    id: "large-windows",
    position: { x: 72, y: 46 },
    material: "Energy Efficient Windows",
    title: "Triple-Glazed · Slim Frame",
    description:
      "Passive-house grade triple glazing with a whisper-thin aluminium frame. The landscape becomes the wall.",
    feature: "U-value 0.7 W/m²K",
    spec: "Argon-filled · Warm-edge spacer",
    image: IMAGES.living.window,
  },
];
