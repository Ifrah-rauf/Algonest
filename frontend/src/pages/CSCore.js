import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ComingSoon from "../components/comingsoon.jsx";
const C = {
  purple: "#6b46c1",
  purpleDark: "#4c1d95",
  purpleLight: "#f3eeff",
  ink: "#21153f",
  muted: "#766f8e",
  border: "#e8e1f5",
  bg: "#faf8ff",
  white: "#ffffff",
};

export default function CSCore() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <ComingSoon />

      {/* <div className="min-h-screen" style={{ background: C.bg }}>
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/")}
              className="p-2 rounded-lg transition hover:bg-gray-100"
              style={{ color: C.purple }}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold md:text-4xl" style={{ color: C.ink }}>
                CS Core Fundamentals
              </h1>
              <p className="mt-1 text-sm" style={{ color: C.muted }}>
                Master Data Structures, Algorithms, DBMS, OS, and DCCN
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div
              className="lg:col-span-3 rounded-2xl border p-6 md:p-8"
              style={{
                background: `linear-gradient(135deg, ${C.purpleDark}, ${C.purple})`,
                borderColor: "rgba(107,70,193,0.3)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="h-14 w-14 rounded-lg flex items-center justify-center text-white"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Structured Learning Path</h2>
                  <p className="text-white/80">
                    Comprehensive curriculum covering all fundamental computer science concepts you need to master for interviews and technical roles.
                  </p>
                </div>
              </div>
            </div>

            {[
              {
                title: "Data Structures",
                icon: "📊",
                description: "Arrays, Linked Lists, Trees, Graphs, Heaps, and Hash Tables",
              },
              {
                title: "Algorithms",
                icon: "⚙️",
                description: "Sorting, Searching, Dynamic Programming, and Graph Algorithms",
              },
              {
                title: "Database Management",
                icon: "🗄️",
                description: "DBMS concepts, SQL, Normalization, and Query Optimization",
              },
              {
                title: "Operating Systems",
                icon: "🔧",
                description: "Processes, Threads, Memory Management, and Scheduling",
              },
              {
                title: "Computer Networks",
                icon: "🌐",
                description: "DCCN, OSI Model, TCP/IP, and Network Protocols",
              },
              {
                title: "System Design",
                icon: "🏗️",
                description: "Scalability, Databases, Caching, and Microservices",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="rounded-2xl border p-6 cursor-pointer transition hover:shadow-lg hover:translate-y-[-2px]"
                style={{
                  borderColor: C.border,
                  background: C.white,
                }}
              >
                <div className="text-4xl mb-3">{course.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: C.ink }}>
                  {course.title}
                </h3>
                <p className="text-sm" style={{ color: C.muted }}>
                  {course.description}
                </p>
                <button
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition"
                  style={{ color: C.purple, background: "rgba(107,70,193,0.1)" }}
                >
                  Start Learning →
                </button>
              </div>
            ))}
          </div>

          <div
            className="mt-8 rounded-2xl border p-6"
            style={{
              borderColor: "rgba(107,70,193,0.2)",
              background: C.purpleLight,
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: C.purple }}>
              💡 Tip
            </h3>
            <p style={{ color: C.ink }}>
              Complete these fundamentals in order and revise regularly. Most interviews deep-dive into one or two of these areas, but understanding all of them makes you a well-rounded engineer.
            </p>
          </div>
        </div>
      </div> */}
      </div>
  );
}
