import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";
import Modal from "./Modal";
import booking from "../static/booking.PNG";

export default function BookPlan({ plan, onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    lastname: "",
    email: "",
    contact: "",
    plan:plan,
    // role: "solo",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit through whatsapp
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     // Send WhatsApp
  //     const whatsappRes = await fetch("http://localhost:5000/api/auth/send-whatsapp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: formData.username,
  //         phone: formData.contact,
  //         plan_id: plan,
  //       }),
  //     });

  //     const whatsappData = await whatsappRes.json();
  //     if (!whatsappData.success) {
  //       setMessage("❌ WhatsApp message failed. Please retry.");
  //       setLoading(false);
  //       return;
  //     }

  //     // Book in backend
  //     const uid = localStorage.getItem("uid");
  //     const bookingRes = await fetch(`http://localhost:5000/api/auth/book/${uid}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ ...formData, plan_id: plan }),
  //     });

  //     const bookingData = await bookingRes.json();
  //     console.log("Booking response:", bookingData);
  //     setMessage("✅ Booking successful! We’ll reach out soon.");
  //     setTimeout(onClose, 1500);
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("⚠ Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  async function handleSubmit(e) {
  e.preventDefault();

  setLoading(true);
  setMessage("");

  try {
    const response = await axios.post(
      "http://localhost:5000/api/booking/create",
      formData
    );

    if (response.data.success) {
      setMessage("✅ Booking successful! Check your email.");
      
    } else {
      setMessage("❌ Something went wrong");
    }
  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to send booking.");
  }
  finally{
    setTimeout(() => {
      onClose();
      }, 2000);
  }
  setLoading(false);

}


  return (
<Modal show={true} onClose={onClose}>
  <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white w-[90%] h-[85vh] rounded-2xl overflow-hidden shadow-xl flex">
      
      {/* LEFT FORM */}
      <div className="w-1/2 bg-white px-10 py-6 flex flex-col justify-center">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
            Talk to our <span className="text-[#4B0082]">mentorship experts</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name Fields */}
          <div className="flex gap-3">
            <input
              type="text"
              name="username"
              placeholder="First name"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-1/2 p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4B0082]"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last name"
              value={formData.lastname}
              onChange={handleChange}
              className="w-1/2 p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4B0082]"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4B0082]"
          />

          {/* Contact */}
          <input
            type="text"
            name="contact"
            placeholder="Phone number"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4B0082]"
          />

          <input
            type="text"
            name="req"
            placeholder="What are your requirements?"
            value={formData.req}
            onChange={handleChange}
            required
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4B0082]"
          />

          {/* Role selection */}
          <div className="flex flex-col gap-2.5">
            <label
              className={`flex items-center justify-between border rounded-md p-2.5 cursor-pointer transition ${
                formData.role === "solo"
                  ? "border-[#4B0082] bg-[#4B0082]/10"
                  : "border-gray-300"
              }`}
              onClick={() => setFormData((p) => ({ ...p, role: "solo" }))}
            >
              <div>
                <p className="font-medium text-gray-800 text-sm">I’m a student</p>
                {/* <p className="text-xs text-gray-500">
                  Build your skills, create projects, and grow.
                </p> */}
              </div>
              <input
                type="radio"
                name="role"
                checked={formData.role === "solo"}
                readOnly
              />
            </label>

            <label
              className={`flex items-center justify-between border rounded-md p-2.5 cursor-pointer transition ${
                formData.role === "team"
                  ? "border-[#4B0082] bg-[#4B0082]/10"
                  : "border-gray-300"
              }`}
              onClick={() => setFormData((p) => ({ ...p, role: "team" }))}
            >
              <div>
                <p className="font-medium text-gray-800 text-sm">I’m a professional</p>
                {/* <p className="text-xs text-gray-500">
                  Upskill yourself upto market demand or find opportunities at AlgoNest!
                </p> */}
              </div>
              <input
                type="radio"
                name="role"
                checked={formData.role === "team"}
                readOnly
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4B0082] hover:bg-[#6b12b5] text-white py-2.5 text-sm rounded-md font-semibold shadow-sm transition mt-1"
          >
            {loading ? "Booking..." : "Continue"}
          </button>

          {message && (
            <p
              className={`text-center text-xs mt-1 ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <div className="w-1/2 relative overflow-hidden">
            <img
              src={booking}
              alt="Booking Visual"
              className="w-full h-full object-cover object-top"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-[#4B0082]/40 to-transparent"></div> */}
          </div>
    </div>
  </div>
</Modal>
  );
}
