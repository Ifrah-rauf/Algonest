import { useCallback, useEffect, useState } from "react";
import { CreditCard, Loader2, RefreshCw, XCircle } from "lucide-react";
import { apiUrl } from "../../config/api.js";

const PAYMENT_TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved Log" },
  { id: "rejected", label: "Rejected Log" },
];

function PaymentStatusBadge({ status }) {
  const classes =
    status === "approved"
      ? "bg-emerald-50 text-emerald-700"
      : status === "rejected"
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
}

function PaymentBookingRow({ booking, paymentStatus, updatingBookingId, onPaymentAction }) {
  const isUpdating = updatingBookingId === booking.booking_id;
  const studentName = booking.auth?.name || booking.student?.name || "Student";
  const studentEmail = booking.auth?.email || "No email";
  const courseTitle = booking.course?.title || `Course #${booking.course_id || "-"}`;

  return (
    <div className="grid gap-4 bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-gray-900">#{booking.booking_id} - {studentName}</p>
          <PaymentStatusBadge status={booking.payment_status} />
        </div>
        <p className="mt-1 text-sm text-gray-600">{studentEmail}</p>
        <p className="mt-1 text-sm text-gray-600">
          {courseTitle} - Sessions: {booking.remainingsessions ?? "-"}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Booked {booking.booking_date ? new Date(booking.booking_date).toLocaleString() : "-"}
        </p>
        {booking.payment_approved_at ? (
          <p className="mt-1 text-xs text-emerald-700">
            Approved {new Date(booking.payment_approved_at).toLocaleString()}
          </p>
        ) : null}
      </div>

      {paymentStatus === "pending" ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onPaymentAction(booking.booking_id, "approve")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            Approve
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onPaymentAction(booking.booking_id, "reject")}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      ) : (
        <div className="text-sm font-semibold text-gray-500">
          {paymentStatus === "approved" ? "Approved" : "Rejected"}
        </div>
      )}
    </div>
  );
}

export default function PaymentApprovalsPanel({ user }) {
  const [paymentBookings, setPaymentBookings] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const loadPaymentBookings = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setPaymentLoading(true);
      setPaymentMessage("");
      const res = await fetch(
        apiUrl(`/api/admin/bookings/payments?status=${paymentStatus}&requesterUid=${encodeURIComponent(user.uid)}`),
        { credentials: "include" }
      );
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to load payment records");
      }
      setPaymentBookings(data.bookings || []);
    } catch (error) {
      setPaymentMessage(error.message || "Could not load payment records.");
    } finally {
      setPaymentLoading(false);
    }
  }, [paymentStatus, user?.uid]);

  useEffect(() => {
    loadPaymentBookings();
  }, [loadPaymentBookings]);

  async function handlePaymentAction(bookingId, action) {
    if (!user?.uid || !bookingId) return;

    try {
      setUpdatingBookingId(bookingId);
      setPaymentMessage("");
      const res = await fetch(apiUrl(`/api/admin/bookings/${bookingId}/${action}-payment`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ requesterUid: user.uid }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || `Failed to ${action} payment`);
      }
      setPaymentBookings((prev) => prev.filter((booking) => booking.booking_id !== bookingId));
      setPaymentMessage(action === "approve" ? "Payment approved." : "Payment rejected.");
    } catch (error) {
      setPaymentMessage(error.message || "Could not update payment.");
    } finally {
      setUpdatingBookingId(null);
    }
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Payment Approvals</h2>
          <p className="mt-1 text-sm text-gray-600">
            Approve manual payments and review payment decision logs.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPaymentBookings}
          disabled={paymentLoading}
          className="inline-flex items-center gap-2 rounded-2xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${paymentLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {PAYMENT_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPaymentStatus(item.id)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              paymentStatus === item.id
                ? "bg-purple-700 text-white"
                : "border border-purple-100 bg-white text-purple-700 hover:bg-purple-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {paymentMessage ? (
        <p className="mt-4 rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-800">
          {paymentMessage}
        </p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
        {paymentLoading ? (
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-5 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading {paymentStatus} payment records...
          </div>
        ) : paymentBookings.length ? (
          <div className="divide-y divide-gray-100">
            {paymentBookings.map((booking) => (
              <PaymentBookingRow
                key={booking.booking_id}
                booking={booking}
                paymentStatus={paymentStatus}
                updatingBookingId={updatingBookingId}
                onPaymentAction={handlePaymentAction}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 px-4 py-5 text-sm text-gray-600">
            No {paymentStatus} payment records.
          </div>
        )}
      </div>
    </section>
  );
}
