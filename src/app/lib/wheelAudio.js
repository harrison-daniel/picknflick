let audioCtx = null;
let unlocked = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function initAudio() {
  const ctx = getAudioContext();
  if (!ctx || unlocked) return;

  ctx.resume();

  const buf = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);

  unlocked = true;
}

export function playTick(volume = 0.12) {
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.value = 1200;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  osc.start(now);
  osc.stop(now + 0.02);
}

export function playDing() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  const gain = ctx.createGain();
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  [523, 784].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.connect(gain);
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.start(now);
    osc.stop(now + 0.4);
  });
}

const BY1 = 0.8,
  BY2 = 1.0,
  BX1 = 0.12,
  BX2 = 0.2;

function bezierY(t) {
  const mt = 1 - t;
  return 3 * mt * mt * t * BY1 + 3 * mt * t * t * BY2 + t * t * t;
}

function bezierX(t) {
  const mt = 1 - t;
  return 3 * mt * mt * t * BX1 + 3 * mt * t * t * BX2 + t * t * t;
}

function progressToTimeFraction(targetProgress) {
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 25; i++) {
    const mid = (lo + hi) / 2;
    if (bezierY(mid) < targetProgress) lo = mid;
    else hi = mid;
  }
  return bezierX((lo + hi) / 2);
}

export function scheduleTickSounds(
  totalRotationDelta,
  degreePerSlot,
  durationMs,
  offsetToFirstBoundary = 0,
) {
  const absDelta = Math.abs(totalRotationDelta);
  if (absDelta < degreePerSlot) return [];

  const crossings = [];
  let nextCrossing = offsetToFirstBoundary > 0 ? offsetToFirstBoundary : degreePerSlot;
  while (nextCrossing < absDelta && crossings.length < 300) {
    crossings.push(nextCrossing);
    nextCrossing += degreePerSlot;
  }

  if (crossings.length === 0) return [];

  const MIN_TICK_INTERVAL = 45;
  const timeouts = [];
  let lastTickMs = -MIN_TICK_INTERVAL;

  for (let i = 0; i < crossings.length; i++) {
    const progress = crossings[i] / absDelta;
    const timeFraction = progressToTimeFraction(progress);
    const timeMs = timeFraction * durationMs;

    if (timeMs - lastTickMs < MIN_TICK_INTERVAL) continue;

    lastTickMs = timeMs;
    const vol = 0.04 + 0.12 * (progress);

    const tid = setTimeout(() => playTick(vol), timeMs);
    timeouts.push(tid);
  }

  return timeouts;
}

export function clearTickSchedule(timeouts) {
  if (timeouts) timeouts.forEach(clearTimeout);
}
