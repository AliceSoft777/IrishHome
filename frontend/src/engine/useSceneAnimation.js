import { useEffect, useLayoutEffect, useRef } from "react";
import { useCamera } from "./CameraContext";
import { createSceneTimeline } from "./TimelineFactory";
import { smoothStep } from "./CameraController";

/**
 * useSceneAnimation — the primary bridge between a scene and the camera.
 *
 *  worldZ            world-space start of the scene along the Z axis
 *  depth             extent of the scene along Z
 *  rootRef           ref to the scene's fixed root element
 *  buildTimeline     (tl, root) => void — construct a paused, unit-length timeline
 *  fadeIn/fadeOut    soft opacity ramps at scene edges for overlap between scenes
 *  onEnter/onExit    optional side-effect callbacks (used for audio scene switch)
 *
 * The hook subscribes to camera updates once and imperatively:
 *   - sets root opacity based on local progress (with soft edges)
 *   - toggles pointer-events so background scenes cannot swallow clicks
 *   - drives the timeline via progress()
 * No React re-renders occur on scroll.
 */
export default function useSceneAnimation({
  worldZ,
  depth,
  rootRef,
  buildTimeline,
  fadeIn = 0.12,
  fadeOut = 0.12,
  onEnter,
  onExit,
}) {
  const camera = useCamera();
  const tlRef = useRef(null);
  const wasActiveRef = useRef(false);

  // Build the timeline once the root DOM is mounted.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !buildTimeline) return undefined;

    tlRef.current = createSceneTimeline(
      (tl, r) => buildTimeline(tl, r),
      root
    );

    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, [buildTimeline, rootRef]);

  // Subscribe to the camera. Imperative updates only.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const apply = (cam) => {
      const local = (cam.z - worldZ) / depth;

      // Opacity: soft fade at both edges so adjacent scenes crossfade.
      let opacity;
      if (local < 0) {
        opacity = fadeIn > 0 ? smoothStep(-fadeIn, 0, local) : local >= 0 ? 1 : 0;
      } else if (local > 1) {
        opacity = fadeOut > 0 ? 1 - smoothStep(1, 1 + fadeOut, local) : 1;
      } else {
        opacity = 1;
      }

      root.style.opacity = String(opacity);
      root.style.pointerEvents = opacity > 0.55 ? "auto" : "none";
      // Hide from paint entirely when far outside so the browser can skip work.
      root.style.visibility = opacity < 0.01 ? "hidden" : "visible";

      const tl = tlRef.current;
      if (tl) {
        // Extend the driven range slightly beyond [0,1] so ending motion
        // continues to blend during the overlap crossfade.
        const driven = Math.max(-fadeIn, Math.min(1 + fadeOut, local));
        // Timeline duration is 1s, so progress ∈ [0,1] maps directly.
        tl.progress(Math.max(0, Math.min(1, driven)));
      }

      // Enter / exit callbacks.
      const isActive = opacity > 0.6;
      if (isActive && !wasActiveRef.current) {
        wasActiveRef.current = true;
        onEnter?.();
      } else if (!isActive && wasActiveRef.current) {
        wasActiveRef.current = false;
        onExit?.();
      }
    };

    return camera.subscribe(apply);
  }, [camera, worldZ, depth, fadeIn, fadeOut, rootRef, onEnter, onExit]);
}
