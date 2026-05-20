import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { ActiveRoadmaps } from './ActiveRoadmaps';
import { useAuth } from '../context/AuthContext';
import {useState , useEffect} from "react"; 
export function DashboardOverview() {
  const {user} = useAuth();
  const [summary, setSummary] = useState(null);
    const [sessionInfo, setSessionInfo] = useState({
    status: "LOADING",
    session: null,
    label: "Checking session..."
  });
  useEffect(() => {
      if (!user) {
        window.location.href = "/login";   // optional redirect
        return;
    }
    loadSummary();
    checkSession();
  }, [user?.uid]);

async function loadSummary() {
  try {
    const uid = user?.uid;
    if (!uid) return;

    const res = await fetch("http://localhost:5000/api/teachers/overview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid })
    });
    const body = await res.json();

    if (body.success) {
      setSummary(body.data);
    }
  } catch (error) {
    console.error("Overview load failed:", error);
  }
}

async function checkSession() {
  try {
    const uid = user?.uid;
    if (!uid) return;

    const sessionRes = await fetch("http://localhost:5000/api/session/checkTsession", {
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
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Professor {user.username}!</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your assessment rooms today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-8">
        <div>
         <div className="flex items-start justify-between mb-4">
            {/* Status Icon Block */}
            <div className={`p-3 rounded-lg 
              ${sessionInfo.status === "ACTIVE" ? "bg-green-100" :
                sessionInfo.status === "UPCOMING" ? "bg-blue-100" :
                sessionInfo.status === "EXPIRED" ? "bg-gray-100" :
                "bg-gray-100"}`}>
              
              <div className={`w-3 h-3 rounded-full 
                ${sessionInfo.status === "ACTIVE" ? "bg-green-500 animate-pulse" :
                  sessionInfo.status === "UPCOMING" ? "bg-blue-500" :
                  sessionInfo.status === "EXPIRED" ? "bg-gray-400" :
                  "bg-gray-300"}`}>
              </div>
            </div>

            {/* Badge */}
            <span className={`text-xs font-medium px-2 py-1 rounded-full
              ${sessionInfo.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                sessionInfo.status === "UPCOMING" ? "bg-blue-100 text-blue-700" :
                sessionInfo.status === "EXPIRED" ? "bg-gray-200 text-gray-600" :
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
            {sessionInfo.session?.start_time || "Upcoming Session"}
            {/* {sessionInfo.session?.start_time
              ? new Date(sessionInfo.session.start_time).toLocaleString()
              : "No scheduled session"} */}
          </p>

          {/* Action Button */}
          <button
            onClick={() => {
              const joinLink = sessionInfo.session?.join_url || sessionInfo.session?.session_link;
              if (sessionInfo.status === "ACTIVE" && joinLink) {
                window.location.href = joinLink;
              }
            }}
            disabled={sessionInfo.status !== "ACTIVE" || !(sessionInfo.session?.join_url || sessionInfo.session?.session_link)}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors
              ${sessionInfo.status === "ACTIVE"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}>

            {sessionInfo.status === "ACTIVE"
              ? "Join Class"
              : sessionInfo.status === "UPCOMING"
              ? "Session Not Started"
              : sessionInfo.status === "EXPIRED"
              ? "Session Ended"
              : "No Session Available"}
          </button>
        </div>
        <StatCard
          title="Total Students"
          value={summary?.metrics?.totalStudents ? String(summary.metrics.totalStudents) : "0"}
          change={summary?.metrics?.currentMonthBookings ? `+${summary.metrics.currentMonthBookings}` : "0"}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Active Roadmaps"
          value={summary?.metrics?.activeRoadmaps ? String(summary.metrics.activeRoadmaps) : "0"}
          change={summary?.highlights?.monthLabel || "This month"}
          icon={BookOpen}
          color="yellow"
        />
        <StatCard
          title="Monthly Earnings"
          value={`₹${(summary?.metrics?.monthlyEarnings || 0).toLocaleString("en-IN")}`}
          change={summary?.metrics?.previousMonthEarnings
            ? `${summary.metrics.monthlyEarnings >= summary.metrics.previousMonthEarnings ? "+" : "-"}${Math.abs(Math.round(((summary.metrics.monthlyEarnings - summary.metrics.previousMonthEarnings) / summary.metrics.previousMonthEarnings) * 100))}%`
            : "This month"}
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Completion Rate"
          value={`${summary?.metrics?.completionRate || 0}%`}
          change={summary?.metrics?.completedSessions ? `${summary.metrics.completedSessions} completed` : "0 completed"}
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-3">
          <ActiveRoadmaps roadmapProgress={summary?.roadmapProgress || null} />
        </div>
      </div>
    </div>
  );
}
