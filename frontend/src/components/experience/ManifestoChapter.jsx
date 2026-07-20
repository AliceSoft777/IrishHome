import { useCallback, useRef } from "react";
import { MANIFESTO } from "../../constants/testIds";
import { Scene, Layer, useSceneAnimation } from "../../engine";

/**
 * ManifestoChapter — an editorial "billboard" the camera passes through.
 *
 * Composition:
 *   • Background wash (dark warm)   — depth -400
 *   • Numeral panel (huge digit)    — depth -200
 *   • Image with clipped reveal     — depth  -50
 *   • Copy column                   — depth  200
 *
 * Local progress drives:
 *   - image clip-path opens (bottom → top)
 *   - numeral rises + fades in
 *   - copy text lifts in, then subtly drifts as the camera continues past
 */
export default function ManifestoChapter({
  worldZ,
  depth,
  number,
  eyebrow,
  title,
  body,
  image,
  reversed = false,
}) {
  const rootRef = useRef(null);

  const build = useCallback((tl, root) => {
    tl.fromTo(
      root.querySelector(".mf-numeral"),
      { opacity: 0, y: 40, z: -60 },
      { opacity: 1, y: 0, z: 0 },
      0.05
    );
    tl.fromTo(
      root.querySelector(".mf-image-clip"),
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0% 0 0 0)" },
      0.08
    );
    tl.fromTo(
      root.querySelector(".mf-image"),
      { scale: 1.28 },
      { scale: 1.02 },
      0
    );
    tl.fromTo(
      root.querySelector(".mf-title"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0 },
      0.18
    );
    tl.fromTo(
      root.querySelector(".mf-body"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0 },
      0.24
    );
    tl.fromTo(
      root.querySelector(".mf-rule"),
      { scaleX: 0 },
      { scaleX: 1 },
      0.3
    );

    // Camera continues past — content drifts up and softly recedes.
    tl.to(root.querySelector(".mf-content"), { yPercent: -18, z: -80 }, 0.6);
    tl.to(root.querySelector(".mf-content"), { opacity: 0.15 }, 0.75);
  }, []);

  useSceneAnimation({
    worldZ,
    depth,
    rootRef,
    buildTimeline: build,
  });

  return (
    <Scene ref={rootRef} data-testid={MANIFESTO.chapter(number)} background="#FAF8F5">
      {/* Subtle warm wash */}
      <Layer role="background" depth={-500}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 70% 40%, rgba(198,163,90,0.08), transparent 55%)" }}
        />
      </Layer>

      <Layer role="ui" depth={0}>
        <div className="mf-content mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-12 md:gap-14 md:px-14 md:py-24">
          {/* Numeral */}
          <div className={`md:col-span-2 ${reversed ? "md:order-3" : ""}`}>
            <div className="mf-numeral font-display text-[7rem] md:text-[9rem] leading-[0.85] text-[#123524]">
              {number}
            </div>
            <div className="mt-2 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
              {eyebrow}
            </div>
          </div>

          {/* Image with clip reveal */}
          <div className={`md:col-span-6 ${reversed ? "md:order-1" : ""}`}>
            <div className="mf-image-clip relative aspect-[4/5] overflow-hidden bg-[#123524]/10">
              <img src={image} alt="" className="mf-image h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151515]/25 via-transparent to-transparent" />
            </div>
          </div>

          {/* Copy column */}
          <div className={`md:col-span-4 flex flex-col justify-center ${reversed ? "md:order-2" : ""}`}>
            <h3 className="mf-title font-display text-4xl md:text-5xl leading-[1] tracking-tight text-[#151515]">
              {title}
            </h3>
            <p className="mf-body mt-6 font-body text-base md:text-lg leading-relaxed text-[#777777]">
              {body}
            </p>
            <div className="mf-rule mt-10 h-px w-24 origin-left bg-[#C6A35A]" />
          </div>
        </div>
      </Layer>
    </Scene>
  );
}
