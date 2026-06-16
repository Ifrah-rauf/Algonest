import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Main";
import Sign from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import TeachersProfile from "./pages/TeachersProfile";
import CourseOne from "./pages/Course1";
import Test from "./pages/test";
import CourseOutline from "./pages/CourseOutline"
import RoadmapExpress from "./pages/roadmap_express";
import ScrollToHash from "./components/ScrollToHash";
import Howitworks from "./components/howitworks";
import MyRoadmaps from "./pages/ExploreRoadmaps";
import BookingPage from "./pages/BookingPage";
import CareerQuiz from "./pages/CareerQuiz";
import CSCore from "./pages/CSCore";
import Grill from "./pages/Grill";
import Footer from "./components/footer";
// Assuming authContext is imported; adjust if needed
import { useAuth } from "./context/AuthContext.jsx";// Replace with actual path


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Landing() {
  const { user } = useAuth(); // Assuming AuthContext provides user with role
  // Assuming user object has a role property; adjust based on your auth structure
  const role = user?.role; // e.g., 'STUDENT', 'TEACHER', or undefined

  if (role === 'STUDENT') {
    return <Dashboard />;
  } else if (role === 'TEACHER') {
    return <Dashboard />;
  } else if (role === 'ADMIN') {
    return <Dashboard />;
  } else {
    return <Home />;
  }
}


function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const isTeacherDashboard =
    user?.role === "TEACHER" &&
    (location.pathname === "/" || location.pathname === "/dashboard");

  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup"||
    location.pathname === "/roadmap_express"||
    location.pathname === "/careerQuiz";
  return (
      <>
     
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachersProfile/:id" element={<TeachersProfile />} />
        <Route path="/course1" element={<CourseOne />} />
        <Route path="/course-outline/:id" element={<CourseOutline />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        {/* <Route path="/roadmap" element={<Roadmap />} /> */}
        <Route path="/roadmap_express" element={<RoadmapExpress />} />
        <Route path="/howitworks" element={<Howitworks />} />
        <Route path="/roadmaps" element={<MyRoadmaps />} />
        <Route path="/cscore" element={<CSCore />} />
        <Route path="/grill" element={<Grill />} />
        <Route path="/book-now" element={<BookingPage />} />
        <Route path="/careerQuiz" element={<CareerQuiz />} />
        <Route path="/careerquiz" element={<CareerQuiz />} />

      </Routes>
    {!hideFooter && <Footer className={isTeacherDashboard ? "teacher-dashboard-footer" : ""} />}
     </>
  );
}
function App() {
  // const API_URL = process.env.REACT_APP_API_URL;
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <ScrollToHash />

      <AppLayout />
    </Router>
  );
}

export default App;
