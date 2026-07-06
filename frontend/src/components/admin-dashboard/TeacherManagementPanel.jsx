import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { apiUrl, authHeaders } from "../../config/api.js";

const EMPTY_TEACHER_FORM = {
  name: "",
  email: "",
  password: "",
  bio: "",
  rating: "",
  education: "",
  teaching_style: "",
  experience: "",
  timezone: "",
  video_url: "",
  pfp: "",
  meeting_link: "",
  verified: false,
};

export default function TeacherManagementPanel({ user }) {
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [createdTeacher, setCreatedTeacher] = useState(null);
  const [form, setForm] = useState(EMPTY_TEACHER_FORM);

  async function handleCreateTeacher(e) {
    e.preventDefault();

    if (!user?.uid) {
      setMessage("Please refresh and log in as admin again.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setCreatedTeacher(null);

      const res = await fetch(apiUrl("/api/admin/teachers"), {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          requesterUid: user.uid,
          ...form,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create teacher");
      }

      setCreatedTeacher(data);
      setMessage("Teacher created successfully.");
      setForm(EMPTY_TEACHER_FORM);
      setShowAddTeacher(true);
    } catch (error) {
      setMessage(error.message || "Could not create teacher.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Teacher Management</h2>
          <p className="mt-1 text-sm text-gray-600">
            Add and onboard teachers from here.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddTeacher((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[var(--algo-purple)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800"
        >
          <UserPlus className="h-4 w-4" />
          Add Teacher
        </button>
      </div>

      {showAddTeacher ? (
        <div className="mt-5 rounded-2xl border border-dashed border-purple-200 bg-purple-50/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-purple-900">Add Teacher</p>
            <span className="text-xs text-purple-600">
              Password is optional. A temp one is generated if omitted.
            </span>
          </div>

          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleCreateTeacher}>
            <input
              type="text"
              placeholder="Name *"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <input
              type="password"
              placeholder="Temporary password (optional)"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <input
              type="text"
              placeholder="Teaching style"
              value={form.teaching_style}
              onChange={(e) => setForm((p) => ({ ...p, teaching_style: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <input
              type="text"
              placeholder="Experience"
              value={form.experience}
              onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <input
              type="text"
              placeholder="Timezone"
              value={form.timezone}
              onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <input
              type="text"
              placeholder="Meeting link"
              value={form.meeting_link}
              onChange={(e) => setForm((p) => ({ ...p, meeting_link: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 md:col-span-2"
            />
            <input
              type="text"
              placeholder="Profile picture URL"
              value={form.pfp}
              onChange={(e) => setForm((p) => ({ ...p, pfp: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <input
              type="text"
              placeholder="Video URL"
              value={form.video_url}
              onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Rating"
              value={form.rating || ""}
              onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
            <textarea
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={3}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 md:col-span-2"
            />

            <label className="flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-gray-700 md:col-span-2">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => setForm((p) => ({ ...p, verified: e.target.checked }))}
              />
              Verified teacher
            </label>

            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--algo-purple)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-300"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {saving ? "Creating..." : "Create Teacher"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddTeacher(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-sm"
              >
                Collapse
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {message ? <p className="mt-4 text-sm text-purple-800">{message}</p> : null}

          {createdTeacher ? (
            <div className="mt-4 rounded-2xl border border-purple-200 bg-white p-4 text-sm text-gray-700">
              <p className="font-semibold text-purple-900">Created teacher</p>
              <p className="mt-1">UID: {createdTeacher.teacher?.uid}</p>
              <p>Name: {createdTeacher.teacher?.name}</p>
              <p>Email: {createdTeacher.auth?.email}</p>
              {createdTeacher.tempPassword ? (
                <p className="mt-2 rounded-xl bg-purple-50 px-3 py-2 text-purple-800">
                  Temp password: {createdTeacher.tempPassword}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-600">
          Click <span className="font-semibold text-purple-700">Add Teacher</span> to open the control area.
        </div>
      )}
    </section>
  );
}
