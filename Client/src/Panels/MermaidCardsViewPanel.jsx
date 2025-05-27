import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function MermaidCardsViewPanel() {
  const { connectionState, userState } = useGameContext();
  const { currentGameId, privatePhaseData } = userState;
  const { playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { cards } = privatePhaseData;
  console.log(cards);
  const handleConfirm = () => {
    // socket.emit("mermaid_cards_seen", {
    //   gameId: currentGameId,
    //   playerId,
    // });
    const payload = {
      playerId,
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });

    setConfirmed(true);
  };

  return (
    <div className="mb-6 p-4 border border-cyan-500 rounded bg-cyan-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-cyan-700">
        🧜 مشاهده کارت‌های انداخته‌شده
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        شما به عنوان بازیکن انتخاب‌شده توسط کاپیتان، سه کارت آخر انداخته‌شده را
        می‌بینید. این اطلاعات را فقط شما مشاهده می‌کنید.
      </p>

      <div className="flex justify-center gap-4 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
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
        ))}
      </div>

      <HoldToConfirmButton
        label="دیدم"
        onConfirm={handleConfirm}
        disabled={confirmed}
      />
    </div>
  );
}
