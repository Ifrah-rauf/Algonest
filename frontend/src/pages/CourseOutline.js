import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function CourseOutline() {
  const { id } = useParams();
  const [outline, setOutline] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [remSessions, setRemSessions] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/plans/course-outline/${id}`);
        const json = await res.json();

        if (!active) return;

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Could not load course outline.");
        }

        setOutline(json.outline || null);
        setSessions(json.sessions || []);
        setAttachments(json.attachments || []);
        setTotalSessions(json.totalSessions || 0);
        setRemSessions(json.remSessions || 0);
      } catch (err) {
        if (active) setError(err.message || "Could not load course outline.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [id]);

  const progressPercent =
    totalSessions > 0
      ? Math.round(((totalSessions - remSessions) / totalSessions) * 100)
      : 0;

  const points = useMemo(() => {
    const width = 900;
    const height = 100;
    const margin = 60;

    if (totalSessions <= 1) {
      return [{ x: width / 2, y: height / 2 }];
    }

    const step = (width - margin * 2) / (totalSessions - 1);
    return Array.from({ length: totalSessions }).map((_, i) => ({
      x: margin + i * step,
      y: height / 2 + Math.sin(i * 0.8) * 18,
    }));
  }, [totalSessions]);

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;

    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-purple-700">Loading course outline...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Course outline unavailable</h1>
          <p className="mt-3 text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-700">
            Active plan
          </p>
          <h1 className="mt-3 text-3xl font-black text-gray-900">
            {outline?.title || "Course Outline"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{outline?.plan_name}</p>
        </div>

        <div className="mt-10 w-full">
          <svg
            viewBox="0 0 900 100"
            width="100%"
            height="100"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: "visible" }}
          >
            <path
              d={pathD}
              stroke="#c4b5fd"
              strokeWidth={4}
              fill="none"
              strokeDasharray="6 8"
            />

            {points.map((p, i) => {
              const isActive = i < sessions.length;
              const isNext = i === sessions.length;
              const color = isActive ? "#8b5cf6" : isNext ? "#facc15" : "#d1d5db";

              return (
                <motion.circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={8}
                  fill={color}
                  stroke={isActive ? "#6d28d9" : "#9ca3af"}
                  strokeWidth={2}
                  style={{ cursor: isActive ? "pointer" : "not-allowed" }}
                  whileHover={isActive ? { scale: 1.25 } : {}}
                  onMouseEnter={
                    isActive
                      ? (e) => {
                          setHovered(sessions[i]);
                          setHoverPos({ x: e.clientX, y: e.clientY });
                        }
                      : undefined
                  }
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 rounded bg-gray-200">
              <div
                className="h-2 rounded bg-purple-600"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {progressPercent}% completed
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-8 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-gray-800">
            {sessions.length} / {totalSessions} Sessions - {attachments.length} attachments
          </div>

          <div className="space-y-8">
            {sessions.length === 0 ? (
              <p className="text-gray-500">No completed sessions yet.</p>
            ) : (
              sessions.map((session, index) => (
                <div key={session.session_id || index} className="relative">
                  <div className="flex items-start gap-6">
                    <div className="min-w-24 font-semibold text-gray-900">
                      Session {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">
                        {session.title || "Untitled session"}
                      </p>
                      {session.start_time && (
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(session.start_time).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {index !== sessions.length - 1 && (
                    <div className="ml-12 mt-2 h-8 w-24 rounded-bl-3xl border-b-4 border-l-4 border-purple-300" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="rounded-2xl bg-gray-900 p-8 text-white shadow-sm">
          <h2 className="text-2xl font-bold">Attachments</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {attachments.length === 0 ? (
              <p className="col-span-2 text-sm text-gray-300">No attachments yet.</p>
            ) : (
              attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.attachment}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-white/10 p-4 text-center transition hover:bg-white/15"
                >
                  <div className="mb-2 text-3xl" aria-hidden="true">
                    File
                  </div>
                  <p className="text-xs text-gray-200">{attachment.title || "Notes"}</p>
                </a>
              ))
            )}
          </div>
        </aside>
      </section>

      {hovered && (
        <div
          className="fixed z-50 w-64 rounded-lg bg-white p-3 shadow-lg"
          style={{
            top: hoverPos.y - 150,
            left: hoverPos.x - 120,
          }}
        >
          <h4 className="text-sm font-semibold">{hovered.title || "Session"}</h4>
          {hovered.start_time && (
            <p className="text-sm text-gray-500">
              {new Date(hovered.start_time).toLocaleString()}
            </p>
          )}
          <p className="text-sm text-gray-500">
            <b>Mentor</b>: {hovered.mentor?.name || "TBD"}
          </p>
        </div>
      )}
    </main>
  );
}
