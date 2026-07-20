import { useCallback, useRef } from "react";
import { IMAGES } from "../../data/assets";
import { KITCHEN_HOTSPOTS } from "../../data/hotspots";
import { SCENE } from "../../constants/testIds";
import MaterialHotspot from "./MaterialHotspot";
import { useAudio } from "../../hooks/useAudio";
import { Scene, Layer, useSceneAnimation, WORLD } from "../../engine";

/**
 * Scene 3 — Luxury Kitchen. Camera pans laterally through the room.
 * The interior plate translates in X and Z; hotspot layer rides with it
 * so markers stay anchored to their materials.
 */
export default function SceneKitchen() {
  const rootRef = useRef(null);
  const { setScene } = useAudio();

  const build = useCallback((tl, root) => {
    // Walking pan — longer travel with deeper Z push for real dolly weight.
    tl.fromTo(
      root.querySelector(".kit-plate"),
      { xPercent: 0, scale: 1.18, z: -80 },
      { xPercent: -24, scale: 1.02, z: 60 },
      0
    );
    tl.fromTo(
      root.querySelector(".kit-hotspots"),
      { xPercent: 0, opacity: 0 },
      { xPercent: -24, opacity: 1 },
      0
    );
    tl.fromTo(
      root.querySelector(".kit-title"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0 },
      0.08
    );
    tl.to(root.querySelector(".kit-title"), { opacity: 0, y: -20 }, 0.55);
    tl.fromTo(
      root.querySelector(".kit-legend"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 },
      0.35
    );
  }, []);

  useSceneAnimation({
    worldZ: WORLD.kitchen.worldZ,
    depth: WORLD.kitchen.depth,
    rootRef,
    buildTimeline: build,
    onEnter: () => setScene("kitchen"),
  });

  return (
    <Scene ref={rootRef} data-testid={SCENE.kitchen} background="#0d0d0d">
      {/* Kitchen plate — the interior architecture */}
      <Layer role="architecture" depth={-200}>
        <div className="kit-plate absolute inset-0 h-full w-[140%]">
          <img
            src={IMAGES.kitchen.hero}
            alt="Luxury Scandinavian kitchen interior"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
        </div>
      </Layer>

      {/* Hotspot layer — rides with the plate */}
      <Layer role="furniture" depth={-100} className="pointer-events-none">
        <div className="kit-hotspots absolute inset-0 h-full w-[140%]">
          {KITCHEN_HOTSPOTS.map((h, i) => (
            <MaterialHotspot key={h.id} data={h} side={i % 2 === 0 ? "right" : "left"} />
          ))}
        </div>
      </Layer>

      {/* UI plane */}
      <Layer role="ui" depth={200} className="pointer-events-none">
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
          <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
            <span>Chapter 03</span>
            <span className="text-[#C6A35A]">The Hearth</span>
          </div>

          <div className="kit-title max-w-2xl">
            <div className="mb-4 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
              03 — The Kitchen
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Materials that <span className="italic text-[#C6A35A]">age</span> in your favour.
            </h2>
            <p className="mt-4 max-w-md font-body text-sm md:text-base text-[#FAF8F5]/75 leading-relaxed">
              Oak, brass, Irish limestone. Every surface chosen to soften — never wear — with time.
            </p>
          </div>

          <div className="kit-legend flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
            <span className="hm-pulse inline-block h-2 w-2 rounded-full bg-[#C6A35A]" />
            <span>Tap a marker to reveal the material</span>
          </div>
        </div>
      </Layer>
    </Scene>
  );
}
