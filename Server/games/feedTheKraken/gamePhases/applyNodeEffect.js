const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

function applyNodeEffect(
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
  const { effect, nodeId } = gameState.nextPhaseData;
  // console.log("effect");
  // console.log(effect);
  // console.log("nodeId");
  // console.log(nodeId);
  // cabin_search
  // feed_the_kraken
  // off_with_tongue
  // flogging
  const selectablePlayers = gameState.players.map((p) => {
    let disabledReason = null;

    if (p.id === gameState.captainId) {
      disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
    } else if (p.eliminated) {
      disabledReason = "بازیکنی که حذف شده قابل انتخاب نیست!";
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
    title: "انتخاب بازیکن برای افکت مکان توسط کاپیتان",
    // type: "see",
    message: `✨ افکت "${effect}" برای کاپیتان در حال انتخاب یک نفر  .`,
  };
  const captain = gameState.players.find((p) => p.id === gameState.captainId);

  captain.privatePhaseData = {
    currentPhase: effect,
    title: "انتخاب بازیکن برای افکت مکان",
    selectablePlayers,
  };
  // console.log(gameState);
  // console.log(captain);
  // console.log("gameState");
  // console.log("captain");

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
  applyNodeEffect,
};
