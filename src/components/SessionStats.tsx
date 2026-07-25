import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getAllEntries } from "../lib/journalStore";
import { useStreak } from "../hooks/useStreak";
import { BookOpen, Flame, Sparkles, TrendingUp } from "lucide-react";

function AnimatedCounter({
  value,
  label,
  icon,
  color,
  delay = 0,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass p-4 sm:p-5 rounded-xl text-center flex flex-col items-center gap-2"
    >
      <div className="text-2xl sm:text-3xl font-light text-white tabular-nums">
        {displayed}
      </div>
      <div className="flex items-center gap-1.5">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs text-gray-400 tracking-wider">{label}</span>
      </div>
    </motion.div>
  );
}

export default function SessionStats() {
  const allEntries = getAllEntries();
  const { currentStreak, longestStreak } = useStreak(allEntries);

  const totalEntries = allEntries.length;
  const totalWords = allEntries.reduce(
    (sum, e) => sum + e.content.split(/\s+/).filter(Boolean).length,
    0,
  );
  const avgMood =
    totalEntries > 0
      ? allEntries.reduce((s, e) => s + e.mood, 0) / totalEntries
      : 0;

  return (
    <div>
      <h3 className="text-center text-sm text-gray-400 tracking-wider mb-6">
        Your Journey So Far
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <AnimatedCounter
          value={totalEntries}
          label="Entries"
          icon={<BookOpen size={12} />}
          color="rgba(96, 165, 250, 0.6)"
          delay={0}
        />
        <AnimatedCounter
          value={currentStreak}
          label="Day Streak"
          icon={<Flame size={12} />}
          color="rgba(251, 191, 36, 0.6)"
          delay={0.1}
        />
        <AnimatedCounter
          value={longestStreak}
          label="Best Streak"
          icon={<TrendingUp size={12} />}
          color="rgba(74, 222, 128, 0.6)"
          delay={0.2}
        />
        <AnimatedCounter
          value={totalWords}
          label="Total Words"
          icon={<Sparkles size={12} />}
          color="rgba(251, 146, 60, 0.6)"
          delay={0.3}
        />
      </div>
      {avgMood > 0 && (
        <p className="text-center text-xs text-gray-600 mt-4">
          Average mood: {avgMood.toFixed(1)} / 5
        </p>
      )}
    </div>
  );
}
