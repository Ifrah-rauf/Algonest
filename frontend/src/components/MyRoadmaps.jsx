import { apiUrl } from "../config/api.js";
import { Plus, Edit, Trash2, Eye, Users, FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/navbar";

export default function MyRoadmaps() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmaps() {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const res = await fetch(apiUrl("/api/teachers/courses"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        const body = await res.json();

        if (body.success) {
          setRoadmaps(body.data || []);
        }
      } catch (error) {
        console.error("Failed to load teacher courses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRoadmaps();
  }, [user?.uid]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-between mb-8 p-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Roadmaps</h2>
          <p className="text-gray-600 mt-2">Courses you actively teach</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-3 py-3 rounded-lg hover:bg-purple-700 transition-colors m-2">
          <Plus className="w-5 h-5" />
          Create Roadmap
        </button>
      </div>

      {loading ? (
        <div className="px-8 text-gray-500">Loading roadmaps...</div>
      ) : roadmaps.length === 0 ? (
        <div className="px-8 text-gray-500 flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          No mapped courses yet.
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 pb-8">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.mapping_id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{roadmap.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{roadmap.description || "Course mapped from your dashboard."}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    roadmap.status === 'published' || roadmap.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {roadmap.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {roadmap.domain || "Mapped course"}
                </span>
                <span>{roadmap.status}</span>
                <span>#{roadmap.course_id}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xl font-bold text-purple-600">Mapped</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
