import { apiUrl } from "../config/api.js";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";
import LoadingButton from "../components/LoadingButton";
import { useLoading } from "../context/LoadingContext";

// ─── constants ────────────────────────────────────────────────
const API = apiUrl("/api/booking");

// ─── response codes (never match on .message strings) ─────────
const CODE = {
  PLAN_EXPIRED:         "PLAN_EXPIRED",
  WRONG_PLAN:           "WRONG_PLAN",
  NO_SESSIONS:          "NO_SESSIONS",
  NOT_UNIQUE:           "NOT_UNIQUE",
  SESSION_BOOKED:       "SESSION_BOOKED",
  PAYMENT_REQUIRED:     "PAYMENT_REQUIRED",
  SESSION_OPEN:         "SESSION_OPEN",
  PLAN_MATCH:           "PLAN_MATCH",
  CHECKPOINT_BLOCKED:   "CHECKPOINT_BLOCKED",
  INTERVIEW_BLOCKED:    "INTERVIEW_BLOCKED",
};

// ─── swal theme helper ────────────────────────────────────────
function algoswal(opts) {
  return Swal.fire({
    confirmButtonColor: "#f6c90e",
    didOpen: () => {
      const btn = Swal.getConfirmButton();
      if (btn) btn.style.color = "#202020";
      const cancelBtn = Swal.getCancelButton();
      if (cancelBtn) {
        cancelBtn.style.backgroundColor = "#e5e7eb";
        cancelBtn.style.color = "#374151";
      }
    },
    ...opts,
  });
}

