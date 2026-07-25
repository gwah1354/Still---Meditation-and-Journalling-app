import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  duration: number; // in seconds
  isActive: boolean;
  onComplete: () => void;
  onTick: (remaining: number) => void;
}

export default function Timer({ duration, isActive, onComplete, onTick }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  // Reset when duration changes
  useEffect(() => {
    setTimeLeft(duration);
    elapsedRef.current = 0;
  }, [duration]);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current + elapsedRef.current;
        const remaining = Math.max(0, duration - Math.floor(elapsed / 1000));
        setTimeLeft(remaining);
        onTick(remaining);

        if (remaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onComplete();
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (duration > 0) {
        elapsedRef.current = duration - timeLeft;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate progress for circle
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex flex-col items-center">
      {/* Timer Display */}
      <div className="relative">
        {/* Background circle */}
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="2"
          />
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="rgba(251, 191, 36, 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transition={{ duration: 0.1 }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={timeLeft}
            initial={{ opacity: 0.8, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-7xl font-light tracking-[0.1em] text-white tabular-nums"
          >
            {String(minutes).padStart(2, "0")}
            <span className="text-amber-500/40 mx-1">:</span>
            {String(seconds).padStart(2, "0")}
          </motion.div>

          <motion.div
            className="text-xs text-gray-500 tracking-widest uppercase mt-2"
            animate={{ opacity: isActive ? [0.3, 0.6, 0.3] : 0.3 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {isActive ? "Meditating" : "Paused"}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
