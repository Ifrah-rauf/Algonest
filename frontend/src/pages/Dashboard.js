import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaCog,
  FaLifeRing,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import CourseOutline from "./CourseOutline.js";
import CourseCard from "../components/CourseCard";
import PastSessionBar from "../components/PastSessionBar";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [activeCourse, setActiveCourse] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* ================= LOAD DASHBOARD DATA ================= */
  useEffect(() => {
    if (!user?.uid) return;

    const firstName = user.username?.split(" ")[0] || "";
    setUsername(firstName);

    async function loadDashboard() {
      try {
        // 1️⃣ Active Course (non-expired booking)
        const courseRes = await fetch(`http://localhost:5000/api/dashboard/active-course/${user.uid}`);
        const courseJson = await courseRes.json();
        if (courseJson.success) {
          setActiveCourse(courseJson.course);
        }

        // 2️⃣ Session History (latest first)
        const sessionRes = await fetch(
          `http://localhost:5000/api/dashboard/sessions/${user.uid}`
        );
        const sessionJson = await sessionRes.json();
        if (sessionJson.success) {
          setSessionHistory(sessionJson.sessions || []);
        }
        
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }

    loadDashboard();
  }, [user]);

  
  /* ================= LOGOUT ================= */
  function handleLogout() {
    logout();
    navigate("/");
  }
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-1">
          <Link to="/">
            <span className="text-purple-600">Algo</span>
            <span className="text-yellow-400">Nest</span>
          </Link>
        </h2>

        <p className="text-sm text-gray-500 mb-8">Hello {username}</p>

        <ul className="space-y-2 text-gray-700 text-sm">
          {[
            { icon: <FaHome />, label: "Dashboard" },
            { icon: <FaBook />, label: "Courses" },
            { icon: <FaCog />, label: "Settings" },
            { icon: <FaLifeRing />, label: "Help Desk" },
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-purple-600 hover:text-white transition"
            >
              {item.icon}
              {item.label}
            </li>
          ))}

          <li
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-red-500 hover:text-white transition"
          >
            <FaSignOutAlt />
            Logout
          </li>
        </ul>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-64 flex-1 bg-[#2b2b2b] text-white min-h-screen px-8 py-10">
        {/* ================= COURSE OUTLINE ================= */}
        {activeCourse?.outline_id && (
          <div className="mb-10">
            <CourseOutline id={activeCourse.outline_id} />
          </div>
        )}

        {/* ================= ONGOING COURSE ================= */}
        {activeCourse && (
          <section className="bg-white text-black rounded-xl p-6 shadow mb-10">
            <h2 className="text-xl font-semibold mb-6">Ongoing Course</h2>

            <div className="max-w-sm max-h-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex flex-col justify-between">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{activeCourse.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{activeCourse.desc}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
                <div
                  className="bg-[#4B0082] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${    activeCourse.totalSessions > 0
                    ? Math.round(((activeCourse.totalSessions - activeCourse.remainingSessions) / activeCourse.totalSessions) * 100)
                    : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {    activeCourse.totalSessions > 0
                    ? Math.round(((activeCourse.totalSessions - activeCourse.remainingSessions) / activeCourse.totalSessions) * 100)
                    : 0}% Completed
                </span>
                <button className="h-5.5 bg-[#FFB800] hover:bg-[#ffcb3d] text-black font-small px-2 py-2 rounded-lg transition-all duration-300">
                  Go to Course
                </button>
              </div>
            </div>

          </section>
        )}

        {/* ================= SESSION HISTORY ================= */}
        <section className="bg-white text-black rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-6">Session History</h2>

          {sessionHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No sessions found.</p>
          ) : (
            <div className="space-y-4">
              {sessionHistory.map((s, i) => (
                <PastSessionBar
                  key={i}
                  sessionName={s.title}
                  mentor="Mentor"
                  completion={s.status === "completed" ? 100 : 0}
                  date={new Date(s.start_time).toLocaleString()}
                  link={s.meeting_link}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
