import { Plus, Edit, Trash2, Eye, Users } from 'lucide-react';

const roadmaps = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    description: 'Complete path from frontend to backend development',
    students: 342,
    price: '$49',
    status: 'published',
    modules: 24,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'React & TypeScript Mastery',
    description: 'Advanced React patterns with TypeScript',
    students: 218,
    price: '$39',
    status: 'published',
    modules: 18,
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Python Data Science Path',
    description: 'From basics to machine learning',
    students: 186,
    price: '$59',
    status: 'published',
    modules: 32,
    rating: 4.7,
  },
  {
    id: 4,
    title: 'Mobile App Development',
    description: 'Build apps with React Native',
    students: 124,
    price: '$44',
    status: 'published',
    modules: 20,
    rating: 4.6,
  },
  {
    id: 5,
    title: 'DevOps Fundamentals',
    description: 'CI/CD, Docker, Kubernetes and more',
    students: 0,
    price: '$54',
    status: 'draft',
    modules: 16,
    rating: 0,
  },
];

export function MyRoadmaps() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Roadmaps</h2>
          <p className="text-gray-600 mt-2">Create and manage your learning paths</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-5 h-5" />
          Create Roadmap
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{roadmap.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{roadmap.description}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    roadmap.status === 'published'
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
                  {roadmap.students} students
                </span>
                <span>{roadmap.modules} modules</span>
                {roadmap.rating > 0 && <span>⭐ {roadmap.rating}</span>}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xl font-bold text-purple-600">{roadmap.price}</span>
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
    </div>
  );
}
