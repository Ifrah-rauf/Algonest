import { getStudentsForTeacherByUid } from "../services/teacherSessionService.js";

export async function getTeacherStudents(req, res) {
  try {
    const uid = req.body?.uid || req.query?.uid || req.params?.uid;
    console.debug("teacherDashboardController.getTeacherStudents: incoming uid sources -> body,query,params", {
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!uid) {
      console.warn("teacherDashboardController.getTeacherStudents: missing uid");
      return res.status(400).json({ success: false, error: "teacher uid required" });
    }

    console.debug("teacherDashboardController.getTeacherStudents: resolving students for uid=", uid);
    const students = await getStudentsForTeacherByUid(uid);
    console.debug("teacherDashboardController.getTeacherStudents: fetched students count=", (students || []).length);
    return res.json({ success: true, data: students });
  } catch (err) {
    console.error("teacherDashboardController.getTeacherStudents error:", err?.message || err, err?.stack);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}
