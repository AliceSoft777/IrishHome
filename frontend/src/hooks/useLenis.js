import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialises Lenis smooth-scroll once and wires it to GSAP's ticker.
 * Returns the ref so parent can `.scrollTo(...)` for chapter jumps.
 */
export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    const onFrame = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onFrame);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
