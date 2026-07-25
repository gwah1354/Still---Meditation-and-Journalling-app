import { motion } from "framer-motion";

interface MoodSelectorProps {
  value: number;
  onChange: (mood: number) => void;
}

const MOOD_COLORS = [
  "rgb(239, 68, 68)",   // 1 - Red
  "rgb(251, 146, 60)",  // 2 - Orange
  "rgb(250, 204, 21)",  // 3 - Yellow
  "rgb(74, 222, 128)",  // 4 - Green
  "rgb(96, 165, 250)",  // 5 - Blue
];

const MOOD_LABELS = [
  "Turbulent",
  "Low",
  "Neutral",
  "Good",
  "Blissful",
];

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((mood) => {
          const isSelected = value === mood;
          const color = MOOD_COLORS[mood - 1]!;

          return (
            <button
              key={mood}
              onClick={() => onChange(mood)}
              className="relative flex flex-col items-center gap-2 group"
            >
              <motion.div
                className={`
                  relative rounded-full cursor-pointer
                  transition-all duration-300
                  ${isSelected ? "w-10 h-10 sm:w-12 sm:h-12" : "w-8 h-8 sm:w-10 sm:h-10"}
                `}
                style={{
                  backgroundColor: isSelected ? color : "rgba(255,255,255,0.06)",
                  boxShadow: isSelected ? `0 0 20px ${color}40` : "none",
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={isSelected ? {
                  scale: [1, 1.08, 1],
                } : {}}
                transition={{ duration: 0.3 }}
              >
                {/* Inner dot */}
                <div
                  className={`
                    absolute inset-0 rounded-full transition-all duration-300
                    ${isSelected ? "scale-[0.4]" : "scale-[0.25]"}
                  `}
                  style={{
                    backgroundColor: color,
                    opacity: isSelected ? 1 : 0.4,
                  }}
                />
                {/* Glow ring */}
                {isSelected && (
                  <motion.div
                    className="absolute -inset-1.5 rounded-full"
                    style={{
                      border: `1.5px solid ${color}60`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    layoutId="mood-ring"
                  />
                )}
              </motion.div>
              <span
                className={`
                  text-[10px] sm:text-xs font-medium transition-all duration-300
                  ${isSelected ? "text-white" : "text-gray-500"}
                `}
              >
                {mood}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current mood label */}
      {value > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-amber-400/70"
        >
          {MOOD_LABELS[value - 1]}
        </motion.p>
      )}
    </div>
  );
}
