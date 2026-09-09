import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";

function toDate(date: Date | string): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

/** e.g. "Jan 15, 2026" */
export function formatShortDate(date: Date | string): string {
  return format(toDate(date), "MMM d, yyyy");
}

/** e.g. "2 days ago" */
export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(toDate(date), { addSuffix: true });
}

export function isExpired(date: Date | string): boolean {
  return isPast(toDate(date));
}
