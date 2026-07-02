import { apiUrl } from "../config/api.js";
import { TrendingUp, Award, Target, Zap } from 'lucide-react';
import {useAuth} from "../context/AuthContext";
import {useState,useEffect} from "react"

const DISPLAY_TIME_ZONE = "Asia/Kolkata";

function formatDbDateTime(value) {
  if (!value) return "No scheduled session";

  const text = String(value).trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?(?:\s?(Z|[+-]\d{1,2}(?::?\d{2})?))?$/);
  const date = match
    ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6] || 0), 0))
    : new Date(text);

  if (Number.isNaN(date.getTime())) return "No scheduled session";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: DISPLAY_TIME_ZONE,
  });
}

export function ProgressOverview() {
  const [sessionInfo, setSessionInfo] = useState({
    status: "LOADING",
    session: null,
    label: "Checking session..."
  });
  const { user} = useAuth();
  useEffect(() => {
      if (!user) {
        window.location.href = "/login";   // optional redirect
        return;
    }
    checkSession();
  }, []);

  const stats = [
    {
      id: '1',
      label: 'Overall Progress',
      value: '68%',
      change: '+12%',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      id: '4',
      label: 'Lessons Completed',
      value: '8/12',
      change: '4 remaining',
      icon: Target,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];
async function checkSession() {
  try {
    const uid = user?.uid;
    if (!uid) return;

    const sessionRes = await fetch(apiUrl("/api/session/check"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid })
    });

    const sessionData = await sessionRes.json();
    console.log("got sessionData: ",sessionData);
    console.log("exists value:", sessionData.exists);
    if (!sessionData.data.session) {
      console.log("error sessionData not exists");
      setSessionInfo({
        status: "NONE",
        session: null,
        label: "No Active Session"
      });
      return;
    }

    const state = sessionData.data.state;
    const session = sessionData.data.session;
    console.log("state and session and time: ",state,session,session.start_time);
    setSessionInfo({
      status: state,
      session,
      label:
        state === "ACTIVE"
          ? "Live Now"
          : state === "UPCOMING"
          ? "Upcoming Session"
          : state === "PENDING_UPLOAD"
          ? "Awaiting Upload"
          : state === "UPLOAD_RECEIVED"
          ? "Upload Received"
          : state === "PROCESSING"
          ? "Processing"
          : state === "COMPLETED"
          ? "Completed"
          : state === "FAILED"
          ? "Processing Failed"
          : "Session Ended"
    });

  } catch (error) {
    console.error("Session check failed:", error);
    setSessionInfo({
      status: "ERROR",
      session: null,
      label: "Error loading session"
    });
  }
}


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">

      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        
        {/* Status Icon Block */}
        <div className={`p-3 rounded-lg 
          ${sessionInfo.status === "ACTIVE" ? "bg-green-100" :
            sessionInfo.status === "UPCOMING" ? "bg-blue-100" :
            sessionInfo.status === "PENDING_UPLOAD" ? "bg-amber-100" :
            sessionInfo.status === "UPLOAD_RECEIVED" ? "bg-purple-100" :
            sessionInfo.status === "PROCESSING" ? "bg-indigo-100" :
            sessionInfo.status === "COMPLETED" ? "bg-emerald-100" :
            sessionInfo.status === "FAILED" ? "bg-red-100" :
            "bg-gray-100"}`}>
          
          <div className={`w-3 h-3 rounded-full 
            ${sessionInfo.status === "ACTIVE" ? "bg-green-500 animate-pulse" :
              sessionInfo.status === "UPCOMING" ? "bg-blue-500" :
              sessionInfo.status === "PENDING_UPLOAD" ? "bg-amber-500" :
              sessionInfo.status === "UPLOAD_RECEIVED" ? "bg-purple-500" :
              sessionInfo.status === "PROCESSING" ? "bg-indigo-500 animate-pulse" :
              sessionInfo.status === "COMPLETED" ? "bg-emerald-500" :
              sessionInfo.status === "FAILED" ? "bg-red-500" :
              "bg-gray-300"}`}>
          </div>
        </div>

        {/* Badge */}
        <span className={`text-xs font-medium px-2 py-1 rounded-full
          ${sessionInfo.status === "ACTIVE" ? "bg-green-100 text-green-700" :
            sessionInfo.status === "UPCOMING" ? "bg-blue-100 text-blue-700" :
            sessionInfo.status === "PENDING_UPLOAD" ? "bg-amber-100 text-amber-700" :
            sessionInfo.status === "UPLOAD_RECEIVED" ? "bg-purple-100 text-purple-700" :
            sessionInfo.status === "PROCESSING" ? "bg-indigo-100 text-indigo-700" :
            sessionInfo.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
            sessionInfo.status === "FAILED" ? "bg-red-100 text-red-700" :
            "bg-gray-200 text-gray-600"}`}>
          {sessionInfo.label || "No Session"}
        </span>

      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {sessionInfo.session?.title || "Upcoming Session"}
      </h3>

      {/* Time */}
      <p className="text-sm text-gray-600 mb-4">
        {sessionInfo.session?.start_time
          ? formatDbDateTime(sessionInfo.session.start_time)
          : "No scheduled session"}
      </p>

      {/* Action Button */}
      <button
        onClick={() => {
          if (sessionInfo.status === "ACTIVE" && sessionInfo.session?.join_url) {
            window.location.href = sessionInfo.session.join_url;
          }
        }}
        disabled={sessionInfo.status !== "ACTIVE"}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors
          ${sessionInfo.status === "ACTIVE"
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}>

        {sessionInfo.status === "ACTIVE"
          ? "Join Class"
          : sessionInfo.status === "UPCOMING"
          ? "Session Not Started"
          : sessionInfo.status === "PENDING_UPLOAD"
          ? "Awaiting Upload"
          : sessionInfo.status === "UPLOAD_RECEIVED"
          ? "Upload Received"
          : sessionInfo.status === "PROCESSING"
          ? "Processing"
          : sessionInfo.status === "COMPLETED"
          ? "Completed"
          : sessionInfo.status === "FAILED"
          ? "Processing Failed"
          : "No Session Available"}
      </button>


    </div>

      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={stat.textColor} size={24} />
              </div>
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
