import { forwardRef } from "react";

/**
 * Scene — the fixed viewport-sized layer that hosts a room in world space.
 *
 * Every scene is rendered at position:fixed inset:0 inside the camera root
 * so that the browser can composite them cheaply. The parent SceneManager
 * z-orders scenes by their worldZ; the useSceneAnimation hook inside the
 * child controls opacity + timeline based on `camera.z − worldZ`.
 *
 * Layers of typical composition (top → bottom, near → far):
 *   • ui / copy         (localZ  ~ +200)
 *   • particles         (localZ  ~ +100)
 *   • foreground        (localZ  ~   0)
 *   • furniture         (localZ  ~ -200)
 *   • architecture      (localZ  ~ -600)
 *   • background        (localZ  ~ -1200)
 *
 * Layer positions are baked into each scene via translateZ() with a shared
 * perspective. See <Layer />.
 */
const Scene = forwardRef(function Scene(
  { className = "", background = "#000", perspective = 1600, style, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={`hm-scene absolute inset-0 overflow-hidden ${className}`}
      style={{
        opacity: 0,
        pointerEvents: "none",
        visibility: "hidden",
        backgroundColor: background,
        perspective: `${perspective}px`,
        perspectiveOrigin: "50% 55%",
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Scene;
