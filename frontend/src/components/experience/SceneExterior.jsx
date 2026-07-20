import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES } from "../../data/assets";
import { SCENE } from "../../constants/testIds";
import { useAudio } from "../../hooks/useAudio";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 1 — Hero Exterior.
 * Layered parallax (sky, hills, mist, house, foreground) driven by scroll.
 * Pinned 100vh × ~3 for the dolly-in.
 */
export default function SceneExterior({ onEnter }) {
  const rootRef = useRef(null);
  const { setScene } = useAudio();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=280%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => setScene("exterior"),
          onEnterBack: () => setScene("exterior"),
        },
      });

      tl.to(".ext-sky", { yPercent: -8, scale: 1.08, ease: "none" }, 0)
        .to(".ext-hills", { yPercent: -14, scale: 1.14, ease: "none" }, 0)
        .to(".ext-mist", { yPercent: -6, opacity: 0.35, ease: "none" }, 0)
        .to(".ext-house", { scale: 1.9, yPercent: 6, ease: "none" }, 0)
        .to(".ext-foreground", { yPercent: -40, scale: 1.25, ease: "none" }, 0)
        .to(".ext-copy", { opacity: 0, yPercent: -20, ease: "power2.in" }, 0.05)
        .to(".ext-vignette", { opacity: 1, ease: "none" }, 0.4);

      // gentle drifting breathing on the whole stack
      gsap.to(".ext-stack", {
        y: 8,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, [setScene]);

  return (
    <section
      ref={rootRef}
      data-testid={SCENE.exterior}
      className="relative h-screen w-full overflow-hidden bg-[#0f1a13]"
    >
      <div className="ext-stack absolute inset-0 hm-perspective">
        <img
          src={IMAGES.exterior.sky}
          alt=""
          aria-hidden="true"
          className="ext-sky absolute inset-0 h-full w-full object-cover"
          style={{ transform: "translateZ(-400px) scale(1.6)" }}
        />
        <img
          src={IMAGES.exterior.hills}
          alt=""
          aria-hidden="true"
          className="ext-hills absolute inset-0 h-full w-full object-cover"
          style={{ transform: "translateZ(-200px) scale(1.2)" }}
        />
        <div className="ext-mist absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
        <img
          src={IMAGES.exterior.house}
          alt="Modular home in the Irish countryside"
          className="ext-house absolute left-1/2 top-1/2 h-[85%] max-h-[820px] w-auto -translate-x-1/2 -translate-y-[50%] object-cover"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 62% 78% at 50% 55%, black 40%, transparent 95%)",
            maskImage: "radial-gradient(ellipse 62% 78% at 50% 55%, black 40%, transparent 95%)",
            filter: "drop-shadow(0 60px 100px rgba(0,0,0,0.65))",
          }}
        />
        <div className="ext-foreground absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#0f1a13] via-[#0f1a13]/70 to-transparent" />
      </div>

      {/* Vignette */}
      <div className="ext-vignette pointer-events-none absolute inset-0 opacity-70" style={{
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Copy overlay */}
      <div className="ext-copy absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
        <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
          <span>Chapter 01</span>
          <span className="text-[#C6A35A]">The Land</span>
        </div>

        <div className="max-w-3xl">
          <div className="mb-5 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
            County Wicklow · 07:14
          </div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-[7.2rem] leading-[0.95] tracking-tight">
            A morning<br />that <span className="italic text-[#C6A35A]">holds</span> its breath.
          </h2>
          <p className="mt-6 max-w-md font-body text-sm md:text-base text-[#FAF8F5]/75 leading-relaxed">
            Mist over the fields. A modular house, patient in the valley.
            Keep scrolling — the door is already open.
          </p>
        </div>

        <div className="flex items-end justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/60">
          <span className="hidden md:inline">Scroll ↓</span>
          <button
            onClick={onEnter}
            data-cursor="cta"
            data-cursor-label="Skip"
            className="rounded-full border border-[#FAF8F5]/25 px-4 py-1.5 text-[#FAF8F5]/75 hover:text-[#C6A35A] hover:border-[#C6A35A] transition-colors"
          >
            Skip intro
          </button>
        </div>
      </div>
    </section>
  );
}
