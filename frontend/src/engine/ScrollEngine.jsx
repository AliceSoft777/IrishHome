import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCamera } from "./CameraContext";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollEngine — the single scroll driver.
 *
 * Responsibilities:
 *   1. Boot Lenis for smooth momentum scrolling (first stage of smoothing).
 *   2. Read window.scrollY on every scroll event and push the raw
 *      normalised value to the camera as a TARGET (not final state).
 *   3. Advance the camera every RAF with a real deltaTime so the
 *      controller's inertial lerp + breathing physics are frame-rate
 *      independent — this is the second stage of smoothing.
 */
export default function ScrollEngine() {
  const camera = useCamera();

  useEffect(() => {
    const lenis = new Lenis({
      // Slightly longer glide than default for cinema weight.
      duration: 1.55,
      smoothWheel: true,
      // Long expo out — the "settle" of a stabilised camera.
      easing: (t) => 1 - Math.pow(1 - t, 4.5),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      lerp: 0.075, // Lenis internal lerp — 1st smoothing stage
    });

    if (typeof window !== "undefined") {
      window.__hmCamera = camera;
      window.__hmLenis = lenis;
    }

    const onFrame = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onFrame);
    gsap.ticker.lagSmoothing(0);

    // Push the raw scroll position as a TARGET to the camera.
    const push = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      camera.setTargetProgress(p);
      ScrollTrigger.update();
    };
    lenis.on("scroll", push);

    // Advance camera physics every RAF with real deltaTime.
    let lastT = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastT) / 1000;
      lastT = now;
      camera.tick(dt);
    };
    gsap.ticker.add(tick);

    // Initialise + refresh once fonts / images have arrived.
    const raf = requestAnimationFrame(() => {
      push();
      ScrollTrigger.refresh();
    });

    const onResize = () => {
      push();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(onFrame);
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete window.__hmCamera;
        delete window.__hmLenis;
      }
    };
  }, [camera]);

  return null;
}
