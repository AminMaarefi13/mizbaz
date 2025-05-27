import React, { useState, useEffect } from "react";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";

export default function GunVotingPanel() {
  // تعریف اولیه: تفنگ‌ها با آیدی یکتا و زاویه چرخش تصادفی
  const [guns, setGuns] = useState([]);
  const [selectedGunIds, setSelectedGunIds] = useState([]);
  const { userState, connectionState, gameState } = useGameContext();
  const { currentPhase, players, currentVoteSessionId } = gameState;
  const { votes } = userState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);

  const player = players.find((p) => p.id === playerId);
  if (!player || currentPhase !== "start_voting") return null;

  const maxGuns = player.guns;
  console.log(selectedGunIds);
  useEffect(() => {
    const initialGuns = Array.from({ length: maxGuns }, (_, i) => ({
      id: i,
      rotate: 315, // چرخش بین -20 تا +20 درجه
    }));
    console.log(initialGuns);

    if (votes.length > 0) {
      console.log(votes[votes.length - 1].voteSessionId);
      console.log(currentVoteSessionId);
      if (votes[votes.length - 1].voteSessionId === currentVoteSessionId) {
        const initialSetSelectedGunIds = initialGuns
          .filter((gun) => gun.id < votes[votes.length - 1].gunsUsed)
          .map((gun) => gun.id);

        // const initialSetSelectedGunIds = initialGuns.map((gun) => {
        //   if (gun.id < votes[votes.length - 1].gunsUsed) {
        //     return gun.id;
        //   }
        // });
        //         const initialSetSelectedGunIds = initialGuns.reduce((acc, gun) => {
        //   if (gun.id < votes[votes.length - 1].gunsUsed) {
        //     acc.push(gun.id);
        //   }
        //   return acc;
        // }, []);
        console.log(initialSetSelectedGunIds);
        setGuns(initialGuns);
        setSelectedGunIds(initialSetSelectedGunIds);
        setConfirmed(true);
      } else {
        setGuns(initialGuns);
        setSelectedGunIds([]);
      }
    } else {
      setGuns(initialGuns);
      setSelectedGunIds([]);
    }
  }, [maxGuns, currentVoteSessionId, votes]);

  const handleSelectGun = (gun) => {
    if (confirmed) return; // 🔒 جلوگیری از تغییر پس از تأیید
    if (selectedGunIds.includes(gun.id)) return; // جلوگیری از انتخاب دوباره
    setSelectedGunIds((prev) => [...prev, gun.id]);
  };

  const handleDeselectGun = (gun) => {
    if (confirmed) return; // 🔒 جلوگیری از تغییر پس از تأیید
    setSelectedGunIds((prev) => prev.filter((id) => id !== gun.id));
  };

  const handleSubmitVote = () => {
    // socket.emit("submit_vote", {
    //   gameId: currentGameId,
    //   playerId,
    //   gunsUsed: selectedGunIds.length,
    // });
    const payload = {
      playerId,
      gunsUsed: selectedGunIds.length,
    };
    console.log({
      playerId,
      gunsUsed: selectedGunIds.length,
    });
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    console.log("✅ رأی با", selectedGunIds.length, "تفنگ ارسال شد");
    setConfirmed(true); // 🔐 قفل کردن انتخاب
  };

  return (
    <div className="mb-6 p-4 border border-red-500 rounded bg-red-50 shadow">
      <h2 className="text-xl font-bold mb-4">🔫 فاز شورش</h2>
      <p className="mb-3 text-gray-700">
        روی تفنگ‌هایی که می‌خواهید در شورش استفاده کنید کلیک کنید.
      </p>

      {/* لیست کامل تفنگ‌ها (بالا) */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {guns.length === 0 ? (
          <div>تفنگی در این شورش ندارید!</div>
        ) : (
          guns.map((gun) => {
            const isSelected = selectedGunIds.includes(gun.id);
            console.log(gun.id);
            console.log(gun);
            console.log(isSelected);
            return (
              <img
                key={gun.id}
                src="/gun.png"
                alt="gun"
                className={`w-10 h-10 transition cursor-pointer ${
                  isSelected
                    ? "opacity-20 pointer-events-none"
                    : "hover:opacity-80"
                }`}
                style={{ transform: `rotate(${gun.rotate}deg)` }}
                onClick={() => handleSelectGun(gun)}
              />
            );
          })
        )}
      </div>

      {/* تفنگ‌های انتخاب‌شده (پایین) */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">تفنگ‌های شورش:</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {guns
            .filter((gun) => selectedGunIds.includes(gun.id))
            .map((gun) => (
              <img
                key={gun.id}
                src="/gun.png"
                alt="gun"
                className="w-10 h-10 cursor-pointer hover:opacity-80 transition"
                style={{ transform: `rotate(${gun.rotate}deg)` }}
                onClick={() => handleDeselectGun(gun)}
              />
            ))}
        </div>
        <p className="text-center mt-2 text-gray-700">
          مجموع: <strong>{selectedGunIds.length}</strong> تفنگ
          {/* مجموع: <strong>{selectedGunIds.length}</strong> تفنگ */}
        </p>
      </div>

      <HoldToConfirmButton
        label="ارسال رأی"
        onConfirm={handleSubmitVote}
        disabled={confirmed}
      />
    </div>
  );
}
