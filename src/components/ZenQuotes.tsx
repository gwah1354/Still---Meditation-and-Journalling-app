import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTES = [
  { text: "In stillness, you find yourself.", author: "" },
  { text: "Breathe in peace. Breathe out gratitude.", author: "" },
  { text: "The present moment is all you ever have.", author: "Eckhart Tolle" },
  { text: "Silence is not empty. It is full of answers.", author: "" },
  { text: "Let go of what was. Trust what is.", author: "" },
  { text: "You are not your thoughts. You are the awareness behind them.", author: "" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "The only way to live is to accept each minute as an unrepeatable miracle.", author: "Tara Brach" },
  { text: "Nothing ever happened in the past; it all happened now.", author: "Ram Dass" },
];

export default function ZenQuotes() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const quote = QUOTES[index]!;

  return (
    <div
      className="text-center py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-20 sm:h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute px-4"
          >
            <p className="text-base sm:text-lg font-light italic text-white/40 tracking-wide leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            {quote.author && (
              <p className="text-xs text-gray-600 mt-2 tracking-wider">
                — {quote.author}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
