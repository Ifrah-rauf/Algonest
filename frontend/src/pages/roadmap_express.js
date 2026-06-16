import { apiUrl } from "../config/api.js";
// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import ChatBox from "../components/chatbox";
// import LessonQuiz from "../components/LessonQuiz";
// import Navbar from "../components/navbar";
// import { useAuth } from "../context/AuthContext";
// import RoadmapBookingOverview from "./roadmap_booking_overview";

// const COMPANION_SYSTEM = `You are the AlgoNest AI Build Companion — an expert backend engineering tutor embedded inside the AlgoNest learning platform.

// Your student is building a Job Tracker API using Node.js and Express, backed by Supabase.

// YOUR ONE HARD RULE: You NEVER write code for the student. If asked for a code solution, redirect with a guiding question. Your job is to scaffold thinking, not complete work.

// Your approach:
// - Ask one focused question at a time
// - Reference the student's specific project (Job Tracker API) when possible
// - When a student is stuck, ask them to explain what they already know first
// - Validate good reasoning before adding to it
// - Be crisp and direct — max 3 sentences per response unless explaining a concept

// If asked something unrelated to learning or coding: gently redirect back to the roadmap.`;

// function normalizeTopicResources(topic) {
//   if (!topic) return [];

//   return (Array.isArray(topic.materials) ? topic.materials : [])
//     .map((material) => ({
//       label: material.title || material.url,
//       url: material.url,
//       description: material.description || "",
//       resourceType: material.resource_type || "",
//       materialId: material.material_id,
//     }))
//     .filter((item) => item.url);
// }

// function getLockedNotice(user) {
//   return user?.uid
//     ? "Locked: to create project, see plans"
//     : "Locked: sign up to create project, see plans";
// }

// function getLessonUnlockState(
//   lesson,
//   progressMap,
//   checkpointMap,
//   checkpointProgressMap,
//   hasActiveBooking,
//   isAuthenticated
// ) {
//   // Allow full roadmap access for unauthenticated users and for logged-in users without an active booking
//   if (!isAuthenticated || (isAuthenticated && !hasActiveBooking)) {
//     return "unlocked";
//   }
//   if (lesson.order_index === 1) return "unlocked";
//   if (lesson.prerequisite_id) {
//     return progressMap[lesson.prerequisite_id]?.completed ? "unlocked" : "locked";
//   }
//   if (lesson.checkpoint_id) {
//     const checkpoint = checkpointMap[lesson.checkpoint_id];
//     const checkpointProgress = checkpointProgressMap[lesson.checkpoint_id];
//     const checkpointSession = checkpointProgress?.session;
//     const sessionEnded = checkpointSession?.end_time
//       ? new Date(checkpointSession.end_time) <= new Date()
//       : false;
//     const teacherMarked = checkpointSession?.marked_by_teacher === true;
//     const checkpointPassed = checkpointProgress?.completed === true || teacherMarked;
//     const requiresTeacher = checkpoint?.requires_teacher === true;

//     if (requiresTeacher) {
//       return Boolean(checkpointProgress?.session_id) && sessionEnded && teacherMarked
//         ? "unlocked"
//         : "locked";
//     }

//     return checkpointPassed ? "unlocked" : "locked";
//   }
//   return "locked";
// }

// function findReachedCheckpoint(lessons, checkpoints, progressMap, checkpointProgressMap) {
//   for (let idx = 0; idx < lessons.length - 1; idx += 1) {
//     const lesson = lessons[idx];
//     const nextLesson = lessons[idx + 1];
//     if (!progressMap[lesson.lesson_id]?.completed || !nextLesson?.checkpoint_id) continue;

//     const checkpoint = checkpoints.find(
//       (item) => item.checkpoint_id === nextLesson.checkpoint_id
//     );
//     const checkpointProgress = checkpointProgressMap[nextLesson.checkpoint_id];

//     if (checkpoint && !checkpointProgress?.session_id && !checkpointProgress?.completed) {
//       return { checkpoint, lesson };
//     }
//   }

//   return null;
// }

// function normalizeCheckpointProgress(rows = []) {
//   const map = {};

//   rows.forEach((row) => {
//     if (!row?.checkpoint_id || map[row.checkpoint_id]) return;
//     map[row.checkpoint_id] = row;
//   });

//   return map;
// }

// function getCourseIdFromLocation(location) {
//   const params = new URLSearchParams(location.search || "");
//   const queryCourseId = params.get("courseId");
//   const stateCourseId = location.state?.courseId;
//   const parsed = Number(queryCourseId || stateCourseId || 1);
//   return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
// }

// function getActiveTabFromLocation(location) {
//   const params = new URLSearchParams(location.search || "");
//   return params.get("tab") === "booking" ? "booking" : "roadmap";
// }

// function PartyBurst() {
//   const pieces = Array.from({ length: 18 }, (_, index) => index);

//   return (
//     <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
//       {pieces.map((piece) => {
//         const left = 8 + (piece % 6) * 15;
//         const delay = (piece % 6) * 0.08;
//         const hue = ["#6b46c1", "#f6c90e", "#34d399", "#fb7185"][piece % 4];

//         return (
//           <span
//             key={piece}
//             style={{
//               position: "absolute",
//               left: `${left}%`,
//               top: "56%",
//               width: piece % 3 === 0 ? 8 : 12,
//               height: 4,
//               borderRadius: 999,
//               background: hue,
//               transform: "rotate(18deg)",
//               animation: `checkpoint-confetti 1.2s ease-out ${delay}s infinite`,
//               opacity: 0.9,
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// }

// function CheckpointCelebrationModal({ checkpoint, onClose, onSelectTeacher }) {
//   if (!checkpoint) return null;

//   return (
//     <div style={{
//       position: "fixed",
//       inset: 0,
//       background: "rgba(18, 11, 41, 0.42)",
//       zIndex: 120,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: 24,
//     }}>
//       <div style={{
//         position: "relative",
//         width: "min(560px, 100%)",
//         background: "linear-gradient(180deg, #fffdf5 0%, #ffffff 100%)",
//         borderRadius: 12,
//         border: "1px solid #fde68a",
//         boxShadow: "0 18px 50px rgba(18, 11, 41, 0.2)",
//         padding: "28px 28px 24px",
//         overflow: "hidden",
//       }}>
//         <PartyBurst />
//         <div style={{
//           position: "relative",
//           zIndex: 2,
//           display: "flex",
//           flexDirection: "column",
//           gap: 14,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{
//               width: 58,
//               height: 58,
//               borderRadius: 12,
//               background: "linear-gradient(135deg, #6b46c1, #f6c90e)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 26,
//               boxShadow: "0 10px 24px rgba(107,70,193,0.25)",
//             }}>
//               🎉
//             </div>
//             <div>
//               <div style={{ fontSize: 11, fontFamily: "monospace", color: "#92400e", letterSpacing: 2, textTransform: "uppercase" }}>
//                 Checkpoint Reached
//               </div>
//               <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: "#1a1035" }}>
//                 Hooray! You unlocked {checkpoint.title}
//               </h2>
//             </div>
//           </div>

//           <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#5c5478" }}>
//             You made it to a mentor checkpoint. Pick a new teacher for this review, and we&apos;ll attach the created session directly to this checkpoint.
//           </p>

