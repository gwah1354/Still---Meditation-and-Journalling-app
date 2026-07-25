import { useMemo } from "react";

interface JournalEntry {
  date: string; // YYYY-MM-DD
  content: string;
  mood: number;
}

export function useStreak(entries: JournalEntry[]) {
  return useMemo(() => {
    if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const dateSet = new Set(entries.map((e) => e.date));
    const sortedDates = Array.from(dateSet).sort().reverse();

    // Calculate current streak (from today backwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    const todayStr = formatDate(today);
    const index = sortedDates.indexOf(todayStr);

    if (index !== -1) {
      currentStreak = 1;
      for (let i = index + 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]!);
        const currDate = new Date(sortedDates[i]!);
        const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
        if (Math.round(diffDays) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      // Check if yesterday has entry for streak continuity
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDate(yesterday);
      const yIndex = sortedDates.indexOf(yesterdayStr);
      if (yIndex !== -1) {
        currentStreak = 1;
        for (let i = yIndex + 1; i < sortedDates.length; i++) {
          const prevDate = new Date(sortedDates[i - 1]!);
          const currDate = new Date(sortedDates[i]!);
          const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
          if (Math.round(diffDays) === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]!);
      const currDate = new Date(sortedDates[i]!);
      const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diffDays) === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }, [entries]);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
