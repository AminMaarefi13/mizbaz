import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function CabinetSelectionPanel() {
  const [firstOfficerId, setFirstOfficerId] = useState(null);
  const [navigatorId, setNavigatorId] = useState(null);
  const { userState, gameState, connectionState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  // console.log(privatePhaseData);
  const isEmergency = privatePhaseData?.emergency === true;

  if (
    gameState.currentPhase !== "cabinet_formation" ||
    gameState.captainId !== playerId
  ) {
    return null; // فقط کاپیتان و فقط در این فاز این کامپوننت رو ببینه
  }

  const handleSelect = (playerId, role) => {
    if (confirmed) return; // 🔒 جلوگیری از تغییر پس از تأیید

    if (role === "firstOfficer") {
      if (navigatorId === playerId) setNavigatorId(null);
      setFirstOfficerId(playerId);
    } else {
      if (firstOfficerId === playerId) setFirstOfficerId(null);
      setNavigatorId(playerId);
    }
  };

  const handleConfirmCabinet = () => {
    if (!navigatorId || (!isEmergency && !firstOfficerId)) {
      alert(
        isEmergency
          ? "لطفاً یک کشتیران انتخاب کنید."
          : "لطفاً هر دو نقش را انتخاب کنید."
      );
      return;
    }

    // socket.emit("confirm_cabinet", {
    //   gameId: currentGameId,
    //   emergency: isEmergency,
    //   navigatorId,
    //   firstOfficerId: isEmergency ? gameState.firstOfficerId : firstOfficerId, // استفاده از افسر قبلی در حالت اضطراری
    // });
    const payload = {
      emergency: isEmergency,
      navigatorId,
      firstOfficerId: isEmergency ? gameState.firstOfficerId : firstOfficerId, // استفاده از افسر قبلی در حالت اضطراری
    };
    // console.log({
    //   emergency: isEmergency,
    //   navigatorId,
    //   firstOfficerId: isEmergency ? gameState.firstOfficerId : firstOfficerId, // استفاده از افسر قبلی در حالت اضطراری
    // });
    socket.emit("phase_confirm", { gameId: currentGameId, payload });

    setConfirmed(true); // 🔐 قفل کردن انتخاب
  };

  return (
    <div className="mb-6 p-4 border border-yellow-500 rounded bg-yellow-50 shadow">
      <h2 className="text-xl font-bold mb-4">📋 انتخاب کابینه</h2>
      {isEmergency && (
        <p className="text-sm text-red-600 mb-2">
          🚨 حالت اضطراری فعال است: فقط نیاز به انتخاب کشتیران دارید.
        </p>
      )}
      <ul className="space-y-2">
        {privatePhaseData?.selectablePlayers.map((p) => {
          const isSelectedAsFirstOfficer = p.id === firstOfficerId;
          const isSelectedAsNavigator = p.id === navigatorId;

          return (
            <li
              key={p.id}
              className={`p-2 rounded border flex justify-between items-center ${
                p.disabled
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "hover:bg-blue-50"
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
                <div className="flex gap-2">
                  {!isEmergency && (
                    <button
                      onClick={() => handleSelect(p.id, "firstOfficer")}
                      className={`px-2 py-1 text-sm rounded border ${
                        isSelectedAsFirstOfficer
                          ? "bg-green-500 text-white"
                          : "border-green-500 text-green-700"
                      }`}
                    >
                      افسر اول
                    </button>
                  )}
                  <button
                    onClick={() => handleSelect(p.id, "navigator")}
                    className={`px-2 py-1 text-sm rounded border ${
                      isSelectedAsNavigator
                        ? "bg-blue-600 text-white"
                        : "border-blue-600 text-blue-700"
                    }`}
                  >
                    کشتیران
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <HoldToConfirmButton
        label="تایید نهایی"
        onConfirm={handleConfirmCabinet}
        disabled={
          !navigatorId || (!isEmergency && !firstOfficerId) || confirmed
        }
      />
    </div>
  );
}
