import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "./constants";

export default function useStudentDashboardData({ propData, user }) {
  const [dashboardData, setDashboardData] = useState(propData || null);
  const [sessionInfo, setSessionInfo] = useState({ status: "NONE", session: null });
  const [mentorSuggestions, setMentorSuggestions] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [courseAds, setCourseAds] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(!propData);
  const [dashboardError, setDashboardError] = useState(null);

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
    async function loadProjects() {
      if (!user?.uid) return;

      setProjectsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/projects/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
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
  }, [user?.uid]);

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
      const domain =
        dashboardData?.domain ||
        dashboardData?.profile?.domain ||
        dashboardData?.activeCourse?.domain ||
        dashboardData?.selectedCourse?.domain ||
        null;

      if (!domain) {
        setMentorSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/teachers/getMentorsByDomain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        setMentorSuggestions(payload.mentors || []);

      } catch (err) {
        console.error("Mentor suggestion load failed:", err);
        setMentorSuggestions([]);
      }
    }

    loadMentors();
  }, [dashboardData?.domain, dashboardData?.profile?.domain, dashboardData?.activeCourse?.domain, dashboardData?.selectedCourse?.domain]);

  const handleProfileSave = (updates) => {
    setDashboardData((prev) => ({
      ...prev,
      profile: {
        ...(prev?.profile || {}),
        ...updates,
      },
    }));
  };

  return {
    dashboardData,
    sessionInfo,
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
