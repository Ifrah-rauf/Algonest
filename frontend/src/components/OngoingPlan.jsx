import { BookOpen, Clock } from 'lucide-react';
export function OngoingPlan() {
  const courses= [
    {
      id: '1',
      title: 'Advanced Mathematics',
      progress: 65,
      nextSession: 'Today, 3:00 PM',
      duration: '2h'
    },
    {
      id: '2',
      title: 'Physics: Quantum Mechanics',
      progress: 42,
      nextSession: 'Tomorrow, 10:00 AM',
      duration: '1.5h'
    },
    {
      id: '3',
      title: 'Computer Science Fundamentals',
      progress: 78,
      nextSession: 'Friday, 2:00 PM',
      duration: '2h'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Ongoing Plan</h2>
        <BookOpen className="text-purple-600" size={24} />
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{course.title}</h3>
              <span className="text-sm text-purple-600 font-medium">{course.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>{course.nextSession}</span>
              </div>
              <span className="text-yellow-600 font-medium">{course.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
