import { useEffect, useState } from "react";
import { GraduationCap, Sparkles, X } from "lucide-react";
import { API_BASE } from "./constants";
import { SectionCard } from "./ui";
import { normalizeGithubUrl } from "./github";

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
    >
      {toast.message}
    </div>
  );
}

export default function ProfileTab({
  student,
  data,
  courses = [],
  projectSuggestions = [],
  projectsLoading = false,
  navigate,
  onProfileSave,
}) {
  const profile = data?.profile || {};
  const studentId = profile.s_id || student?.s_id;
  const initialGithub = profile.github || profile.github_url || profile.githubUrl || "";
  const initialResume = profile.resume || profile.resume_url || profile.resumeUrl || "";
  const initialCourseId =
    profile.course_id ||
    data?.selectedCourse?.courseId ||
    data?.selectedCourse?.course_id ||
    data?.activeCourse?.courseId ||
    data?.activeCourse?.course_id ||
    "";
  const resolvedDomain =
    data?.domain ||
    profile.domain ||
    data?.activeCourse?.domain ||
    data?.selectedCourse?.domain ||
    student?.domain ||
    null;

  const [githubLink, setGithubLink] = useState(initialGithub);
  const [selectedCourseId, setSelectedCourseId] = useState(String(initialCourseId || ""));
  const [projectMode, setProjectMode] = useState("recommended");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [courseProjects, setCourseProjects] = useState(projectSuggestions);
  const [courseProjectsLoading, setCourseProjectsLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState(profile.project_title || "");
  const [resumeLink, setResumeLink] = useState(initialResume);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumePreview, setResumePreview] = useState(initialResume);
  const [savingGithub, setSavingGithub] = useState(false);
  const [savingRoadmap, setSavingRoadmap] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    setGithubLink(initialGithub);
    setSelectedCourseId(String(initialCourseId || ""));
    setProjectTitle(profile.project_title || "");
    setResumeLink(initialResume);
    setResumePreview(initialResume);
  }, [initialCourseId, initialGithub, initialResume, profile.project_title]);

  useEffect(() => {
    setCourseProjects(projectSuggestions);
  }, [projectSuggestions]);

  useEffect(() => {
    async function loadCourseProjects() {
      if (!profile.uid || !selectedCourseId) {
        setCourseProjects([]);
        return;
      }

      setCourseProjectsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/projects/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: profile.uid, courseId: selectedCourseId }),
        });
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load project recommendations");
        }

        setCourseProjects(result.projects || []);
      } catch (err) {
        console.error("Project recommendation failed:", err);
        setCourseProjects([]);
      } finally {
        setCourseProjectsLoading(false);
      }
    }

    loadCourseProjects();
  }, [profile.uid, selectedCourseId]);

  const visibleProjects = courseProjects;
  const recommendationsLoading = projectsLoading || courseProjectsLoading;

  useEffect(() => {
    if (!visibleProjects.length) {
      setSelectedProjectId("");
      return;
    }

    const currentProject = visibleProjects.find(
      (project) => project.project_title === profile.project_title
    );
    setSelectedProjectId(
      String(currentProject?.project_id || visibleProjects[0]?.project_id || "")
    );
  }, [profile.project_title, visibleProjects]);

  const validateGithub = (url) => {
    if (!String(url || "").trim()) {
      showToast("GitHub URL cannot be empty");
      return false;
    }

    if (!normalizeGithubUrl(url)) {
      showToast("Please enter a valid GitHub profile or repository URL (e.g., https://github.com/username or https://github.com/username/repo)");
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
        body: JSON.stringify({ studentId, githubUrl: normalizeGithubUrl(githubLink) || githubLink }),
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

  async function handleRoadmapSave() {
    if (!selectedCourseId) {
      showToast("Please select a roadmap");
      return false;
    }

    if (!studentId) {
      showToast("Student profile is not loaded yet. Please refresh and try again.");
      return false;
    }

    const selectedCourse = courses.find(
      (course) => Number(course.course_id) === Number(selectedCourseId)
    );

    setSavingRoadmap(true);
    try {
      const res = await fetch(`${API_BASE}/api/student/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, courseId: selectedCourseId }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save roadmap");
      }

      onProfileSave?.(
        { course_id: Number(selectedCourseId), project_title: "" },
        {
          selectedCourse: selectedCourse
            ? {
                courseId: selectedCourse.course_id,
                course_id: selectedCourse.course_id,
                title: selectedCourse.title,
                desc: selectedCourse.description || selectedCourse.desc || "",
                description: selectedCourse.description || selectedCourse.desc || "",
                domain: selectedCourse.domain || null,
              }
            : data?.selectedCourse,
        }
      );
      setProjectTitle("");
      showToast(result.message || "Roadmap saved successfully", "success");
      return true;
    } catch (err) {
      showToast(err.message || "Failed to save roadmap");
      return false;
    } finally {
      setSavingRoadmap(false);
    }
  }

  async function saveRoadmapIfNeeded() {
    const currentCourseId = String(profile.course_id || data?.selectedCourse?.courseId || data?.selectedCourse?.course_id || "");
    if (!selectedCourseId || currentCourseId === String(selectedCourseId)) return true;
    return handleRoadmapSave();
  }

  async function handleProjectSave() {
    const selectedProject = visibleProjects.find(
      (project) => String(project.project_id) === String(selectedProjectId)
    );
    const nextProjectTitle =
      projectMode === "recommended" ? selectedProject?.project_title || "" : projectTitle;
    const nextProjectId = projectMode === "recommended" ? selectedProject?.project_id || null : null;

    if (!selectedCourseId) {
      showToast("Please select a roadmap before choosing a project");
      return;
    }

    if (!nextProjectTitle.trim()) {
      showToast("Project title is required");
      return;
    }

    if (!studentId) {
      showToast("Student profile is not loaded yet. Please refresh and try again.");
      return;
    }

    setSavingProject(true);
    try {
      const roadmapSaved = await saveRoadmapIfNeeded();
      if (!roadmapSaved) return;

      const res = await fetch(`${API_BASE}/api/student/project-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          projectTitle: nextProjectTitle.trim(),
          projectId: nextProjectId,
        }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save project title");
      }

      setProjectTitle(nextProjectTitle);
      onProfileSave?.({ project_title: nextProjectTitle });
      showToast(result.message || "Project title saved successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to save project title");
    } finally {
      setSavingProject(false);
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
          !hasAttempts ? (
          <button
            type="button"
            className="dash-button-primary px-3 py-1.5 text-xs"
            onClick={() => navigate("/careerquiz")}
          >
            Take a quiz
          </button>
          ) : null
        }
      >
        {hasAttempts ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="dash-card rounded-3xl border p-4">
                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dash-purple)] sm:tracking-[0.2em]">Latest quiz score</div>
                <div className="mt-3 text-2xl font-bold text-[var(--dash-ink)] sm:text-3xl">
                  {quizSummary.latestScore != null ? `${quizSummary.latestScore}/6` : "-"}
                </div>
                <div className="mt-2 text-sm text-[var(--dash-muted)]">
                  {quizSummary.latestLessonTitle || "Recent quiz result"}
                </div>
                <div className="mt-3 text-sm text-[var(--dash-purple)]">
                  {quizSummary.latestPassed ? "Passed" : "Needs review"}
                </div>
              </div>

              <div className="dash-card rounded-3xl border p-4">
                <div className="text-xs uppercase tracking-[0.12em] text-[var(--dash-purple)] sm:tracking-[0.2em]">Summary</div>
                <div className="mt-3 text-2xl font-bold text-[var(--dash-ink)] sm:text-3xl">
                  {quizSummary.attempted}
                </div>
                <div className="mt-2 text-sm text-[var(--dash-muted)]">
                  Attempt{quizSummary.attempted === 1 ? "" : "s"}
                </div>
                <div className="mt-3 text-sm text-[var(--dash-purple)]">{quizSummary.passRate || "No pass data yet"}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
            <Sparkles className="h-16 w-16 text-[var(--dash-purple)]" />
            <p className="mt-5 max-w-xl text-sm text-[var(--dash-muted)]">
              No quiz data found yet. Take a lesson quiz to start tracking scores and get better project matches.
            </p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Skill and domain matrix">
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm font-semibold text-[var(--dash-ink)]">
              Core Domains:
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg border border-[rgba(107,70,193,0.22)] bg-[var(--dash-purple-light)] px-3 py-2 text-sm text-[var(--dash-purple-dark)]">
                {resolvedDomain || "No domain selected"}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-[var(--dash-ink)]">
              Current focus:
            </div>
            <div className="dash-card-soft rounded-2xl border p-4 text-sm leading-7 text-[var(--dash-muted)]">
              {student.headline}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="GitHub profile">
        <div className="space-y-3">
          <label htmlFor="student-github-url" className="block text-sm font-medium text-[var(--dash-ink)]">
            GitHub URL
          </label>
          <input
            id="student-github-url"
            name="githubUrl"
            type="url"
            value={githubLink}
            onChange={(event) => setGithubLink(event.target.value)}
            placeholder="https://github.com/yourusername"
            autoComplete="url"
            className="dash-input w-full min-w-0 rounded-2xl border px-4 py-3 text-sm outline-none transition"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleGithubSave}
              className="dash-button-primary w-full px-4 py-2 text-sm sm:w-auto"
              disabled={savingGithub}
            >
              {savingGithub ? "Saving..." : "Save GitHub"}
            </button>
            {githubLink ? (
              <a href={githubLink} target="_blank" rel="noreferrer" className="break-all text-sm font-semibold text-[var(--dash-purple)] transition hover:underline sm:break-normal">
                Open link
              </a>
            ) : null}
          </div>
          <p className="text-sm text-[var(--dash-muted)]">
            Add your GitHub link so your projects and repositories are visible to mentors.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Roadmap and Project Details (AI Context)">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="student-roadmap" className="block text-sm font-medium text-[var(--dash-ink)]">
              Select Roadmap
            </label>
            <select
              id="student-roadmap"
              name="courseId"
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
              className="dash-input w-full min-w-0 rounded-2xl border px-4 py-3 text-sm outline-none transition"
            >
              <option value="">Choose a roadmap</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.title || course.course_name || `Course #${course.course_id}`}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRoadmapSave}
              className="dash-button-primary w-full px-4 py-2 text-sm sm:w-auto"
              disabled={savingRoadmap || !selectedCourseId}
            >
              {savingRoadmap ? "Saving..." : "Save Roadmap"}
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-[var(--dash-ink)]">
              Choose Project
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-2 text-sm text-[var(--dash-muted)]">
                <input
                  type="radio"
                  name="projectMode"
                  value="recommended"
                  checked={projectMode === "recommended"}
                  onChange={() => setProjectMode("recommended")}
                />
                Recommended project
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--dash-muted)]">
                <input
                  type="radio"
                  name="projectMode"
                  value="custom"
                  checked={projectMode === "custom"}
                  onChange={() => setProjectMode("custom")}
                />
                Custom project
              </label>
            </div>
          </div>

          {projectMode === "recommended" ? (
            <div className="space-y-2">
              <label htmlFor="student-recommended-project" className="block text-sm font-medium text-[var(--dash-ink)]">
                Recommended Projects
              </label>
              <select
                id="student-recommended-project"
                name="recommendedProject"
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                className="dash-input w-full min-w-0 rounded-2xl border px-4 py-3 text-sm outline-none transition"
                disabled={recommendationsLoading || !visibleProjects.length}
              >
                {recommendationsLoading ? (
                  <option value="">Loading projects...</option>
                ) : visibleProjects.length ? (
                  visibleProjects.map((project) => (
                    <option key={project.project_id || project.project_title} value={project.project_id || ""}>
                      {project.project_title}
                    </option>
                  ))
                ) : (
                  <option value="">No recommendations for this roadmap yet</option>
                )}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="student-project-title" className="block text-sm font-medium text-[var(--dash-ink)]">
                Custom Project Title
              </label>
              <input
                id="student-project-title"
                name="projectTitle"
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Job Tracker API"
                className="dash-input w-full min-w-0 rounded-2xl border px-4 py-3 text-sm outline-none transition"
              />
            </div>
          )}

          {profile.project_title ? (
            <div className="rounded-2xl border border-[var(--dash-border)] bg-white px-4 py-3 text-sm text-[var(--dash-muted)]">
              Current AI project: <span className="font-semibold text-[var(--dash-ink)]">{profile.project_title}</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleProjectSave}
              className="dash-button-primary w-full px-4 py-2 text-sm sm:w-auto"
              disabled={savingProject}
            >
              {savingProject ? "Saving..." : "Save Project"}
            </button>
            <p className="text-xs italic text-[var(--dash-muted)]">
              *Roadmap and project are required to enable AI Companion
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Resume">
        <div className="space-y-3">
          <label htmlFor="student-resume-url" className="block text-sm font-medium text-[var(--dash-ink)]">
            Resume URL or Upload
          </label>
          <input
            id="student-resume-url"
            name="resumeUrl"
            type="url"
            value={resumeLink}
            onChange={(event) => setResumeLink(event.target.value)}
            placeholder="Paste resume link here"
            autoComplete="url"
            className="dash-input w-full min-w-0 rounded-2xl border px-4 py-3 text-sm outline-none transition"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label
              htmlFor="student-resume-file"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-[var(--dash-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--dash-purple)] transition hover:bg-purple-50 sm:w-auto"
            >
              Upload file
              <input
                id="student-resume-file"
                name="resumeFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeFile}
                className="sr-only"
              />
            </label>
            <button
              type="button"
              onClick={handleResumeSave}
              className="dash-button-primary w-full px-4 py-2 text-sm sm:w-auto"
              disabled={savingResume}
            >
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

          <p className="text-sm text-[var(--dash-muted)]">
            Upload a PDF or provide a resume link so mentors can review your experience in one place.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Education" action={<button type="button" className="rounded-full text-[var(--dash-purple)] transition hover:opacity-80">+</button>}>
        <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
          <GraduationCap className="h-16 w-16 text-[var(--dash-purple)]" />
          <div className="mt-5 text-base font-semibold text-[var(--dash-ink)]">
            {student.education}
          </div>
          <div className="mt-2 text-sm text-[var(--dash-muted)]">
            Package window: {student.packageStart} to {student.packageEnd}
          </div>
        </div>
      </SectionCard>

      <ProfileToast toast={toast} />
    </div>
  );
}
