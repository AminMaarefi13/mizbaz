import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";

export default function LocationEffectPanel() {
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentPhase } = gameState;
  const { currentGameId } = connectionState;
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const effectType = currentPhase; // مثلاً "cabin_search",

  const handleSelect = (id) => {
    if (confirmed) return;
    setSelectedPlayerId(id);
  };

  const handleConfirm = () => {
    if (!selectedPlayerId) {
      alert("لطفاً یک بازیکن را انتخاب کنید.");
      return;
    }

    const payload = {
      targetPlayerId: selectedPlayerId,
      effectType,
    };
    console.log({
      gameId: currentGameId,
      targetPlayerId: selectedPlayerId,
      effectType,
    });
    socket.emit("phase_confirm", { gameId: currentGameId, payload });

    setConfirmed(true);
  };

  const selectablePlayers = privatePhaseData.selectablePlayers;
  const effectTitles = {
    cabin_search: "🔍 جستجوی کابین",
    off_with_tongue: "😶 بریدن زبان",
    flogging: "💥 شلاق",
    feed_the_kraken: "🦑 قربانی کراکن",
  };

  const effectText = {
    cabin_search: "🔍 دیدن نقش",
    off_with_tongue: "😶 بریدن زبان",
    flogging: "💥 شلاق زدن",
    feed_the_kraken: "🦑 قربانی کراکن",
  };

  return (
    <div className="mb-6 p-4 border border-red-500 rounded bg-red-50 shadow">
      <h2 className="text-xl font-bold mb-4">
        {effectTitles[effectType] || "افکت مکان"}
      </h2>

      <ul className="space-y-2">
        {selectablePlayers.map((p) => {
          const isSelected = selectedPlayerId === p.id;
          const isDisabled = p.disabled;

          return (
            <li
              key={p.id}
              onClick={() => {
                if (!isDisabled) handleSelect(p.id);
              }}
              className={`p-2 rounded border flex justify-between items-center ${
                isDisabled
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : isSelected
                  ? "bg-red-200 border-red-600"
                  : "hover:bg-red-50"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-gray-600 mt-1">
                  صندلی #{p.seat + 1}
                </span>
                {isDisabled && p.disabledReason && (
                  <span className="text-xs text-red-500 mt-1">
                    {p.disabledReason}
                  </span>
                )}
              </div>

              {!isDisabled && isSelected && (
                <span className="text-xs text-red-700 font-bold">
                  {effectText[effectType] || "انتخاب‌شده"}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <HoldToConfirmButton
        label="تأیید نهایی"
        onConfirm={handleConfirm}
        disabled={!selectedPlayerId || confirmed}
      />
    </div>
  );
}
