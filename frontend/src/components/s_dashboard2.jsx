import {useAuth} from "../context/AuthContext";
import {useState,useEffect} from "react"
import { Navigate, useNavigate } from 'react-router-dom';

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  purple: "#6b46c1",
  purpleLight: "#ede9fa",
  purpleMid: "#9f7aea",
  yellow: "#f6c90e",
  yellowLight: "#fef9d7",
  ink: "#333333",
  muted: "#7a7a8c",
  border: "#e5e0f5",
  bg: "#fafaf8",
  white: "#ffffff",
  green: "#16a34a",
  greenLight: "#dcfce7",
  red: "#dc2626",
  redLight: "#fef2f2",
};

const font = "'Trebuchet MS', 'Trebuchet', sans-serif";

// ── Static Data ───────────────────────────────────────────────
const student = {
  name: "Priya Mehta",
  avatar: "PM",
  track: "Full Stack Developer",
  stack: "MERN Stack",
  cohort: "Cohort #7 · Feb 2026",
  rank: 3,
  totalInCohort: 11,
  packageStart: "Feb 3, 2026",
  packageEnd: "May 30, 2026",
  mentor: {
    name: "Arjun Kapoor",
    role: "SDE-2 @ Razorpay",
    exp: "2 yrs post-grad",
    avatar: "AK",
  },
};

const checkpoints = [
  { id: 1, title: "Foundation & Project Setup", status: "passed", score: 88, date: "Feb 14", mentor_note: "Strong architectural decisions. Explained folder structure confidently." },
  { id: 2, title: "Backend Core — REST API & DB", status: "passed", score: 82, date: "Mar 1", mentor_note: "Schema design was thoughtful. A few gaps on indexing rationale." },
  { id: 3, title: "Authentication & Middleware", status: "passed", score: 91, date: "Mar 16", mentor_note: "Excellent JWT vs session reasoning. Ready to move forward." },
  { id: 4, title: "Frontend Integration", status: "upcoming", score: null, date: "Mar 30", mentor_note: null },
  { id: 5, title: "Advanced Features + Deployment", status: "locked", score: null, date: "Apr 14", mentor_note: null },
  { id: 6, title: "Portfolio & Completeness Review", status: "locked", score: null, date: "Apr 28", mentor_note: null },
];

const mockInterviews = [
  { id: 1, title: "Project Walkthrough Mock", status: "done", score: 79, date: "Mar 20" },
  { id: 2, title: "Technical Deep Dive Mock", status: "upcoming", score: null, date: "Apr 5" },
  { id: 3, title: "Behavioural + Story Mock", status: "locked", score: null, date: "Apr 20" },
  { id: 4, title: "Full Simulation Mock", status: "locked", score: null, date: "May 5" },
];

const scores = {
  checkpointQuality: { value: 84, max: 100, weight: 40, points: 336 },
  consistency: { value: 90, max: 100, weight: 25, points: 225 },
  explanationClarity: { value: 79, max: 100, weight: 20, points: 158 },
  communityContrib: { value: 65, max: 100, weight: 15, points: 98 },
  referralBonus: { friends: 2, pointsEach: 40, total: 80 },
};
const totalScore = 336 + 225 + 158 + 98 + 80; // 897

const leaderboard = [
  { rank: 1, name: "Rohan Verma",   avatar: "RV", track: "MERN", score: 962, cpq: 95, con: 92, exp: 90, comm: 80, ref: 120, referralCount: 3, badge: "gold",   placement: true },
  { rank: 2, name: "Sneha Iyer",    avatar: "SI", track: "MERN", score: 931, cpq: 90, con: 95, exp: 85, comm: 76, ref: 80,  referralCount: 2, badge: "silver", placement: true },
  { rank: 3, name: "Priya Mehta",   avatar: "PM", track: "MERN", score: 897, cpq: 84, con: 90, exp: 79, comm: 65, ref: 80,  referralCount: 2, badge: "bronze", placement: true, isUser: true },
  { rank: 4, name: "Karan Bose",    avatar: "KB", track: "MERN", score: 851, cpq: 80, con: 82, exp: 78, comm: 71, ref: 40,  referralCount: 1, badge: null,     placement: false },
  { rank: 5, name: "Divya Sharma",  avatar: "DS", track: "MERN", score: 830, cpq: 82, con: 78, exp: 74, comm: 66, ref: 40,  referralCount: 1, badge: null,     placement: false },
  { rank: 6, name: "Aditya Nair",   avatar: "AN", track: "MERN", score: 794, cpq: 78, con: 75, exp: 71, comm: 70, ref: 0,   referralCount: 0, badge: null,     placement: false },
  { rank: 7, name: "Meera Pillai",  avatar: "MP", track: "MERN", score: 761, cpq: 74, con: 73, exp: 68, comm: 66, ref: 0,   referralCount: 0, badge: null,     placement: false },
];

