import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import StudentDashboard from "../components/s_dashboard.jsx"
import StudentDashboard from "../components/s_dashboard3.jsx"
import TeacherDashboard from "../components/t_dashboard.jsx"
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!user?.uid) {
    setLoading(false);
    return;
  }

  async function loadDashboard() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/dashboard/getDashboard/${user.uid}`
      );
      const data = await res.json();

      if (data.success) {
        setRole(data.message);
        setDashboardData(data.data);
        console.log("ROLE: ", data.message);
        console.log("DASHBOARD DATA: ", data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, [user]);
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-[60vh] flex items-center justify-center text-gray-500">
          Loading your dashboard...
        </div>
      </>
    );
  }
if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      <main className="px-6 py-8 max-w-7xl mx-auto">

        {role === "STUDENT" && (
          <StudentDashboard 
            data={dashboardData}
          />
        )}

        {role === "TEACHER" && (
          <TeacherDashboard data={dashboardData} />
        )}

        {!role && (
          <div className="text-gray-500">
            Unable to determine dashboard type.
          </div>
        )}
      </main>
    </div>
  );
}
