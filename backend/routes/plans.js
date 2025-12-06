import express from "express";
import {supabase} from "../lib/supabase.js";
const router = express.Router();

router.get("/planOutline", async (req, res) => {
  try {
    const planIdRaw = req.params.planId;
    const planId = Number(planIdRaw);
    if (!planId || Number.isNaN(planId)) {
      return res.status(400).json({ success: false, message: "Missing or invalid planId" });
    }

    // 1) Fetch the most recent plan_outline for this plan_id
    const { data: outlinesArr, error: outlineErr } = await supabase
      .from("plan_outline")
      .select("*")
      .eq("plan_id", planId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (outlineErr) {
      console.error("Supabase plan_outline error:", outlineErr);
      return res.status(500).json({ success: false, message: "DB error fetching outline", error: outlineErr.message });
    }

    const outline = Array.isArray(outlinesArr) && outlinesArr.length ? outlinesArr[0] : null;

    // If no outline present: return success with empty sessions
    if (!outline) {
      return res.json({ success: true, outline: null, sessions: [] });
    }

    // 2) Fetch sessions for this outline (ordered)
    const { data: sessions, error: sessionErr } = await supabase
      .from("session")
      .select("*")
      .eq("outline_id", outline.outline_id)
      .order("start_time", { ascending: true });

    if (sessionErr) {
      console.error("Supabase session error:", sessionErr);
      return res.status(500).json({ success: false, message: "DB error fetching sessions", error: sessionErr.message });
    }

    // 3) Attempt to fetch attachments for outline (if table exists)
    let outlineAttachments = [];
    try {
      const { data: oAt, error: oAtErr } = await supabase
        .from("plan_outline_attachment")
        .select("*")
        .eq("outline_id", outline.outline_id);
      if (!oAtErr && Array.isArray(oAt)) outlineAttachments = oAt;
    } catch (e) {
      // ignore if table not present
      outlineAttachments = [];
    }

    // 4) Fetch attachments for each session (if table exists)
    // Build sessionsWithAttachments
    const sessionsWithAttachments = [];
    for (const s of sessions || []) {
      let attachmentsForSession = [];
      try {
        const { data: sAt, error: sAtErr } = await supabase
          .from("session_attachment")
          .select("*")
          .eq("session_id", s.session_id);

        if (!sAtErr && Array.isArray(sAt)) attachmentsForSession = sAt;
      } catch (e) {
        attachmentsForSession = [];
      }

      // add normalized status field if absent (optional)
      const normalized = {
        ...s,
        attachments: attachmentsForSession,
      };
      sessionsWithAttachments.push(normalized);
    }

    // 5) Return clean JSON. No HTML — safe for res.json parsing.
    return res.json({
      success: true,
      outline: {
        ...outline,
        attachments: outlineAttachments,
      },
      sessions: sessionsWithAttachments,
    });
  } catch (err) {
    console.error("GET /plans/planOutline/:planId error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

export default router;