//           <div style={{
//             background: "#fff8e1",
//             border: "1px solid #fde68a",
//             borderRadius: 10,
//             padding: "14px 16px",
//           }}>
//             <div style={{ fontSize: 10, fontFamily: "monospace", color: "#92400e", textTransform: "uppercase", letterSpacing: 1.5 }}>
//               What happens next
//             </div>
//             <div style={{ marginTop: 6, fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
//               Choose a teacher, book the checkpoint session, and we&apos;ll send you straight back here with the `session_id` linked to this checkpoint.
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             <button
//               onClick={() => onSelectTeacher({
//                 kind: "checkpoint",
//                 id: checkpoint.checkpoint_id,
//                 title: checkpoint.title,
//               })}
//               style={{
//                 border: "none",
//                 borderRadius: 12,
//                 padding: "12px 18px",
//                 background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
//                 color: "#fff",
//                 fontWeight: 700,
//                 cursor: "pointer",
//               }}
//             >
//               Select New Teacher
//             </button>
//             <button
//               onClick={onClose}
//               style={{
//                 border: "1px solid #ddd6fe",
//                 borderRadius: 12,
//                 padding: "12px 18px",
//                 background: "#fff",
//                 color: "#6b46c1",
//                 fontWeight: 700,
//                 cursor: "pointer",
//               }}
//             >
//               I&apos;ll do this later
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RoadmapGateCard({
//   kind,
//   indexLabel,
//   title,
//   description,
//   status,
//   sessionId = null,
//   onBook = null,
//   bookLabel = "Select Teacher",
//   lockedHint = "Locked until you complete the previous step.",
// }) {
//   const statusMeta = {
//     completed: { label: "Completed", background: "#d1fae5", color: "#059669", border: "#a7f3d0" },
//     pending: { label: "Session Pending", background: "#fff8e1", color: "#b45309", border: "#fde68a" },
//     ready: { label: "Ready to book", background: "#f0ecfc", color: "#6b46c1", border: "#d8d0f0" },
//     locked: { label: "Locked", background: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
//   };

//   const meta = statusMeta[status] || statusMeta.locked;

//   return (
//     <div style={{
//       background: "#f2e5fbff",
//       // border: `1.5px solid ${meta.border}`,
//       border: "2px solid #dca2ffff",
//       borderRadius: 10,
//       padding: 18,
//       boxShadow: status === "ready" ? "0 10px 28px rgba(107,70,193,0.08)" : "0 1px 6px rgba(0,0,0,0.04)",
//       transition: "all 0.22s ease",
//     }}>
//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
//         <div style={{ minWidth: 0 }}>
//           <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", letterSpacing: 2, textTransform: "uppercase" }}>
//             {indexLabel}
//           </div>
//           <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1035", marginTop: 4 }}>
//             {title}
//           </div>
//           <div style={{ fontSize: 12, color: "#5c5478", lineHeight: 1.65, marginTop: 6 }}>
//             {description}
//           </div>
//         </div>
//         <span style={{
//           fontSize: 10,
//           fontFamily: "monospace",
//           background: meta.background,
//           color: meta.color,
//           border: `1px solid ${meta.border}`,
//           padding: "4px 8px",
//           borderRadius: 999,
//           whiteSpace: "nowrap",
//           fontWeight: 700,
//           flexShrink: 0,
//         }}>
//           {meta.label}
//         </span>
//       </div>

//       <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
//         {sessionId && (
//           <div style={{
//             fontSize: 10,
//             fontFamily: "monospace",
//             color: "#7b70a0",
//             background: "#faf9ff",
//             border: "1px solid #ece7fb",
//             borderRadius: 999,
//             padding: "6px 10px",
//           }}>
//             session_id: {sessionId}
//           </div>
//         )}
//         {status === "locked" && (
//           <div style={{ fontSize: 11, color: "#7b70a0" }}>{lockedHint}</div>
//         )}
//         {status === "pending" && (
//           <div style={{ fontSize: 11, color: "#7b70a0" }}>
//             We’ll unlock the next step once this session is completed and marked by the mentor.
//           </div>
//         )}
//         {status === "completed" && (
//           <div style={{ fontSize: 11, color: "#047857" }}>
//             Great work. This milestone is complete.
//           </div>
//         )}
//         {status === "ready" && onBook && (
//           <button
//             onClick={onBook}
//           style={{
//               border: "none",
//               background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
//               color: "#fff",
//               borderRadius: 12,
//               padding: "10px 14px",
//               fontSize: 12,
//               fontWeight: 800,
//               cursor: "pointer",
//               marginLeft: "auto",
//             }}
//           >
//             {bookLabel}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function AlgoNestRoadmap() {
//   const { user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const courseId = getCourseIdFromLocation(location);
//   const activeTab = getActiveTabFromLocation(location);

//   function setActiveTab(tab) {
//     const nextParams = new URLSearchParams(location.search || "");
//     nextParams.set("courseId", String(courseId));
//     nextParams.set("tab", tab);
//     navigate(
//       {
//         pathname: location.pathname,
//         search: `?${nextParams.toString()}`,
//       },
//       { replace: false, state: location.state || null }
//     );
//   }

//   const [lessons,        setLessons]        = useState([]);
//   const [lessonTopics,   setLessonTopics]   = useState({});
//   const [checkpoints,    setCheckpoints]    = useState([]);
//   const [interviews,     setInterviews]     = useState([]);
//   const [progressMap,    setProgressMap]    = useState({});
//   const [checkpointMap,  setCheckpointMap]  = useState({});
//   const [checkpointProgressMap, setCheckpointProgressMap] = useState({});
//   const [interviewProgressMap, setInterviewProgressMap] = useState({});
//   const [openToolbox,    setOpenToolbox]    = useState(null);
//   const [expandedTopics, setExpandedTopics] = useState({});
//   const [sidebarOpen,    setSidebarOpen]    = useState(false);
//   const [pendingMessage, setPendingMessage] = useState("");
//   const [activeLessonId, setActiveLessonId] = useState(null);
//   const [askedLessonId,  setAskedLessonId]  = useState(null); // tracks which lesson is "active" for visual feedback
//   const [quizLessonId, setQuizLessonId] = useState(null);
//   const [checkpointCelebration, setCheckpointCelebration] = useState(null);
//   const [checkpointSuccess, setCheckpointSuccess] = useState(null);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [activeCourseData, setActiveCourseData] = useState(null);
//   const [hasActiveBooking, setHasActiveBooking] = useState(false);
//   const [hasAnyBooking, setHasAnyBooking] = useState(false);
//   const [resolvedDomain, setResolvedDomain] = useState(null);
//   const [aiInputCount, setAiInputCount] = useState(0);
//   const [aiLockedByUsage, setAiLockedByUsage] = useState(false);

//   async function refreshLessonProgress() {
//     if (!user?.uid) return;

//     try {
//       const progressRes = await fetch(apiUrl(`/api/lessons/progress/${user.uid}?courseId=${courseId}`));
//       const progressData = await progressRes.json();

//       setProgressMap(
//         Object.fromEntries(
//           (progressData.data || []).map((progress) => [progress.lesson_id, progress])
//         )
//       );
//     } catch (err) {
//       console.error("Failed to refresh lesson progress:", err);
//     }
//   }

//   async function loadRoadmapData() {
//     try {
//       const requests = [
//         fetch(apiUrl(`/api/lessons/lessons?courseId=${courseId}`)),
//         fetch(apiUrl(`/api/lessons/lesson-topics?courseId=${courseId}`)),
//         fetch(apiUrl(`/api/lessons/lesson-topic-materials?courseId=${courseId}`)),
//         fetch(apiUrl(`/api/lessons/checkpoints?courseId=${courseId}`)),
//         fetch(apiUrl(`/api/lessons/interviews?courseId=${courseId}`)),
//       ];

//       if (user?.uid) {
//         requests.push(fetch(apiUrl(`/api/dashboard/active-course/${user.uid}`)));
//         // Also fetch dashboard summary which includes hasAnyBooking and activeCourse
//         requests.push(fetch(apiUrl(`/api/dashboard/getDashboard/${user.uid}`)));
//         requests.push(fetch(apiUrl(`/api/lessons/progress/${user.uid}?courseId=${courseId}`)));
//         requests.push(fetch(apiUrl(`/api/lessons/checkpoint-progress/${user.uid}?courseId=${courseId}`)));
//         requests.push(fetch(apiUrl(`/api/lessons/interview-progress/${user.uid}?courseId=${courseId}`)));
//       }

//       const responses = await Promise.all(requests);
//       const [
//         lessonsRes,
//         topicsRes,
//         materialsRes,
//         checkpointsRes,
//         interviewsRes,
//         activeCourseRes,
//         dashboardRes,
//         progressRes,
//         checkpointProgressRes,
//         interviewProgressRes,
//       ] = responses;
//       const lessonsData = await lessonsRes.json();
//       const topicsData = await topicsRes.json();
//       const materialsData = await materialsRes.json();
//       const checkpointsData = await checkpointsRes.json();
//       const interviewsData = await interviewsRes.json();
//       // responses array may include additional entries when user is logged in
//       const visibleLessons = (lessonsData.data || []).filter(
//         (lesson) => Number(lesson.order_index) >= 1
//       );

//       setLessons(visibleLessons);
//       setCheckpoints(checkpointsData.data || []);
//       setInterviews(interviewsData.data || []);

//       const materialsByTopicId = {};
//       (materialsData.data || []).forEach((material) => {
//         if (!materialsByTopicId[material.topic_id]) materialsByTopicId[material.topic_id] = [];
//         materialsByTopicId[material.topic_id].push(material);
//       });

//       const grouped = {};
//       (topicsData.data || []).forEach(t => {
//         const topicBelongsToVisibleLesson = visibleLessons.some(
//           (lesson) => lesson.lesson_id === t.lesson_id
//         );
//         if (!topicBelongsToVisibleLesson) return;
//         if (!grouped[t.lesson_id]) grouped[t.lesson_id] = [];
//         grouped[t.lesson_id].push({
//           ...t,
//           materials: materialsByTopicId[t.topic_id] || [],
//         });
//       });
//       setLessonTopics(grouped);

//       // derive booking state from dashboard summary if available
//       if (user?.uid) {
//         let activeCourseJson = null;
//         let dashboardJson = null;

//         try {
//           activeCourseJson = await activeCourseRes.json();
//           setActiveCourseData(activeCourseJson.course || null);
//         } catch (e) {
//           setActiveCourseData(null);
//         }

//         try {
//           dashboardJson = await dashboardRes.json();
//           setDashboardData(dashboardJson.data || null);
//         } catch (e) {
//           setDashboardData(null);
//         }

//         const dashboardDataValue = dashboardJson?.data || null;
//         const activeCourseDataValue = activeCourseJson?.course || null;
//         const dashboardActiveCourse = dashboardDataValue?.activeCourse || null;
//         const dashboardHasAnyBooking = Boolean(dashboardDataValue?.hasAnyBooking);
//         const dashboardDomain =
//           dashboardDataValue?.domain ||
//           dashboardDataValue?.profile?.domain ||
//           dashboardActiveCourse?.domain ||
//           activeCourseDataValue?.domain ||
//           null;

//         // A booking is valid for this roadmap if activeCourse exists and its courseId matches
//         const validForThisCourse = (dashboardActiveCourse && Number(dashboardActiveCourse.courseId) === Number(courseId));

//         setHasActiveBooking(Boolean(validForThisCourse));
//         setHasAnyBooking(dashboardHasAnyBooking);
//         setResolvedDomain(dashboardDomain);
//       } else {
//         setHasActiveBooking(false);
//         setHasAnyBooking(false);
//         setResolvedDomain(null);
//       }

//       if (progressRes) {
//         const progressData = await progressRes.json();
//         setProgressMap(
//           Object.fromEntries(
//             (progressData.data || []).map((progress) => [progress.lesson_id, progress])
//           )
//         );
//       } else {
//         setProgressMap({});
//       }

//       if (checkpointProgressRes) {
//         const checkpointProgressData = await checkpointProgressRes.json();
//         setCheckpointProgressMap(normalizeCheckpointProgress(checkpointProgressData.data || []));
//       } else {
//         setCheckpointProgressMap({});
//       }

//       if (interviewProgressRes) {
//         const interviewProgressData = await interviewProgressRes.json();
//         setInterviewProgressMap(
//           Object.fromEntries(
//             (interviewProgressData.data || []).map((row) => [row.interview_id, row])
//           )
//         );
//       } else {
//         setInterviewProgressMap({});
//       }
//     } catch (err) {
//       console.error("Failed to load roadmap data:", err);
//     }
//   }

//   useEffect(() => {
//     loadRoadmapData();
//   }, [user?.uid, courseId]);

//   // track AI input count for logged-in users with no previous bookings
//   useEffect(() => {
//     if (!user?.uid) {
//       setAiInputCount(0);
//       setAiLockedByUsage(false);
//       return;
//     }

//     const key = `ai_inputs:${user.uid}`;
//     const stored = parseInt(localStorage.getItem(key) || "0", 10) || 0;
//     setAiInputCount(stored);
//     setAiLockedByUsage(stored >= 15);
//   }, [user?.uid]);

//   function handleUserAIMessage() {
//     if (!user?.uid) return;
//     // only count preview usage when AI is actually available
//     if (!canUseAI || hasActiveBooking) return;

//     const key = `ai_inputs:${user.uid}`;
//     const next = aiInputCount + 1;
//     localStorage.setItem(key, String(next));
//     setAiInputCount(next);
//     if (next >= 15) setAiLockedByUsage(true);
//   }

//   useEffect(() => {
//     if (checkpoints.length) {
//       setCheckpointMap(
//         Object.fromEntries(checkpoints.map(c => [c.checkpoint_id, c]))
//       );
//     }
//   }, [checkpoints]);

//   useEffect(() => {
//     if (!user?.uid) {
//       setHasActiveBooking(false);
//       setCheckpointProgressMap({});
//       setResolvedDomain(null);
//     }
//   }, [user?.uid]);

//   useEffect(() => {
//     const success = location.state?.gateBookingSuccess
//       || location.state?.checkpointBookingSuccess
//       || location.state?.interviewBookingSuccess;
//     if (!success) return;

//     setCheckpointSuccess(success);
//     if (success.kind === "interview") {
//       setInterviewProgressMap((prev) => ({
//         ...prev,
//         [success.interviewId]: {
//           interview_sessions_id: `local-${success.interviewId}`,
//           interview_id: success.interviewId,
//           session_id: success.sessionId,
//           notes: null,
//           completed: false,
//           completed_at: null,
//           status: "BOOKED",
//           session: null,
//         },
//       }));
//     } else {
//       setCheckpointProgressMap((prev) => ({
//         ...prev,
//         [success.checkpointId]: {
//           id: `local-${success.checkpointId}`,
//           checkpoint_id: success.checkpointId,
//           s_id: null,
//           status: "BOOKED",
//           completed: false,
//           completed_at: null,
//           session_id: success.sessionId,
//           created_at: new Date().toISOString(),
//           session: null,
//         },
//       }));
//     }
//     setCheckpointCelebration(null);
//     navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null });
//   }, [location.pathname, location.search, location.state, navigate]);

//   useEffect(() => {
//     const dashboardPrompt = location.state?.dashboardAiPrompt;
//     if (!dashboardPrompt) return;

//     setPendingMessage(dashboardPrompt);

//     const nextState = { ...(location.state || {}) };
//     delete nextState.dashboardAiPrompt;

//     navigate({ pathname: location.pathname, search: location.search }, {
//       replace: true,
//       state: Object.keys(nextState).length ? nextState : null,
//     });
//   }, [location.pathname, location.search, location.state, navigate]);

//   useEffect(() => {
//     if (!user?.uid || !lessons.length || !checkpoints.length) return;

//     const reached = findReachedCheckpoint(lessons, checkpoints, progressMap, checkpointProgressMap);
//     if (!reached) return;

//     const celebrationKey = `checkpoint-celebrated:${user.uid}:${reached.checkpoint.checkpoint_id}`;
//     if (localStorage.getItem(celebrationKey)) return;

//     localStorage.setItem(celebrationKey, "1");
//     setCheckpointCelebration(reached.checkpoint);
//   }, [checkpoints, lessons, progressMap, checkpointProgressMap, user?.uid]);

//   function markLessonComplete(lesson_id, score = null, serverProgress = null) {
//     setProgressMap(prev => ({
//       ...prev,
//       [lesson_id]: {
//         lesson_id,
//         completed: true,
//         completed_at: new Date().toISOString(),
//         quiz_marks: score,
//         ...(serverProgress || {}),
//       },
//     }));
//   }


//   function askAi(e, lesson) {
//     e.stopPropagation(); // prevent any parent click handlers
//     if (!canUseAI) return;
//     setAskedLessonId(lesson.lesson_id); // visual feedback
//     setActiveLessonId(lesson.lesson_id);
//     setPendingMessage(
//       `I'm on "${lesson.title}" (Lesson ${lesson.order_index}). Can you help me understand this?`
//     );
//     // clear visual feedback after 1.5s
//     setTimeout(() => setAskedLessonId(null), 1500);
//   }

//   function openLessonQuiz(e, lessonId) {
//     e.stopPropagation();
//     if (!user?.uid) {
//       // Not logged in — send to signup to satisfy Rule 1 (quizzes locked)
//       navigate("/signup");
//       return;
//     }
//     // Only allow quiz if user has a valid booking for this course
//     if (!hasActiveBooking) {
//       // logged-in but no valid booking — send to pricing
//       navigate("/#pricing");
//       return;
//     }

//     setQuizLessonId(lessonId);
//   }

//   function closeLessonQuiz() {
//     setQuizLessonId(null);
//   }

//   function goToTeacherSelection(gate) {
//     if (!gate) return;

//     setCheckpointCelebration(null);
//     navigate("/teachers", {
//       state: {
//         gateFlow: {
//           kind: gate.kind,
//           checkpointId: gate.kind === "checkpoint" ? gate.id : null,
//           interviewId: gate.kind === "interview" ? gate.id : null,
//           title: gate.title,
//           courseId,
//           returnTo: `/roadmap_express?courseId=${courseId}`,
//         },
//       },
//     });
//   }

//   const completedCount = Object.values(progressMap).filter(p => p.completed).length;
//   const totalLessons   = lessons.length;
//   const lessonCheckpointIds = new Set(lessons.map((lesson) => lesson.checkpoint_id).filter(Boolean));
//   const terminalCheckpoint = [...checkpoints]
//     .filter((checkpoint) => !lessonCheckpointIds.has(checkpoint.checkpoint_id))
//     .sort((a, b) => Number(a.checkpoint_id) - Number(b.checkpoint_id))
//     .at(-1) || null;
//   const terminalCheckpointProgress = terminalCheckpoint ? checkpointProgressMap[terminalCheckpoint.checkpoint_id] : null;
//   const allLessonsCompleted = totalLessons > 0 && lessons.every((lesson) => progressMap[lesson.lesson_id]?.completed === true);
//   const terminalCheckpointCompleted = Boolean(
//     terminalCheckpointProgress?.completed === true ||
//     terminalCheckpointProgress?.session?.marked_by_teacher === true
//   );
//   const terminalCheckpointPending = Boolean(
//     terminalCheckpointProgress?.session_id && !terminalCheckpointCompleted
//   );
//   const interviewOne = interviews[0] || null;
//   const interviewTwo = interviews[1] || null;
//   const interviewOneProgress = interviewOne ? interviewProgressMap[interviewOne.interview_id] : null;
//   const interviewTwoProgress = interviewTwo ? interviewProgressMap[interviewTwo.interview_id] : null;
//   const interviewOneUnlocked = terminalCheckpointCompleted;
//   const interviewTwoUnlocked = Boolean(interviewOneProgress?.completed === true);
//   const interviewOneCompleted = Boolean(interviewOneProgress?.completed === true);
//   const interviewTwoCompleted = Boolean(interviewTwoProgress?.completed === true);
//   const finalCheckpointCanBook = Boolean(
//     terminalCheckpoint && allLessonsCompleted && hasActiveBooking && !terminalCheckpointCompleted && !terminalCheckpointPending
//   );
//   const finalCheckpointStatus = terminalCheckpointCompleted
//     ? "completed"
//     : terminalCheckpointPending
//     ? "pending"
//     : finalCheckpointCanBook
//     ? "ready"
//     : "locked";
//   const interviewOneStatus = interviewOneCompleted
//     ? "completed"
//     : interviewOneProgress?.session_id
//     ? "pending"
//     : interviewOneUnlocked
//     ? "ready"
//     : "locked";
//   const interviewTwoStatus = interviewTwoCompleted
//     ? "completed"
//     : interviewTwoProgress?.session_id
//     ? "pending"
//     : interviewTwoUnlocked
//     ? "ready"
//     : "locked";

//   // Determine AI/chat availability based on resolved domain + booking state
//   const isAuthenticated = Boolean(user?.uid);
//   const hasDomain = Boolean(resolvedDomain);
//   let canUseAI = false;
//   let chatLockReason = null; // e.g., "other_roadmap"

//   if (isAuthenticated) {
//     if (!hasDomain) {
//       canUseAI = false;
//       chatLockReason = "no_domain";
//     } else if (hasActiveBooking) {
//       // Active booking for this roadmap: full AI access
//       canUseAI = true;
//     } else if (hasAnyBooking && !hasActiveBooking) {
//       // User has a booking, but it's for another course -> disallow chat
//       canUseAI = false;
//       chatLockReason = "other_roadmap";
//     } else {
//       // No bookings at all — allow AI preview up to 15 messages
//       canUseAI = !aiLockedByUsage;
//     }
//   } else {
//     // Anonymous users: AI input disallowed (preview-only conversation shown)
//     canUseAI = false;
//   }

//   const chatIsLocked = !canUseAI;
//   let chatLockedTitle = "";
//   let chatLockedDescription = "";
//   let chatLockedCta = "/#pricing";

//   if (aiLockedByUsage) {
//     chatLockedTitle = "Create your study plan";
//     chatLockedDescription = "You have used the AI preview 15 times. Create a study plan to continue using the companion.";
//     chatLockedCta = "/#pricing";
//   } else if (chatLockReason === "no_domain") {
//     chatLockedTitle = "Select a domain first";
//     chatLockedDescription = "AI depends on your selected domain. Choose a roadmap or booking that sets your domain before using the companion.";
//     chatLockedCta = "/dashboard";
//   } else if (chatLockReason === "other_roadmap") {
//     chatLockedTitle = "you have other roadmap in continuation";
//     chatLockedDescription = "This course is not your active roadmap. Switch to your active roadmap to continue using the AI companion.";
//     chatLockedCta = "/dashboard";
//   } else if (isAuthenticated) {
//     chatLockedTitle = "AI Build Companion unlocks with a plan";
//     chatLockedDescription = "You can preview milestone 1, but AI guidance, later milestones, and project creation unlock once your plan is active.";
//     chatLockedCta = "/#pricing";
//   } else {
//     chatLockedTitle = "Sign up to unlock your AI Build Companion";
//     chatLockedDescription = "You can preview milestone 1 right away. Sign up and start a plan to unlock AI help, project creation, and the full roadmap.";
//     chatLockedCta = "/signup";
//   }

//   return (
//     <div style={{
//       fontFamily: "'Trebuchet MS', sans-serif",
//       background: "linear-gradient(180deg, #f8f6f2 0%, #f4f0ea 100%)",
//       minHeight: "100vh",
//       display: "flex", flexDirection: "column",
//       overflow: "hidden", height: "100vh",
//     }}>

//       <Navbar
//         sidebarOpen={sidebarOpen}
//         onSidebarToggle={() => setSidebarOpen(o => !o)}
//       />

//       <header style={{
//         minHeight: 58,
//         background: "rgba(255,255,255,0.94)",
//         borderBottom: "1px solid #e8e4f0",
//         display: "flex",
//         alignItems: "center",
//         padding: "10px 22px",
//         gap: 14,
//         flexShrink: 0,
//         zIndex: 40,
//         boxShadow: "0 1px 14px rgba(107,70,193,0.06)",
//         backdropFilter: "blur(12px)",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flexWrap: "wrap" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9991b8", fontFamily: "monospace" }}>
//             <span style={{ color: "#444" }}>Backend Dev</span>
//             <span style={{ color: "#d0c8f0" }}>/</span>
//             <span style={{ color: "#6b46c1", fontWeight: 600 }}>Node.js + Express</span>
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
//             <button
//               type="button"
//               onClick={() => setActiveTab("roadmap")}
//               style={{
//                 border: "1px solid transparent",
//                 background: activeTab === "roadmap" ? "#efe7ff" : "transparent",
//                 color: activeTab === "roadmap" ? "#5b21b6" : "#8b7bb8",
//                 borderRadius: 0,
//                 padding: "8px 12px",
//                 fontSize: 12,
//                 fontWeight: 800,
//                 cursor: "pointer",
//                 boxShadow: "none",
//               }}
//             >
//               Tab 1 · Roadmap
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveTab("booking")}
//               style={{
//                 border: "1px solid transparent",
//                 background: activeTab === "booking" ? "#efe7ff" : "transparent",
//                 color: activeTab === "booking" ? "#5b21b6" : "#8b7bb8",
//                 borderRadius: 0,
//                 padding: "8px 12px",
//                 fontSize: 12,
//                 fontWeight: 800,
//                 cursor: "pointer",
//                 boxShadow: "none",
//               }}
//             >
//               Tab 2 · Booking & Overview
//             </button>
//           </div>
//         </div>

//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
//           <div style={{
//             display: "flex", alignItems: "center", gap: 8,
//             background: "#f0ecfc", borderRadius: 12,
//             padding: "5px 14px", fontSize: 11, fontFamily: "monospace",
//           }}>
//             <div style={{ width: 60, height: 4, background: "#e0d8f8", borderRadius: 3, overflow: "hidden" }}>
//               <div style={{
//                 height: "100%",
//                 width: `${totalLessons ? (completedCount / totalLessons) * 100 : 0}%`,
//                 background: "linear-gradient(90deg, #6b46c1, #f6c90e)",
//                 borderRadius: 3, transition: "width 0.4s",
//               }} />
//             </div>
//             <span style={{ color: "#6b46c1", fontWeight: 700 }}>{completedCount}/{totalLessons} lessons</span>
//           </div>

//           <div style={{
//             background: "#fff8e1", border: "1px solid #f6c90e",
//             borderRadius: 12, padding: "5px 12px",
//             fontSize: 11, fontFamily: "monospace", color: "#b45309", fontWeight: 600,
//           }}>
//             🔥 12-day streak
//           </div>
//         </div>
//       </header>

//       {/* ── BODY ── */}
//       {activeTab === "roadmap" ? (
//       <div style={{
//         flex: 1,
//         display: "flex",
//         gap: 18,
//         overflow: "hidden",
//         position: "relative",
//         padding: "18px 22px 22px",
//         maxWidth: 1520,
//         width: "100%",
//         margin: "0 auto",
//       }}>

//         {/* ── SIDEBAR ── */}
//         <div style={{
//           position: "absolute", left: 0, top: 0, bottom: 0, width: 280,
//           background: "#1e1145", color: "#fff",
//           transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
//           zIndex: 90, overflowY: "auto", display: "flex", flexDirection: "column",
//           boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
//         }}>
//           <div style={{ padding: "20px 18px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
//             <div style={{ fontSize: 10, fontFamily: "monospace", color: "#8b7bb8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
//               Your Dashboard
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
//               <div style={{
//                 width: 40, height: 40, borderRadius: 12,
//                 background: "linear-gradient(135deg, #6b46c1, #f6c90e)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: 13, fontWeight: 700, color: "#fff",
//               }}>
//                 {user?.username?.slice(0, 2).toUpperCase() || "IR"}
//               </div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user?.username || "Student"}</div>
//                 <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace" }}>Backend Dev Path · Active</div>
//               </div>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//               {[
//                 { val: `${completedCount}/${totalLessons}`, label: "Lessons",     color: "#a78bfa" },
//                 { val: "0/2",                               label: "Checkpoints", color: "#f6c90e" },
//                 { val: "#7",                                label: "Leaderboard", color: "#a78bfa" },
//                 { val: "79",                                label: "Avg. Score",  color: "#34d399" },
//               ].map(({ val, label, color }) => (
//                 <div key={label} style={{
//                   background: "rgba(255,255,255,0.06)", borderRadius: 10,
//                   padding: "10px 12px", border: "1px solid rgba(255,255,255,0.08)",
//                 }}>
//                   <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
//                   <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace", marginTop: 3 }}>{label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {sidebarOpen && (
//           <div
//             onClick={() => setSidebarOpen(false)}
//             style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 80 }}
//           />
//         )}

//         {/* ── LEFT: ROADMAP 60% ── */}
//         <div style={{
//           width: "60%",
//           minWidth: 0,
//           overflowY: "auto",
//           padding: "0",
//           display: "flex", flexDirection: "column", gap: 12,
//         }}>
//           {checkpointSuccess && (
//             <div style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 12,
//               padding: "14px 16px",
//               background: "#ecfdf5",
//               border: "1px solid #a7f3d0",
//               borderRadius: 10,
//               color: "#065f46",
//             }}>
//               <div>
//                 <div style={{ fontSize: 12, fontWeight: 800 }}>
//                   Session linked to {checkpointSuccess.title}
//                 </div>
//                 <div style={{ fontSize: 11, fontFamily: "monospace", marginTop: 3 }}>
//                   session_id: {checkpointSuccess.sessionId || "pending"}
//                 </div>
//               </div>
//               <button
//                 onClick={() => setCheckpointSuccess(null)}
//                 style={{
//                   border: "none",
//                   background: "transparent",
//                   color: "#065f46",
//                   fontWeight: 700,
//                   cursor: "pointer",
//                 }}
//               >
//                 Dismiss
//               </button>
//             </div>
//           )}

//           <div style={{ marginBottom: 8 }}>
//             <div style={{
//               background: "#fff",
//               border: "1px solid #e8e4f0",
//               borderRadius: 12,
//               padding: 18,
//               boxShadow: "0 12px 28px rgba(26,16,53,0.05)",
//               marginBottom: 14,
//             }}>
//               <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
//                 Node.js + Express · Backend Developer Path
//               </div>
//               <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1035", margin: 0, lineHeight: 1.2 }}>
//                 Your Learning Roadmap
//               </h1>
//               <p style={{ fontSize: 12, color: "#7b70a0", margin: "6px 0 0", fontFamily: "monospace" }}>
//                 Project: <strong style={{ color: "#6b46c1" }}>Course #{courseId}</strong> · Complete lessons in order. Click a lesson to see topics.
//               </p>

//               <div style={{
//                 marginTop: 16,
//                 display: "grid",
//                 gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
//                 gap: 10,
//               }}>
//                 {[
//                   { label: "Lessons", value: `${completedCount}/${totalLessons}`, color: "#6b46c1" },
//                   { label: "Checkpoints", value: `${checkpoints.length}`, color: "#b45309" },
//                   { label: "Interviews", value: `${interviews.length}`, color: "#059669" },
//                   { label: "AI Access", value: hasDomain ? (hasActiveBooking ? "Unlocked" : "Preview") : "Locked", color: hasDomain ? (hasActiveBooking ? "#059669" : "#6b46c1") : "#dc2626" },
//                 ].map((item) => (
//                   <div
//                     key={item.label}
//                     style={{
//                       background: "#faf9ff",
//                       border: "1px solid #ece7fb",
//                       borderRadius: 8,
//                       padding: "10px 12px",
//                     }}
//                   >
//                     <div style={{ fontSize: 18, fontWeight: 800, color: item.color, lineHeight: 1.1 }}>
//                       {item.value}
//                     </div>
//                     <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
//                       {item.label}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {lessons.length === 0 && (
//             <div style={{ fontSize: 12, color: "#9991b8", fontFamily: "monospace", padding: "20px 0" }}>
//               Loading roadmap...
//             </div>
//           )}

//           {lessons.map((lesson, idx) => {
//             const unlock   = getLessonUnlockState(
//               lesson,
//               progressMap,
//               checkpointMap,
//               checkpointProgressMap,
//               hasActiveBooking,
//               Boolean(user?.uid)
//             );
//             const progress = progressMap[lesson.lesson_id] || null;
//             const isLocked = unlock === "locked";
//             const isDone   = progress?.completed === true;
//             const isActive = !isLocked && !isDone;
//             const isOpen   = openToolbox === lesson.lesson_id;
//             const topics   = lessonTopics[lesson.lesson_id] || [];
//             const isAsked  = askedLessonId === lesson.lesson_id; // visual feedback flag

//             const nextLesson  = lessons[idx + 1];
//             const cpAfterNext = nextLesson?.checkpoint_id
//               ? checkpoints.find(c => c.checkpoint_id === nextLesson.checkpoint_id)
//               : null;
//             const checkpointProgress = cpAfterNext ? checkpointProgressMap[cpAfterNext.checkpoint_id] : null;
//             const checkpointSession = checkpointProgress?.session || null;
//             const checkpointSessionEnded = checkpointSession?.end_time
//               ? new Date(checkpointSession.end_time) <= new Date()
//               : false;
//             const checkpointTeacherMarked = checkpointSession?.marked_by_teacher === true;
//             const checkpointCompleted = checkpointProgress?.completed === true || checkpointTeacherMarked;
//             const checkpointBooked = Boolean(checkpointProgress?.session_id);
//             const checkpointReady = Boolean(cpAfterNext && isDone && !checkpointProgress);

//             return (
//               <div key={lesson.lesson_id}>

//                 {/* ── Outer card — NOT clickable ── */}
//                 <div style={{
//                   background: isLocked ? "#faf8fd" : "#fff",
//                   border: isDone
//                     ? "1.5px solid #d1fae5"
//                     : isActive
//                     ? "1.5px solid #6b46c1"
//                     : "1.5px solid #e8e4f0",
//                   borderRadius: 10, overflow: "hidden",
//                   opacity: isLocked ? 0.55 : 1,
//                   boxShadow: isActive
//                     ? "0 0 0 3px rgba(107,70,193,0.06), 0 10px 24px rgba(107,70,193,0.08)"
//                     : "0 1px 10px rgba(26,16,53,0.04)",
//                   transition: "all 0.2s",
//                 }}>

//                   {/* Row: lesson info + Ask AI — full horizontal flex */}
//                   <div style={{
//                     display: "flex", alignItems: "center",
//                     padding: "14px 16px", gap: 12,
//                   }}>

//                     {/* Left: badge + text — clickable zone for toolbox */}
//                     <div
//                       onClick={() => !isLocked && setOpenToolbox(isOpen ? null : lesson.lesson_id)}
//                       style={{
//                         display: "flex", alignItems: "center", gap: 14,
//                         flex: 1, cursor: isLocked ? "not-allowed" : "pointer",
//                         minWidth: 0, // allows text truncation
//                       }}
//                     >
//                       {/* Order badge */}
//                       <div style={{
//                         width: 40, height: 40, borderRadius: 10, flexShrink: 0,
//                         display: "flex", alignItems: "center", justifyContent: "center",
//                         background: isDone
//                           ? "#d1fae5"
//                           : isActive
//                           ? "linear-gradient(135deg, #6b46c1, #8b5cf6)"
//                           : "#f0ecfc",
//                         color:      isDone ? "#059669" : isActive ? "#fff" : "#c4b5fd",
//                         fontWeight: 800, fontSize: isDone ? 16 : 14, fontFamily: "monospace",
//                         boxShadow: isActive ? "0 2px 8px rgba(107,70,193,0.3)" : "none",
//                       }}>
//                         {isDone ? "✓" : isLocked ? "🔒" : lesson.order_index}
//                       </div>

//                       {/* Title + meta */}
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
//                           <span style={{ fontSize: 14, fontWeight: 700, color: isLocked ? "#aaa" : "#1a1035" }}>
//                             {lesson.title}
//                           </span>
//                           {isDone && (
//                             <span style={{ fontSize: 10, fontFamily: "monospace", background: "#d1fae5", color: "#059669", padding: "2px 8px", borderRadius: 8, fontWeight: 600, flexShrink: 0 }}>
//                               Completed
//                             </span>
//                           )}
//                           {isDone && progress?.quiz_marks != null && (
//                             <span style={{ fontSize: 10, fontFamily: "monospace", background: "#fff8e1", color: "#b45309", padding: "2px 8px", borderRadius: 8, fontWeight: 700, flexShrink: 0 }}>
//                               Marks: {progress.quiz_marks}
//                             </span>
//                           )}
//                           {isActive && (
//                             <span style={{ fontSize: 10, fontFamily: "monospace", background: "#f0ecfc", color: "#6b46c1", padding: "2px 8px", borderRadius: 8, fontWeight: 600, flexShrink: 0 }}>
//                               In Progress
//                             </span>
//                           )}
//                         </div>
//                         <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", lineHeight: 1.5 }}>
//                           Lesson {lesson.order_index} · {topics.length} topics
//                           {isDone && progress?.quiz_marks != null && ` · score ${progress.quiz_marks}/6`}
//                           {/* no locked notice for users without an active booking; roadmap is accessible per Rule 2 */}
//                           {lesson.prerequisite_id && !isDone && ` · Unlocks after Lesson ${lesson.prerequisite_id}`}
//                           {lesson.checkpoint_id && !isDone && ` · Requires Checkpoint ${lesson.checkpoint_id}`}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Right: Ask AI button + chevron — completely outside clickable zone */}
//                     <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
//                       {!isLocked && (
//                         <button
//                           onClick={e => askAi(e, lesson)}
//                           style={{
//                             fontSize: 10, fontFamily: "monospace", fontWeight: 700,
//                             background: !canUseAI ? "#f3f4f6" : isAsked ? "#6b46c1" : "#f0ecfc",
//                             color:      !canUseAI ? "#9ca3af" : isAsked ? "#fff" : "#6b46c1",
//                             border: `1px solid ${!canUseAI ? "#e5e7eb" : isAsked ? "#6b46c1" : "#d8d0f0"}`,
//                             borderRadius: 6, padding: "5px 12px",
//                             cursor: !canUseAI ? "not-allowed" : "pointer",
//                             transition: "all 0.2s",
//                             boxShadow: !canUseAI ? "none" : isAsked ? "0 2px 8px rgba(107,70,193,0.3)" : "none",
//                             transform: !canUseAI ? "scale(1)" : isAsked ? "scale(0.97)" : "scale(1)",
//                           }}
//                         >
//                           {!canUseAI ? "AI Locked" : isAsked ? "Sent ✓" : "Ask AI →"}
//                         </button>
//                       )}

//                       {!isLocked && (
//                         user?.uid ? (
//                           canUseAI ? (
//                             <button
//                               onClick={e => openLessonQuiz(e, lesson.lesson_id)}
//                               style={{
//                                 fontSize: 10, fontFamily: "monospace", fontWeight: 700,
//                                 background: "#fff8e1",
//                                 color: "#b45309",
//                                 border: "1px solid #fde68a",
//                                 borderRadius: 6,
//                                 padding: "5px 12px",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               Take Quiz
//                             </button>
//                           ) : (
//                             <a
//                               href="/#pricing"
//                               style={{
//                                 fontSize: 10,
//                                 fontFamily: "monospace",
//                                 fontWeight: 700,
//                                 background: "#f3f4f6",
//                                 color: "#6b46c1",
//                                 border: "1px solid #e8e4f0",
//                                 borderRadius: 6,
//                                 padding: "5px 12px",
//                                 textDecoration: "none",
//                                 display: "inline-block",
//                               }}
//                             >
//                               See plans to take quiz
//                             </a>
//                           )
//                         ) : (
//                           <a
//                             href="/signup"
//                             style={{
//                               fontSize: 10,
//                               fontFamily: "monospace",
//                               fontWeight: 700,
//                               background: "#f3f4f6",
//                               color: "#6b46c1",
//                               border: "1px solid #e8e4f0",
//                               borderRadius: 6,
//                               padding: "5px 12px",
//                               textDecoration: "none",
//                               display: "inline-block",
//                             }}
//                           >
//                             Sign up to take assesment
//                           </a>
//                         )
//                       )}

//                       {/* Chevron — also outside click zone, just visual */}
//                       {!isLocked && (
//                         <div
//                           onClick={() => setOpenToolbox(isOpen ? null : lesson.lesson_id)}
//                           style={{
//                             cursor: "pointer", padding: "4px",
//                             fontSize: 12, color: "#9991b8",
//                             transform: isOpen ? "rotate(180deg)" : "none",
//                             transition: "transform 0.2s",
//                           }}
//                         >
//                           ▾
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Toolbox */}
//                   {isOpen && (
//                     <div style={{ borderTop: "1px solid #f0ecfc", background: "#faf9ff" }}>
//                       <div style={{ padding: "14px 16px 8px" }}>
//                         <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
//                           Topics in this lesson
//                         </div>

