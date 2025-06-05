import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";

export default function CultConversionPanel() {
  const { connectionState, userState } = useAppContext();
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const { selectablePlayers, cultLeaderId } = privatePhaseData;
  const isCultLeader = playerId === cultLeaderId;
  const handleSelect = (playerId) => {
    if (confirmed) return;
    setSelectedPlayerId(playerId);
  };

  const handleConfirm = () => {
    if (!selectedPlayerId) return;

    setConfirmed(true);

    console.log("عضو جدید فرقه انتخاب شد");
    const payload = {
      data: { targetPlayerId: selectedPlayerId },
      type: "cult_conversion_target_selected",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
  };

  if (!isCultLeader) return null;

  return (
    <div className="p-4 border border-purple-500 rounded bg-purple-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-purple-700">
        🕯️ دعوت به فرقه
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        یکی از بازیکنان زیر را برای دعوت به فرقه انتخاب کنید.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {selectablePlayers.map((p) => (
          <div
            key={p.id}
            className={`p-3 rounded-lg border transition-all cursor-pointer text-center ${
              selectedPlayerId === p.id
                ? "border-purple-600 bg-purple-100"
                : "border-gray-300 hover:bg-purple-50"
            } ${p.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !p.disabled && handleSelect(p.id)}
          >
            <div className="font-semibold text-gray-800">{p.name}</div>
            {p.disabled && (
              <div className="text-xs text-red-500 mt-1">
                {p.disabledReason}
              </div>
            )}
          </div>
        ))}
      </div>

      {!confirmed && (
        <div className="mt-6 text-center">
          <HoldToConfirmButton
            label="تایید انتخاب"
            onConfirm={handleConfirm}
            disabled={!selectedPlayerId}
          />
        </div>
      )}
    </div>
  );
}
