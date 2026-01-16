import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useLoading } from "../context/LoadingContext";
import LoadingButton from "../components/LoadingButton";

const TAB_CONFIG = {
  "Syllabus Help": [1, 2, 3, 4],
  "Project Development": [5, 6],
  "DSA": [7, 8, 9],
  "Interview Skills": [10]
};

export default function MentorGrid() {
  const { setLoading } = useLoading();
  const [activeTab, setActiveTab] = useState("Syllabus Help");
  const [mentors, setMentors] = useState([]);

  async function fetchMentors(planIds) {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/teachers/getMentors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planIds })
    });

    const data = await res.json();
    if (data.success) setMentors(data.mentors || []);
  }

  useEffect(() => {
    fetchMentors(TAB_CONFIG[activeTab]); // default load
  }, [activeTab]);
    setLoading(false);
  return (
    <div className="py-20">
      {/* HEADING */}
      <h1 className="text-3xl font-bold text-center text-[var(--text-dark)]">
        600+ mentors are just a Free Trial Session away!
      </h1>
      <p className="text-center text-gray-600 mt-2 mb-6">
        Choose your ideal mentor and get started with a FREE trial session
      </p>

      {/* TABS */}
      <div className="bg-gray-700 w-[1200px] m-auto p-3 rounded-xl">
      <div className="flex justify-center gap-3 mt-6">
        {Object.keys(TAB_CONFIG).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 text-sm rounded-full border 
              ${
                activeTab === tab
                  ? "bg-[var(--algo-purple)] text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 max-w-6xl mx-auto px-4 ">
        {mentors.map((m) => (
          <div
            key={m.t_id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            {/* TOP */}
            <div className="flex items-center gap-4">
              <img
                src={m.pfp}
                alt="mentor"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-dark)]">
                  {m.name}
                </h3>
                <p className="text-sm text-gray-500">{m.experience} Years Experience</p>
                <p className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                  <Star size={16} /> {m.rating || "5.0"}
                </p>
              </div>
            </div>

            {/* BIO */}
            <p className="mt-3 text-gray-600 text-sm">{m.bio}</p>

            {/* COMPANY TAG */}
            {m.specialisation_id && (
              <p className="text-sm mt-2 text-gray-500">
                💼 {m.specialisation_id}
              </p>
            )}

            {/* BUTTON */}
            <button className="mt-5 w-full py-2 bg-[var(--nest-yellow)] hover:bg-yellow-300 text-black font-semibold rounded-xl">
              Book Golden Trial @ ₹199
            </button>
          </div>
        ))}
      </div>
        </div> 
      {/* EXPLORE BUTTON */}
      <div className="flex justify-center mt-12">
        <button className="px-6 py-3 bg-white border rounded-xl font-semibold hover:bg-gray-100 shadow">
          Explore All Mentors →
        </button>
      </div>
    </div>
  );
}
