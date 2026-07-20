import { useEffect, useRef } from "react";

/**
 * Precision dot cursor that expands over interactive elements.
 * Uses data-cursor="explore" attribute on targets to change state.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(var(--hm-ring-scale, 1))`;
      label.style.transform = `translate3d(${rx}px, ${ry + 30}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e) => {
      const target = e.target.closest("[data-cursor]");
      if (!target) {
        ring.style.setProperty("--hm-ring-scale", "1");
        ring.style.borderColor = "rgba(198,163,90,0.55)";
        label.style.opacity = "0";
        return;
      }
      const mode = target.getAttribute("data-cursor");
      if (mode === "explore") {
        ring.style.setProperty("--hm-ring-scale", "2.6");
        ring.style.borderColor = "rgba(198,163,90,0.9)";
        label.textContent = target.getAttribute("data-cursor-label") || "Explore";
        label.style.opacity = "1";
      } else if (mode === "cta") {
        ring.style.setProperty("--hm-ring-scale", "3.2");
        ring.style.borderColor = "#C6A35A";
        label.textContent = target.getAttribute("data-cursor-label") || "Enter";
        label.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-8 w-8 rounded-full border border-[#C6A35A]/60 transition-[border-color] duration-300"
        style={{ mixBlendMode: "difference", transition: "border-color .3s, --hm-ring-scale .35s" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-[6px] w-[6px] rounded-full bg-[#C6A35A]"
      />
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] font-body text-[10px] tracking-[0.3em] uppercase text-[#C6A35A] opacity-0 transition-opacity duration-300"
      />
    </>
  );
}
