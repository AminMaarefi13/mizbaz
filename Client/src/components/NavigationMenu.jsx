import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useGameContext } from "../context/GameContext";

const NavigationMenu = () => {
  const location = useLocation();
  const { gameState } = useGameContext(); // فرض بر این است که gameState در context هست

  const navItems = [
    { label: "🏠 Home", path: "/" },
    { label: "⚙️ Login", path: "/login" },
    { label: "👥 Friends", path: "/friends" },
    { label: "🗺️ Lobby", path: "/lobby" },
    gameState && gameState.gameId
      ? { label: "🎲 Game", path: `/game/${gameState.gameId}` }
      : null,
    gameState && gameState.gameId ? { label: "🗺️ Map", path: "/map" } : null,
    { label: "👥 Players", path: "/players" },
    { label: "⚙️ Settings", path: "/settings" },
  ].filter(Boolean); // حذف آیتم‌های null

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
