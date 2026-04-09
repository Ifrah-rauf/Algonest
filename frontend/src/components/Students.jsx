import { Search, MoreVertical, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!user?.uid) {
        setStudents([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/teachers/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid })
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '<no body>');
          console.error('Failed to fetch students:', res.status, res.statusText, txt);
          throw new Error('Failed to fetch students');
        }

        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const txt = await res.text().catch(() => '<no body>');
          console.error('Non-JSON response for students:', txt);
          throw new Error('Failed to fetch students (non-JSON response)');
        }

        const body = await res.json();
        const data = body?.data || [];
        setStudents(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.uid]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Students</h2>
        <p className="text-gray-600 mt-2">Students who have booked sessions with you</p>
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last session</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Active session</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && <tr><td colSpan={4} className="px-6 py-4">Loading students…</td></tr>}
              {error && <tr><td colSpan={4} className="px-6 py-4 text-red-600">{error}</td></tr>}
              {!loading && !error && students.length === 0 && <tr><td colSpan={4} className="px-6 py-4">No students found.</td></tr>}

              {!loading && !error && students.map((st) => (
                <tr key={st.s_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{st.name || st.uid}</div>
                      <div className="text-sm text-gray-500">{st.uid}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{st.lastSessionAt ? new Date(st.lastSessionAt).toLocaleString() : '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{st.hasActiveSession ? 'Yes' : 'No'}</td>
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
