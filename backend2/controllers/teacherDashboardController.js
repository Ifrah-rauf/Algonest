import { getStudentsForTeacherByUid, getAllSessionsForTeacherByUid } from "../services/teacherSessionService.js";
import {
  getTeacherEarningsByUid,
  getTeacherCoursesByUid,
  getTeacherOverviewByUid,
  getTeacherProfileByUid,
  updateTeacherProfileByUid,
  createTeacherCertificateByUid,
  approveTeacherCertificateByUid,
} from "../services/teacherDashboardService.js";

export async function getTeacherStudents(req, res) {
  try {
    const uid = req.body?.uid || req.query?.uid || req.params?.uid;
    const mode = req.body?.mode || req.query?.mode || "unique"; // "unique" or "all"
    console.debug("teacherDashboardController.getTeacherStudents: incoming uid sources -> body,query,params", {
      body: req.body,
      query: req.query,
      params: req.params,
      mode
    });

    if (!uid) {
      console.warn("teacherDashboardController.getTeacherStudents: missing uid");
      return res.status(400).json({ success: false, error: "teacher uid required" });
    }

    console.debug("teacherDashboardController.getTeacherStudents: resolving students for uid=", uid, "mode=", mode);
    const data = mode === "all" 
      ? await getAllSessionsForTeacherByUid(uid)
      : await getStudentsForTeacherByUid(uid);
    console.debug("teacherDashboardController.getTeacherStudents: fetched data count=", (data || []).length);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("teacherDashboardController.getTeacherStudents error:", err?.message || err, err?.stack);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}

export async function getTeacherOverview(req, res) {
  try {
    const uid = req.body?.uid || req.query?.uid || req.params?.uid;

    if (!uid) {
      return res.status(400).json({ success: false, error: "teacher uid required" });
    }

    const data = await getTeacherOverviewByUid(uid);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("teacherDashboardController.getTeacherOverview error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}

export async function getTeacherEarnings(req, res) {
  try {
    const uid = req.body?.uid || req.query?.uid || req.params?.uid;

    if (!uid) {
      return res.status(400).json({ success: false, error: "teacher uid required" });
    }

    const data = await getTeacherEarningsByUid(uid);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("teacherDashboardController.getTeacherEarnings error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}

export async function getTeacherCourses(req, res) {
  try {
    const uid = req.body?.uid || req.query?.uid || req.params?.uid;

    if (!uid) {
      return res.status(400).json({ success: false, error: "teacher uid required" });
    }

    const data = await getTeacherCoursesByUid(uid);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("teacherDashboardController.getTeacherCourses error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}

export async function getTeacherProfile(req, res) {
  try {
    const uid = req.body?.uid || req.query?.uid || req.params?.uid;

    if (!uid) {
      return res.status(400).json({ success: false, error: "teacher uid required" });
    }

    const data = await getTeacherProfileByUid(uid);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("teacherDashboardController.getTeacherProfile error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}

export async function updateTeacherProfile(req, res) {
  try {
    const { uid, ...updates } = req.body || {};

    if (!uid) {
      return res.status(400).json({ success: false, error: "teacher uid required" });
    }

    const data = await updateTeacherProfileByUid(uid, updates);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("teacherDashboardController.updateTeacherProfile error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}

export async function addTeacherCertificate(req, res) {
  try {
    const { uid, certificateName, certificateFile, certificateFileName } = req.body || {};

    if (!uid || !certificateFile) {
      return res.status(400).json({ success: false, error: "uid and certificateFile required" });
    }

    const data = await createTeacherCertificateByUid(
      uid,
      certificateName || certificateFileName,
      certificateFile,
      certificateFileName || null
    );
    return res.json({ success: true, data });
  } catch (err) {
    console.error("teacherDashboardController.addTeacherCertificate error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}

export async function approveTeacherCertificate(req, res) {
  try {
    const { uid, certificateId } = req.body || {};

    if (!uid || !certificateId) {
      return res.status(400).json({ success: false, error: "uid and certificateId required" });
    }

    const data = await approveTeacherCertificateByUid(uid, certificateId);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("teacherDashboardController.approveTeacherCertificate error:", err?.message || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}