const project = {
  title: "HireTrackr",
  desc: "A full-stack job application tracker with auth, status pipeline, analytics dashboard and email reminders.",
  stack: ["MongoDB", "Express", "React", "Node.js"],
  deployed: true,
  deployedUrl: "hiretrackr.vercel.app",
  github: "github.com/priyamehta/hiretrackr",
  checkpointsPassed: 3,
  mentorSignoff: true,
  signoffDate: "Mar 16, 2026",
};

const resumeChecklist = [
  { item: "Deployed project with live URL", done: true },
  { item: "3+ checkpoints passed with mentor sign-off", done: true },
  { item: "GitHub repo with clean commit history", done: true },
  { item: "All 6 checkpoints completed", done: false },
  { item: "Mock Interview 1 completed", done: true },
  { item: "All 4 mock interviews completed", done: false },
  { item: "Explanation recording uploaded", done: false },
  { item: "Mentor referral unlocked (6/6 checkpoints)", done: false },
];
const resumeDone = resumeChecklist.filter(r => r.done).length;
const resumeTotal = resumeChecklist.length;

// ── Tiny SVG Illustrations ────────────────────────────────────
const IlluBot = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="5" y="10" width="22" height="16" rx="4" fill={C.purpleLight} stroke={C.purple} strokeWidth="1.5"/>
    <circle cx="16" cy="7" r="3" fill={C.purple}/>
    <line x1="16" y1="10" x2="16" y2="10" stroke={C.purple} strokeWidth="2"/>
    <circle cx="11.5" cy="18" r="2" fill={C.purple}/>
    <circle cx="20.5" cy="18" r="2" fill={C.purple}/>
    <rect x="11" y="21" width="10" height="2.5" rx="1.25" fill={C.yellow}/>
    <line x1="5" y1="19" x2="2" y2="19" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="27" y1="19" x2="30" y2="19" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IlluMentor = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="11" r="5.5" fill={C.yellowLight} stroke={C.yellow} strokeWidth="1.5"/>
    <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={C.yellow} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="16" cy="11" r="2.5" fill="#92400e"/>
    <circle cx="24" cy="8" r="4.5" fill={C.purple}/>
    <path d="M22 8l1.5 1.5 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IlluTrophy = ({ color = C.yellow }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M10 4h8v10a4 4 0 01-8 0V4z" fill={color} opacity="0.9"/>
    <path d="M10 8H6a3 3 0 003 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M18 8h4a3 3 0 01-3 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="11" y="18" width="6" height="3" fill={color} opacity="0.7"/>
    <rect x="8" y="21" width="12" height="2.5" rx="1" fill={color}/>
  </svg>
);

const IlluRocket = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 4C14 4 20 8 20 16H8C8 8 14 4 14 4Z" fill={C.purpleLight} stroke={C.purple} strokeWidth="1.5"/>
    <rect x="11" y="15" width="6" height="6" fill={C.purpleLight} stroke={C.purple} strokeWidth="1.2"/>
    <path d="M11 21l-3 3M17 21l3 3" stroke={C.yellow} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="12" r="2" fill={C.purple}/>
  </svg>
);

const IlluStar = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill={C.yellow}>
    <path d="M10 2l2.09 5.26L17.5 8.09l-4 3.9.94 5.5L10 14.77l-4.44 2.72.94-5.5-4-3.9 5.41-.83L10 2z"/>
  </svg>
);

// ── Subcomponents ─────────────────────────────────────────────
const Avatar = ({ initials, size = 44, bg = C.purple, color = C.white, fontSize = 16 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: bg, color, fontFamily: font,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize, flexShrink: 0, letterSpacing: "0.05em"
  }}>{initials}</div>
);

const Tag = ({ children, color = C.purple, bg = C.purpleLight }) => (
  <span style={{
    background: bg, color, fontFamily: font, fontSize: 9.5,
    letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "3px 9px", fontWeight: 600,
  }}>{children}</span>
);

