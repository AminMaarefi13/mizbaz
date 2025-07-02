import React from "react";
import { canBuyDevCard } from "./canBuyDevCard";
import CardAnimatedBorder from "./CardAnimatedBorder";

const ABILITY_META = {
  turn: {
    text: "🔄",
    label: "نوبت دوباره",
  },
  ["take-second-same"]: {
    text: "💠",
    label: "برداشتن چیپ از همان رنگ",
  },
  joker: {
    text: "🃏",
    label: "جوکر",
  },
  privilege: {
    text: "🎟",
    label: "کتیبه",
  },
  steal: {
    text: "🤏",
    label: "گرفتن چیپ از بازیکن مقابل",
  },
};
const COLOR_META = {
  white: {
    bg: "bg-gradient-to-br from-gray-100 to-gray-300",
    border: "border-gray-400",
    text: "text-gray-700",
    label: "سفید",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-300 to-blue-600",
    border: "border-blue-500",
    text: "text-blue-900",
    label: "آبی",
  },
  green: {
    bg: "bg-gradient-to-br from-green-300 to-green-600",
    border: "border-green-500",
    text: "text-green-900",
    label: "سبز",
  },
  red: {
    bg: "bg-gradient-to-br from-red-300 to-red-600",
    border: "border-red-500",
    text: "text-gray-900",
    label: "قرمز",
  },
  black: {
    bg: "bg-gradient-to-br from-gray-700 to-black",
    border: "border-gray-700",
    text: "text-white",
    label: "مشکی",
  },
  yellow: {
    bg: "bg-gradient-to-br from-yellow-200 to-yellow-400",
    border: "border-yellow-400",
    text: "text-yellow-900",
    label: "زرد",
  },
  gray: {
    bg: "bg-gradient-to-br from-gray-200 to-gray-400",
    border: "border-gray-400",
    text: "text-gray-700",
    label: "خاکستری",
  },
  pearl: {
    bg: "bg-gradient-to-br from-pink-200 to-pink-400",
    border: "border-pink-400",
    text: "text-pink-700",
    label: "صورتی",
  },
  joker: {
    bg: "bg-gradient-to-br from-blue-800 to-red-800 ",
    border: "border-yellow-400",
    text: "text-green-700",
    label: "جوکر",
  },
  points: {
    bg: "bg-gradient-to-br from-green-800 to-yellow-800",
    border: "border-red-400",
    text: "text-blue-700",
    label: "امتیاز",
  },
};

