import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { Clock, Layers, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Courses() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:5000/api/plans/getPlans");
      const json = await res.json();
      if (json.success) setPlans(json.plans);
    }
    load();
  }, []);

  const ACTIVE_PLANS = [5, 6];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* HERO */}
      <section className="bg-[#2b2b2b] py-20 text-center">
        <h1 className="text-4xl font-bold text-white">
          Courses Offered
        </h1>
        <p className="text-gray-300 mt-3 max-w-xl mx-auto">
          Build real-world projects, Get DSA consistent and build your career.
        </p>
      </section>

      {/* COURSES */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {plans.map((plan) => {
            const isActive = ACTIVE_PLANS.includes(plan.plan_id);

            return (
              <div
                key={plan.plan_id}
                className={`rounded-2xl border p-6 transition
                  ${
                    isActive
                      ? "bg-white shadow-lg border-purple-500"
                      : "bg-gray-100 border-gray-300 opacity-60"
                  }`}
              >
                <h2
                  className={`text-xl font-bold mb-2 ${
                    isActive ? "text-purple-700" : "text-gray-500"
                  }`}
                >
                  {plan.plan_name}
                </h2>

                <p className="text-sm text-gray-600 mb-4">
                  {plan.description}
                </p>

                {/* META */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <Clock size={16} /> {plan.durationdays} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers size={16} /> {plan.sessions} sessions
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} /> 1:1 Mentorship
                  </span>
                </div>

                {/* PRICE */}
                <p className="text-lg font-semibold mb-6">
                  ₹{plan.price.toLocaleString()}
                </p>

                {/* ACTIONS */}
                {isActive ? (
                  <div className="flex gap-3">
                    <Link
                      to={`/teachers?plan=project`}
                      // to={`/teachers?plan=${plan.plan_id}`}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-xl text-center"
                    >
                      Explore Mentors
                    </Link>

                    <Link
                      to={`/course2`}
                      className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-2 rounded-xl text-center"
                    >
                      Know More
                    </Link>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 font-medium">
                    Coming Soon
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
