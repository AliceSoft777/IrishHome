import { useState } from "react";
import { Toaster } from "sonner";
import useLenis from "../../hooks/useLenis";
import { AudioProvider } from "../../hooks/useAudio";
import { IMAGES } from "../../data/assets";
import CustomCursor from "./CustomCursor";
import GlassNav from "./GlassNav";
import IntroSequence from "./IntroSequence";
import SceneExterior from "./SceneExterior";
import ManifestoChapter from "./ManifestoChapter";
import SceneEntrance from "./SceneEntrance";
import SceneKitchen from "./SceneKitchen";
import EditorialMarquee from "./EditorialMarquee";
import SceneLivingRoom from "./SceneLivingRoom";
import SceneExitCTA from "./SceneExitCTA";
import BookingDialog from "./BookingDialog";

/**
 * Main experience orchestrator.
 * The scene registry is intentionally an array so future rooms
 * (bedroom, bathroom, dining) can be inserted without touching engine code.
 */
export default function Experience() {
  useLenis();
  const [intro, setIntro] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <AudioProvider>
      <div id="top" className="relative bg-[#FAF8F5] text-[#151515]">
        {/* Global overlays */}
        <div className="hm-grain" aria-hidden="true" />
        <CustomCursor />
        <Toaster position="bottom-center" theme="light" />

        {intro && <IntroSequence onDone={() => setIntro(false)} />}

        <GlassNav onBook={() => setBookingOpen(true)} />

        <main>
          <SceneExterior onEnter={() => setIntro(false)} />

          <ManifestoChapter
            number="01"
            eyebrow="The Land"
            title={
              <>
                Shaped by the <em className="italic text-[#C6A35A]">weather</em>.<br />
                Held by the ground.
              </>
            }
            body="Every Home Modular house begins with a study of its site — light, wind, water, the slope of the field. What we build is the answer that landscape already knew."
            image={IMAGES.manifesto.land}
          />

          <SceneEntrance />

          <ManifestoChapter
            number="02"
            eyebrow="The Threshold"
            title={
              <>
                A door is a <em className="italic text-[#C6A35A]">promise</em>.<br />
                A quiet one.
              </>
            }
            body="The moment of arrival is designed with the same care as the kitchen. Timber that welcomes the hand, a threshold that softens the light, an interior air that already feels lived-in."
            image={IMAGES.manifesto.threshold}
            reversed
          />

          <SceneKitchen />

          <EditorialMarquee
            words={["Crafted in Ireland", "Modular", "Timeless", "Quietly Assembled"]}
            tone="light"
          />

          <SceneLivingRoom />

          <ManifestoChapter
            number="03"
            eyebrow="The Craft"
            title={
              <>
                Assembled in a <em className="italic text-[#C6A35A]">workshop</em>.<br />
                Delivered whole.
              </>
            }
            body="Weather-controlled construction, exacting tolerances, materials chosen with time in mind. Your house arrives already itself — and the field remains almost untouched."
            image={IMAGES.manifesto.craft}
          />

          <SceneExitCTA onBook={() => setBookingOpen(true)} />
        </main>

        <BookingDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
      </div>
    </AudioProvider>
  );
}
