import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AUDIO } from "../data/assets";

const AudioContext = createContext(null);

/**
 * Modular ambient audio manager.
 *  - Muted by default. Never autoplays.
 *  - Cross-fades between scenes when unmuted.
 *  - Scene id -> track mapping is data-driven.
 */
const SCENE_TRACK = {
  exterior: "ambientCountryside",
  entrance: "ambientCountryside",
  kitchen: "ambientInterior",
  living: "ambientInterior",
  exit: "ambientCountryside",
};

export function AudioProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  const [scene, setScene] = useState("exterior");
  const audiosRef = useRef({});

  useEffect(() => {
    const audios = {};
    Object.entries(AUDIO).forEach(([key, src]) => {
      const el = new Audio(src);
      el.loop = true;
      el.volume = 0;
      el.preload = "none";
      audios[key] = el;
    });
    audiosRef.current = audios;
    return () => {
      Object.values(audiosRef.current).forEach((el) => {
        el.pause();
        el.src = "";
      });
    };
  }, []);

  useEffect(() => {
    const trackKey = SCENE_TRACK[scene];
    const audios = audiosRef.current;
    if (!audios || !trackKey) return;

    Object.entries(audios).forEach(([key, el]) => {
      if (key === trackKey && enabled) {
        el.play().catch(() => {});
        fadeVolume(el, 0.35, 1200);
      } else {
        fadeVolume(el, 0, 800, () => el.pause());
      }
    });
  }, [scene, enabled]);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      scene,
      setScene,
      toggle: () => setEnabled((v) => !v),
    }),
    [enabled, scene]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

function fadeVolume(el, target, duration, onDone) {
  const start = el.volume;
  const startTime = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - startTime) / duration);
    el.volume = start + (target - start) * t;
    if (t < 1) requestAnimationFrame(step);
    else if (onDone) onDone();
  };
  requestAnimationFrame(step);
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
