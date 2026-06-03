import { useMemo, useState } from "react";
import { normalizeGithubUrl } from "../student-dashboard/github";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 9,
      fontFamily: "monospace",
      color: "#8b7bb8",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      fontWeight: 800,
      marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

function StatusPill({ tone = "neutral", children }) {
  const styles = {
    neutral: { background: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
    success: { background: "#d1fae5", color: "#047857", border: "#a7f3d0" },
    warning: { background: "#fff8e1", color: "#92400e", border: "#fde68a" },
    purple: { background: "#f0ecfc", color: "#6b46c1", border: "#d8d0f0" },
  };
  const meta = styles[tone] || styles.neutral;

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      border: `1px solid ${meta.border}`,
      background: meta.background,
      color: meta.color,
      borderRadius: 999,
      padding: "4px 8px",
      fontSize: 10,
      fontFamily: "monospace",
      fontWeight: 800,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

async function postJson(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

function parseMaybeJson(value, fallback) {
  if (!value) return fallback;
  if (Array.isArray(value) || typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

function firstNonEmptyList(...values) {
  for (const value of values) {
    const parsed = parseMaybeJson(value, null);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) return parsed;
    if (typeof parsed === "string" && parsed.trim()) return parsed;
  }

  return [];
}

function collectNestedValues(root, targetKeys) {
  const parsed = parseMaybeJson(root, root);
  const matches = [];
  const keySet = new Set(targetKeys);

  function visit(value) {
    if (!value || typeof value !== "object") return;

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    Object.entries(value).forEach(([key, child]) => {
      if (keySet.has(key) && child != null) {
        matches.push(child);
      }
      if (child && typeof child === "object") {
        visit(child);
      }
    });
  }

  visit(parsed);
  return matches;
}

function firstNestedNonEmpty(root, keys) {
  const values = collectNestedValues(root, keys);
  return firstNonEmptyList(...values);
}

function normalizeKeyedItems(items, textField = "question") {
  const parsed = parseMaybeJson(items, []);
  const list = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object"
    ? Object.entries(parsed).map(([key, value]) => (
        value && typeof value === "object" ? { key, ...value } : { key, [textField]: String(value || "") }
      ))
    : typeof parsed === "string" && parsed.trim()
    ? [parsed]
    : [];

  return list
    .map((item, index) => {
      if (typeof item === "string") {
        return { key: `item_${index + 1}`, [textField]: item };
      }

      const textValue =
        item[textField] ||
        item.question ||
        item.q ||
        item.question_text ||
        item.prompt ||
        item.p ||
        item.prompt_text ||
        item.asset ||
        item.instruction ||
        item.task ||
        item.title ||
        item.text ||
        item.label ||
        "";
      const answerValue =
        item.answer ||
        item.ans ||
        item.response ||
        item.answer_text ||
        item.expectedAnswer ||
        item.expected_answer ||
        item.explanation ||
        item.description ||
        "";

      return {
        key: item.key || item.id || `item_${index + 1}`,
        ...item,
        [textField]: textValue,
        answerText: answerValue,
      };
    })
    .filter((item) => item[textField]);
}

function normalizeTextList(value) {
  const parsed = parseMaybeJson(value, value);

  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.label || item?.title || item?.topic || item?.section || item?.task || item?.asset || item?.text || item?.name || item?.proof || "";
      })
      .filter(Boolean);
  }

  if (parsed && typeof parsed === "object") {
    return Object.values(parsed)
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.label || item?.title || item?.topic || item?.section || item?.task || item?.asset || item?.text || item?.name || item?.proof || "";
      })
      .filter(Boolean);
  }

  return typeof parsed === "string" && parsed.trim() ? [parsed.trim()] : [];
}

