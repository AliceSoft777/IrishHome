import { useCallback, useRef } from "react";
import { IMAGES } from "../../data/assets";
import { SCENE } from "../../constants/testIds";
import { useAudio } from "../../hooks/useAudio";
import { Scene, Layer, useSceneAnimation, WORLD } from "../../engine";

/**
 * Scene 1 — Hero Exterior. Continuous-world scene.
 *
 * Composition (near → far in the perspective stack):
 *   ui        (copy overlay)
 *   foreground (dark gradient falloff at bottom)
 *   architecture (the house, mask-blended into the land)
 *   mist       (soft haze)
 *   hills      (mid-ground landscape)
 *   background (distant sky)
 *
 * Camera walk-through: as local progress advances the camera translates
 * forward — hills/sky drift up slightly, the house grows, the mist thins,
 * a vignette closes in. All motion is driven by camera progress, no pin.
 */
export default function SceneExterior() {
  const rootRef = useRef(null);
  const { setScene } = useAudio();

  const build = useCallback((tl, root) => {
    // Deep parallax gradient — sky barely moves, foreground rushes past.
    tl.to(root.querySelector(".ext-sky"),      { yPercent: -4,  scale: 1.05 }, 0);
    tl.to(root.querySelector(".ext-hills"),    { yPercent: -14, scale: 1.16 }, 0);
    tl.to(root.querySelector(".ext-mist"),     { yPercent: -10, opacity: 0.22 }, 0);
    tl.to(root.querySelector(".ext-house"),    { scale: 1.9,   yPercent: 6, z: 340 }, 0);
    tl.to(root.querySelector(".ext-foreground"), { yPercent: -58, scale: 1.42 }, 0);
    tl.to(root.querySelector(".ext-vignette"), { opacity: 1 }, 0.4);
    tl.to(root.querySelector(".ext-copy"),     { opacity: 0, yPercent: -14 }, 0.55);
  }, []);

  useSceneAnimation({
    worldZ: WORLD.exterior.worldZ,
    depth: WORLD.exterior.depth,
    rootRef,
    buildTimeline: build,
    onEnter: () => setScene("exterior"),
  });

  return (
    <Scene ref={rootRef} data-testid={SCENE.exterior} background="#0f1a13">
      {/* Distant sky */}
      <Layer role="background" depth={-1200} className="ext-sky">
        <img
          src={IMAGES.exterior.sky}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ transform: "scale(1.7)" }}
        />
      </Layer>

      {/* Mid-ground hills */}
      <Layer role="architecture" depth={-700} className="ext-hills">
        <img
          src={IMAGES.exterior.hills}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ transform: "scale(1.25)" }}
        />
      </Layer>

      {/* Atmospheric haze */}
      <Layer role="particles" depth={-300} className="ext-mist">
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/12 to-transparent" />
      </Layer>

      {/* The house — foreground focal point */}
      <Layer role="furniture" depth={-120} className="ext-house">
        <img
          src={IMAGES.exterior.house}
          alt="Modular home in the Irish countryside"
          className="absolute left-1/2 top-1/2 h-[86%] max-h-[820px] w-auto -translate-x-1/2 -translate-y-[50%] object-cover"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 62% 78% at 50% 55%, black 40%, transparent 95%)",
            maskImage:
              "radial-gradient(ellipse 62% 78% at 50% 55%, black 40%, transparent 95%)",
            filter: "drop-shadow(0 60px 100px rgba(0,0,0,0.65))",
          }}
        />
      </Layer>

      {/* Ground falloff */}
      <Layer role="foreground" depth={40} className="ext-foreground">
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#0f1a13] via-[#0f1a13]/70 to-transparent" />
      </Layer>

      {/* Vignette */}
      <div
        className="ext-vignette pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }}
      />

      {/* UI plane */}
      <Layer role="ui" depth={200} className="ext-copy">
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
          <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
            <span>Chapter 01</span>
            <span className="text-[#C6A35A]">The Land</span>
          </div>

          <div className="max-w-3xl">
            <div className="mb-5 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
              County Wicklow · 07:14
            </div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-[7.2rem] leading-[0.95] tracking-tight">
              A morning<br />
              that <span className="italic text-[#C6A35A]">holds</span> its breath.
            </h2>
            <p className="mt-6 max-w-md font-body text-sm md:text-base text-[#FAF8F5]/75 leading-relaxed">
              Mist over the fields. A modular house, patient in the valley.
              Keep scrolling — the door is already open.
            </p>
          </div>

          <div className="flex items-end justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/60">
            <span className="hidden md:inline">Scroll ↓</span>
            <span className="text-[#FAF8F5]/50">Continuous walk enabled</span>
          </div>
        </div>
      </Layer>
    </Scene>
  );
}
