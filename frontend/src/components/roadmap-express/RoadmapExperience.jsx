import { useEffect, useRef } from "react";
import ChatBox from "../chatbox";
import LessonQuiz from "../LessonQuiz";
import RoadmapBookingOverview from "../../pages/roadmap_booking_overview";
import { COMPANION_SYSTEM } from "./constants";
import CheckpointCelebrationModal from "./CheckpointCelebrationModal";
import InterviewMilestones from "./InterviewMilestones";
import LessonCard from "./LessonCard";
import RoadmapSidebar from "./RoadmapSidebar";
import RoadmapTopBar from "./RoadmapTopBar";

function CheckpointSuccessBanner({ checkpointSuccess, onDismiss }) {
  if (!checkpointSuccess) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-emerald-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-xs font-extrabold">
          Session linked to {checkpointSuccess.title}
        </div>
        <div className="mt-1 break-all font-mono text-[11px]">
          session_id: {checkpointSuccess.sessionId || "pending"}
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="self-start text-sm font-bold text-emerald-900 sm:self-auto"
      >
        Dismiss
      </button>
    </div>
  );
}

function RoadmapSummaryCard({
  checkpoints,
  chatLockReason,
  completedCount,
  courseId,
  dashboardData,
  hasActiveBooking,
  hasDomain,
  interviews,
  totalLessons,
}) {
  const isFullyLocked = ["free_prompt_limit", "payment_pending", "payment_rejected", "booking_expired"].includes(chatLockReason);
  const cards = [
    {
      label: "Lessons",
      value: `${completedCount}/${totalLessons}`,
      className: "text-[var(--road-purple)]",
    },
    {
      label: "Checkpoints",
      value: checkpoints.length,
      className: "text-[var(--road-amber)]",
    },
    {
      label: "Interviews",
      value: interviews.length,
      className: "text-[var(--road-green)]",
    },
    {
      label: "AI Access",
      value: hasDomain && !isFullyLocked ? (hasActiveBooking ? "Unlocked" : "Preview") : "Locked",
      className: hasDomain
        ? hasActiveBooking && !isFullyLocked
          ? "text-[var(--road-green)]"
          : "text-[var(--road-purple)]"
        : "text-red-600",
    },
  ];

  return (
    <section className="road-card rounded-xl p-4 sm:p-5">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--road-subtle)]">
        Node.js + Express - Backend Developer Path
      </div>
      <h1 className="text-2xl font-extrabold leading-tight text-[var(--road-ink)]">
        Your Learning Roadmap
      </h1>
      <p className="mt-1.5 font-mono text-xs leading-5 text-[var(--road-muted)]">
        Project:{" "}
        <strong className="text-[var(--road-purple)]">
          {dashboardData?.profile?.project_title || `Course #${courseId}`}
        </strong>{" "}
        - Complete lessons in order. Click a lesson to see topics.
      </p>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => (
          <div key={item.label} className="road-card-soft rounded-lg px-3 py-2.5">
            <div className={`text-lg font-extrabold leading-tight ${item.className}`}>
              {item.value}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8b7bb8]">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
<<<<<<< HEAD

