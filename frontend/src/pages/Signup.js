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

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // GOOGLE LOGIN
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

  // EMAIL SIGNUP
  const handleSignup = async () => {
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, mail, password }),
    });

    const data = await res.json();
    if (data.status === "success") {
      login(data.user);
      navigate("/dashboard");
    } else if (data.status === "mail already exists") {
      alert("Account exists. Please login.");
      navigate("/login");
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--sidebar-bg)]">

      {/* LEFT IMAGE PANEL */}
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
            Welcome to <span className="text-[var(--nest-yellow)]">AlgoNest</span>
          </h1>
        </div>
      </div>

      {/* RIGHT SIGNUP PANEL */}
      <div className="flex flex-col justify-center items-center md:w-1/2 p-4">
        <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-[var(--algo-purple)] mb-8">
            Create your account
          </h2>
          {/* <p className="text-gray-600 mb-6">
            Join AlgoNest and start your learning journey 🚀
          </p> */}

          {/* FORM */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--algo-purple)] focus:ring-2 focus:ring-[var(--algo-purple)] outline-none"
            />

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

            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--algo-purple)] focus:ring-2 focus:ring-[var(--algo-purple)] outline-none"
            />
          </div>

          {/* SIGN UP BUTTON */}
          <button
            onClick={handleSignup}
            className="mt-6 w-full bg-[var(--algo-purple)] hover:bg-purple-800 text-white py-3 rounded-xl font-semibold transition"
          >
            Create Account
          </button>

          {/* LOGIN LINK */}
          <button
            onClick={() => navigate("/login")}
            className="mt-2 w-full border border-[var(--algo-purple)] text-[var(--algo-purple)] py-3 rounded-xl font-semibold hover:bg-purple-50 transition"
          >
            Login Instead
          </button>

          {/* DIVIDER */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
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
