import { MoreVertical, Users, FolderOpen, CheckCircle2, Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function RoadmapCard({ roadmap, variant = "active" }) {
  const accent = variant === "completed" ? "green" : "purple";
  const badgeClass =
    variant === "completed"
      ? "bg-green-100 text-green-700"
      : "bg-purple-100 text-purple-700";

  return (
    <div
      className={`border rounded-xl p-4 transition-colors ${
        variant === "completed"
          ? "border-green-200 hover:border-green-300"
          : "border-gray-200 hover:border-purple-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-semibold text-gray-900">{roadmap.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{roadmap.domain || "Mapped roadmap"}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeClass}`}>
          {variant === "completed" ? "Completed" : "In progress"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-gray-500 text-xs">Students</p>
          <p className="font-semibold text-gray-900">{roadmap.totalStudents}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-gray-500 text-xs">Active</p>
          <p className="font-semibold text-gray-900">{roadmap.activeStudents}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-gray-500 text-xs">Completed</p>
          <p className="font-semibold text-gray-900">{roadmap.completedStudents}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full ${
              variant === "completed" ? "bg-green-500" : "bg-purple-600"
            }`}
            style={{ width: `${Math.min(roadmap.averageProgress || 0, 100)}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
          {roadmap.averageProgress || 0}%
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-2">
            Students in progress
          </p>
          <div className="flex flex-wrap gap-2">
            {roadmap.students
              .filter((student) => student.status === "active")
              .slice(0, 4)
              .map((student) => (
                <span
                  key={`${roadmap.courseId}-active-${student.s_id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
                >
                  <Clock3 className="w-3 h-3" />
                  {student.studentName} {student.progressPct}%
                </span>
              ))}
            {!roadmap.students.some((student) => student.status === "active") && (
              <span className="text-xs text-gray-500">No active students right now.</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-2">
            Completed students
          </p>
          <div className="flex flex-wrap gap-2">
            {roadmap.students
              .filter((student) => student.status === "completed")
              .slice(0, 4)
              .map((student) => (
                <span
                  key={`${roadmap.courseId}-completed-${student.s_id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {student.studentName}
                </span>
              ))}
            {!roadmap.students.some((student) => student.status === "completed") && (
              <span className="text-xs text-gray-500">No completed students yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActiveRoadmaps({ roadmapProgress = null }) {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roadmapProgress) {
      setRoadmaps([]);
      setLoading(false);
      return;
    }

    async function loadRoadmaps() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/teachers/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        const body = await res.json();
        if (body.success) {
          setRoadmaps(body.data || []);
        }
      } catch (error) {
        console.error("Failed to load active roadmaps:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRoadmaps();
  }, [user?.uid, roadmapProgress]);

  const activeRoadmaps = roadmapProgress?.active || [];
  const completedRoadmaps = roadmapProgress?.completed || [];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Roadmap Progress</h3>
      </div>
      <div className="p-6">
        {roadmapProgress ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Active roadmaps
                </h4>
                <span className="text-xs text-gray-500">{activeRoadmaps.length} live</span>
              </div>
              {activeRoadmaps.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FolderOpen className="w-4 h-4" />
                  No active roadmap progress yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRoadmaps.map((roadmap) => (
                    <RoadmapCard key={roadmap.courseId} roadmap={roadmap} variant="active" />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Completed roadmaps
                </h4>
                <span className="text-xs text-gray-500">{completedRoadmaps.length} finished</span>
              </div>
              {completedRoadmaps.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4" />
                  No completed roadmaps yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {completedRoadmaps.map((roadmap) => (
                    <RoadmapCard key={roadmap.courseId} roadmap={roadmap} variant="completed" />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : loading ? (
          <div className="text-sm text-gray-500">Loading mapped courses...</div>
        ) : roadmaps.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FolderOpen className="w-4 h-4" />
            No mapped courses available.
          </div>
        ) : (
          <div className="space-y-4">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.mapping_id}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{roadmap.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {roadmap.domain || "Mapped course"}
                      </span>
                      <span className="text-yellow-600 font-semibold">{roadmap.status}</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 min-w-[3rem]">Mapped</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
