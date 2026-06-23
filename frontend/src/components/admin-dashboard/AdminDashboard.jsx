import { Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import PaymentApprovalsPanel from "./PaymentApprovalsPanel.jsx";
import TeacherManagementPanel from "./TeacherManagementPanel.jsx";
import AdminNotesPanel from "./AdminNotesPanel.jsx";

function AdminHeader({ adminEmail }) {
  return (
    <div className="mb-6 rounded-3xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-sm">
          <Shield className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Control panel for AlgoNest admin operations.
          </p>
        </div>
        <div className="ml-auto rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-semibold text-purple-700">
          {adminEmail}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ data }) {
  const { user } = useAuth();
  const adminEmail = data?.auth?.email || "algonest.edtech@gmail.com";

  return (
    <div className="w-full">
      <AdminHeader adminEmail={adminEmail} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6">
          <PaymentApprovalsPanel user={user} />
          <TeacherManagementPanel user={user} />
        </section>

        <AdminNotesPanel />
      </div>
    </div>
  );
}
