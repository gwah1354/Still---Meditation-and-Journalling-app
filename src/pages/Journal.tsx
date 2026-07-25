import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Flame,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import GlassButton from "../components/GlassButton";
import MoodSelector from "../components/MoodSelector";
import WritingPrompts from "../components/WritingPrompts";
import {
  getAllEntries,
  getEntry,
  saveEntry,
  type JournalEntry,
} from "../lib/journalStore";
import { useStreak } from "../hooks/useStreak";

export default function Journal() {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [isToday, setIsToday] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const allEntries = getAllEntries();
  const { currentStreak, longestStreak } = useStreak(allEntries);

  // Check if viewing today
  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setIsToday(currentDate === today);
  }, [currentDate]);

  // Load entry for current date
  useEffect(() => {
    const entry = getEntry(currentDate);
    if (entry) {
      setContent(entry.content);
      setMood(entry.mood);
    } else {
      setContent("");
      setMood(3);
    }
    setIsLoaded(true);
  }, [currentDate]);

  // Auto-save on content change (debounced)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback(
    (text: string, m: number) => {
      if (!isToday) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        if (text.trim()) {
          const existing = getEntry(currentDate);
          saveEntry({
            date: currentDate,
            content: text,
            mood: m,
            createdAt: existing?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
          });
        }
      }, 1000);
    },
    [currentDate, isToday],
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setContent(text);
      autoSave(text, mood);
    },
    [autoSave, mood],
  );

  const handleMoodChange = useCallback(
    (m: number) => {
      setMood(m);
      autoSave(content, m);
    },
    [autoSave, content],
  );

  const handleSave = useCallback(() => {
    if (!content.trim()) {
      toast.error("Write something before saving");
      return;
    }
    setIsSaving(true);
    saveEntry({
      date: currentDate,
      content,
      mood,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setTimeout(() => {
      setIsSaving(false);
      // Clear everything after save so user can start fresh
      setContent("");
      setMood(3);
      setSaveCount((c) => c + 1);
      toast.success("Entry saved", {
        description: "Your thoughts are safe. Start a new entry below.",
        duration: 2000,
      });
      textareaRef.current?.focus();
    }, 300);
  }, [content, currentDate, mood]);

  const handleNewEntry = useCallback(() => {
    setContent("");
    setMood(3);
    textareaRef.current?.focus();
  }, []);

  const navigateDate = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const d = new Date(prev + "T00:00:00");
      d.setDate(d.getDate() + (direction === "prev" ? -1 : 1));
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });
  }, []);

  const formattedDate = new Date(currentDate + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  const charCount = content.length;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="glass inline-flex items-center gap-4 px-5 py-3 rounded-2xl">
            <Flame
              size={18}
              className={
                currentStreak > 0 ? "text-amber-400" : "text-gray-600"
              }
            />
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-medium text-white">
                {currentStreak}
              </span>
              <span className="text-xs text-gray-500">day streak</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-400">
                {longestStreak}
              </span>
              <span className="text-xs text-gray-600">best</span>
            </div>
          </div>
        </motion.div>

        {/* Date Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => navigateDate("prev")}
            className="glass glass-hover p-2.5 rounded-xl transition-all duration-200"
          >
            <ChevronLeft size={18} className="text-gray-400" />
          </button>

          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-light text-white tracking-wide">
              {formattedDate}
            </h2>
            {isToday && (
              <span className="text-[10px] text-amber-400/60 uppercase tracking-widest">
                Today
              </span>
            )}
          </div>

          <button
            onClick={() => navigateDate("next")}
            disabled={isToday}
            className="glass glass-hover p-2.5 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </motion.div>

        {/* New Entry button (only when there's content) */}
        {content.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <GlassButton onClick={handleNewEntry} variant="ghost" size="sm">
              <FileText size={14} />
              New Entry
            </GlassButton>
          </motion.div>
        )}

        {/* Writing Prompts */}
        <WritingPrompts
          onSelectPrompt={(prompt) => {
            setContent((prev) => (prev ? prev + "\n\n" + prompt : prompt));
          }}
        />

        {/* Journal Entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-4 sm:p-6 mb-4"
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder="What's on your mind today?"
            className="w-full min-h-[250px] sm:min-h-[300px] bg-transparent text-white placeholder-gray-600 resize-none outline-none text-sm leading-relaxed"
          />
          <div className="text-xs text-gray-600 mt-2 text-right tabular-nums">
            {charCount} characters
          </div>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass p-4 sm:p-6 mb-6"
        >
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">
            How are you feeling?
          </h3>
          <MoodSelector value={mood} onChange={handleMoodChange} />
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <GlassButton
            onClick={handleSave}
            variant="primary"
            size="lg"
            disabled={!isToday || !content.trim()}
          >
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.span
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  ✦
                </motion.span>
              ) : (
                <Save size={16} key="save" />
              )}
            </AnimatePresence>
            {isSaving ? "Saved!" : "Save Entry"}
          </GlassButton>
        </motion.div>
      </div>
    </div>
  );
}
