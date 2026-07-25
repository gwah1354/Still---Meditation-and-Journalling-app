export type AmbientSound = "rain" | "ocean" | "forest" | "white-noise" | "wind" | "fireplace" | "silence";

interface SoundEngine {
  node: AudioNode | null;
  stop: () => void;
}

interface ActiveEngine {
  type: AmbientSound;
  engine: SoundEngine;
  gainNode: GainNode | null;
}

let audioContext: AudioContext | null = null;
let activeEngine: ActiveEngine | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// ─── Rain: Pink noise with amplitude modulation ───
function createRain(ctx: AudioContext, gain: number): SoundEngine {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate pink noise (Voss-McCartney algorithm)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3500;
  filter.Q.value = 0.5;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.25;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.12;
  const modGain = ctx.createGain();
  modGain.gain.value = gain;

  lfo.connect(lfoGain);
  lfoGain.connect(modGain.gain);
  source.connect(filter);
  filter.connect(modGain);

  source.start(0);
  lfo.start();

  return {
    node: modGain,
    stop: () => {
      try { source.stop(); } catch { /* already stopped */ }
      try { lfo.stop(); } catch { /* already stopped */ }
    },
  };
}

// ─── Ocean Waves ───
function createOcean(ctx: AudioContext, gain: number): SoundEngine {
  const bufferSize = ctx.sampleRate * 6;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    const wave = Math.sin(t * 0.15) * 0.5 + 0.5;
    const noise = (Math.random() * 2 - 1) * wave;
    data[i] = noise * 0.3;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  filter.Q.value = 0.7;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.4;
  const mainGain = ctx.createGain();
  mainGain.gain.value = gain;

  lfo.connect(lfoGain);
  lfoGain.connect(mainGain.gain);
  source.connect(filter);
  filter.connect(mainGain);

  source.start(0);
  lfo.start();

  return {
    node: mainGain,
    stop: () => {
      try { source.stop(); } catch { /* */ }
      try { lfo.stop(); } catch { /* */ }
    },
  };
}

// ─── Forest ───
function createForest(ctx: AudioContext, gain: number): SoundEngine {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    const rustle = (Math.random() * 2 - 1) * 0.15;
    const chirp = Math.sin(t * 800 + Math.sin(t * 5) * 3) *
      Math.max(0, Math.sin(t * 2)) * 0.08;
    data[i] = rustle + chirp;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2000;
  filter.Q.value = 0.3;

  const mainGain = ctx.createGain();
  mainGain.gain.value = gain;

  source.connect(filter);
  filter.connect(mainGain);

  source.start(0);

  return {
    node: mainGain,
    stop: () => {
      try { source.stop(); } catch { /* */ }
    },
  };
}

// ─── White Noise ───
function createWhiteNoise(ctx: AudioContext, gain: number): SoundEngine {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const mainGain = ctx.createGain();
  mainGain.gain.value = gain;

  source.connect(mainGain);
  source.start(0);

  return {
    node: mainGain,
    stop: () => {
      try { source.stop(); } catch { /* */ }
    },
  };
}

// ─── Wind ───
function createWind(ctx: AudioContext, gain: number): SoundEngine {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;
  filter.Q.value = 0.5;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.1;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const mainGain = ctx.createGain();
  mainGain.gain.value = gain;

  source.connect(filter);
  filter.connect(mainGain);

  source.start(0);
  lfo.start();

  return {
    node: mainGain,
    stop: () => {
      try { source.stop(); } catch { /* */ }
      try { lfo.stop(); } catch { /* */ }
    },
  };
}

// ─── Fireplace ───
function createFireplace(ctx: AudioContext, gain: number): SoundEngine {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    const crackle = Math.random() < 0.012 ? (Math.random() * 2 - 1) * 0.8 : 0;
    const rumble = (Math.random() * 2 - 1) * 0.08;
    const pop = Math.sin(t * 600 + Math.sin(t * 20) * 2) *
      Math.max(0, Math.sin(t * 3)) * 0.06;
    data[i] = crackle + rumble + pop;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 500;
  filter.Q.value = 0.5;

  const mainGain = ctx.createGain();
  mainGain.gain.value = gain;

  source.connect(filter);
  filter.connect(mainGain);
  source.start(0);

  return {
    node: mainGain,
    stop: () => {
      try { source.stop(); } catch { /* */ }
    },
  };
}

// ─── Public API ───

export const AMBIENT_SOUNDS: { id: AmbientSound; label: string; icon: string }[] = [
  { id: "rain", label: "Rain", icon: "🌧" },
  { id: "ocean", label: "Ocean", icon: "🌊" },
  { id: "forest", label: "Forest", icon: "🌲" },
  { id: "white-noise", label: "White Noise", icon: "📡" },
  { id: "wind", label: "Wind", icon: "💨" },
  { id: "fireplace", label: "Fireplace", icon: "🔥" },
  { id: "silence", label: "Silence", icon: "🔇" },
];

const soundBuilders: Record<AmbientSound, (ctx: AudioContext, gain: number) => SoundEngine> = {
  "rain": createRain,
  "ocean": createOcean,
  "forest": createForest,
  "white-noise": createWhiteNoise,
  "wind": createWind,
  "fireplace": createFireplace,
  "silence": (_ctx: AudioContext, _gain: number) => ({
    node: null,
    stop: () => {},
  }),
};

export function playAmbientSound(type: AmbientSound, volume: number = 0.5) {
  stopAmbientSound();

  if (type === "silence") return;

  const ctx = getContext();
  const gain = Math.max(0, Math.min(1, volume)) * 0.8;
  const engine = soundBuilders[type](ctx, gain);

  activeEngine = { type, engine, gainNode: engine.node as GainNode | null };
  if (activeEngine.gainNode) {
    activeEngine.gainNode.connect(ctx.destination);
  }
}

export function stopAmbientSound() {
  if (activeEngine) {
    activeEngine.engine.stop();
    activeEngine = null;
  }
}

export function setVolume(volume: number) {
  if (activeEngine?.gainNode) {
    activeEngine.gainNode.gain.value = Math.max(0, Math.min(1, volume)) * 0.8;
  }
}

export function getActiveSound(): AmbientSound | null {
  return activeEngine?.type ?? null;
}
