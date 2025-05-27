const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");

async function cultRitualChoice(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  const { chosenCard } = eventSpecificData;
  const cultLeader = gameState.players.find((p) => p.role === "cultLeader");
  if (!cultLeader) return;

  const index = gameState.cultRitualDeck.indexOf(chosenCard);
  if (index !== -1) {
    gameState.cultRitualDeck.splice(index, 1);
  }
  if (chosenCard === "cult_guns_stash") {
    gameState.currentPhase = "cult_guns_stash_choice";
    // مرحله دادن تفنگ

    const selectablePlayers = gameState.players.map((p) => {
      let disabledReason = null;

      if (p.id === gameState.eliminated) {
        disabledReason = "بازیکن مرده قابل انتخاب نیست!";
      }

      return {
        id: p.id,
        name: p.name,
        seat: p.seat,
        disabled: Boolean(disabledReason),
        disabledReason,
      };
    });

    gameState.phaseData = {
      currentPhase: "cult_guns_stash_choice",
      title: "مراسم فرقه‌",
      // type: "see",
      message: `🔮 رهبر فرقه در حال پخش کردن سه تفنگ بین بازیکنان است...`,
    };
    cultLeader.privatePhaseData = {
      currentPhase: chosenCard,
      selectablePlayers,
      cultLeaderId: cultLeader.id,
      type: "cult_guns_stash_choice",
    };
  } else if (chosenCard === "cult_cabin_search") {
    gameState.currentPhase = `cult_cabin_search_result`;
    // ارسال نقش کابینه برای cultLeader
    const cabinRoles = ["captain", "firstOfficer", "navigator"];
    const cabinInfo = cabinRoles.map((cabinetRole) => {
      let player;
      if (cabinetRole === "captain") {
        player = gameState.players.find((p) => p.id === gameState.captainId);
      } else if (cabinetRole === "firstOfficer") {
        player = gameState.players.find(
          (p) => p.id === gameState.firstOfficerId
        );
      } else if (cabinetRole === "navigator") {
        player = gameState.players.find((p) => p.id === gameState.navigatorId);
      }
      return {
        cabinRole: cabinetRole,
        role: player?.role || "نامشخص",
        name: player?.name || "نامشخص",
        initialRole: player?.initialRole || null,
      };
    });
    gameState.phaseData = {
      currentPhase: "cult_cabin_search_result",
      title: "مراسم فرقه‌",
      // type: "see",
      message: `🔮 رهبر فرقه در حال مشاهده نقش اعضای کابین...`,
    };
    cultLeader.privatePhaseData = {
      cabinInfo,
      type: "cult_cabin_search_result",
      cultLeaderId: cultLeader.id,
    };
    // gameState.phaseData = {};
  } else if (chosenCard === "cult_conversion") {
    gameState.currentPhase = "cult_conversion_choice";
    // آماده‌سازی برای انتخاب بازیکن جهت پیوستن به فرقه
    const socketId = userSocketMap.get(cultLeader.id);
    if (!socketId) return;

    const selectablePlayers = gameState.players.map((p) => {
      let disabledReason = null;

      if (p.id === cultLeader.id) {
        disabledReason = "رهبر فرقه نمی‌تواند خودش را انتخاب کند!";
      } else if (p.eliminated) {
        disabledReason = "بازیکن حذف شده است.";
      } else if (!p.canJoinCult) {
        disabledReason = "این بازیکن نمی‌تواند به فرقه بپیوندد.";
      }

      return {
        id: p.id,
        name: p.name,
        seat: p.seat,
        disabled: Boolean(disabledReason),
        disabledReason,
      };
    });
    gameState.phaseData = {
      currentPhase: "cult_conversion_choice",
      title: "مراسم فرقه‌",
      // type: "see",
      message: `🔮 رهبر فرقه در حال انتخاب یک عضو جدید در فرقه...`,
    };
    cultLeader.privatePhaseData = {
      selectablePlayers,
      cultLeaderId: cultLeader.id,
      type: "cult_conversion_choice",
    };
  } else {
    return; // انتخاب نامعتبر
  }

  // ذخیره و ارسال وضعیت جدید
  updateAndBroadcastGame(
    games,
    gameId,
    gameState,
    roomId,
    room,
    userSocketMap,
    io
  );
}

module.exports = { cultRitualChoice };
