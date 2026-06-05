import { supabase } from "../lib/supabase.js";

function getRequesterUid(req) {
  return (
    req.session?.user?.uid ||
    req.body?.requesterUid ||
    req.query?.requesterUid ||
    req.headers["x-user-uid"] ||
    null
  );
}

export async function requireAdmin(req, res, next) {
  try {
    if (req.session?.user?.role === "ADMIN") {
      req.adminUser = req.session.user;
      return next();
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