function AccessLimitBanner({ chatLockedCta, chatLockedCtaLabel, chatLockedDescription, chatLockedTitle }) {
=======
function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 shrink-0 px-3 py-2 text-xs font-extrabold transition ${
        active
          ? "bg-[var(--road-purple-soft)] text-violet-800"
          : "text-[var(--road-subtle)] hover:bg-white hover:text-[var(--road-purple)]"
      }`}
    >
      {children}
    </button>
  );
}
function AccessLimitBanner({ chatLockedCta, activeTab, setActiveTab}) {
>>>>>>> f2c1d445d8b8d89c51f07c8b55cb4b37bc9a594e
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
      <div className="text-sm font-extrabold">{chatLockedTitle || "Access locked"}</div>
      <p className="mt-1 text-xs leading-5">
        {chatLockedDescription || "Complete your booking to continue AI guidance, lessons, checkpoints, and mentor review."}
      </p>
<<<<<<< HEAD
      <a
        href={chatLockedCta || "/#pricing"}
        className="mt-2 inline-flex rounded-lg bg-[#6b46c1] px-3 py-2 text-xs font-bold text-white no-underline"
      >
        {chatLockedCtaLabel || "See plans"}
      </a>
=======
      <TabButton active={activeTab === "booking"} onClick={() => setActiveTab("booking")}>
              Tab 2 - Booking & Overview
    </TabButton>
>>>>>>> f2c1d445d8b8d89c51f07c8b55cb4b37bc9a594e
    </section>
  );
}

export default function RoadmapExperience({
  activeCourseData,
  activeLessonId,
  activeTab,
  aiQuestionProgressMap = {},
  askAi,
  askSeededLessonQuestion,
  askedLessonId,
  assetProgressMap = {},
  canUseAI,
  chatIsLocked,
  chatLockedCta,
  chatLockedCtaLabel,
  chatLockedDescription,
  chatLockReason,
  chatLockedTitle,
  checkpoints = [],
  checkpointCelebration,
  checkpointMap,
  checkpointProgressMap,
  checkpointSuccess,
  closeLessonQuiz,
  completedCount,
  commitProofProgressMap = {},
  courseId,
  dashboardData,
  expandedTopics,
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
  totalLessons,
  user,
}) {
  const chatPanelRef = useRef(null);
  const isProgressLocked = ["free_prompt_limit", "payment_pending", "payment_rejected", "booking_expired"].includes(chatLockReason);

  useEffect(() => {
    if (!pendingMessage?.trim()) return;
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;

    window.requestAnimationFrame(() => {
      chatPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [pendingMessage]);

  return (
    <div className="roadmap-express flex min-h-screen flex-col overflow-visible lg:h-screen lg:overflow-hidden">
      <RoadmapTopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        completedCount={completedCount}
        totalLessons={totalLessons}
      />

      {activeTab === "roadmap" ? (
        <main className="relative mx-auto grid w-full max-w-[1520px] flex-1 gap-4 overflow-visible px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,3fr)_minmax(420px,2fr)] lg:overflow-hidden">
          <RoadmapSidebar
            activeCourseData={activeCourseData}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            courseId={courseId}
            dashboardData={dashboardData}
            hasActiveBooking={hasActiveBooking}
            hasAnyBooking={hasAnyBooking}
            checkpoints={checkpoints}
            checkpointProgressMap={checkpointProgressMap}
            completedCount={completedCount}
            totalLessons={totalLessons}
          />

          <section className="road-scrollbar min-w-0 space-y-3 overflow-visible pr-0 lg:overflow-y-auto lg:pr-1">
            <CheckpointSuccessBanner
              checkpointSuccess={checkpointSuccess}
              onDismiss={() => setCheckpointSuccess(null)}
            />

            <RoadmapSummaryCard
              checkpoints={checkpoints}
              chatLockReason={chatLockReason}
              completedCount={completedCount}
              courseId={courseId}
              dashboardData={dashboardData}
              hasActiveBooking={hasActiveBooking}
              hasDomain={hasDomain}
              interviews={interviews}
              totalLessons={totalLessons}
            />

<<<<<<< HEAD
            {isProgressLocked ? (
              <AccessLimitBanner
                chatLockedCta={chatLockedCta}
                chatLockedCtaLabel={chatLockedCtaLabel}
                chatLockedDescription={chatLockedDescription}
                chatLockedTitle={chatLockedTitle}
              />
            ) : null}
=======
            {isProgressLocked ? <AccessLimitBanner chatLockedCta={chatLockedCta} activeTab={activeTab} setActiveTab={setActiveTab} /> : null}
>>>>>>> f2c1d445d8b8d89c51f07c8b55cb4b37bc9a594e

            {lessons.length === 0 ? (
              <div className="px-1 py-5 font-mono text-xs text-[var(--road-subtle)]">
                Loading roadmap...
              </div>
            ) : null}

            {lessons.map((lesson, idx) => (
              <LessonCard
                key={lesson.lesson_id}
                lesson={lesson}
                idx={idx}
                lessons={lessons}
                isLast={idx === lessons.length - 1}
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
                savedAIQuestions={aiQuestionProgressMap[lesson.lesson_id] || []}
                savedAssetAnswers={assetProgressMap[lesson.lesson_id] || []}
                savedCommitProofs={commitProofProgressMap[lesson.lesson_id] || []}
                canUseAI={canUseAI}
                isProgressLocked={isProgressLocked}
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
              interviewOne={interviewOne}
              interviewTwo={interviewTwo}
              goToTeacherSelection={goToTeacherSelection}
              interviewOneStatus={interviewOneStatus}
              interviewOneProgress={interviewOneProgress}
              interviewOneUnlocked={interviewOneUnlocked}
              interviewTwoStatus={interviewTwoStatus}
              interviewTwoProgress={interviewTwoProgress}
              interviewTwoUnlocked={interviewTwoUnlocked}
            />
          </section>

          <aside
            ref={chatPanelRef}
            className="roadmap-chat-panel road-scrollbar min-w-0 overflow-hidden lg:min-h-0 lg:overflow-y-auto"
          >
            <ChatBox
              studentName={dashboardData?.profile?.name || user?.username || user?.email || "Student"}
              systemPrompt={COMPANION_SYSTEM}
              contextTags={[
                dashboardData?.profile?.project_title || "My Project",
                resolvedDomain || "Tech Stack",
                "AlgoNest",
              ]}
              initialMessage={`Hey - I'm your Build Companion. I see you're working on "${
                dashboardData?.profile?.project_title || "your project"
              }". What are you trying to figure out right now?`}
              pendingMessage={pendingMessage}
              onPendingConsumed={() => setPendingMessage("")}
              lessonId={activeLessonId}
              courseId={courseId}
              isLocked={chatIsLocked}
              lockedTitle={chatLockedTitle}
              lockedDescription={chatLockedDescription}
              lockedCtaHref={chatLockedCta}
              lockedCtaLabel={chatLockedCtaLabel}
              lockedFooter={getLockedNotice(user)}
              onUserMessageSent={handleUserAIMessage}
            />
          </aside>

          <LessonQuiz
            lessonId={quizLessonId}
            isOpen={quizLessonId !== null}
            onClose={closeLessonQuiz}
            onPassed={markLessonComplete}
            onResultSaved={refreshLessonProgress}
          />
        </main>
      ) : (
        <main className="road-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5">
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
        </main>
      )}

      <CheckpointCelebrationModal
        checkpoint={checkpointCelebration}
        onClose={() => setCheckpointCelebration(null)}
        onSelectTeacher={goToTeacherSelection}
      />
    </div>
  );
}
