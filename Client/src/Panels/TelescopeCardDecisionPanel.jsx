import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function TelescopeCardDecisionPanel() {
  const { userState, connectionState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const [decision, setDecision] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { card } = privatePhaseData;
  console.log(card);

  const handleConfirm = () => {
    if (!decision) {
      alert("لطفاً تصمیم خود را انتخاب کنید.");
      return;
    }

    // socket.emit("telescope_card_decision", {
    //   gameId: currentGameId,
    //   playerId,
    //   decision, // "keep" or "discard"
    // });
    const payload = {
      playerId,
      decision, // "keep" or "discard"
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });

    setConfirmed(true);
  };

  return (
    <div className="mb-6 p-4 border border-purple-500 rounded bg-purple-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-purple-700">
        🔭 تصمیم در مورد کارت تلسکوپ
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        شما کارت زیر را مشاهده کردید. آیا می‌خواهید آن را در بالای Deck نگه
        دارید یا به دریا بیندازید؟
      </p>

      <div className="flex justify-center mb-4">
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

      <div className="flex gap-4 justify-center mb-6">
        <button
          className={`px-4 py-2 rounded border transition ${
            decision === "keep"
              ? "bg-green-500 text-white border-green-700"
              : "bg-white text-green-700 border-green-500 hover:bg-green-100"
          }`}
          onClick={() => setDecision("keep")}
          disabled={confirmed}
        >
          نگه داشتن در بالای دسته
        </button>

        <button
          className={`px-4 py-2 rounded border transition ${
            decision === "discard"
              ? "bg-red-500 text-white border-red-700"
              : "bg-white text-red-700 border-red-500 hover:bg-red-100"
          }`}
          onClick={() => setDecision("discard")}
          disabled={confirmed}
        >
          انداختن به دریا
        </button>
      </div>

      <HoldToConfirmButton
        label="تایید تصمیم"
        onConfirm={handleConfirm}
        disabled={!decision || confirmed}
      />
    </div>
  );
}
