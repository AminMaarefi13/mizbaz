const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");

async function selectFloggingCard(
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
  const { chosenCard, targetPlayerId } = eventSpecificData;

  const targetPlayer = gameState.players.find((p) => p.id === targetPlayerId);
  // console.log("targetPlayer");
  // console.log(targetPlayer);
  if (!targetPlayer) return;
  targetPlayer.isNotARole = chosenCard;
  gameState.currentPhase = "location_effect_resolved";
  gameState.phaseData = {
    currentPhase: "location_effect_resolved",
    title: "من ... نیستم",
    type: "see",
    message: `مشخص شد که: \n
        ${targetPlayer.name} ${chosenCard} نیست \n
        مرحله بعد: اثر کارت`,
  };
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
  selectFloggingCard,
};
