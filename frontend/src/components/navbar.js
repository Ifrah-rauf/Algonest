import "../styles/home.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom"; 
import BookPlan from "../pages/BookPlan";
import axios from "axios";
import userimg from "../static/user.png";
const Navbar = () => {
  const { user, logout } = useAuth();
   const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    async function book(planId) {
      if (!user) {
        // alert("No user found, redirecting...");
        navigate("/signup");
        return;
        }
      // alert("Selected Plan: " + planId);
      
      setSelectedPlan(planId);
      setShowModal(true);
    }
  return (
    <nav className="w-full bg-white border-b border-gray-100 relative z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* <span className="text-xl font-semibold text-[#333333]">
              AlgoNest
            </span> */}
            <Link to="/" className="text-xl font-semibold text-[#333333]">AlgoNest
            </Link>
            <div className="flex items-center gap-8">
              <button className="text-sm text-gray-600 hover:text-[#333333]" 
              onClick={() => book(0)}
              >
                Consult
              </button>
              {showModal && (
                <BookPlan
                  plan={selectedPlan}
                  onClose={() => setShowModal(false)}
                />
                )}
              {/* <Link className="text-sm text-gray-600 hover:text-[#333333]" to="/how-it-works">
                How it works
              </Link> */}
              <a
                href="#howitworks"
                className="text-sm text-gray-600 hover:text-[#333333]"
              >
                how it works
              </a>

              <Link to="/teachers" className="text-sm text-gray-600 hover:text-[#333333]">Teachers</Link>
              <Link to="#startaplan" className="text-sm text-gray-600 hover:text-[#333333]">Start a plan</Link>
              {/* <Link
                to="/start"
                className="bg-[#6b46c1] text-white px-5 py-2.5 rounded-md text-sm font-medium"
              >
                Start a plan
              </Link> */}
              {user?.username ? (
              <Link to="/dashboard" className="user-icon text-white py-2.5 rounded-md text-sm font-medium">
                <img src={userimg} alt="User" className="icon-img" />
              </Link>
              ) : (
                <Link to="/signup">Sign Up</Link>
              )}
            </div>
          </div>
        </nav>
    // <header className="navbar">
    //     <div className="logo">
    //         <Link to="/"><span className="logo-purple">algo</span>
    //         <span className="logo-yellow">Nest</span></Link>
    //     </div>
    //     <nav>
    //         <a href="#" className="courses-drop-down">
    //           <Link to="/AllCourse" style={{marginLeft:"0px"}}>Courses</Link>
    //           <div className="drop-down">
    //             <ul className="drop-down-ul">
    //               <li><Link to="/course1">Syllabus Help</Link></li>
    //               <li><Link to="/course2">Build Projects</Link></li>
    //               <li><Link to="/course3">DSA guidance</Link></li>
    //               <li><Link to="/course2">Interview Prep</Link></li>
    //             </ul>
    //           </div>
    //         </a>
    //         <a href="../#commands">Get Started</a>
    //         {/* <a href="#">Book demo</a> */}
    //         <button onClick={() => book(0)}><a>Book demo</a></button>
    //         {showModal && (
    //                 <BookPlan
    //                   plan={selectedPlan}
    //                   onClose={() => setShowModal(false)}
    //                 />
    //             )}

    //         {user?.username ? (
    //           <Link to="/dashboard" className="user-icon">
    //             <img src={userimg} alt="User" className="icon-img" />
    //           </Link>
    //         ) : (
    //           <Link to="/signup">Sign Up</Link>
    //         )}

    //     </nav>
    //     </header>
  );
};

export default Navbar;