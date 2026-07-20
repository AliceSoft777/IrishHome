/**
 * CameraController — the single source of truth for the virtual camera.
 *
 * Camera state:
 *   z          world position along the walk (0 .. worldDepth)
 *   x, y       lateral/vertical sway (organic, breathing)
 *   rotY/rotX  subtle head turn / nod
 *   progress   0..1 across the entire journey (smoothed, post-inertia)
 *   velocity   current Z velocity in world-units per tick (for momentum FX)
 *   forward    small px push applied to the whole stage under motion
 *
 * Two-stage smoothing pipeline:
 *   scroll → _target (raw) → _current (inertial, ease-in-out) → warpZ → z
 *
 * warpZ() maps _current progress to world-Z through anchor points, spending
 * more scroll in front of focal chapters (entrance & kitchen). The camera
 * therefore decelerates when a room opens up and accelerates through
 * transitional stretches — a real dolly operator carrying weight.
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
      velocity: 0,
      forward: 0,
      worldDepth,
    };
    this.subscribers = new Set();

    // Two-stage progress smoothing.
    this._target = 0;
    this._current = 0;

    // Momentum / velocity tracking.
    this._lastZ = 0;
    this._velocity = 0; // z per frame, smoothed
  }

  /**
   * Push a new target from the scroll engine.
   * The camera will lerp towards it with cinematic inertia inside tick().
   */
  setTargetProgress(rawProgress) {
    this._target = clamp(rawProgress, 0, 1);
  }

  /**
   * Advance the camera. Called every RAF from the scroll engine.
   * `deltaSec` is used for frame-rate independence.
   */
  tick(deltaSec = 1 / 60) {
    // Inertia: cinema-camera weight. Slower catch-up = more inertial.
    // Frame-rate independent lerp (target rate ~7Hz corner freq).
    const dt = Math.min(deltaSec, 0.05);
    const inertia = 1 - Math.exp(-dt * 7.5);
    this._current += (this._target - this._current) * inertia;
    if (Math.abs(this._target - this._current) < 1e-6) {
      this._current = this._target;
    }

    // Warped Z with focal-point dwell.
    const z = warpZ(this._current) * this.worldDepth;
    const rawVelocity = z - this._lastZ;
    this._lastZ = z;

    // Smoothed velocity used for forward-momentum FX.
    const velLerp = 1 - Math.exp(-dt * 4);
    this._velocity += (rawVelocity - this._velocity) * velLerp;

    const s = this.state;
    s.progress = this._current;
    s.z = z;
    s.velocity = this._velocity;

    // --- Organic camera physics: breathing + sway ---
    // Base clock — real time so the camera keeps living when scroll is idle.
    const now = performance.now();
    const t = now * 0.00075; // ~7.5 s per full breath cycle

    // Vertical breath — subtle, nearly imperceptible drift.
    const breath = Math.sin(t * 1.05) * 3.4 + Math.sin(t * 2.3) * 0.9;
    // Horizontal sway — two sines gently out of phase.
    const sway = Math.sin(t * 0.85) * 2.6 + Math.sin(t * 1.7) * 1.1;
    // Head rotation — very small yaw + occasional nod.
    const yaw = Math.sin(t * 0.72) * 0.18;
    const nod = Math.sin(t * 1.15) * 0.09;

    s.y = breath;
    s.x = sway;
    s.rotY = yaw;
    s.rotX = nod;

    // Forward-momentum push: when the camera is moving fast, the stage
    // eases forward a few pixels; when it slows, it settles back. Real
    // stabilizers show exactly this residual weight during dolly moves.
    s.forward = clamp(this._velocity * 0.05, -18, 18);

    this._notify();
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
 */
export function smoothStep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Anchor-based progress → world-Z warp.
 *
 * The camera dwells at focal chapters (entrance around 0.20–0.35 of scroll,
 * kitchen around 0.40–0.65 of scroll) and moves faster through transitions.
 * Each segment is interpolated with smoothstep for buttery, ease-in-out
 * pacing — the camera decelerates entering an anchor and accelerates leaving.
 *
 *   progress (0..1) → z fraction (0..1)
 */
const ANCHORS = [
  [0.00, 0.000], // start of exterior
  [0.10, 0.133], // end of exterior — fly-in
  [0.15, 0.208], // manifesto 01
  [0.20, 0.220], // arrive at entrance
  [0.35, 0.325], // linger through entrance (SLOW)
  [0.40, 0.400], // manifesto 02
  [0.52, 0.485], // enter the kitchen
  [0.65, 0.575], // dwell in the kitchen (SLOW)
  [0.72, 0.642], // marquee
  [0.85, 0.775], // living room
  [0.92, 0.850], // manifesto 03
  [1.00, 1.000], // pull back to horizon
];

function warpZ(progress) {
  const p = clamp(progress, 0, 1);
  for (let i = 1; i < ANCHORS.length; i++) {
    const [p0, z0] = ANCHORS[i - 1];
    const [p1, z1] = ANCHORS[i];
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0);
      const eased = t * t * (3 - 2 * t); // smoothstep
      return z0 + (z1 - z0) * eased;
    }
  }
  return 1;
}