const ScoreBar = ({ label, value, weight, points, color = C.purple }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <span style={{ fontFamily: font, fontSize: 12, color: C.ink, fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontFamily: font, fontSize: 10, color: C.muted }}>{weight}% weight</span>
        <span style={{ fontFamily: font, fontSize: 12, color, fontWeight: 700 }}>{points}pts</span>
      </div>
    </div>
    <div style={{ height: 7, background: C.border, borderRadius: 4, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: color, borderRadius: 4,
        transition: "width 0.6s ease"
      }}/>
    </div>
    <div style={{ fontFamily: font, fontSize: 10, color: C.muted, marginTop: 3 }}>{value}/100 score</div>
  </div>
);

const CheckpointRow = ({ cp }) => {
  const statusColor = cp.status === "passed" ? C.green : cp.status === "upcoming" ? C.purple : C.muted;
  const statusBg = cp.status === "passed" ? C.greenLight : cp.status === "upcoming" ? C.purpleLight : "#f5f5f5";
  const statusLabel = cp.status === "passed" ? "✓ Passed" : cp.status === "upcoming" ? "⏳ Upcoming" : "🔒 Locked";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "28px 1fr auto auto",
      gap: "0 14px", alignItems: "center",
      padding: "12px 0", borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: cp.status === "passed" ? C.green : cp.status === "upcoming" ? C.purple : C.border,
        color: cp.status === "locked" ? C.muted : C.white,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: font, fontSize: 12, fontWeight: 700, flexShrink: 0
      }}>{cp.status === "passed" ? "✓" : cp.id}</div>
      <div>
        <div style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: cp.status === "locked" ? C.muted : C.ink }}>{cp.title}</div>
        {cp.mentor_note && <div style={{ fontFamily: font, fontSize: 11, color: C.muted, marginTop: 2, fontStyle: "italic" }}>"{cp.mentor_note}"</div>}
      </div>
      <div style={{ fontFamily: font, fontSize: 11, color: C.muted, textAlign: "right", whiteSpace: "nowrap" }}>{cp.date}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
        <span style={{ background: statusBg, color: statusColor, fontFamily: font, fontSize: 10, padding: "2px 8px", fontWeight: 600 }}>{statusLabel}</span>
        {cp.score && <span style={{ fontFamily: font, fontSize: 11, color: C.purple, fontWeight: 700 }}>{cp.score}/100</span>}
      </div>
    </div>
  );
};

const LeaderRow = ({ p, isUser }) => {
  const badgeColors = { gold: "#f59e0b", silver: "#9ca3af", bronze: "#cd7f32" };
  const rankBg = p.badge ? badgeColors[p.badge] : "transparent";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "36px 40px 1fr 72px 72px 72px 72px 72px 100px",
      gap: "0 8px", alignItems: "center",
      padding: "10px 16px",
      background: isUser ? C.purpleLight : p.rank % 2 === 0 ? "#f9f9f9" : C.white,
      borderLeft: isUser ? `4px solid ${C.purple}` : "4px solid transparent",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: p.badge ? rankBg : C.border,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: font, fontSize: 11, fontWeight: 700,
        color: p.badge ? C.white : C.muted
      }}>#{p.rank}</div>
      <Avatar initials={p.avatar} size={34} bg={isUser ? C.purple : C.purpleLight} color={isUser ? C.white : C.purple} fontSize={12}/>
      <div>
        <div style={{ fontFamily: font, fontSize: 13, fontWeight: isUser ? 700 : 600, color: C.ink }}>
          {p.name} {isUser && <span style={{ fontSize: 10, color: C.purple, fontWeight: 400 }}>· you</span>}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
          {p.placement && <span style={{ background: C.yellowLight, color: "#92400e", fontFamily: font, fontSize: 9, padding: "1px 6px", fontWeight: 600 }}>🎯 Referral Eligible</span>}
          {p.referralCount > 0 && <span style={{ fontFamily: font, fontSize: 9.5, color: C.muted }}>👥 {p.referralCount} referral{p.referralCount > 1 ? "s" : ""}</span>}
        </div>
      </div>
      {[p.cpq, p.con, p.exp, p.comm].map((v, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: v >= 85 ? C.green : v >= 70 ? C.purple : C.muted }}>{v}</div>
          <div style={{ height: 3, background: C.border, borderRadius: 2, marginTop: 2 }}>
            <div style={{ height: "100%", width: `${v}%`, background: v >= 85 ? C.green : C.purple, borderRadius: 2 }}/>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: p.ref > 0 ? "#92400e" : C.muted }}>{p.ref > 0 ? `+${p.ref}` : "—"}</div>
        <div style={{ fontFamily: font, fontSize: 9, color: C.muted }}>bonus</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: p.badge ? badgeColors[p.badge] : C.ink }}>{p.score}</div>
        <div style={{ fontFamily: font, fontSize: 9, color: C.muted }}>total pts</div>
      </div>
    </div>
  );
};

