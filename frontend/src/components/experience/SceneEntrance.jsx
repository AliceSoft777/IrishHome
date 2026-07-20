import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES } from "../../data/assets";
import { SCENE } from "../../constants/testIds";
import { useAudio } from "../../hooks/useAudio";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 2 — Entrance.
 * Camera dollies into the door, blur transition, lighting shifts from
 * cool exterior to warm interior. Two layered plates crossfade.
 */
export default function SceneEntrance() {
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
          end: "+=220%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => setScene("entrance"),
          onEnterBack: () => setScene("entrance"),
        },
      });

      // Camera dolly-in on the door
      tl.to(".ent-door", { scale: 2.6, ease: "none" }, 0)
        .to(".ent-door", { filter: "blur(24px)", ease: "none" }, 0.35)
        .to(".ent-copy", { opacity: 0, yPercent: -20, ease: "power2.in" }, 0.05)
        // Interior plate crossfade
        .to(".ent-interior", { opacity: 1, scale: 1.05, ease: "none" }, 0.4)
        .to(".ent-warmth", { opacity: 1, ease: "none" }, 0.5)
        // Door split light bloom
        .to(".ent-bloom", { opacity: 1, scale: 1.2, ease: "none" }, 0.55);
    }, root);

    return () => ctx.revert();
  }, [setScene]);

  return (
    <section
      ref={rootRef}
      data-testid={SCENE.entrance}
      className="relative h-screen w-full overflow-hidden bg-[#0b0b0b]"
    >
      {/* Exterior door plate */}
      <div className="absolute inset-0 hm-perspective">
        <img
          src={IMAGES.entrance.exteriorDoor}
          alt="Approaching the front door"
          className="ent-door absolute inset-0 h-full w-full object-cover"
          style={{ transformOrigin: "50% 55%" }}
        />
      </div>

      {/* Interior warm plate — hidden until scroll */}
      <div className="ent-interior absolute inset-0 opacity-0">
        <img
          src={IMAGES.entrance.interiorGlow}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="ent-warmth absolute inset-0 opacity-0" style={{
          background: "radial-gradient(circle at 50% 45%, rgba(198,163,90,0.35), transparent 60%)",
        }} />
      </div>

      {/* Door light bloom */}
      <div className="ent-bloom pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0" style={{
        background: "radial-gradient(circle, rgba(255,236,190,0.55), rgba(255,236,190,0) 65%)",
      }} />

      {/* Copy */}
      <div className="ent-copy absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-[#FAF8F5]">
        <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/70">
          <span>Chapter 02</span>
          <span className="text-[#C6A35A]">The Threshold</span>
        </div>

        <div className="max-w-2xl">
          <div className="mb-5 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
            02 — Enter
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
            Step across.<br /><span className="italic text-[#C6A35A]">Everything softens.</span>
          </h2>
        </div>

        <div className="font-body text-[10px] uppercase tracking-[0.32em] text-[#FAF8F5]/60">
          Keep scrolling ↓
        </div>
      </div>
    </section>
  );
}
