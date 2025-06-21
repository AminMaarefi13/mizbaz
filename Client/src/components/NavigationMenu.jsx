import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useGameContext } from "../context/GameContext";

const NavigationMenu = () => {
  const location = useLocation();
  const { gameState } = useGameContext();

  const navItems = [
    { label: "🏠 خانه", path: "/" },
    { label: "⚙️ ورود", path: "/login" },
    { label: "👥 دوستان", path: "/friends" },
    { label: "🗺️ لابی", path: "/lobby" },
    gameState && gameState.gameId
      ? { label: "🎲 بازی", path: `/game/${gameState.gameId}` }
      : null,
    gameState && gameState.gameId && gameState.type === "feedTheKraken"
      ? ({ label: "🗺️ نقشه", path: "/map" },
        { label: "👥 بازیکنان", path: "/players" })
      : null,

    { label: "⚙️ تنظیمات", path: "/settings" },
  ].filter(Boolean);

  return (
    <nav className="flex justify-around bg-gray-950 text-white text-xs border-t border-gray-700 py-3">
      {navItems.reverse().map((item) => (
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
