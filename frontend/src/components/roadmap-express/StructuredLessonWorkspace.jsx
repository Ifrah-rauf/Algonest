import { apiUrl } from "../../config/api.js";
import { useMemo, useState } from "react";
import { normalizeGithubUrl } from "../student-dashboard/github";
import {
  PlayCircle,
  Layers,
  Sparkles,
  Zap,
  Lock,
  CheckCircle2,
  Github,
  MessageSquare,
  Trophy,
} from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || apiUrl("");
const COMPANION_TASK_PROGRESS_KEY = "__ai_companion_task_started__";

/**
 * UI Components reflecting the refined design language from LessonPage.jsx 
 * but maintaining the functional logic of StructuredLessonWorkspace.
 */

function SectionEyebrow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-indigo-500" />}
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function StatusPill({ tone = "neutral", children }) {
  const styles = {
    neutral: "bg-slate-100 text-slate-500 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };
  const colorClass = styles[tone] || styles.neutral;

  return (
    <span className={`inline-flex items-center border px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
      {children}
    </span>
  );
}

function LastChangeNotice() {
  return (
    <div className="mb-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700">
      Your last change was recorded.
    </div>
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

// Helper functions for data extraction/normalization preserved exactly as per original source
function parseMaybeJson(value, fallback) {
  if (!value) return fallback;
  if (Array.isArray(value) || typeof value === "object") return value;
  try { return JSON.parse(value); } catch (err) { return fallback; }
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
    if (Array.isArray(value)) { value.forEach(visit); return; }
    Object.entries(value).forEach(([key, child]) => {
      if (keySet.has(key) && child != null) { matches.push(child); }
      if (child && typeof child === "object") { visit(child); }
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
  const list = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" ? Object.entries(parsed).map(([key, value]) => (
        value && typeof value === "object" ? { key, ...value } : { key, [textField]: String(value || "") }
      )) : typeof parsed === "string" && parsed.trim() ? [parsed] : [];

  return list.map((item, index) => {
      if (typeof item === "string") { return { key: `item_${index + 1}`, [textField]: item }; }
      const textValue = item[textField] || item.question || item.q || item.question_text || item.prompt || item.p || item.prompt_text || item.asset || item.instruction || item.task || item.title || item.text || item.label || "";
      const answerValue = item.answer || item.ans || item.response || item.answer_text || item.expectedAnswer || item.expected_answer || item.explanation || item.description || "";
      return { key: item.key || item.id || `item_${index + 1}`, ...item, [textField]: textValue, answerText: answerValue };
    }).filter((item) => item[textField]);
}

function normalizeTextList(value) {
  const parsed = parseMaybeJson(value, value);
  if (Array.isArray(parsed)) {
    return parsed.map((item) => {
        if (typeof item === "string") return item;
        return item?.label || item?.title || item?.topic || item?.section || item?.task || item?.asset || item?.text || item?.name || item?.proof || "";
      }).filter(Boolean);
  }
  if (parsed && typeof parsed === "object") {
    return Object.values(parsed).map((item) => {
        if (typeof item === "string") return item;
        return item?.label || item?.title || item?.topic || item?.section || item?.task || item?.asset || item?.text || item?.name || item?.proof || "";
      }).filter(Boolean);
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
  const structured = { ...contentSchema, ...lessonStructure, ...structuredContent };
  const structuredSources = [lesson.structured_content, lesson.lesson_structure, lesson.content_schema, structured];

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
    aiIndustryQuestions: normalizeKeyedItems(firstNonEmptyList(
        lesson.ai_industry_questions,
        structured.aiIndustryQuestions,
        structured.ai_industry_questions,
        structured.industryQuestions,
        structured.industry_questions,
        structured.aiQuestions,
        structured.ai_questions,
        structured.questions,
        firstNestedNonEmpty(structuredSources, ["aiIndustryQuestions","ai_industry_questions","industryQuestions","industry_questions","aiQuestions","ai_questions","questions","q"])
      ), "question"),
    guidedEvaluations: normalizeKeyedItems(firstNonEmptyList(
        lesson.guided_assets,
        structured.guidedEvaluations,
        structured.guided_evaluations,
        structured.guidedAssets,
        structured.guided_assets,
        structured.assets,
        structured.evaluations,
        structured.guidedTrack,
        structured.guided_track,
        firstNestedNonEmpty(structuredSources, ["guidedEvaluations","guided_evaluations","guidedAssets","guided_assets","guidedTrack","guided_track","assets","evaluations","prompts"])
      ), "prompt"),
    aiCompanionTasks: normalizeTextList(firstNonEmptyList(
        lesson.ai_companion_tasks,
        structured.aiCompanionTasks,
        structured.ai_companion_tasks,
        structured.companionTasks,
        structured.companion_tasks,
        structured.tasks,
        firstNestedNonEmpty(structuredSources, ["aiCompanionTasks","ai_companion_tasks","companionTasks","companion_tasks","tasks"])
      )),
    deliverable: structured.deliverable || structured.commit || lesson.deliverable || lesson.commit_deliverable || "",
    microProof: normalizeTextList(structured.microProof || structured.micro_proof || structured.proof || lesson.micro_proof),
  };
}

export default function StructuredLessonWorkspace({
  lesson,
  topics = [],
  courseId,
  userId,
  canUseAI,
  savedAIQuestions = [],
  savedAssetAnswers = [],
  savedCommitProofs = [],
  onAskAIQuestion,
  onProgressUpdated,
}) {
  const [askedQuestions, setAskedQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [companionStatus, setCompanionStatus] = useState(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [commitSha, setCommitSha] = useState("");
  const [commitStatus, setCommitStatus] = useState(null);
  const [submittingCommit, setSubmittingCommit] = useState(false);

  const lessonConfig = buildLessonConfig(lesson, topics);
  const normalizedRepoUrl = useMemo(() => normalizeGithubUrl(repoUrl), [repoUrl]);
  const savedAIQuestionTexts = useMemo(
    () => new Set((savedAIQuestions || []).filter((row) => row.completed === true).map((row) => row.question_text)),
    [savedAIQuestions]
  );
  const savedAssetKeys = useMemo(
    () => new Set((savedAssetAnswers || []).filter((row) => row.answered === true).map((row) => row.asset_key)),
    [savedAssetAnswers]
  );
  const hasSavedCommitProof = useMemo(
    () => (savedCommitProofs || []).some((row) => row.verified === true),
    [savedCommitProofs]
  );
  const companionTaskRecorded =
    companionStatus?.status === "saved" || savedAIQuestionTexts.has(COMPANION_TASK_PROGRESS_KEY);

  // Priority functions preserved for backend sync
  async function handleIndustryQuestion(item) {
    if (!canUseAI) return;
    setAskedQuestions((prev) => ({ ...prev, [item.key]: { status: "saving", question: item.question } }));
    onAskAIQuestion?.(item.question);
    try {
      await postJson("/api/lessons/ai-question", { userId, lessonId: lesson.lesson_id, questionKey: item.question, questionText: item.question, completed: true });
      setAskedQuestions((prev) => ({ ...prev, [item.key]: { status: "saved", question: item.question } }));
      onProgressUpdated?.();
    } catch (err) {
      setAskedQuestions((prev) => ({ ...prev, [item.key]: { status: "local", question: item.question, message: err.message } }));
    }
  }

  async function evaluateAnswer(item) {
    if (!canUseAI) return;
    const studentAnswer = (answers[item.key] || "").trim();
    if (!studentAnswer) {
      setEvaluations((prev) => ({ ...prev, [item.key]: { status: "error", feedback: "Write your answer before asking AI to evaluate it." } }));
      return;
    }
    setEvaluations((prev) => ({ ...prev, [item.key]: { status: "saving", feedback: "Saving answer..." } }));
    onAskAIQuestion?.([
        "Evaluate my guided asset answer.",
        `Lesson: ${lessonConfig.title}`,
        `Prompt: ${item.prompt}`,
        `My answer: ${studentAnswer}`,
        "Give concise feedback, mention what is correct, what is missing, and one next improvement. Do not rewrite the full answer for me.",
      ].join("\n\n"));
    try {
      await postJson("/api/lessons/assets", { userId, lessonId: lesson.lesson_id, assetKey: item.prompt, answerText: studentAnswer, answered: true });
      setEvaluations((prev) => ({ ...prev, [item.key]: { status: "sent", feedback: "Sent to AI chat for feedback." } }));
      onProgressUpdated?.();
    } catch (err) {
      setEvaluations((prev) => ({ ...prev, [item.key]: { status: "local", feedback: `Sent to AI chat, but progress was not saved: ${err.message}` } }));
    }
  }

  async function startAICompanionTest() {
    if (!canUseAI) return;
    const tasksText = lessonConfig.aiCompanionTasks.length ? lessonConfig.aiCompanionTasks.map((task, index) => `${index + 1}. ${task}`).join("\n") : "No AI companion tasks are configured for this lesson.";
    onAskAIQuestion?.([
        "Start an AI companion test using the lesson tasks from the database.",
        `Lesson: ${lessonConfig.title}`,
        `Tasks:\n${tasksText}`,
        "Create the questions yourself from these tasks. Ask me one question at a time. Wait for my answer before asking the next question. Do not give me the final answer unless I ask for help.",
      ].join("\n\n"));
    setCompanionStatus({ status: "saving", message: "Saving task start..." });
    try {
      await postJson("/api/lessons/ai-question", {
        userId,
        lessonId: lesson.lesson_id,
        questionKey: COMPANION_TASK_PROGRESS_KEY,
        questionText: COMPANION_TASK_PROGRESS_KEY,
        completed: true,
      });
      setCompanionStatus({ status: "saved", message: "sent to chat" });
      onProgressUpdated?.();
    } catch (err) {
      setCompanionStatus({ status: "local", message: `Sent to chat, but progress was not saved: ${err.message}` });
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
      const result = await postJson("/api/lessons/github-commit", { userId, lessonId: lesson.lesson_id, repoUrl: cleanedRepo, commitSha: cleanedSha, deliverable: lessonConfig.deliverable, microProof: lessonConfig.microProof });
      setCommitStatus({ status: "saved", message: result.message || "Commit verified and saved." });
      onProgressUpdated?.();
    } catch (err) {
      setCommitStatus({ status: "error", message: `Commit was not saved: ${err.message}` });
    } finally {
      setSubmittingCommit(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto font-sans text-slate-900 antialiased">
      
      {/* ── Goal & Header ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="border-l-[4px] border-indigo-500 p-5">
          <SectionEyebrow icon={Trophy} label="Active Goal" />
          <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
            {lessonConfig.title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-500 font-medium">
            {lessonConfig.goal}
          </p>
        </div>
      </div>

      {/* ── Market Trajectory & Intelligence Snapshot (Integrated stats UI) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 border border-slate-200 rounded-xl p-5 shadow-sm">
          <SectionEyebrow icon={Layers} label="Preparation Checklist" />
          <div className="grid grid-cols-1 gap-2.5 mt-2">
            {lessonConfig.staticTopics.map((topic) => (
              <div key={topic} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-3.5 py-3 transition hover:bg-white hover:border-slate-200">
                <div className="w-5 h-5 rounded-full border-2 border-indigo-200 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-700 tracking-tight">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 border border-slate-200 rounded-xl p-5 shadow-sm">
          <SectionEyebrow icon={Sparkles} label="Market Context & AI Prep" />
          <div className="flex flex-col gap-3">
            {lessonConfig.aiIndustryQuestions.map((item) => {
              const state = askedQuestions[item.key];
              const isRecorded = state?.status === "saved" || savedAIQuestionTexts.has(item.question);
              return (
                <div key={item.key} className="group relative">
                  {isRecorded && <LastChangeNotice />}
                  <button
                    type="button"
                    onClick={() => handleIndustryQuestion(item)}
                    disabled={!canUseAI}
                    className={`w-full flex items-center justify-between gap-4 text-left p-3.5 rounded-xl border transition-all ${
                      canUseAI 
                        ? "bg-indigo-50/30 border-indigo-100 hover:border-gray-700 hover:shadow-md" 
                        : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3 hover:text-gray-800">
                      <div className="bg-white p-1.5 rounded-lg shadow-sm">
                        <MessageSquare size={14} className="text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-100">Ask AI: {item.question}</span>
                    </div>
                    {state?.status && (
                      <div className="shrink-0">
                        {state.status === "saved" && <StatusPill tone="success">Tracked</StatusPill>}
                        {state.status === "saving" && <StatusPill tone="purple">Syncing</StatusPill>}
                        {state.status === "local" && <StatusPill tone="warning">Sent</StatusPill>}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Guided Track (Interactive Step Cards) ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <SectionEyebrow icon={Zap} label="Guided Execution Track" />
        <div className="flex flex-col gap-4 mt-2">
          {lessonConfig.guidedEvaluations.map((item, index) => {
            const evaluation = evaluations[item.key];
            const isRecorded = evaluation?.status === "sent" || savedAssetKeys.has(item.prompt);
            return (
              <div key={item.key} className="group border border-slate-100 bg-slate-50/50 rounded-xl p-5 transition hover:bg-white hover:border-slate-200">
                {isRecorded && <LastChangeNotice />}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-[13px] font-bold text-slate-800 leading-snug">
                    {item.prompt}
                  </h3>
                </div>
                
                <textarea
                  id={`guided-evaluation-${item.key}`}
                  name={`guidedEvaluation-${item.key}`}
                  value={answers[item.key] || ""}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [item.key]: event.target.value }))}
                  placeholder="Analyze the architectural pattern or code logic here..."
                  className="w-full min-h-[100px] text-sm p-4 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-inner"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    {evaluation?.status === "sent" && <StatusPill tone="purple">Sent to Chat</StatusPill>}
                  </div>
                  <button
                    type="button"
                    onClick={() => evaluateAnswer(item)}
                    disabled={!canUseAI}
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      canUseAI 
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200" 
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Sparkles size={13} />
                    {canUseAI ? "Ask AI Assessment" : "AI Interface Locked"}
                  </button>
                </div>

                {evaluation?.feedback && (
                  <div className={`mt-4 p-4 rounded-lg border text-xs leading-relaxed font-medium ${
                    evaluation.status === "error" ? "bg-rose-50 border-rose-100 text-rose-700" : "bg-amber-50 border-amber-100 text-amber-800"
                  }`}>
                    <div className="flex gap-2">
                       <span className="shrink-0">💡</span>
                       <span>{evaluation.feedback}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI Companion & Delivery (Footer Actions) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <SectionEyebrow icon={PlayCircle} label="AI Companion Task" />
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
            {companionTaskRecorded && <LastChangeNotice />}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${canUseAI ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-400"}`}>
                {canUseAI ? <Zap size={18} /> : <Lock size={18} />}
              </div>
              <div className="text-xs font-bold text-amber-900">Interactive Knowledge Validation</div>
            </div>
            
            <button
              type="button"
              onClick={startAICompanionTest}
              disabled={!canUseAI || lessonConfig.aiCompanionTasks.length === 0}
              className={`w-full py-3 rounded-lg text-xs font-bold transition-all ${
                canUseAI && lessonConfig.aiCompanionTasks.length > 0
                  ? "bg-amber-600 text-white hover:bg-amber-700 shadow-md shadow-amber-200"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              }`}
            >
              {canUseAI ? "Initiate AI Interview Test" : "Unlock via Guided Track"}
            </button>

            {companionStatus?.message && (
              <div className="mt-3 text-center">
                <StatusPill tone={companionStatus.status === "saved" ? "success" : "purple"}>
                  {companionStatus.message}
                </StatusPill>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-indigo-100 rounded-xl p-5 shadow-md">
          <SectionEyebrow icon={Github} label="GitHub Deliverable Proof" />
          {(commitStatus?.status === "saved" || hasSavedCommitProof) && <LastChangeNotice />}
          <div className="mb-4">
             <div className="text-xs font-bold text-slate-900 mb-1">{lessonConfig.deliverable}</div>
             <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Enter repository and commit SHA to verify</p>
          </div>

          <div className="space-y-2">
            <input
              id="lesson-repository-url"
              name="repositoryUrl"
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/username/repo"
              autoComplete="url"
              className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
            <input
              id="lesson-commit-sha"
              name="commitSha"
              type="text"
              value={commitSha}
              onChange={(event) => setCommitSha(event.target.value)}
              placeholder="Commit SHA (e.g. a1b2c3d)"
              className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="button"
              onClick={submitCommit}
              disabled={submittingCommit}
              className={`w-full py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                submittingCommit 
                  ? "bg-slate-100 text-slate-400 cursor-wait" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              }`}
            >
              {submittingCommit ? "Verifying..." : "Verify and Sync Deliverable"}
              {!submittingCommit && <CheckCircle2 size={14} />}
            </button>
            
            {commitStatus?.message && (
              <div className="text-center">
                <StatusPill tone={commitStatus.status === "saved" ? "success" : commitStatus.status === "saving" ? "purple" : "warning"}>
                  {commitStatus.message}
                </StatusPill>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
