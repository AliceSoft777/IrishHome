/**
 * CameraController — the single source of truth for the virtual camera.
 *
 * Camera state:
 *   z         world position along the walk (0 .. worldDepth)
 *   x, y      lateral/vertical sway (organic, tiny)
 *   rotY      subtle yaw (organic head turn)
 *   progress  0..1 across the entire journey
 *
 * The controller is a pure JS class (no React) so it can be updated
 * imperatively at 60fps from the scroll ticker without re-renders.
 * Consumers subscribe with a callback that receives the state each tick.
 */
export class CameraController {
  constructor({ worldDepth = 12000 } = {}) {
    this.worldDepth = worldDepth;
    this.state = {
      z: 0,
      x: 0,
      y: 0,
      rotY: 0,
      rotX: 0,
      progress: 0,
      worldDepth,
    };
    this.subscribers = new Set();
    this._smoothed = 0;
  }

  /** Set raw progress from the scroll engine (0..1). Applies organic sway. */
  setProgress(rawProgress) {
    const p = clamp(rawProgress, 0, 1);
    const s = this.state;
    s.progress = p;
    s.z = p * this.worldDepth;

    // Organic camera physics — never teleport, always breathe.
    const t = p * Math.PI * 2;
    s.x = Math.sin(t * 3.4) * 4;
    s.y = Math.sin(t * 5.1) * 2.4;
    s.rotY = Math.sin(t * 1.7) * 0.28;
    s.rotX = Math.sin(t * 2.3) * 0.14;

    this._notify();
  }

  /** Ambient tick — called every RAF to advance idle breathing when scroll is still. */
  tick(deltaSec) {
    const s = this.state;
    // Very slight standing-still breath so the world never feels frozen.
    const idleT = performance.now() * 0.0004;
    s.x += Math.sin(idleT * 1.7) * 0.02;
    s.y += Math.sin(idleT * 2.3) * 0.02;
    this._notify();
    void deltaSec;
  }

  subscribe(cb) {
    this.subscribers.add(cb);
    cb(this.state);
    return () => this.subscribers.delete(cb);
  }

  _notify() {
    this.subscribers.forEach((cb) => cb(this.state));
  }
}

export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

/**
 * smoothStep — Hermite curve used for opacity fade at scene edges.
 * Returns 0 at edge0, 1 at edge1, smooth cubic in between.
 */
export function smoothStep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
