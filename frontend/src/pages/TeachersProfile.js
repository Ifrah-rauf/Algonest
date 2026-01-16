import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FadeInSection from "../components/FadeInSection";
import AvailabilitySetting from "../components/AvailabilitySettings";
import Availability from "../components/Availability";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext.jsx";
const TeacherProfile = () => {
  // 🔁 Tab state
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState("about");
  const { id } = useParams();
  const location = useLocation();
  const [teacher, setTeacher] = useState(location.state?.teacher || null);
  const [availability, setAvailability] = useState([]);
  const [editAvailability, setEditAvailability] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
  fetch(`http://localhost:5000/api/teachers/getTeacher/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log("DATA:", data);
      setTeacher(data.teacher);
      setAvailability(data.avail);
      setTimeSlots(data.timeSlots);
    })
    .catch(console.error);
}, [id]); //run this effect whenever id gets changed. our page depends on dyanamic ids.
//case1: [] -runs only when component mounts (like on page reload)
//case2: [id]- runs when component mounts and when id changes.

// console.log(availability);
//   if (!teacher) return <div>Loading...</div>;
//     console.log(teacher.id);

useEffect(() => {
    if (!user || !teacher.t_id) return;

    async function checkOwnership() {
      try {
        console.log("CHECKING OWNERSHIP", {
        uid: user.uid,
        teacherId: teacher.t_id,
      });
        const res = await fetch(
          "http://localhost:5000/api/teachers/isOwner",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.uid,
              teacherId: teacher.t_id,
            }),
          }
        );
        console.log("AWAITING ISOWNER...");

        const json = await res.json();
        if (json.success) {
          setIsOwner(json.isOwner);
        }
      } catch (err) {
        console.error("Ownership check failed:", err);
      }
    }

    checkOwnership();
  }, [user, teacher.t_id]);

  return (
    <div>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen py-10 px-6 md:px-16 font-inter">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-md p-8">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <img
            src={teacher.pfp}
            alt={teacher.name}
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-lg"
          />
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[var(--text-dark)] flex items-center gap-2">
            {teacher.name}
             {/* <span className="text-2xl">{teacher.country}</span> */}
          </h1>
          <p className="text-lg text-gray-600 mt-2">{teacher.rating}</p>

          {/* Languages */}
          <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-600">
            <span className="font-semibold">{teacher.bio}</span>
          </div>
        {isOwner && (
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => setEditAvailability(true)}
              className="
                px-5 py-2 rounded-lg
                bg-[var(--algo-purple)]
                text-white font-semibold text-sm
                hover:bg-purple-700
                transition
              "
            >
              Edit Availability
            </button>
          </div>
        )}
          <div className="flex gap-6 mt-8 border-b border-gray-200">
            {["about", "reviews", "availability", "content"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "text-[var(--algo-purple)] border-b-2 border-[var(--nest-yellow)]"
                    : "text-gray-500 hover:text-[var(--algo-purple)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm p-8">
        {activeTab === "about" && (
          <div className="flex flex-col md:flex-row gap-10">
            {/* Video Placeholder */}

            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 h-64 rounded-xl">
                {teacher?.video_url ? (
                    <video
                    src={teacher.video_url}
                    // src={`http://localhost:5000${teacher.video}`}
                    controls
                    playsInline
  className="w-full h-64 rounded-xl bg-black object-contain"
                    // playsInline
                    preload="auto"
                    >
                    Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl">
                    🎥
                    </div>
                )}
                </div>

            {/* About Details */}
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold text-[var(--algo-purple)] mb-3">
                About Me
              </h2>
              <p className="text-gray-700 mb-6 leading-7">
               {teacher.bio}
              </p>

              <h3 className="text-xl font-semibold text-[var(--algo-purple)] mb-2">
                Education
              </h3>
              <p className="text-gray-700 mb-6">{teacher.education}</p>

              <h3 className="text-xl font-semibold text-[var(--algo-purple)] mb-2">
                Teaching Style
              </h3>
              <p className="text-gray-700">{teacher.teaching_style}</p>
              <p className="text-gray-700">{teacher.meeting_link}</p>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="text-center py-20 text-gray-500">
            <p>Reviews section coming soon...</p>
          </div>
        )}

        {activeTab === "availability" && (
          <div className="py-5">
            {/* EDIT MODE */}
            {editAvailability && isOwner ? (
              <AvailabilitySetting
                // teacherId={id}
                // meeting_link={teacher.meeting_link}
                avail={availability}
                // timeSlots={timeSlots}
                // onClose={() => setEditAvailability(false)}
              />
            ) : (
              /* VIEW MODE */
              <Availability
                teacherId={id}
                meeting_link={teacher.meeting_link}
                avail={availability}
                timeSlots={timeSlots}
              />
            )}

          </div>
        )}


        {activeTab === "content" && (
          <div className="text-center py-20 text-gray-500">
            <p>Published content will be shown here soon...</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default TeacherProfile;
