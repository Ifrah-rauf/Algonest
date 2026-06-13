import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FadeInSection from "../components/FadeInSection";
import AvailabilitySetting from "../components/AvailabilitySettings";
import Availability from "../components/Availability";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/teacher-profile.css";

const font = { fontFamily: "'Trebuchet MS', 'Lucida Grande', sans-serif" };

// ── Skeleton shimmer ──────────────────────────────────────
function Shimmer({ className = "" }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%" }}
    />
  );
}

// ── Star rating display ───────────────────────────────────
function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" className="w-4 h-4"
          fill={s <= Math.round(rating) ? "#F59E0B" : "none"}
          stroke={s <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
          strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Tag pill ──────────────────────────────────────────────
function Tag({ children, variant = "purple" }) {
  const styles = {
    purple: { background: "#F3EEFF", color: "#6D28D9", border: "1px solid #DDD6FE" },
    yellow: { background: "#FEF9C3", color: "#92400E", border: "1px solid #FDE68A" },
    gray:   { background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" },
  };
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold inline-block" style={styles[variant]}>
      {children}
    </span>
  );
}

// ── Info card ─────────────────────────────────────────────
function InfoCard({ icon, label, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</span>
      </div>
      <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// ── Reviews skeleton ──────────────────────────────────────
function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Student Reviews</h3>
          <p className="text-sm text-gray-400 mt-0.5">What students are saying</p>
        </div>
        <div className="text-center px-6 py-3 rounded-2xl border border-gray-100 bg-gray-50">
          <div className="text-3xl font-bold text-gray-900">—</div>
          <Stars rating={0} />
          <div className="text-xs text-gray-400 mt-1">No reviews yet</div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Shimmer className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Shimmer className="h-3 w-32" />
              <Shimmer className="h-2.5 w-20" />
            </div>
            <Shimmer className="h-3 w-16" />
          </div>
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-4/5" />
        </div>
      ))}
      <div className="text-center py-6 text-gray-400 text-sm">
        Reviews will appear here once students complete sessions.
      </div>
    </div>
  );
}

