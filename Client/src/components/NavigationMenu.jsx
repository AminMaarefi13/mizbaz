import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationMenu = () => {
  const location = useLocation();

  const navItems = [
    { label: "🏠 Home", path: "/" },
    { label: "⚙️ Login", path: "/login" },
    { label: "👥 Friends", path: "/Signup" },
    { label: "🗺️ Lobby", path: "/lobby" },
    { label: "🎲 Game", path: "/game" },
    { label: "🗺️ Map", path: "/map" },
    { label: "👥 Players", path: "/players" },
    { label: "⚙️ Settings", path: "/settings" },
  ];

  return (
    <nav className="flex justify-around bg-gray-950 text-white text-xs border-t border-gray-700 py-3">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-1 rounded-lg transition ${
            location.pathname === item.path
              ? "bg-blue-600 text-white font-semibold shadow"
              : "text-gray-400 hover:text-blue-400"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavigationMenu;
