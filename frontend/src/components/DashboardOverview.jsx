import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { RecentActivity } from './RecentActivity';
import { ActiveRoadmaps } from './ActiveRoadmaps';
import { useAuth } from '../context/AuthContext';
import {useState , useEffect} from "react"; 
export function DashboardOverview() {
  const {user} = useAuth();
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
    checkSession();
  }, []);
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
        state === "VALID"
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
        <p className="text-gray-600 mt-2">Here's what's happening with your courses today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-8">
        <div>
         <div className="flex items-start justify-between mb-4">
            {/* Status Icon Block */}
            <div className={`p-3 rounded-lg 
              ${sessionInfo.status === "VALID" ? "bg-green-100" :
                sessionInfo.status === "UPCOMING" ? "bg-blue-100" :
                sessionInfo.status === "EXPIRED" ? "bg-gray-100" :
                "bg-gray-100"}`}>
              
              <div className={`w-3 h-3 rounded-full 
                ${sessionInfo.status === "VALID" ? "bg-green-500 animate-pulse" :
                  sessionInfo.status === "UPCOMING" ? "bg-blue-500" :
                  sessionInfo.status === "EXPIRED" ? "bg-gray-400" :
                  "bg-gray-300"}`}>
              </div>
            </div>

            {/* Badge */}
            <span className={`text-xs font-medium px-2 py-1 rounded-full
              ${sessionInfo.status === "VALID" ? "bg-green-100 text-green-700" :
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
              if (sessionInfo.status === "VALID" && sessionInfo.session?.join_url) {
                window.location.href = sessionInfo.session.join_url;
              }
            }}
            disabled={sessionInfo.status !== "VALID"}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors
              ${sessionInfo.status === "VALID"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}>

            {sessionInfo.status === "VALID"
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
          value="1,248"
          change="+12%"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Active Roadmaps"
          value="18"
          change="+3"
          icon={BookOpen}
          color="yellow"
        />
        <StatCard
          title="Monthly Earnings"
          value="$8,450"
          change="+23%"
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Completion Rate"
          value="78%"
          change="+5%"
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveRoadmaps />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
