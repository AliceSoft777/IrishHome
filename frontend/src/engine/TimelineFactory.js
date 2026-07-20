/**
 * TimelineFactory — builds a paused GSAP timeline authored in normalised
 * time. Scenes should author positions/durations in the [0, 1] domain so
 * `tl.progress(localProgress)` maps directly to authorial intent.
 *
 * Default per-tween duration is 0.5 (GSAP standard) and `ease: "none"`.
 * Authors compose with explicit positions:
 *
 *   const tl = createSceneTimeline((tl, root) => {
 *     tl.to(root.querySelector(".sky"),  { yPercent: -10 }, 0);
 *     tl.to(root.querySelector(".copy"), { opacity: 0 }, 0.55);
 *   }, rootEl);
 */
import { gsap } from "gsap";

export function createSceneTimeline(build, root) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none", duration: 0.5 } });
  build(tl, root);
  return tl;
}
