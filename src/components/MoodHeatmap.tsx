import { useMemo } from "react";
import { motion } from "framer-motion";
import { getAllEntries } from "../lib/journalStore";

const MOOD_COLORS: Record<number, string> = {
  1: "rgba(239, 68, 68, 0.6)",
  2: "rgba(251, 146, 60, 0.6)",
  3: "rgba(250, 204, 21, 0.5)",
  4: "rgba(74, 222, 128, 0.5)",
  5: "rgba(96, 165, 250, 0.5)",
};

const MOOD_EMPTY = "rgba(255, 255, 255, 0.04)";

export default function MoodHeatmap() {
  const { weeks, monthLabels, stats } = useMemo(() => {
    const entries = getAllEntries();
    const moodMap = new Map<string, number>();
    entries.forEach((e) => moodMap.set(e.date, e.mood));

    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Build grid: 53 weeks x 7 days
    const weeks: { date: string; mood: number | null }[][] = [];
    const monthLabels: { label: string; weekIndex: number }[] = [];

    let cursor = new Date(oneYearAgo);
    // Go back to Sunday
    cursor.setDate(cursor.getDate() - cursor.getDay());

    let currentMonth = -1;

    for (let w = 0; w < 53; w++) {
      const week: { date: string; mood: number | null }[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = formatDate(cursor);
        const mood = moodMap.get(dateStr) ?? null;
        week.push({ date: dateStr, mood });

        // Track month labels
        if (cursor.getMonth() !== currentMonth) {
          currentMonth = cursor.getMonth();
          if (w > 0 && d === 0) {
            monthLabels.push({
              label: cursor.toLocaleDateString("en-US", { month: "short" }),
              weekIndex: w,
            });
          } else if (w === 0) {
            monthLabels.push({
              label: cursor.toLocaleDateString("en-US", { month: "short" }),
              weekIndex: w,
            });
          }
        }

        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    // Stats
    const totalEntries = entries.length;
    const avgMood =
      totalEntries > 0
        ? (entries.reduce((s, e) => s + e.mood, 0) / totalEntries).toFixed(1)
        : "—";

    return { weeks, monthLabels, stats: { totalEntries, avgMood } };
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Month labels */}
        <div className="flex ml-8 mb-1 gap-[3px]">
          {monthLabels.map((m) => (
            <div
              key={m.weekIndex}
              className="text-[9px] text-gray-600 tracking-wider uppercase"
              style={{ marginLeft: m.weekIndex === 0 ? 0 : undefined }}
            >
              {/* Position roughly near the right week */}
            </div>
          ))}
          <div className="flex gap-[3px]">
            {monthLabels.map((m, i) => {
              const pos = m.weekIndex;
              const nextPos = monthLabels[i + 1]?.weekIndex ?? 53;
              const span = nextPos - pos;
              return (
                <div
                  key={m.weekIndex}
                  className="text-[9px] text-gray-600 tracking-wider uppercase pt-1"
                  style={{ width: span * 14 - 3 }}
                >
                  {m.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1">
            {["Mon", "", "Wed", "", "Fri", ""].map((day, i) => (
              <div
                key={i}
                className="h-3 text-[9px] text-gray-600 leading-3"
                style={{ marginTop: i === 0 ? 0 : undefined }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Columns (weeks) */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (wi + di) * 0.002, duration: 0.3 }}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: day.mood
                      ? MOOD_COLORS[day.mood] ?? MOOD_EMPTY
                      : MOOD_EMPTY,
                  }}
                  title={
                    day.mood
                      ? `${day.date}: Mood ${day.mood}/5`
                      : day.date
                  }
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-600">
          <span>Less</span>
          {[null, 1, 2, 3, 4, 5].map((m) => (
            <div
              key={m ?? "empty"}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: m ? MOOD_COLORS[m] ?? MOOD_EMPTY : MOOD_EMPTY,
              }}
            />
          ))}
          <span>More</span>
          <div className="flex-1" />
          <span>{stats.totalEntries} entries · Avg {stats.avgMood}/5</span>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
