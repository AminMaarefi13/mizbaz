const phaseTransitionMap = require("./phaseTransitionMap");
const gameController = require("../../controllers/gameController");

async function proceedToNextPhase({
  games,
  gameState,
  gameId,
  roomId,
  rooms,
  userSocketMap,
  io,
  eventSpecificData,
}) {
  delete gameState.phaseData;
  for (const player of gameState.players) {
    if (!player.eliminated) {
      player.privatePhaseData = {};
    }
  }
  const currentPhase = gameState.currentPhase;
  // console.log(currentPhase);
  const transition = phaseTransitionMap[currentPhase];

  if (!transition) {
    console.error(`❌ فاز ناشناخته یا پشتیبانی‌نشده: ${currentPhase}`);
    return;
  }
  // console.log("transition");
  // console.log(transition);
  const nextPhase = transition.next;
  const handler = transition.handler;
  const prepare = transition.prepare;
  // console.log(nextPhase);
  // console.log(handler);
  // console.log(prepare);

  if (nextPhase) {
    // آپدیت فاز به فاز بعدی
    gameState.currentPhase = nextPhase;
    // await gameController.updateGame(gameId, { currentPhase: nextPhase });
    await gameController.updateGame(gameId, gameState);
    // await gameController.updateGame(gameId, { gameState: gameState, roomId });
  }

  let preparedData = {};
  if (typeof prepare === "function") {
    preparedData = prepare(gameState);
  }

  // console.log(typeof handler);
  if (typeof handler === "function") {
    await handler(
      games,
      gameId,
      rooms,
      userSocketMap,
      io,
      preparedData,
      eventSpecificData
    );
  } else {
    console.warn(`⚠️ هندلر برای فاز ${currentPhase} تعریف نشده.`);
  }
}

module.exports = {
  proceedToNextPhase,
};
