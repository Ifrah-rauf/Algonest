import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatBox from "../components/chatbox";
import LessonQuiz from "../components/LessonQuiz";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";

const COMPANION_SYSTEM = `You are the AlgoNest AI Build Companion — an expert backend engineering tutor embedded inside the AlgoNest learning platform.

Your student is building a Job Tracker API using Node.js and Express, backed by Supabase.

YOUR ONE HARD RULE: You NEVER write code for the student. If asked for a code solution, redirect with a guiding question. Your job is to scaffold thinking, not complete work.

Your approach:
- Ask one focused question at a time
- Reference the student's specific project (Job Tracker API) when possible
- When a student is stuck, ask them to explain what they already know first
- Validate good reasoning before adding to it
- Be crisp and direct — max 3 sentences per response unless explaining a concept

If asked something unrelated to learning or coding: gently redirect back to the roadmap.`;

function normalizeTopicResources(topic) {
  if (!topic) return [];

  return (Array.isArray(topic.materials) ? topic.materials : [])
    .map((material) => ({
      label: material.title || material.url,
      url: material.url,
      description: material.description || "",
      resourceType: material.resource_type || "",
      materialId: material.material_id,
    }))
    .filter((item) => item.url);
}

function getLockedNotice(user) {
  return user?.uid
    ? "Locked: to create project, see plans"
    : "Locked: sign up to create project, see plans";
}

function getLessonUnlockState(lesson, progressMap, checkpointMap, hasActiveBooking) {
  if (!hasActiveBooking) {
    return lesson.order_index === 1 ? "unlocked" : "locked";
  }
  if (lesson.order_index === 1) return "unlocked";
  if (lesson.prerequisite_id) {
    return progressMap[lesson.prerequisite_id]?.completed ? "unlocked" : "locked";
  }
  if (lesson.checkpoint_id) {
    const checkpoint = checkpointMap[lesson.checkpoint_id];
    const checkpointSession = checkpoint?.session;
    const sessionEnded = checkpointSession?.end_time
      ? new Date(checkpointSession.end_time) <= new Date()
      : false;
    const teacherMarked = checkpointSession?.marked_by_teacher === true;
    const checkpointPassed = checkpoint?.status === "completed";
    const requiresTeacher = checkpoint?.requires_teacher === true;

    if (requiresTeacher) {
      return Boolean(checkpoint?.session_id) && sessionEnded && teacherMarked
        ? "unlocked"
        : "locked";
    }

    return checkpointPassed ? "unlocked" : "locked";
  }
  return "locked";
}

function findReachedCheckpoint(lessons, checkpoints, progressMap) {
  for (let idx = 0; idx < lessons.length - 1; idx += 1) {
    const lesson = lessons[idx];
    const nextLesson = lessons[idx + 1];
    if (!progressMap[lesson.lesson_id]?.completed || !nextLesson?.checkpoint_id) continue;

    const checkpoint = checkpoints.find(
      (item) => item.checkpoint_id === nextLesson.checkpoint_id
    );

    if (checkpoint && !checkpoint.session_id) {
      return { checkpoint, lesson };
    }
  }

  return null;
}

