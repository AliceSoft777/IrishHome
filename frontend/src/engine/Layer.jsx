import { forwardRef } from "react";

/**
 * Layer — a positioned depth stratum inside a Scene.
 *
 * `depth` is the local Z position (px) baked into the CSS transform at
 * mount time. The Layer auto-compensates its scale so it still fills its
 * container visually after CSS perspective foreshortening — giving real
 * pseudo-3D depth cues (parallax between layers) without shrinking edges
 * into the scene's background.
 *
 * Formula: for perspective P and z position z (z ≤ 0 for farther),
 *   visual = P / (P − z)
 *   compensation scale = (P − z) / P
 *
 * Semantic role prop for scene authors:
 *   role="background" | "architecture" | "furniture" | "foreground" | "particles" | "ui"
 */
const Layer = forwardRef(function Layer(
  {
    depth = 0,
    perspective = 1600,
    role,
    parallax,
    className = "",
    style,
    children,
    ...rest
  },
  ref
) {
  // Compensation so the layer still fills the viewport visually.
  const compScale = (perspective - depth) / perspective;
  const transform = `translate3d(0,0,${depth}px) scale(${compScale.toFixed(4)})`;

  return (
    <div
      ref={ref}
      data-layer={role}
      data-depth={depth}
      data-parallax={parallax}
      className={`hm-layer absolute inset-0 ${className}`}
      style={{
        transform,
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Layer;
