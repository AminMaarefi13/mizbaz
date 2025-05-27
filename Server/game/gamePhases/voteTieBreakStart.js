const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");

async function voteTieBreakStart(
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
  console.log(preparedData);
  console.log(eventSpecificData);
  let tiedPlayers;
  let eliminatorId;
  if (eventSpecificData) {
    console.log("eventSpecificData");
    tiedPlayers = eventSpecificData.tiedPlayers;
    eliminatorId = eventSpecificData.eliminatorId;
  } else {
    console.log("preparedData");
    tiedPlayers = preparedData.tiedPlayers;
    eliminatorId = preparedData.eliminatorId;
    // gameState.nextPhaseData = {};
  }
  console.log("eliminatorId");
  console.log(eliminatorId);
  console.log("tiedPlayers");
  console.log(tiedPlayers);
  console.log("Oneeee");

  // حذف بازیکن انتخاب‌شده از لیست تساوی
  let newTied;
  if (eliminatorId === gameState.captainId) {
    newTied = tiedPlayers;
  } else {
    newTied = tiedPlayers.filter((p) => p.id !== eliminatorId);
  }

  const eliminated = gameState.players.find((p) => p.id === eliminatorId);
  eliminated.privatePhaseData = {};
  if (eliminatorId === gameState.captainId) {
    gameState.logs.push({
      type: "phase",
      text: `🚫 بازیکن ${eliminated.name} از کاپیتانی کنار گذاشته شد.`,
    });
  } else {
    gameState.logs.push({
      type: "phase",
      text: `🚫 بازیکن ${eliminated.name} از تساوی کنار گذاشته شد.`,
    });
  }

  // اگر فقط یک نفر باقی مانده، او کاپیتان جدید می‌شود
  if (newTied.length === 1) {
    const newCaptainId = newTied[0].id;
    gameState.captainId = newCaptainId;
    // gameState.navigatorId = null;
    // gameState.firstOfficerId = null;
    gameState.players.forEach((p) => {
      p.isCaptain = p.id === gameState.captainId;
    });

    gameState.logs.push({
      type: "event",
      text: `🎖 ${newTied[0].name} کاپیتان جدید شد.`,
    });
    gameState.currentPhase = "mutiny_success";
    gameState.phaseData = {
      currentPhase: "mutiny_success",
      title: "نتیجه رای گیری",
      type: "see",
      message: `کاپیتان جدید: ${newTied[0].name} \n
       مرحله بعد: تشکیل کابینه توسط کاپیتان جدید`,
    };
    gameState.nextPhaseData = {
      emergency: false,
    };
  } else {
    gameState.currentPhase = "vote_tie_break_start";

    const tiedPlayersString =
      // "بیشترین تفنگ ها:" +
      // "\n" +
      // newTied
      //   .map(({ nickname, gunsUsed }) => {
      //     return `${nickname}`;
      //   })
      //   .join("\n") +
      // "\n" +
      `شورش موفق بود. \n
       مرحله بعد: حذف یکی از بازیکنان با بیشترین تفنگ توسط بازیکن حذف شده قبلی ${eliminated.name}`;
    gameState.phaseData = {
      currentPhase: "vote_tie_break_start",
      title: "حذف یک کاندیدا",
      message: tiedPlayersString,
      type: "see",
      step: "tie_break_step",
    };
    gameState.nextPhaseData = {
      tiedPlayers: newTied,
      eliminatorId: eliminatorId,
    };
    gameState.logs.push({
      type: "phase",
      text: `🟰 تساوی در رأی‌ها! ${eliminated.name} باید یکی از افراد را حذف کند.`,
    });
  }
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

module.exports = {
  voteTieBreakStart,
};
