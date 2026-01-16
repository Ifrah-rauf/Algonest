import React from "react";

const AddOnCard = ({ icon, title, tagline, price }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-start border border-gray-300 hover:scale-[1.02]">
      {/* Icon */}
      {icon && (
        <img
          src={icon}
          alt={title}
          className="h-20 w-20 mb-5 bg-[#4B0082]/10 p-4 rounded-2xl shadow-sm"
        />
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#4B0082] mb-2">
        {title}
      </h3>

      {/* Tagline */}
      <p className="text-gray-600 text-sm mb-6">{tagline}</p>

      {/* Price + Button */}
      <div className="flex justify-between items-center w-full mt-auto">
        <span className="text-lg font-bold text-[#FFB800]">{price}</span>
        <button className="bg-[#4B0082] hover:bg-[#6b12b5] text-white font-medium px-5 py-2 rounded-lg transition-all duration-300">
          Add to Plan
        </button>
      </div>
    </div>
  );
};

export default AddOnCard;
