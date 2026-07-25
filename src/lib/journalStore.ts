export interface JournalEntry {
  date: string; // YYYY-MM-DD
  content: string;
  mood: number; // 1-5
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "still-journal-entries";

export function getAllEntries(): JournalEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

export function getEntry(date: string): JournalEntry | null {
  const entries = getAllEntries();
  return entries.find((e) => e.date === date) ?? null;
}

export function saveEntry(entry: JournalEntry): void {
  const entries = getAllEntries();
  const index = entries.findIndex((e) => e.date === entry.date);
  const now = Date.now();

  if (index !== -1) {
    entries[index] = { ...entry, updatedAt: now };
  } else {
    entries.push({ ...entry, createdAt: now, updatedAt: now });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteEntry(date: string): void {
  const entries = getAllEntries().filter((e) => e.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function searchEntries(query: string): JournalEntry[] {
  const entries = getAllEntries();
  const lower = query.toLowerCase();
  return entries.filter(
    (e) =>
      e.content.toLowerCase().includes(lower) ||
      e.date.includes(lower),
  );
}

export function filterByMood(mood: number): JournalEntry[] {
  return getAllEntries().filter((e) => e.mood === mood);
}

export function getDateRange(): { earliest: string; latest: string } | null {
  const entries = getAllEntries();
  if (entries.length === 0) return null;

  const sorted = entries.sort((a, b) => a.date.localeCompare(b.date));
  return {
    earliest: sorted[0]!.date,
    latest: sorted[sorted.length - 1]!.date,
  };
}
