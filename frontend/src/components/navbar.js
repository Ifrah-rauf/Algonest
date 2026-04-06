import "../styles/home.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import BookPlan from "../pages/BookPlan";
import userimg from "../static/user.png";
import logo from "../static/logo.png";

const NAV_LINKS = [
  { label: "How it works", href: "/#howitworks", type: "a" },
  { label: "Roadmaps", href: "/roadmaps", type: "a" },
  { label: "Teachers", href: "/teachers", type: "link" },
];

const Navbar = ({ sidebarOpen = false, onSidebarToggle = null }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
            {NAV_LINKS.map((l) =>
              l.type === "a" ? (
                <a key={l.label} href={l.href}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} to={l.href}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  {l.label}
                </Link>
              )
            )}
            <button
              onClick={() => book(0)}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
              Consult
            </button>
            <Link to="/careerQuiz"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-purple-50"
              style={{ color: "#7C3AED", borderColor: "#DDD6FE", background: "#F3EEFF" }}>
              Take Career Quiz
            </Link>

            {user?.username ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard"
                  className="flex items-center justify-center px-2.5 py-1 rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                  <img src={userimg} alt="User" className="w-4 h-4 rounded-full object-cover" />
                </Link>
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
            {NAV_LINKS.map((l) =>
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
            <button onClick={() => { book(0); setMenuOpen(false); }}
              className="text-left text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Consult
            </button>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <Link to="/careerQuiz" onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-center px-4 py-2.5 rounded-lg border"
                style={{ color: "#7C3AED", borderColor: "#DDD6FE", background: "#F3EEFF" }}>
                Take Career Quiz
              </Link>

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
    </>
  );
};

export default Navbar;
