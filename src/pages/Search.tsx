import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, BookOpen, RefreshCw } from "lucide-react";
import GlassInput from "../components/GlassInput";
import JournalCard from "../components/JournalCard";
import MoodHeatmap from "../components/MoodHeatmap";
import { getAllEntries } from "../lib/journalStore";

const MOOD_OPTIONS = [
  { value: 0, label: "All moods", color: "gray" },
  { value: 1, label: "Turbulent", color: "rgb(239, 68, 68)" },
  { value: 2, label: "Low", color: "rgb(251, 146, 60)" },
  { value: 3, label: "Neutral", color: "rgb(250, 204, 21)" },
  { value: 4, label: "Good", color: "rgb(74, 222, 128)" },
  { value: 5, label: "Blissful", color: "rgb(96, 165, 250)" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Refresh data when tab becomes visible (user may have saved entries)
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) setRefreshKey((k) => k + 1);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Manual refresh button
  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const entries = useMemo(() => {
    let list = getAllEntries();

    // Text search
    if (query.trim()) {
      const lower = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.content.toLowerCase().includes(lower) ||
          e.date.includes(lower),
      );
    }

    // Mood filter
    if (moodFilter > 0) {
      list = list.filter((e) => e.mood === moodFilter);
    }

    // Sort
    list.sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortOrder === "newest" ? -cmp : cmp;
    });

    return list;
  }, [query, moodFilter, sortOrder, refreshKey]);

  const stats = useMemo(() => {
    const all = getAllEntries();
    const totalEntries = all.length;
    const avgMood =
      totalEntries > 0
        ? (all.reduce((sum, e) => sum + e.mood, 0) / totalEntries).toFixed(1)
        : "—";
    return { totalEntries, avgMood };
  }, [entries, refreshKey]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-wider mb-1">
            Archive
          </h1>
          <p className="text-sm text-gray-500">
            Explore your journal history
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="glass px-4 py-2 rounded-xl text-xs text-gray-400">
            {stats.totalEntries} entries
          </div>
          <div className="glass px-4 py-2 rounded-xl text-xs text-gray-400">
            Avg mood: {stats.avgMood}/5
          </div>
        </motion.div>

        {/* Toggle heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-4"
        >
          <button
            onClick={() => setShowHeatmap((h) => !h)}
            className={`glass text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
              showHeatmap ? "border-amber-500/30 bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {showHeatmap ? "Hide Mood Calendar" : "Show Mood Calendar"}
          </button>
        </motion.div>

        {/* Mood heatmap */}
        <AnimatePresence>
          {showHeatmap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <motion.div className="glass p-4 sm:p-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">
                  Mood Calendar
                </h3>
                <MoodHeatmap />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <GlassInput
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your journal entries..."
            icon={<SearchIcon size={16} />}
          />
        </motion.div>

        {/* Filter row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 mb-8 flex-wrap"
        >
          {/* Mood filter */}
          <div className="flex items-center gap-1 flex-wrap">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setMoodFilter(mood.value)}
                className={`
                  glass text-xs px-3 py-1.5 rounded-lg transition-all duration-200
                  ${
                    moodFilter === mood.value
                      ? "border-amber-500/30 bg-white/10 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }
                `}
              >
                {mood.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Sort toggle */}
          <button
            onClick={() =>
              setSortOrder((o) => (o === "newest" ? "oldest" : "newest"))
            }
            className="glass text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-300 transition-all duration-200"
          >
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="glass text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-300 transition-all duration-200"
          >
            <RefreshCw size={12} />
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {entries.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <BookOpen size={40} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 text-sm">
                {query || moodFilter > 0
                  ? "No entries match your search."
                  : "No journal entries yet. Start writing!"}
              </p>
            </motion.div>
          ) : (
            <motion.div key="results" className="space-y-3">
              {entries.map((entry, i) => (
                <JournalCard key={entry.date} entry={entry} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
