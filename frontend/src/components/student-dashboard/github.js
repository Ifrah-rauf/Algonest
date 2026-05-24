function stripTrailingNoise(value) {
  return String(value || "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/[),.;\]]+$/g, "");
}

export function normalizeGithubUrl(value) {
  const raw = stripTrailingNoise(value);
  if (!raw) return "";

  const sshMatch = raw.match(/^git@github\.com:([^#?]+?)(?:\.git)?$/i);
  if (sshMatch) {
    return `https://github.com/${sshMatch[1].replace(/\/+$/, "")}`;
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    const host = url.hostname.toLowerCase();

    if (host !== "github.com" && !host.endsWith(".github.com")) {
      return "";
    }

    const path = url.pathname.replace(/\/+$/, "").replace(/\.git$/i, "");
    if (!path || path === "/") return "";

    url.pathname = path;
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}

export function isGithubUrl(value) {
  return Boolean(normalizeGithubUrl(value));
}
