import React, { useState } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function CultCabinSearchResultPanel() {
  const { connectionState, userState } = useGameContext();
  const [confirmed, setConfirmed] = useState(false);
  const { currentGameId, privatePhaseData } = userState;
  const { playerId } = connectionState;
  const { cabinInfo } = privatePhaseData;
  const handleConfirm = () => {
    // socket.emit("cult_ritual_finished", {
    //   gameId: currentGameId,
    //   data: { playerId },
    //   type: "cult_cabin_search",
    // });
    console.log("نقش ها دیده شد");
    const payload = {
      gameId: currentGameId,
      data: { playerId },
      type: "cult_cabin_search",
    };
    console.log({
      gameId: currentGameId,
      data: { playerId },
      type: "cult_cabin_search",
    });
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  return (
    <div className="mb-6 p-4 border border-purple-500 rounded bg-purple-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-purple-700">
        🕯️ مشاهده اطلاعات کابینه
      </h2>
      <p className="mb-4 text-sm text-gray-800">
        شما به عنوان رهبر فرقه، اطلاعات مربوط به سه عضو کابینه فعلی را مشاهده
        می‌کنید. این اطلاعات فقط برای شما قابل مشاهده است.
      </p>

      <div className="flex flex-col gap-4 mb-6">
        {cabinInfo.map((info, index) => (
          <div
            key={index}
            className="p-3 border rounded bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <p className="text-sm text-gray-500">نام بازیکن:</p>
              <p className="text-base font-semibold text-gray-800">
                {info.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">نقش در کابینه:</p>
              <p className="text-base font-semibold text-purple-700">
                {translateCabinRole(info.cabinRole)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">نقش در تیم:</p>
              <p className="text-base font-semibold text-purple-700">
                {translateGameRole(info.role)}
              </p>
            </div>
            {translateGameRole(info.initialRole) !== "ندارد" && (
              <div>
                <p className="text-sm text-gray-500">نقش اولیه:</p>
                <p className="text-base font-semibold text-gray-800">
                  {translateGameRole(info.initialRole)}
                </p>
              </div>
            )}
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

// تابع کمکی برای ترجمه نقش کابینه
function translateCabinRole(cabinRole) {
  switch (cabinRole) {
    case "captain":
      return "کاپیتان";
    case "firstOfficer":
      return "افسر اول";
    case "navigator":
      return "ناوبر";
    default:
      return "نامشخص";
  }
}

// تابع کمکی برای ترجمه نقش اولیه (بسته به بازی شما قابل گسترشه)
function translateGameRole(role) {
  switch (role) {
    case "cultLeader":
      return "رهبر فرقه";
    case "cultist":
      return "فرقه‌ای";
    case "sailor":
      return "ملوان";
    case "pirate":
      return "دزد  دریایی";
    default:
      return "ندارد";
  }
}