// ─────────────────────────────────────────────────────────────
export default function AvailabilityDisplay({
  teacherId,
  meeting_link,
  avail = [],
  timeSlots = [],
  gateFlow = null,
  checkpointFlow = null,
}) {
  const { user } = useAuth();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const activeFlow = gateFlow || checkpointFlow || null;
  const activeFlowKind = activeFlow?.kind || (activeFlow?.interviewId ? "interview" : activeFlow?.checkpointId ? "checkpoint" : null);
  const [gateStatus, setGateStatus] = useState(null);

  function getDateGroupKey(slot) {
    const raw = slot?.availability?.date || slot?.startat || "";
    const value = String(raw).trim();
    if (!value) return "";

    // Preserve calendar days exactly when the backend already gives a date-only value.
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    // Supabase timestamps are often ISO-like strings; keep the date component stable.
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
  }

  function parseCalendarDate(dateValue) {
    if (!dateValue) return null;
    const raw = String(dateValue).trim();
    if (!raw) return null;

    // Preserve date-only values without timezone shifting.
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [year, month, day] = raw.split("-").map(Number);
      return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    }

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  useEffect(() => {
    async function loadGateStatus() {
      if (!user?.uid) {
        setGateStatus(null);
        return;
      }

      if (!activeFlowKind || !activeFlow?.title) {
        setGateStatus(null);
        return;
      }

      try {
        const endpoint = activeFlowKind === "interview"
          ? "interviewBookingGuard"
          : "checkpointBookingGuard";
        const res = await fetch(apiUrl(`/api/booking/${endpoint}`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            checkpointId: activeFlowKind === "checkpoint" ? activeFlow?.checkpointId || null : null,
            interviewId: activeFlowKind === "interview" ? activeFlow?.interviewId || null : null,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setGateStatus(data.data);
        }
      } catch (error) {
        console.error("Failed to load roadmap gate booking status:", error);
      }
    }

    loadGateStatus();
  }, [activeFlow?.checkpointId, activeFlow?.interviewId, activeFlow?.title, activeFlowKind, user?.uid]);

  // ── group slots by calendar day (memoised — not recalculated on every render)
  const grouped = useMemo(() => {
    const map = new Map();

    timeSlots.forEach((s) => {
      const key = getDateGroupKey(s);
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    });

    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [timeSlots]);

  // ── format helpers ────────────────────────────────────────
  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });

  const formatDate = (dateString) =>
    parseCalendarDate(dateString)?.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) || "";

  // ─────────────────────────────────────────────────────────
  // PAST SLOT CHECK — true if slot start time is in the past
  // ─────────────────────────────────────────────────────────
  const isPast = (startat) => new Date(startat) < new Date();
  const isStudent = user?.role === "STUDENT";

  // ─────────────────────────────────────────────────────────
  // STEP 1 — guard + kick off plan check
  // ─────────────────────────────────────────────────────────
  async function check(slot) {
    if (!user) {
      await algoswal({
        icon: "warning",
        title: "Login required",
        text: "Please log in first to book a session.",
        confirmButtonText: "Go to Login",
      });
      navigate("/login");
      return;
    }
    await checkPlan(slot);
  }

  // ─────────────────────────────────────────────────────────
  // STEP 2 — verify student has a valid plan
  // ─────────────────────────────────────────────────────────
  async function checkPlan(slot) {
    try {
      setLoading(true);

      const res = await fetch(`${API}/getPlan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          teacherId,
          slot,
          checkpointId: activeFlowKind === "checkpoint" ? activeFlow?.checkpointId || null : null,
        }),
      });

      if (!res.ok) throw new Error(`getPlan HTTP ${res.status}`);
      const data = await res.json();

      // stop loader BEFORE showing any Swal
      setLoading(false);

      // ── no active plan
      if (!data.success && data.code === CODE.PLAN_EXPIRED) {
        await algoswal({
          icon: "warning",
          title: "No Active Plan",
          text: "You don't have an active plan. Please subscribe to continue.",
        });
        navigate("/plans");
        return;
      }

      // ── teacher doesn't offer this plan
      if (!data.success && data.code === CODE.WRONG_PLAN) {
        await algoswal({
          icon: "warning",
          title: "Plan Mismatch",
          text: "This mentor doesn't offer your current plan — but we have plenty of other mentors!",
        });
        return;
      }

      // ── any other backend failure
      if (!data.success && data.code === CODE.CHECKPOINT_BLOCKED) {
        await algoswal({
          icon: "warning",
          title: "Checkpoint not reached",
          text: data.message || "Complete lessons until your next mentor checkpoint unlocks before booking a plan session.",
        });
        return;
      }

      if (!data.success) {
        await algoswal({
          icon: "error",
          title: "Something went wrong",
          text: data.message || "Failed to verify your plan. Please try again.",
        });
        return;
      }

      // ── plan verified — confirm with student
      const isOpen = data.code === CODE.SESSION_OPEN;
      const confirmResult = await algoswal({
        title: "<strong>Slot Available!</strong>",
        html: `<p style="font-size:14px;color:gray;">${
          isOpen
            ? "This session is open for anyone to book."
            : "Your plan covers this slot. Ready to confirm?"
        }</p>`,
        icon: "success",
        confirmButtonText: "Confirm Booking",
        showCancelButton: true,
        cancelButtonText: "Not yet",
      });

      if (confirmResult.isConfirmed) {
        await bookSession(data, slot);
      }
    } catch (err) {
      setLoading(false);
      console.error("[checkPlan]", err);
      await algoswal({
        icon: "error",
        title: "Network Error",
        text: "Could not reach the server. Please check your connection.",
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // STEP 3 — book the session
  // ─────────────────────────────────────────────────────────
  async function bookSession(planCheckData, slot) {
    const { studentId, planData } = planCheckData;

    try {
      setLoading(true);

      const res = await fetch(`${API}/bookPlan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          planData,
          slot,
          checkpointId: activeFlowKind === "checkpoint" ? activeFlow?.checkpointId || null : null,
          interviewId: activeFlowKind === "interview" ? activeFlow?.interviewId || null : null,
        }),
      });

      if (!res.ok) throw new Error(`bookPlan HTTP ${res.status}`);
      const bookdata = await res.json();

      // stop loader BEFORE showing any Swal
      setLoading(false);

      if (!bookdata.success && (bookdata.code === CODE.CHECKPOINT_BLOCKED || bookdata.code === CODE.INTERVIEW_BLOCKED)) {
        await algoswal({
          icon: "warning",
          title: activeFlowKind === "interview" ? "Interview booking unavailable" : "Checkpoint booking unavailable",
          text: bookdata.message || "You cannot book another class for this roadmap gate right now.",
        });
        return;
      }

      // ── payment required
      if (bookdata.code === CODE.PAYMENT_REQUIRED) {
        await algoswal({
          icon: "info",
          title: "Payment Required",
          html: `
            <p style="font-size:14px;color:gray;">
              This is a paid session.
              Amount: <strong>₹${bookdata.amount}</strong>
            </p>
            <p style="font-size:13px;margin-top:6px;">
              Payment details will be sent to your registered email.
            </p>
          `,
          confirmButtonText: "Okay",
        });
        return;
      }

      // ── no remaining sessions
      if (!bookdata.success && bookdata.code === CODE.NO_SESSIONS) {
        await algoswal({
          icon: "warning",
          title: "No Sessions Left",
          text: "You have no remaining sessions. Please renew or purchase a plan.",
        });
        navigate("/plans");
        return;
      }

      // ── duplicate booking attempt
      if (!bookdata.success && bookdata.code === CODE.NOT_UNIQUE) {
        await algoswal({
          icon: "warning",
          title: "Already Booked",
          text: "You already have a session at this timeslot. Please choose a different one.",
        });
        return;
      }

      // ── any other backend failure
      if (!bookdata.success) {
        await algoswal({
          icon: "error",
          title: "Booking Failed",
          text: bookdata.message || "Something went wrong. Please try again.",
        });
        return;
      }

      // ── success
      if (bookdata.success && bookdata.code === CODE.SESSION_BOOKED) {
        const confirmed = await algoswal({
          icon: "success",
          title: activeFlow ? `${activeFlowKind === "interview" ? "Interview" : "Checkpoint"} Session Confirmed! 🎉` : "Session Confirmed! 🎉",
          html: `
            <p style="font-size:14px;color:gray;">
              Your session is booked for
              <strong>${new Date(bookdata.time).toLocaleString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}</strong>
            </p>
            <p style="font-size:13px;margin-top:6px;">
              ${
                activeFlow
                  ? `This session is now linked to <strong>${activeFlow.title}</strong>.`
                  : "Check your email for session details and joining link!"
              }
            </p>
          `,
          confirmButtonText: "Done",
        });

        sendBookingMail({ studentId, planData, slot });

        if (confirmed.isConfirmed || confirmed.isDismissed) {
          if (activeFlow?.returnTo) {
            const successPayload = {
              kind: activeFlowKind || "checkpoint",
              checkpointId: activeFlowKind === "checkpoint" ? activeFlow.checkpointId : null,
              interviewId: activeFlowKind === "interview" ? activeFlow.interviewId : null,
              title: activeFlow.title,
              sessionId: bookdata.session_id || bookdata.session?.session_id || null,
            };
            navigate(activeFlow.returnTo, {
              state: {
                gateBookingSuccess: successPayload,
                ...(activeFlowKind === "interview"
                  ? { interviewBookingSuccess: successPayload }
                  : { checkpointBookingSuccess: successPayload }),
              },
            });
            return;
          }

          window.location.reload();
        }
      }
    } catch (err) {
      setLoading(false);
      console.error("[bookSession]", err);
      await algoswal({
        icon: "error",
        title: "Booking Error",
        text: "An unexpected error occurred. Please try again or contact support.",
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // STEP 4 — fire confirmation email (non-blocking)
  // ─────────────────────────────────────────────────────────
  function sendBookingMail({ studentId, planData, slot }) {
    fetch(`${API}/bookingMail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, planData, slot }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) console.warn("[sendBookingMail] failed:", d.message);
      })
      .catch((err) => console.error("[sendBookingMail] network error:", err));
  }

  // ─────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Available Time Slots
      </h3>

      {gateStatus && !gateStatus.canBook && (
        <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
          <p className="text-sm font-semibold text-yellow-800">
            {gateStatus.message || "Roadmap gate booking is temporarily disabled."}
          </p>
          {gateStatus.cooldownEndsAt && (
            <p className="mt-1 text-xs text-yellow-700">
              You can try again after{" "}
              {new Date(gateStatus.cooldownEndsAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}

      {/* meeting_link is hidden from public view — only shown post-booking via email */}

      {timeSlots.length === 0 && (
        <p className="text-gray-500 text-sm">
          This mentor has no upcoming slots.
        </p>
      )}

      {/* ── week grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grouped
          .slice(0, 7)
          .map(([dateKey, slots]) => (
            <div
              key={dateKey}
              className="border rounded-xl bg-gray-100 p-4 flex flex-col shadow-xl"
            >
              {/* day header */}
              <h4 className="text-sm font-bold text-center text-[var(--algo-purple)] mb-4">
                {formatDate(dateKey)}
              </h4>

              {/* slots */}
              <div className="flex flex-col gap-3 flex-1">
                {[...slots]
                  .sort((a, b) => new Date(a.startat) - new Date(b.startat))
                  .map((slot) => {
                    const desc     = slot.availability?.desc;
                    const isFree   = slot.availability?.isfree;
                    const type     = slot.availability?.type?.toLowerCase?.();
                    const isOneOff = type === "session" || type === "free";

                    // normalise booked flag across possible key names
                    const booked = Boolean(
                      slot.isbooked ??
                      slot.isBooked ??
                      slot.is_booked ??
                      slot.slotbooking?.isbooked
                    );

                    const past      = isPast(slot.startat);
                    const checkpointBlocked = Boolean(
                      activeFlow && gateStatus && !gateStatus.canBook
                    );
                    const notStudent = Boolean(user && !isStudent);
                    const disabled  = booked || past || checkpointBlocked || notStudent;

                    return (
                      <div
                        key={slot.slot_id}
                        className={`
                          relative p-3 rounded-lg border text-sm
                          ${disabled
                            ? "bg-white border-gray-200 opacity-70"
                            : isOneOff && !isFree
                            ? "bg-yellow-50 border-yellow-300"
                            : "bg-white border-gray-200 hover:shadow"}
                        `}
                      >
                        {/* label badge */}
                        {desc && (
                          <span className="absolute -top-2 -left-2 bg-[var(--algo-purple)] text-white text-xs px-2 py-1 rounded-lg font-semibold shadow">
                            {desc}
                          </span>
                        )}

                        {/* time range */}
                        <p className={`font-medium ${disabled ? "text-gray-500" : "text-gray-700"}`}>
                          {formatTime(slot.startat)} – {formatTime(slot.endat)}
                        </p>

                        <p className="text-xs text-gray-400">
                          {slot.durationmin} min session
                        </p>

                        {/* status label */}
                        {past && !booked ? (
                          <p className="text-xs text-gray-400 font-semibold mt-1">
                            ✕ Slot Expired
                          </p>
                        ) : booked ? (
                          <p className="text-xs text-red-500 font-bold mt-1">
                            Already Booked
                          </p>
                        ) : isFree ? (
                          <p className="text-xs text-green-700 font-semibold mt-1">
                            ✓ Free Session
                          </p>
                        ) : isOneOff ? (
                          <p className="text-xs text-yellow-700 font-semibold mt-1">
                            ₹ Paid One-Time Session
                          </p>
                        ) : (
                          <p className="text-xs text-blue-700 font-semibold mt-1">
                            ✓ Covered Under Plan
                          </p>
                        )}

                        {/* CTA */}
                        <LoadingButton
                          disabled={disabled}
                          onClick={() => !disabled && check(slot)}
                          className={`
                            mt-3 w-full py-2 rounded-lg font-semibold text-sm
                            ${disabled
                              ? "text-gray-600 cursor-not-allowed"
                              : "bg-[var(--nest-yellow)] hover:bg-yellow-400 text-black"}
                          `}
                        >
                          {booked
                            ? "Booked"
                            : past
                            ? "Expired"
                            : notStudent
                            ? "Students only"
                            : checkpointBlocked
                            ? "Book Session"
                            : "Book Session"}
                        </LoadingButton>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
