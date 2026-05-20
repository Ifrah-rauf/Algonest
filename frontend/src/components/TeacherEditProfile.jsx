import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Video, Globe, BookOpen, Award, Sparkles, Upload, CheckCircle2, Loader2 } from "lucide-react";

const BASE_URL = "http://localhost:5000/api/teachers";

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

function Field({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-purple-600" />}
        {label}
      </div>
      <input
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
      />
    </label>
  );
}

function TextArea({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-purple-600" />}
        {label}
      </div>
      <textarea
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
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
    return <div className="p-8 text-gray-500">Loading profile editor...</div>;
  }

  return (
    <div className="w-full p-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Profile</h2>
          <p className="mt-2 text-gray-600">Update the teacher information shown across the platform.</p>
        </div>
        <div className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
          {profile?.verified ? "Verified teacher" : "Profile editor"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6">
        <form onSubmit={handleSave} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" icon={User} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <Field label="Timezone" icon={Globe} value={form.timezone} onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))} />
            <Field label="Profile Picture URL" icon={Upload} value={form.pfp} onChange={(e) => setForm((p) => ({ ...p, pfp: e.target.value }))} />
            <Field label="Experience" icon={Sparkles} value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} />
            <Field label="Video Link" icon={Video} value={form.video_url} onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))} />
            <Field label="Meeting Link" icon={BookOpen} value={form.meeting_link} onChange={(e) => setForm((p) => ({ ...p, meeting_link: e.target.value }))} />
            <Field label="Specialisation ID" icon={BookOpen} value={form.specialisation_id} onChange={(e) => setForm((p) => ({ ...p, specialisation_id: e.target.value }))} />
            <Field label="Language ID" icon={BookOpen} value={form.language_id} onChange={(e) => setForm((p) => ({ ...p, language_id: e.target.value }))} />
            <Field label="Frameworks ID" icon={BookOpen} value={form.frameworks_id} onChange={(e) => setForm((p) => ({ ...p, frameworks_id: e.target.value }))} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <TextArea label="Bio" icon={User} rows={4} value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
            <TextArea label="Education" icon={Award} rows={3} value={form.education} onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))} />
            <TextArea label="Teaching Style" icon={Sparkles} rows={3} value={form.teaching_style} onChange={(e) => setForm((p) => ({ ...p, teaching_style: e.target.value }))} />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {message && <span className="text-sm text-gray-600">{message}</span>}
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                <Award size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Certificates</h3>
                <p className="text-sm text-gray-500">Attach a certificate file and request admin verification.</p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="Certificate title (optional)"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
              <button
                type="button"
                onClick={() => setShowCertificateUpload((prev) => !prev)}
                className="w-full rounded-xl border border-dashed border-purple-200 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
              >
                {showCertificateUpload ? "Hide file upload" : "Attach certificate file"}
              </button>
              {showCertificateUpload && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-gray-700">Certificate file</div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (!file) {
                          setCertificateFile(null);
                          setCertificatePreview("");
                          return;
                        }
                        if (!["image/jpeg", "image/png"].includes(file.type)) {
                          setMessage("Only JPG and PNG certificate files are allowed.");
                          e.target.value = "";
                          setCertificateFile(null);
                          setCertificatePreview("");
                          return;
                        }
                        if (file.size > MAX_CERTIFICATE_SIZE) {
                          setMessage("Certificate file must be 2 MB or smaller.");
                          e.target.value = "";
                          setCertificateFile(null);
                          setCertificatePreview("");
                          return;
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
                      className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
                    />
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    {certificateFile
                      ? `Selected file: ${certificateFile.name}`
                      : "Choose a JPG or PNG certificate under 2 MB before uploading."}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddCertificate}
                  disabled={certSaving || !certificatePreview}
                  className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {certSaving ? "Submitting..." : "Get Verification"}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Current certificate</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {certificate?.certificate_name || "No certificate added"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Status: {certificate ? (certificate.approved ? "Approved" : "Pending approval") : "Not created"}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {certificate?.file_url
                  ? "Uploaded certificate is ready for review."
                  : certificateFile
                  ? `Attached file: ${certificateFile.name}`
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

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Profile Snapshot</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-900">Verified:</span> {profile?.verified ? "Yes" : "No"}</p>
              <p><span className="font-semibold text-gray-900">Rating:</span> {profile?.rating ?? "—"}</p>
              <p><span className="font-semibold text-gray-900">Education:</span> {profile?.education || "—"}</p>
              <p><span className="font-semibold text-gray-900">Teaching style:</span> {profile?.teaching_style || "—"}</p>
              <p><span className="font-semibold text-gray-900">Bio:</span> {profile?.bio || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
