import { MoreVertical, Users } from 'lucide-react';

const roadmaps = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    students: 342,
    progress: 68,
    status: 'active',
    earnings: '$2,450',
  },
  {
    id: 2,
    title: 'React & TypeScript Mastery',
    students: 218,
    progress: 82,
    status: 'active',
    earnings: '$1,890',
  },
  {
    id: 3,
    title: 'Python Data Science Path',
    students: 186,
    progress: 45,
    status: 'active',
    earnings: '$1,620',
  },
  {
    id: 4,
    title: 'Mobile App Development',
    students: 124,
    progress: 92,
    status: 'active',
    earnings: '$1,080',
  },
];

export function ActiveRoadmaps() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Active Roadmaps</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{roadmap.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {roadmap.students} students
                    </span>
                    <span className="text-yellow-600 font-semibold">{roadmap.earnings}</span>
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
                    style={{ width: `${roadmap.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 min-w-[3rem]">{roadmap.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
