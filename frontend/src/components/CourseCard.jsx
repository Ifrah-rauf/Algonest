import React from "react";
const CourseCard = ({ title, description, mentor, progress }) => {
  return (
    <div className="max-w-sm max-h-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex flex-col justify-between">

      {/* Top Accent Bar */}

      {/* Course Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {/* <div className="h-1.5 w-20 bg-[#FFB800] rounded-full mb-5"></div> */}

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">{description}</p>

      {/* Mentor Info */}
      <div className="flex items-center justify-between mb-4">
        {/* <div>
          <p className="text-sm text-gray-500">Mentor</p>
          <p className="font-medium text-[#4B0082]">{mentor}</p>
        </div> */}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
        <div
          className="bg-[#4B0082] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{progress}% Completed</span>
        <button className="h-5.5 bg-[#FFB800] hover:bg-[#ffcb3d] text-black font-small px-2 py-2 rounded-lg transition-all duration-300">
          Go to Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
