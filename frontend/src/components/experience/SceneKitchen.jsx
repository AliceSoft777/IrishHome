import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES } from "../../data/assets";
import { KITCHEN_HOTSPOTS } from "../../data/hotspots";
import { SCENE } from "../../constants/testIds";
import MaterialHotspot from "./MaterialHotspot";
import { useAudio } from "../../hooks/useAudio";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 3 — Luxury Kitchen (primary showcase).
 * Horizontal camera pan across a wide interior image, hotspots overlay.
 */
export default function SceneKitchen() {
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
          end: "+=320%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => setScene("kitchen"),
          onEnterBack: () => setScene("kitchen"),
        },
      });

      // Horizontal pan across the kitchen (wide image translates left)
      tl.fromTo(
        ".kit-plate",
        { xPercent: 0, scale: 1.1 },
        { xPercent: -22, scale: 1.0, ease: "none" },
        0
      )
        .fromTo(
          ".kit-hotspots",
          { xPercent: 0, opacity: 0 },
          { xPercent: -22, opacity: 1, ease: "none" },
          0
        )
        .fromTo(
          ".kit-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.08
        )
        .to(".kit-title", { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, 0.55)
        .fromTo(
          ".kit-legend",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.35
        );
    }, root);

    return () => ctx.revert();
  }, [setScene]);

  return (
    <section
      ref={rootRef}
      data-testid={SCENE.kitchen}
      className="relative h-screen w-full overflow-hidden bg-[#0d0d0d]"
    >
      {/* Kitchen plate + hotspots share the same pan transform via absolute wrapper */}
      <div className="absolute inset-0">
        <div className="kit-plate absolute inset-0 h-full w-[140%]">
          <img
            src={IMAGES.kitchen.hero}
            alt="Luxury Scandinavian kitchen interior"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
        </div>

        <div className="kit-hotspots pointer-events-none absolute inset-0 h-full w-[140%]">
          {KITCHEN_HOTSPOTS.map((h, i) => (
            <MaterialHotspot key={h.id} data={h} side={i % 2 === 0 ? "right" : "left"} />
          ))}
        </div>
      </div>

      {/* Chapter title */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
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
    </section>
  );
}