//                         {topics.length === 0 && (
//                           <div style={{ fontSize: 11, color: "#9991b8", fontFamily: "monospace" }}>No topics yet.</div>
//                         )}

//                         {/* Roadmap preview: no locked banner for users without an active booking (Rule 2) */}

//                         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                           {topics.map(topic => {
//                             const resources = normalizeTopicResources(topic);
//                             const hasPractice = Boolean(topic.applied_task);
//                             const hasResources = resources.length > 0;
//                             const isExpanded = Boolean(expandedTopics[topic.topic_id]);

//                             return (
//                               <div key={topic.topic_id} style={{
//                                 background: "#fff", border: "1px solid #e8e4f0",
//                                 borderRadius: 8, overflow: "hidden",
//                               }}>
//                                 <button
//                                   type="button"
//                                   onClick={() => setExpandedTopics((prev) => ({
//                                     ...prev,
//                                     [topic.topic_id]: !prev[topic.topic_id],
//                                   }))}
//                                   style={{
//                                     width: "100%",
//                                     border: "none",
//                                     background: "transparent",
//                                     padding: "11px 12px",
//                                     cursor: "pointer",
//                                   }}
//                                 >
//                                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
//                                     <div style={{ minWidth: 0, textAlign: "left" }}>
//                                       <div style={{ fontWeight: 700, fontSize: 12, color: "#1a1035", lineHeight: 1.4 }}>
//                                         {topic.title}
//                                       </div>
//                                       <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace", marginTop: 3 }}>
//                                         Click to {isExpanded ? "collapse" : "expand"}
//                                       </div>
//                                     </div>
//                                     <div style={{
//                                       width: 20,
//                                       height: 20,
//                                       borderRadius: 6,
//                                       border: "1px solid #ece7fb",
//                                       background: "#faf9ff",
//                                       color: "#6b46c1",
//                                       display: "flex",
//                                       alignItems: "center",
//                                       justifyContent: "center",
//                                       flexShrink: 0,
//                                       fontSize: 12,
//                                       fontWeight: 700,
//                                     }}>
//                                       {isExpanded ? "▾" : "▸"}
//                                     </div>
//                                   </div>
//                                 </button>

