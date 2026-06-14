import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/navbar.js";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/booking-page.css";

const COURSE_DEFAULTS = {
  1: {
    title: "Simple Stack Booking",
    stack: "Simple Stack",
    sessions: 12,
    expiryDays: 120,
    price: "₹9,999",
    accent: "#534AB7",
  },
  2: {
    title: "Advanced Stack Booking",
    stack: "Advanced Stack",
    sessions: 14,
    expiryDays: 150,
    price: "₹9,999",
    accent: "#7c3aed",
  },
  3: {
    title: "FAANG Stack Booking",
    stack: "FAANG Stack",
    sessions: 16,
    expiryDays: 180,
    price: "₹9,999",
    accent: "#059669",
  },
};

const PAYMENT_OPTIONS = [
  {
    id: "upi",
    name: "UPI",
    desc: "Google Pay, PhonePe, Paytm and other UPI apps",
  },
  {
    id: "card",
    name: "Card",
    desc: "Credit or debit card checkout",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    desc: "Bank transfer flow for later gateway integration",
  },
  {
    id: "wallet",
    name: "Wallet",
    desc: "Digital wallets and pay-later hooks",
  },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const courseId = Number(searchParams.get("courseId") || location.state?.courseId || 1);
  const stackKey = searchParams.get("stack") || location.state?.stack || "simple";
  const course = COURSE_DEFAULTS[courseId] || COURSE_DEFAULTS[1];
  const stackName = location.state?.stackName || searchParams.get("stackName") || course.stack;

  async function handleDummyBook() {
    if (!user?.uid) {
      navigate("/login", { state: { from: `/book-now?courseId=${courseId}&stack=${stackKey}` } });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/booking/course-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          courseId,
          paymentId: null,
          planId: null,
          remainingSessions: course.sessions,
          expiryDays: course.expiryDays,
          projectId: null,
          paymentMethod,
          paymentStatus: "PENDING",
          dummy: true,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Booking failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Thank you",
        text: "An agent will reach you soon to complete the payment.",
        confirmButtonColor: course.accent,
      });

      navigate("/dashboard");
    } catch (err) {
      const message = err.message || "Could not complete booking";
      setError(message);
      await Swal.fire({
        icon: "error",
        title: "Booking failed",
        text: message,
        confirmButtonColor: course.accent,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-page" style={{ background: "#fff", minHeight: "100vh", color: "#111827", fontFamily: "'Syne', 'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <section className="booking-section">
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f0effc", border: "1px solid #ddd8f8", borderRadius: 999, padding: "6px 14px", marginBottom: 18 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: course.accent }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: course.accent, fontFamily: "'DM Sans'" }}>Booking flow</span>
          </div>

          <div className="booking-layout">
            <div>
              <h1 className="booking-title" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.02, marginBottom: 14 }}>
                Complete your booking for <span style={{ color: course.accent }}>{stackName}</span>
              </h1>
              <p className="booking-lead" style={{ fontSize: 17, color: "#4b5563", lineHeight: 1.7, maxWidth: 760, fontFamily: "'DM Sans'" }}>
                Choose a payment option, then use the dummy booking button to create a booking record now. The payment gateway can be wired in later without changing this flow.
              </p>

              <div className="booking-meta-grid" style={{ marginTop: 28 }}>
                {[
                  { label: "Course ID", value: courseId },
                  { label: "Plan ID", value: "null" },
                  { label: "Remaining sessions", value: course.sessions },
                  { label: "Expiry window", value: `${course.expiryDays} days` },
                ].map((item) => (
                  <div key={item.label} style={{ background: "#fff", border: "1px solid #ece7fb", borderRadius: 18, padding: "16px 18px", boxShadow: "0 10px 30px rgba(83,74,183,0.06)" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 7, fontFamily: "'DM Sans'" }}>{item.label}</p>
                    <p style={{ fontSize: 19, fontWeight: 800, color: "#111827" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="booking-payment-card" style={{ marginTop: 28, background: "#fff", border: "1px solid #ece7fb", borderRadius: 24, padding: 24, boxShadow: "0 20px 50px rgba(17,24,39,0.06)" }}>
                <div className="booking-card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: course.accent, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontFamily: "'DM Sans'" }}>Payment options</p>
                    <h2 className="booking-card-heading" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, marginBottom: 6 }}>Pick the gateway style you want later</h2>
                    <p style={{ fontSize: 14, color: "#6b7280", fontFamily: "'DM Sans'" }}>This is ready to swap to a live provider after deployment.</p>
                  </div>
                  <div style={{ background: "#f0effc", color: course.accent, padding: "8px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans'" }}>
                    {course.price} · Standard booking
                  </div>
                </div>

                <div className="booking-options-grid">
                  {PAYMENT_OPTIONS.map((option) => {
                    const active = paymentMethod === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        style={{
                          textAlign: "left",
                          border: `1.5px solid ${active ? course.accent : "#e5e7eb"}`,
                          background: active ? "#faf7ff" : "#fff",
                          borderRadius: 18,
                          padding: 16,
                          cursor: "pointer",
                          boxShadow: active ? "0 12px 28px rgba(83,74,183,0.10)" : "none",
                          transition: "all 0.18s",
                        }}
                      >
                        <p style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 6 }}>{option.name}</p>
                        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, fontFamily: "'DM Sans'" }}>{option.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  <div style={{ background: "#fafafa", border: "1px solid #f0effc", borderRadius: 16, padding: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "'DM Sans'" }}>Selected method</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{paymentMethod.toUpperCase()}</p>
                  </div>

                  {error && (
                    <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", color: "#9f1239", borderRadius: 14, padding: "12px 14px", fontSize: 13, fontFamily: "'DM Sans'" }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleDummyBook}
                    disabled={loading}
                    style={{
                      width: "100%",
                      background: course.accent,
                      color: "#fff",
                      border: "none",
                      borderRadius: 14,
                      padding: "16px 18px",
                      fontSize: 16,
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 18px 30px rgba(83,74,183,0.20)",
                      opacity: loading ? 0.8 : 1,
                    }}
                  >
                    {loading ? "Booking..." : "dummy book"}
                  </button>
                </div>
              </div>
            </div>

            <aside className="booking-summary">
              <div className="booking-summary-card" style={{ background: "#0f0020", color: "#fff", borderRadius: 28, padding: 24, boxShadow: "0 24px 60px rgba(15,0,32,0.16)" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#f6c90e", textTransform: "uppercase", letterSpacing: 1.6, marginBottom: 10, fontFamily: "'DM Sans'" }}>Booking summary</p>
                <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, marginBottom: 10 }}>{course.stack}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, marginBottom: 18, fontFamily: "'DM Sans'" }}>
                  This booking is wired to course id {courseId}. Later, the same page can hand off to a live gateway without changing the insert flow.
                </p>

                <div style={{ display: "grid", gap: 12 }}>
                  {[
                    "Select your payment option",
                    "Press dummy book to create the booking row",
                    "Receive a success Swal and continue to your dashboard",
                  ].map((step, index) => (
                    <div key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 14 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 999, background: index === 2 ? "#f6c90e" : "rgba(255,255,255,0.12)", color: index === 2 ? "#0f0020" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                        {index + 1}
                      </div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.6, fontFamily: "'DM Sans'" }}>{step}</p>
                    </div>
                  ))}
                </div>

                <div className="booking-summary-actions" style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link
                    to="/roadmaps"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Back to roadmaps
                  </Link>
                  <Link
                    to="/careerQuiz"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: "#f6c90e",
                      color: "#0f0020",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    Take quiz
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
