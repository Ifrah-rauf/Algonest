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

export function formatDateLabel(value, fallback = "Not scheduled yet") {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
  if (!value) return fallback;
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function capitalizeWords(value = "") {
  return value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

