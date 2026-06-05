import "../styles/home.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import BookPlan from "../pages/BookPlan";
import userimg from "../static/user.png";
import logo from "../static/logo.png";
import { Mail, Send, X } from "lucide-react";

const NAV_LINKS = [
  { label: "How to start", href: "/#howitworks", type: "a" },
  { label: "Roadmaps", href: "/roadmaps", type: "a" },
  { label: "Teachers", href: "/teachers", type: "link" },
];

const Navbar = ({ sidebarOpen = false, onSidebarToggle = null }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTeacherQuery, setShowTeacherQuery] = useState(false);
  const [querySubject, setQuerySubject] = useState("");
  const [queryBody, setQueryBody] = useState("");
  const [querySending, setQuerySending] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");

  const isTeacher = user?.role === "TEACHER";
  const navLinks = NAV_LINKS;

  async function book(planId) {
    if (!user) {
      navigate("/signup");
      return;
    }
    setSelectedPlan(planId);
    setShowModal(true);
  }

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  async function handleTeacherQuerySend() {
    if (!user?.uid) {
      setQueryMessage("Please log in again to send your query.");
      return;
    }

    if (!querySubject.trim() || !queryBody.trim()) {
      setQueryMessage("Please add both a subject and a message.");
      return;
    }

    try {
      setQuerySending(true);
      setQueryMessage("");
      const res = await fetch("http://localhost:5000/api/support/teacher-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          subject: querySubject.trim(),
          body: queryBody.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to send query");

      setQueryMessage("Message sent successfully.");
      setQuerySubject("");
      setQueryBody("");
      setShowTeacherQuery(false);
      setMenuOpen(false);
    } catch (error) {
      setQueryMessage(error.message || "Failed to send query.");
    } finally {
      setQuerySending(false);
    }
  }

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div
          className={`h-12 flex items-center justify-between ${
            onSidebarToggle ? "w-full px-3" : "max-w-7xl mx-auto px-5"
          }`}
        >
          <div className="flex items-center gap-3 flex-shrink-0">
            {onSidebarToggle && (
              <button
                type="button"
                onClick={onSidebarToggle}
                className="flex flex-col gap-1 p-1.5 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors"
                aria-label="Toggle roadmap sidebar"
              >
                <span
                  className={`block w-5 h-0.5 transition-all duration-200 ${
                    sidebarOpen ? "rotate-45 translate-y-2 bg-purple-700" : "bg-gray-700"
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 transition-all duration-200 ${
                    sidebarOpen ? "opacity-0 bg-purple-700" : "bg-gray-700"
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 transition-all duration-200 ${
                    sidebarOpen ? "-rotate-45 -translate-y-2 bg-purple-700" : "bg-gray-700"
                  }`}
                />
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={logo} alt="AlgoNest logo" className="h-6 w-auto" />
              <p className="text-[#7C3AED] font-bold text-base">Algo
                <span className="text-yellow-500 font-bold text-base">Nest</span>
              </p>
            </Link>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((l) =>
              l.type === "a" ? (
                <a key={l.label} href={l.href}
                  className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} to={l.href}
                className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  {l.label}
                </Link>
              )
            )}
            {!isTeacher && (
              <>
                <button
                  onClick={() => book(0)}
                  className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  Consult
                </button>
                <Link to="/careerQuiz"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-purple-50"
                  style={{ color: "#7C3AED", borderColor: "#DDD6FE", background: "#F3EEFF" }}>
                  Take Career Quiz
                </Link>
              </>
            )}
            {isTeacher && (
              <button
                type="button"
                onClick={() => {
                  setQueryMessage("");
                  setShowTeacherQuery(true);
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-purple-50"
                style={{ color: "#7C3AED", borderColor: "#DDD6FE", background: "#F3EEFF" }}
              >
                <Mail className="w-4 h-4" />
                Teacher Query
              </button>
            )}

            {user?.username ? (
              <div className="flex items-center gap-2">
                {/* <Link to="/dashboard"
                  className="flex items-center justify-center px-2.5 py-1 rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                  <img src={userimg} alt="User" className="w-4 h-4 rounded-full object-cover" />
                </Link> */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-grey-600 text-grey-600 hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/signup"
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}>
                Sign Up
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) =>
              l.type === "a" ? (
                <a key={l.label} href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} to={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  {l.label}
                </Link>
              )
            )}
            {!isTeacher && (
              <button onClick={() => { book(0); setMenuOpen(false); }}
                className="text-left text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Consult
              </button>
            )}
            {isTeacher && (
              <button
                type="button"
                onClick={() => {
                  setQueryMessage("");
                  setShowTeacherQuery(true);
                  setMenuOpen(false);
                }}
                className="text-left text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Teacher Query
              </button>
            )}

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              {!isTeacher && (
                <Link to="/careerQuiz" onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-center px-4 py-2.5 rounded-lg border"
                  style={{ color: "#7C3AED", borderColor: "#DDD6FE", background: "#F3EEFF" }}>
                  Take Career Quiz
                </Link>
              )}

              {user?.username ? (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200">
                    <img src={userimg} alt="User" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-sm font-medium text-gray-700">Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm font-semibold text-center px-4 py-2.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/signup" onClick={() => setMenuOpen(false)}
                  className="text-sm font-bold text-center px-4 py-2.5 rounded-lg text-white"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}>
                  Sign Up
                </Link>
              )}
            </div>
        </div>
      )}
    </nav>

      {/* BookPlan modal */}
      {showModal && (
        <BookPlan plan={selectedPlan} onClose={() => setShowModal(false)} />
      )}

      {/* Teacher query modal */}
      {showTeacherQuery && isTeacher && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Teacher Query</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Send your question to the AlgoNest team. Replies can be handled from the Gmail inbox.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTeacherQuery(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close teacher query"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <input
                type="text"
                value={querySubject}
                onChange={(e) => setQuerySubject(e.target.value)}
                placeholder="Subject"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
              <textarea
                value={queryBody}
                onChange={(e) => setQueryBody(e.target.value)}
                placeholder="Write your message..."
                rows={6}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              {queryMessage && (
                <p className="text-sm text-gray-600">{queryMessage}</p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTeacherQuerySend}
                  disabled={querySending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                >
                  <Send className="w-4 h-4" />
                  {querySending ? "Sending..." : "Send"}
                </button>
                <span className="text-xs text-gray-500">
                  Sent to {process.env.REACT_APP_SENDER_MAIL || "algonest.edtech@gmail.com"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
