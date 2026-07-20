import { motion } from "framer-motion";
import { MANIFESTO } from "../../constants/testIds";

/**
 * Editorial section break between scenes.
 * Numbered chapter · clipped-frame image · rich supporting copy.
 */
export default function ManifestoChapter({
  number,
  eyebrow,
  title,
  body,
  image,
  reversed = false,
}) {
  return (
    <section
      data-testid={MANIFESTO.chapter(number)}
      className="relative bg-[#FAF8F5] py-24 md:py-40 overflow-hidden"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-14 md:px-14">
        {/* Numeral column */}
        <div className={`md:col-span-2 ${reversed ? "md:order-3" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[7rem] md:text-[9rem] leading-[0.85] text-[#123524]"
          >
            {number}
          </motion.div>
          <div className="mt-2 font-body text-[10px] uppercase tracking-[0.4em] text-[#C6A35A]">
            {eyebrow}
          </div>
        </div>

        {/* Image column with clip reveal */}
        <div className={`md:col-span-6 ${reversed ? "md:order-1" : ""}`}>
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
            className="relative aspect-[4/5] overflow-hidden bg-[#123524]/10"
          >
            <motion.img
              src={image}
              alt=""
              initial={{ scale: 1.25 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151515]/25 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Copy column */}
        <div className={`md:col-span-4 flex flex-col justify-center ${reversed ? "md:order-2" : ""}`}>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-5xl leading-[1] tracking-tight text-[#151515]"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-body text-base md:text-lg leading-relaxed text-[#777777]"
          >
            {body}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 h-px w-24 origin-left bg-[#C6A35A]"
          />
        </div>
      </div>
    </section>
  );
}
