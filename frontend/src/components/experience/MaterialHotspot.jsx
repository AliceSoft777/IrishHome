import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { HOTSPOT } from "../../constants/testIds";

/**
 * Reusable Material Hotspot.
 * Renders a pulsing dot at (x%, y%) and an expandable glass info card.
 * Same schema works for every future room.
 */
export default function MaterialHotspot({ data, side = "right" }) {
  const [open, setOpen] = useState(false);
  const { id, position, material, title, description, feature, spec, image } = data;

  const cardSide = side === "right" ? "left-8" : "right-8";
  const cardOrigin = side === "right" ? "origin-left" : "origin-right";

  return (
    <div
      className="pointer-events-auto absolute"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <button
        data-testid={HOTSPOT.trigger(id)}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Reveal detail: ${material}`}
        data-cursor="explore"
        data-cursor-label={material}
        className="relative -translate-x-1/2 -translate-y-1/2"
      >
        <span className="hm-pulse block h-3 w-3 rounded-full bg-[#C6A35A] ring-2 ring-[#C6A35A]/40" />
        <span className="absolute inset-0 -m-4 rounded-full" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid={HOTSPOT.card(id)}
            initial={{ opacity: 0, x: side === "right" ? -12 : 12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: side === "right" ? -12 : 12, scale: 0.96 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-1/2 -translate-y-1/2 ${cardSide} w-[280px] md:w-[340px] ${cardOrigin} hm-glass-dark rounded-2xl p-5 text-[#FAF8F5]`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="font-body text-[10px] uppercase tracking-[0.32em] text-[#C6A35A]">
                {material}
              </div>
              <button
                data-testid={HOTSPOT.close(id)}
                onClick={() => setOpen(false)}
                aria-label="Close detail"
                data-cursor="explore"
                data-cursor-label="Close"
                className="grid h-6 w-6 place-items-center rounded-full border border-white/20 text-white/70 hover:text-[#C6A35A]"
              >
                <X size={12} />
              </button>
            </div>

            {image && (
              <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg">
                <img src={image} alt={material} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            <h4 className="mt-4 font-display text-2xl leading-tight text-[#FAF8F5]">
              {title}
            </h4>
            <p className="mt-2 font-body text-sm text-[#FAF8F5]/75 leading-relaxed">
              {description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div>
                <div className="font-body text-[9px] uppercase tracking-[0.3em] text-[#C6A35A]/80">
                  Feature
                </div>
                <div className="mt-1 font-body text-xs text-[#FAF8F5]/90 leading-snug">
                  {feature}
                </div>
              </div>
              {spec && (
                <div>
                  <div className="font-body text-[9px] uppercase tracking-[0.3em] text-[#C6A35A]/80">
                    Spec
                  </div>
                  <div className="mt-1 font-body text-xs text-[#FAF8F5]/90 leading-snug">
                    {spec}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
