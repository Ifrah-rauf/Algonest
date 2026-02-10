import { CheckCircle, Circle, Clock } from "lucide-react";

export default function PlanRoadmap() {
  const milestones = [
    {
      id: "1",
      title: "Foundation",
      status: "completed",
      date: "Oct 2025",
      modules: 8,
      completedModules: 8,
    },
    {
      id: "2",
      title: "Intermediate",
      status: "in-progress",
      date: "Now",
      modules: 12,
      completedModules: 7,
    },
    {
      id: "3",
      title: "Advanced",
      status: "upcoming",
      date: "Mar 2026",
      modules: 10,
      completedModules: 0,
    },
    {
      id: "4",
      title: "Expert",
      status: "upcoming",
      date: "May 2026",
      modules: 15,
      completedModules: 0,
    },
    {
      id: "5",
      title: "Interview",
      status: "upcoming",
      date: "Jun 2026",
      modules: 6,
      completedModules: 0,
    },
    {
      id: "6",
      title: "Final Review",
      status: "upcoming",
      date: "Jul 2026",
      modules: 4,
      completedModules: 0,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Learning Roadmap
      </h2>

      {/* HORIZONTAL TRACK */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[900px]">

          {/* LINE */}
          <div className="absolute top-6 left-0 right-0 h-[2px] bg-gray-200" />

          {/* NODES */}
          <div className="grid grid-cols-6 gap-6 relative">
            {milestones.map((m) => (
              <div key={m.id} className="flex flex-col items-center text-center">

                {/* CIRCLE */}
                <div className="relative z-10 mb-4">
                  {m.status === "completed" ? (
                    <CheckCircle className="text-purple-600 bg-white rounded-full" size={28} />
                  ) : m.status === "in-progress" ? (
                    <Clock className="text-yellow-500 bg-white rounded-full" size={28} />
                  ) : (
                    <Circle className="text-gray-400 bg-white rounded-full" size={28} />
                  )}
                </div>

                {/* DETAILS */}
                <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-gray-900 mb-1">
                    {m.title}
                  </p>

                  <p className="text-xs text-gray-500 mb-2">
                    {m.date}
                  </p>

                  <p className="text-xs text-gray-600 mb-2">
                    {m.completedModules}/{m.modules} modules
                  </p>

                  {/* PROGRESS */}
                  <div className="w-full h-1.5 bg-gray-200 rounded-full">
                    <div
                      className={`h-1.5 rounded-full ${
                        m.status === "completed"
                          ? "bg-purple-600"
                          : m.status === "in-progress"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                      style={{
                        width: `${(m.completedModules / m.modules) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