// ── Content skeleton ──────────────────────────────────────
function ContentSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Published Content</h3>
          <p className="text-sm text-gray-400 mt-0.5">Articles, guides and resources by this mentor</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <Shimmer className="h-32 w-full rounded-xl" />
            <Shimmer className="h-3 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
            <div className="flex gap-2">
              <Shimmer className="h-5 w-14 rounded-full" />
              <Shimmer className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="text-center py-8 text-gray-400 text-sm">
        This mentor hasn't published any content yet.
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
const TeacherProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("about");
  const { id } = useParams();
  const location = useLocation();
  const gateFlow = location.state?.gateFlow || location.state?.checkpointFlow || location.state?.interviewFlow || null;
  const [teacher, setTeacher] = useState(location.state?.teacher || null);
  const [availability, setAvailability] = useState([]);
  const [editAvailability, setEditAvailability] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/teachers/getTeacher/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTeacher(data.teacher);
        setAvailability(data.avail);
        setTimeSlots(data.timeSlots);
      })
      .catch(console.error);
      console.log("teacher data on profile page: ",teacher);
  }, [id]);

  useEffect(() => {
    if (!user || !teacher?.t_id) return;
    async function checkOwnership() {
      try {
        const res = await fetch("http://localhost:5000/api/teachers/isOwner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, teacherId: teacher.t_id }),
        });
        const json = await res.json();
        if (json.success) setIsOwner(json.isOwner);
      } catch (err) {
        console.error("Ownership check failed:", err);
      }
    }
    checkOwnership();
  }, [user, teacher?.t_id]);

  // ── Derived tag lists from schema ──────────────────────
  const specialisations = teacher
    ? [teacher.specialisation?.sp1, teacher.specialisation?.sp2,
       teacher.specialisation?.sp3, teacher.specialisation?.sp4].filter(Boolean)
    : [];
  const languages = teacher
    ? [teacher.languages?.l1, teacher.languages?.l2,
       teacher.languages?.l3, teacher.languages?.l4].filter(Boolean)
    : [];
  const frameworks = teacher
    ? [teacher.frameworks?.f1, teacher.frameworks?.f2,
       teacher.frameworks?.f3].filter(Boolean)
    : [];

  const TABS = ["about", "reviews", "availability", "content"];

  if (!teacher) {
    return (
      <div style={{ ...font, background: "#ffffff", minHeight: "100vh" }}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
          <div className="flex gap-6">
            <Shimmer className="w-36 h-36 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-3 pt-2">
              <Shimmer className="h-7 w-56" />
              <Shimmer className="h-4 w-40" />
              <Shimmer className="h-4 w-72" />
            </div>
          </div>
          <Shimmer className="h-12 w-full rounded-2xl" />
          <Shimmer className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-profile-page" style={{ ...font, background: "#f8f8fb", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* ── Top accent bar ── */}
      {/* <div className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #7C3AED, #FCD34D)" }} /> */}

      <div className="teacher-profile-shell max-w-7xl mx-auto px-4 md:px-6 py-10">
        {gateFlow && (
          <div className="teacher-profile-gate mb-6 rounded-3xl border border-yellow-200 bg-yellow-50 px-6 py-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-700">
              {gateFlow.kind === "interview" ? "Interview Booking" : "Checkpoint Booking"}
            </div>
            <div className="teacher-profile-gate-title mt-1 text-xl font-bold text-gray-900">
              Book a mentor for {gateFlow.title}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              After you confirm a slot, we&apos;ll connect that new session to your roadmap gate and send you right back to the roadmap.
            </p>
          </div>
        )}

        {/* ── Hero card ── */}
<div className="teacher-profile-hero" style={{ background: "#534AB7", borderRadius: 24, overflow: "hidden", marginBottom: 24, position: "relative" }}>

  {/* Decorative circles */}
  <div style={{ position: "absolute", top: -70, left: -70, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
  {/* <div style={{ position: "absolute", top: 20, left: 200, width: 120, height: 120, borderRadius: "50%", background: "rgba(246,201,14,0.09)", pointerEvents: "none" }} /> */}
  {/* <div style={{ position: "absolute", bottom: -50, left: "40%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} /> */}
  <div style={{ position: "absolute", top: -30, right: 80, width: 180, height: 180, borderRadius: "50%", background: "rgba(246,201,14,0.07)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", bottom: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", top: "40%", right: 220, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

  {/* Main content */}
  <div className="teacher-profile-hero-main">

    {/* Avatar col */}
    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative" }}>
        <img
          src={teacher.pfp}
          alt={teacher.name}
          className="teacher-profile-avatar"
          style={{ width: 128, height: 128, borderRadius: 18, objectFit: "cover", objectPosition: "center", border: "3px solid rgba(255,255,255,0.25)", display: "block" }}
        />
        {teacher.verified && (
          <div style={{ position: "absolute", bottom: -8, right: -8, width: 28, height: 28, borderRadius: "50%", background: "#f6c90e", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #534AB7" }}>
            <svg viewBox="0 0 20 20" style={{ width: 13, height: 13 }} fill="#0a0a0a">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {teacher.verified && (
        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", letterSpacing: 0.3 }}>
          ✓ Verified Mentor
        </span>
      )}
    </div>

    {/* Info col */}
    <div className="teacher-profile-info" style={{ flex: 1, minWidth: 0 }}>
      <div className="teacher-profile-heading-row" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <div>
          <h1 className="teacher-profile-name" style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: -0.8, marginBottom: 4 }}>
            {teacher.name}
          </h1>
          {teacher.experience && (
            <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{teacher.experience}</p>
          )}
        </div>

        {isOwner && (
          <button
            onClick={() => setEditAvailability(true)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#0a0a0a", background: "#f6c90e", border: "none", cursor: "pointer", flexShrink: 0 }}
          >
            <svg viewBox="0 0 20 20" style={{ width: 14, height: 14 }} fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Availability
          </button>
        )}
      </div>

      {/* Rating + timezone */}
      <div className="teacher-profile-meta" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginBottom: 16 }}>
        {teacher.rating && (
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Stars rating={teacher.rating} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{teacher.rating}</span>
          </div>
        )}
        {teacher.timezone && (
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
            🕐 {teacher.timezone}
          </span>
        )}
      </div>

      {/* Specialisations */}
      {specialisations.length > 0 && (
        <div className="teacher-profile-tags" style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {specialisations.map((s) => (
            <span key={s} style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)", padding: "4px 11px", borderRadius: 999 }}>{s}</span>
          ))}
        </div>
      )}

      {/* Languages + frameworks — unified neutral style */}
      <div className="teacher-profile-tags" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {languages.map((l) => (
          <span key={l} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.70)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "4px 11px", borderRadius: 999 }}>🌐 {l}</span>
        ))}
        {frameworks.map((f) => (
          <span key={f} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.70)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "4px 11px", borderRadius: 999 }}>⚙️ {f}</span>
        ))}
      </div>
    </div>
  </div>

  {/* ── Tab bar ── */}
  <div className="teacher-profile-tab-wrap" style={{ borderTop: "1px solid rgba(255,255,255,0.10)", padding: "0 36px", background: "rgba(0,0,0,0.12)" }}>
    <div className="teacher-profile-tabs">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="teacher-profile-tab"
          style={{
            position: "relative",
            padding: "14px 20px",
            textTransform: "capitalize",
            fontSize: 13,
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.45)",
            letterSpacing: 0.1,
            transition: "color 0.15s",
          }}
        >
          {tab}
          {activeTab === tab && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, borderRadius: 2, background: "#f6c90e" }} />
          )}
        </button>
      ))}
    </div>
  </div>
