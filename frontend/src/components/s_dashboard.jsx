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

function ExecutionTimelineStrip() {
  const steps = [
    {
      step: "01",
      title: "Project Roadmaps",
      text: "Build the project first so the rest of the system has something real to defend.",
      color: "#0ea5e9",
    },
    {
      step: "02",
      title: "CS Fundamentals",
      text: "Lock the core subjects so your explanation stays steady under pressure.",
      color: "#7c3aed",
    },
    {
      step: "03",
      title: "Grill Sessions",
      text: "Pressure-test the work with a professional who asks like an interviewer.",
      color: "#f59e0b",
    },
  ];

  return (
    <section className="mb-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-600">
            Execution timeline
          </div>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            Project first, fundamentals second, grill last.
          </h3>
        </div>
        <p className="max-w-xl text-sm leading-7 text-gray-500">
          The order matters. Build the proof, lock the foundation, then pressure-test the story.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border p-4 shadow-[0_12px_30px_rgba(33,21,63,0.05)]"
            style={{
              borderColor: `${step.color}35`,
              background: `${step.color}0A`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full border-4 bg-white"
                style={{ borderColor: step.color }}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: step.color,
                    boxShadow: `0 0 0 10px ${step.color}22`,
                    animation: `nodePulse 2.2s ease-in-out infinite`,
                    animationDelay: `${index * 140}ms`,
                  }}
                />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: step.color }}>
                  {step.step}
                </div>
                <div className="text-lg font-bold text-gray-900">{step.title}</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full"
          style={{
            transformOrigin: "left",
            background: "linear-gradient(90deg, #0ea5e9 0%, #7c3aed 52%, #f59e0b 100%)",
            animation: "timelineFill 1.6s ease-out forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes timelineFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}

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
        <ExecutionTimelineStrip />

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
