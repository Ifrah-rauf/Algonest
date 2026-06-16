import { apiUrl } from "../config/api.js";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Video, Globe, BookOpen, Award, Sparkles, Upload, CheckCircle2, Loader2 } from "lucide-react";

const BASE_URL = apiUrl("/api/teachers");

const EMPTY_FORM = {
  name: "",
  bio: "",
  education: "",
  teaching_style: "",
  video_url: "",
  pfp: "",
  timezone: "",
  experience: "",
  meeting_link: "",
  specialisation_id: "",
  language_id: "",
  frameworks_id: "",
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Field({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-purple-600 shrink-0" />}
        {label}
      </div>
      <input
        {...props}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
      />
    </label>
  );
}

function TextArea({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-purple-600 shrink-0" />}
        {label}
      </div>
      <textarea
        {...props}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none"
      />
    </label>
  );
}

export function TeacherEditProfile() {
  const { user } = useAuth();
  const MAX_CERTIFICATE_SIZE = 2 * 1024 * 1024;
  const [profile, setProfile] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [certificateName, setCertificateName] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certSaving, setCertSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showCertificateUpload, setShowCertificateUpload] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        const body = await res.json();
        if (body.success) {
          setProfile(body.data?.teacher || null);
          setCertificate(body.data?.certificate || null);
          setForm({
            name: body.data?.teacher?.name || "",
            bio: body.data?.teacher?.bio || "",
            education: body.data?.teacher?.education || "",
            teaching_style: body.data?.teacher?.teaching_style || "",
            video_url: body.data?.teacher?.video_url || "",
            pfp: body.data?.teacher?.pfp || "",
            timezone: body.data?.teacher?.timezone || "",
            experience: body.data?.teacher?.experience || "",
            meeting_link: body.data?.teacher?.meeting_link || "",
            specialisation_id: body.data?.teacher?.specialisation_id || "",
            language_id: body.data?.teacher?.language_id || "",
            frameworks_id: body.data?.teacher?.frameworks_id || "",
          });
        }
      } catch (error) {
        console.error("Failed to load teacher profile:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user?.uid]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.uid) return;
    try {
      setSaving(true);
      setMessage("");
      const payload = {
        uid: user.uid,
        ...form,
        specialisation_id: form.specialisation_id ? Number(form.specialisation_id) : null,
        language_id: form.language_id ? Number(form.language_id) : null,
        frameworks_id: form.frameworks_id ? Number(form.frameworks_id) : null,
      };
      const res = await fetch(`${BASE_URL}/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!body.success) throw new Error(body.error || "Update failed");
      setProfile(body.data);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile save failed:", error);
      setMessage(error.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddCertificate() {
    if (!user?.uid || !certificatePreview) return;
    try {
      setCertSaving(true);
      setMessage("");
      const res = await fetch(`${BASE_URL}/profile/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          certificateName: certificateName.trim() || certificateFile?.name || "",
          certificateFile: certificatePreview,
          certificateFileName: certificateFile?.name || null,
        }),
      });
      const body = await res.json();
      if (!body.success) throw new Error(body.error || "Certificate save failed");
      setCertificate(body.data);
      setCertificateName("");
      setCertificateFile(null);
      setCertificatePreview("");
      setShowCertificateUpload(false);
      setMessage("Certificate uploaded and sent for verification.");
    } catch (error) {
      console.error("Certificate add failed:", error);
      setMessage(error.message || "Certificate add failed.");
    } finally {
      setCertSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500 text-sm">
        Loading profile editor...
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 pb-24 md:pb-8">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Profile</h2>
          <p className="mt-1 text-sm text-gray-500">Update the teacher information shown across the platform.</p>
        </div>
        <div className="self-start sm:self-auto rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 whitespace-nowrap">
          {profile?.verified ? "Verified teacher" : "Profile editor"}
        </div>
      </div>

      {/* ── Layout: stacked on mobile, two-col on lg ── */}
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1.25fr_0.75fr]">

        {/* ── LEFT: Main form ── */}
        <form onSubmit={handleSave} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          {/* 1-col on mobile, 2-col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Field label="Name" icon={User} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <Field label="Timezone" icon={Globe} value={form.timezone} onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))} />
            <Field label="Experience" icon={Sparkles} value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} />
            <Field label="Video Link" icon={Video} value={form.video_url} onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))} />
            <Field label="Meeting Link" icon={BookOpen} value={form.meeting_link} onChange={(e) => setForm((p) => ({ ...p, meeting_link: e.target.value }))} />
            <Field label="Specialisation ID" icon={BookOpen} value={form.specialisation_id} onChange={(e) => setForm((p) => ({ ...p, specialisation_id: e.target.value }))} />
            <Field label="Language ID" icon={BookOpen} value={form.language_id} onChange={(e) => setForm((p) => ({ ...p, language_id: e.target.value }))} />
            <Field label="Frameworks ID" icon={BookOpen} value={form.frameworks_id} onChange={(e) => setForm((p) => ({ ...p, frameworks_id: e.target.value }))} />
          </div>

          <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4">
            <TextArea label="Bio" icon={User} rows={4} value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
            <TextArea label="Education" icon={Award} rows={3} value={form.education} onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))} />
            <TextArea label="Teaching Style" icon={Sparkles} rows={3} value={form.teaching_style} onChange={(e) => setForm((p) => ({ ...p, teaching_style: e.target.value }))} />
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {message && (
              <span className="text-sm text-gray-600">{message}</span>
            )}
          </div>
        </form>

        {/* ── RIGHT: Side cards ── */}
        <div className="w-full flex flex-col gap-4 sm:gap-5">

          {/* Profile Picture */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Upload size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Profile Picture</h3>
                <p className="text-xs text-gray-500">Add or update your profile picture.</p>
              </div>
            </div>

            <label
              htmlFor="profile-pic-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-purple-200 bg-purple-50 px-4 py-6 transition hover:bg-purple-100"
            >
              {form.pfp ? (
                <img src={form.pfp} alt="preview" className="mb-3 h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-gray-200">
                  <Upload size={24} className="text-gray-600" />
                </div>
              )}
              <div className="text-sm font-semibold text-gray-700 text-center">Drop image here or click to upload</div>
              <div className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP supported</div>
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const dataUrl = await fileToDataUrl(file);
                  setForm((p) => ({ ...p, pfp: dataUrl }));
                }}
              />
            </label>
          </div>

          {/* Certificates */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                <Award size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Certificates</h3>
                <p className="text-xs text-gray-500">Attach a file and request verification.</p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="Certificate title (optional)"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
              <button
                type="button"
                onClick={() => setShowCertificateUpload((prev) => !prev)}
                className="w-full rounded-xl border border-dashed border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
              >
                {showCertificateUpload ? "Hide file upload" : "Attach certificate file"}
              </button>

              {showCertificateUpload && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <label className="block">
                    <div className="mb-1.5 text-sm font-medium text-gray-700">Certificate file</div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (!file) { setCertificateFile(null); setCertificatePreview(""); return; }
                        if (!["image/jpeg", "image/png"].includes(file.type)) {
                          setMessage("Only JPG and PNG files are allowed.");
                          e.target.value = "";
                          setCertificateFile(null); setCertificatePreview(""); return;
                        }
                        if (file.size > MAX_CERTIFICATE_SIZE) {
                          setMessage("Certificate must be 2 MB or smaller.");
                          e.target.value = "";
                          setCertificateFile(null); setCertificatePreview(""); return;
                        }
                        setMessage("");
                        const reader = new FileReader();
                        reader.onload = () => {
                          setCertificateFile(file);
                          setCertificatePreview(String(reader.result || ""));
                          setCertificateName((prev) => prev || file.name.replace(/\.[^/.]+$/, ""));
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-gray-800"
                    />
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    {certificateFile ? `Selected: ${certificateFile.name}` : "JPG or PNG, under 2 MB."}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddCertificate}
                disabled={certSaving || !certificatePreview}
                className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {certSaving ? "Submitting..." : "Get Verification"}
              </button>
            </div>

            {/* Current certificate status */}
            <div className="mt-4 rounded-xl bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Current certificate</p>
              <p className="mt-1.5 text-sm font-semibold text-gray-900">
                {certificate?.certificate_name || "No certificate added"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Status: {certificate ? (certificate.approved ? "Approved" : "Pending approval") : "Not created"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {certificate?.file_url
                  ? "Uploaded certificate is ready for review."
                  : certificateFile
                  ? `Attached: ${certificateFile.name}`
                  : "No file attached yet"}
              </p>
              {certificate?.file_url && (
                <a
                  href={certificate.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex text-xs font-semibold text-purple-700 hover:underline"
                >
                  View uploaded certificate
                </a>
              )}
            </div>
          </div>

          {/* Profile Snapshot */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">Profile Snapshot</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-gray-900 shrink-0">Verified</span>
                <span className="text-right">{profile?.verified ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-gray-900 shrink-0">Rating</span>
                <span className="text-right">{profile?.rating ?? "—"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-gray-900">Education</span>
                <span className="text-gray-500 text-xs leading-relaxed">{profile?.education || "—"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-gray-900">Teaching style</span>
                <span className="text-gray-500 text-xs leading-relaxed">{profile?.teaching_style || "—"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-gray-900">Bio</span>
                <span className="text-gray-500 text-xs leading-relaxed">{profile?.bio || "—"}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}