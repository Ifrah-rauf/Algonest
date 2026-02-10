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
              <a
                href="#howitworks"
                className="text-sm text-gray-600 hover:text-[#333333]"
              >
                how it works
              </a>

              <Link to="/teachers" className="text-sm text-gray-600 hover:text-[#333333]">Teachers</Link>
              <Link to="#startaplan" className="text-sm text-gray-600 hover:text-[#333333]">Start a plan</Link>
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
  );
};

export default Navbar;