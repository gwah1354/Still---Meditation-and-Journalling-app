import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

const PROMPTS = [
  "What brought you peace today?",
  "Describe a moment you felt truly present.",
  "What are you grateful for right now?",
  "What's one thing you learned about yourself today?",
  "Write about a challenge you overcame recently.",
  "What does stillness mean to you?",
  "Describe your ideal morning ritual.",
  "What's weighing on your mind? Let it go here.",
  "What small joy did you experience today?",
  "If you could tell your future self one thing, what would it be?",
  "What's a memory that makes you smile?",
  "How does your body feel right now? Scan from head to toe.",
  "What's one intention you have for tomorrow?",
  "Write a letter to someone you appreciate.",
  "What fear are you ready to release?",
];

interface WritingPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function WritingPrompts({ onSelectPrompt }: WritingPromptsProps) {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % PROMPTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass px-4 py-3 rounded-xl mb-4"
    >
      <div className="flex items-start gap-3">
        <Lightbulb size={14} className="text-amber-400/60 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                onSelectPrompt(PROMPTS[index]!);
                setDismissed(true);
              }}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors text-left leading-relaxed cursor-pointer"
            >
              {PROMPTS[index]}
            </motion.button>
          </AnimatePresence>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-600 hover:text-gray-400 text-xs flex-shrink-0 transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
