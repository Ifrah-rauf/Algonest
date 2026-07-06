import { supabase } from "../lib/supabase.js";
import { getBearerToken, verifyAuthToken } from "../utils/authToken.js";

function getRequesterUid(req) {
  return (
    req.body?.requesterUid ||
    req.query?.requesterUid ||
    req.headers["x-user-uid"] ||
    null
  );
}

export async function requireAdmin(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (token) {
      try {
        const payload = verifyAuthToken(token);
        if (String(payload.role || "").toUpperCase() !== "ADMIN") {
          return res.status(403).json({ success: false, error: "Admin access required" });
        }
        req.adminUser = {
          uid: payload.uid,
          name: payload.username,
          email: payload.email,
          role: payload.role,
        };
        return next();
      } catch {
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
      }
    }

    const requesterUid = getRequesterUid(req);
    if (!requesterUid) {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const { data, error } = await supabase
      .from("auth")
      .select("uid, name, email, role")
      .eq("uid", requesterUid)
      .maybeSingle();

    if (error) throw error;
    if (!data || String(data.role || "").toUpperCase() !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    req.adminUser = data;
    return next();
  } catch (err) {
    console.error("requireAdmin error:", err);
    return res.status(500).json({ success: false, error: "Failed to verify admin access" });
  }
}