//                                 {isExpanded && (
//                                   <div style={{ borderTop: "1px solid #f0ecfc", background: "#faf9ff", padding: "10px 12px 12px" }}>
//                                     <div
//                                       style={{
//                                         display: "grid",
//                                         gridTemplateColumns: hasPractice && hasResources ? "1.4fr 1fr 1fr" : hasPractice || hasResources ? "1.4fr 1fr" : "1fr",
//                                         gap: 10,
//                                         alignItems: "stretch",
//                                       }}
//                                     >
//                                       <div style={{ minWidth: 0 }}>
//                                         <div style={{ fontSize: 9, fontFamily: "monospace", color: "#8b7bb8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
//                                           List
//                                         </div>
//                                         <div style={{ fontSize: 11, color: "#5c5478", lineHeight: 1.55 }}>
//                                           {topic.description}
//                                         </div>
//                                       </div>

//                                       {hasPractice && (
//                                         <div style={{ minWidth: 0, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 10px" }}>
//                                           <div style={{ fontSize: 9, fontFamily: "monospace", color: "#92400e", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>
//                                             Sublist
//                                           </div>
//                                           <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.5 }}>
//                                             {topic.applied_task}
//                                           </div>
//                                         </div>
//                                       )}

//                                       {hasResources && (
//                                         <div style={{ minWidth: 0, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "8px 10px" }}>
//                                           <div style={{ fontSize: 9, fontFamily: "monospace", color: "#0369a1", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>
//                                             Resources
//                                           </div>
//                                           <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//                                             {resources.map((resource) => (
//                                               <a
//                                                 key={resource.url}
//                                                 href={resource.url}
//                                                 target="_blank"
//                                                 rel="noreferrer"
//                                                 style={{
//                                                   fontSize: 11,
//                                                   color: "#0c4a6e",
//                                                   textDecoration: "underline",
//                                                   wordBreak: "break-word",
//                                                 }}
//                                               >
//                                                 {resource.label}
//                                               </a>
//                                             ))}
//                                           </div>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>

