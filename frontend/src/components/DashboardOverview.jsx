import { apiUrl } from "../config/api.js";
import { Users, BookOpen, DollarSign, TrendingUp, Upload, FileAudio, PlayCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { ActiveRoadmaps } from './ActiveRoadmaps';
import { useAuth } from '../context/AuthContext';
import {useState , useEffect} from "react";

const API_BASE = apiUrl("");
const DISPLAY_TIME_ZONE = "Asia/Kolkata";

function formatDbDateTime(value) {
  if (!value) return "—";

  const text = String(value).trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?(?:\s?(Z|[+-]\d{1,2}(?::?\d{2})?))?$/);
  const date = match
    ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6] || 0), 0))
    : new Date(text);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: DISPLAY_TIME_ZONE,
  });
}

export function DashboardOverview() {
  const {user} = useAuth();
  const [summary, setSummary] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [sessionInfo, setSessionInfo] = useState({
    status: "LOADING",
    session: null,
    label: "Checking session..."
  });
  useEffect(() => {
      if (!user) {
        window.location.href = "/login";   // optional redirect
        return;
    }
    loadSummary();
    checkSession();
  }, [user?.uid]);

async function loadSummary() {
  try {
    const uid = user?.uid;
    if (!uid) return;

    const res = await fetch(apiUrl("/api/teachers/overview"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid })
    });
    const body = await res.json();

    if (body.success) {
      setSummary(body.data);
    }
  } catch (error) {
    console.error("Overview load failed:", error);
  }
}

async function loadPendingJobs(teacherId) {
  if (!teacherId) return;

  try {
    const res = await fetch(`${API_BASE}/api/meetings/processing/pending/${teacherId}`);
    const body = await res.json();

    if (body.success) {
      const jobs = body.jobs || [];
      setPendingJobs(jobs);
      setSelectedJobId((current) => {
        if (current && jobs.some((job) => String(job.job_id) === String(current))) {
          return current;
        }
        return jobs[0]?.job_id ? String(jobs[0].job_id) : "";
      });
    }
  } catch (error) {
    console.error("Pending jobs load failed:", error);
  }
}

async function refreshPendingJobs() {
  if (summary?.teacher?.t_id) {
    await loadPendingJobs(summary.teacher.t_id);
  }
}

async function handleUploadAndProcess() {
  const selectedJob = pendingJobs.find((job) => String(job.job_id) === String(selectedJobId));
  if (!selectedJob) {
    setUploadMessage("Please choose a pending session first.");
    return;
  }

  if (!selectedFile) {
    setUploadMessage("Please choose an audio file to upload.");
    return;
  }

  try {
    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("audio", selectedFile);

    const res = await fetch(`${API_BASE}/api/meetings/sessions/${selectedJob.session_id}/recording`, {
      method: "POST",
      body: formData,
    });

    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.error || body.message || "Upload failed");
    }

    setUploadMessage("Uploaded and queued for processing. Refreshing pending list...");
    setSelectedFile(null);
    await refreshPendingJobs();
  } catch (error) {
    console.error("Upload/process failed:", error);
    setUploadMessage(error.message || "Upload failed");
  } finally {
    setUploading(false);
  }
}

