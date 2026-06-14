import { Search, MoreVertical, Mail } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000';

function formatDbDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  // Keep the same clock time as stored in the DB payload instead of shifting to local timezone.
  return date.toLocaleString('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function parseDbWallTime(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  // Treat DB timestamps as wall-clock values so they don't drift by timezone.
  const match = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/
  );

  if (match) {
    const [, y, m, d, hh = '00', mm = '00', ss = '00'] = match;
    const date = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(hh),
      Number(mm),
      Number(ss)
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getSessionTimingStatus(session) {
  if (!session) {
    return { key: 'none', label: 'No session', canJoin: false };
  }

  const start = parseDbWallTime(session.start_time);
  const end = parseDbWallTime(session.end_time);
  const now = new Date();

  if (start && now < start) {
    return { key: 'upcoming', label: 'Upcoming', canJoin: false };
  }

  if (end && now > end) {
    return { key: 'expired', label: 'Expired', canJoin: false };
  }

  return { key: 'live', label: 'Join from dashboard', canJoin: Boolean(session.join_url) };
}

function dedupeUniqueStudents(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = String(row?.s_id ?? '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function Students() {
  const { user } = useAuth();
  const [rawRows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (!user?.uid) {
        setRawRows([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/teachers/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, mode }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '<no body>');
          throw new Error(`Failed to fetch students: ${res.status} ${res.statusText} ${txt}`);
        }

        const body = await res.json();
        const data = Array.isArray(body?.data) ? body.data : [];
        setRawRows(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('[Students] load error:', err);
        setRawRows([]);
        setError(err.message || 'Failed to load students');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [user?.uid, mode]);

  const visibleRows = useMemo(() => {
    const rows = mode === 'unique' ? dedupeUniqueStudents(rawRows) : rawRows;
    const searchLower = searchTerm.trim().toLowerCase();

    return rows.filter((st) => {
      if (!searchLower) return true;
      return (st?.name || '').toLowerCase().includes(searchLower) ||
        (st?.uid || '').toLowerCase().includes(searchLower);
    });
  }, [rawRows, mode, searchTerm]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Students</h2>
        <p className="text-gray-600 mt-2">
          {mode === 'all'
            ? 'All sessions booked with you'
            : 'Unique students who have booked sessions with you'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    
    <div className="relative w-full flex-1">
      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
    </div>

    <div className="flex w-full sm:w-auto gap-2">
      <button
        onClick={() => setMode("all")}
        className={`flex-1 sm:flex-none px-3 py-2 rounded-lg font-medium transition-colors ${
          mode === "all"
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        All Sessions
      </button>

      <button
        onClick={() => setMode("unique")}
        className={`flex-1 sm:flex-none px-3 py-2 rounded-lg font-medium transition-colors ${
          mode === "unique"
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Unique Students
      </button>
    </div>

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
                  {mode === 'all' ? 'Session time' : 'Last session'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Session Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-4">
                    Loading {mode === 'all' ? 'sessions' : 'students'}…
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-red-600">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && visibleRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4">
                    No {mode === 'all' ? 'sessions' : 'students'} found.
                  </td>
                </tr>
              )}

              {!loading && !error && visibleRows.map((st) => {
                const rowKey = mode === 'all'
                  ? `${st.session_id || 'session'}-${st.booking_id || st.s_id}`
                  : String(st.s_id);

                const sessionTime = mode === 'all'
                  ? (st.session_time || st.session?.start_time || st.lastSessionAt)
                  : (st.last_session_time || st.session?.start_time || st.lastSessionAt);

                return (
                  <tr key={rowKey} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{st.name || st.uid}</div>
                        <div className="text-sm text-gray-500">{st.uid}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDbDateTime(sessionTime)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {(() => {
                        const timing = getSessionTimingStatus(st.session);
                        const style =
                          timing.key === 'live'
                            ? 'bg-green-100 text-green-700'
                            : timing.key === 'upcoming'
                            ? 'bg-blue-100 text-blue-700'
                            : timing.key === 'expired'
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-gray-100 text-gray-500';

                        return (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
                            {timing.label}
                          </span>
                        );
                      })()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {mode === 'all' && (
                          <button className="px-3 py-2 rounded-lg border border-purple-200 bg-purple-50 text-sm font-semibold text-purple-700 hover:bg-purple-100">
                            View Summary
                          </button>
                        )}

                        {getSessionTimingStatus(st.session).canJoin ? (
                          <button
                            onClick={() => (window.location.href = st.session.join_url)}
                            className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                          >
                            Join from dashboard
                          </button>
                        ) : null}

                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
