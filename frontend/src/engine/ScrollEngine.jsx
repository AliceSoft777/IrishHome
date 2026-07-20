import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCamera } from "./CameraContext";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollEngine — one and only one scroll driver for the whole experience.
 *
 *  1. Boots Lenis for smooth momentum scrolling.
 *  2. Bridges Lenis into GSAP's ticker so any nested ScrollTrigger stays in sync.
 *  3. Every Lenis scroll event computes a single `progress ∈ [0, 1]` and pushes
 *     it to the CameraController. Nothing else in the app listens to raw scroll.
 *
 * We deliberately do NOT use ScrollTrigger for the global camera drive — the
 * timing of when the scroll-spacer element is available in the DOM is fragile,
 * and a direct calculation is simpler and identical in behaviour.
 */
export default function ScrollEngine() {
  const camera = useCamera();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.3,
    });

    // Debug hooks — kept lightweight; picked up by testing tools.
    if (typeof window !== "undefined") {
      window.__hmCamera = camera;
      window.__hmLenis = lenis;
    }

    const onFrame = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onFrame);
    gsap.ticker.lagSmoothing(0);

    // Every Lenis scroll event pushes progress to the camera.
    const push = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      camera.setProgress(p);
      ScrollTrigger.update();
    };
    lenis.on("scroll", push);

    // Ambient idle breathing tick.
    const idle = () => camera.tick(gsap.ticker.deltaRatio() / 60);
    gsap.ticker.add(idle);

    // Push once after mount so opacity / timeline states initialise correctly.
    const raf = requestAnimationFrame(() => {
      push();
      ScrollTrigger.refresh();
    });

    // Recompute on resize (spacer height depends on vh).
    const onResize = () => {
      push();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(onFrame);
      gsap.ticker.remove(idle);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete window.__hmCamera;
        delete window.__hmLenis;
      }
    };
  }, [camera]);

  return null;
}
