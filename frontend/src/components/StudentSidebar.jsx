import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  BookOpen,
  Flame,
} from "lucide-react";

const C = {
  purple: "#6b46c1",
  purpleDark: "#4c1d95",
  purpleLight: "#f3eeff",
  ink: "#21153f",
  muted: "#766f8e",
  border: "#e8e1f5",
  bg: "#faf8ff",
  white: "#ffffff",
};

const font = "'Trebuchet MS', 'Trebuchet', sans-serif";

export default function StudentSidebar() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      id: "projects",
      label: "Projects",
      icon: FolderOpen,
      path: "/roadmaps",
      description: "Your learning roadmaps",
    },
    {
      id: "cscore",
      label: "CS Core",
      icon: BookOpen,
      path: "/cscore",
      description: "Fundamentals & DSA",
    },
    {
      id: "grill",
      label: "Grill",
      icon: Flame,
      path: "/grill",
      description: "Mock interviews",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    // prevent body scroll when mobile sidebar is open
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function SidebarContent({ compact = false, onClose }) {
    return (
      <div className={`flex flex-col h-full`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: C.border }}>
          {!compact && (
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: C.purple }}
              >
                ✓
              </div>
              <span className="font-semibold text-sm" style={{ color: C.ink }}>
                AlgoNest
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {!onClose && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-lg transition hover:bg-gray-100 hidden md:inline-flex"
                style={{ color: C.muted }}
              >
                {isExpanded ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
            )}
            {onClose ? (
              <button
                onClick={onClose}
                className="p-1 rounded-lg transition hover:bg-gray-100"
                style={{ color: C.muted }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigation(item.path);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  !compact
                    ? "justify-start hover:bg-gray-50"
                    : "justify-center"
                }`}
                style={{
                  color: C.ink,
                  border: `1px solid ${C.border}`,
                }}
                title={!compact ? item.description : ""}
              >
                <Icon className="h-5 w-5 flex-shrink-0" style={{ color: C.purple }} />
                {!compact && (
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold" style={{ color: C.ink }}>
                      {item.label}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: C.muted }}
                    >
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        {!compact && (
          <div
            className="p-4 border-t text-xs text-center"
            style={{
              borderColor: C.border,
              color: C.muted,
            }}
          >
            <div>Build. Learn. Prove.</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Desktop / Tablet sidebar */}
      <div className={`hidden md:flex sticky top-0 h-screen flex-col transition-all duration-300 ${isExpanded ? "w-64" : "w-20"}`} style={{ background: C.white, borderRight: `1px solid ${C.border}`, fontFamily: font }}>
        <SidebarContent compact={!isExpanded} />
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-lg p-2 shadow-lg"
        style={{ background: C.white, border: `1px solid ${C.border}`, color: C.purple }}
        aria-label="Open sidebar"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl md:hidden" style={{ borderRight: `1px solid ${C.border}` }}>
            <SidebarContent compact={false} onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
