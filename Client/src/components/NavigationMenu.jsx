import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useGameContext } from "../context/GameContext";

const NavigationMenu = () => {
  const location = useLocation();
  const { gameState } = useGameContext();

  const navItems = [
    { name: "خانه", label: "🏠", path: "/" },
    { name: "ورود", label: "🚪", path: "/login" },
    { name: "دوستان", label: "👥", path: "/friends" },
    { name: "لابی", label: "🎪", path: "/lobby" },
    gameState && gameState.gameId
      ? { name: "بازی", label: "🎲", path: `/game/${gameState.gameId}` }
      : null,
    gameState && gameState.gameId && gameState.type === "feedTheKraken"
      ? { name: "نقشه", label: "🗺️", path: "/map" }
      : null,

    { name: "تنظیمات", label: "⚙️", path: "/settings" },
  ].filter(Boolean);

  return (
    <nav className="flex items-center justify-around bg-gray-950 text-white text-xs border-t border-gray-700 py-1">
      {navItems.reverse().map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center w-16 h-12 px-1 py-4 rounded-lg transition ${
            location.pathname === item.path
              ? "bg-blue-600 text-white font-semibold shadow"
              : "text-gray-400 hover:text-blue-400"
          }`}
        >
          <div className=" text-sm">{item.label}</div>
          <div>{item.name}</div>
        </Link>
      ))}
    </nav>
  );
};

export default NavigationMenu;
