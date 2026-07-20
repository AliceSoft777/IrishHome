import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BookingDialog({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", county: "", note: "" });

  const submit = (e) => {
    e.preventDefault();
    toast.success("Request received", {
      description: "A quiet email will arrive within one working day.",
    });
    onClose();
    setForm({ name: "", email: "", county: "", note: "" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9800] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
          onClick={onClose}
        >
          <motion.form
            data-testid="booking-dialog"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hm-glass-light relative w-full max-w-lg rounded-3xl p-8 text-[#151515]"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-cursor="explore"
              data-cursor-label="Close"
              data-testid="booking-close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[#123524]/15 text-[#123524] hover:bg-[#123524] hover:text-[#C6A35A] transition-colors"
            >
              <X size={14} />
            </button>

            <div className="mb-1 font-body text-[10px] uppercase tracking-[0.32em] text-[#C6A35A]">
              Book a consultation
            </div>
            <h3 className="font-display text-4xl leading-[1] tracking-tight text-[#123524]">
              Let&apos;s begin<br /><span className="italic">quietly</span>.
            </h3>
            <p className="mt-3 font-body text-sm text-[#777777] leading-relaxed">
              Tell us about your site and your intention. We&apos;ll respond by hand.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <input
                data-testid="booking-name"
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-full border border-[#123524]/15 bg-white/60 px-5 py-3 font-body text-sm text-[#151515] placeholder:text-[#777777] focus:border-[#123524] focus:outline-none"
              />
              <input
                data-testid="booking-email"
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-full border border-[#123524]/15 bg-white/60 px-5 py-3 font-body text-sm text-[#151515] placeholder:text-[#777777] focus:border-[#123524] focus:outline-none"
              />
              <input
                data-testid="booking-county"
                placeholder="County / Site location"
                value={form.county}
                onChange={(e) => setForm({ ...form, county: e.target.value })}
                className="w-full rounded-full border border-[#123524]/15 bg-white/60 px-5 py-3 font-body text-sm text-[#151515] placeholder:text-[#777777] focus:border-[#123524] focus:outline-none"
              />
              <textarea
                data-testid="booking-note"
                rows={3}
                placeholder="A few words about your project"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full rounded-2xl border border-[#123524]/15 bg-white/60 px-5 py-3 font-body text-sm text-[#151515] placeholder:text-[#777777] focus:border-[#123524] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              data-testid="booking-submit"
              data-cursor="cta"
              data-cursor-label="Send"
              className="mt-6 w-full rounded-full bg-[#123524] px-6 py-4 font-body text-[11px] uppercase tracking-[0.28em] text-[#FAF8F5] transition-colors hover:bg-[#C6A35A] hover:text-[#123524]"
            >
              Send request
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
