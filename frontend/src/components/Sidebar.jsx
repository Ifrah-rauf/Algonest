import {
  LayoutDashboard,
  Map,
  ShoppingBag,
  Users,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
export default function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "my-roadmaps", label: "My Roadmaps", icon: Map },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "students", label: "Students", icon: Users },
    { id: "earnings", label: "Earnings", icon: DollarSign },
  ];
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/");
  }
  return (
    <aside
      className="
        fixed left-0 top-[6%]
        h-screen w-[20%]
        bg-gray-900 text-white
        flex flex-col
      "
    >
      {/* ================= HEADER ================= */}

      {/* ================= NAV ================= */}
      <nav className="relative flex p-4 overflow-y-auto mt-[30%] flex-wrap">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors
                ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden md:inline text-sm font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors mb-2">
          <Settings className="w-5 h-5" />
          <span className="hidden md:inline text-sm">Settings</span>
        </button>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ">
          <LogOut className="w-5 h-5" />
          <span className="hidden md:inline text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
