import { createContext, useContext, useMemo } from "react";
import { CameraController } from "./CameraController";

const CameraContext = createContext(null);

export function CameraProvider({ worldDepth, children }) {
  const camera = useMemo(() => new CameraController({ worldDepth }), [worldDepth]);
  return <CameraContext.Provider value={camera}>{children}</CameraContext.Provider>;
}

export function useCamera() {
  const camera = useContext(CameraContext);
  if (!camera) throw new Error("useCamera must be used inside <CameraProvider>");
  return camera;
}
