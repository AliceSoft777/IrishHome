import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import { NAV } from "../../constants/testIds";
import { useCamera, currentChapter } from "../../engine";

export default function GlassNav({ onBook }) {
  const { enabled, toggle } = useAudio();
  const camera = useCamera();

  const progressRef = useRef(null);
  const chapterRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Subscribe once — imperative updates from camera, zero re-renders.
    return camera.subscribe((cam) => {
      if (progressRef.current) {
        progressRef.current.style.width = `${cam.progress * 100}%`;
      }
      if (chapterRef.current) {
        const c = currentChapter(cam.z);
        const target = `${c.id} — ${c.label}`;
        if (chapterRef.current.textContent !== target) {
          chapterRef.current.textContent = target;
        }
      }
      // Nav reveals after ~5% into the walk (the intro has lifted by then).
      setVisible((prev) => {
        const next = cam.progress > 0.008;
        return prev === next ? prev : next;
      });
    });
  }, [camera]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          data-testid={NAV.container}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-6 left-1/2 z-[9000] -translate-x-1/2 w-[min(1180px,calc(100%-3rem))]"
        >
          <div className="hm-glass-light flex items-center justify-between rounded-full px-6 py-3">
            <a
              data-testid={NAV.logo}
              href="#top"
              className="flex items-center gap-3"
              data-cursor="cta"
              data-cursor-label="Top"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#123524]">
                <span className="font-display text-[15px] text-[#C6A35A] leading-none">h</span>
              </span>
              <span className="hidden md:block font-display text-[15px] leading-none text-[#151515]">
                Home Modular <span className="text-[#C6A35A]">·</span> Ireland
              </span>
            </a>

            <div className="hidden md:flex items-center gap-3" data-testid={NAV.progress}>
              <span
                ref={chapterRef}
                data-testid={NAV.chapter}
                className="font-body text-[11px] uppercase tracking-[0.28em] text-[#123524]"
              >
                01 — The Land
              </span>
              <div className="relative h-[2px] w-32 overflow-hidden rounded-full bg-[#123524]/15">
                <div
                  ref={progressRef}
                  className="absolute inset-y-0 left-0 bg-[#C6A35A]"
                  style={{ width: "0%" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                data-testid={NAV.audioToggle}
                onClick={toggle}
                aria-label={enabled ? "Mute ambient audio" : "Unmute ambient audio"}
                data-cursor="explore"
                data-cursor-label={enabled ? "Mute" : "Sound"}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#123524]/15 text-[#123524] transition-colors hover:bg-[#123524] hover:text-[#C6A35A]"
              >
                {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                data-testid={NAV.cta}
                onClick={onBook}
                data-cursor="cta"
                data-cursor-label="Book"
                className="group relative overflow-hidden rounded-full bg-[#123524] px-5 py-2 font-body text-[11px] uppercase tracking-[0.24em] text-[#FAF8F5]"
              >
                <span className="relative z-10">Book Consultation</span>
                <span className="absolute inset-0 -translate-x-full bg-[#C6A35A] transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="absolute inset-0 z-10 flex items-center justify-center text-[#123524] opacity-0 transition-opacity duration-300 group-hover:opacity-100 px-5 py-2 font-body text-[11px] uppercase tracking-[0.24em]">
                  Book Consultation
                </span>
              </button>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
