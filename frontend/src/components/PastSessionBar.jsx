import React from "react";

const PastSessionBar = ({ sessionName, mentor, completion }) => {
  return (
    <div className="max-w-xl rounded-xl shadow-md border border-gray-100 p-4 mb-4 hover:shadow-lg transition-all duration-300">
      <div className="w-full flex justify-between items-center mb-2">
        {/* Session info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{sessionName}</h3>
          <p className="text-sm text-gray-500">Mentor: <span className="font-medium text-[#4B0082]">{mentor}</span></p>
        </div>

        {/* Completion percentage */}
        <span className="text-sm font-medium text-[#FFB800]">{completion}% Completed</span>
      </div>

      {/* Horizontal bar */}
      <div className="w-full h-[10px] bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#333] to-[#6b46c1] rounded-full transition-all duration-700"
          style={{ width: `${completion}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PastSessionBar;
