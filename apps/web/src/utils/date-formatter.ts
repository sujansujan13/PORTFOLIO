const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Converts various date string formats (e.g., "Mar 2026", "March 2026", "2026-03-15")
 * into strict "YYYY-MM" format required by HTML <input type="month">.
 */
export function formatToMonthInput(dateStr?: string | null): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  if (!trimmed || trimmed.toLowerCase() === "present") return "";

  // 1. If already YYYY-MM format (e.g. "2026-03")
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. If YYYY-MM-DD or ISO string (e.g. "2026-03-15T00:00:00.000Z")
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 7);
  }

  // 3. If MM/YYYY or MM-YYYY (e.g. "03/2026", "3/2026")
  const mmyyyyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (mmyyyyMatch) {
    const month = mmyyyyMatch[1].padStart(2, "0");
    const year = mmyyyyMatch[2];
    return `${year}-${month}`;
  }

  // 4. If YYYY/MM (e.g. "2026/03")
  const yyyymmMatch = trimmed.match(/^(\d{4})[\/\-](\d{1,2})$/);
  if (yyyymmMatch) {
    const year = yyyymmMatch[1];
    const month = yyyymmMatch[2].padStart(2, "0");
    return `${year}-${month}`;
  }

  // 5. Month name + Year (e.g. "Mar 2026", "March 2026", "2026 Mar")
  const monthMap: Record<string, string> = {
    jan: "01",
    january: "01",
    feb: "02",
    february: "02",
    mar: "03",
    march: "03",
    apr: "04",
    april: "04",
    may: "05",
    jun: "06",
    june: "06",
    jul: "07",
    july: "07",
    aug: "08",
    august: "08",
    sep: "09",
    september: "09",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    dec: "12",
    december: "12",
  };

  const parts = trimmed.split(/[\s,/-]+/);
  let year = "";
  let month = "";

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (monthMap[lower]) {
      month = monthMap[lower];
    } else if (/^\d{4}$/.test(part)) {
      year = part;
    }
  }

  if (year && month) {
    return `${year}-${month}`;
  }

  // Fallback: try JS Date parsing
  const parsedDate = new Date(trimmed);
  if (!isNaN(parsedDate.getTime())) {
    const y = parsedDate.getFullYear();
    const m = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    return `${y}-${m}`;
  }

  return "";
}

/**
 * Converts a "YYYY-MM" string (e.g. "2026-03") into "Mar 2026".
 * If already in "Mar 2026" or "March 2026" format, returns it as-is.
 */
export function formatToDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  if (!trimmed || trimmed.toLowerCase() === "present") return "present";

  // Check if YYYY-MM (e.g. "2026-03")
  const yyyymmMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (yyyymmMatch) {
    const year = yyyymmMatch[1];
    const monthIndex = parseInt(yyyymmMatch[2], 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${MONTH_NAMES[monthIndex]} ${year}`;
    }
  }

  return trimmed;
}
