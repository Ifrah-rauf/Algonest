import React from "react";
import { Star, Users, Briefcase } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TeacherCard({ teacher }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!teacher) return null;
  const openProfile = () => {
    navigate(`/TeachersProfile/${teacher.t_id}`, {
      state: {
        teacher,
        gateFlow: location.state?.gateFlow || location.state?.checkpointFlow || location.state?.interviewFlow || null,
      },
    });
  };

  return (
    <div
      key={teacher.t_id}
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 flex gap-5 w-full"
    >
      {/* Picture */}
      <img
        src={teacher.pfp}
        alt={teacher.name}
        className="w-20 h-20 rounded-full object-cover border"
      />

      {/* Info Section */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {teacher.name}
            </h3>

            <p className="text-sm text-[var(--algo-purple)] font-medium">
              {teacher.teaching_style}
            </p>
          </div>

          <button className="px-4 py-2 text-sm rounded-lg font-medium text-gray-100 bg-[var(--algo-purple)] hover:bg-purple-800 hover:text-gray-100 transition"
             onClick={openProfile}>
            View Profile
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-6 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />
            {teacher.rating} Rating
          </div>

          <div className="flex items-center gap-1">
            <Users size={16} className="text-[var(--algo-purple)]" />
            {teacher.sessions}+ Sessions
          </div>

          <div className="flex items-center gap-1">
            <Briefcase size={16} className="text-gray-500" />
            {teacher.experience} Yrs Exp
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {teacher.bio}
        </p>

        {/* Specialisation */}
        {/* Specialisation */}
      <div className="flex flex-wrap gap-2 mt-3">
        {teacher.specialisation && (
          <p className="text-xs text-gray-600 mt-1">Domains:</p>
        )}
        {teacher.specialisation &&
          Object.values(teacher.specialisation)
            .filter(
              (val) =>
                typeof val === "string" && val !== null && val.trim() !== ""
            )
            .map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#6b46c11a] border-[#6b46c16f] border-2 rounded-full text-xs text-gray-800"
              >
                {skill}
              </span>
            ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
      {teacher.frameworks && (
          <p className="text-xs text-gray-600 mt-1">Languages:</p>
        )}
        {teacher.languages &&
          Object.values(teacher.languages)
            .filter(
              (val) =>
                typeof val === "string" && val !== null && val.trim() !== ""
            )
            .map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#6b46c11a] border-[#6b46c16f] border-2 rounded-full text-xs text-gray-800"
              >
                {skill}
              </span>
            ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {teacher.frameworks && (
          <p className="text-xs text-gray-600 mt-1">Frameworks:</p>
        )}

        {teacher.frameworks &&
          Object.values(teacher.frameworks)
            .filter(
              (val) =>
                typeof val === "string" && val !== null && val.trim() !== ""
            )
            .map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#6b46c11a] border-[#6b46c16f] border-2 rounded-full text-xs text-gray-800"
              >
                {skill}
              </span>
            ))}
      </div>


        {/* Book Session */}
        {/* <button className="mt-4 text-sm px-4 py-2 rounded-lg bg-[var(--nest-yellow)] text-gray-900 font-semibold hover:bg-yellow-400 transition">
          Book 1:1 Session
        </button> */}
      </div>
    </div>
  );
}
