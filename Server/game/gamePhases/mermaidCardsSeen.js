const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");

async function mermaidCardsSeen(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  // console.log("MermaidSeen");
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  const { playerId } = eventSpecificData;
  const player = gameState.players.find((p) => p.id === playerId);
  // console.log(playerId);
  if (!player) return;
  gameState.currentPhase = "mermaid_seen";
  gameState.phaseData = {
    currentPhase: "mermaid_seen",
    title: "پری دریایی",
    type: "see",
    message: "کارت ها دیده شدن مرحله بعد: تشکیل کابینه",
  };
  gameState.nextPhaseData = {
    emergency: false,
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

module.exports = { mermaidCardsSeen };
