import {
  LayoutDashboard,
  Map,
  FileText,
  Users,
  DollarSign,
  Settings,
  UserCog,
  LogOut,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: "overview", label: "Overview", shortLabel: "Overview", icon: LayoutDashboard },
    { id: "my-roadmaps", label: "My Roadmaps", shortLabel: "Roadmaps", icon: Map },
    { id: "content", label: "Content", shortLabel: "Content", icon: FileText },
    { id: "students", label: "Students", shortLabel: "Students", icon: Users },
    { id: "earnings", label: "Earnings", shortLabel: "Earnings", icon: DollarSign },
    { id: "edit-avail", label: "Edit Availability", shortLabel: "Avail.", icon: CalendarDays },
    { id: "edit-profile", label: "Edit Profile", shortLabel: "Profile", icon: UserCog },
    { id: "settings", label: "Settings", shortLabel: "Settings", icon: Settings },
  ];

  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
      <aside className="hidden md:flex fixed left-0 top-[6%] h-screen w-[20%] bg-gray-900 text-white flex-col z-50">
        <nav className="flex-1 p-4 mt-[30%] overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-left
                  ${isActive ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM BAR (hidden on md+) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-800 px-2 py-1">
        <div
          className="flex items-center gap-1  overflow-x-scroll scrollbar-thin scrollbar-thumb-sky-700 scrollbar-track-sky-100"
          // style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg shrink-0 transition-colors min-w-[52px]
                  ${isActive ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] leading-none whitespace-nowrap">{item.shortLabel}</span>
              </button>
            );
          })}

          {/* Logout at end of scroll */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg shrink-0 transition-colors min-w-[52px] text-red-400 hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] leading-none">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
