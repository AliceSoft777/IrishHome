import { useEffect, useRef } from "react";
import { useCamera } from "./CameraContext";

/**
 * SceneManager — the fixed camera root that hosts every scene in world Z.
 *
 * Responsibilities:
 *   - Holds the perspective + camera transform (x, y, rotY) shared by every scene
 *   - Fixes children to the viewport so scrolling drives the camera, not layout
 *   - Provides the scroll spacer that defines the length of the walk
 *
 * Scenes register themselves by being rendered as children; each scene reads
 * the camera imperatively via useSceneAnimation.
 */
export default function SceneManager({ worldDepth, children, scrollLengthVh = 900 }) {
  const cameraRef = useRef(null);
  const camera = useCamera();

  useEffect(() => {
    const root = cameraRef.current;
    if (!root) return undefined;

    // Apply subtle organic camera transform to the WHOLE stage.
    // Because scenes are position:fixed inside this transformed ancestor,
    // they inherit the sway automatically.
    const apply = (cam) => {
      root.style.transform =
        `translate3d(${cam.x}px, ${cam.y}px, 0) ` +
        `rotateX(${cam.rotX}deg) rotateY(${cam.rotY}deg)`;
    };
    return camera.subscribe(apply);
  }, [camera]);

  return (
    <>
      {/* Fixed stage — the camera root. Every scene lives inside here. */}
      <div
        ref={cameraRef}
        className="hm-camera-root fixed inset-0 z-[10]"
        style={{
          perspective: "1800px",
          perspectiveOrigin: "50% 55%",
          transformStyle: "preserve-3d",
          transformOrigin: "50% 55%",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        {children}
      </div>

      {/* Scroll spacer — defines the length of the walk in real pixels. */}
      <div
        aria-hidden="true"
        style={{ height: `${scrollLengthVh}vh` }}
        data-scroll-spacer=""
        data-world-depth={worldDepth}
      />
    </>
  );
}
