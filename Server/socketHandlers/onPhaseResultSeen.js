const { makePublicState, makePrivateState } = require("../utils/makeStates");
const gameController = require("../controllers/gameController");
const phaseTransitionMap = require("../game/phaseTransitionMap");
const { ioEmitToRoom } = require("../utils/ioEmitToRoom");

async function onPhaseResultSeen(
  gameId,
  playerId,
  rooms,
  socket,
  userSocketMap,
  games,
  io
) {
  const game = games.get(gameId);
  if (!game) return;

  const { gameState, roomId } = game;
  const room = rooms.get(roomId);
  if (!room) return socket.emit("error_message", "اتاق یافت نشد.");

  const currentPhase = gameState.currentPhase;
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player || player.eliminated) return;

  // نگهداری تاییدها
  if (!gameState.phaseSeen) gameState.phaseSeen = {};
  if (!gameState.phaseSeen[currentPhase])
    gameState.phaseSeen[currentPhase] = new Set();
  gameState.phaseSeen[currentPhase].add(playerId);

  const alivePlayersCount = gameState.players.filter(
    (p) => !p.eliminated
  ).length;
  const seenCount = gameState.phaseSeen[currentPhase].size;

  console.log(
    `🟡 فاز "${currentPhase}": ${seenCount}/${alivePlayersCount} تایید`
  );

  games.set(gameId, gameState);
  // games.set(gameId, { gameState, roomId });
  await gameController.updateGame(gameState.gameId, gameState);

  if (seenCount < alivePlayersCount) return;

  // پاکسازی و رفتن به فاز بعد
  delete gameState.phaseSeen[currentPhase];

  let transition = phaseTransitionMap[currentPhase];
  if (typeof transition === "function") {
    transition = transition(gameState); // خروجی: { next, handler }
  }

  if (!transition) {
    console.warn(`❌ هیچ انتقالی برای فاز "${currentPhase}" تعریف نشده.`);
    return;
  }

  const { next, handler } = transition;

  gameState.currentPhase = next;

  // اجرا تابع مرحله‌ی بعد
  await handler(games, gameState, gameId, roomId, userSocketMap, io);

  games.set(gameId, gameState);
  // games.set(gameId, { gameState, roomId });
  await gameController.updateGame(gameState.gameId, gameState);

  // پخش state جدید
  for (const p of room.players) {
    const socketId = userSocketMap.get(p.id);
    if (!socketId) continue;

    const publicState = makePublicState(gameState);
    const privateState = makePrivateState(p);
    io.to(socketId).emit("gameState", { publicState, privateState });
  }
}

module.exports = {
  onPhaseResultSeen,
};
