import { MARQUEE } from "../../constants/testIds";

/**
 * Slow editorial marquee — deliberate, one-time-in-page moment.
 * Duplicated span for seamless CSS animation loop.
 */
export default function EditorialMarquee({
  words = ["Crafted in Ireland", "Modular", "Timeless", "Quietly Assembled"],
  tone = "light",
}) {
  const bg = tone === "light" ? "bg-[#FAF8F5]" : "bg-[#123524]";
  const text = tone === "light" ? "text-[#123524]" : "text-[#C6A35A]";
  const sep = tone === "light" ? "text-[#C6A35A]" : "text-[#FAF8F5]/40";

  const strip = (
    <div className={`flex shrink-0 items-center gap-16 pr-16 font-display ${text} text-[7vw] md:text-[6vw] leading-none tracking-tight`}>
      {words.map((w, i) => (
        <span key={i} className="flex items-center gap-16 whitespace-nowrap">
          <span className="italic">{w}</span>
          <span className={`text-[3vw] ${sep}`}>✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <section
      data-testid={MARQUEE.container}
      className={`relative overflow-hidden ${bg} py-16 md:py-24`}
    >
      <div className="hm-marquee-track">
        {strip}
        {strip}
      </div>
    </section>
  );
}
