import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function CultGunsDistributionPanel() {
  const [confirmed, setConfirmed] = useState(false);
  const { connectionState, userState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const { selectablePlayers, cultLeaderId } = privatePhaseData;
  const [guns, setGuns] = useState(() =>
    selectablePlayers.reduce((acc, player) => {
      acc[player.id] = 0;
      return acc;
    }, {})
  );
  const isCultLeader = playerId === cultLeaderId;
  // console.log(isCultLeader);

  const totalGuns = Object.values(guns).reduce((sum, val) => sum + val, 0);

  const incrementGun = (playerId) => {
    if (confirmed) return;
    if (totalGuns >= 3) return;
    setGuns((prev) => ({
      ...prev,
      [playerId]: prev[playerId] + 1,
    }));
  };

  const decrementGun = (playerId) => {
    if (confirmed) return;
    if (guns[playerId] === 0) return;
    setGuns((prev) => ({
      ...prev,
      [playerId]: prev[playerId] - 1,
    }));
  };

  const handleConfirm = () => {
    if (totalGuns !== 3) return;

    setConfirmed(true);
    // socket.emit("cult_ritual_finished", {
    //   gameId: currentGameId,
    //   data: { playerId, distribution: guns },
    //   type: "cult_guns_distributed",
    // });
    console.log("تفنگ ها توزیع شدند");
    const payload = {
      data: { playerId, distribution: guns },
      type: "cult_guns_distributed",
    };
    // console.log({
    //   data: { playerId, distribution: guns },
    //   type: "cult_guns_distributed",
    // });
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
  };

  if (!isCultLeader) return null;

  return (
    <div className="p-4 border border-purple-500 rounded bg-purple-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-purple-700">
        🕯️ توزیع تفنگ‌ها
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        شما می‌توانید ۳ تفنگ را بین بازیکنان زنده توزیع کنید. می‌توانید همه را
        به یک نفر بدهید یا بین چند نفر پخش کنید. فقط مجموع باید دقیقاً ۳ باشد.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {selectablePlayers.map((p) => (
          <div
            key={p.id}
            className="p-3 rounded-lg border border-gray-300 bg-white shadow-sm flex justify-between items-center"
          >
            <div className="text-gray-800 font-semibold">{p.name}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrementGun(p.id)}
                disabled={guns[p.id] === 0 || confirmed}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                -
              </button>
              <span className="text-lg">{"🔫".repeat(guns[p.id]) || "—"}</span>
              <button
                onClick={() => incrementGun(p.id)}
                disabled={totalGuns >= 3 || confirmed}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {!confirmed && (
        <div className="text-center">
          <HoldToConfirmButton
            label="تایید توزیع"
            onConfirm={handleConfirm}
            disabled={totalGuns !== 3}
          />
        </div>
      )}
    </div>
  );
}
