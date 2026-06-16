import { apiUrl } from "../config/api.js";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FileUp, FileText, RefreshCw, Sparkles, UploadCloud } from "lucide-react";

const BASE_URL = apiUrl("/api/content");

function formatDate(value) {
  if (!value) return "Just now";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TeacherContent() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    file: null,
    fileName: "",
    preview: "",
  });

  async function loadContent() {
    try {
      setLoading(true);
      const res = await fetch(BASE_URL);
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        preview: String(reader.result || ""),
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
      }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!user?.uid) {
      setMessage("Please sign in to upload content.");
      return;
    }

    if (!form.name.trim() || !form.preview) {
      setMessage("Add a title and choose a file first.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: form.name.trim(),
          file: form.preview,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("Content uploaded successfully.");
      setForm({ name: "", file: null, fileName: "", preview: "" });
      await loadContent();
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage(err.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const latestItems = useMemo(() => items.slice(0, 8), [items]);

  return (
    <div className="p-8 w-full">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Content</h2>
          <p className="text-gray-600 mt-2">Upload teacher files and keep your published content organized.</p>
        </div>
        <button
          type="button"
          onClick={loadContent}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Add content</h3>
              <p className="text-sm text-gray-500">Upload a file and give it a clear title.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Middleware Notes"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">File</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-4 py-8 text-center transition hover:bg-purple-50">
                <FileUp className="mb-3 text-purple-600" size={22} />
                <span className="text-sm font-semibold text-gray-800">Choose a file to upload</span>
                <span className="mt-1 text-xs text-gray-500">PDF, image, doc, or any file you want to publish</span>
                <input type="file" className="hidden" onChange={onFileChange} />
              </label>
              {form.fileName && (
                <p className="mt-2 text-xs text-purple-700">
                  Selected: {form.fileName}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              <Sparkles size={16} />
              {submitting ? "Uploading..." : "Publish Content"}
            </button>

            {message && (
              <p className={`text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </div>
        </form>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Published content</h3>
              <p className="text-sm text-gray-500">Your latest uploads appear here.</p>
            </div>
            <div className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              {items.length} items
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Loading content...</div>
          ) : latestItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <FileText className="mx-auto text-gray-400" size={28} />
              <p className="mt-3 text-sm font-semibold text-gray-800">No content uploaded yet</p>
              <p className="mt-1 text-sm text-gray-500">Use the form on the left to upload your first file.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {latestItems.map((item) => {
                const isDataUrl = typeof item.file === "string" && item.file.startsWith("data:");
                return (
                  <div key={item.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-purple-200 hover:bg-purple-50/40">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-bold text-gray-900">{item.name || "Untitled content"}</h4>
                        <p className="mt-1 text-xs text-gray-500">Uploaded {formatDate(item.created_at)}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-purple-700">
                        File
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <a
                        href={item.file}
                        download={isDataUrl ? `${item.name || "content"}.txt` : undefined}
                        target={isDataUrl ? "_self" : "_blank"}
                        rel={isDataUrl ? undefined : "noreferrer"}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        <FileText size={16} />
                        Open File
                      </a>
                      <span className="text-xs text-gray-500 break-all">{String(item.file || "").slice(0, 44)}{String(item.file || "").length > 44 ? "..." : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
