import { apiUrl } from "../../config/api.js";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  findReachedCheckpoint,
  getActiveTabFromLocation,
  getCourseIdFromLocation,
  getLockedNotice,
  normalizeCheckpointProgress,
  normalizeTopicResources,
} from "./roadmapUtils";
export default function useAlgoNestRoadmapController() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = getCourseIdFromLocation(location);
  const activeTab = getActiveTabFromLocation(location);

  function setActiveTab(tab) {
    const nextParams = new URLSearchParams(location.search || "");
    nextParams.set("courseId", String(courseId));
    nextParams.set("tab", tab);
    navigate(
      {
        pathname: location.pathname,
        search: `?${nextParams.toString()}`,
      },
      { replace: false, state: location.state || null }
    );
  }

  const [lessons,        setLessons]        = useState([]);
  const [lessonTopics,   setLessonTopics]   = useState({});
  const [checkpoints,    setCheckpoints]    = useState([]);
  const [interviews,     setInterviews]     = useState([]);
  const [progressMap,    setProgressMap]    = useState({});
  const [aiQuestionProgressMap, setAiQuestionProgressMap] = useState({});
  const [assetProgressMap, setAssetProgressMap] = useState({});
  const [commitProofProgressMap, setCommitProofProgressMap] = useState({});
  const [checkpointMap,  setCheckpointMap]  = useState({});
  const [checkpointProgressMap, setCheckpointProgressMap] = useState({});
  const [interviewProgressMap, setInterviewProgressMap] = useState({});
  const [openToolbox,    setOpenToolbox]    = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [askedLessonId,  setAskedLessonId]  = useState(null); // tracks which lesson is "active" for visual feedback
  const [quizLessonId, setQuizLessonId] = useState(null);
  const [checkpointCelebration, setCheckpointCelebration] = useState(null);
  const [checkpointSuccess, setCheckpointSuccess] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeCourseData, setActiveCourseData] = useState(null);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [hasAnyBooking, setHasAnyBooking] = useState(false);
  const [resolvedDomain, setResolvedDomain] = useState(null);
  const [aiInputCount, setAiInputCount] = useState(0);
  const [aiPromptLimit, setAiPromptLimit] = useState(10);
  const [aiLockedByUsage, setAiLockedByUsage] = useState(false);
  const [aiAccessReason, setAiAccessReason] = useState(null);

  function groupProgressRowsByLesson(rows) {
    return (rows || []).reduce((acc, row) => {
      const lessonId = row.lesson_id;
      if (!lessonId) return acc;
      if (!acc[lessonId]) acc[lessonId] = [];
      acc[lessonId].push(row);
      return acc;
    }, {});
  }

  async function refreshLessonProgress() {
    if (!user?.uid) return;

    try {
      const [progressRes, aiQuestionsRes, assetsRes, commitProofsRes] = await Promise.all([
        fetch(apiUrl(`/api/lessons/progress/${user.uid}?courseId=${courseId}`)),
        fetch(apiUrl(`/api/lessons/ai-questions/${user.uid}?courseId=${courseId}`)),
        fetch(apiUrl(`/api/lessons/assets/${user.uid}?courseId=${courseId}`)),
        fetch(apiUrl(`/api/lessons/commit-proofs/${user.uid}?courseId=${courseId}`)),
      ]);
      const progressData = await progressRes.json();
      const aiQuestionsData = await aiQuestionsRes.json();
      const assetsData = await assetsRes.json();
      const commitProofsData = await commitProofsRes.json();

      setProgressMap(
        Object.fromEntries(
          (progressData.data || []).map((progress) => [progress.lesson_id, progress])
        )
      );
      setAiQuestionProgressMap(groupProgressRowsByLesson(aiQuestionsData.data || []));
      setAssetProgressMap(groupProgressRowsByLesson(assetsData.data || []));
      setCommitProofProgressMap(groupProgressRowsByLesson(commitProofsData.data || []));
    } catch (err) {
      console.error("Failed to refresh lesson progress:", err);
    }
  }

  const loadRoadmapData = useCallback(async function loadRoadmapData() {
    try {
      const requests = [
        fetch(apiUrl(`/api/lessons/lessons?courseId=${courseId}`)),
        fetch(apiUrl(`/api/lessons/checkpoints?courseId=${courseId}`)),
        fetch(apiUrl(`/api/lessons/interviews?courseId=${courseId}`)),
      ];

      if (user?.uid) {
        requests.push(fetch(apiUrl(`/api/dashboard/active-course/${user.uid}`)));
        // Also fetch dashboard summary which includes hasAnyBooking and activeCourse
        requests.push(fetch(apiUrl(`/api/dashboard/getDashboard/${user.uid}`)));
        requests.push(fetch(apiUrl("/api/ai/access"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, courseId }),
        }));
        requests.push(fetch(apiUrl(`/api/lessons/progress/${user.uid}?courseId=${courseId}`)));
        requests.push(fetch(apiUrl(`/api/lessons/checkpoint-progress/${user.uid}?courseId=${courseId}`)));
        requests.push(fetch(apiUrl(`/api/lessons/interview-progress/${user.uid}?courseId=${courseId}`)));
        requests.push(fetch(apiUrl(`/api/lessons/ai-questions/${user.uid}?courseId=${courseId}`)));
        requests.push(fetch(apiUrl(`/api/lessons/assets/${user.uid}?courseId=${courseId}`)));
        requests.push(fetch(apiUrl(`/api/lessons/commit-proofs/${user.uid}?courseId=${courseId}`)));
      }

      const responses = await Promise.all(requests);
      const [
        lessonsRes,
        checkpointsRes,
        interviewsRes,
        activeCourseRes,
        dashboardRes,
        aiAccessRes,
        progressRes,
        checkpointProgressRes,
        interviewProgressRes,
        aiQuestionsRes,
        assetsRes,
        commitProofsRes,
      ] = responses;
      const lessonsData = await lessonsRes.json();
      const checkpointsData = await checkpointsRes.json();
      const interviewsData = await interviewsRes.json();
      // responses array may include additional entries when user is logged in
      const visibleLessons = (lessonsData.data || []).filter(
        (lesson) => Number(lesson.order_index) >= 1
      );

      setLessons(visibleLessons);
      setCheckpoints(checkpointsData.data || []);
      setInterviews(interviewsData.data || []);
      setLessonTopics({});

      // derive booking state from dashboard summary if available
      if (user?.uid) {
        let activeCourseJson = null;
        let dashboardJson = null;

        try {
          activeCourseJson = await activeCourseRes.json();
          setActiveCourseData(activeCourseJson.course || null);
        } catch (e) {
          setActiveCourseData(null);
        }

        try {
          dashboardJson = await dashboardRes.json();
          setDashboardData(dashboardJson.data || null);
        } catch (e) {
          setDashboardData(null);
        }

        try {
          const aiAccessJson = await aiAccessRes.json();
          const promptCount = Number(aiAccessJson?.promptCount || 0);
          const promptLimit = Number(aiAccessJson?.promptLimit || 10);
          setAiInputCount(promptCount);
          setAiPromptLimit(promptLimit);
          setAiAccessReason(aiAccessJson?.reason || null);
          setAiLockedByUsage(aiAccessJson?.reason === "free_prompt_limit" || promptCount >= promptLimit);
        } catch (e) {
          setAiInputCount(0);
          setAiPromptLimit(10);
          setAiAccessReason(null);
          setAiLockedByUsage(false);
        }

        const dashboardDataValue = dashboardJson?.data || null;
        const activeCourseDataValue = activeCourseJson?.course || null;
        const dashboardActiveCourse = dashboardDataValue?.activeCourse || null;
        const dashboardHasAnyBooking = Boolean(dashboardDataValue?.hasAnyBooking);
        const dashboardDomain =
          dashboardDataValue?.domain ||
          dashboardDataValue?.profile?.domain ||
          dashboardActiveCourse?.domain ||
          activeCourseDataValue?.domain ||
          null;

        // A booking is valid for this roadmap if activeCourse exists and its courseId matches
        const validForThisCourse = (dashboardActiveCourse && Number(dashboardActiveCourse.courseId) === Number(courseId));

        setHasActiveBooking(Boolean(validForThisCourse));
        setHasAnyBooking(dashboardHasAnyBooking);
        setResolvedDomain(dashboardDomain);
      } else {
        setHasActiveBooking(false);
        setHasAnyBooking(false);
        setResolvedDomain(null);
        setAiInputCount(0);
        setAiPromptLimit(10);
        setAiAccessReason(null);
        setAiLockedByUsage(false);
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

      if (aiQuestionsRes) {
        const aiQuestionsData = await aiQuestionsRes.json();
        setAiQuestionProgressMap(groupProgressRowsByLesson(aiQuestionsData.data || []));
      } else {
        setAiQuestionProgressMap({});
      }

      if (assetsRes) {
        const assetsData = await assetsRes.json();
        setAssetProgressMap(groupProgressRowsByLesson(assetsData.data || []));
      } else {
        setAssetProgressMap({});
      }

      if (commitProofsRes) {
        const commitProofsData = await commitProofsRes.json();
        setCommitProofProgressMap(groupProgressRowsByLesson(commitProofsData.data || []));
      } else {
        setCommitProofProgressMap({});
      }

      if (checkpointProgressRes) {
        const checkpointProgressData = await checkpointProgressRes.json();
        setCheckpointProgressMap(normalizeCheckpointProgress(checkpointProgressData.data || []));
      } else {
        setCheckpointProgressMap({});
      }

      if (interviewProgressRes) {
        const interviewProgressData = await interviewProgressRes.json();
        setInterviewProgressMap(
          Object.fromEntries(
            (interviewProgressData.data || []).map((row) => [row.interview_id, row])
          )
        );
      } else {
        setInterviewProgressMap({});
      }
    } catch (err) {
      console.error("Failed to load roadmap data:", err);
    }
  }, [courseId, user?.uid]);

  useEffect(() => {
    loadRoadmapData();
  }, [loadRoadmapData]);

  function handleUserAIMessage() {
    if (!user?.uid) return;
    // only count preview usage when AI is actually available
    if (!canUseAI || hasActiveBooking) return;

    const next = aiInputCount + 1;
    setAiInputCount(next);
    if (next >= aiPromptLimit) {
      setAiLockedByUsage(true);
      setAiAccessReason("free_prompt_limit");
    }
  }

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
      setCheckpointProgressMap({});
      setAiQuestionProgressMap({});
      setAssetProgressMap({});
      setCommitProofProgressMap({});
      setResolvedDomain(null);
      setAiInputCount(0);
      setAiPromptLimit(10);
      setAiAccessReason(null);
      setAiLockedByUsage(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    const success = location.state?.gateBookingSuccess
      || location.state?.checkpointBookingSuccess
      || location.state?.interviewBookingSuccess;
    if (!success) return;

    setCheckpointSuccess(success);
    if (success.kind === "interview") {
      setInterviewProgressMap((prev) => ({
        ...prev,
        [success.interviewId]: {
          interview_sessions_id: `local-${success.interviewId}`,
          interview_id: success.interviewId,
          session_id: success.sessionId,
          notes: null,
          completed: false,
          completed_at: null,
          status: "BOOKED",
          session: null,
        },
      }));
    } else {
      setCheckpointProgressMap((prev) => ({
        ...prev,
        [success.checkpointId]: {
          id: `local-${success.checkpointId}`,
          checkpoint_id: success.checkpointId,
          s_id: null,
          status: "BOOKED",
          completed: false,
          completed_at: null,
          session_id: success.sessionId,
          created_at: new Date().toISOString(),
          session: null,
        },
      }));
    }
    setCheckpointCelebration(null);
    navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    const dashboardPrompt = location.state?.dashboardAiPrompt;
    if (!dashboardPrompt) return;

    setPendingMessage(dashboardPrompt);

    const nextState = { ...(location.state || {}) };
    delete nextState.dashboardAiPrompt;

    navigate({ pathname: location.pathname, search: location.search }, {
      replace: true,
      state: Object.keys(nextState).length ? nextState : null,
    });
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    if (!user?.uid || !lessons.length || !checkpoints.length) return;

    const reached = findReachedCheckpoint(lessons, checkpoints, progressMap, checkpointProgressMap);
    if (!reached) return;

    const celebrationKey = `checkpoint-celebrated:${user.uid}:${reached.checkpoint.checkpoint_id}`;
    if (localStorage.getItem(celebrationKey)) return;

    localStorage.setItem(celebrationKey, "1");
    setCheckpointCelebration(reached.checkpoint);
  }, [checkpoints, lessons, progressMap, checkpointProgressMap, user?.uid]);

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
    if (!canUseAI) return;
    setAskedLessonId(lesson.lesson_id); // visual feedback
    setActiveLessonId(lesson.lesson_id);
    setPendingMessage(
      `I'm on "${lesson.title}" (Lesson ${lesson.order_index}). Can you help me understand this?`
    );
    // clear visual feedback after 1.5s
    setTimeout(() => setAskedLessonId(null), 1500);
  }

  function askSeededLessonQuestion(lesson, question) {
    if (!canUseAI) return;
    setAskedLessonId(lesson.lesson_id);
    setActiveLessonId(lesson.lesson_id);
    setPendingMessage(
      `I'm on "${lesson.title}" (Lesson ${lesson.order_index}). ${question}`
    );
    setTimeout(() => setAskedLessonId(null), 1500);
  }

  function openLessonQuiz(e, lessonId) {
    e.stopPropagation();
    if (!user?.uid) {
      // Not logged in — send to signup to satisfy Rule 1 (quizzes locked)
      navigate("/signup");
      return;
    }
    // Allow quiz whenever the student currently has AI access.
    // That includes active bookings and the limited AI preview window.
    if (!canUseAI) {
      navigate("/#pricing");
      return;
    }

    setQuizLessonId(lessonId);
  }

  function closeLessonQuiz() {
    setQuizLessonId(null);
  }

  function goToTeacherSelection(gate) {
    if (!gate) return;

    setCheckpointCelebration(null);
    navigate("/teachers", {
      state: {
        gateFlow: {
          kind: gate.kind,
          checkpointId: gate.kind === "checkpoint" ? gate.id : null,
          interviewId: gate.kind === "interview" ? gate.id : null,
          title: gate.title,
          courseId,
          returnTo: `/roadmap_express?courseId=${courseId}`,
        },
      },
    });
  }

  const completedCount = Object.values(progressMap).filter(p => p.completed).length;
  const totalLessons   = lessons.length;
  const lessonCheckpointIds = new Set(lessons.map((lesson) => lesson.checkpoint_id).filter(Boolean));
  const terminalCheckpoint = [...checkpoints]
    .filter((checkpoint) => !lessonCheckpointIds.has(checkpoint.checkpoint_id))
    .sort((a, b) => Number(a.checkpoint_id) - Number(b.checkpoint_id))
    .at(-1) || null;
  const terminalCheckpointProgress = terminalCheckpoint ? checkpointProgressMap[terminalCheckpoint.checkpoint_id] : null;
  const allLessonsCompleted = totalLessons > 0 && lessons.every((lesson) => progressMap[lesson.lesson_id]?.completed === true);
  const terminalCheckpointCompleted = Boolean(
    terminalCheckpointProgress?.completed === true ||
    terminalCheckpointProgress?.session?.marked_by_teacher === true
  );
  const terminalCheckpointPending = Boolean(
    terminalCheckpointProgress?.session_id && !terminalCheckpointCompleted
  );
  const interviewOne = interviews[0] || null;
  const interviewTwo = interviews[1] || null;
  const interviewOneProgress = interviewOne ? interviewProgressMap[interviewOne.interview_id] : null;
  const interviewTwoProgress = interviewTwo ? interviewProgressMap[interviewTwo.interview_id] : null;
  const interviewOneUnlocked = terminalCheckpointCompleted;
  const interviewTwoUnlocked = Boolean(interviewOneProgress?.completed === true);
  const interviewOneCompleted = Boolean(interviewOneProgress?.completed === true);
  const interviewTwoCompleted = Boolean(interviewTwoProgress?.completed === true);
  const finalCheckpointCanBook = Boolean(
    terminalCheckpoint && allLessonsCompleted && hasActiveBooking && !terminalCheckpointCompleted && !terminalCheckpointPending
  );
  const finalCheckpointStatus = terminalCheckpointCompleted
    ? "completed"
    : terminalCheckpointPending
    ? "pending"
    : finalCheckpointCanBook
    ? "ready"
    : "locked";
  const interviewOneStatus = interviewOneCompleted
    ? "completed"
    : interviewOneProgress?.session_id
    ? "pending"
    : interviewOneUnlocked
    ? "ready"
    : "locked";
  const interviewTwoStatus = interviewTwoCompleted
    ? "completed"
    : interviewTwoProgress?.session_id
    ? "pending"
    : interviewTwoUnlocked
    ? "ready"
    : "locked";

  // Determine AI/chat availability based on selected roadmap + project + booking state
  const isAuthenticated = Boolean(user?.uid);
  const selectedRoadmapCourseId =
    dashboardData?.activeCourse?.courseId ||
    dashboardData?.activeCourse?.course_id ||
    dashboardData?.selectedCourse?.courseId ||
    dashboardData?.selectedCourse?.course_id ||
    dashboardData?.profile?.course_id ||
    null;
  const hasSelectedRoadmap = Boolean(selectedRoadmapCourseId);
  const isSelectedRoadmap = Number(selectedRoadmapCourseId) === Number(courseId);
  const hasDomain = hasSelectedRoadmap;
  const hasProjectTitle = Boolean(dashboardData?.profile?.project_title);
  let canUseAI = false;
  let chatLockReason = null; // e.g., "other_roadmap"

  if (isAuthenticated) {
    if (!hasSelectedRoadmap) {
      canUseAI = false;
      chatLockReason = "no_roadmap";
    } else if (!hasProjectTitle) {
      canUseAI = false;
      chatLockReason = "no_project";
    } else if (hasActiveBooking) {
      // Active booking for this roadmap: full AI access
      canUseAI = true;
    } else if (!isSelectedRoadmap || (hasAnyBooking && !hasActiveBooking)) {
      // User has selected or booked another course -> disallow chat
      canUseAI = false;
      chatLockReason = "other_roadmap";
    } else {
      // No bookings at all — allow AI preview up to 10 messages
      canUseAI = !aiLockedByUsage;
    }
  } else {
    // Anonymous users: AI input disallowed (preview-only conversation shown)
    canUseAI = false;
  }

  const chatIsLocked = !canUseAI;
  let chatLockedTitle = "";
  let chatLockedDescription = "";
  let chatLockedCta = "/#pricing";

  if (aiLockedByUsage) {
    chatLockedTitle = "AI limit exhausted - booking needed";
    chatLockedDescription = `You have used all ${aiPromptLimit} free AI prompts. Book a plan to continue AI guidance, assessments, lesson progress, checkpoints, and mentor review.`;
    chatLockedCta = "/#pricing";
  } else if (chatLockReason === "no_roadmap") {
    chatLockedTitle = "Select a roadmap first";
    chatLockedDescription = "AI depends on your selected roadmap and project. Choose a roadmap in your dashboard before using the companion.";
    chatLockedCta = "/dashboard";
  } else if (chatLockReason === "no_project") {
    chatLockedTitle = "Feed project title first";
    chatLockedDescription = "AI Companion needs your project context. Please go to your Profile and feed your 'Featured Project Title' first.";
    chatLockedCta = "/dashboard";
  } else if (chatLockReason === "other_roadmap") {
    chatLockedTitle = "you have other roadmap in continuation";
    chatLockedDescription = "This course is not your active roadmap. Switch to your active roadmap to continue using the AI companion.";
    chatLockedCta = "/dashboard";
  } else if (isAuthenticated) {
    chatLockedTitle = "AI Build Companion unlocks with a plan";
    chatLockedDescription = `You can preview milestone 1 and send up to ${aiPromptLimit} prompts (${aiInputCount}/${aiPromptLimit} used). Full AI guidance, all milestones, and mentor reviews unlock once your plan is active.`;
    chatLockedCta = "/#pricing";
  } else {
    chatLockedTitle = "Sign up to unlock your AI Build Companion";
    chatLockedDescription = "You can preview milestone 1 right away. Sign up and start a plan to unlock AI help, project creation, and the full roadmap.";
    chatLockedCta = "/signup";
  }



  return {
  activeCourseData,
  activeLessonId,
  activeTab,
  aiQuestionProgressMap,
  allLessonsCompleted,
  askAi,
  askSeededLessonQuestion,
  askedLessonId,
  assetProgressMap,
  commitProofProgressMap,
  canUseAI,
  chatIsLocked,
  chatLockedCta,
  chatLockedDescription,
  chatLockedTitle,
  chatLockReason: aiAccessReason || chatLockReason,
  checkpoints,
  checkpointCelebration,
  checkpointMap,
  checkpointProgressMap,
  checkpointSuccess,
  closeLessonQuiz,
  completedCount,
  courseId,
  dashboardData,
  expandedTopics,
  finalCheckpointStatus,
  getLockedNotice,
  goToTeacherSelection,
  handleUserAIMessage,
  hasActiveBooking,
  hasAnyBooking,
  hasDomain,
  interviews,
  interviewOne,
  interviewOneProgress,
  interviewOneStatus,
  interviewOneUnlocked,
  interviewTwo,
  interviewTwoProgress,
  interviewTwoStatus,
  interviewTwoUnlocked,
  isAuthenticated,
  lessonTopics,
  lessons,
  markLessonComplete,
  navigate,
  normalizeTopicResources,
  openLessonQuiz,
  openToolbox,
  pendingMessage,
  progressMap,
  quizLessonId,
  refreshLessonProgress,
  resolvedDomain,
  setActiveTab,
  setCheckpointCelebration,
  setCheckpointSuccess,
  setExpandedTopics,
  setOpenToolbox,
  setPendingMessage,
  setSidebarOpen,
  sidebarOpen,
  terminalCheckpoint,
  terminalCheckpointProgress,
  totalLessons,
  user,
  };
}

