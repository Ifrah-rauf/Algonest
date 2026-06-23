export const API_BASE =
  (process.env.REACT_APP_API_BASE || "http://localhost:5000").replace(/\/+$/, "");

export function apiUrl(path = "") {
  if (!path) return API_BASE;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}