export default function DevCard({
  color = "blue",
  cost = {},
  prestigePoints = 0,
  level,
  crowns,
  ability,
  bonus,
  selected = false,
  onClick,
  disabled = false,
  className = "",
  children,
  levelIndex, // اگر این prop وجود داشت، کارت سطح است
  amount,
  player,
}) {
  // console.log("key", key);
  const costColors = Object.keys(cost);
  const costColorsBottomUp = [...costColors].reverse();

  const devCard = {
    color,
    cost,
    prestigePoints,
    level,
    crowns,
    ability,
    bonus,
  };
  // console.log(devCard);
  // console.log("level:", levelIndex);
  const { chipsNeededSum, hasEnoughChips, canBuyWithYellow, canBuyJokerCard } =
    canBuyDevCard(devCard, player);

  // اگر level وجود داشت، کارت سطح بساز
  if (levelIndex === 1 || levelIndex === 2 || levelIndex === 3) {
    return (
      <div
        className={`
          relative w-14 h-24 sm:w-20 sm:h-32 rounded-lg flex flex-col justify-center items-center
          font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
          ${COLOR_META.gray.bg} ${COLOR_META.gray.border} ${
          COLOR_META.gray.text
        }
          ${
            selected
              ? "ring-4 ring-yellow-400 scale-110 shadow-2xl"
              : "hover:scale-105"
          }
          ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
          ${className}
        `}
        onClick={disabled ? undefined : onClick}
        tabIndex={disabled ? -1 : 0}
        style={{
          boxShadow: selected
            ? "0 0 16px 4px rgba(251,191,36,0.25)"
            : "0 2px 8px 0 rgba(0,0,0,0.10)",
        }}
      >
        <span
          style={{
            direction: "rtl",
          }}
          className="text-sm sm:text-lg font-extrabold"
        >
          سطح {levelIndex}
        </span>
        <div
          style={{
            direction: "rtl",
          }}
          className="text-sm sm:text-lg font-extrabold"
        >
          {amount} کارت
        </div>
        {/* هاله و نوار چرخان */}
        {!disabled && (
          <span
            className={`
            pointer-events-none absolute -inset-0  rounded-xl border-3
            ${"border-white"}
            z-20
          `}
            style={{
              boxShadow: "0 0 16px 1px #fff",
            }}
          ></span>
        )}
      </div>
    );
  }

  if (color === "unknown") {
    return (
      <div
        className={`
          relative w-14 h-24 sm:w-20 sm:h-32 rounded-lg flex flex-col justify-center items-center
          font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
          ${COLOR_META.gray.bg} ${COLOR_META.gray.border} ${
          COLOR_META.gray.text
        }
          ${
            selected
              ? "ring-4 ring-yellow-400 scale-110 shadow-2xl"
              : "hover:scale-105"
          }
          ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
          ${className}
        `}
        onClick={disabled ? undefined : onClick}
        tabIndex={disabled ? -1 : 0}
        style={{
          boxShadow: selected
            ? "0 0 16px 4px rgba(251,191,36,0.25)"
            : "0 2px 8px 0 rgba(0,0,0,0.10)",
        }}
      >
        <span className="text-lg sm:text-xl font-extrabold">کارت آخر</span>
        <span className="text-lg sm:text-xl font-extrabold">سطح {level}</span>
      </div>
    );
  }

  // کارت معمولی توسعه
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* کارت اصلی */}
      <div
        className={`
          relative w-14 h-24 sm:w-20 sm:h-32 rounded-lg flex flex-col justify-between items-stretch
          font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
          ${COLOR_META[color]?.bg || COLOR_META.blue.bg}
          ${COLOR_META[color]?.border || COLOR_META.blue.border}
          text-white
          ${
            selected
              ? "ring-4 ring-yellow-400 scale-110 shadow-2xl"
              : "hover:scale-105"
          }
          ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
        onClick={disabled ? undefined : onClick}
        tabIndex={disabled ? -1 : 0}
        style={{
          boxShadow: selected
            ? "0 0 16px 4px rgba(251,191,36,0.25)"
            : "0 2px 8px 0 rgba(0,0,0,0.10)",
          backgroundImage:
            color === "joker"
              ? "linear-gradient(60deg, rgb(255 0 0 / 100%), rgb(255 0 0 / 0%) 70.71%), linear-gradient(120deg, rgb(255 255 255 / 100%), rgb(0 255 0 / 0%) 70.71%), linear-gradient(180deg, rgb(0 255 0 / 100%), rgb(0 255 0 / 0%) 70.71%), linear-gradient(240deg, rgb(0 0 255 / 100%), rgb(0 0 255 / 0%) 70.71%), linear-gradient(300deg, rgb(0 0 0 / 100%), rgb(0 0 255 / 0%) 70.71%)"
              : color === "points" &&
                "repeating-linear-gradient( -45deg, white, white 6px, rgb(100 100 255 / 100%) 12px, rgb(100 100 255 / 100%) 13px )",
        }}
      >
        {/* امتیاز بالا سمت چپ */}
        {prestigePoints > 0 && (
          <span className="absolute top-1 left-1 pt-0.5 text-lg sm:text-xl font-bold text-yellow-300 bg-yellow-600 select-none drop-shadow rounded-full  w-6 h-6 flex items-center justify-center">
            {prestigePoints}
          </span>
        )}

        {/* Ability بالا سمت چپ زیر امتیاز */}
        {ability && (
          <span className="absolute  top-8 left-1  pt-0.5 text-lg sm:text-xl font-bold text-yellow-400 select-none drop-shadow w-5 h-5 flex items-center justify-center">
            {ABILITY_META[ability]?.text}
          </span>
        )}

        {/* دو برابر بالا سمت راست */}
        {bonus && (
          <span className="absolute  top-1.5 right-1  pt-0.5 text-sm sm:text-lg font-bold text-gray-200 bg-gray-600 select-none drop-shadow rounded  w-5 h-5 flex items-center justify-center">
            2x
          </span>
        )}

        {/* تاج بالای ability */}
        {crowns > 0 && (
          <span className="absolute  bottom-1 left-1  pt-0.5 text-lg sm:text-xl font-bold text-blue-300 select-none drop-shadow w-5 h-5 flex items-center justify-center">
            👑
          </span>
        )}

        {crowns > 1 && (
          <span className="absolute bottom-5 left-1  pt-0.5 text-lg sm:text-xl font-bold text-yellow-400 select-none drop-shadow w-5 h-5 flex items-center justify-center">
            {crowns}x
          </span>
        )}

        {color === "joker" && ability && (
          <span className="absolute top-14 left-1  pt-0.5 text-lg sm:text-xl font-bold text-yellow-400 select-none drop-shadow w-5 h-5 flex items-center justify-center">
            🃏
          </span>
        )}

        {color === "joker" && !ability && (
          <span className="absolute top-8 left-1  pt-0.5 text-lg sm:text-xl font-bold text-yellow-400 select-none drop-shadow w-5 h-5 flex items-center justify-center">
            🃏
          </span>
        )}
        {/* هزینه‌ها از پایین سمت راست به بالا */}
        <div className="absolute right-1 bottom-1 flex flex-col-reverse items-end gap-0.5 z-10 h-[100%] justify-start w-fit">
          {costColorsBottomUp.map((c) => (
            <div
              key={c}
              className={`flex items-center justify-center w-4 h-5 border  rounded-l-full rounded-r-full border-t-none text-xs text_center ${COLOR_META[c]?.bg} ${COLOR_META[c]?.border} ${COLOR_META[c]?.text} shadow`}
            >
              <div className="font-bold  flex items-center justify-center">
                {cost[c]}
              </div>
            </div>
          ))}
        </div>
        {/* آیکون رنگ کارت (اختیاری) */}
        <div className="flex-1 flex flex-col justify-end items-center pb-2"></div>
        {children}
        {selected && (
          <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded-full shadow font-bold">
            انتخاب شده
          </span>
        )}
      </div>
      {/* هاله و نوار چرخان */}

      {((color === "joker" && canBuyJokerCard) || color !== "joker") &&
        (hasEnoughChips || canBuyWithYellow || chipsNeededSum === 0) && (
          <span
            className={`
            pointer-events-none absolute -inset-0  rounded-xl border-3
            ${hasEnoughChips ? "border-white" : "border-yellow-400"}
            z-20
          `}
            style={{
              boxShadow:
                chipsNeededSum === 0
                  ? "0 0 16px 1px #f18"
                  : hasEnoughChips
                  ? "0 0 16px 1px #fff"
                  : "0 0 px 1px #FFD600",
            }}
          ></span>
        )}
      {((color === "joker" && canBuyJokerCard) || color !== "joker") &&
        (hasEnoughChips || canBuyWithYellow || chipsNeededSum === 0) && (
          <CardAnimatedBorder
            color={
              chipsNeededSum === 0
                ? "#f18"
                : hasEnoughChips
                ? "#fff"
                : "#FFD600"
            }
            glow={true}
            width={55} // یا عرض کارتت
            height={95} // یا ارتفاع کارتت
            borderRadius={12}
            strokeWidth={1.5}
            duration={2.5}
          />
        )}
    </div>
  );
}
