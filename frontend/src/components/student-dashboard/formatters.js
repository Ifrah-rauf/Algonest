export function getInitials(name = "Student") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "ST"
  );
}

const DISPLAY_TIME_ZONE = "Asia/Kolkata";

function parseStoredDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value).trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?(?:\s?(Z|[+-]\d{1,2}(?::?\d{2})?))?$/);

  if (match) {
    const [, year, month, day, hours, minutes, seconds = match] = match;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds || 0), 0));
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateLabel(value, fallback = "Not scheduled yet") {
  const parsed = parseStoredDate(value);
  if (!parsed) return fallback;
  return parsed.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
  });
}

export function formatRelativeTime(value, fallback = "Recently") {
  if (!value) return fallback;

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return fallback;

  const diffHours = Math.floor((Date.now() - timestamp) / 3_600_000);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return formatDateLabel(value, fallback);
}

export function formatDateTimeLabel(value, fallback = "Not scheduled yet") {
  const parsed = parseStoredDate(value);
  if (!parsed) return fallback;
  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: DISPLAY_TIME_ZONE,
  });
}

export function capitalizeWords(value = "") {
  return value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
