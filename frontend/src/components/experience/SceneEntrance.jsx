import { useCallback, useRef } from "react";
import { IMAGES } from "../../data/assets";
import { SCENE } from "../../constants/testIds";
import { useAudio } from "../../hooks/useAudio";
import { Scene, Layer, useSceneAnimation, WORLD } from "../../engine";

/**
 * Scene 2 — Entrance. Camera walks toward the door, blur transition to
 * warm interior. Composed as a real Z-stack: door plate at negative Z
 * (far), interior glow at deeper negative Z (further behind the door),
 * bloom at near Z (in front of camera).
 */
export default function SceneEntrance() {
  const rootRef = useRef(null);
  const { setScene } = useAudio();

  const build = useCallback((tl, root) => {
    tl.to(root.querySelector(".ent-door"),     { scale: 2.6, z: 380 }, 0);
    tl.to(root.querySelector(".ent-door"),     { filter: "blur(28px)" }, 0.4);
    tl.to(root.querySelector(".ent-copy"),     { opacity: 0, yPercent: -18 }, 0.05);
    tl.to(root.querySelector(".ent-interior"), { opacity: 1, scale: 1.06 }, 0.42);
    tl.to(root.querySelector(".ent-warmth"),   { opacity: 1 }, 0.5);
    tl.to(root.querySelector(".ent-bloom"),    { opacity: 1, scale: 1.25 }, 0.55);
  }, []);

  useSceneAnimation({
    worldZ: WORLD.entrance.worldZ,
    depth: WORLD.entrance.depth,
    rootRef,
    buildTimeline: build,
    onEnter: () => setScene("entrance"),
  });

  return (
    <Scene ref={rootRef} data-testid={SCENE.entrance} background="#0b0b0b">
      {/* Interior glow — sits BEHIND the door plate in Z */}
      <Layer role="background" depth={-900} className="ent-interior" style={{ opacity: 0 }}>
        <img src={IMAGES.entrance.interiorGlow} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        <div
          className="ent-warmth absolute inset-0 opacity-0"
          style={{ background: "radial-gradient(circle at 50% 45%, rgba(198,163,90,0.4), transparent 60%)" }}
        />
      </Layer>

      {/* Door plate — the wall between us and the interior */}
      <Layer role="architecture" depth={-200} className="ent-door">
        <img
          src={IMAGES.entrance.exteriorDoor}
          alt="Approaching the front door"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transformOrigin: "50% 55%" }}
        />
      </Layer>

      {/* Door light bloom — sits closer to the camera */}
      <Layer role="particles" depth={80} className="ent-bloom" style={{ opacity: 0 }}>
        <div
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,236,190,0.55), rgba(255,236,190,0) 65%)" }}
        />
      </Layer>

      {/* UI copy plane */}
      <Layer role="ui" depth={200} className="ent-copy">
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
          <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
            <span>Chapter 02</span>
            <span className="text-[#C6A35A]">The Threshold</span>
          </div>

          <div className="max-w-2xl">
            <div className="mb-5 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
              02 — Enter
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Step across.<br />
              <span className="italic text-[#C6A35A]">Everything softens.</span>
            </h2>
          </div>

          <div className="font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/60">
            Keep scrolling ↓
          </div>
        </div>
      </Layer>
    </Scene>
  );
}
