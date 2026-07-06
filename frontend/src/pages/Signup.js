import { apiUrl } from "../config/api.js";
import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthExperienceShell from "../components/AuthExperienceShell";
import { auth, githubProvider, googleProvider } from "../config/firebaseAuth";
import githubIcon from "../static/github.png";

function buildOAuthPayload(firebaseUser, role) {
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
    role,
  };
}

function getPasswordErrors(password) {
  const checks = [
    { valid: password.length >= 8, message: "at least 8 characters" },
    { valid: /[A-Z]/.test(password), message: "one uppercase letter" },
    { valid: /[a-z]/.test(password), message: "one lowercase letter" },
    { valid: /\d/.test(password), message: "one number" },
    { valid: /[^A-Za-z0-9]/.test(password), message: "one special character" },
  ];

  return checks.filter((check) => !check.valid).map((check) => check.message);
}

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const passwordErrors = getPasswordErrors(password);

  const handleProviderSignup = async (provider) => {
    if (submitting) return;

    try {
      setFormError("");
      setSubmitting(true);
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const payload = buildOAuthPayload(firebaseUser, role);

      const response = await axios.post(
        apiUrl("/api/auth/save-user"),
        payload
      );

      const authUser = await login({ ...response.data.user, token: response.data.token, refreshToken: response.data.refreshToken });
      if (authUser?.uid) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("OAuth Signup Error:", error);
      setFormError(error?.response?.data?.message || error.message || "OAuth signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // EMAIL SIGNUP
  const handleSignup = async () => {
    if (submitting) return;
    setFormError("");

    if (!username.trim() || !mail.trim() || !password.trim()) {
      setFormError("Please fill all fields.");
      return;
    }

    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }

    if (passwordErrors.length > 0) {
      setFormError(`Password must include ${passwordErrors.join(", ")}.`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(apiUrl("/api/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          mail: mail.trim(),
          password,
          role,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        const authUser = await login({ ...data.user, token: data.token, refreshToken: data.refreshToken });
        if (authUser?.uid) {
          navigate("/dashboard");
        }
      } else if (data.message === "Email already exists") {
        setFormError("Account exists. Please login.");
        navigate("/login");
      } else {
        setFormError(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setFormError(error.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthExperienceShell
      eyebrow="Start Your Journey"
      title="Send your career skyward."
      subtitle="Choose your role, create your profile, and enter an assessment system designed to help you prove with momentum and mentorship."
    >
      <div>
        <h2 className="text-2xl font-black text-[#1e1145]">Create account</h2>
        <p className="mt-2 text-sm text-[#7b70a0]">
          Build your student or mentor profile.
        </p>
        {formError && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {formError}
          </div>
        )}

        <div className="mt-6 grid lg:grid-cols-[1.45fr_1fr] gap-5 items-start">
          <div className="space-y-3">
            <label className="sr-only" htmlFor="signup-username">
              Username
            </label>
            <input
              id="signup-username"
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-purple-100 bg-white/90 shadow-[0_12px_30px_rgba(107,70,193,0.08)] focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-100 outline-none text-sm"
            />

            <label className="sr-only" htmlFor="signup-email">
              Email address
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="Email address"
              value={mail}
              autoComplete="email"
              onChange={(e) => setMail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-purple-100 bg-white/90 shadow-[0_12px_30px_rgba(107,70,193,0.08)] focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-100 outline-none text-sm"
            />

            <label className="sr-only" htmlFor="signup-password">
              Password
            </label>
            {password && passwordErrors.length > 0 && (
              <p className="text-xs text-[#8b6f2d]">
                Missing: {passwordErrors.join(", ")}.
              </p>
            )}
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-purple-100 bg-white/90 shadow-[0_12px_30px_rgba(107,70,193,0.08)] focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-100 outline-none text-sm"
            />

            <label className="sr-only" htmlFor="signup-confirm-password">
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              autoComplete="new-password"
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-purple-100 bg-white/90 shadow-[0_12px_30px_rgba(107,70,193,0.08)] focus:border-[#8b5cf6] focus:ring-4 focus:ring-purple-100 outline-none text-sm"
            />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#f6f2ff] border border-purple-100">
              {[
                { value: "STUDENT", label: "Student" },
                { value: "TEACHER", label: "Teacher" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRole(item.value)}
                  className={`py-3 rounded-xl font-bold text-sm transition ${
                    role === item.value
                      ? "bg-white text-[#6b46c1] shadow-[0_10px_20px_rgba(107,70,193,0.14)]"
                      : "text-[#867ca8] hover:text-[#6b46c1]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSignup}
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl text-white font-bold shadow-[0_20px_40px_rgba(107,70,193,0.24)] hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}
            >
              {submitting ? "Creating..." : "Create Account"}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-2xl font-bold border border-purple-100 text-[#6b46c1] bg-[#f7f3ff] hover:bg-[#f0eaff] transition"
            >
              Login Instead
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-purple-100" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#a49bc5]">
                or
              </span>
              <div className="flex-1 h-px bg-purple-100" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleProviderSignup(googleProvider)}
                disabled={submitting}
                className="w-full border border-purple-100 py-3 rounded-2xl flex items-center justify-center gap-2 bg-white hover:bg-purple-50 transition disabled:opacity-70"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="font-semibold text-sm text-gray-700">Google</span>
              </button>

              <button
                onClick={() => handleProviderSignup(githubProvider)}
                disabled={submitting}
                className="w-full border border-purple-100 py-3 rounded-2xl flex items-center justify-center gap-2 bg-white hover:bg-purple-50 transition disabled:opacity-70"
              >
                <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
                <span className="font-semibold text-sm text-gray-700">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthExperienceShell>
  );
}
