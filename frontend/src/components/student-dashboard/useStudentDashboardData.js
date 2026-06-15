import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "./constants";

function firstTruthy(values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function resolveCourseIds(data) {
  const activeCourse = data?.activeCourse || {};
  const selectedCourse = data?.selectedCourse || {};
  const roadmapContext = data?.roadmapContext || {};

  return [
    firstTruthy([
      activeCourse.courseId,
      activeCourse.course_id,
      activeCourse.plan_id,
      roadmapContext.roadmapCourseId,
    ]),
    firstTruthy([
      selectedCourse.courseId,
      selectedCourse.course_id,
      selectedCourse.plan_id,
    ]),
  ].filter(Boolean);
}

function resolveDomain(data) {
  return firstTruthy([
    data?.domain,
    data?.profile?.domain,
    data?.roadmapContext?.domain,
    data?.activeCourse?.domain,
    data?.selectedCourse?.domain,
  ]);
}

export default function useStudentDashboardData({ propData, user }) {
  const [dashboardData, setDashboardData] = useState(propData || null);
  const [sessionInfo, setSessionInfo] = useState({ status: "NONE", session: null });
  const [sessionHistory, setSessionHistory] = useState([]);
  const [mentorSuggestions, setMentorSuggestions] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [courseAds, setCourseAds] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(!propData);
  const [dashboardError, setDashboardError] = useState(null);

  const selectedCourseId = firstTruthy([
    dashboardData?.profile?.course_id,
    dashboardData?.selectedCourse?.courseId,
    dashboardData?.selectedCourse?.course_id,
    dashboardData?.activeCourse?.courseId,
    dashboardData?.activeCourse?.course_id,
    dashboardData?.roadmapContext?.roadmapCourseId,
  ]);

  const loadDashboard = useCallback(async () => {
    if (!user?.uid) return;

    setDashboardLoading(true);
    setDashboardError(null);

    try {
      const res = await fetch(`${API_BASE}/api/dashboard/getDashboard/${user.uid}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const payload = await res.json();
      if (payload?.success) {
        setDashboardData(payload.data || null);
      } else {
        throw new Error(payload?.message || "Dashboard load failed");
      }
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setDashboardError(err.message || "Could not load dashboard. Please retry.");
    } finally {
      setDashboardLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (propData) {
      setDashboardData(propData);
      setDashboardLoading(false);
      return;
    }

    loadDashboard();
  }, [loadDashboard, propData]);

  useEffect(() => {
    async function loadSession() {
      if (!user?.uid) return;

      try {
        const res = await fetch(`${API_BASE}/api/session/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        setSessionInfo({
          status: payload?.data?.state || "NONE",
          session: payload?.data?.session || null,
        });
      } catch (err) {
        console.error("Session info load failed:", err);
        setSessionInfo({ status: "NONE", session: null });
      }
    }

    loadSession();
  }, [user?.uid]);

  useEffect(() => {
    async function loadSessionHistory() {
      if (!user?.uid) return;

      try {
        const res = await fetch(`${API_BASE}/api/session/getSessionHistory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        setSessionHistory(Array.isArray(payload?.data?.session) ? payload.data.session : []);
      } catch (err) {
        console.error("Session history load failed:", err);
        setSessionHistory([]);
      }
    }

    loadSessionHistory();
  }, [user?.uid]);

  useEffect(() => {
    async function loadProjects() {
      if (!user?.uid) return;

      setProjectsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/projects/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, courseId: selectedCourseId }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        setProjectSuggestions(payload.success ? payload.projects || [] : []);
      } catch (err) {
        console.error("Project recommendation failed:", err);
        setProjectSuggestions([]);
      } finally {
        setProjectsLoading(false);
      }
    }

    loadProjects();
  }, [user?.uid, selectedCourseId]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch(`${API_BASE}/api/plans/getCourse`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        setCourseAds(payload.success ? payload.courses || [] : []);
      } catch (err) {
        console.error("Course ads load failed:", err);
        setCourseAds([]);
      }
    }

    loadCourses();
  }, []);

  useEffect(() => {
    async function loadMentors() {
      const courseIds = resolveCourseIds(dashboardData);
      const domain = resolveDomain(dashboardData);

      if (!courseIds.length && !domain) {
        setMentorSuggestions([]);
        return;
      }

      try {
        let payload = null;

        if (courseIds.length) {
          const res = await fetch(`${API_BASE}/api/teachers/getMentors`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseIds }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          payload = await res.json();
        }

        if (!payload?.mentors?.length && domain) {
          const res = await fetch(`${API_BASE}/api/teachers/getMentorsByDomain`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          payload = await res.json();
        }

        setMentorSuggestions(Array.isArray(payload?.mentors) ? payload.mentors : []);

      } catch (err) {
        console.error("Mentor suggestion load failed:", err);
        setMentorSuggestions([]);
      }
    }

    loadMentors();
  }, [dashboardData]);

  const handleProfileSave = (updates, dataUpdates = {}) => {
    setDashboardData((prev) => ({
      ...prev,
      ...dataUpdates,
      profile: {
        ...(prev?.profile || {}),
        ...updates,
      },
    }));
  };

  return {
    dashboardData,
    sessionInfo,
    sessionHistory,
    mentorSuggestions,
    projectSuggestions,
    courseAds,
    projectsLoading,
    dashboardLoading,
    dashboardError,
    loadDashboard,
    handleProfileSave,
  };
}
