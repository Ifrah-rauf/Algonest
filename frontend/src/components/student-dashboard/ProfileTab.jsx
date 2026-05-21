import { useEffect, useState } from "react";
import { GraduationCap, Sparkles, X } from "lucide-react";
import { API_BASE, C } from "./constants";
import { SectionCard } from "./ui";

const allowedResumeExtensions = [".pdf", ".doc", ".docx"];

function getFileExtension(fileName) {
  return fileName.toLowerCase().substring(fileName.lastIndexOf("."));
}

function ProfileToast({ toast }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed left-3 right-3 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all sm:left-1/2 sm:right-auto sm:-translate-x-1/2 ${
        toast.type === "success"
          ? "border border-green-200 bg-green-100 text-green-800"
          : "border border-red-200 bg-red-100 text-red-800"
      }`}
      style={{ maxWidth: "400px" }}
    >
      {toast.message}
    </div>
  );
}

export default function ProfileTab({ student, data, navigate, onProfileSave }) {
  const profile = data?.profile || {};
  const studentId = profile.s_id || student?.s_id;
  const initialGithub = profile.github || profile.github_url || profile.githubUrl || "";
  const initialResume = profile.resume || profile.resume_url || profile.resumeUrl || "";

  const [githubLink, setGithubLink] = useState(initialGithub);
  const [resumeLink, setResumeLink] = useState(initialResume);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumePreview, setResumePreview] = useState(initialResume);
  const [savingGithub, setSavingGithub] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    setGithubLink(initialGithub);
    setResumeLink(initialResume);
    setResumePreview(initialResume);
  }, [initialGithub, initialResume]);

  const validateGithub = (url) => {
    if (!url.trim()) {
      showToast("GitHub URL cannot be empty");
      return false;
    }

    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/?$/;
    if (!githubRegex.test(url)) {
      showToast("Please enter a valid GitHub profile URL (e.g., https://github.com/username)");
      return false;
    }

    return true;
  };

  const validateResume = (url, fileName) => {
    if (!url.trim() && !fileName) {
      showToast("Please provide a resume URL or upload a file");
      return false;
    }

    if (fileName && !allowedResumeExtensions.includes(getFileExtension(fileName))) {
      showToast("Resume must be a PDF, DOC, or DOCX file");
      return false;
    }

    return true;
  };

  async function handleGithubSave() {
    if (!validateGithub(githubLink)) return;

    if (!studentId) {
      showToast("Student profile is not loaded yet. Please refresh and try again.");
      return;
    }

    setSavingGithub(true);
    try {
      const res = await fetch(`${API_BASE}/api/student/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, githubUrl: githubLink }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save GitHub link");
      }

      onProfileSave?.({ github: githubLink, github_url: githubLink, githubUrl: githubLink });
      showToast(result.message || "GitHub link saved successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to save GitHub link");
    } finally {
      setSavingGithub(false);
    }
  }


  const handleResumeFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!allowedResumeExtensions.includes(getFileExtension(file.name))) {
      showToast("Resume must be a PDF, DOC, or DOCX file");
      return;
    }

    setResumeFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setResumePreview(reader.result);
      setResumeLink(reader.result);
    };
    reader.readAsDataURL(file);
  };

  async function handleResumeSave() {
    if (!validateResume(resumeLink, resumeFileName)) return;

    if (!studentId) {
      showToast("Student profile is not loaded yet. Please refresh and try again.");
      return;
    }

    setSavingResume(true);
    try {
      const resumeValue = resumeLink || resumePreview;
      const res = await fetch(`${API_BASE}/api/student/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, resumeUrl: resumeValue }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save resume");
      }

      onProfileSave?.({ resume: resumeValue, resume_url: resumeValue, resumeUrl: resumeValue });
      showToast(result.message || "Resume saved successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to save resume");
    } finally {
      setSavingResume(false);
    }
  }


  const handleRemoveResume = () => {
    setResumeFileName("");
    setResumePreview("");
    setResumeLink("");
    showToast("Resume removed", "success");
  };

  const quizSummary = {
    attempted: data?.lessonProgress?.quiz_attempts ?? data?.lessonProgress?.attempted ?? 0,
    latestScore: data?.lessonProgress?.quiz_marks ?? data?.lessonProgress?.latestScore ?? null,
    passRate: data?.lessonProgress?.passRate ?? null,
    latestLessonTitle: data?.lessonProgress?.latestLessonTitle ?? null,
    latestPassed: data?.lessonProgress?.quiz_passed ?? data?.lessonProgress?.latestPassed ?? null,
  };
  const hasAttempts = quizSummary.attempted > 0;

  return (
    <div className="space-y-4">
      <SectionCard
        title="Quiz performance"
        action={
          <button type="button" className="rounded-full bg-[var(--dash-purple)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90" onClick={() => navigate("/careerquiz")}>
            {hasAttempts ? "View quiz history" : "Take a quiz"}
          </button>
        }
      >
        {hasAttempts ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border p-4" style={{ borderColor: C.border, background: C.white }}>
                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dash-purple)] sm:tracking-[0.2em]">Latest attempt</div>
                <div className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: C.ink }}>
                  {quizSummary.latestScore != null ? `${quizSummary.latestScore}/6` : "-"}
                </div>
                <div className="mt-2 text-sm" style={{ color: C.muted }}>
                  {quizSummary.latestLessonTitle || "Recent quiz result"}
                </div>
                <div className="mt-3 text-sm text-[var(--dash-purple)]">
                  {quizSummary.latestPassed ? "Passed" : "Needs review"}
                </div>
              </div>

              <div className="rounded-3xl border p-4" style={{ borderColor: C.border, background: C.white }}>
                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dash-purple)] sm:tracking-[0.2em]">Summary</div>
                <div className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: C.ink }}>
                  {quizSummary.attempted}
                </div>
                <div className="mt-2 text-sm" style={{ color: C.muted }}>
                  Attempt{quizSummary.attempted === 1 ? "" : "s"}
                </div>
                <div className="mt-3 text-sm text-[var(--dash-purple)]">{quizSummary.passRate || "No pass data yet"}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
            <Sparkles className="h-16 w-16 text-[var(--dash-purple)]" />
            <p className="mt-5 max-w-xl text-sm" style={{ color: C.muted }}>
              No quiz data found yet. Take a lesson quiz to start tracking scores and get better project matches.
            </p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Skill and domain matrix">
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm font-semibold" style={{ color: C.ink }}>
              Core Domains:
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "rgba(107,70,193,0.22)", background: C.purpleLight, color: C.purpleDark }}>
                {data?.activeCourse?.domain || "Databases"}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold" style={{ color: C.ink }}>
              Current focus:
            </div>
            <div className="rounded-2xl border p-4 text-sm leading-7" style={{ borderColor: C.border, background: C.bg, color: C.muted }}>
              {student.headline}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="GitHub profile">
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: C.ink }}>
            GitHub URL
          </label>
          <input type="url" value={githubLink} onChange={(event) => setGithubLink(event.target.value)} placeholder="https://github.com/yourusername" className="w-full min-w-0 rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--dash-purple)]" style={{ borderColor: C.border, background: C.white, color: C.ink }} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={handleGithubSave} className="w-full rounded-full bg-[var(--dash-purple)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto" disabled={savingGithub}>
              {savingGithub ? "Saving..." : "Save GitHub"}
            </button>
            {githubLink ? (
              <a href={githubLink} target="_blank" rel="noreferrer" className="break-all text-sm font-semibold text-[var(--dash-purple)] transition hover:underline sm:break-normal">
                Open link
              </a>
            ) : null}
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Add your GitHub link so your projects and repositories are visible to mentors.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Resume">
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: C.ink }}>
            Resume URL or Upload
          </label>
          <input type="url" value={resumeLink} onChange={(event) => setResumeLink(event.target.value)} placeholder="Paste resume link here" className="w-full min-w-0 rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--dash-purple)]" style={{ borderColor: C.border, background: C.white, color: C.ink }} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-[var(--dash-purple)] bg-white px-4 py-2 text-sm font-semibold text-[var(--dash-purple)] transition hover:bg-purple-50 sm:w-auto" style={{ borderColor: C.border }}>
              Upload file
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFile} className="sr-only" />
            </label>
            <button type="button" onClick={handleResumeSave} className="w-full rounded-full bg-[var(--dash-purple)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto" disabled={savingResume}>
              {savingResume ? "Saving..." : "Save resume"}
            </button>
          </div>

          {resumeFileName ? (
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0 break-all text-sm text-[var(--dash-purple)]">Selected file: {resumeFileName}</div>
              <button type="button" onClick={handleRemoveResume} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-200" title="Remove resume">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}

          {resumePreview ? (
            <div className="flex min-w-0 items-center gap-2">
              <a href={resumePreview} target="_blank" rel="noreferrer" className="min-w-0 break-all text-sm font-semibold text-[var(--dash-purple)] transition hover:underline sm:break-normal">
                View resume
              </a>
              <button type="button" onClick={handleRemoveResume} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-200" title="Remove resume">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}

          <p className="text-sm" style={{ color: C.muted }}>
            Upload a PDF or provide a resume link so mentors can review your experience in one place.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Education" action={<button type="button" className="rounded-full text-[var(--dash-purple)] transition hover:opacity-80">+</button>}>
        <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
          <GraduationCap className="h-16 w-16 text-[var(--dash-purple)]" />
          <div className="mt-5 text-base font-semibold" style={{ color: C.ink }}>
            {student.education}
          </div>
          <div className="mt-2 text-sm" style={{ color: C.muted }}>
            Package window: {student.packageStart} to {student.packageEnd}
          </div>
        </div>
      </SectionCard>

      <ProfileToast toast={toast} />
    </div>
  );
}
