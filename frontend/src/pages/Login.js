import React, { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCWx-7sjZuGOseiho9EG3sdxS5BCA1cz6c",
  authDomain: "algonest-16df7.firebaseapp.com",
  projectId: "algonest-16df7",
  storageBucket: "algonest-16df7.firebasestorage.app",
  messagingSenderId: "112495157363",
  appId: "1:112495157363:web:be9f48a5b5a61e4db30a06",
  measurementId: "G-W8MH2QK655",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------------------
  // EMAIL LOGIN
  // ---------------------------
  const handleEmailLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, password }),
    });

    const data = await res.json();

    if (data.status === "success") {
      await login(data.user);     // store session globally
      navigate("/");
    } else {
      alert("Invalid email or password!");
    }
  };

  // ---------------------------
  // GOOGLE LOGIN
  // ---------------------------
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const response = await axios.post("http://localhost:5000/api/auth/save-user", {
        uid: firebaseUser.uid,
        mail: firebaseUser.email,
        username: firebaseUser.displayName,
      });

      login(response.data.user);
      navigate("/dashboard");

    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--sidebar-bg)]">

      {/* LEFT IMAGE SIDE (same design as signup) */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80')",
          filter: "brightness(85%)",
        }}
      >
        <div className="w-full h-full bg-[var(--algo-purple)] bg-opacity-40 flex items-center justify-center p-10">
          <h1 className="text-white text-4xl font-bold drop-shadow-xl">
            Welcome back to{" "}
            <span className="text-[var(--nest-yellow)]">AlgoNest</span>
          </h1>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="flex flex-col justify-center items-center md:w-1/2 p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-[var(--algo-purple)] mb-4">
            Login to your account
          </h2>
          <p className="text-gray-600 mb-6">
            Glad to see you again! Let’s continue your journey 🚀
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => setMail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--algo-purple)] focus:ring-2 focus:ring-[var(--algo-purple)] outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--algo-purple)] focus:ring-2 focus:ring-[var(--algo-purple)] outline-none"
            />
          </div>

          <button
            onClick={handleEmailLogin}
            className="mt-6 w-full bg-[var(--algo-purple)] hover:bg-purple-800 text-white py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="mt-2 w-full border border-[var(--algo-purple)] text-[var(--algo-purple)] py-3 rounded-xl font-semibold hover:bg-purple-50 transition"
          >
            Create a new account
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgreplo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="font-semibold text-gray-700">
              Continue with Google
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}
