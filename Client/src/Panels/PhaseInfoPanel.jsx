import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useEffect } from "react";
import ProgressBar from "../UI/ProgressBar";

export default function PhaseInfoPanel() {
  const { userState, gameState, connectionState } = useGameContext();
  const { phaseData } = gameState;
  const { eliminated } = userState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { title, message, phaseSeen } = phaseData;
  // console.log(phaseData);

  useEffect(() => {
    setConfirmed(false);
  }, [title, message]);

  const handleConfirm = () => {
    socket.emit("phase_seen", {
      gameId: currentGameId,
    });

    setConfirmed(true);
  };

  return (
    <div className="mb-6 p-4 border border-indigo-500 rounded bg-indigo-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">{title}</h2>
      {/* {message && <p className="mb-4 text-sm text-gray-800">{message}</p>} */}

      {message && (
        <div className="mb-4 p-3 bg-white rounded border border-gray-300 text-gray-800 shadow-inner">
          {message}
        </div>
      )}

      {phaseData?.type === "see" && !eliminated && (
        <HoldToConfirmButton
          key={title + message}
          label="دیدم"
          onConfirm={handleConfirm}
          disabled={
            confirmed ||
            (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
          }
        />
      )}
    </div>
  );
}