// ── Tab Components ────────────────────────────────────────────

const ProfileTab = () => {
  const passedCPs = checkpoints.filter(c => c.status === "passed").length;
  const progressPct = Math.round((passedCPs / 6) * 100);
    const [sessionInfo, setSessionInfo] = useState({
    status: "LOADING",
    session: null,
    label: "Checking session..."
  });
  useEffect(() => {
      if (!user) {
        window.location.href = "/login";   // optional redirect
        return;
    }
    checkSession();
  }, []);


async function checkSession() {
  try {
    const uid = user?.uid;
    if (!uid) return;

    const sessionRes = await fetch("http://localhost:5000/api/session/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid })
    });

    const sessionData = await sessionRes.json();
    console.log("got sessionData: ",sessionData);
    console.log("exists value:", sessionData.exists);
    if (!sessionData.data.session) {
      console.log("error sessionData not exists");
      setSessionInfo({
        status: "NONE",
        session: null,
        label: "No Active Session"
      });
      return;
    }

    const state = sessionData.data.state;
    const session = sessionData.data.session;
    console.log("state and session and time: ",state,session,session.start_time);
    console.log("STATUS OF SESSION: "+session.status);

    setSessionInfo({
      status: state,
      session,
      label:
        state === "VALID"
          ? "Live Now"
          : state === "UPCOMING"
          ? "Upcoming Session"
          : "Session Ended"
    });

  } catch (error) {
    console.error("Session check failed:", error);
    setSessionInfo({
      status: "ERROR",
      session: null,
      label: "Error loading session"
    });
  }
}
  const { user, logout } = useAuth();
    const navigate = useNavigate();
    function handleLogout() {
      logout();
      navigate("/");
    }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero card */}
      <div style={{ background: C.purple, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}/>
        <div style={{ position: "absolute", bottom: -20, right: 60, width: 100, height: 100, borderRadius: "50%", background: "rgba(246,201,14,0.08)" }}/>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
          <Avatar initials={student.avatar} size={64} bg={C.yellow} color={C.ink} fontSize={22}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: C.white }}>{student.name}</div>
            <div style={{ fontFamily: font, fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{student.track} · {student.stack}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(255,255,255,0.12)", color: C.white, fontFamily: font, fontSize: 10, padding: "3px 10px", letterSpacing: "0.08em" }}>{student.cohort}</span>
              <span style={{ background: C.yellow, color: C.ink, fontFamily: font, fontSize: 10, padding: "3px 10px", fontWeight: 700, letterSpacing: "0.08em" }}>Rank #{student.rank} of {student.totalInCohort}</span>
              <button onClick={handleLogout}>
                <span style={{ background: C.yellow, color: C.ink, fontFamily: font, fontSize: 10, padding: "3px 10px", fontWeight: 700, letterSpacing: "0.08em" }}>LOGOUT</span>
              </button>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: font, fontSize: 32, fontWeight: 700, color: C.yellow, lineHeight: 1 }}>{totalScore}</div>
            <div style={{ fontFamily: font, fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>Total Points</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 22, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: font, fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Roadmap Progress</span>
            <span style={{ fontFamily: font, fontSize: 11, color: C.yellow, fontWeight: 700 }}>{passedCPs}/6 Checkpoints · {progressPct}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: C.yellow, borderRadius: 4 }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontFamily: font, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Started {student.packageStart}</span>
            <span style={{ fontFamily: font, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Target: {student.packageEnd}</span>
          </div>
        </div>
      </div>

      {/* Two col: mentor + upcoming */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Mentor card */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: 20, borderLeft: `4px solid ${C.yellow}` }}>
          <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Your Mentor</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Avatar initials={student.mentor.avatar} size={48} bg={C.yellowLight} color={C.ink} fontSize={15}/>
            <div>
              <div style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.ink }}>{student.mentor.name}</div>
              <div style={{ fontFamily: font, fontSize: 12, color: C.purple, marginTop: 2 }}>{student.mentor.role}</div>
              <div style={{ fontFamily: font, fontSize: 11, color: C.muted, marginTop: 2 }}>{student.mentor.exp}</div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: "10px 14px", background: C.purpleLight, fontFamily: font, fontSize: 11.5, color: C.purple, fontStyle: "italic", lineHeight: 1.5 }}>
            "Priya is building something genuinely useful. Her architectural reasoning is getting sharper with each checkpoint."
          </div>
        </div>

        {/* Upcoming sessions */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: 20, borderLeft: `4px solid ${C.purple}` }}>
                      <div className="flex items-start justify-between mb-4">
        
        {/* Status Icon Block */}
        <div className={`p-3 rounded-lg 
          ${sessionInfo.status === "VALID" ? "bg-green-100" :
            sessionInfo.status === "UPCOMING" ? "bg-blue-100" :
            sessionInfo.status === "EXPIRED" ? "bg-gray-100" :
            "bg-gray-100"}`}>
          
          <div className={`w-3 h-3 rounded-full 
            ${sessionInfo.status === "VALID" ? "bg-green-500 animate-pulse" :
              sessionInfo.status === "UPCOMING" ? "bg-blue-500" :
              sessionInfo.status === "EXPIRED" ? "bg-gray-400" :
              "bg-gray-300"}`}>
          </div>
        </div>

        {/* Badge */}
        <span className={`text-xs font-medium px-2 py-1 rounded-full
          ${sessionInfo.status === "VALID" ? "bg-green-100 text-green-700" :
            sessionInfo.status === "UPCOMING" ? "bg-blue-100 text-blue-700" :
            sessionInfo.status === "EXPIRED" ? "bg-gray-200 text-gray-600" :
            "bg-gray-200 text-gray-600"}`}>
          {sessionInfo.label || "No Session"}
        </span>

      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {sessionInfo.session?.title || "Upcoming Session"}
      </h3>

      {/* Time */}
      <p className="text-sm text-gray-600 mb-4">
        {sessionInfo.session?.start_time|| "Upcoming Session"}
      </p>

      {/* Action Button */}
      <button
        onClick={() => {
          if (sessionInfo.status === "VALID" && sessionInfo.session?.join_url) {
            window.location.href = sessionInfo.session.join_url;
          }
        }}
        disabled={sessionInfo.status !== "VALID"}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors
          ${sessionInfo.status === "VALID"
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}>

        {sessionInfo.status === "VALID"
          ? "Join Class"
          : sessionInfo.status === "UPCOMING"
          ? "Session Not Started"
          : sessionInfo.status === "EXPIRED"
          ? "Session Ended"
          : "No Session Available"}
      </button>
          {/* <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Upcoming Sessions</div>
          {[
            { label: "Checkpoint 4 — Frontend Integration", date: "Mar 30", type: "checkpoint" },
            { label: "Mock Interview 2 — Technical Deep Dive", date: "Apr 5", type: "interview" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: i === 0 ? 10 : 0, paddingBottom: i === 0 ? 10 : 0, borderBottom: i === 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 36, height: 36, background: s.type === "checkpoint" ? C.purpleLight : C.yellowLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.type === "checkpoint" ? "📋" : "🎙️"}
              </div>
              <div>
                <div style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: C.ink }}>{s.label}</div>
                <div style={{ fontFamily: font, fontSize: 11, color: C.muted, marginTop: 2 }}>📅 {s.date} · with {student.mentor.name}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <button style={{ background: C.purple, color: C.white, fontFamily: font, fontSize: 11, fontWeight: 700, padding: "8px 20px", border: "none", cursor: "pointer", letterSpacing: "0.08em" }}>
              View Full Schedule →
            </button>
          </div> */}
        </div>
      </div>

      {/* Checkpoints list */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted }}>Checkpoint Journey — 6 Milestones</div>
          <Tag>3 of 6 Done</Tag>
        </div>
        {checkpoints.map(cp => <CheckpointRow key={cp.id} cp={cp}/>)}
      </div>

      {/* Mock interviews */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted }}>Mock Interview Track — 4 Sessions</div>
          <Tag bg={C.yellowLight} color="#92400e">1 of 4 Done</Tag>
        </div>
        {mockInterviews.map(m => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr auto auto", gap: "0 14px", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.status === "done" ? C.yellow : m.status === "upcoming" ? C.purple : C.border, color: m.status === "done" ? C.ink : m.status === "locked" ? C.muted : C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontSize: 12, fontWeight: 700 }}>
              {m.status === "done" ? "✓" : m.id}
            </div>
            <div style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: m.status === "locked" ? C.muted : C.ink }}>{m.title}</div>
            <div style={{ fontFamily: font, fontSize: 11, color: C.muted }}>{m.date}</div>
            <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: m.status === "done" ? C.yellow : m.status === "upcoming" ? C.purple : C.muted }}>
              {m.score ? `${m.score}/100` : m.status === "upcoming" ? "Scheduled" : "Locked"}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

const LeaderboardTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

    {/* Score breakdown */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

      {/* My score breakdown */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "20px 24px", borderLeft: `4px solid ${C.purple}` }}>
        <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Your Score Breakdown</div>
        <div style={{ fontFamily: font, fontSize: 32, fontWeight: 700, color: C.purple, marginBottom: 16 }}>{totalScore} <span style={{ fontSize: 14, color: C.muted, fontWeight: 400 }}>/ 1080 max</span></div>
        <ScoreBar label="Checkpoint Quality" value={scores.checkpointQuality.value} weight={40} points={scores.checkpointQuality.points} color={C.purple}/>
        <ScoreBar label="Weekly Consistency" value={scores.consistency.value} weight={25} points={scores.consistency.points} color={C.green}/>
        <ScoreBar label="Explanation Clarity" value={scores.explanationClarity.value} weight={20} points={scores.explanationClarity.points} color={C.purpleMid}/>
        <ScoreBar label="Community Contribution" value={scores.communityContrib.value} weight={15} points={scores.communityContrib.points} color="#f59e0b"/>
        {/* Referral bonus */}
        <div style={{ marginTop: 14, padding: "12px 16px", background: C.yellowLight, border: `1px solid ${C.yellow}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: C.ink }}>👥 Referral Bonus</div>
            <div style={{ fontFamily: font, fontSize: 11, color: C.muted, marginTop: 2 }}>{scores.referralBonus.friends} friends joined · +{scores.referralBonus.pointsEach}pts each</div>
          </div>
          <div style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: "#92400e" }}>+{scores.referralBonus.total}pts</div>
        </div>
      </div>

      {/* Scoring system explainer */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "20px 24px", borderLeft: `4px solid ${C.yellow}` }}>
        <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>How Scoring Works</div>

        {[
          { label: "Checkpoint Quality", pct: "40%", desc: "Mentor scores each CP 0-100 on understanding depth.", color: C.purple },
          { label: "Weekly Consistency", pct: "25%", desc: "Showing up every week and making visible progress.", color: C.green },
          { label: "Explanation Clarity", pct: "20%", desc: "How well you communicate decisions during checkpoints.", color: C.purpleMid },
          { label: "Community Contribution", pct: "15%", desc: "Reviewing peers' work, answering in cohort feed.", color: "#f59e0b" },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 20, background: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: font, fontSize: 10, color: C.white, fontWeight: 700 }}>{m.pct}</span>
            </div>
            <div>
              <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: C.ink }}>{m.label}</div>
              <div style={{ fontFamily: font, fontSize: 11, color: C.muted, marginTop: 1 }}>{m.desc}</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 6, padding: "14px 16px", background: C.purpleLight, borderLeft: `3px solid ${C.purple}` }}>
          <div style={{ fontFamily: font, fontSize: 11.5, fontWeight: 700, color: C.purple, marginBottom: 4 }}>👥 Referral Bonus — Should You Do It?</div>
          <div style={{ fontFamily: font, fontSize: 11.5, color: C.ink, lineHeight: 1.6 }}>
            <strong>Yes — and here's why it's fair.</strong> Each friend who joins and passes their first checkpoint earns you +40 bonus points. No cap on friends. It rewards real community building, accelerates your rank, and friends who build together complete at higher rates. It's a win for everyone — not a shortcut.
          </div>
        </div>
      </div>
    </div>

    {/* Top 3 placement highlight */}
    <div style={{ background: C.purple, padding: "20px 28px", display: "flex", gap: 20, alignItems: "center" }}>
      <IlluTrophy/>
      <div>
        <div style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.yellow, letterSpacing: "0.05em", textTransform: "uppercase" }}>Top 3 Students — Mentor Referral Priority</div>
        <div style={{ fontFamily: font, fontSize: 12.5, color: "rgba(255,255,255,0.8)", marginTop: 4, lineHeight: 1.6 }}>
          The top 3 scorers in each cohort receive <strong style={{ color: C.white }}>priority placement referrals</strong> from their mentor — a personal introduction backed by documented, verified evidence of their skills. You are currently <strong style={{ color: C.yellow }}>Rank #3. Hold it or climb.</strong>
        </div>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontFamily: font, fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Your rank</div>
        <div style={{ fontFamily: font, fontSize: 48, fontWeight: 700, color: "#cd7f32", lineHeight: 1 }}>#3</div>
        <div style={{ fontFamily: font, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>of {student.totalInCohort} students</div>
      </div>
    </div>

    {/* Leaderboard table */}
    <div style={{ background: C.white, border: `1px solid ${C.border}` }}>
      {/* Header row */}
      <div style={{ display: "grid", gridTemplateColumns: "36px 40px 1fr 72px 72px 72px 72px 72px 100px", gap: "0 8px", padding: "10px 16px", background: "#f5f3ff", borderBottom: `2px solid ${C.purple}` }}>
        {["Rank", "", "Student", "CP Quality", "Consist.", "Clarity", "Community", "Referral", "Total"].map((h, i) => (
          <div key={i} style={{ fontFamily: font, fontSize: 9.5, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: i > 2 ? "center" : "left" }}>{h}</div>
        ))}
      </div>
      {leaderboard.map(p => <LeaderRow key={p.rank} p={p} isUser={p.isUser}/>)}
    </div>

    {/* Ranking anti-gaming note */}
    <div style={{ background: C.yellowLight, border: `1px solid ${C.yellow}`, padding: "14px 20px", display: "flex", gap: 12 }}>
      <span style={{ fontSize: 18 }}>🛡️</span>
      <div style={{ fontFamily: font, fontSize: 12, color: C.ink, lineHeight: 1.6 }}>
        <strong>Anti-gaming design:</strong> No single metric can be gamed without gaming all four — which requires actually doing the work. Checkpoint Quality is scored by your human mentor live, not an algorithm. Consistency is tracked by weekly commits. Explanation Clarity is assessed in real sessions. Community Contribution requires genuine peer reviews.
      </div>
    </div>

  </div>
);

const PlacementTab = () => {
  const doneCount = resumeChecklist.filter(r => r.done).length;
  const pct = Math.round((doneCount / resumeTotal) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Placement readiness banner */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "22px 28px", display: "flex", gap: 24, alignItems: "center" }}>
        <div>
          <IlluRocket/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Placement Readiness</div>
          <div style={{ height: 12, background: C.border, borderRadius: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 75 ? C.green : C.purple, borderRadius: 6 }}/>
          </div>
          <div style={{ fontFamily: font, fontSize: 12, color: C.muted }}>{doneCount} of {resumeTotal} milestones complete · <strong style={{ color: C.ink }}>{pct}% ready</strong></div>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontFamily: font, fontSize: 40, fontWeight: 700, color: C.purple, lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontFamily: font, fontSize: 10, color: C.muted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>Placement Ready</div>
        </div>
      </div>

      {/* Two col: project card + readiness checklist */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Project card */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "20px 24px", borderLeft: `4px solid ${C.purple}` }}>
          <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Capstone Project</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.ink }}>{project.title}</div>
            {project.deployed && <span style={{ background: C.greenLight, color: C.green, fontFamily: font, fontSize: 10, padding: "3px 9px", fontWeight: 700 }}>🟢 Live</span>}
          </div>
          <div style={{ fontFamily: font, fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>{project.desc}</div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {project.stack.map(s => <Tag key={s}>{s}</Tag>)}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            <div style={{ fontFamily: font, fontSize: 11.5, color: C.purple }}>🔗 <a href="#" style={{ color: C.purple }}>{project.deployedUrl}</a></div>
            <div style={{ fontFamily: font, fontSize: 11.5, color: C.muted }}>📁 {project.github}</div>
          </div>

          {project.mentorSignoff && (
            <div style={{ padding: "10px 14px", background: C.greenLight, border: `1px solid ${C.green}`, display: "flex", gap: 10, alignItems: "center" }}>
              <span>✅</span>
              <div>
                <div style={{ fontFamily: font, fontSize: 11.5, fontWeight: 700, color: C.green }}>Mentor Sign-off Granted</div>
                <div style={{ fontFamily: font, fontSize: 10.5, color: "#15803d" }}>Signed by {student.mentor.name} on {project.signoffDate}</div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 12, padding: "10px 14px", background: C.purpleLight }}>
            <div style={{ fontFamily: font, fontSize: 11.5, fontWeight: 700, color: C.purple, marginBottom: 4 }}>Checkpoint Coverage</div>
            <div style={{ display: "flex", gap: 6 }}>
              {checkpoints.map(cp => (
                <div key={cp.id} style={{ width: 28, height: 28, background: cp.status === "passed" ? C.purple : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontSize: 10, color: cp.status === "passed" ? C.white : C.muted, fontWeight: 700 }}>
                  {cp.status === "passed" ? "✓" : cp.id}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Readiness checklist */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "20px 24px", borderLeft: `4px solid ${C.yellow}` }}>
          <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Placement Checklist</div>
          {resumeChecklist.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "9px 0", borderBottom: i < resumeChecklist.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: r.done ? C.green : C.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                {r.done ? <span style={{ color: C.white, fontSize: 11 }}>✓</span> : null}
              </div>
              <div style={{ fontFamily: font, fontSize: 12.5, color: r.done ? C.ink : C.muted, fontWeight: r.done ? 600 : 400 }}>{r.item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor referral status */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "20px 28px", display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "0 28px" }}>

        <div>
          <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Mentor Referral Status</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, background: C.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🔒</div>
            <div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.ink }}>Referral Locked</div>
              <div style={{ fontFamily: font, fontSize: 12, color: C.muted, marginTop: 2 }}>Complete all 6 checkpoints to unlock</div>
            </div>
          </div>
          <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", width: "50%", background: C.purple, borderRadius: 4 }}/>
          </div>
          <div style={{ fontFamily: font, fontSize: 11, color: C.muted }}>3 of 6 checkpoints passed · 50% to referral unlock</div>
          <div style={{ marginTop: 14, padding: "12px 16px", background: C.purpleLight, fontFamily: font, fontSize: 12, color: C.purple, lineHeight: 1.6 }}>
            When unlocked, <strong>{student.mentor.name}</strong> will make a personal introduction to their professional network — not a LinkedIn click. A specific, contexted referral backed by your verified checkpoint history.
          </div>
        </div>

        <div style={{ background: C.border }}/>

        <div>
          <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Your Public Portfolio Profile</div>
          <div style={{ padding: "16px 18px", background: C.bg, border: `1px solid ${C.border}`, marginBottom: 12 }}>
            <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 6 }}>algonest.in/u/priya-mehta</div>
            <div style={{ fontFamily: font, fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>
              Public profile showing: checkpoint history, mentor sign-offs, explanation quality scores, project link, cohort rank. Shareable to employers and LinkedIn.
            </div>
          </div>
          <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>What Employers See</div>
          {[
            "✅ Deployed project with live URL",
            "✅ 3 mentor-signed checkpoint records",
            "📊 Explanation quality: 79/100",
            "🏆 Cohort Rank #3 of 11",
            "👥 2 referral badges",
          ].map((item, i) => (
            <div key={i} style={{ fontFamily: font, fontSize: 12, color: C.ink, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>{item}</div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────
export default function AlgoNestDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
    const tabs = [
    { id: "profile", label: "📋 Profile & Progress" },
    { id: "leaderboard", label: "🏆 Leaderboard & Scores" },
    { id: "placement", label: "🚀 Placement Portfolio" },
  ];


  return (
    <div style={{ minHeight: "100vh", width:"100%", fontFamily: font}}>
      <div style={{ margin: "0 auto" }}>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, background: C.white, border: `1px solid ${C.border}`, padding: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex: 1, padding: "10px 16px", border: "none", cursor: "pointer",
              fontFamily: font, fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
              background: activeTab === t.id ? C.purple : "transparent",
              color: activeTab === t.id ? C.white : C.muted,
              transition: "all 0.15s ease",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "profile" && <ProfileTab/>}
          {activeTab === "leaderboard" && <LeaderboardTab/>}
          {activeTab === "placement" && <PlacementTab/>}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, padding: "14px 0", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: font, fontSize: 11, color: C.muted, fontStyle: "italic" }}>AlgoNest — Take Flight to Success · Confidential Beta</div>
          <div style={{ fontFamily: font, fontSize: 11, color: C.purple }}>v1.0 · Feb 2026</div>
        </div>
      </div>
    </div>
  );
}