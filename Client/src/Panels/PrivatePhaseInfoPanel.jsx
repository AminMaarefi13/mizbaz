import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function PrivatePhaseInfoPanel() {
  const { userState } = useGameContext();
  // const { phaseData } = gameState;
  const { privatePhaseData } = userState;
  // const [confirmed, setConfirmed] = useState(false);
  const { title, message } = privatePhaseData;
  // console.log(privatePhaseData);
  // const handleConfirm = () => {
  //   socket.emit("phase_seen", {
  //     gameId: currentGameId,
  //     playerId,
  //   });

  //   setConfirmed(true);
  // };

  return (
    <div className="mb-6 p-4 border border-indigo-500 rounded bg-indigo-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">پیام مخفی شما</h2>
      {/* <h2 className="text-xl font-bold mb-4 text-indigo-700">{title}</h2> */}

      {/* {message && <p className="mb-4 text-sm text-gray-800">{message}</p>} */}
      {message && (
        <div className="mb-4 p-3 bg-white rounded border border-gray-300 text-gray-800 shadow-inner">
          {message}
        </div>
      )}

      {/* <HoldToConfirmButton
        label="دیدم"
        onConfirm={handleConfirm}
        disabled={confirmed}
      /> */}
    </div>
  );
}
