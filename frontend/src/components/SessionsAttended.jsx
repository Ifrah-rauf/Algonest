import { apiUrl } from "../config/api.js";
import { Video, Calendar, User } from 'lucide-react';
import {useAuth} from "../context/AuthContext";
import {useState,useEffect} from "react"

function formatDbDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SessionsAttended() {
  const [sessionHistory, setSessionHistory] = useState([]);
  const [historyStatus, setHistoryStatus] = useState("LOADING"); 
// LOADING | SUCCESS | EMPTY | ERROR
  const { user} = useAuth();
  useEffect(() => {
    if (!user) {
          window.location.href = "/login";   // optional redirect
          return;
      }
    fetchSessionHistory();
  }, []);
 async function fetchSessionHistory() {
  try {
    const uid = user?.uid;
    if (!uid) return;

    const response = await fetch(apiUrl("/api/session/getSessionHistory"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid })
    });

    const result = await response.json();
    console.log("Session history response:", result);

    const sessions = result?.data?.session || [];

    setSessionHistory(sessions);

  } catch (error) {
    console.error("Failed to fetch session history:", error);
    setSessionHistory([]);
  }
}

const sessions = sessionHistory;


  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-gray-900">
      Sessions Attended
    </h2>

    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
      {sessions?.length || 0} Total
    </div>
  </div>

  {/* Body */}
  <div className="space-y-3">

    {sessions && sessions.length === 0 && (
      <p className="text-gray-500 text-sm">No sessions attended yet.</p>
    )}

    {sessions?.map((session) => {

      const formattedDate = formatDbDateTime(session.start_time);
      const durationText = session.duration
        ? `${session.duration} mins`
        : "—";

      const statusColor =
        session.status === "BOOKED"
          ? "bg-blue-100 text-blue-700"
          : session.status === "LIVE"
          ? "bg-green-100 text-green-700"
          : session.status === "ENDED_PENDING_UPLOAD"
          ? "bg-amber-100 text-amber-700"
          : session.status === "UPLOAD_RECEIVED"
          ? "bg-purple-100 text-purple-700"
          : session.status === "PROCESSING"
          ? "bg-indigo-100 text-indigo-700"
          : session.status === "COMPLETED"
          ? "bg-emerald-100 text-emerald-700"
          : session.status === "FAILED"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-600";

      return (
        <div
          key={session.session_id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
        >

          {/* Top Row */}
          <div className="flex items-start justify-between mb-2">

            <div className="flex items-start space-x-3">

              <div className="p-2 rounded-lg bg-purple-100">
                <Video className="text-purple-600" size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {session.title || "AlgoNest Session"}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {session.status}
            </span>

          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between text-sm mt-3">

            <div className="text-gray-600">
              Duration: {durationText}
            </div>

            {session.feedback && (
              <span className="text-purple-600 font-medium">
                Feedback Available
              </span>
            )}

          </div>
        </div>
      );
    })}

  </div>
</div>
  );
}
