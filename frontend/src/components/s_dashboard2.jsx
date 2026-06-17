import { apiUrl } from "../config/api.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const C = {
  purple: "#6b46c1",
  purpleDark: "#4c1d95",
  purpleLight: "#f3eeff",
  purpleTint: "#ede9fa",
  yellow: "#f6c90e",
  yellowLight: "#fff8dd",
  ink: "#21153f",
  muted: "#766f8e",
  border: "#e8e1f5",
  bg: "#faf8ff",
  white: "#ffffff",
  green: "#16a34a",
  greenLight: "#dcfce7",
  blue: "#0ea5e9",
  blueLight: "#e0f2fe",
  red: "#dc2626",
  redLight: "#fef2f2",
};

const font = "'Trebuchet MS', 'Trebuchet', sans-serif";

const defaultInterviewSlots = [
  {
    title: "Mock Interview",
    mentorName: "Mentor to be assigned",
    start_time: null,
    notes: "This slot will appear once your mentor schedules it.",
    status: "PENDING",
  },
  {
    title: "Final Mock Interview",
    mentorName: "Mentor to be assigned",
    start_time: null,
    notes: "Final round planning and notes will appear here later.",
    status: "PENDING",
  },
];

function getInitials(name = "Student") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "ST";
}

function formatDateLabel(value, fallback = "Not scheduled yet") {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTimeLabel(value, fallback = "Date & time to be scheduled") {
  if (!value) return fallback;
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getCurrentRoadmap(data) {
  return data?.roadmapContext?.roadmap || data?.activeCourse || data?.selectedCourse || null;
}

function buildStudentView(data) {
  const profile = data?.profile || {};
  const activeCourse = getCurrentRoadmap(data);

  return {
    name: profile.name || "Student",
    avatar: getInitials(profile.name || "Student"),
    cohort: profile.education || "AlgoNest Learner",
    track: activeCourse?.title || "Project Workspace",
    stack: activeCourse?.desc || "Build one practical step at a time",
    packageStart: formatDateLabel(activeCourse?.booking_date, "Starts after plan activation"),
    packageEnd: formatDateLabel(activeCourse?.expiry_date, "Unlock a plan to begin"),
  };
}

function buildInterviewSlots(data) {
  const interviews = data?.interviews || [];

  return defaultInterviewSlots.map((slot, index) => ({
    ...slot,
    ...(interviews[index] || {}),
    title: slot.title,
  }));
}

function buildNewsFeed({ data, sessionInfo }) {
  const lessonProgress = data?.lessonProgress || {};
  const activeCourse = getCurrentRoadmap(data);
  const interviews = buildInterviewSlots(data);

    return [
      {
        type: "Roadmap Signal",
        title: lessonProgress?.nextLessonTitle
        ? `Next checkpoint to defend: ${lessonProgress.nextLessonTitle}`
        : activeCourse
        ? `Your route is live: ${activeCourse.title}`
        : "You can preview milestone 1 right now",
      body: lessonProgress?.nextLessonTitle
        ? "Stay close to the next checkpoint so you move into it with confidence."
        : activeCourse
        ? "Your project path is active. Keep momentum steady and use sessions before assessment deadlines pile up."
        : "Explore the first milestone and see how the guided proof flow feels before you commit to a plan.",
      accent: C.purple,
      bg: C.purpleLight,
    },
    {
      type: "Session Signal",
      title:
        sessionInfo.status === "ACTIVE"
          ? "Your AlgoNest session is live now"
          : sessionInfo.status === "UPCOMING"
          ? "Upcoming mentor session on your calendar"
          : "No active live session yet",
      body:
        sessionInfo.status === "ACTIVE"
          ? "Join your current session and take your blocker list with you."
          : sessionInfo.status === "UPCOMING"
          ? `Get ready for ${formatDateTimeLabel(sessionInfo.session?.start_time)} and prepare your top 3 questions.`
          : "Once you activate a plan, live sessions and checkpoint support will show up here.",
      accent: C.green,
      bg: C.greenLight,
    },
    {
      type: "Interview Track",
      title: interviews[0]?.start_time
        ? `${interviews[0].title} is on the horizon`
        : "Interview loop is waiting for route progress",
      body: interviews[0]?.start_time
        ? `Your next interview checkpoint is scheduled for ${formatDateTimeLabel(interviews[0].start_time)}.`
        : "Mock interviews will appear here as your route and mentor journey move forward.",
      accent: C.blue,
      bg: C.blueLight,
    },
  ];
}

function buildOpportunityFeed({ data, hasAnyBooking }) {
  const activeCourse = getCurrentRoadmap(data);
  const lessonProgress = data?.lessonProgress || {};
  const remainingSessions = activeCourse?.remainingSessions ?? null;
  const hasRoadmap = Boolean(activeCourse);

  return [
    {
      eyebrow: "Announcement",
      title: hasRoadmap ? "Your roadmap is active" : "You are in preview mode",
      body: hasRoadmap
        ? `Your current roadmap stays available until ${formatDateLabel(activeCourse?.expiry_date, "your plan window ends")}.`
        : "Preview the first milestone, explore the experience, and activate a plan when you want the full project system.",
    },
    {
      eyebrow: "Mentor Content",
      title: hasAnyBooking ? "Use mentor time strategically" : "Mentor reviews unlock with a plan",
      body: hasAnyBooking
        ? `${remainingSessions ?? 0} session(s) remain. Save one for checkpoint review if your next step feels shaky.`
        : "Mentor guidance, checkpoint reviews, and live sessions open after your first booking.",
    },
    {
      eyebrow: "Opportunity",
      title: lessonProgress?.completedLessons > 0 ? "Your proof of work is growing" : "Your first shipped milestone matters most",
      body: lessonProgress?.completedLessons > 0
        ? "Each completed checkpoint gets you closer to a portfolio that actually reflects real proof."
        : "Even one completed milestone creates useful proof of consistency. Start with momentum, not perfection.",
    },
  ];
}

function buildQuickPrompts({ data, sessionInfo }) {
  const hasRoadmap = Boolean(getCurrentRoadmap(data));
  const nextLesson = data?.lessonProgress?.nextLessonTitle;
  const currentTrack = getCurrentRoadmap(data)?.title || "my roadmap";
  const upcomingInterview = buildInterviewSlots(data).find((slot) => slot.start_time);

  if (!hasRoadmap) {
    return [
      "Show me how the AI Build Companion would guide me through milestone 1.",
      "What kind of project help do I unlock once I activate a plan?",
      "Help me understand how AlgoNest combines route, AI, and mentor checkpoints.",
    ];
  }

  return [
    nextLesson
      ? `Help me understand "${nextLesson}" before I start building.`
      : `Help me plan my next move in ${currentTrack}.`,
    sessionInfo.status === "UPCOMING"
      ? "What should I prepare before my next AlgoNest session?"
      : "What should I prepare for my next checkpoint?",
    upcomingInterview?.start_time
      ? `How should I prepare for my upcoming ${upcomingInterview.title}?`
      : "Show me how to think through my backend project architecture.",
  ];
}

function getSessionJoinLink(session) {
  return session?.join_url || session?.session_link || null;
}

const Surface = ({ children, accent = C.purple, style = {} }) => (
  <div
    style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 24,
      padding: 22,
      boxShadow: "0 14px 38px rgba(76, 29, 149, 0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Pill = ({ children, bg = C.purpleLight, color = C.purple }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 999,
      background: bg,
      color,
      fontSize: 10,
      fontFamily: font,
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </span>
);

const ActionButton = ({ children, onClick, href, subtle = false, disabled = false }) => {
  const shared = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    padding: "11px 16px",
    fontFamily: font,
    fontSize: 12,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    border: subtle ? `1px solid ${C.border}` : "none",
    background: disabled
      ? "#e5e7eb"
      : subtle
      ? C.white
      : "linear-gradient(135deg, #6b46c1, #8b5cf6)",
    color: disabled ? "#9ca3af" : subtle ? C.purple : C.white,
    boxShadow: disabled || subtle ? "none" : "0 10px 24px rgba(107,70,193,0.18)",
  };

  if (href) {
    return (
      <a href={href} style={shared}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} style={shared}>
      {children}
    </button>
  );
};

const LockedPanel = ({ title, body, ctaHref = "/#pricing", ctaLabel = "See Plans" }) => (
  <Surface accent={C.yellow}>
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          background: C.purpleLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          flexShrink: 0,
        }}
      >
        🔒
      </div>
      <div>
        <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6 }}>
          Locked
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
          {body}
        </div>
        <div style={{ marginTop: 16 }}>
          <ActionButton href={ctaHref}>{ctaLabel}</ActionButton>
        </div>
      </div>
    </div>
  </Surface>
);

