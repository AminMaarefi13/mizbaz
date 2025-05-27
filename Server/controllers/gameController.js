const Game = require("../models/GameModel");
const Room = require("../models/RoomModel");

async function createGame(gameState) {
  const game = new Game(gameState);
  await game.save();
  return game;
}

async function getGameByGameId(gameId) {
  return await Game.findOne({ gameId });
}

// async function getGameByRoomId(roomId) {
//   const room = await Room.findOne({ roomId });
//   if (!room?.activeGameId) return null;
//   return await Game.findOne({ gameId: room.activeGameId });
// }
async function getAllGames() {
  return await Game.find();
}

async function updateGame(gameId, updates) {
  return await Game.findOneAndUpdate({ gameId }, updates, { new: true });
}

async function deleteGame(gameId) {
  await updateGame(gameId, { gameStatus: "finished" });
}

module.exports = {
  createGame,
  getGameByGameId,
  // getGameByRoomId,
  getAllGames,
  updateGame,
  deleteGame,
};
