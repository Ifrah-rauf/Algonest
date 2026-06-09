import RoadmapGateCard from "./RoadmapGateCard";

export default function InterviewMilestones({
  interviewOne,
  interviewTwo,
  interviewOneStatus,
  interviewOneProgress,
  interviewOneUnlocked,
  interviewTwoStatus,
  interviewTwoProgress,
  interviewTwoUnlocked,
  goToTeacherSelection,
}) {
  if (!(interviewOne || interviewTwo)) return null;

  return (            <div style={{
              marginTop: 8,
              paddingTop: 14,
              borderTop: "1px dashed #ddd6fe",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              {(interviewOne || interviewTwo) && (
                <div>
                  <div style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: "#9991b8",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}>
                    Interview Milestones
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {interviewOne && (
                      <RoadmapGateCard
                        kind="interview"
                        indexLabel="Interview · 1/2"
                        title={interviewOne.title || "Mock Interview I"}
                        description={interviewOne.desc || "Practice core questions, answer structure, and how to show what you’ve learned."}
                        status={interviewOneStatus}
                        sessionId={interviewOneProgress?.session_id || null}
                        lockedHint={interviewOneUnlocked
                          ? "Book this mock interview to move into the final interview round."
                          : "Complete the final roadmap step to unlock this interview."}
                        onBook={interviewOneStatus === "ready" ? () => goToTeacherSelection({ kind: "interview", id: interviewOne.interview_id, title: interviewOne.title || "Mock Interview I" }) : null}
                        bookLabel="Select Teacher"
                      />
                    )}
                    {interviewTwo && (
                      <RoadmapGateCard
                        kind="interview"
                        indexLabel="Interview · 2/2"
                        title={interviewTwo.title || "Mock Interview II"}
                        description={interviewTwo.desc || "Bring everything together and show the full depth of your mentor-led learning."}
                        status={interviewTwoStatus}
                        sessionId={interviewTwoProgress?.session_id || null}
                        lockedHint={interviewTwoUnlocked
                          ? "Book this final interview to finish the roadmap journey."
                          : "Complete the first interview to unlock this final round."}
                        onBook={interviewTwoStatus === "ready" ? () => goToTeacherSelection({ kind: "interview", id: interviewTwo.interview_id, title: interviewTwo.title || "Mock Interview II" }) : null}
                        bookLabel="Select Teacher"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
  );
}

