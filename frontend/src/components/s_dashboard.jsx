import { DashboardHeader } from '../components/DashboardHeader';
import { ProgressOverview } from '../components/ProgressOverview';
import { OngoingPlan } from '../components/OngoingPlan';
import  PlanRoadmap  from '../components/PlanRoadmap';
import { SessionsAttended } from '../components/SessionsAttended';
import { NotesAttached } from '../components/NotesAttached';
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div>
      <main className="px-6 py-8 max-w-7xl mx-auto">
              <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h2>
        <div className='flex justify-between align-start max-w-full'>
          <p className="text-gray-600 mt-2">Here's what's happening with your progress today.</p>
          <button onClick={handleLogout} className="w-[6%] text-center py-2 rounded-lg text-gray-700 hover:bg-red-500 hover:text-white transition-colors ">
            <span className="text-sm">Logout</span>
          </button>
        </div>
        
      </div>
        {/* Progress Overview Stats */}
        <ProgressOverview />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ongoing Plan and Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <OngoingPlan />
            <PlanRoadmap />
            <SessionsAttended />
          </div>

          {/* Right Column - Sessions and Notes */}
          <div className="space-y-6">
            <NotesAttached />
          </div>
          
        </div>
      </main>
    </div>
  );
}
