import ChatBox from "../chatbox";
import LessonQuiz from "../LessonQuiz";
import RoadmapBookingOverview from "../../pages/roadmap_booking_overview";
import { COMPANION_SYSTEM } from "./constants";
import CheckpointCelebrationModal from "./CheckpointCelebrationModal";
import InterviewMilestones from "./InterviewMilestones";
import LessonCard from "./LessonCard";
import RoadmapSidebar from "./RoadmapSidebar";
import RoadmapTopBar from "./RoadmapTopBar";
export default function RoadmapExperience({
  activeCourseData,
  activeLessonId,
  activeTab,
  allLessonsCompleted,
  askAi,
  askSeededLessonQuestion,
  askedLessonId,
  canUseAI,
  chatIsLocked,
  chatLockedCta,
  chatLockedDescription,
  chatLockedTitle,
  checkpoints = [],
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
  hasDomain = false,
  interviews = [],
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
}) {
  return (
    <div style={{
      fontFamily: "'Trebuchet MS', sans-serif",
      background: "linear-gradient(180deg, #f8f6f2 0%, #f4f0ea 100%)",
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      overflow: "hidden", height: "100vh",
    }}>

      <RoadmapTopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        completedCount={completedCount}
        totalLessons={totalLessons}
      />

      {/* ── BODY ── */}
      {activeTab === "roadmap" ? (
      <div style={{
        flex: 1,
        display: "flex",
        gap: 18,
        overflow: "hidden",
        position: "relative",
        padding: "18px 22px 22px",
        maxWidth: 1520,
        width: "100%",
        margin: "0 auto",
      }}>

        <RoadmapSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          completedCount={completedCount}
          totalLessons={totalLessons}
        />
        {/* ── LEFT: ROADMAP 60% ── */}
        <div style={{
          width: "60%",
          minWidth: 0,
          overflowY: "auto",
          padding: "0",
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
              borderRadius: 10,
              color: "#065f46",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800 }}>
                  Session linked to {checkpointSuccess.title}
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
            <div style={{
              background: "#fff",
              border: "1px solid #e8e4f0",
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 12px 28px rgba(26,16,53,0.05)",
              marginBottom: 14,
            }}>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                Node.js + Express · Backend Developer Path
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1035", margin: 0, lineHeight: 1.2 }}>
                Your Learning Roadmap
              </h1>
              <p style={{ fontSize: 12, color: "#7b70a0", margin: "6px 0 0", fontFamily: "monospace" }}>
                Project: <strong style={{ color: "#6b46c1" }}>Course #{courseId}</strong> · Complete lessons in order. Click a lesson to see topics.
              </p>

              <div style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 10,
              }}>
                {[
                  { label: "Lessons", value: `${completedCount}/${totalLessons}`, color: "#6b46c1" },
                  { label: "Checkpoints", value: `${checkpoints.length}`, color: "#b45309" },
                  { label: "Interviews", value: `${interviews.length}`, color: "#059669" },
                  { label: "AI Access", value: hasDomain ? (hasActiveBooking ? "Unlocked" : "Preview") : "Locked", color: hasDomain ? (hasActiveBooking ? "#059669" : "#6b46c1") : "#dc2626" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "#faf9ff",
                      border: "1px solid #ece7fb",
                      borderRadius: 8,
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 800, color: item.color, lineHeight: 1.1 }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {lessons.length === 0 && (
            <div style={{ fontSize: 12, color: "#9991b8", fontFamily: "monospace", padding: "20px 0" }}>
              Loading roadmap...
            </div>
          )}

          {lessons.map((lesson, idx) => (
            <LessonCard
              key={lesson.lesson_id}
              lesson={lesson}
              idx={idx}
              lessons={lessons}
              progressMap={progressMap}
              checkpointMap={checkpointMap}
              checkpointProgressMap={checkpointProgressMap}
              hasActiveBooking={hasActiveBooking}
              user={user}
              openToolbox={openToolbox}
              lessonTopics={lessonTopics}
              askedLessonId={askedLessonId}
              checkpoints={checkpoints}
              courseId={courseId}
              canUseAI={canUseAI}
              expandedTopics={expandedTopics}
              setOpenToolbox={setOpenToolbox}
              askAi={askAi}
              openLessonQuiz={openLessonQuiz}
              askSeededLessonQuestion={askSeededLessonQuestion}
              normalizeTopicResources={normalizeTopicResources}
              setExpandedTopics={setExpandedTopics}
              goToTeacherSelection={goToTeacherSelection}
              onProgressUpdated={refreshLessonProgress}
            />
          ))}

          <InterviewMilestones
            terminalCheckpoint={terminalCheckpoint}
            interviewOne={interviewOne}
            interviewTwo={interviewTwo}
            finalCheckpointStatus={finalCheckpointStatus}
            terminalCheckpointProgress={terminalCheckpointProgress}
            allLessonsCompleted={allLessonsCompleted}
            goToTeacherSelection={goToTeacherSelection}
            interviewOneStatus={interviewOneStatus}
            interviewOneProgress={interviewOneProgress}
            interviewOneUnlocked={interviewOneUnlocked}
            interviewTwoStatus={interviewTwoStatus}
            interviewTwoProgress={interviewTwoProgress}
            interviewTwoUnlocked={interviewTwoUnlocked}
          />
        </div>

        {/* ── RIGHT: AI COMPANION 40% ── */}
        <ChatBox
          systemPrompt={COMPANION_SYSTEM}
          contextTags={["Job Tracker API", "Node.js + Express", "Supabase"]}
          initialMessage="Hey — I'm your Build Companion. I'm here while you work through the roadmap. What are you trying to figure out right now?"
          pendingMessage={pendingMessage}
          onPendingConsumed={() => setPendingMessage("")}
          lessonId={activeLessonId}
          courseId={courseId}
          isLocked={chatIsLocked}
          lockedTitle={chatLockedTitle}
          lockedDescription={chatLockedDescription}
          lockedCtaHref={chatLockedCta}
          lockedFooter={getLockedNotice(user)}
          onUserMessageSent={handleUserAIMessage}
        />

        <LessonQuiz
          lessonId={quizLessonId}
          isOpen={quizLessonId !== null}
          onClose={closeLessonQuiz}
          onPassed={markLessonComplete}
          onResultSaved={refreshLessonProgress}
        />
      </div>
      ) : (
        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "18px 22px 22px",
          width: "100%",
        }}>
          <RoadmapBookingOverview
            user={user}
            dashboardData={dashboardData}
            activeCourseData={activeCourseData}
            selectedCourse={dashboardData?.selectedCourse || null}
            lessonProgress={dashboardData?.lessonProgress || null}
            hasAnyBooking={hasAnyBooking}
            hasActiveBooking={hasActiveBooking}
            resolvedDomain={resolvedDomain}
            courseId={courseId}
            navigate={navigate}
            onGoToRoadmap={() => setActiveTab("roadmap")}
          />
        </div>
      )}

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





