import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function FloggingChoicePanel() {
  const { userState, gameState, connectionState } = useGameContext();
  const { privatePhaseData } = userState;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [revealedCard, setRevealedCard] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { currentGameId, playerId } = connectionState;
  // console.log(privatePhaseData);
  const isCaptain = playerId === gameState.captainId;
  const { options, targetPlayerId } = privatePhaseData;
  const cards = options;

  const handleSelect = (index) => {
    if (confirmed) return;
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) return;

    const chosenCard = cards[selectedIndex];
    setRevealedCard(chosenCard);
    setConfirmed(true);
    const payload = {
      targetPlayerId,
      chosenCard,
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });

  };

  if (!isCaptain) return null;

  return (
    <div className="p-4 border border-yellow-500 rounded bg-yellow-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-yellow-700">
        🏴‍☠️ انتخاب کارت شلاق
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        یکی از کارت‌های زیر را انتخاب کنید تا مشخص شود{" "}
        {gameState.players.find((p) => p.id === targetPlayerId)?.name} قطعاً چه
        نقشی ندارد.
      </p>

      <div className="flex gap-6 justify-center">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`w-24 h-36 flex justify-center items-center rounded-lg border-2 cursor-pointer transition-all ${
              selectedIndex === index
                ? "border-yellow-600 scale-110"
                : "border-gray-300 hover:scale-105"
            } ${confirmed ? "cursor-default" : ""}`}
            onClick={() => handleSelect(index)}
          >
            <div className="w-full h-full bg-gray-300 rounded flex justify-center items-center text-lg font-bold text-white">
              {confirmed && selectedIndex === index
                ? // کارت انتخاب‌شده را نشان بده
                  revealedCard.toUpperCase()
                : // پشت کارت
                  "❓"}
            </div>
          </div>
        ))}
      </div>

      {!confirmed && (
        <div className="mt-6 text-center">
          <div className="mt-6">
            <HoldToConfirmButton
              label="تایید انتخاب"
              onConfirm={handleConfirm}
              disabled={selectedIndex === null || confirmed}
            />
          </div>
        </div>
      )}
    </div>
  );
}
