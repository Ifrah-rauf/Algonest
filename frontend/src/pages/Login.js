import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthExperienceShell from "../components/AuthExperienceShell";
import { auth, githubProvider, googleProvider } from "../config/firebaseAuth";
import githubIcon from "../static/github.png";

function buildOAuthPayload(firebaseUser) {
  const email = firebaseUser?.email || firebaseUser?.providerData?.[0]?.email || "";
  const username =
    firebaseUser?.displayName ||
    firebaseUser?.providerData?.[0]?.displayName ||
    email.split("@")[0] ||
    "AlgoNest User";

  if (!email) {
    throw new Error(
      "Your OAuth account did not return an email. Please use an account with a public/verified email."
    );
  }

  return {
    uid: firebaseUser.uid,
    mail: email,
    username,
  };
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------
  // EMAIL LOGIN
  // ---------------------------
  const handleEmailLogin = async () => {
    if (!mail.trim() || !password.trim() || submitting) return;

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail: mail.trim(), password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        await login(data.user);
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid email or password!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------
  // GOOGLE LOGIN
  // ---------------------------
  const handleProviderLogin = async (provider) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const payload = buildOAuthPayload(firebaseUser);

      const response = await axios.post(
        "http://localhost:5000/api/auth/save-user",
        payload
      );

      await login(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("OAuth Login Error:", error);
      alert(error?.response?.data?.message || error.message || "OAuth login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthExperienceShell
      eyebrow="Welcome Back"
      title="Resume your flight path."
      subtitle="Pick up your route, join sessions, and let your Build Companion help you defend each decision with clarity."
    >
      <div>
        <h2 className="text-2xl font-black text-[#1e1145]">Log in</h2>
        <p className="mt-2 text-sm text-[#7b70a0]">
          Continue your AlgoNest preparation.
        </p>

        <div className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl border border-purple-100 bg-white/90 shadow-[0_12px_30px_rgba(107,70,193,0.08)] focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-100 outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl border border-purple-100 bg-white/90 shadow-[0_12px_30px_rgba(107,70,193,0.08)] focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-100 outline-none text-sm"
          />
        </div>

        <button
          onClick={handleEmailLogin}
          disabled={submitting}
          className="mt-5 w-full py-3.5 rounded-2xl text-white font-bold shadow-[0_20px_40px_rgba(107,70,193,0.24)] hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}
        >
          {submitting ? "Logging in..." : "Launch Dashboard"}
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="mt-3 w-full py-3.5 rounded-2xl font-bold border border-purple-100 text-[#6b46c1] bg-[#f7f3ff] hover:bg-[#f0eaff] transition"
        >
          Create a new account
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-purple-100" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#a49bc5]">
            or
          </span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleProviderLogin(googleProvider)}
            disabled={submitting}
            className="w-full border border-purple-100 py-3.5 rounded-2xl flex items-center justify-center gap-3 bg-white hover:bg-purple-50 transition disabled:opacity-70"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-semibold text-sm text-gray-700">Google</span>
          </button>

          <button
            onClick={() => handleProviderLogin(githubProvider)}
            disabled={submitting}
            className="w-full border border-purple-100 py-3.5 rounded-2xl flex items-center justify-center gap-3 bg-white hover:bg-purple-50 transition disabled:opacity-70"
          >
            <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
            <span className="font-semibold text-sm text-gray-700">GitHub</span>
          </button>
        </div>
      </div>
    </AuthExperienceShell>
  );
}
