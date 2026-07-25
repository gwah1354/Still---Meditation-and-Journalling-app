import { motion } from "framer-motion";
import type { JournalEntry } from "../lib/journalStore";

const MOOD_COLORS: Record<number, string> = {
  1: "rgb(239, 68, 68)",
  2: "rgb(251, 146, 60)",
  3: "rgb(250, 204, 21)",
  4: "rgb(74, 222, 128)",
  5: "rgb(96, 165, 250)",
};

interface JournalCardProps {
  entry: JournalEntry;
  index?: number;
  onClick?: () => void;
}

export default function JournalCard({ entry, index = 0, onClick }: JournalCardProps) {
  const date = new Date(entry.date + "T00:00:00");
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const preview = entry.content
    .replace(/<[^>]*>/g, "")
    .slice(0, 150)
    .trim();

  const moodColor = MOOD_COLORS[entry.mood] ?? "rgb(250, 204, 21)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      className={`
        glass glass-hover p-5 sm:p-6 cursor-pointer
        transition-all duration-300
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {/* Mood indicator */}
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: moodColor, boxShadow: `0 0 10px ${moodColor}60` }}
          />
          <time className="text-sm text-gray-400">{formattedDate}</time>
        </div>
      </div>

      {/* Content preview */}
      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
        {preview || "Empty entry..."}
      </p>

      {/* Word count */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] text-gray-600 uppercase tracking-wider">
          {entry.content.split(/\s+/).filter(Boolean).length} words
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-600" />
        <span className="text-[10px] text-gray-600 uppercase tracking-wider">
          Mood {entry.mood}/5
        </span>
      </div>
    </motion.div>
  );
}
