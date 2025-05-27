// utils/gameUtils.js
const gameController = require("../controllers/gameController.js");

async function updateGameInDB(gameId, gameState) {
  await gameController.updateGame(gameId, gameState);
}

module.exports = { updateGameInDB };
