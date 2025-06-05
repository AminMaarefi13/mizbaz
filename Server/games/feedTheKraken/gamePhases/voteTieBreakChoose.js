const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");

async function voteTieBreakChoose(
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
  // console.log(preparedData);
  // console.log(eventSpecificData);
  let tiedPlayers;
  let eliminatorId;
  if (eventSpecificData) {
    // console.log("eventSpecificData");
    tiedPlayers = eventSpecificData.tiedPlayers;
    eliminatorId = eventSpecificData.eliminatorId;
  } else {
    // console.log("preparedData");
    tiedPlayers = preparedData.tiedPlayers;
    eliminatorId = preparedData.eliminatorId;
    gameState.nextPhaseData = {};
  }
  // console.log("eliminatorId");
  // console.log(eliminatorId);
  // console.log("tiedPlayers");
  // console.log(tiedPlayers);
  // console.log("privateee");
  // حذف بازیکن انتخاب‌شده از لیست تساوی
  let newTied;
  if (eliminatorId === gameState.captainId) {
    newTied = tiedPlayers;
  } else {
    newTied = tiedPlayers.filter((p) => p.id !== eliminatorId);
  }

  const eliminated = gameState.players.find((p) => p.id === eliminatorId);

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

  gameState.currentPhase = "vote_tie_break_choose";

  const tiedPlayersString = `در حال حذف یکی از بازیکنان با تفنگ های برابر... ${eliminated.name}`;
  gameState.phaseData = {
    currentPhase: "vote_tie_break_choose",
    title: "تساوی تفنگ ها",
    message: tiedPlayersString,
  };
  // console.log(newTied);
  eliminated.privatePhaseData = {
    tiedPlayers: newTied,
    eliminatorId: eliminatorId,
  };
  gameState.nextPhaseData = {
    tiedPlayers: newTied,
    eliminatorId: eliminatorId,
  };

  // console.log(`🟰 تساوی در رأی‌ها! کاپیتان باید یکی از افراد را حذف کند.`);
  gameState.logs.push({
    type: "phase",
    text: `🟰 تساوی در رأی‌ها! ${eliminated.name} باید یکی از افراد را حذف کند.`,
  });
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
  voteTieBreakChoose,
};
