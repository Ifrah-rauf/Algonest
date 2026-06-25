import { getActiveCourse, getSessions, getDashboardfunc, getTourStatusFunc, completeTourFunc } from "../services/dashboardServices.js";

export async function activeCourse(req, res) {
  try {
    const { uid } = req.params;
    const course = await getActiveCourse(uid);
    res.json({ success: true, course });
  } catch (err) {
    console.error("❌ activeCourse error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function sessions(req, res) {
  try {
    const { uid } = req.params;
    const sessionsData = await getSessions(uid);
    res.json({ success: true, sessions: sessionsData });
  } catch (err) {
    console.error("❌ sessions error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getDashboard(req, res) {
  try {
    const { uid } = req.params;
    const dashboardData = await getDashboardfunc(uid);
    console.log("ROLE "+ dashboardData.role+ " AND DAT FROM CONtroller "+ dashboardData.data);
    res.json({
      success: true,
      message: dashboardData.role,
      data: dashboardData.data,
    });
  } catch (err) {
    console.error("❌ dashboard error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function getTourStatus(req, res) {
  try {
    const { uid } = req.params;

    const tour = await getTourStatusFunc(uid);

    res.json({
      success: true,
      message: "Tour status fetched successfully",
      data: tour,
    });
  } catch (err) {
    console.error("❌ getTourStatus error:", err.message);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
export async function completeTour(req, res) {
  try {
    const { uid } = req.params;

    await completeTourFunc(uid);

    res.json({
      success: true,
      message: "Tour completed successfully",
    });
  } catch (err) {
    console.error("❌ completeTour error:", err.message);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
