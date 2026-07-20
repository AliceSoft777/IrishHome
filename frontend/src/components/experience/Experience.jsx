import { useState } from "react";
import { Toaster } from "sonner";
import { AudioProvider } from "../../hooks/useAudio";
import { IMAGES } from "../../data/assets";
import {
  CameraProvider,
  ScrollEngine,
  SceneManager,
  WORLD,
  WORLD_DEPTH,
} from "../../engine";

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
 * Experience — the composition root.
 *
 * The Experience owns nothing but orchestration:
 *   • CameraProvider     — the virtual camera state (x, y, z, rotation)
 *   • ScrollEngine       — the single scroll → camera bridge
 *   • SceneManager       — the fixed-camera stage that hosts every scene
 *
 * Scenes are declared in world Z order. Adjacent worldZ ranges overlap
 * slightly so the crossfade between rooms is continuous, not sectioned.
 * Adding a future room (Bedroom, Bathroom, Dining) means:
 *   1. Extend WORLD in /engine/world.js
 *   2. Drop a new <SceneXxxx /> into the SceneManager tree below
 * No engine code changes.
 */
export default function Experience() {
  const [intro, setIntro] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <CameraProvider worldDepth={WORLD_DEPTH}>
      <div id="top" className="relative bg-[#FAF8F5] text-[#151515]">
        {/* Global overlays */}
        <div className="hm-grain" aria-hidden="true" />
        <CustomCursor />

        <AudioProvider>
          <Toaster position="bottom-center" theme="light" />

          {intro && <IntroSequence onDone={() => setIntro(false)} />}
          <GlassNav onBook={() => setBookingOpen(true)} />

          {/* One and only scroll listener. Publishes to camera. */}
          <ScrollEngine />

          {/* The fixed camera stage + scroll spacer. */}
          <SceneManager worldDepth={WORLD_DEPTH} scrollLengthVh={900}>
            <SceneExterior />

            <ManifestoChapter
              worldZ={WORLD.manifesto1.worldZ}
              depth={WORLD.manifesto1.depth}
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
              worldZ={WORLD.manifesto2.worldZ}
              depth={WORLD.manifesto2.depth}
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
              worldZ={WORLD.marquee.worldZ}
              depth={WORLD.marquee.depth}
              words={["Crafted in Ireland", "Modular", "Timeless", "Quietly Assembled"]}
              tone="light"
            />

            <SceneLivingRoom />

            <ManifestoChapter
              worldZ={WORLD.manifesto3.worldZ}
              depth={WORLD.manifesto3.depth}
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
          </SceneManager>

          <BookingDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </AudioProvider>
      </div>
    </CameraProvider>
  );
}
