import { useCallback, useRef } from "react";
import { IMAGES } from "../../data/assets";
import { LIVING_HOTSPOTS } from "../../data/hotspots";
import { SCENE } from "../../constants/testIds";
import MaterialHotspot from "./MaterialHotspot";
import { useAudio } from "../../hooks/useAudio";
import { Scene, Layer, useSceneAnimation, WORLD } from "../../engine";

/**
 * Scene 4 — Living Room. Camera pulls back and settles as warm colour
 * grade rises. Two hotspots layered above the interior plate.
 */
export default function SceneLivingRoom() {
  const rootRef = useRef(null);
  const { setScene } = useAudio();

  const build = useCallback((tl, root) => {
    // Deeper pull-back so the room "opens up" as we settle.
    tl.fromTo(
      root.querySelector(".liv-plate"),
      { scale: 1.42, z: -110 },
      { scale: 1.0, z: 30 },
      0
    );
    tl.fromTo(
      root.querySelector(".liv-window"),
      { opacity: 0, xPercent: 22 },
      { opacity: 1, xPercent: 0 },
      0
    );
    tl.fromTo(
      root.querySelector(".liv-warm"),
      { opacity: 0 },
      { opacity: 0.38 },
      0
    );
    tl.fromTo(
      root.querySelector(".liv-copy"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0 },
      0.1
    );
    tl.to(root.querySelector(".liv-copy"), { opacity: 0, y: -20 }, 0.65);
  }, []);

  useSceneAnimation({
    worldZ: WORLD.living.worldZ,
    depth: WORLD.living.depth,
    rootRef,
    buildTimeline: build,
    onEnter: () => setScene("living"),
  });

  return (
    <Scene ref={rootRef} data-testid={SCENE.livingRoom} background="#161010">
      {/* Interior plate */}
      <Layer role="architecture" depth={-200}>
        <img
          src={IMAGES.living.hero}
          alt="Warm modern living room"
          className="liv-plate absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="liv-warm absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 60%, rgba(198,163,90,0.35), transparent 55%)" }}
        />
        <div
          className="liv-window absolute right-0 top-0 h-full w-[38%]"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(198,163,90,0.12) 45%, rgba(250,248,245,0.18) 100%)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />
      </Layer>

      {/* Hotspots */}
      <Layer role="furniture" depth={-80} className="pointer-events-none">
        {LIVING_HOTSPOTS.map((h, i) => (
          <MaterialHotspot key={h.id} data={h} side={i % 2 === 0 ? "right" : "left"} />
        ))}
      </Layer>

      {/* UI copy plane */}
      <Layer role="ui" depth={200} className="pointer-events-none">
        <div className="liv-copy absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
          <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
            <span>Chapter 04</span>
            <span className="text-[#C6A35A]">The Living</span>
          </div>

          <div className="max-w-2xl">
            <div className="mb-4 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
              04 — The Living Room
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              The room<br />
              that <span className="italic text-[#C6A35A]">softens</span> at dusk.
            </h2>
            <p className="mt-6 max-w-md font-body text-sm md:text-base text-[#FAF8F5]/75 leading-relaxed">
              A wall of glass to the west, timber that warms with every hour,
              and light that finds its own way home.
            </p>
          </div>

          <div className="font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/60">
            Scroll · pull back ↓
          </div>
        </div>
      </Layer>
    </Scene>
  );
}
