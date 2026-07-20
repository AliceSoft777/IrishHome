import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { INTRO } from "../../constants/testIds";

/**
 * Signature on-load moment.
 * Masked line-by-line reveal, then curtain lifts to hand off to Scene 1.
 */
export default function IntroSequence({ onDone }) {
  const rootRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // prevent scroll during intro
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: () => {
        document.body.style.overflow = "";
        if (onDone) onDone();
      },
    });

    tl.set(linesRef.current, { yPercent: 110 })
      .to(linesRef.current, {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.18,
        delay: 0.35,
      })
      .to(
        ".hm-intro-numeral",
        { opacity: 1, duration: 1.2, ease: "sine.out" },
        "-=1"
      )
      .to(
        ".hm-intro-sub",
        { opacity: 1, y: 0, duration: 1, ease: "sine.out" },
        "-=0.8"
      )
      .to({}, { duration: 0.9 })
      .to(root, {
        yPercent: -100,
        duration: 1.4,
        ease: "expo.inOut",
      });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onDone]);

  const setLine = (i) => (el) => {
    if (el) linesRef.current[i] = el;
  };

  return (
    <div
      ref={rootRef}
      data-testid={INTRO.container}
      className="fixed inset-0 z-[9500] bg-[#151515] text-[#FAF8F5] hm-vignette"
      style={{ willChange: "transform" }}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14">
        {/* Top row */}
        <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/60">
          <span>Home Modular · Ireland</span>
          <span className="hm-intro-numeral opacity-0">MMXXV / A Cinematic Walkthrough</span>
        </div>

        {/* Center headline */}
        <div className="max-w-5xl">
          <div className="hm-intro-numeral opacity-0 mb-6 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
            00 — Prelude
          </div>
          <h1
            data-testid={INTRO.headline}
            className="font-display text-[13vw] md:text-[9vw] leading-[0.9] tracking-tight text-[#FAF8F5]"
          >
            <span className="hm-mask block"><span ref={setLine(0)} className="hm-mask-inner block">A home,</span></span>
            <span className="hm-mask block"><span ref={setLine(1)} className="hm-mask-inner block italic text-[#C6A35A]">quietly</span></span>
            <span className="hm-mask block"><span ref={setLine(2)} className="hm-mask-inner block">assembled.</span></span>
          </h1>
          <p className="hm-intro-sub mt-8 max-w-md opacity-0 translate-y-4 font-body text-sm md:text-base text-[#FAF8F5]/70 leading-relaxed">
            Scroll to enter a modular home shaped by the Irish landscape —
            crafted in the workshop, delivered whole, quiet in the world.
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/60">
          <span className="hm-intro-numeral opacity-0">Chapter 01 · The Land</span>
          <span className="hm-intro-numeral opacity-0 hidden md:inline">Scroll to begin ↓</span>
        </div>
      </div>
    </div>
  );
}