function PartyBurst() {
  const pieces = Array.from({ length: 18 }, (_, index) => index);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pieces.map((piece) => {
        const left = 8 + (piece % 6) * 15;
        const delay = (piece % 6) * 0.08;
        const hue = ["#6b46c1", "#f6c90e", "#34d399", "#fb7185"][piece % 4];

        return (
          <span
            key={piece}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "56%",
              width: piece % 3 === 0 ? 8 : 12,
              height: 4,
              borderRadius: 999,
              background: hue,
              transform: "rotate(18deg)",
              animation: `checkpoint-confetti 1.2s ease-out ${delay}s infinite`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </div>
  );
}

function CheckpointCelebrationModal({ checkpoint, onClose, onSelectTeacher }) {
  if (!checkpoint) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(18, 11, 41, 0.42)",
      zIndex: 120,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        position: "relative",
        width: "min(560px, 100%)",
        background: "linear-gradient(180deg, #fffdf5 0%, #ffffff 100%)",
        borderRadius: 24,
        border: "1px solid #fde68a",
        boxShadow: "0 18px 50px rgba(18, 11, 41, 0.2)",
        padding: "28px 28px 24px",
        overflow: "hidden",
      }}>
        <PartyBurst />
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: "linear-gradient(135deg, #6b46c1, #f6c90e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              boxShadow: "0 10px 24px rgba(107,70,193,0.25)",
            }}>
              🎉
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#92400e", letterSpacing: 2, textTransform: "uppercase" }}>
                Checkpoint Reached
              </div>
              <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: "#1a1035" }}>
                Hooray! You unlocked {checkpoint.title}
              </h2>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#5c5478" }}>
            You made it to a mentor checkpoint. Pick a new teacher for this review, and we&apos;ll attach the created session directly to this checkpoint.
          </p>

          <div style={{
            background: "#fff8e1",
            border: "1px solid #fde68a",
            borderRadius: 16,
            padding: "14px 16px",
          }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#92400e", textTransform: "uppercase", letterSpacing: 1.5 }}>
              What happens next
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
              Choose a teacher, book the checkpoint session, and we&apos;ll send you straight back here with the `session_id` linked to this checkpoint.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => onSelectTeacher(checkpoint)}
              style={{
                border: "none",
                borderRadius: 12,
                padding: "12px 18px",
                background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Select New Teacher
            </button>
            <button
              onClick={onClose}
              style={{
                border: "1px solid #ddd6fe",
                borderRadius: 12,
                padding: "12px 18px",
                background: "#fff",
                color: "#6b46c1",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlgoNestRoadmap() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [lessons,        setLessons]        = useState([]);
  const [lessonTopics,   setLessonTopics]   = useState({});
  const [checkpoints,    setCheckpoints]    = useState([]);
  const [progressMap,    setProgressMap]    = useState({});
  const [checkpointMap,  setCheckpointMap]  = useState({});
  const [openToolbox,    setOpenToolbox]    = useState(null);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [askedLessonId,  setAskedLessonId]  = useState(null); // tracks which lesson is "active" for visual feedback
  const [quizLessonId, setQuizLessonId] = useState(null);
  const [checkpointCelebration, setCheckpointCelebration] = useState(null);
  const [checkpointSuccess, setCheckpointSuccess] = useState(null);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);

  async function refreshLessonProgress() {
    if (!user?.uid) return;

    try {
      const progressRes = await fetch(`http://localhost:5000/api/lessons/progress/${user.uid}`);
      const progressData = await progressRes.json();

      setProgressMap(
        Object.fromEntries(
          (progressData.data || []).map((progress) => [progress.lesson_id, progress])
        )
      );
    } catch (err) {
      console.error("Failed to refresh lesson progress:", err);
    }
  }

  async function loadRoadmapData() {
    try {
      const requests = [
        fetch("http://localhost:5000/api/lessons/lessons"),
        fetch("http://localhost:5000/api/lessons/lesson-topics"),
        fetch("http://localhost:5000/api/lessons/lesson-topic-materials"),
        fetch("http://localhost:5000/api/lessons/checkpoints"),
      ];

      if (user?.uid) {
        requests.push(fetch(`http://localhost:5000/api/dashboard/active-course/${user.uid}`));
        requests.push(fetch(`http://localhost:5000/api/lessons/progress/${user.uid}`));
      }

      const responses = await Promise.all(requests);
      const [lessonsRes, topicsRes, materialsRes, checkpointsRes, activeCourseRes, progressRes] = responses;
      const lessonsData = await lessonsRes.json();
      const topicsData = await topicsRes.json();
      const materialsData = await materialsRes.json();
      const checkpointsData = await checkpointsRes.json();
      const visibleLessons = (lessonsData.data || []).filter(
        (lesson) => Number(lesson.order_index) >= 1
      );

      setLessons(visibleLessons);
      setCheckpoints(checkpointsData.data || []);

      const materialsByTopicId = {};
      (materialsData.data || []).forEach((material) => {
        if (!materialsByTopicId[material.topic_id]) materialsByTopicId[material.topic_id] = [];
        materialsByTopicId[material.topic_id].push(material);
      });

      const grouped = {};
      (topicsData.data || []).forEach(t => {
        const topicBelongsToVisibleLesson = visibleLessons.some(
          (lesson) => lesson.lesson_id === t.lesson_id
        );
        if (!topicBelongsToVisibleLesson) return;
        if (!grouped[t.lesson_id]) grouped[t.lesson_id] = [];
        grouped[t.lesson_id].push({
          ...t,
          materials: materialsByTopicId[t.topic_id] || [],
        });
      });
      setLessonTopics(grouped);

      if (activeCourseRes) {
        const activeCourseData = await activeCourseRes.json();
        setHasActiveBooking(Boolean(activeCourseData?.course));
      } else {
        setHasActiveBooking(false);
      }

      if (progressRes) {
        const progressData = await progressRes.json();
        setProgressMap(
          Object.fromEntries(
            (progressData.data || []).map((progress) => [progress.lesson_id, progress])
          )
        );
      } else {
        setProgressMap({});
      }
    } catch (err) {
      console.error("Failed to load roadmap data:", err);
    }
  }

  useEffect(() => {
    loadRoadmapData();
  }, [user?.uid]);

  useEffect(() => {
    if (checkpoints.length) {
      setCheckpointMap(
        Object.fromEntries(checkpoints.map(c => [c.checkpoint_id, c]))
      );
    }
  }, [checkpoints]);

  useEffect(() => {
    if (!user?.uid) {
      setHasActiveBooking(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    const success = location.state?.checkpointBookingSuccess;
    if (!success) return;

    setCheckpointSuccess(success);
    setCheckpoints((prev) =>
      prev.map((checkpoint) =>
        checkpoint.checkpoint_id === success.checkpointId
          ? { ...checkpoint, session_id: success.sessionId }
          : checkpoint
      )
    );
    setCheckpointCelebration(null);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const dashboardPrompt = location.state?.dashboardAiPrompt;
    if (!dashboardPrompt) return;

    setPendingMessage(dashboardPrompt);

    const nextState = { ...(location.state || {}) };
    delete nextState.dashboardAiPrompt;

    navigate(location.pathname, {
      replace: true,
      state: Object.keys(nextState).length ? nextState : null,
    });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!user?.uid || !lessons.length || !checkpoints.length) return;

    const reached = findReachedCheckpoint(lessons, checkpoints, progressMap);
    if (!reached) return;

    const celebrationKey = `checkpoint-celebrated:${user.uid}:${reached.checkpoint.checkpoint_id}`;
    if (localStorage.getItem(celebrationKey)) return;

    localStorage.setItem(celebrationKey, "1");
    setCheckpointCelebration(reached.checkpoint);
  }, [checkpoints, lessons, progressMap, user?.uid]);

  function markLessonComplete(lesson_id, score = null, serverProgress = null) {
    setProgressMap(prev => ({
      ...prev,
      [lesson_id]: {
        lesson_id,
        completed: true,
        completed_at: new Date().toISOString(),
        quiz_marks: score,
        ...(serverProgress || {}),
      },
    }));
  }


  function askAi(e, lesson) {
    e.stopPropagation(); // prevent any parent click handlers
    if (!hasActiveBooking) return;
    setAskedLessonId(lesson.lesson_id); // visual feedback
    setActiveLessonId(lesson.lesson_id);
    setPendingMessage(
      `I'm on "${lesson.title}" (Lesson ${lesson.order_index}). Can you help me understand this?`
    );
    // clear visual feedback after 1.5s
    setTimeout(() => setAskedLessonId(null), 1500);
  }

  function openLessonQuiz(e, lessonId) {
    e.stopPropagation();
    setQuizLessonId(lessonId);
  }

  function closeLessonQuiz() {
    setQuizLessonId(null);
  }

  function goToTeacherSelection(checkpoint) {
    if (!checkpoint?.checkpoint_id) return;

    setCheckpointCelebration(null);
    navigate("/teachers", {
      state: {
        checkpointFlow: {
          checkpointId: checkpoint.checkpoint_id,
          title: checkpoint.title,
          returnTo: "/roadmap_express",
        },
      },
    });
  }

  const completedCount = Object.values(progressMap).filter(p => p.completed).length;
  const totalLessons   = lessons.length;

  return (
    <div style={{
      fontFamily: "'Trebuchet MS', sans-serif",
      background: "#f5f4f0", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      overflow: "hidden", height: "100vh",
    }}>

      <Navbar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(o => !o)}
      />

      <header style={{
        minHeight: 52,
        background: "#fff",
        borderBottom: "1px solid #e8e4f0",
        display: "flex",
        alignItems: "center",
        padding: "8px 20px",
        gap: 14,
        flexShrink: 0,
        zIndex: 40,
        boxShadow: "0 1px 8px rgba(107,70,193,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9991b8", fontFamily: "monospace" }}>
          <span style={{ color: "#444" }}>Backend Dev</span>
          <span style={{ color: "#d0c8f0" }}>/</span>
          <span style={{ color: "#6b46c1", fontWeight: 600 }}>Node.js + Express</span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#f0ecfc", borderRadius: 20,
            padding: "5px 14px", fontSize: 11, fontFamily: "monospace",
          }}>
            <div style={{ width: 60, height: 4, background: "#e0d8f8", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${totalLessons ? (completedCount / totalLessons) * 100 : 0}%`,
                background: "linear-gradient(90deg, #6b46c1, #f6c90e)",
                borderRadius: 3, transition: "width 0.4s",
              }} />
            </div>
            <span style={{ color: "#6b46c1", fontWeight: 700 }}>{completedCount}/{totalLessons} lessons</span>
          </div>

          <div style={{
            background: "#fff8e1", border: "1px solid #f6c90e",
            borderRadius: 20, padding: "5px 12px",
            fontSize: 11, fontFamily: "monospace", color: "#b45309", fontWeight: 600,
          }}>
            🔥 12-day streak
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 280,
          background: "#1e1145", color: "#fff",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 90, overflowY: "auto", display: "flex", flexDirection: "column",
          boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
        }}>
          <div style={{ padding: "20px 18px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#8b7bb8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              Your Dashboard
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "linear-gradient(135deg, #6b46c1, #f6c90e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff",
              }}>
                {user?.username?.slice(0, 2).toUpperCase() || "IR"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user?.username || "Student"}</div>
                <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace" }}>Backend Dev Path · Active</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { val: `${completedCount}/${totalLessons}`, label: "Lessons",     color: "#a78bfa" },
                { val: "0/2",                               label: "Checkpoints", color: "#f6c90e" },
                { val: "#7",                                label: "Leaderboard", color: "#a78bfa" },
                { val: "79",                                label: "Avg. Score",  color: "#34d399" },
              ].map(({ val, label, color }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 10,
                  padding: "10px 12px", border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 80 }}
          />
        )}

        {/* ── LEFT: ROADMAP 60% ── */}
        <div style={{
          width: "60%", overflowY: "auto",
          padding: "24px 28px 40px",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {checkpointSuccess && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "14px 16px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: 14,
              color: "#065f46",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800 }}>
                  Session linked to {checkpointSuccess.checkpointTitle}
                </div>
                <div style={{ fontSize: 11, fontFamily: "monospace", marginTop: 3 }}>
                  session_id: {checkpointSuccess.sessionId || "pending"}
                </div>
              </div>
              <button
                onClick={() => setCheckpointSuccess(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#065f46",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
              Node.js + Express · Backend Developer Path
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1035", margin: 0, lineHeight: 1.2 }}>
              Your Learning Roadmap
            </h1>
            <p style={{ fontSize: 12, color: "#7b70a0", margin: "6px 0 0", fontFamily: "monospace" }}>
              Project: <strong style={{ color: "#6b46c1" }}>Job Tracker API</strong> · Complete lessons in order. Click a lesson to see topics.
            </p>
          </div>

          {lessons.length === 0 && (
            <div style={{ fontSize: 12, color: "#9991b8", fontFamily: "monospace", padding: "20px 0" }}>
              Loading roadmap...
            </div>
          )}

          {lessons.map((lesson, idx) => {
            const unlock   = getLessonUnlockState(lesson, progressMap, checkpointMap, hasActiveBooking);
            const progress = progressMap[lesson.lesson_id] || null;
            const isLocked = unlock === "locked";
            const isDone   = progress?.completed === true;
            const isActive = !isLocked && !isDone;
            const isOpen   = openToolbox === lesson.lesson_id;
            const topics   = lessonTopics[lesson.lesson_id] || [];
            const isAsked  = askedLessonId === lesson.lesson_id; // visual feedback flag

            const nextLesson  = lessons[idx + 1];
            const cpAfterNext = nextLesson?.checkpoint_id
              ? checkpoints.find(c => c.checkpoint_id === nextLesson.checkpoint_id)
              : null;
            const checkpointSession = cpAfterNext?.session || null;
            const checkpointSessionEnded = checkpointSession?.end_time
              ? new Date(checkpointSession.end_time) <= new Date()
              : false;
            const checkpointTeacherMarked = checkpointSession?.marked_by_teacher === true;
            const checkpointReady = Boolean(cpAfterNext && isDone && !cpAfterNext.session_id);
            const checkpointBooked = Boolean(cpAfterNext?.session_id);

            return (
              <div key={lesson.lesson_id}>

                {/* ── Outer card — NOT clickable ── */}
                <div style={{
                  background: isLocked ? "#f8f7fb" : "#fff",
                  border: isDone
                    ? "1.5px solid #d1fae5"
                    : isActive
                    ? "1.5px solid #6b46c1"
                    : "1.5px solid #e8e4f0",
                  borderRadius: 14, overflow: "hidden",
                  opacity: isLocked ? 0.55 : 1,
                  boxShadow: isActive
                    ? "0 0 0 3px rgba(107,70,193,0.08), 0 3px 12px rgba(107,70,193,0.1)"
                    : "0 1px 6px rgba(0,0,0,0.04)",
                  transition: "all 0.2s",
                }}>

                  {/* Row: lesson info + Ask AI — full horizontal flex */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    padding: "14px 18px", gap: 14,
                  }}>

                    {/* Left: badge + text — clickable zone for toolbox */}
                    <div
                      onClick={() => !isLocked && setOpenToolbox(isOpen ? null : lesson.lesson_id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        flex: 1, cursor: isLocked ? "not-allowed" : "pointer",
                        minWidth: 0, // allows text truncation
                      }}
                    >
                      {/* Order badge */}
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isDone
                          ? "#d1fae5"
                          : isActive
                          ? "linear-gradient(135deg, #6b46c1, #8b5cf6)"
                          : "#f0ecfc",
                        color:      isDone ? "#059669" : isActive ? "#fff" : "#c4b5fd",
                        fontWeight: 800, fontSize: isDone ? 16 : 14, fontFamily: "monospace",
                        boxShadow: isActive ? "0 2px 8px rgba(107,70,193,0.3)" : "none",
                      }}>
                        {isDone ? "✓" : isLocked ? "🔒" : lesson.order_index}
                      </div>

                      {/* Title + meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: isLocked ? "#aaa" : "#1a1035" }}>
                            {lesson.title}
                          </span>
                          {isDone && (
                            <span style={{ fontSize: 10, fontFamily: "monospace", background: "#d1fae5", color: "#059669", padding: "2px 8px", borderRadius: 20, fontWeight: 600, flexShrink: 0 }}>
                              Completed
                            </span>
                          )}
                          {isDone && progress?.quiz_marks != null && (
                            <span style={{ fontSize: 10, fontFamily: "monospace", background: "#fff8e1", color: "#b45309", padding: "2px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>
                              Marks: {progress.quiz_marks}
                            </span>
                          )}
                          {isActive && (
                            <span style={{ fontSize: 10, fontFamily: "monospace", background: "#f0ecfc", color: "#6b46c1", padding: "2px 8px", borderRadius: 20, fontWeight: 600, flexShrink: 0 }}>
                              In Progress
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8" }}>
                          Lesson {lesson.order_index} · {topics.length} topics
                          {isDone && progress?.quiz_marks != null && ` · score ${progress.quiz_marks}/6`}
                          {!hasActiveBooking && lesson.order_index > 1 && ` · ${getLockedNotice(user)}`}
                          {lesson.prerequisite_id && !isDone && ` · Unlocks after Lesson ${lesson.prerequisite_id}`}
                          {lesson.checkpoint_id && !isDone && ` · Requires Checkpoint ${lesson.checkpoint_id}`}
                        </div>
                      </div>
                    </div>

                    {/* Right: Ask AI button + chevron — completely outside clickable zone */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {!isLocked && (
                        <button
                          onClick={e => askAi(e, lesson)}
                          style={{
                            fontSize: 10, fontFamily: "monospace", fontWeight: 700,
                            background: !hasActiveBooking ? "#f3f4f6" : isAsked ? "#6b46c1" : "#f0ecfc",
                            color:      !hasActiveBooking ? "#9ca3af" : isAsked ? "#fff" : "#6b46c1",
                            border: `1px solid ${!hasActiveBooking ? "#e5e7eb" : isAsked ? "#6b46c1" : "#d8d0f0"}`,
                            borderRadius: 6, padding: "5px 12px",
                            cursor: !hasActiveBooking ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            boxShadow: !hasActiveBooking ? "none" : isAsked ? "0 2px 8px rgba(107,70,193,0.3)" : "none",
                            transform: !hasActiveBooking ? "scale(1)" : isAsked ? "scale(0.97)" : "scale(1)",
                          }}
                        >
                          {!hasActiveBooking ? "AI Locked" : isAsked ? "Sent ✓" : "Ask AI →"}
                        </button>
                      )}

                      {!isLocked && (
                        <button
                          onClick={e => openLessonQuiz(e, lesson.lesson_id)}
                          style={{
                            fontSize: 10, fontFamily: "monospace", fontWeight: 700,
                            background: "#fff8e1",
                            color: "#b45309",
                            border: "1px solid #fde68a",
                            borderRadius: 6,
                            padding: "5px 12px",
                            cursor: "pointer",
                          }}
                        >
                          Take Quiz
                        </button>
                      )}

                      {/* Chevron — also outside click zone, just visual */}
                      {!isLocked && (
                        <div
                          onClick={() => setOpenToolbox(isOpen ? null : lesson.lesson_id)}
                          style={{
                            cursor: "pointer", padding: "4px",
                            fontSize: 12, color: "#9991b8",
                            transform: isOpen ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                          }}
                        >
                          ▾
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Toolbox */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #f0ecfc", background: "#faf9ff" }}>
                      <div style={{ padding: "14px 18px 6px" }}>
                        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                          Topics in this lesson
                        </div>

                        {topics.length === 0 && (
                          <div style={{ fontSize: 11, color: "#9991b8", fontFamily: "monospace" }}>No topics yet.</div>
                        )}

                        {!hasActiveBooking && lesson.order_index > 1 && (
                          <div style={{
                            marginBottom: 10,
                            background: "#fff8e1",
                            border: "1px solid #fde68a",
                            borderRadius: 10,
                            padding: "10px 12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                          }}>
                            <div>
                              <div style={{ fontSize: 10, fontFamily: "monospace", color: "#92400e", textTransform: "uppercase", letterSpacing: 1.2 }}>
                                Locked
                              </div>
                              <div style={{ fontSize: 11, color: "#78350f", marginTop: 3 }}>
                                {getLockedNotice(user)}
                              </div>
                            </div>
                            <a
                              href={user?.uid ? "/#pricing" : "/signup"}
                              style={{
                                whiteSpace: "nowrap",
                                background: "#6b46c1",
                                color: "#fff",
                                textDecoration: "none",
                                borderRadius: 8,
                                padding: "8px 12px",
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {user?.uid ? "See Plans" : "Sign Up"}
                            </a>
                          </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {topics.map(topic => {
                            const resources = normalizeTopicResources(topic);

                            return (
                              <div key={topic.topic_id} style={{
                                background: "#fff", border: "1px solid #e8e4f0",
                                borderRadius: 10, padding: "12px 14px",
                              }}>
                                <div style={{ fontWeight: 700, fontSize: 12, color: "#1a1035", marginBottom: 5 }}>
                                  {topic.title}
                                </div>
                                <div style={{ fontSize: 11, color: "#5c5478", lineHeight: 1.6, marginBottom: 7 }}>
                                  {topic.description}
                                </div>
                                {(topic.applied_task || resources.length > 0) && (
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        topic.applied_task && resources.length > 0 ? "1fr 1fr" : "1fr",
                                      gap: 10,
                                      alignItems: "stretch",
                                    }}
                                  >
                                    {topic.applied_task && (
                                      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px" }}>
                                        <span style={{ fontSize: 9, fontFamily: "monospace", color: "#92400e", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>
                                          ⚡ Build Task
                                        </span>
                                        <div style={{ fontSize: 11, color: "#78350f", marginTop: 3, lineHeight: 1.5 }}>
                                          {topic.applied_task}
                                        </div>
                                      </div>
                                    )}
                                    {resources.length > 0 && (
                                      <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "8px 12px" }}>
                                        <span style={{ fontSize: 9, fontFamily: "monospace", color: "#0369a1", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>
                                          Resources
                                        </span>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 7 }}>
                                          {resources.map((resource) => (
                                            <a
                                              key={resource.url}
                                              href={resource.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={{
                                                fontSize: 11,
                                                color: "#0c4a6e",
                                                textDecoration: "underline",
                                                wordBreak: "break-word",
                                              }}
                                            >
                                              {resource.label}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {isDone && progress?.quiz_marks != null && (
                        <div style={{ padding: "0 18px 14px", fontSize: 11, fontFamily: "monospace", color: "#92400e" }}>
                          Quiz score recorded: <strong>{progress.quiz_marks}/6</strong>
                        </div>
                      )}

                      {isActive && !isDone && (
                        <div style={{ padding: "10px 18px 14px", display: "flex", gap: 8 }}>
                          <button
                            onClick={e => askAi(e, lesson)}
                            style={{
                              fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                              background: !hasActiveBooking ? "#f9fafb" : "#fff",
                              color: !hasActiveBooking ? "#9ca3af" : "#6b46c1",
                              border: `1.5px solid ${!hasActiveBooking ? "#e5e7eb" : "#d8d0f0"}`, borderRadius: 8,
                              padding: "9px 18px", cursor: "pointer",
                            }}
                          >
                            {hasActiveBooking ? "Ask companion about this →" : "AI Locked"}
                          </button>
                          <button
                            onClick={e => openLessonQuiz(e, lesson.lesson_id)}
                            style={{
                              fontSize: 11, fontFamily: "monospace", fontWeight: 700,
                              background: "#fff8e1", color: "#b45309",
                              border: "1.5px solid #fde68a", borderRadius: 8,
                              padding: "9px 18px", cursor: "pointer",
                            }}
                          >
                            Start quiz →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Checkpoint banner */}
                {cpAfterNext && (
                  <div style={{
                    display: "flex", alignItems: "stretch",
                    margin: "8px 0", borderRadius: 12, overflow: "hidden",
                    border: "1.5px solid #fde68a", background: "#fffbeb",
                  }}>
                    <div style={{ width: 4, background: "#f6c90e", flexShrink: 0 }} />
                    <div style={{ flex: 1, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 20 }}>⚑</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#78350f" }}>{cpAfterNext.title}</div>
                        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#92400e", marginTop: 2 }}>{cpAfterNext.description}</div>
                        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#b45309", marginTop: 3 }}>
                          status: <strong>{cpAfterNext.status}</strong>
                          {cpAfterNext.requires_teacher ? " · teacher required" : ""}
                          {checkpointBooked ? ` · session_id: ${cpAfterNext.session_id}` : ""}
                          {checkpointBooked && !checkpointSessionEnded ? " · waiting for session to end" : ""}
                          {checkpointBooked && checkpointSessionEnded && !checkpointTeacherMarked ? " · waiting for teacher sign-off" : ""}
                        </div>
                      </div>
                      {checkpointReady ? (
                        <button
                          onClick={() => goToTeacherSelection(cpAfterNext)}
                          style={{
                            border: "none",
                            background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
                            color: "#fff",
                            padding: "10px 14px",
                            borderRadius: 12,
                            fontSize: 11,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            cursor: "pointer",
                            flexShrink: 0,
                            boxShadow: "0 8px 18px rgba(107,70,193,0.18)",
                          }}
                        >
                          🎉 Select Teacher
                        </button>
                      ) : (
                        <div style={{
                          fontSize: 10, fontFamily: "monospace",
                          background: cpAfterNext.status === "completed" ? "#d1fae5" : checkpointBooked ? "#ede9fe" : "#fef9c3",
                          color:      cpAfterNext.status === "completed" ? "#059669" : checkpointBooked ? "#6b46c1" : "#92400e",
                          padding: "4px 10px", borderRadius: 20, fontWeight: 700, flexShrink: 0,
                        }}>
                          {cpAfterNext.status === "completed"
                            ? "✓ Passed"
                            : checkpointBooked && !checkpointSessionEnded
                            ? "Session Pending"
                            : checkpointBooked && !checkpointTeacherMarked
                            ? "Awaiting Review"
                            : checkpointBooked
                            ? "Session Booked"
                            : "Locked"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: AI COMPANION 40% ── */}
        <ChatBox
          systemPrompt={COMPANION_SYSTEM}
          contextTags={["Job Tracker API", "Node.js + Express", "Supabase"]}
          initialMessage="Hey — I'm your Build Companion. I'm here while you work through the roadmap. What are you trying to figure out right now?"
          pendingMessage={pendingMessage}
          onPendingConsumed={() => setPendingMessage("")}
          lessonId={activeLessonId}
          isLocked={!hasActiveBooking}
          lockedTitle={user?.uid ? "AI Build Companion unlocks with a plan" : "Sign up to unlock your AI Build Companion"}
          lockedDescription={
            user?.uid
              ? "You can preview milestone 1, but AI guidance, later milestones, and project creation unlock once your plan is active."
              : "You can preview milestone 1 right away. Sign up and start a plan to unlock AI help, project creation, and the full roadmap."
          }
          lockedCtaHref={user?.uid ? "/#pricing" : "/signup"}
          lockedFooter={getLockedNotice(user)}
        />

        <LessonQuiz
          lessonId={quizLessonId}
          isOpen={quizLessonId !== null}
          onClose={closeLessonQuiz}
          onPassed={markLessonComplete}
          onResultSaved={refreshLessonProgress}
        />
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0d8f0; border-radius: 10px; }
        @keyframes checkpoint-confetti {
          0% {
            transform: translate3d(0, 0, 0) rotate(15deg) scale(0.7);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0px, -120px, 0) rotate(320deg) scale(1.05);
            opacity: 0;
          }
        }
      `}</style>

      <CheckpointCelebrationModal
        checkpoint={checkpointCelebration}
        onClose={() => setCheckpointCelebration(null)}
        onSelectTeacher={goToTeacherSelection}
      />
    </div>
  );
}
