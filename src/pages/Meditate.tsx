import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import GlassButton from "../components/GlassButton";
import ZenQuotes from "../components/ZenQuotes";
import {
  AMBIENT_SOUNDS,
  playAmbientSound,
  stopAmbientSound,
  setVolume,
  type AmbientSound,
} from "../lib/ambientSounds";

const DURATIONS = [
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
  { label: "15 min", value: 900 },
  { label: "20 min", value: 1200 },
  { label: "30 min", value: 1800 },
];

type BreathPhase = "inhale" | "hold-in" | "exhale" | "hold-out";

export default function Meditate() {
  const [duration, setDuration] = useState(300);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedSound, setSelectedSound] = useState<AmbientSound>("silence");
  const [volumeLevel, setVolumeLevel] = useState(50);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("exhale");
  const [breathProgress, setBreathProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current + elapsedRef.current;
        const remaining = Math.max(0, duration - Math.floor(elapsed / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsActive(false);
          setIsComplete(true);
          stopAmbientSound();
        }
      }, 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      elapsedRef.current = duration - timeLeft;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, duration]);

  // Breathing animation - cycles through phases
  const breathAnimRef = useRef<number>(0);
  const breathStartRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) {
      setBreathPhase("exhale");
      setBreathProgress(0);
      return;
    }

    const PHASES: BreathPhase[] = ["inhale", "hold-in", "exhale", "hold-out"];
    const PHASE_DURATION: Record<BreathPhase, number> = {
      "inhale": 4000,
      "hold-in": 2000,
      "exhale": 4000,
      "hold-out": 2000,
    };

    breathStartRef.current = performance.now();
    let currentPhase = 0;

    const animate = (now: number) => {
      const elapsed = now - breathStartRef.current;
      const phase = PHASES[currentPhase]!;
      const duration = PHASE_DURATION[phase];
      const p = Math.min(elapsed / duration, 1);

      setBreathPhase(phase);
      setBreathProgress(p);

      if (p >= 1) {
        currentPhase = (currentPhase + 1) % PHASES.length;
        breathStartRef.current = now;
      }

      breathAnimRef.current = requestAnimationFrame(animate);
    };

    breathAnimRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(breathAnimRef.current);
  }, [isActive]);

  // Calculate timer ring scale based on breath phase
  const getTimerScale = () => {
    if (!isActive) return 1;
    if (breathPhase === "inhale") return 0.85 + breathProgress * 0.15;
    if (breathPhase === "hold-in") return 1;
    if (breathPhase === "exhale") return 1 - breathProgress * 0.15;
    return 0.85; // hold-out
  };

  const handleStart = useCallback(() => {
    if (timeLeft <= 0) {
      setTimeLeft(duration);
      elapsedRef.current = 0;
    }
    setIsActive(true);
    setIsComplete(false);
    if (selectedSound !== "silence") {
      playAmbientSound(selectedSound, volumeLevel / 100);
    }
  }, [duration, timeLeft, selectedSound, volumeLevel]);

  const handlePause = useCallback(() => {
    setIsActive(false);
    stopAmbientSound();
  }, []);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setIsComplete(false);
    setTimeLeft(duration);
    elapsedRef.current = 0;
    stopAmbientSound();
  }, [duration]);

  const handleSoundChange = useCallback(
    (sound: AmbientSound) => {
      setSelectedSound(sound);
      if (isActive && sound !== "silence") {
        playAmbientSound(sound, volumeLevel / 100);
      }
    },
    [isActive, volumeLevel],
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setVolumeLevel(val);
      setVolume(val / 100);
    },
    [],
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;
  const timerScale = getTimerScale();

  const breathLabel =
    breathPhase === "inhale" ? "Breathe In" :
    breathPhase === "hold-in" ? "Hold" :
    breathPhase === "exhale" ? "Breathe Out" :
    "Rest";

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-wider mb-2">
            Meditate
          </h1>
          <p className="text-sm text-gray-500">Find your stillness</p>
        </motion.div>

        {/* Zen Quotes */}
        <div className="mb-4">
          <ZenQuotes />
        </div>

        {/* Timer - just the ring with breathing animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mb-8"
        >
          {/* Breathing timer ring - NO box, just the SVG */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-4">
            {/* The ring SVG that scales with breathing */}
            <motion.div
              animate={{ scale: timerScale }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 288 288"
              >
                {/* Background track */}
                <circle
                  cx="144"
                  cy="144"
                  r="130"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1.5"
                />
                {/* Progress arc */}
                <motion.circle
                  cx="144"
                  cy="144"
                  r="130"
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 130}
                  strokeDashoffset={2 * Math.PI * 130 * (1 - progress)}
                  transition={{ duration: 0.1 }}
                />
              </svg>
            </motion.div>

            {/* Center time display - also scales with breathing */}
            <motion.div
              animate={{ scale: timerScale }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="text-center z-10"
            >
              <motion.div
                key={timeLeft}
                initial={{ opacity: 0.8, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl sm:text-6xl font-light tracking-[0.1em] text-white tabular-nums"
              >
                {String(minutes).padStart(2, "0")}
                <span className="text-amber-500/30 mx-1">:</span>
                {String(seconds).padStart(2, "0")}
              </motion.div>
              <div className="text-xs text-gray-500 tracking-widest uppercase mt-2">
                {isComplete ? "Complete" : isActive ? breathLabel : "Ready"}
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {isActive ? (
              <GlassButton onClick={handlePause} variant="primary" size="lg">
                <Pause size={18} />
                Pause
              </GlassButton>
            ) : (
              <GlassButton
                onClick={handleStart}
                variant="primary"
                size="lg"
                disabled={timeLeft <= 0 && !isComplete}
              >
                <Play size={18} />
                {isComplete ? "Start New" : "Start"}
              </GlassButton>
            )}
            <GlassButton onClick={handleReset} size="lg">
              <RotateCcw size={16} />
            </GlassButton>
          </div>
        </motion.div>

        {/* Duration selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-sm text-gray-400 tracking-wider mb-3 text-center">
            Duration
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {DURATIONS.map((d) => (
              <GlassButton
                key={d.value}
                onClick={() => {
                  setDuration(d.value);
                  setTimeLeft(d.value);
                  setIsActive(false);
                  setIsComplete(false);
                  elapsedRef.current = 0;
                  stopAmbientSound();
                }}
                active={duration === d.value}
                size="sm"
                disabled={isActive}
              >
                {d.label}
              </GlassButton>
            ))}
          </div>
        </motion.div>

        {/* Ambient sound selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm text-gray-400 tracking-wider mb-3 text-center">
            Ambient Sound
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {AMBIENT_SOUNDS.map((sound) => (
              <button
                key={sound.id}
                onClick={() => handleSoundChange(sound.id)}
                className={`
                  glass glass-hover flex flex-col items-center gap-1 py-3 px-2 rounded-xl
                  transition-all duration-200 text-xs
                  ${
                    selectedSound === sound.id
                      ? "border-amber-500/30 bg-white/10 shadow-[0_0_15px_rgba(251,191,36,0.08)]"
                      : ""
                  }
                `}
              >
                <span className="text-lg">{sound.icon}</span>
                <span
                  className={`text-[10px] tracking-wider ${
                    selectedSound === sound.id
                      ? "text-amber-300"
                      : "text-gray-500"
                  }`}
                >
                  {sound.label}
                </span>
              </button>
            ))}
          </div>

          {/* Volume slider */}
          {selectedSound !== "silence" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 flex items-center gap-3 justify-center"
            >
              <span className="text-xs text-gray-500">Vol</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeLevel}
                onChange={handleVolumeChange}
                className="w-40 h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400
                  [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(251,191,36,0.3)]"
              />
              <span className="text-xs text-gray-400 w-8">{volumeLevel}%</span>
            </motion.div>
          )}
        </motion.div>

        {/* Completion message */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-10 text-center"
            >
              <div className="glass inline-block px-6 py-4 rounded-2xl">
                <p className="text-amber-400/80 text-sm tracking-wider">
                  ✦ Session complete. You were still. ✦
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
