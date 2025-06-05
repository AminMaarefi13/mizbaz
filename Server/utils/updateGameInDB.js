// utils/gameUtils.js
// const gameController = require("../controllers/gameController.js");
const feedTheKrakenGameController = require("../controllers/feedTheKrakenGameController.js");
const mineSweeperGameController = require("../controllers/mineSweeperGameController.js");
// اگر بازی‌های دیگر داری، اینجا اضافه کن

const gameControllers = {
  feedTheKraken: feedTheKrakenGameController,
  mineSweeper: mineSweeperGameController,
};

async function updateGameInDB(gameId, gameState) {
  const type = gameState.type;
  const controller = gameControllers[type];
  if (!controller) {
    throw new Error(`No controller found for game type: ${type}`);
  }
  await controller.updateGame(gameId, gameState);
}

module.exports = { updateGameInDB };

// const gameControllers = {
//   feedTheKraken: feedTheKrakenGameController,
//   // mineSweeper: mineSweeperGameController,
// };

// async function updateGameInDB(gameId, gameState) {
//   await gameController.updateGame(gameId, gameState);
// }

module.exports = { updateGameInDB };
