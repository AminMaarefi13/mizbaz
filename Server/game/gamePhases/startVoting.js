const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");

async function startVoting(
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
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  if (!captain) throw new Error("کاپیتان پیدا نشد.");

  gameState.currentPhase = "start_voting"; // تغییر فاز به رای‌گیری
  // شروع رأی‌گیری جدید
  gameState.voteSessionCount = (gameState.voteSessionCount || 0) + 1;
  gameState.currentVoteSessionId = gameState.voteSessionCount;
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
  startVoting,
};
