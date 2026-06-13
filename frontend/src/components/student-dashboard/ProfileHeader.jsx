import { useEffect, useState } from "react";
import {
  Sparkles,
  SquarePen,
  Upload,
  Loader2,
} from "lucide-react";

import { API_BASE } from "./constants";
import { formatDateLabel } from "./formatters";
import { SectionCard } from "./ui";
// import { uploadStudentProfilePicture } from "../services/authservice";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function EditProfileModal({
  open,
  form,
  saving,
  onClose,
  onChange,
  onSave,
}) {
  if (!open) return null;

  return (
    <div
      className="dash-modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 py-4 sm:items-center sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-edit-title"
    >
      <div
        className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--dash-border)] bg-white shadow-2xl"
      >
        {/* top */}
        <div
          className="flex items-center justify-between gap-3 border-b border-[var(--dash-border)] bg-[var(--dash-bg)] px-5 py-4"
        >
          <div>
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--dash-purple)]"
            >
              Edit Profile
            </div>

            <div
              id="student-profile-edit-title"
              className="mt-1 text-lg font-bold text-[var(--dash-ink)]"
            >
              Update your student profile
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="dash-button-secondary px-3 py-1.5 text-sm"
          >
            Close
          </button>
        </div>

        {/* form */}
        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
          <label className="space-y-2" htmlFor="student-profile-name">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--dash-muted)]"
            >
              Full Name
            </span>

            <input
              id="student-profile-name"
              name="name"
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="dash-input w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <label className="space-y-2" htmlFor="student-profile-education">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--dash-muted)]"
            >
              Education
            </span>

            <input
              id="student-profile-education"
              name="education"
              type="text"
              value={form.education}
              onChange={(e) => onChange("education", e.target.value)}
              className="dash-input w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
              placeholder="Current degree or institute"
              autoComplete="organization-title"
            />
          </label>

          <label className="space-y-2 md:col-span-2" htmlFor="student-profile-bio">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--dash-muted)]"
            >
              Bio
            </span>

            <textarea
              id="student-profile-bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={(e) => onChange("bio", e.target.value)}
              className="dash-input w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition"
              placeholder="Write a short summary"
            />
          </label>

          {/* upload */}
          <div className="space-y-2 md:col-span-2">
            <span
              id="student-profile-picture-label"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--dash-muted)]"
            >
              Profile Picture
            </span>

            <label
              htmlFor="profile-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--dash-border)] bg-[var(--dash-bg)] px-6 py-8 transition hover:bg-black/[0.02]"
            >
              {form.pfp ? (
                <img
                  src={form.pfp}
                  alt="preview"
                  className="mb-4 h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div
                  className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-[var(--dash-purple-light)]"
                >
                  <Upload
                    size={28}
                    className="text-[var(--dash-purple)]"
                  />
                </div>
              )}

              <div
                className="text-sm font-semibold text-[var(--dash-ink)]"
              >
                Drop image here or click to upload
              </div>

              <div
                className="mt-1 text-xs text-[var(--dash-muted)]"
              >
                PNG, JPG, WEBP supported
              </div>

              <input
                id="profile-upload"
                name="profilePicture"
                type="file"
                accept="image/*"
                className="hidden"
                aria-labelledby="student-profile-picture-label"
                onChange={async (e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  const dataUrl = await fileToDataUrl(file);

                  onChange("pfp", dataUrl);
                }}
              />
            </label>
          </div>
        </div>

        {/* actions */}
        <div
          className="flex items-center justify-end gap-3 border-t border-[var(--dash-border)] px-5 py-4"
        >
          <button
            type="button"
            onClick={onClose}
            className="dash-button-secondary px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="dash-button-primary px-5 py-2 text-sm"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Uploading...
              </span>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileHeader({
  student,
  activeCourse,
  onMentorClick,
  onProfileSave,
}) {
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: student?.name || "",
    bio: student?.bio || "",
    education: student?.education || "",
    pfp: student?.pfp || "",
  });

  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    setProfileForm({
      name: student?.name || "",
      bio: student?.bio || "",
      education: student?.education || "",
      pfp: student?.pfp || "",
    });
  }, [student]);

  async function handleSave() {
    try {
      setProfileSaving(true);

      const uid = student?.uid;
      if (!uid) {
        throw new Error("Student profile is not loaded yet. Please refresh and try again.");
      }

      const response = await fetch(`${API_BASE}/api/auth/update-student-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          name: profileForm.name,
          bio: profileForm.bio,
          education: profileForm.education,
          pfp: profileForm.pfp,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status === "error") {
        throw new Error(result.message || "Failed to update profile");
      }

      const updatedStudent = result?.data?.student || null;

      if (onProfileSave) {
        await onProfileSave(updatedStudent || {
          uid,
          name: profileForm.name,
          bio: profileForm.bio,
          education: profileForm.education,
          pfp: profileForm.pfp,
        });
      }

      setProfileForm((prev) => ({
        ...prev,
        ...(updatedStudent
          ? {
              name: updatedStudent.name ?? prev.name,
              bio: updatedStudent.bio ?? prev.bio,
              education: updatedStudent.education ?? prev.education,
              pfp: updatedStudent.pfp ?? prev.pfp,
            }
          : {}),
      }));

      setProfileEditorOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setProfileSaving(false);
    }
  }

  return (
    <>
      <SectionCard className="overflow-hidden p-0">
        {/* top gradient */}
        <div className="dash-gradient relative overflow-hidden">
          {/* glow */}
          <div className="dash-hero-glow" />

          <div className="relative flex flex-col justify-end gap-5 px-4 pb-5 pt-6 sm:px-5 md:flex-row md:items-end md:justify-between">
            {/* left */}
            <div className="flex min-w-0 items-end gap-3 sm:gap-4">
              <div
                className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-4 text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl"
              >
                {student.pfp ? (
                  <img
                    src={student.pfp}
                    alt={student.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  student.avatar
                )}
              </div>

              <div className="min-w-0 pb-1">
                <div
                  className="truncate text-lg font-bold text-white sm:text-2xl"
                >
                  {student.name}
                </div>

                <div
                  className="mt-1 truncate text-xs text-white/75 sm:text-sm"
                >
                  {student.handle}
                </div>

                <div
                  className="mt-2 line-clamp-2 text-xs text-white/90 sm:text-sm"
                >
                  {student.currentTrack}
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onMentorClick}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--dash-yellow)] px-4 py-2 text-xs font-semibold text-black transition hover:brightness-105 sm:flex-none sm:px-5 sm:text-sm"
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                Keep Learning
              </button>

              <button
                type="button"
                onClick={() =>
                  setProfileEditorOpen(true)
                }
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border bg-transparent px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 sm:flex-none sm:px-5 sm:text-sm"
              >
                <SquarePen className="h-4 w-4 shrink-0" />
                Edit Profile
              </button>

            </div>
          </div>
        </div>

        <div className="border-b border-[var(--dash-border)] px-4 py-4 sm:px-5">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--dash-muted)]"
          >
            Bio
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--dash-ink)]">
            {student.bio?.trim() || "Add a short bio so mentors can understand your goals."}
          </p>
        </div>

        {/* stats */}
        <div className="grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-3">
          {[
            {
              label: "Total bookings",
              value:
                student.totalBookings ?? 0,
            },
            {
              label: "Active booking",
              value: student.activeBookingId
                ? `#${student.activeBookingId}`
                : "None",
            },
            {
              label: "Education",
              value:
                student.education ||
                "Not shared",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="dash-card-soft rounded-xl border px-4 py-3"
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--dash-muted)]"
              >
                {item.label}
              </div>

              <div
                className="mt-2 break-words text-xs font-semibold text-[var(--dash-ink)] sm:text-sm"
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* active plan */}
        {activeCourse?.planTitle ? (
          <div className="px-4 pb-5 sm:px-5">
            <div
              className="dash-chip max-w-full px-3 py-1 text-[11px]"
            >
              <span className="truncate">
                {activeCourse.planTitle} - Ends{" "}
                {formatDateLabel(
                  activeCourse.expiry_date,
                  "TBD"
                )}
              </span>
            </div>
          </div>
        ) : null}
      </SectionCard>

      <EditProfileModal
        open={profileEditorOpen}
        form={profileForm}
        saving={profileSaving}
        onClose={() =>
          setProfileEditorOpen(false)
        }
        onChange={(field, value) =>
          setProfileForm((prev) => ({
            ...prev,
            [field]: value,
          }))
        }
        onSave={handleSave}
      />
    </>
  );
}
