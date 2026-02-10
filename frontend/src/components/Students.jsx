import { Search, MoreVertical, Mail, TrendingUp, TrendingDown } from 'lucide-react';

const students = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    roadmap: 'Full Stack Web Development',
    progress: 85,
    lastActive: '2 hours ago',
    trend: 'up',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'mchen@email.com',
    roadmap: 'React & TypeScript Mastery',
    progress: 92,
    lastActive: '5 hours ago',
    trend: 'up',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    roadmap: 'Python Data Science Path',
    progress: 45,
    lastActive: '1 day ago',
    trend: 'down',
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'jwilson@email.com',
    roadmap: 'Mobile App Development',
    progress: 100,
    lastActive: '3 hours ago',
    trend: 'up',
  },
  {
    id: 5,
    name: 'Olivia Brown',
    email: 'olivia.b@email.com',
    roadmap: 'Full Stack Web Development',
    progress: 68,
    lastActive: '6 hours ago',
    trend: 'up',
  },
  {
    id: 6,
    name: 'Daniel Kim',
    email: 'dkim@email.com',
    roadmap: 'React & TypeScript Mastery',
    progress: 34,
    lastActive: '2 days ago',
    trend: 'down',
  },
  {
    id: 7,
    name: 'Sophia Martinez',
    email: 'sophia.m@email.com',
    roadmap: 'Python Data Science Path',
    progress: 78,
    lastActive: '4 hours ago',
    trend: 'up',
  },
  {
    id: 8,
    name: 'Liam Taylor',
    email: 'ltaylor@email.com',
    roadmap: 'Mobile App Development',
    progress: 56,
    lastActive: '8 hours ago',
    trend: 'up',
  },
];

export function Students() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Students</h2>
        <p className="text-gray-600 mt-2">Manage and track student progress</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option>All Roadmaps</option>
              <option>Full Stack Web Development</option>
              <option>React & TypeScript Mastery</option>
              <option>Python Data Science Path</option>
              <option>Mobile App Development</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Roadmap
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.roadmap}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            student.progress === 100
                              ? 'bg-green-500'
                              : student.progress >= 70
                              ? 'bg-purple-600'
                              : student.progress >= 40
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                          }`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 min-w-[3rem]">{student.progress}%</span>
                      {student.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