</div>

        {/* ── Tab content ── */}
        <div>

          {/* ── ABOUT ── */}
          {activeTab === "about" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Left col */}
              <div className="space-y-5">

                {/* Video */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 pt-5 pb-2 flex items-center gap-2">
                    <span className="text-base">🎥</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Intro Video</span>
                  </div>
                  {teacher.video_url && !videoError ? (
                    <div className="px-5 pb-5">
                      <iframe
                        src={`https://www.youtube.com/embed/${new URL(teacher.video_url).searchParams.get("v")}`}
                        className="teacher-profile-video w-full rounded-xl"
                        style={{ height: "220px", border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Intro Video"
                        onError={() => setVideoError(true)}
                      />
                    </div>
                  ) : (
                    <div className="mx-5 mb-5 h-44 rounded-xl flex flex-col items-center justify-center gap-3"
                      style={{ background: "#F3F4F6" }}>
                      <div className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: "#E5E7EB" }}>
                        <span className="text-2xl">🎥</span>
                      </div>
                      <p className="text-gray-400 text-sm">No intro video uploaded</p>
                    </div>
                  )}
                </div>

                {/* Education */}
                <InfoCard label="Education">
                  {teacher.education || <span className="text-gray-400 italic">Not specified</span>}
                </InfoCard>

                {/* Teaching style */}
                <InfoCard  label="Teaching Style">
                  {teacher.teaching_style || <span className="text-gray-400 italic">Not specified</span>}
                </InfoCard>

                {/* Languages spoken */}
                {languages.length > 0 && (
                  <InfoCard label="Languages">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {languages.map((l) => <Tag key={l} variant="gray">{l}</Tag>)}
                    </div>
                  </InfoCard>
                )}
              </div>

              {/* Right col */}
              <div className="space-y-5">

                {/* About */}
                <InfoCard label="About Me">
                  <p className="leading-7 text-gray-600">
                    {teacher.bio || <span className="text-gray-400 italic">No bio provided</span>}
                  </p>
                </InfoCard>

                {/* Specialisations */}
                {specialisations.length > 0 && (
                  <InfoCard label="Specialisations">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {specialisations.map((s) => <Tag key={s} variant="purple">{s}</Tag>)}
                    </div>
                  </InfoCard>
                )}

                {/* Frameworks */}
                {frameworks.length > 0 && (
                  <InfoCard label="Tech Stack & Frameworks">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {frameworks.map((f) => <Tag key={f} variant="yellow">{f}</Tag>)}
                    </div>
                  </InfoCard>
                )}

                {/* Quick stats */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-base"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Quick Stats</span>
                  </div>
                  <div className="teacher-profile-stat-grid grid grid-cols-2 gap-3">
                    {[
                      { label: "Rating", value: teacher.rating ? `${teacher.rating} ⭐` : "New", color: "#F59E0B" },
                      { label: "Status", value: teacher.verified ? "Verified" : "Pending", color: teacher.verified ? "#7C3AED" : "#9CA3AF" },
                      { label: "Timezone", value: teacher.timezone || "—", color: "#374151" },
                      { label: "Experience", value: teacher.experience || "—", color: "#374151" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="rounded-xl p-3" style={{ background: "#FAFAFA", border: "1px solid #F3F4F6" }}>
                        <div className="text-xs text-gray-400 mb-1">{label}</div>
                        <div className="text-sm font-bold" style={{ color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA book card */}
                <div className="rounded-2xl p-5 border relative overflow-hidden"
                  style={{ background: "linear-gradient(145deg, #F3EEFF 0%, #EDE9FE 100%)", borderColor: "#DDD6FE" }}>
                  <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(252,211,77,0.2), transparent)", transform: "translate(20%, 20%)" }} />
                  <h3 className="text-gray-900 font-bold text-base mb-1">Ready to get started?</h3>
                  <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                    Book a free Session 0 with {teacher.name?.split(" ")[0]} and get your project approved before you commit.
                  </p>
                  <button
                    onClick={() => setActiveTab("availability")}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 shadow-md"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}>
                    View Availability & Book →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <div className="teacher-profile-panel bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <ReviewsSkeleton />
            </div>
          )}

          {/* ── AVAILABILITY ── */}
          {activeTab === "availability" && (
            <div className="teacher-profile-panel bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              {editAvailability && isOwner ? (
                <AvailabilitySetting
                  avail={availability}
                />
              ) : (
                <Availability
                  teacherId={id}
                  meeting_link={teacher.meeting_link}
                  avail={availability}
                  timeSlots={timeSlots}
                  gateFlow={gateFlow}
                />
              )}
            </div>
          )}

          {/* ── CONTENT ── */}
          {activeTab === "content" && (
            <div className="teacher-profile-panel bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <ContentSkeleton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