//                       {isDone && progress?.quiz_marks != null && (
//                         <div style={{ padding: "0 18px 14px", fontSize: 11, fontFamily: "monospace", color: "#92400e" }}>
//                           Quiz score recorded: <strong>{progress.quiz_marks}/6</strong>
//                         </div>
//                       )}

//                       {isActive && !isDone && (
//                         <div style={{ padding: "10px 18px 14px", display: "flex", gap: 8 }}>
//                           <button
//                             onClick={e => askAi(e, lesson)}
//                             style={{
//                               fontSize: 11, fontFamily: "monospace", fontWeight: 600,
//                               background: !canUseAI ? "#f9fafb" : "#fff",
//                               color: !canUseAI ? "#9ca3af" : "#6b46c1",
//                               border: `1.5px solid ${!canUseAI ? "#e5e7eb" : "#d8d0f0"}`, borderRadius: 8,
//                               padding: "9px 18px", cursor: "pointer",
//                             }}
//                           >
//                             {canUseAI ? "Ask companion about this →" : "AI Locked"}
//                           </button>

//                           {user?.uid ? (
//                             canUseAI ? (
//                               <button
//                                 onClick={e => openLessonQuiz(e, lesson.lesson_id)}
//                                 style={{
//                                   fontSize: 11, fontFamily: "monospace", fontWeight: 700,
//                                   background: "#fff8e1", color: "#b45309",
//                                   border: "1.5px solid #fde68a", borderRadius: 8,
//                                   padding: "9px 18px", cursor: "pointer",
//                                 }}
//                               >
//                                 Start quiz →
//                               </button>
//                             ) : (
//                               <a
//                                 href="/#pricing"
//                                 style={{
//                                   fontSize: 11,
//                                   fontFamily: "monospace",
//                                   fontWeight: 700,
//                                   background: "#f3f4f6",
//                                   color: "#6b46c1",
//                                   border: "1.5px solid #e8e4f0",
//                                   borderRadius: 8,
//                                   padding: "9px 18px",
//                                   textDecoration: "none",
//                                   display: "inline-block",
//                                 }}
//                               >
//                                 See plans to take quiz
//                               </a>
//                             )
//                           ) : (
//                             <a
//                               href="/signup"
//                               style={{
//                                 fontSize: 11,
//                                 fontFamily: "monospace",
//                                 fontWeight: 700,
//                                 background: "#f3f4f6",
//                                 color: "#6b46c1",
//                                 border: "1.5px solid #e8e4f0",
//                                 borderRadius: 8,
//                                 padding: "9px 18px",
//                                 textDecoration: "none",
//                                 display: "inline-block",
//                               }}
//                             >
//                               Sign up to take assesment
//                             </a>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Checkpoint banner */}
//                 {cpAfterNext && (
//                   <div style={{
//                     display: "flex", alignItems: "stretch",
//                     margin: "8px 0", borderRadius: 10, overflow: "hidden",
//                     border: "1.5px solid #fde68a", background: "#fffbeb",
//                   }}>
//                     <div style={{ width: 4, background: "#f6c90e", flexShrink: 0 }} />
//                     <div style={{ flex: 1, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
//                       <span style={{ fontSize: 20 }}>⚑</span>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ fontSize: 12, fontWeight: 700, color: "#78350f" }}>{cpAfterNext.title}</div>
//                         <div style={{ fontSize: 10, fontFamily: "monospace", color: "#92400e", marginTop: 2 }}>{cpAfterNext.description}</div>
//                         <div style={{ fontSize: 10, fontFamily: "monospace", color: "#b45309", marginTop: 3 }}>
//                           status: <strong>{checkpointCompleted ? "completed" : checkpointBooked ? "booked" : checkpointReady ? "ready to book" : "locked"}</strong>
//                           {cpAfterNext.requires_teacher ? " · teacher required" : ""}
//                           {checkpointBooked ? ` · session_id: ${checkpointProgress?.session_id || "pending"}` : ""}
//                           {checkpointBooked && !checkpointSessionEnded ? " · waiting for session to end" : ""}
//                           {checkpointBooked && checkpointSessionEnded && !checkpointTeacherMarked ? " · waiting for teacher sign-off" : ""}
//                         </div>
//                       </div>
//                       {checkpointReady ? (
//                         <button
//                           onClick={() => goToTeacherSelection({
//                             kind: "checkpoint",
//                             id: cpAfterNext.checkpoint_id,
//                             title: cpAfterNext.title || "Mentor Checkpoint",
//                           })}
//                           style={{
//                             border: "none",
//                             background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
//                             color: "#fff",
//                             padding: "10px 14px",
//                             borderRadius: 8,
//                             fontSize: 11,
//                             fontFamily: "monospace",
//                             fontWeight: 700,
//                             cursor: "pointer",
//                             flexShrink: 0,
//                             boxShadow: "0 8px 18px rgba(107,70,193,0.18)",
//                           }}
//                         >
//                           🎉 Select Teacher
//                         </button>
//                       ) : (
//                         <div style={{
//                           fontSize: 10, fontFamily: "monospace",
//                           background: checkpointCompleted ? "#d1fae5" : checkpointBooked ? "#ede9fe" : "#fef9c3",
//                           color:      checkpointCompleted ? "#059669" : checkpointBooked ? "#6b46c1" : "#92400e",
//                           padding: "4px 10px", borderRadius: 8, fontWeight: 700, flexShrink: 0,
//                         }}>
//                           {checkpointCompleted
//                             ? "✓ Passed"
//                             : checkpointBooked && !checkpointSessionEnded
//                             ? "Session Pending"
//                             : checkpointBooked && !checkpointTeacherMarked
//                             ? "Awaiting Review"
//                             : checkpointBooked
//                             ? "Session Booked"
//                             : "Locked"}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {(terminalCheckpoint || interviewOne || interviewTwo) && (
//             <div style={{
//               marginTop: 8,
//               paddingTop: 14,
//               borderTop: "1px dashed #ddd6fe",
//               display: "flex",
//               flexDirection: "column",
//               gap: 12,
//             }}>
//               {terminalCheckpoint && (
//                 <div>
//                   <div style={{
//                     fontSize: 10,
//                     fontFamily: "monospace",
//                     color: "#9991b8",
//                     letterSpacing: 2,
//                     textTransform: "uppercase",
//                     marginBottom: 8,
//                   }}>
//                     Final Checkpoint
//                   </div>
//                   <RoadmapGateCard
//                     kind="checkpoint"
//                     indexLabel="Checkpoint · 5/5"
//                     title={terminalCheckpoint.title || "Final Mentor Checkpoint"}
//                     description={terminalCheckpoint.description || "This is the last mentor checkpoint before your interview milestones begin."}
//                     status={finalCheckpointStatus}
//                     sessionId={terminalCheckpointProgress?.session_id || null}
//                     lockedHint={allLessonsCompleted
//                       ? "Book this final checkpoint with a mentor to unlock interviews."
//                       : "Complete every lesson to unlock the final checkpoint."}
//                     onBook={finalCheckpointStatus === "ready" ? () => goToTeacherSelection({ kind: "checkpoint", id: terminalCheckpoint.checkpoint_id, title: terminalCheckpoint.title || "Final Mentor Checkpoint" }) : null}
//                     bookLabel="Select Teacher"
//                   />
//                 </div>
//               )}

