import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Trash2 } from "lucide-react";

const BASE_URL = "http://localhost:5000/api/support";

export function TeacherSettings() {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);

  async function handleDeleteRequest() {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will send an account deletion request for approval. Your account will not be deleted immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, request deletion",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSending(true);
      const res = await fetch(`${BASE_URL}/account-deletion-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user?.uid }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to send deletion request");
      }

      await Swal.fire({
        title: "Sent for approval",
        text: "Your deletion request has been sent to the team.",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });
    } catch (error) {
      await Swal.fire({
        title: "Request failed",
        text: error.message || "Could not send the deletion request.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="w-full p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="mt-2 text-gray-600">Manage account-level requests and preferences.</p>
      </div>

      <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Delete Account Request</h3>
            <p className="mt-2 text-sm text-gray-600">
              This does not delete your account immediately. It sends a request to the AlgoNest team for approval.
            </p>

            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                Once approved, your account can be removed by the admin team.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDeleteRequest}
              disabled={sending}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              <Trash2 className="h-4 w-4" />
              {sending ? "Sending..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