async function handleProcessNow(jobId) {
  try {
    setUploadMessage("");
    const res = await fetch(`${API_BASE}/api/meetings/processing/${jobId}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.error || "Processing failed");
    }
    setUploadMessage("Processing started successfully.");
    await refreshPendingJobs();
  } catch (error) {
    console.error("Manual processing failed:", error);
    setUploadMessage(error.message || "Processing failed");
  }
}

async function checkSession() {
  try {
    const uid = user?.uid;
    if (!uid) return;

    const sessionRes = await fetch(apiUrl("/api/session/checkTsession"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid })
    });

    const sessionData = await sessionRes.json();
    console.log("got sessionData: ",sessionData);
    console.log("exists value:", sessionData.exists);
    if (!sessionData.data.session) {
      console.log("error sessionData not exists");
      setSessionInfo({
        status: "NONE",
        session: null,
        label: "No Active Session"
      });
      return;
    }

    const state = sessionData.data.state;
    const session = sessionData.data.session;
    console.log("state and session and time: ",state,session,session.start_time);
    setSessionInfo({
      status: state,
      session,
      label:
        state === "ACTIVE"
          ? "Live Now"
          : state === "UPCOMING"
          ? "Upcoming Session"
          : state === "PENDING_UPLOAD"
          ? "Awaiting Upload"
          : state === "UPLOAD_RECEIVED"
          ? "Upload Received"
          : state === "PROCESSING"
          ? "Processing"
          : state === "COMPLETED"
          ? "Completed"
          : state === "FAILED"
          ? "Processing Failed"
          : "Session Ended"
    });

  } catch (error) {
    console.error("Session check failed:", error);
    setSessionInfo({
      status: "ERROR",
      session: null,
      label: "Error loading session"
    });
  }
}

useEffect(() => {
  if (summary?.teacher?.t_id) {
    loadPendingJobs(summary.teacher.t_id);
  }
}, [summary?.teacher?.t_id]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Professor {user.username}!</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your assessment rooms today.</p>
      </div>

      <div className="mb-8 rounded-3xl border border-[rgba(107,70,193,0.14)] bg-gradient-to-br from-white via-[#fcfbff] to-[#f6f1ff] shadow-sm px-6 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--algo-purple)]">
              Session recording hub
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Pending recordings ready for upload
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {pendingJobs.length > 0
                ? `You have ${pendingJobs.length} pending session${pendingJobs.length > 1 ? "s" : ""}. Select one, upload the audio, and start processing.`
                : "No pending sessions right now."}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl bg-white/80 border border-slate-200 px-5 py-4 min-w-[160px]">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pending</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{pendingJobs.length}</p>
          </div>
        </div>

        {pendingJobs.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1.25fr_0.95fr] gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Pending sessions</h4>
                  <p className="text-xs text-slate-500">Choose the session you want to upload audio for.</p>
                </div>
                <button
                  type="button"
                  onClick={refreshPendingJobs}
                  className="text-xs font-semibold text-[var(--algo-purple)] hover:underline"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {pendingJobs.map((job) => {
                  const active = String(selectedJobId) === String(job.job_id);
                  const session = job.session || {};
                  const sessionDate = session.start_time
                    ? formatDbDateTime(session.start_time)
                    : "No schedule";

                  return (
                    <button
                      key={job.job_id}
                      type="button"
                      onClick={() => setSelectedJobId(String(job.job_id))}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-[var(--algo-purple)] bg-[#f8f4ff] shadow-sm"
                          : "border-slate-200 bg-white hover:border-[rgba(107,70,193,0.25)]"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <FileAudio className="h-4 w-4 text-[var(--algo-purple)]" />
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {session.title || `Session #${job.session_id}`}
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {sessionDate}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Meeting ID: {job.zoom_meeting_id || "N/A"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            {job.status || "AWAITING_UPLOAD"}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {job.upload_status || "NOT_UPLOADED"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-[var(--algo-purple)]" />
                <h4 className="text-sm font-semibold text-slate-900">Upload & process</h4>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-[rgba(107,70,193,0.28)] bg-[#fcfbff] p-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Selected session
                </label>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {pendingJobs.find((job) => String(job.job_id) === String(selectedJobId))?.session?.title ||
                    "Choose a pending session from the left"}
                </p>

                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Audio file
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--algo-purple)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-[rgba(107,70,193,0.35)]"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Upload the class recording here. The backend will save it and queue processing automatically.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleUploadAndProcess}
                    disabled={uploading || !selectedJobId}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      uploading || !selectedJobId
                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-[var(--algo-purple)] text-white hover:opacity-95"
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload & Queue"}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectedJobId && handleProcessNow(selectedJobId)}
                    disabled={!selectedJobId}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      !selectedJobId
                        ? "cursor-not-allowed border-slate-200 text-slate-400"
                        : "border-[rgba(107,70,193,0.22)] bg-white text-[var(--algo-purple)] hover:bg-[#f8f4ff]"
                    }`}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Start Processing
                  </button>
                </div>

                {selectedFile && (
                  <p className="mt-3 text-xs text-slate-600">
                    Selected file: <span className="font-semibold">{selectedFile.name}</span>
                  </p>
                )}

                {uploadMessage && (
                  <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {uploadMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-slate-700">No pending sessions</p>
            <p className="mt-1 text-xs text-slate-500">
              Once a session is marked complete, it will appear here for upload and processing.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-8">
        <div>
         <div className="flex items-start justify-between mb-4">
            {/* Status Icon Block */}
            <div className={`p-3 rounded-lg 
              ${sessionInfo.status === "ACTIVE" ? "bg-green-100" :
                sessionInfo.status === "UPCOMING" ? "bg-blue-100" :
                sessionInfo.status === "EXPIRED" ? "bg-gray-100" :
                "bg-gray-100"}`}>
              
              <div className={`w-3 h-3 rounded-full 
                ${sessionInfo.status === "ACTIVE" ? "bg-green-500 animate-pulse" :
                  sessionInfo.status === "UPCOMING" ? "bg-blue-500" :
                  sessionInfo.status === "EXPIRED" ? "bg-gray-400" :
                  "bg-gray-300"}`}>
              </div>
            </div>

            {/* Badge */}
            <span className={`text-xs font-medium px-2 py-1 rounded-full
              ${sessionInfo.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                sessionInfo.status === "UPCOMING" ? "bg-blue-100 text-blue-700" :
                sessionInfo.status === "EXPIRED" ? "bg-gray-200 text-gray-600" :
                "bg-gray-200 text-gray-600"}`}>
              {sessionInfo.label || "No Session"}
            </span>

          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {sessionInfo.session?.title || "Upcoming Session"}
          </h3>

          {/* Time */}
          <p className="text-sm text-gray-600 mb-4">
            {sessionInfo.session?.start_time
              ? formatDbDateTime(sessionInfo.session.start_time)
              : "No scheduled session"}
          </p>

          {/* Action Button */}
          <button
            onClick={() => {
              const joinLink = sessionInfo.session?.join_url || sessionInfo.session?.session_link;
              if (sessionInfo.status === "ACTIVE" && joinLink) {
                window.location.href = joinLink;
              }
            }}
            disabled={sessionInfo.status !== "ACTIVE" || !(sessionInfo.session?.join_url || sessionInfo.session?.session_link)}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors
              ${sessionInfo.status === "ACTIVE"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}>

            {sessionInfo.status === "ACTIVE"
              ? "Join Class"
              : sessionInfo.status === "UPCOMING"
              ? "Session Not Started"
              : sessionInfo.status === "PENDING_UPLOAD"
              ? "Awaiting Upload"
              : sessionInfo.status === "UPLOAD_RECEIVED"
              ? "Upload Received"
              : sessionInfo.status === "PROCESSING"
              ? "Processing"
              : sessionInfo.status === "COMPLETED"
              ? "Completed"
              : sessionInfo.status === "FAILED"
              ? "Failed"
              : "No Session Available"}
        </button>
        </div>
        <StatCard
          title="Total Students"
          value={summary?.metrics?.totalStudents ? String(summary.metrics.totalStudents) : "0"}
          change={summary?.metrics?.currentMonthBookings ? `+${summary.metrics.currentMonthBookings}` : "0"}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Active Roadmaps"
          value={summary?.metrics?.activeRoadmaps ? String(summary.metrics.activeRoadmaps) : "0"}
          change={summary?.highlights?.monthLabel || "This month"}
          icon={BookOpen}
          color="yellow"
        />
        <StatCard
          title="Monthly Earnings"
          value={`₹${(summary?.metrics?.monthlyEarnings || 0).toLocaleString("en-IN")}`}
          change={summary?.metrics?.previousMonthEarnings
            ? `${summary.metrics.monthlyEarnings >= summary.metrics.previousMonthEarnings ? "+" : "-"}${Math.abs(Math.round(((summary.metrics.monthlyEarnings - summary.metrics.previousMonthEarnings) / summary.metrics.previousMonthEarnings) * 100))}%`
            : "This month"}
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Completion Rate"
          value={`${summary?.metrics?.completionRate || 0}%`}
          change={summary?.metrics?.completedSessions ? `${summary.metrics.completedSessions} completed` : "0 completed"}
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-3">
          <ActiveRoadmaps roadmapProgress={summary?.roadmapProgress || null} />
        </div>
      </div>
    </div>
  );
}
