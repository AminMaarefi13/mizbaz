import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function VoteTieBreakPanel() {
  const [selectedId, setSelectedId] = useState(null);
  const { userState, connectionState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentGameId } = connectionState;

  const [confirmed, setConfirmed] = useState(false);
  const { tiedPlayers } = privatePhaseData;
  // if (
  //   gameState.currentPhase !== "vote_tie_break" ||
  //   !phaseData?.tiedPlayers ||
  //   phaseData.step !== "captain_eliminates_one" ||
  //   gameState.captainId !== playerId
  // ) {
  //   return null;
  // }
  // console.log(tiedPlayers);

  const handleSelect = (id) => {
    if (confirmed) return; // 🔒 جلوگیری از تغییر پس از تأیید
    setSelectedId(id === selectedId ? null : id);
  };

  const handleConfirm = () => {
    if (!selectedId) {
      alert("لطفاً یکی از بازیکنان را انتخاب کنید.");
      return;
    }

    // socket.emit("vote_tie_eliminate_one", {
    //   gameId: currentGameId,
    //   eliminatorId: selectedId,
    //   tiedPlayers: tiedPlayers,
    // });
    const payload = { tiedPlayers: tiedPlayers, eliminatorId: selectedId };
    // console.log({
    //   eliminatorId: selectedId,
    //   tiedPlayers: tiedPlayers,
    // });
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true); // 🔐 قفل کردن انتخاب
  };

  return (
    <div className="mb-6 p-4 border border-red-500 rounded bg-red-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-red-700">
        🟰 تساوی در رأی‌گیری
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        کاپیتان باید یکی از بازیکنانی که رأی مساوی دارند را حذف کند:
      </p>

      <ul className="space-y-2">
        {tiedPlayers.map((p) => (
          <li
            key={p.id}
            className="p-2 rounded border flex justify-between items-center hover:bg-red-100"
          >
            <span className="font-medium">{p.name}</span>
            <button
              onClick={() => handleSelect(p.id)}
              className={`px-2 py-1 text-sm rounded border transition-all ${
                selectedId === p.id
                  ? "bg-red-600 text-white"
                  : "border-red-600 text-red-700"
              }`}
            >
              کاپیتان نشه
            </button>
          </li>
        ))}
      </ul>

      <HoldToConfirmButton
        label="تایید حذف"
        onConfirm={handleConfirm}
        disabled={!selectedId || confirmed}
      />
    </div>
  );
}
