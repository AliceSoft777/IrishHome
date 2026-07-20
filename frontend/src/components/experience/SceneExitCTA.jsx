import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { IMAGES } from "../../data/assets";
import { SCENE, CTA } from "../../constants/testIds";
import { useAudio } from "../../hooks/useAudio";
import { Scene, Layer, useSceneAnimation, WORLD } from "../../engine";

/**
 * Scene 5 — Drone pullback + CTA.
 * The aerial plate zooms out from an oversized crop; the CTA block rises
 * and the headline mask resolves fully within [0, 0.85] of local progress.
 */
export default function SceneExitCTA({ onBook }) {
  const rootRef = useRef(null);
  const { setScene } = useAudio();

  const build = useCallback((tl, root) => {
    tl.fromTo(
      root.querySelector(".exit-aerial"),
      { scale: 1.7, filter: "blur(8px)", z: -140 },
      { scale: 1, filter: "blur(0px)", z: 0 },
      0
    );
    // Mask reveal — three explicit tweens using absolute y (paused-timeline
    // has an internal yPercent normalisation quirk that leaves the tween
    // as a no-op; absolute px is reliable and the lines are always sized
    // by the same display font so a fixed offset works cleanly).
    const lines = root.querySelectorAll(".exit-lines .hm-mask-inner");
    lines.forEach((el, i) => {
      tl.fromTo(el, { y: 140 }, { y: 0, duration: 0.32 }, 0.14 + i * 0.06);
    });
    tl.fromTo(
      root.querySelector(".exit-cta-block"),
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0 },
      0.4
    );
  }, []);

  useSceneAnimation({
    worldZ: WORLD.exit.worldZ,
    depth: WORLD.exit.depth,
    rootRef,
    buildTimeline: build,
    fadeOut: 0,
    onEnter: () => setScene("exit"),
  });

  return (
    <Scene ref={rootRef} data-testid={SCENE.exitCta} background="#0f1a13">
      <Layer role="background" depth={-400}>
        <img
          src={IMAGES.exit.aerial}
          alt=""
          aria-hidden="true"
          className="exit-aerial absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1710] via-[#0b1710]/40 to-transparent" />
      </Layer>

      <Layer role="ui" depth={200}>
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
          <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
            <span>Chapter 05</span>
            <span className="text-[#C6A35A]">The Horizon</span>
          </div>

          <div className="exit-cta-block max-w-3xl">
            <div className="mb-6 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
              05 — Continue the walk in person
            </div>
            <h2 className="exit-lines font-display text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight">
              <span className="hm-mask block"><span className="hm-mask-inner block">Your home</span></span>
              <span className="hm-mask block"><span className="hm-mask-inner block italic text-[#C6A35A]">is already</span></span>
              <span className="hm-mask block"><span className="hm-mask-inner block">taking shape.</span></span>
            </h2>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <motion.button
                data-testid={CTA.book}
                onClick={onBook}
                data-cursor="cta"
                data-cursor-label="Book"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#C6A35A] px-7 py-4 font-body text-[11px] uppercase tracking-[0.28em] text-[#123524]"
              >
                <span className="relative z-10">Book a consultation</span>
                <ArrowUpRight size={16} className="relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute inset-0 -translate-x-full bg-[#FAF8F5] transition-transform duration-500 ease-out group-hover:translate-x-0" />
              </motion.button>

              <button
                data-testid={CTA.discover}
                data-cursor="explore"
                data-cursor-label="Discover"
                className="inline-flex items-center gap-2 rounded-full border border-[#FAF8F5]/25 px-6 py-4 font-body text-[11px] uppercase tracking-[0.28em] text-[#FAF8F5] transition-colors hover:border-[#C6A35A] hover:text-[#C6A35A]"
              >
                Discover our modular homes
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 md:max-w-lg md:grid-cols-3">
              {[
                { k: "Lead time", v: "16 weeks" },
                { k: "U-value", v: "0.15 W/m²K" },
                { k: "Origin", v: "Ireland" },
              ].map((s) => (
                <div key={s.k} className="border-t border-[#FAF8F5]/15 pt-3">
                  <div className="font-body text-[10px] uppercase tracking-[0.3em] text-[#C6A35A]">{s.k}</div>
                  <div className="mt-1 font-display text-2xl text-[#FAF8F5]">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/60">
            <span>© Home Modular Ireland</span>
            <span className="hidden md:inline">A cinematic walkthrough · POC</span>
          </div>
        </div>
      </Layer>
    </Scene>
  );
}