//               {(interviewOne || interviewTwo) && (
//                 <div>
//                   <div style={{
//                     fontSize: 10,
//                     fontFamily: "monospace",
//                     color: "#9991b8",
//                     letterSpacing: 2,
//                     textTransform: "uppercase",
//                     marginBottom: 8,
//                   }}>
//                     Interview Milestones
//                   </div>
//                   <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                     {interviewOne && (
//                       <RoadmapGateCard
//                         kind="interview"
//                         indexLabel="Interview · 1/2"
//                         title={interviewOne.title || "Mock Interview I"}
//                         description={interviewOne.desc || "Practice core questions, answer structure, and how to show what you’ve learned."}
//                         status={interviewOneStatus}
//                         sessionId={interviewOneProgress?.session_id || null}
//                         lockedHint={interviewOneUnlocked
//                           ? "Book this mock interview to move into the final interview round."
//                           : "Complete the final checkpoint to unlock this interview."}
//                         onBook={interviewOneStatus === "ready" ? () => goToTeacherSelection({ kind: "interview", id: interviewOne.interview_id, title: interviewOne.title || "Mock Interview I" }) : null}
//                         bookLabel="Select Teacher"
//                       />
//                     )}
//                     {interviewTwo && (
//                       <RoadmapGateCard
//                         kind="interview"
//                         indexLabel="Interview · 2/2"
//                         title={interviewTwo.title || "Mock Interview II"}
//                         description={interviewTwo.desc || "Bring everything together and show the full depth of your mentor-led learning."}
//                         status={interviewTwoStatus}
//                         sessionId={interviewTwoProgress?.session_id || null}
//                         lockedHint={interviewTwoUnlocked
//                           ? "Book this final interview to finish the roadmap journey."
//                           : "Complete the first interview to unlock this final round."}
//                         onBook={interviewTwoStatus === "ready" ? () => goToTeacherSelection({ kind: "interview", id: interviewTwo.interview_id, title: interviewTwo.title || "Mock Interview II" }) : null}
//                         bookLabel="Select Teacher"
//                       />
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── RIGHT: AI COMPANION 40% ── */}
//         <ChatBox
//           systemPrompt={COMPANION_SYSTEM}
//           contextTags={["Job Tracker API", "Node.js + Express", "Supabase"]}
//           initialMessage="Hey — I'm your Build Companion. I'm here while you work through the roadmap. What are you trying to figure out right now?"
//           pendingMessage={pendingMessage}
//           onPendingConsumed={() => setPendingMessage("")}
//           lessonId={activeLessonId}
//           courseId={courseId}
//           isLocked={chatIsLocked}
//           lockedTitle={chatLockedTitle}
//           lockedDescription={chatLockedDescription}
//           lockedCtaHref={chatLockedCta}
//           lockedFooter={getLockedNotice(user)}
//           onUserMessageSent={handleUserAIMessage}
//         />

