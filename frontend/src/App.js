import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Main";
import Sign from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import TeachersProfile from "./pages/TeachersProfile";
import CourseOne from "./pages/Course1";
import CourseTwo from "./pages/Course2";
import CourseThree from "./pages/Course3";
import Test from "./pages/test";
import AllCourse from "./pages/AllCourse";
import CourseOutline from "./pages/CourseOutline"
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachersProfile/:id" element={<TeachersProfile />} />
        <Route path="/AllCourse" element={<AllCourse/>} />
        <Route path="/course1" element={<CourseOne />} />
        <Route path="/course2" element={<CourseTwo />} />
        <Route path="/course3" element={<CourseThree />} />
        <Route path="/course-outline/:id" element={<CourseOutline />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        {/* <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
