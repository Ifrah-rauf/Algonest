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
import Roadmap from "./pages/roadmap";
import RoadmapExpress from "./pages/roadmap_express";
import ScrollToHash from "./components/ScrollToHash";
import Roadmaps from "./components/roadmaps";
import Howitworks from "./components/howitworks";
import MyRoadmaps from "./pages/ExploreRoadmaps";
import CareerQuiz from "./pages/CareerQuiz";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToHash/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachersProfile/:id" element={<TeachersProfile />} />
        <Route path="/course1" element={<CourseOne />} />
        <Route path="/course-outline/:id" element={<CourseOutline />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/roadmap_express" element={<RoadmapExpress />} />
        <Route path="/howitworks" element={<Howitworks />} />
        <Route path="/roadmaps" element={<MyRoadmaps />} />
        <Route path="/careerquiz" element={<CareerQuiz />} />

      </Routes>
    </Router>
  );
}

export default App;
