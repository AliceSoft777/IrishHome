import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES } from "../../data/assets";
import { LIVING_HOTSPOTS } from "../../data/hotspots";
import { SCENE } from "../../constants/testIds";
import MaterialHotspot from "./MaterialHotspot";
import { useAudio } from "../../hooks/useAudio";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 4 — Living Room.
 * Slow zoom out from the fireplace focal point. Warm color grade rises.
 */
export default function SceneLivingRoom() {
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
          end: "+=260%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => setScene("living"),
          onEnterBack: () => setScene("living"),
        },
      });

      tl.fromTo(".liv-plate", { scale: 1.35 }, { scale: 1.02, ease: "none" }, 0)
        .fromTo(".liv-window", { opacity: 0, xPercent: 20 }, { opacity: 1, xPercent: 0, ease: "none" }, 0)
        .fromTo(".liv-copy", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.1)
        .to(".liv-copy", { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, 0.6)
        .fromTo(".liv-warm", { opacity: 0 }, { opacity: 0.35, ease: "none" }, 0);
    }, root);

    return () => ctx.revert();
  }, [setScene]);

  return (
    <section
      ref={rootRef}
      data-testid={SCENE.livingRoom}
      className="relative h-screen w-full overflow-hidden bg-[#161010]"
    >
      <div className="absolute inset-0">
        <img
          src={IMAGES.living.hero}
          alt="Warm modern living room with fireplace"
          className="liv-plate absolute inset-0 h-full w-full object-cover"
        />
        {/* Warm color grade */}
        <div className="liv-warm absolute inset-0" style={{
          background: "radial-gradient(circle at 30% 60%, rgba(198,163,90,0.35), transparent 55%)",
        }} />
        {/* Parallax window slice — soft, no color artifacts */}
        <div
          className="liv-window absolute right-0 top-0 h-full w-[38%]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(198,163,90,0.12) 45%, rgba(250,248,245,0.18) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />
      </div>

      {/* Hotspots */}
      <div className="pointer-events-none absolute inset-0">
        {LIVING_HOTSPOTS.map((h, i) => (
          <MaterialHotspot key={h.id} data={h} side={i % 2 === 0 ? "right" : "left"} />
        ))}
      </div>

      {/* Copy */}
      <div className="liv-copy pointer-events-none absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
        <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
          <span>Chapter 04</span>
          <span className="text-[#C6A35A]">The Living</span>
        </div>

        <div className="max-w-2xl">
          <div className="mb-4 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
            04 — The Living Room
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
            The room<br />that <span className="italic text-[#C6A35A]">softens</span> at dusk.
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
    </section>
  );
}
