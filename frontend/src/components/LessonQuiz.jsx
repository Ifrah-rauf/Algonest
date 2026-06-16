import { apiUrl } from "../config/api.js";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const PASSING_SCORE = 4;
const QUESTIONS_PER_QUIZ = 6;

function pickRandomQuestions(questions, count) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export default function LessonQuiz({
  lessonId,
  isOpen,
  onClose,
  onPassed = () => {},
  onResultSaved = () => {},
}) {
  const { user } = useAuth();

  const [quizTitle, setQuizTitle] = useState("");
  const [quizBank, setQuizBank] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadLessonQuiz() {
      if (!lessonId || !isOpen) return;

      setLoading(true);
      setError("");
      setAttempts(0);
      setAnswers({});
      setScore(null);
      setPassed(false);
      setSaveError("");

      try {
        let quizModule;

        try {
          quizModule = await import(`./quizzes/${lessonId}.json`);
        } catch {
          quizModule = await import(`./quizzes/lesson-${lessonId}.json`);
        }

        const quizData = quizModule.default || quizModule;
        const allQuestions = quizData.questions || [];

        setQuizTitle(quizData.lesson_title || `Lesson ${lessonId} Quiz`);
        setQuizBank(allQuestions);
        setQuestions(pickRandomQuestions(allQuestions, QUESTIONS_PER_QUIZ));
      } catch {
        setQuestions([]);
        setError(`Quiz questions not found for lesson ${lessonId}.`);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      loadLessonQuiz();
    }
  }, [isOpen, lessonId]);

  function selectAnswer(questionId, optionIndex) {
    if (score !== null) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  }

  async function saveQuizResult(nextScore, didPass, nextAttempts) {
    try {
      const res = await fetch(apiUrl("/api/quiz/lesson-result"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid,
          lessonId,
          score: nextScore,
          totalQuestions: questions.length,
          attempts: nextAttempts,
          passed: didPass,
          answers,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save quiz result.");
      }

      return data;
    } catch (err) {
      console.error("Failed to save quiz result:", err);
      throw err;
    }
  }

  async function submitQuiz() {
    if (questions.length === 0 || submitting) return;

    setSubmitting(true);
    const nextScore = questions.reduce(
      (total, question) =>
        answers[question.id] === question.correctIndex ? total + 1 : total,
      0
    );
    const didPass = nextScore >= PASSING_SCORE;
    const nextAttempts = attempts + 1;

    setScore(nextScore);
    setPassed(didPass);
    setAttempts(nextAttempts);
    setSaveError("");

    try {
      const result = await saveQuizResult(nextScore, didPass, nextAttempts);
      onResultSaved(result?.data || null);

      if (didPass) {
        onPassed(lessonId, nextScore, result?.data?.unlock?.progress || result?.data?.progress || null);
      }
    } catch (err) {
      setSaveError(err.message || "Quiz result could not be saved.");
    }

    setSubmitting(false);
  }

  function retryQuiz() {
    setAnswers({});
    setScore(null);
    setPassed(false);
    setQuestions(pickRandomQuestions(quizBank, QUESTIONS_PER_QUIZ));
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 10, 35, 0.55)",
        backdropFilter: "blur(8px)",
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(900px, 100%)",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 24px 70px rgba(30, 17, 69, 0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #ede9fe",
            background: "linear-gradient(135deg, #f7f4ff, #fffcf3)",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            ?
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1035" }}>
              {quizTitle || `Lesson ${lessonId} Quiz`}
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: "#7b70a0",
                marginTop: 4,
              }}
            >
              6 random questions · Need 4 correct to pass · Attempts: {attempts}
            </div>
          </div>

          {score !== null && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                fontSize: 11,
                fontFamily: "monospace",
                fontWeight: 700,
                background: passed ? "#dcfce7" : "#fef3c7",
                color: passed ? "#15803d" : "#b45309",
                border: `1px solid ${passed ? "#bbf7d0" : "#fde68a"}`,
              }}
            >
              Score {score}/{questions.length} · {passed ? "Passed" : "Try again"}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #e9d5ff",
              background: "#fff",
              color: "#6b46c1",
              width: 38,
              height: 38,
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            x
          </button>
        </div>

        <div style={{ padding: 22, overflowY: "auto", background: "#faf9ff" }}>
          {loading && (
            <div style={{ fontSize: 12, fontFamily: "monospace", color: "#7b70a0" }}>
              Loading quiz...
            </div>
          )}

          {!loading && error && (
            <div style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
              {error}
            </div>
          )}

          {!loading && !error && saveError && (
            <div style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
              {saveError}
            </div>
          )}

          {!loading && !error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e8e4f0",
                    padding: 16,
                    boxShadow: "0 4px 16px rgba(107,70,193,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1035" }}>
                      {index + 1}. {question.question}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: "#6b46c1",
                        background: "#f0ecfc",
                        borderRadius: 999,
                        padding: "4px 10px",
                        whiteSpace: "nowrap",
                        height: "fit-content",
                      }}
                    >
                      {question.type} · {question.difficulty}
                    </span>
                  </div>

                  {question.code && (
                    <pre
                      style={{
                        background: "#1e1145",
                        color: "#fff",
                        fontSize: 11,
                        padding: 14,
                        borderRadius: 12,
                        overflowX: "auto",
                        marginBottom: 12,
                        lineHeight: 1.6,
                      }}
                    >
                      <code>{question.code}</code>
                    </pre>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[question.id] === optionIndex;
                      const isCorrect = question.correctIndex === optionIndex;
                      const showResult = score !== null;
                      const highlightCorrect = showResult && isCorrect;
                      const highlightWrong = showResult && selected && !isCorrect;

                      return (
                        <button
                          type="button"
                          key={`${question.id}-${optionIndex}`}
                          onClick={() => selectAnswer(question.id, optionIndex)}
                          style={{
                            textAlign: "left",
                            borderRadius: 12,
                            border: highlightCorrect
                              ? "1.5px solid #22c55e"
                              : highlightWrong
                              ? "1.5px solid #f97316"
                              : selected
                              ? "1.5px solid #8b5cf6"
                              : "1px solid #e8e4f0",
                            background: highlightCorrect
                              ? "#f0fdf4"
                              : highlightWrong
                              ? "#fff7ed"
                              : selected
                              ? "#f5f3ff"
                              : "#fff",
                            color: "#1a1035",
                            padding: "11px 14px",
                            cursor: score !== null ? "default" : "pointer",
                            fontSize: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            padding: "14px 22px",
            borderTop: "1px solid #ede9fe",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            background: "#fff",
          }}
        >
          <div style={{ fontSize: 11, fontFamily: "monospace", color: "#7b70a0" }}>
            Answered {Object.keys(answers).length}/{questions.length}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {score !== null && !passed && (
              <button
                type="button"
                onClick={retryQuiz}
                style={{
                  border: "1.5px solid #d8d0f0",
                  background: "#fff",
                  color: "#6b46c1",
                  borderRadius: 12,
                  padding: "10px 18px",
                  fontSize: 12,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Retry quiz
              </button>
            )}

            <button
              type="button"
              onClick={score === null ? submitQuiz : onClose}
              disabled={
                loading ||
                submitting ||
                questions.length === 0 ||
                (score === null && Object.keys(answers).length < questions.length)
              }
              style={{
                border: "none",
                background:
                  loading ||
                  submitting ||
                  questions.length === 0 ||
                  (score === null && Object.keys(answers).length < questions.length)
                    ? "#d8d0f0"
                    : "linear-gradient(135deg, #6b46c1, #8b5cf6)",
                color: "#fff",
                borderRadius: 12,
                padding: "10px 20px",
                fontSize: 12,
                fontFamily: "monospace",
                fontWeight: 700,
                cursor:
                  loading ||
                  submitting ||
                  questions.length === 0 ||
                  (score === null && Object.keys(answers).length < questions.length)
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  loading ||
                  submitting ||
                  questions.length === 0 ||
                  (score === null && Object.keys(answers).length < questions.length)
                    ? "none"
                    : "0 4px 14px rgba(107,70,193,0.25)",
              }}
            >
              {score === null ? (submitting ? "Submitting..." : "Submit quiz") : "Close quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
