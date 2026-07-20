import { useCallback, useRef } from "react";
import { MARQUEE } from "../../constants/testIds";
import { Scene, Layer, useSceneAnimation } from "../../engine";

/**
 * EditorialMarquee — a moving typographic sculpture the camera drifts past.
 * The track translates in X based on local progress instead of a CSS keyframe,
 * so its motion stays locked to the walk. Two copies of the strip keep the
 * seam invisible.
 */
export default function EditorialMarquee({
  worldZ,
  depth,
  words = ["Crafted in Ireland", "Modular", "Timeless", "Quietly Assembled"],
  tone = "light",
}) {
  const rootRef = useRef(null);

  const build = useCallback((tl, root) => {
    // Slow left-drift driven by camera progress.
    tl.fromTo(
      root.querySelector(".marquee-track"),
      { xPercent: 0 },
      { xPercent: -50 },
      0
    );
    // Subtle vertical drift + scale to feel like the camera is passing it.
    tl.fromTo(
      root.querySelector(".marquee-track"),
      { scale: 0.94, z: -80 },
      { scale: 1.04, z: 80 },
      0
    );
    // Fade in / out at edges (in addition to scene opacity)
    tl.fromTo(
      root.querySelector(".marquee-track"),
      { opacity: 0 },
      { opacity: 1 },
      0.05
    );
    tl.to(root.querySelector(".marquee-track"), { opacity: 0 }, 0.9);
  }, []);

  useSceneAnimation({
    worldZ,
    depth,
    rootRef,
    buildTimeline: build,
  });

  const bg = tone === "light" ? "#FAF8F5" : "#123524";
  const text = tone === "light" ? "text-[#123524]" : "text-[#C6A35A]";
  const sep = tone === "light" ? "text-[#C6A35A]" : "text-[#FAF8F5]/40";

  const strip = (
    <div
      className={`flex shrink-0 items-center gap-16 pr-16 font-display ${text} text-[7vw] md:text-[6vw] leading-none tracking-tight`}
    >
      {words.map((w, i) => (
        <span key={i} className="flex items-center gap-16 whitespace-nowrap">
          <span className="italic">{w}</span>
          <span className={`text-[3vw] ${sep}`}>✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <Scene ref={rootRef} data-testid={MARQUEE.container} background={bg}>
      <Layer role="ui" depth={0}>
        <div className="absolute inset-0 flex items-center overflow-hidden">
          <div className="marquee-track flex" style={{ willChange: "transform" }}>
            {strip}
            {strip}
          </div>
        </div>
      </Layer>
    </Scene>
  );
}
