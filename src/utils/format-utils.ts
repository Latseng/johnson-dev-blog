/**
 * Shared date formatting utilities.
 * Use these instead of local formatting functions to maintain consistency.
 */

/** Returns a full date string in `YYYY-MM-DD` format. */
export function formatDate(date: Date): string {
  return date.toISOString().substring(0, 10);
}

/** Returns a short date string in `MM-DD` format (for archive views where year is shown separately). */
export function formatDateShort(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}-${day}`;
}
