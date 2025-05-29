import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function MermaidOrTelescopePanel() {
  const { connectionState, userState, gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentPhase } = gameState;
  const { currentGameId } = connectionState;

  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const { selectablePlayers } = privatePhaseData;
  // console.log(selectablePlayers);
  // console.log(currentPhase);
  const typeLabel = currentPhase === "mermaid" ? "🧜‍♀️ پری دریایی" : "🔭 تلسکوپ";
  const title =
    currentPhase === "mermaid"
      ? "یک بازیکن را برای استفاده از پری دریایی انتخاب کنید."
      : "یک بازیکن را برای استفاده از تلسکوپ انتخاب کنید.";
  const buttonLabel =
    currentPhase === "mermaid"
      ? "انتخاب برای پری دریایی"
      : "انتخاب برای تلسکوپ";

  const handleConfirmChoice = () => {
    if (!selectedPlayerId) {
      alert("لطفاً یک بازیکن را انتخاب کنید.");
      return;
    }
    // socket.emit("confirm_mermaid_or_telescope_choice", {
    //   gameId: currentGameId,
    //   targetPlayerId: selectedPlayerId,
    //   type,
    // });
    const payload = {
      targetPlayerId: selectedPlayerId,
      type: currentPhase,
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  return (
    <div className="mb-6 p-4 border border-indigo-500 rounded bg-indigo-50 shadow">
      <h2 className="text-xl font-bold mb-4">{typeLabel} انتخاب بازیکن</h2>
      <p className="mb-3 text-sm text-gray-700">{title}</p>
      <ul className="space-y-2">
        {selectablePlayers?.map((p) => {
          const isSelected = selectedPlayerId === p.id;

          return (
            <li
              key={p.id}
              className={`p-2 rounded border flex justify-between items-center ${
                p.disabled
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "hover:bg-purple-50"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-gray-600 mt-1">
                  صندلی #{p.seat + 1}
                </span>
                {p.disabled && (
                  <div className="text-xs text-red-500 mt-1">
                    {p.disabledReason}
                  </div>
                )}
              </div>

              {!p.disabled && (
                <button
                  onClick={() => {
                    if (!confirmed) setSelectedPlayerId(p.id);
                  }}
                  className={`px-3 py-1 text-sm rounded border ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "border-indigo-600 text-indigo-700"
                  }`}
                >
                  {buttonLabel}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <HoldToConfirmButton
        label="تایید نهایی"
        onConfirm={handleConfirmChoice}
        disabled={!selectedPlayerId || confirmed}
      />
    </div>
  );
}
