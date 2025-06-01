import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function CultRitualChoicePanel() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [revealedCard, setRevealedCard] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { connectionState, userState, gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const { options } = privatePhaseData;
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
      chosenCard,
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
  };

  if (playerId !== gameState.captainId) return null;

  return (
    <div className="p-4 border border-purple-500 rounded bg-purple-50 shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-purple-700">
        🔮 انتخاب کارت مراسم فرقه‌ای
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        یکی از کارت‌های مخفی زیر را انتخاب کنید.
      </p>

      <div className="flex gap-6 justify-center flex-wrap">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`w-24 h-36 flex justify-center items-center rounded-lg border-2 cursor-pointer transition-all ${
              selectedIndex === index
                ? "border-purple-600 scale-110"
                : "border-gray-300 hover:scale-105"
            } ${confirmed ? "cursor-default" : ""}`}
            onClick={() => handleSelect(index)}
          >
            <div className="w-full h-full bg-gray-400 rounded flex justify-center items-center text-lg font-bold text-white">
              {confirmed && selectedIndex === index
                ? revealedCard.toUpperCase()
                : "❓"}
            </div>
          </div>
        ))}
      </div>

      {!confirmed && (
        <div className="mt-6 text-center">
          <HoldToConfirmButton
            label="تایید انتخاب"
            onConfirm={handleConfirm}
            disabled={selectedIndex === null}
          />
        </div>
      )}

      {confirmed && (
        <p className="mt-4 text-center text-sm text-purple-600">
          کارت انتخاب شد و ارسال گردید.
        </p>
      )}
    </div>
  );
}