//         <LessonQuiz
//           lessonId={quizLessonId}
//           isOpen={quizLessonId !== null}
//           onClose={closeLessonQuiz}
//           onPassed={markLessonComplete}
//           onResultSaved={refreshLessonProgress}
//         />
//       </div>
//       ) : (
//         <div style={{
//           flex: 1,
//           overflowY: "auto",
//           overflowX: "hidden",
//           padding: "18px 22px 22px",
//           width: "100%",
//         }}>
//           <RoadmapBookingOverview
//             user={user}
//             dashboardData={dashboardData}
//             activeCourseData={activeCourseData}
//             selectedCourse={dashboardData?.selectedCourse || null}
//             lessonProgress={dashboardData?.lessonProgress || null}
//             hasAnyBooking={hasAnyBooking}
//             hasActiveBooking={hasActiveBooking}
//             resolvedDomain={resolvedDomain}
//             courseId={courseId}
//             navigate={navigate}
//             onGoToRoadmap={() => setActiveTab("roadmap")}
//           />
//         </div>
//       )}

//       <style>{`
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #e0d8f0; border-radius: 10px; }
//         @keyframes checkpoint-confetti {
//           0% {
//             transform: translate3d(0, 0, 0) rotate(15deg) scale(0.7);
//             opacity: 0;
//           }
//           20% {
//             opacity: 1;
//           }
//           100% {
//             transform: translate3d(0px, -120px, 0) rotate(320deg) scale(1.05);
//             opacity: 0;
//           }
//         }
//       `}</style>

//       <CheckpointCelebrationModal
//         checkpoint={checkpointCelebration}
//         onClose={() => setCheckpointCelebration(null)}
//         onSelectTeacher={goToTeacherSelection}
//       />
//     </div>
//   );
// }
import { AlgoNestRoadmap } from "../components/roadmap-express";

export default function RoadmapExpressPage() {
  return <AlgoNestRoadmap />;
}