function objectOrEmpty(value) {
  const parsed = parseMaybeJson(value, null);
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

function buildLessonConfig(lesson, topics) {
  const structuredContent = objectOrEmpty(lesson.structured_content);
  const lessonStructure = objectOrEmpty(lesson.lesson_structure);
  const contentSchema = objectOrEmpty(lesson.content_schema);
  const structured = {
    ...contentSchema,
    ...lessonStructure,
    ...structuredContent,
  };
  const structuredSources = [
    lesson.structured_content,
    lesson.lesson_structure,
    lesson.content_schema,
    structured,
  ];

  const staticTopics = normalizeTextList(firstNonEmptyList(
    lesson.static_topics,
    structured.staticTopics,
    structured.static_topics,
    structured.topics,
    structured.sections,
    firstNestedNonEmpty(structuredSources, ["staticTopics", "static_topics", "topics", "topicList", "topic_list", "sections"])
  ));

  return {
    title: structured.title || lesson.title || "Lesson",
    goal: structured.goal || structured.overview || structured.description || structured.schema || lesson.goal || lesson.description || "",
    staticTopics: staticTopics.length ? staticTopics : [],
    aiIndustryQuestions: normalizeKeyedItems(
      firstNonEmptyList(
        lesson.ai_industry_questions,
        structured.aiIndustryQuestions,
        structured.ai_industry_questions,
        structured.industryQuestions,
        structured.industry_questions,
        structured.aiQuestions,
        structured.ai_questions,
        structured.questions,
        firstNestedNonEmpty(structuredSources, [
          "aiIndustryQuestions",
          "ai_industry_questions",
          "industryQuestions",
          "industry_questions",
          "aiQuestions",
          "ai_questions",
          "questions",
          "q"
        ])
      ),
      "question"
    ),
    guidedEvaluations: normalizeKeyedItems(
      firstNonEmptyList(
        lesson.guided_assets,
        structured.guidedEvaluations,
        structured.guided_evaluations,
        structured.guidedAssets,
        structured.guided_assets,
        structured.assets,
        structured.evaluations,
        structured.guidedTrack,
        structured.guided_track,
        firstNestedNonEmpty(structuredSources, [
          "guidedEvaluations",
          "guided_evaluations",
          "guidedAssets",
          "guided_assets",
          "guidedTrack",
          "guided_track",
          "assets",
          "evaluations",
          "prompts"
        ])
      ),
      "prompt"
    ),
    aiCompanionTasks:
      normalizeTextList(firstNonEmptyList(
        lesson.ai_companion_tasks,
        structured.aiCompanionTasks,
        structured.ai_companion_tasks,
        structured.companionTasks,
        structured.companion_tasks,
        structured.tasks,
        firstNestedNonEmpty(structuredSources, [
          "aiCompanionTasks",
          "ai_companion_tasks",
          "companionTasks",
          "companion_tasks",
          "tasks"
        ])
      )),
    deliverable:
      structured.deliverable ||
      structured.commit ||
      lesson.deliverable ||
      lesson.commit_deliverable ||
      "",
    microProof:
      normalizeTextList(
        structured.microProof ||
        structured.micro_proof ||
        structured.proof ||
        lesson.micro_proof
      ),
  };
}

export default function StructuredLessonWorkspace({
  lesson,
  topics = [],
  courseId,
  userId,
  canUseAI,
  onAskAIQuestion,
  onProgressUpdated,
}) {
  const [askedQuestions, setAskedQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [companionStatus, setCompanionStatus] = useState(null);
  const [microProofProgress, setMicroProofProgress] = useState({});
  const [repoUrl, setRepoUrl] = useState("");
  const [commitSha, setCommitSha] = useState("");
  const [commitStatus, setCommitStatus] = useState(null);
  const [submittingCommit, setSubmittingCommit] = useState(false);

  const lessonConfig = buildLessonConfig(lesson, topics);
  const normalizedRepoUrl = useMemo(() => normalizeGithubUrl(repoUrl), [repoUrl]);

  async function handleIndustryQuestion(item) {
    if (!canUseAI) return;

    setAskedQuestions((prev) => ({
      ...prev,
      [item.key]: { status: "saving", question: item.question },
    }));
    onAskAIQuestion?.(item.question);

    try {
      await postJson("/api/lessons/ai-question", {
        userId,
        lessonId: lesson.lesson_id,
        questionKey: item.question,
        questionText: item.answerText || item.question,
        completed: true,
      });
      setAskedQuestions((prev) => ({
        ...prev,
        [item.key]: { status: "saved", question: item.question },
      }));
      onProgressUpdated?.();
    } catch (err) {
      setAskedQuestions((prev) => ({
        ...prev,
        [item.key]: {
          status: "local",
          question: item.question,
          message: err.message,
        },
      }));
    }
  }

  async function evaluateAnswer(item) {
    if (!canUseAI) return;

    const studentAnswer = (answers[item.key] || "").trim();
    if (!studentAnswer) {
      setEvaluations((prev) => ({
        ...prev,
        [item.key]: { status: "error", feedback: "Write your answer before asking AI to evaluate it." },
      }));
      return;
    }

    setEvaluations((prev) => ({
      ...prev,
      [item.key]: { status: "saving", feedback: "Saving answer..." },
    }));

    onAskAIQuestion?.(
      [
        "Evaluate my guided asset answer.",
        `Lesson: ${lessonConfig.title}`,
        `Prompt: ${item.prompt}`,
        `My answer: ${studentAnswer}`,
        "Give concise feedback, mention what is correct, what is missing, and one next improvement. Do not rewrite the full answer for me.",
      ].join("\n\n")
    );

    try {
      await postJson("/api/lessons/assets", {
        userId,
        lessonId: lesson.lesson_id,
        assetKey: item.prompt,
        answerText: studentAnswer,
        answered: true,
      });

      setEvaluations((prev) => ({
        ...prev,
        [item.key]: { status: "sent", feedback: "Sent to AI chat for feedback." },
      }));
      onProgressUpdated?.();
    } catch (err) {
      setEvaluations((prev) => ({
        ...prev,
        [item.key]: {
          status: "local",
          feedback: `Sent to AI chat, but progress was not saved: ${err.message}`,
        },
      }));
    }
  }

  async function startAICompanionTest() {
    if (!canUseAI) return;

    const tasksText = lessonConfig.aiCompanionTasks.length
      ? lessonConfig.aiCompanionTasks.map((task, index) => `${index + 1}. ${task}`).join("\n")
      : "No AI companion tasks are configured for this lesson.";

    onAskAIQuestion?.(
      [
        "Start an AI companion test using the lesson tasks from the database.",
        `Lesson: ${lessonConfig.title}`,
        `Tasks:\n${tasksText}`,
        "Create the questions yourself from these tasks. Ask me one question at a time. Wait for my answer before asking the next question. Do not give me the final answer unless I ask for help.",
      ].join("\n\n")
    );

    setCompanionStatus({ status: "saving", message: "Saving task start..." });

    try {
      setCompanionStatus({ status: "saved", message: "sent to chat" });
      onProgressUpdated?.();
    } catch (err) {
      setCompanionStatus({ status: "local", message: `Sent to chat, but progress was not saved: ${err.message}` });
    }
  }

  async function toggleMicroProof(proof, index, checked) {
    const key = `micro_proof_item_${index + 1}`;
    setMicroProofProgress((prev) => ({
      ...prev,
      [key]: { checked, status: "saving" },
    }));

    try {
      setMicroProofProgress((prev) => ({
        ...prev,
        [key]: { checked, status: "saved" },
      }));
      onProgressUpdated?.();
    } catch (err) {
      setMicroProofProgress((prev) => ({
        ...prev,
        [key]: { checked: !checked, status: "error", message: err.message },
      }));
    }
  }

  async function submitCommit() {
    const cleanedRepo = normalizedRepoUrl || repoUrl.trim();
    const cleanedSha = commitSha.trim();

    if (!cleanedRepo || !cleanedSha) {
      setCommitStatus({ status: "error", message: "Add both a GitHub repo link and commit SHA." });
      return;
    }

    setSubmittingCommit(true);
    setCommitStatus({ status: "saving", message: "Verifying commit..." });

    try {
      const result = await postJson("/api/lessons/github-commit", {
        userId,
        lessonId: lesson.lesson_id,
        repoUrl: cleanedRepo,
        commitSha: cleanedSha,
        deliverable: lessonConfig.deliverable,
        microProof: lessonConfig.microProof,
      });

      setCommitStatus({
        status: result.verified === false ? "error" : "saved",
        message: result.message || (result.verified === false ? "Commit could not be verified." : "Commit verified and saved."),
      });
      onProgressUpdated?.();
    } catch (err) {
      setCommitStatus({ status: "local", message: `Could not verify commit yet: ${err.message}` });
    } finally {
      setSubmittingCommit(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "#fff", border: "1px solid #e8e4f0", borderRadius: 8, padding: 14 }}>
        <SectionLabel>Goal</SectionLabel>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1035", marginBottom: 6 }}>
          {lessonConfig.title}
        </div>
        <div style={{ fontSize: 12, color: "#5c5478", lineHeight: 1.55 }}>
          {lessonConfig.goal}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e4f0", borderRadius: 8, padding: 14 }}>
        <SectionLabel>Assessment Preparation Checklist</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
          {lessonConfig.staticTopics.map((topic) => (
            <div key={topic} style={{
              border: "1px solid #f0ecfc",
              background: "#faf9ff",
              borderRadius: 8,
              padding: "9px 10px",
              fontSize: 12,
              color: "#342454",
              fontWeight: 700,
            }}>
              {topic}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #d8d0f0", borderRadius: 8, padding: 14 }}>
        <SectionLabel>AI / Industry Context</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lessonConfig.aiIndustryQuestions.map((item) => {
            const state = askedQuestions[item.key];
            return (
              <div key={item.key} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleIndustryQuestion(item)}
                  disabled={!canUseAI}
                  style={{
                    border: "1px solid #d8d0f0",
                    background: canUseAI ? "#f0ecfc" : "#f3f4f6",
                    color: canUseAI ? "#6b46c1" : "#9ca3af",
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: canUseAI ? "pointer" : "not-allowed",
                    textAlign: "left",
                  }}
                >
                  Ask AI: {item.question}
                </button>
                {state?.status === "saved" && <StatusPill tone="success">tracked</StatusPill>}
                {state?.status === "saving" && <StatusPill tone="purple">saving</StatusPill>}
                {state?.status === "local" && <StatusPill tone="warning">sent to chat</StatusPill>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e4f0", borderRadius: 8, padding: 14 }}>
        <SectionLabel>Guided Track</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lessonConfig.guidedEvaluations.map((item) => {
            const evaluation = evaluations[item.key];
            return (
              <div key={item.key} style={{ border: "1px solid #f0ecfc", borderRadius: 8, background: "#faf9ff", padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#1a1035", lineHeight: 1.45 }}>
                  {item.prompt}
                </div>
                <textarea
                  value={answers[item.key] || ""}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [item.key]: event.target.value }))}
                  placeholder="Write your answer here. AI will evaluate your reasoning."
                  rows={3}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    border: "1px solid #ddd6fe",
                    borderRadius: 8,
                    padding: 10,
                    resize: "vertical",
                    fontSize: 12,
                    color: "#1a1035",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => evaluateAnswer(item)}
                    disabled={!canUseAI}
                    style={{
                      border: "none",
                      background: canUseAI ? "linear-gradient(135deg, #6b46c1, #8b5cf6)" : "#f3f4f6",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: canUseAI ? "pointer" : "not-allowed",
                    }}
                  >
                    {canUseAI ? "Send answer to AI chat" : "AI Locked"}
                  </button>
                  {evaluation?.status === "sent" && <StatusPill tone="purple">sent to chat</StatusPill>}
                </div>
                {evaluation?.feedback && (
                  <div style={{
                    marginTop: 8,
                    border: "1px solid #fde68a",
                    background: "#fffbeb",
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 11,
                    color: evaluation.status === "error" ? "#991b1b" : "#78350f",
                    lineHeight: 1.55,
                  }}>
                    {evaluation.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
      }}>
        <div style={{ background: "#fff", border: "1px solid #e8e4f0", borderRadius: 8, padding: 14 }}>
          <SectionLabel>AI Companion Tasks</SectionLabel>
          <button
            type="button"
            onClick={startAICompanionTest}
            disabled={!canUseAI || lessonConfig.aiCompanionTasks.length === 0}
            style={{
              border: "1px solid #d8d0f0",
              background: canUseAI && lessonConfig.aiCompanionTasks.length > 0 ? "#f0ecfc" : "#f3f4f6",
              color: canUseAI && lessonConfig.aiCompanionTasks.length > 0 ? "#6b46c1" : "#9ca3af",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 11,
              fontWeight: 800,
              cursor: canUseAI && lessonConfig.aiCompanionTasks.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            {canUseAI ? "Ask AI test" : "AI Locked"}
          </button>
          {companionStatus?.message && (
            <div style={{ marginTop: 8 }}>
              <StatusPill tone={companionStatus.status === "saved" ? "success" : companionStatus.status === "saving" ? "purple" : "warning"}>
                {companionStatus.message}
              </StatusPill>
            </div>
          )}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e8e4f0", borderRadius: 8, padding: 14 }}>
          <SectionLabel>Deliverable / Micro Proof</SectionLabel>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a1035", lineHeight: 1.45 }}>
            {lessonConfig.deliverable}
          </div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {lessonConfig.microProof.map((proof, index) => {
              const key = `micro_proof_item_${index + 1}`;
              const state = microProofProgress[key];
              return (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "#5c5478" }}>
                <input
                  type="checkbox"
                  checked={state?.checked === true}
                  onChange={(event) => toggleMicroProof(proof, index, event.target.checked)}
                />
                {proof}
                {state?.status === "saving" && <StatusPill tone="purple">saving</StatusPill>}
                {state?.status === "saved" && <StatusPill tone="success">saved</StatusPill>}
                {state?.status === "error" && <StatusPill tone="warning">not saved</StatusPill>}
              </label>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #bae6fd", borderRadius: 8, padding: 14 }}>
        <SectionLabel>GitHub Commit</SectionLabel>
        <div style={{ fontSize: 11, color: "#5c5478", lineHeight: 1.55, marginBottom: 10 }}>
          Submit the commit that proves this lesson deliverable.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(180px, 0.8fr)", gap: 8 }}>
          <input
            type="url"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/username/repo"
            style={{ border: "1px solid #bae6fd", borderRadius: 8, padding: "9px 10px", fontSize: 12, minWidth: 0 }}
          />
          <input
            value={commitSha}
            onChange={(event) => setCommitSha(event.target.value)}
            placeholder="commit SHA"
            style={{ border: "1px solid #bae6fd", borderRadius: 8, padding: "9px 10px", fontSize: 12, minWidth: 0 }}
          />
        </div>
        <div style={{ marginTop: 9, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={submitCommit}
            disabled={submittingCommit}
            style={{
              border: "none",
              background: "#0369a1",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 11,
              fontWeight: 800,
              cursor: submittingCommit ? "wait" : "pointer",
            }}
          >
            {submittingCommit ? "Verifying..." : "Verify commit"}
          </button>
          {commitStatus?.message && (
            <StatusPill tone={commitStatus.status === "saved" ? "success" : commitStatus.status === "saving" ? "purple" : "warning"}>
              {commitStatus.message}
            </StatusPill>
          )}
        </div>
      </div>
    </div>
  );
}
