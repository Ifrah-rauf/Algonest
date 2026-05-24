import { useEffect, useState } from "react";
import {
  CircleEllipsis,
  Sparkles,
  SquarePen,
  Upload,
  Loader2,
} from "lucide-react";

import { API_BASE, C } from "./constants";
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
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style={{ background: "rgba(33,21,63,0.45)" }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-2xl"
        style={{ borderColor: C.border }}
      >
        {/* top */}
        <div
          className="flex items-center justify-between gap-3 border-b px-5 py-4"
          style={{
            borderColor: C.border,
            background: C.bg,
          }}
        >
          <div>
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: C.purple }}
            >
              Edit Profile
            </div>

            <div
              className="mt-1 text-lg font-bold"
              style={{ color: C.ink }}
            >
              Update your student profile
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-3 py-1.5 text-sm font-semibold transition hover:bg-black/5"
            style={{
              borderColor: C.border,
              color: C.muted,
            }}
          >
            Close
          </button>
        </div>

        {/* form */}
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <label className="space-y-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: C.muted }}
            >
              Full Name
            </span>

            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
              style={{
                borderColor: C.border,
                background: C.white,
              }}
              placeholder="Your name"
            />
          </label>

          <label className="space-y-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: C.muted }}
            >
              Education
            </span>

            <input
              value={form.education}
              onChange={(e) => onChange("education", e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
              style={{
                borderColor: C.border,
                background: C.white,
              }}
              placeholder="Current degree or institute"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: C.muted }}
            >
              Bio
            </span>

            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => onChange("bio", e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
              style={{
                borderColor: C.border,
                background: C.white,
                resize: "vertical",
              }}
              placeholder="Write a short summary"
            />
          </label>

          {/* upload */}
          <label className="space-y-2 md:col-span-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: C.muted }}
            >
              Profile Picture
            </span>

            <label
              htmlFor="profile-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 transition hover:bg-black/[0.02]"
              style={{
                borderColor: C.border,
                background: C.bg,
              }}
            >
              {form.pfp ? (
                <img
                  src={form.pfp}
                  alt="preview"
                  className="mb-4 h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div
                  className="mb-4 grid h-20 w-20 place-items-center rounded-full"
                  style={{
                    background: C.purpleLight,
                  }}
                >
                  <Upload
                    size={28}
                    style={{ color: C.purple }}
                  />
                </div>
              )}

              <div
                className="text-sm font-semibold"
                style={{ color: C.ink }}
              >
                Drop image here or click to upload
              </div>

              <div
                className="mt-1 text-xs"
                style={{ color: C.muted }}
              >
                PNG, JPG, WEBP supported
              </div>

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  const dataUrl = await fileToDataUrl(file);

                  onChange("pfp", dataUrl);
                }}
              />
            </label>
          </label>
        </div>

        {/* actions */}
        <div
          className="flex items-center justify-end gap-3 border-t px-5 py-4"
          style={{ borderColor: C.border }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-black/5"
            style={{
              borderColor: C.border,
              color: C.muted,
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
            style={{ background: C.purple }}
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
        <div
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple})`,
          }}
        >
          {/* glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 28%)",
            }}
          />

          <div className="relative flex flex-col justify-end gap-5 px-4 pb-5 pt-6 sm:px-5 md:flex-row md:items-end md:justify-between">
            {/* left */}
            <div className="flex min-w-0 items-end gap-3 sm:gap-4">
              <div
                className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-4 text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl"
                style={{
                  borderColor: C.white,
                  backgroundColor: C.purple,
                }}
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
                  className="truncate text-lg font-bold sm:text-2xl"
                  style={{ color: C.white }}
                >
                  {student.name}
                </div>

                <div
                  className="mt-1 truncate text-xs sm:text-sm"
                  style={{
                    color:
                      "rgba(255,255,255,0.76)",
                  }}
                >
                  {student.handle}
                </div>

                <div
                  className="mt-2 line-clamp-2 text-xs sm:text-sm"
                  style={{
                    color:
                      "rgba(255,255,255,0.92)",
                  }}
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
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-black transition hover:brightness-105 sm:flex-none sm:px-5 sm:text-sm"
                style={{ backgroundColor: C.yellow }}
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
                style={{
                  borderColor:
                    "rgba(255,255,255,0.32)",
                }}
              >
                <SquarePen className="h-4 w-4 shrink-0" />
                Edit Profile
              </button>

              <button
                type="button"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-white/10"
                style={{
                  color:
                    "rgba(255,255,255,0.88)",
                }}
              >
                <CircleEllipsis className="h-5 w-5" />
              </button>
            </div>
          </div>
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
              className="rounded-xl border px-4 py-3"
              style={{
                borderColor: C.border,
                background: C.bg,
              }}
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: C.muted }}
              >
                {item.label}
              </div>

              <div
                className="mt-2 text-xs font-semibold sm:text-sm"
                style={{ color: C.ink }}
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
              className="inline-flex max-w-full items-center rounded-full border px-3 py-1 text-[11px] font-medium"
              style={{
                color: C.purple,
                borderColor:
                  "rgba(107,70,193,0.25)",
                background: C.purpleLight,
              }}
            >
              <span className="truncate">
                {activeCourse.planTitle} • Ends{" "}
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
