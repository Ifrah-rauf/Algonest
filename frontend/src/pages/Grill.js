import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Flame, ArrowLeft, Star, Clock, Users } from "lucide-react";
import ComingSoon from "../components/comingsoon.jsx";
const C = {
  purple: "#6b46c1",
  purpleDark: "#4c1d95",
  purpleLight: "#f3eeff",
  orange: "#f59e0b",
  orangeLight: "#fffbeb",
  ink: "#21153f",
  muted: "#766f8e",
  border: "#e8e1f5",
  bg: "#faf8ff",
  white: "#ffffff",
};

export default function Grill() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
    <div>
      <Navbar />
      <ComingSoon /> 
      {/*<div className="min-h-screen" style={{ background: C.bg }}>
        
         <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/")}
              className="p-2 rounded-lg transition hover:bg-gray-100"
              style={{ color: C.orange }}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold md:text-4xl" style={{ color: C.ink }}>
                Grill Sessions
              </h1>
              <p className="mt-1 text-sm" style={{ color: C.muted }}>
                Mock interviews with experienced professionals
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 md:p-8 mb-8"
            style={{
              background: `linear-gradient(135deg, ${C.orange}, #f97316)`,
              borderColor: "rgba(245,158,11,0.3)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="h-14 w-14 rounded-lg flex items-center justify-center text-white"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <Flame className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Real Interview Experience</h2>
                <p className="text-white/80">
                  Get grilled by placed professionals who know exactly what interviewers look for. Every session ends with a detailed scorecard and actionable feedback.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold" style={{ color: C.ink }}>
                Available Session Types
              </h3>
              {[
                {
                  title: "Technical Grill",
                  duration: "45 mins",
                  icon: "🔬",
                  description: "Deep dive into DSA, system design, and technical problem-solving",
                },
                {
                  title: "Resume Review Grill",
                  duration: "45 mins",
                  icon: "📄",
                  description: "Get your resume critiqued by a professional from a top company",
                },
                {
                  title: "Project Grill",
                  duration: "45 mins",
                  icon: "🚀",
                  description: "Explain and defend your projects like in a real interview",
                },
                {
                  title: "Behavioural Grill",
                  duration: "45 mins",
                  icon: "💼",
                  description: "Master HR rounds and star method for behavioral questions",
                },
              ].map((type, index) => (
                <div
                  key={index}
                  className="rounded-2xl border p-4 cursor-pointer transition hover:shadow-lg hover:translate-y-[-2px]"
                  style={{
                    borderColor: C.border,
                    background: C.white,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{type.icon}</span>
                        <h4 className="font-bold" style={{ color: C.ink }}>
                          {type.title}
                        </h4>
                      </div>
                      <p className="text-sm" style={{ color: C.muted }}>
                        {type.description}
                      </p>
                    </div>
                    <div
                      className="rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap"
                      style={{
                        background: C.orangeLight,
                        color: C.orange,
                      }}
                    >
                      {type.duration}
                    </div>
                  </div>
                  <button
                    className="mt-3 text-sm font-semibold px-4 py-2 rounded-lg transition"
                    style={{ color: C.white, background: C.orange }}
                  >
                    Book Session
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold" style={{ color: C.ink }}>
                Why Grill Sessions?
              </h3>
              {[
                {
                  icon: <Star className="h-5 w-5" />,
                  title: "Expert Feedback",
                  description: "Learn from professionals who've been on both sides of the interview table",
                },
                {
                  icon: <Clock className="h-5 w-5" />,
                  title: "Time-Bound Practice",
                  description: "Practice staying calm and articulate within 45-minute real interview timeframes",
                },
                {
                  icon: <Users className="h-5 w-5" />,
                  title: "Real Scorecards",
                  description: "Get a detailed scorecard after every session highlighting strengths and areas to improve",
                },
                {
                  icon: <Flame className="h-5 w-5" />,
                  title: "High Standards",
                  description: "Mentors are placed professionals from top tech companies (FAANG and startups)",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: C.border,
                    background: C.white,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: C.orangeLight,
                        color: C.orange,
                      }}
                    >
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: C.ink }}>
                        {benefit.title}
                      </h4>
                      <p className="text-sm mt-1" style={{ color: C.muted }}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 md:p-8 text-center"
            style={{
              borderColor: "rgba(245,158,11,0.2)",
              background: C.orangeLight,
            }}
          >
            <h3 className="text-2xl font-bold mb-2" style={{ color: C.ink }}>
              Ready to get grilled?
            </h3>
            <p className="mb-4" style={{ color: C.muted }}>
              Book your first grill session and get real feedback from a professional.
            </p>
            <button
              onClick={() => navigate("/teachers")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition hover:brightness-110"
              style={{ background: C.orange }}
            >
              <Flame className="h-5 w-5" />
              Book Your First Grill
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
}
