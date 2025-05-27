// utils/gameUtils.js

function updateGameInMemory(games, gameId, gameState) {
  games.set(gameId, gameState);
  // games.set(gameId, { gameState, roomId });
}

module.exports = { updateGameInMemory };