function HomeTab({ data, hasAnyBooking }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const student = buildStudentView(data);
  const interviews = buildInterviewSlots(data);
  const activeCourse = getCurrentRoadmap(data);
  const lessonProgress = data?.lessonProgress || {};
  const [sessionInfo, setSessionInfo] = useState({
    status: "NONE",
    session: null,
  });

  useEffect(() => {
    async function loadSession() {
      try {
        if (!user?.uid) return;

        const res = await fetch(apiUrl("/api/session/check"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        const payload = await res.json();
        setSessionInfo({
          status: payload?.data?.state || "NONE",
          session: payload?.data?.session || null,
        });
      } catch (error) {
        console.error("Session load failed:", error);
      }
    }

    loadSession();
  }, [user?.uid]);

  const newsFeed = useMemo(() => buildNewsFeed({ data, sessionInfo }), [data, sessionInfo]);
  const opportunityFeed = useMemo(() => buildOpportunityFeed({ data, hasAnyBooking }), [data, hasAnyBooking]);
  const quickPrompts = useMemo(
    () => buildQuickPrompts({ data, sessionInfo }),
    [data, sessionInfo]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18}}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          background: "linear-gradient(135deg, #1e1145 0%, #6b46c1 56%, #8b5cf6 100%)",
          padding: "28px 30px",
          boxShadow: "0 18px 46px rgba(76, 29, 149, 0.18)",
          color: C.white,
        }}
      >
        <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", right: -70, top: -90 }} />
        <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "rgba(246,201,14,0.16)", right: 180, bottom: -30 }} />

        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 24 }}>
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <Pill bg="rgba(255,255,255,0.12)" color={C.white}>{student.cohort}</Pill>
              <Pill bg="rgba(246,201,14,0.18)" color={C.yellow}>{activeCourse ? "Active roadmap" : "Preview mode"}</Pill>
            </div>
            <div style={{ fontSize: 31, fontWeight: 800, lineHeight: 1.2 }}>
              This is your build workspace, {student.name.split(" ")[0]}.
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, maxWidth: 720 }}>
              Track your route, stay ready for sessions and checkpoints, and keep the next meaningful action visible every time you log in.
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <ActionButton onClick={() => navigate(`/roadmap_express?courseId=${activeCourse?.courseId || 1}`)}>
                {activeCourse ? "Continue Your Roadmap" : "Explore Milestone 1"}
              </ActionButton>
              <ActionButton href={hasAnyBooking ? "/teachers" : "/#pricing"} subtle>
                {hasAnyBooking ? "Browse Teachers" : "See Plans"}
              </ActionButton>
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.16)",
              padding: 18,
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                [activeCourse?.title || "Route preview", "Current path"],
                [`${lessonProgress.completedLessons || 0}/${lessonProgress.totalLessons || 1}`, "Checkpoints done"],
                [`${lessonProgress.progressPct || 0}%`, "Progress"],
                [sessionInfo.status === "ACTIVE" ? "Live now" : sessionInfo.status === "UPCOMING" ? "Upcoming" : "Quiet", "Session state"],
              ].map(([value, label]) => (
                <div key={label} style={{ padding: "12px 14px", borderRadius: 18, background: "rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{value}</div>
                  <div style={{ marginTop: 4, fontSize: 10, color: "rgba(255,255,255,0.68)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>Roadmap completion</span>
                <span style={{ fontSize: 11, fontWeight: 800 }}>{lessonProgress.progressPct || 0}%</span>
              </div>
              <div style={{ height: 9, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${lessonProgress.progressPct || 0}%`, borderRadius: 999, background: `linear-gradient(90deg, ${C.yellow}, #fff2ad)` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 18 }}>
        <Surface accent={C.purple}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18 }}>
            <div>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>
                Continue Your Route
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.ink }}>
                {activeCourse?.title || "Start with milestone one"}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                {activeCourse?.desc || "You can explore the first milestone right now. Activate a plan to unlock the full guided proof system."}
              </div>
            </div>
            <Pill bg={C.yellowLight} color="#8a5a00">{activeCourse?.planTitle || "No plan yet"}</Pill>
          </div>

          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div style={{ padding: "14px 14px", borderRadius: 18, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.purple }}>{lessonProgress.completedLessons || 0}</div>
              <div style={{ marginTop: 4, fontSize: 11, color: C.muted }}>Checkpoints completed</div>
            </div>
            <div style={{ padding: "14px 14px", borderRadius: 18, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.purple }}>{lessonProgress.remainingLessons || 0}</div>
              <div style={{ marginTop: 4, fontSize: 11, color: C.muted }}>Checkpoints remaining</div>
            </div>
            <div style={{ padding: "14px 14px", borderRadius: 18, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.purple, lineHeight: 1.35 }}>
                {lessonProgress.nextLessonTitle || "Checkpoint gate ahead"}
              </div>
              <div style={{ marginTop: 4, fontSize: 11, color: C.muted }}>Next checkpoint</div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: 18, background: C.purpleLight }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>Assessment window</div>
              <div style={{ marginTop: 4, fontSize: 11, color: C.muted }}>
                {student.packageStart} to {student.packageEnd}
              </div>
            </div>
            <ActionButton onClick={() => navigate(`/roadmap_express?courseId=${activeCourse?.courseId || 1}`)}>Go to Route</ActionButton>
          </div>
        </Surface>

        <Surface accent={C.yellow}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>
            AI Prompt / Quick Actions
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>
            Open your AI Build Companion with a useful starting prompt.
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            Jump into the route and let the companion pick up context from where you are, instead of starting from a blank page.
          </div>

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => navigate(`/roadmap_express?courseId=${activeCourse?.courseId || 1}`, { state: { dashboardAiPrompt: prompt } })}
                style={{
                  textAlign: "left",
                  borderRadius: 16,
                  border: `1px solid ${C.border}`,
                  background: C.bg,
                  padding: "12px 14px",
                  fontFamily: font,
                  fontSize: 12,
                  color: C.ink,
                  cursor: "pointer",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </Surface>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Surface accent={sessionInfo.status === "ACTIVE" ? C.green : C.blue}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>
            Upcoming Checkpoint / Session
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: "14px 16px", borderRadius: 18, background: sessionInfo.status === "ACTIVE" ? C.greenLight : C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.ink }}>AlgoNest Session</div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 800, color: C.purple }}>
                {sessionInfo.session?.title || "No live session booked"}
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                {sessionInfo.session?.start_time
                  ? formatDateTimeLabel(sessionInfo.session.start_time)
                  : "Your next live session will appear here after scheduling."}
              </div>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 18, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.ink }}>{interviews[0].title}</div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 800, color: C.purple }}>
                {interviews[0].mentorName || "Mentor to be assigned"}
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                {formatDateTimeLabel(interviews[0].start_time)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ActionButton
              onClick={() => {
                const joinLink = getSessionJoinLink(sessionInfo.session);
                if (sessionInfo.status === "ACTIVE" && joinLink) {
                  window.location.href = joinLink;
                }
              }}
              disabled={sessionInfo.status !== "ACTIVE" || !getSessionJoinLink(sessionInfo.session)}
            >
              Join Current Session
            </ActionButton>
            <ActionButton href={hasAnyBooking ? "/teachers" : "/#pricing"} subtle>
              {hasAnyBooking ? "See Teacher Options" : "Unlock Mentor Support"}
            </ActionButton>
          </div>
        </Surface>

        <Surface accent={C.purple}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>
            What&apos;s New For You
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {newsFeed.map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: 18,
                  padding: "14px 16px",
                  background: item.bg,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div style={{ fontSize: 10, color: item.accent, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  {item.type}
                </div>
                <div style={{ marginTop: 6, fontSize: 15, fontWeight: 800, color: C.ink, lineHeight: 1.45 }}>
                  {item.title}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface accent={C.yellow}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>
              Opportunities / Mentor Content / Announcements
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink }}>
              High-signal updates, not a noisy feed.
            </div>
          </div>
          <Pill bg={C.yellowLight} color="#8a5a00">{hasAnyBooking ? "Personalized" : "Preview insights"}</Pill>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {opportunityFeed.map((item) => (
            <div
              key={item.title}
              style={{
                borderRadius: 18,
                padding: "16px 16px 14px",
                background: C.bg,
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ fontSize: 10, color: C.purple, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {item.eyebrow}
              </div>
              <div style={{ marginTop: 8, fontSize: 15, fontWeight: 800, color: C.ink, lineHeight: 1.45 }}>
                {item.title}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                {item.body}
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function LeaderboardTab({ isUnlocked }) {
  if (!isUnlocked) {
    return (
      <LockedPanel
        title="Leaderboard & scores unlock after your first booking"
        body="Rankings and score history appear only after your assessment journey becomes active through a present or past booking."
      />
    );
  }

  const entries = [
    { rank: 1, name: "Rohan Verma", points: 962, note: "Checkpoint quality leader" },
    { rank: 2, name: "Sneha Iyer", points: 931, note: "Consistency leader" },
    { rank: 3, name: "You", points: 897, note: "Strong project momentum" },
    { rank: 4, name: "Karan Bose", points: 851, note: "Improving fast" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 18 }}>
      <Surface accent={C.purple}>
        <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14 }}>
          Cohort Leaderboard
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map((entry) => (
            <div
              key={entry.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                borderRadius: 18,
                background: entry.name === "You" ? C.purpleLight : C.bg,
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  background: entry.rank === 1 ? C.yellow : C.purple,
                  color: entry.rank === 1 ? C.ink : C.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                #{entry.rank}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{entry.name}</div>
                <div style={{ marginTop: 4, fontSize: 11, color: C.muted }}>{entry.note}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.purple }}>{entry.points}</div>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Points
                </div>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <Surface accent={C.yellow}>
        <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14 }}>
          How scoring works
        </div>
        {[
          ["Checkpoint quality", "Mentor-reviewed performance during milestone sessions."],
          ["Consistency", "How steadily you move through roadmap work."],
          ["Clarity", "How well you explain choices during reviews."],
          ["Community + referral", "Additional trust and contribution signals."],
        ].map(([title, body]) => (
          <div key={title} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{title}</div>
            <div style={{ marginTop: 5, fontSize: 12, color: C.muted, lineHeight: 1.65 }}>{body}</div>
          </div>
        ))}
      </Surface>
    </div>
  );
}

function PlacementTab({ isUnlocked }) {
  if (!isUnlocked) {
    return (
      <LockedPanel
        title="Placement portfolio unlocks after your first booking"
        body="Your public portfolio, readiness tracking, and employer-facing proof turn on only after at least one booking in the present or past."
      />
    );
  }

  const checklist = [
    { item: "Deployed project with live URL", done: true },
    { item: "Checkpoint reviews completed", done: true },
    { item: "Mock Interview 1 completed", done: true },
    { item: "Final mock interview completed", done: false },
    { item: "Portfolio profile polished", done: false },
  ];
  const pct = Math.round((checklist.filter((item) => item.done).length / checklist.length) * 100);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <Surface accent={C.purple}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18 }}>
          <div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>
              Placement portfolio
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink }}>HireTrackr</div>
            <div style={{ marginTop: 8, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
              This becomes the employer-facing proof zone for your work, mentor sign-offs, and readiness signals.
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: C.purple }}>{pct}%</div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ready</div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Pill>MongoDB</Pill>
          <Pill>Express</Pill>
          <Pill>React</Pill>
          <Pill>Node.js</Pill>
        </div>

        <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 18, background: C.greenLight, border: `1px solid ${C.green}` }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.green }}>Mentor sign-off granted</div>
          <div style={{ marginTop: 4, fontSize: 11, color: "#166534" }}>
            Your project and checkpoint quality are now becoming useful, shareable proof of work.
          </div>
        </div>
      </Surface>

      <Surface accent={C.yellow}>
        <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14 }}>
          Placement checklist
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {checklist.map((item) => (
            <div
              key={item.item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: item.done ? C.green : C.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.done ? C.white : C.muted,
                  fontSize: 12,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {item.done ? "✓" : ""}
              </div>
              <div style={{ fontSize: 12.5, color: item.done ? C.ink : C.muted, fontWeight: item.done ? 700 : 500 }}>
                {item.item}
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

export default function AlgoNestDashboard({ data }) {
  const [activeTab, setActiveTab] = useState("home");
  const hasAnyBooking = Boolean(data?.hasAnyBooking);

  const tabs = [
    { id: "home", label: "Home" },
    { id: "leaderboard", label: hasAnyBooking ? "Leaderboard" : "Leaderboard · Locked", locked: !hasAnyBooking },
    { id: "placement", label: hasAnyBooking ? "Placement Portfolio" : "Placement Portfolio · Locked", locked: !hasAnyBooking },
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100%", fontFamily: font, marginTop:18 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          style={{
            marginBottom: 18,
            display: "flex",
            gap: 8,
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: 6,
            boxShadow: "0 10px 26px rgba(76,29,149,0.04)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 14,
                padding: "12px 16px",
                background: activeTab === tab.id ? C.purple : "transparent",
                color: activeTab === tab.id ? C.white : tab.locked ? "#a19ab8" : C.muted,
                fontFamily: font,
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 800 : 600,
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "home" && <HomeTab data={data} hasAnyBooking={hasAnyBooking} />}
        {activeTab === "leaderboard" && <LeaderboardTab isUnlocked={hasAnyBooking} />}
        {activeTab === "placement" && <PlacementTab isUnlocked={hasAnyBooking} />}

        <div style={{ marginTop: 26, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>
            AlgoNest dynamic home — a calmer, more useful workspace for building and progressing.
          </div>
          <div style={{ fontSize: 11, color: C.purple }}>Student Mode</div>
        </div>
      </div>
    </div>
  );
}
