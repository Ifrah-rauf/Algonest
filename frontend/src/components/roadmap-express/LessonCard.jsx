import StructuredLessonWorkspace from "./StructuredLessonWorkspace";
import {
  getLessonJsonTopicCount,
  getLessonUnlockState,
} from "./roadmapUtils";

export default function LessonCard({
  lesson,
  idx,
  lessons,
  isLast = false,
  progressMap,
  checkpointMap,
  checkpointProgressMap,
  hasActiveBooking,
  user,
  openToolbox,
  lessonTopics,
  askedLessonId,
  checkpoints,
  courseId,
  canUseAI,
  expandedTopics,
  setOpenToolbox,
  askAi,
  openLessonQuiz,
  askSeededLessonQuestion,
  normalizeTopicResources,
  setExpandedTopics,
  goToTeacherSelection,
  onProgressUpdated,
}) {  const unlock   = getLessonUnlockState(
              lesson,
              progressMap,
              checkpointMap,
              checkpointProgressMap,
              hasActiveBooking,
              Boolean(user?.uid)
            );
            const progress = progressMap[lesson.lesson_id] || null;
            const isLocked = unlock === "locked";
            const isDone   = progress?.completed === true;
            const isActive = !isLocked && !isDone;
            const isOpen   = openToolbox === lesson.lesson_id;
            const topics   = lessonTopics[lesson.lesson_id] || [];
            const topicCount = getLessonJsonTopicCount(lesson);
            const isAsked  = askedLessonId === lesson.lesson_id; // visual feedback flag
            const usesStructuredWorkspace = true;

            const nextLesson  = lessons[idx + 1];
            const cpAfterNext = nextLesson?.checkpoint_id
              ? checkpoints.find(c => c.checkpoint_id === nextLesson.checkpoint_id)
              : null;
            const checkpointProgress = cpAfterNext ? checkpointProgressMap[cpAfterNext.checkpoint_id] : null;
            const checkpointSession = checkpointProgress?.session || null;
            const checkpointSessionEnded = checkpointSession?.end_time
              ? new Date(checkpointSession.end_time) <= new Date()
              : false;
            const checkpointTeacherMarked = checkpointSession?.marked_by_teacher === true;
            const checkpointCompleted = checkpointProgress?.completed === true || checkpointTeacherMarked;
            const checkpointBooked = Boolean(checkpointProgress?.session_id);
            const checkpointReady = Boolean(cpAfterNext && isDone && !checkpointProgress);

  return (
              <div key={lesson.lesson_id} className="road-lesson-shell" style={isLast ? { marginTop: 24, marginBottom: 24 } : {}}>
                {isLast && (
                  <div style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#6b46c1",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <span style={{ width: 20, height: 1, background: "#ddd6fe" }} />
                    The Grand Finale
                    <span style={{ width: 20, height: 1, background: "#ddd6fe" }} />
                  </div>
                )}

                {/* ── Outer card — NOT clickable ── */}
                <div className="road-lesson-card" style={{
                  background: isLast ? "#fff" : (isLocked ? "#faf8fd" : "#fff"),
                  border: isLast 
                    ? (isDone ? "2.5px solid #059669" : "2.5px solid #6b46c1")
                    : (isDone ? "1.5px solid #f9f9f9" : (isActive ? "1.5px solid #6b46c1" : "1.5px solid #e8e4f0")),
                  borderRadius: isLast ? 16 : 10, 
                  overflow: "hidden",
                  opacity: isLocked ? 0.55 : 1,
                  boxShadow: isLast
                    ? "0 20px 40px rgba(107,70,193,0.15)"
                    : (isActive ? "0 0 0 3px rgba(107,70,193,0.06), 0 10px 24px rgba(107,70,193,0.08)" : "0 1px 10px rgba(26,16,53,0.04)"),
                  transform: isLast ? "scale(1.02)" : "none",
                  transition: "all 0.3s ease",
                  width:"98%", margin:"0 auto",
                }}>

                  {/* Row: lesson info + Ask AI — full horizontal flex */}
                  <div className="road-lesson-row" style={{
                    display: "flex", alignItems: "center",
                    padding: isLast ? "20px 24px" : "14px 16px", gap: 12,
                  }}>

                    {/* Left: badge + text — clickable zone for toolbox */}
                    <div
                      className="road-lesson-main"
                      onClick={() => !isLocked && setOpenToolbox(isOpen ? null : lesson.lesson_id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        flex: 1, cursor: isLocked ? "not-allowed" : "pointer",
                        minWidth: 0, // allows text truncation
                      }}
                    >
                      {/* Order badge */}
                      <div style={{
                        width: isLast ? 54 : 40, height: isLast ? 54 : 40, borderRadius: isLast ? 14 : 10, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isDone
                          ? (isLast ? "linear-gradient(135deg, #059669, #10b981)" : "#fdfdfd")
                          : (isActive || isLast
                          ? "linear-gradient(135deg, #6b46c1, #8b5cf6)"
                          : "#f0ecfc"),
                        color:      isDone ? (isLast ? "#fff" : "#1f1f1f") : (isActive || isLast ? "#fff" : "#c4b5fd"),
                        fontWeight: 800, fontSize: isLast ? 22 : (isDone ? 16 : 14), fontFamily: "monospace",
                        boxShadow: (isActive || isLast) ? "0 4px 12px rgba(107,70,193,0.3)" : "none",
                      }}>
                        {isDone ? "✓" : isLocked ? "🔒" : lesson.order_index}
                      </div>

                      {/* Title + meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: isLast ? 18 : 14, fontWeight: 800, color: isLocked ? "#aaa" : "#1a1035" }}>
                            {lesson.title}
                          </span>
                          {isDone && (
                            <span style={{ fontSize: 10, fontFamily: "monospace", background: "#ffffff", color: "#002c1e", padding: "2px 8px", borderRadius: 8, fontWeight: 600, flexShrink: 0 }}>
                              Completed
                            </span>
                          )}
                          {isDone && progress?.quiz_marks != null && (
                            <span style={{ fontSize: 10, fontFamily: "monospace", background: "#fff8e1", color: "#b45309", padding: "2px 8px", borderRadius: 8, fontWeight: 700, flexShrink: 0 }}>
                              Marks: {progress.quiz_marks}
                            </span>
                          )}
                          {isActive && (
                            <span style={{ fontSize: 10, fontFamily: "monospace", background: "#f0ecfc", color: "#6b46c1", padding: "2px 8px", borderRadius: 8, fontWeight: 600, flexShrink: 0 }}>
                              In Progress
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: isLast ? 12 : 10, fontFamily: "monospace", color: "#9991b8", lineHeight: 1.5 }}>
                          {isLast ? "The Final Milestone" : `Lesson ${lesson.order_index}`} · {topicCount} topics
                          {isDone && progress?.quiz_marks != null && ` · score ${progress.quiz_marks}/6`}
                          {/* no locked notice for users without an active booking; roadmap is accessible per Rule 2 */}
                          {lesson.prerequisite_id && !isDone && ` · Unlocks after Lesson ${lesson.prerequisite_id}`}
                          {lesson.checkpoint_id && !isDone && ` · Requires Checkpoint ${lesson.checkpoint_id}`}
                        </div>
                      </div>
                    </div>

                    {/* Right: Ask AI button + chevron — completely outside clickable zone */}
                    <div className="road-lesson-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {!isLocked && (
                        <button
                          className="road-lesson-action-btn"
                          onClick={e => askAi(e, lesson)}
                          style={{
                            fontSize: 10, fontFamily: "monospace", fontWeight: 700,
                            background: !canUseAI ? "#f3f4f6" : isAsked ? "#6b46c1" : "#f0ecfc",
                            color:      !canUseAI ? "#9ca3af" : isAsked ? "#fff" : "#6b46c1",
                            border: `1px solid ${!canUseAI ? "#e5e7eb" : isAsked ? "#6b46c1" : "#d8d0f0"}`,
                            borderRadius: 6, padding: "5px 12px",
                            cursor: !canUseAI ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            boxShadow: !canUseAI ? "none" : isAsked ? "0 2px 8px rgba(107,70,193,0.3)" : "none",
                            transform: !canUseAI ? "scale(1)" : isAsked ? "scale(0.97)" : "scale(1)",
                          }}
                        >
                          {!canUseAI ? "AI Locked" : isAsked ? "Sent ✓" : "Ask AI →"}
                        </button>
                      )}

                      {!isLocked && (
                        user?.uid ? (
                          canUseAI ? (
                            <button
                              className="road-lesson-action-btn"
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
                          ) : (
                            <a
                              className="road-lesson-action-btn"
                              href="/#pricing"
                              style={{
                                fontSize: 10,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                background: "#f3f4f6",
                                color: "#6b46c1",
                                border: "1px solid #e8e4f0",
                                borderRadius: 6,
                                padding: "5px 12px",
                                textDecoration: "none",
                                display: "inline-block",
                              }}
                            >
                              See plans to take quiz
                            </a>
                          )
                        ) : (
                          <a
                            className="road-lesson-action-btn"
                            href="/signup"
                            style={{
                              fontSize: 10,
                              fontFamily: "monospace",
                              fontWeight: 700,
                              background: "#f3f4f6",
                              color: "#6b46c1",
                              border: "1px solid #e8e4f0",
                              borderRadius: 6,
                              padding: "5px 12px",
                              textDecoration: "none",
                              display: "inline-block",
                            }}
                          >
                            Sign up to take assesment
                          </a>
                        )
                      )}

                      {/* Chevron — also outside click zone, just visual */}
                      {!isLocked && (
                        <div
                          className="road-lesson-chevron"
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
                    <div style={{ borderTop: "1px solid #f0ecfc", background: "#eeeeee" }}>
                      {usesStructuredWorkspace ? (
                        <div style={{ padding: "14px 16px" }}>
                          <StructuredLessonWorkspace
                            lesson={lesson}
                            topics={topics}
                            courseId={courseId}
                            userId={user?.uid || null}
                            canUseAI={canUseAI}
                            onAskAIQuestion={(question) => askSeededLessonQuestion(lesson, question)}
                            onProgressUpdated={onProgressUpdated}
                          />
                        </div>
                      ) : (
                      <>
                      <div style={{ padding: "14px 16px 8px" }}>
                        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                          Topics in this lesson
                        </div>

                        {topics.length === 0 && (
                          <div style={{ fontSize: 11, color: "#9991b8", fontFamily: "monospace" }}>No topics yet.</div>
                        )}

                        {/* Roadmap preview: no locked banner for users without an active booking (Rule 2) */}

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {topics.map(topic => {
                            const resources = normalizeTopicResources(topic);
                            const hasPractice = Boolean(topic.applied_task);
                            const hasResources = resources.length > 0;
                            const isExpanded = Boolean(expandedTopics[topic.topic_id]);

                  return (
                              <div key={topic.topic_id} style={{
                                background: "#fff", border: "1px solid #e8e4f0",
                                borderRadius: 8, overflow: "hidden",
                              }}>
                                <button
                                  type="button"
                                  onClick={() => setExpandedTopics((prev) => ({
                                    ...prev,
                                    [topic.topic_id]: !prev[topic.topic_id],
                                  }))}
                                  style={{
                                    width: "100%",
                                    border: "none",
                                    background: "transparent",
                                    padding: "11px 12px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                    <div style={{ minWidth: 0, textAlign: "left" }}>
                                      <div style={{ fontWeight: 700, fontSize: 12, color: "#1a1035", lineHeight: 1.4 }}>
                                        {topic.title}
                                      </div>
                                      <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace", marginTop: 3 }}>
                                        Click to {isExpanded ? "collapse" : "expand"}
                                      </div>
                                    </div>
                                    <div style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: 6,
                                      border: "1px solid #ece7fb",
                                      background: "#faf9ff",
                                      color: "#6b46c1",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      fontSize: 12,
                                      fontWeight: 700,
                                    }}>
                                      {isExpanded ? "▾" : "▸"}
                                    </div>
                                  </div>
                                </button>

                                {isExpanded && (
                                  <div style={{ borderTop: "1px solid #f0ecfc", background: "#faf9ff", padding: "10px 12px 12px" }}>
                                    <div
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns: hasPractice && hasResources ? "1.4fr 1fr 1fr" : hasPractice || hasResources ? "1.4fr 1fr" : "1fr",
                                        gap: 10,
                                        alignItems: "stretch",
                                      }}
                                    >
                                      <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: 9, fontFamily: "monospace", color: "#8b7bb8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                                          List
                                        </div>
                                        <div style={{ fontSize: 11, color: "#5c5478", lineHeight: 1.55 }}>
                                          {topic.description}
                                        </div>
                                      </div>

                                      {hasPractice && (
                                        <div style={{ minWidth: 0, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 10px" }}>
                                          <div style={{ fontSize: 9, fontFamily: "monospace", color: "#92400e", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>
                                            Sublist
                                          </div>
                                          <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.5 }}>
                                            {topic.applied_task}
                                          </div>
                                        </div>
                                      )}

                                      {hasResources && (
                                        <div style={{ minWidth: 0, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "8px 10px" }}>
                                          <div style={{ fontSize: 9, fontFamily: "monospace", color: "#0369a1", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>
                                            Resources
                                          </div>
                                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                        <div className="road-lesson-toolbox-actions" style={{ padding: "10px 18px 14px", display: "flex", gap: 8 }}>
                          <button
                            className="road-lesson-action-btn"
                            onClick={e => askAi(e, lesson)}
                            style={{
                              fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                              background: !canUseAI ? "#f9fafb" : "#fff",
                              color: !canUseAI ? "#9ca3af" : "#6b46c1",
                              border: `1.5px solid ${!canUseAI ? "#e5e7eb" : "#d8d0f0"}`, borderRadius: 8,
                              padding: "9px 18px", cursor: "pointer",
                            }}
                          >
                            {canUseAI ? "Ask companion about this →" : "AI Locked"}
                          </button>

                          {user?.uid ? (
                            canUseAI ? (
                              <button
                                className="road-lesson-action-btn"
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
                            ) : (
                              <a
                                className="road-lesson-action-btn"
                                href="/#pricing"
                                style={{
                                  fontSize: 11,
                                  fontFamily: "monospace",
                                  fontWeight: 700,
                                  background: "#f3f4f6",
                                  color: "#6b46c1",
                                  border: "1.5px solid #e8e4f0",
                                  borderRadius: 8,
                                  padding: "9px 18px",
                                  textDecoration: "none",
                                  display: "inline-block",
                                }}
                              >
                                See plans to take quiz
                              </a>
                            )
                          ) : (
                            <a
                              className="road-lesson-action-btn"
                              href="/signup"
                              style={{
                                fontSize: 11,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                background: "#f3f4f6",
                                color: "#6b46c1",
                                border: "1.5px solid #e8e4f0",
                                borderRadius: 8,
                                padding: "9px 18px",
                                textDecoration: "none",
                                display: "inline-block",
                              }}
                            >
                              Sign up to take assesment
                            </a>
                          )}
                        </div>
                      )}
                      </>
                      )}
                    </div>
                  )}
                </div>

                {/* Checkpoint banner */}
                {cpAfterNext && (
                  <div className="road-checkpoint-banner" style={{
                    display: "flex", alignItems: "stretch",
                    margin: "8px 0", borderRadius: 10, overflow: "hidden",
                    border: "1.5px solid #fde68a", background: "#fffbeb",
                  }}>
                    <div style={{ width: 4, background: "#f6c90e", flexShrink: 0 }} />
                    <div className="road-checkpoint-content" style={{ flex: 1, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 20 }}>⚑</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#78350f" }}>{cpAfterNext.title}</div>
                        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#92400e", marginTop: 2 }}>{cpAfterNext.description}</div>
                        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#b45309", marginTop: 3 }}>
                          status: <strong>{checkpointCompleted ? "completed" : checkpointBooked ? "booked" : checkpointReady ? "ready to book" : "locked"}</strong>
                          {cpAfterNext.requires_teacher ? " · teacher required" : ""}
                          {checkpointBooked ? ` · session_id: ${checkpointProgress?.session_id || "pending"}` : ""}
                          {checkpointBooked && !checkpointSessionEnded ? " · waiting for session to end" : ""}
                          {checkpointBooked && checkpointSessionEnded && !checkpointTeacherMarked ? " · waiting for teacher sign-off" : ""}
                        </div>
                      </div>
                      {checkpointReady ? (
                        <button
                          className="road-lesson-action-btn"
                          onClick={() => goToTeacherSelection({
                            kind: "checkpoint",
                            id: cpAfterNext.checkpoint_id,
                            title: cpAfterNext.title || "Mentor Checkpoint",
                          })}
                          style={{
                            border: "none",
                            background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
                            color: "#fff",
                            padding: "10px 14px",
                            borderRadius: 8,
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
                          background: checkpointCompleted ? "#fbfbfb" : checkpointBooked ? "#ede9fe" : "#fef9c3",
                          color:      checkpointCompleted ? "#00543a" : checkpointBooked ? "#6b46c1" : "#92400e",
                          padding: "4px 10px", borderRadius: 8, fontWeight: 700, flexShrink: 0,
                        }}>
                          {checkpointCompleted
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
}

