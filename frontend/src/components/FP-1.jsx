import { CheckCircle, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import crying from "../static/crying.png";
import computer from "../static/computer.png";
import BookPlan from "../pages/BookPlan";
import LoadingButton from "../components/LoadingButton";

export default function DiscoverSection() {
      const { user} = useAuth();
    const navigate = useNavigate();
      const [showModal, setShowModal] = useState(false);
      const [selectedPlan, setSelectedPlan] = useState(null);
    
    async function book(planId) {
    
      if (!user) {
        // user NOT logged in
        alert("No user found, redirecting...");
        navigate("/signup");
        return;
      }
      setSelectedPlan(planId);
      setShowModal(true);
    }
    
  return (
    <div>
        <section className="w-full  py-20">
                <div className="max-w-5xl mx-auto text-center px-6">
        
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Supercharge your career with
                  </h1>
        
                  <h2 className="text-[42px] md:text-[54px] font-extrabold text-[--nest-yellow] mt-2">
                    Long Term Mentorship
                  </h2>
{/*         
                  <p className="text-gray-700 text-l max-w-2xl mx-auto mt-4">
                    Land your dream job, role, and company faster than ever with 1:1 long-term mentorship.
                  </p> */}
                          {/* Bottom Highlights */}
                  <div className="flex flex-wrap justify-center gap-6 mt-10 text-[--text-dark] text-lg">
                    <p className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[--text-dark]" /> College and School Syllabus Tutoring
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[--text-dark]" /> Project Building basic and advance
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[--text-dark]" /> Personalised DSA mentorship for consistency
                    </p>
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-center gap-4 mt-8">
                    <button className="px-6 py-3 bg-white shadow-md border rounded-xl text-gray-900 font-semibold hover:bg-gray-100 transition">
                      <Link to="/AllCourse">
                      Explore courses</Link>
                    </button>
                    <button className="px-6 py-3 bg-white shadow-md border rounded-xl text-gray-900 font-semibold hover:bg-gray-100 transition">
                      <Link to="/teachers">
                      Explore mentors</Link>
                    </button>
        
                    <button className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition flex items-center gap-2"
                    onClick={() => book(0)}>
                      Consult now →
                    </button>
                    {showModal && (
                      <BookPlan
                        plan={selectedPlan}
                        onClose={() => setShowModal(false)}
                      />
                    )}

                  </div>
                                      
                

        
                </div>
              </section>
              
    <section className="w-full bg-[--text-dark] py-14 border-t">
  <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* ------------------ WHY OTHER PLATFORMS FAIL ------------------ */}
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[20px] font-semibold text-gray-900">
          Why Other Platforms Fail
        </h3>
        <button className="p-2 border rounded-full hover:bg-gray-100 transition">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* List */}
      <ul className="space-y-3 text-[15px] text-gray-800">

        {[
          "Too generic mentors with inconsistent quality",
          "Expensive pricing without transparency",
          "Force you through long funnels before booking",
          "Poor matching → wrong mentor for your need",
          "No support during or after sessions",
          "No project accountability / unclear delivery",
          "Heavy UI, confusing choices, too many steps",
        ].map((issue) => (
          <li key={issue} className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              {issue}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </li>
        ))}

      </ul>

      {/* Button */}
      {/* <button className="mt-6 w-full py-3 rounded-xl bg-[var(--text-dark)] text-white font-semibold text-[15px] hover:bg-black transition flex justify-center items-center gap-2">
        Learn More <ChevronRight size={16} />
      </button> */}
      <div className="mt-8 flex justify-center">
        <img
          src={crying}
          alt="icon"
          className="w-28 h-auto object-contain drop-shadow-sm"
        />
      </div>
    </div>

    {/* ------------------ WHY ALGONEST WINS ------------------ */}
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[20px] font-semibold text-gray-900">
          Why AlgoNest is Better
        </h3>
        <button className="p-2 border rounded-full hover:bg-gray-100 transition">
          <ChevronRight size={18} />
        </button>
      </div>

      <ul className="space-y-3 text-[15px] text-gray-800">

        {[
          "Dedicated 1-to-1 mentoring",
          "Affordable pricing for students",
          "Pre-defined expert cirriculum",
          "Professional project development",
          "Session quality + dedicated support",
          "Clear sessions, deadlines and outcomes",
          "Simple, visual UI designed for students",
        ].map((point) => (
          <li key={point} className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              {point}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </li>
        ))}

      </ul>
      <div className="mt-8 flex justify-center">
        <img
          src={computer}
          alt="icon"
          className="w-28 h-auto object-contain drop-shadow-sm"
        />
      </div>
    </div>

  </div>
</section>

    </div>
  );
}
