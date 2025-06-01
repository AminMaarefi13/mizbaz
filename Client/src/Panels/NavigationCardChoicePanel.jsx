import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function NavigationCardChoicePanel() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { userState, gameState, connectionState } = useGameContext();
  const { navigatorId } = gameState;
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const [jumped, setJumped] = useState(false);

  const { cards, cabinRole } = privatePhaseData;

  const handleSelect = (index) => {
    if (confirmed || jumped) return;
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) {
      alert("لطفاً یکی از کارت‌ها را انتخاب کنید.");
      return;
    }

    const chosenCard = cards[selectedIndex];
    const payload = {
      emergency: false,
      playerId,
      chosenCard,
      discardedCard: cards[1 - selectedIndex],
      cabinRole,
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  const handleJumpIntoSea = () => {
    const payload = {
      emergency: true,
      playerId,
      chosenCard: cards[0],
      discardedCard: cards[1],
      cabinRole: "navigator",
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });

    setJumped(true);
  };

  return (
    <div className="mb-6 p-4 border border-blue-500 rounded bg-blue-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-700">
        🧭 انتخاب کارت مسیر
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        یکی از کارت‌های زیر را برای ارسال به کشتیران انتخاب کنید. کارت دیگر دور
        ریخته خواهد شد.
      </p>

      <div className="flex gap-4 justify-center">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 shadow cursor-pointer transition-all transform duration-200
              ${
                selectedIndex === index
                  ? "border-blue-600 bg-blue-100 scale-110"
                  : "border-gray-300 hover:scale-105"
              }`}
            onClick={() => handleSelect(index)}
          >
            <div
              className="w-24 h-36 flex flex-col justify-center items-center rounded text-white font-bold text-center shadow-inner"
              style={{
                backgroundColor:
                  card.color === "red"
                    ? "#dc2626"
                    : card.color === "blue"
                    ? "#2563eb"
                    : "#eab308", // yellow
              }}
            >
              <span className="text-sm">نوع:</span>
              <span className="text-lg">{card.type}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <HoldToConfirmButton
          label="تایید انتخاب"
          onConfirm={handleConfirm}
          disabled={selectedIndex === null || confirmed || jumped}
        />

        {playerId === navigatorId && (
          <HoldToConfirmButton
            label="🏊 پریدن به آب"
            onConfirm={handleJumpIntoSea}
            disabled={confirmed || jumped}
          />
        )}
      </div>
    </div>
  );
}
