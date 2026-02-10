import { Video, Calendar, User } from 'lucide-react';
export function SessionsAttended() {
  const sessions = [
    {
      id: '1',
      title: 'Linear Algebra - Matrices',
      instructor: 'Dr. Sarah Johnson',
      date: 'Jan 27, 2026',
      duration: '2h 15m',
      type: 'live',
      rating: 5
    },
    {
      id: '2',
      title: 'Quantum States Introduction',
      instructor: 'Prof. Michael Chen',
      date: 'Jan 25, 2026',
      duration: '1h 45m',
      type: 'live',
      rating: 4
    },
    {
      id: '3',
      title: 'Data Structures Deep Dive',
      instructor: 'Dr. Emily Rodriguez',
      date: 'Jan 24, 2026',
      duration: '2h 00m',
      type: 'recorded',
      rating: 5
    },
    {
      id: '4',
      title: 'Calculus Problem Solving',
      instructor: 'Dr. Sarah Johnson',
      date: 'Jan 22, 2026',
      duration: '1h 30m',
      type: 'live',
      rating: 5
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sessions Attended</h2>
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          {sessions.length} Total
        </div>
      </div>
      
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  session.type === 'live' ? 'bg-yellow-100' : 'bg-purple-100'
                }`}>
                  <Video className={session.type === 'live' ? 'text-yellow-600' : 'text-purple-600'} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{session.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <User size={14} className="mr-1" />
                    <span>{session.instructor}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < session.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm mt-3">
              <div className="flex items-center text-gray-600">
                <Calendar size={14} className="mr-1" />
                <span>{session.date}</span>
              </div>
              <span className="text-purple-600 font-medium">{session.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
