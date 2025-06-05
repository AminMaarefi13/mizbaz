const { getValidGameAndRoom } = require("../utils/getValidGameAndRoom");
const { rooms, games, userSocketMap } = require("../utils/memoryStore");

// مپ هندلرها بر اساس نوع بازی
const gameSocketHandlers = {
  feedTheKraken: require("../games/feedTheKraken/socketHandlers/onRequestGameState"),
  mineSweeper: require("../games/mineSweeper/socketHandlers/onRequestGameState"),
};

async function onRequestGameState(gameId, socket, io) {
  console.log("onRequestGameState called with gameId:", gameId);
  console.log("onRequestGameStateeeeeeeeeeeeeeeeee");
  const { gameState } = getValidGameAndRoom({ gameId, games, rooms });
  const gameType = gameState.type;
  const handler = gameSocketHandlers[gameType];
  console.log("gameType", gameType);
  console.log("handler", handler);
  if (!handler) return; // هندلر تعریف نشده

  const playerId = [...userSocketMap.entries()].find(
    ([_, sId]) => sId === socket.id
  )?.[0];

  handler({ gameState, playerId, socket, io, gameId });
}

module.exports = { onRequestGameState };

// const { getValidGameAndRoom } = require("../utils/getValidGameAndRoom");
// const {
//   makePublicState,
//   makePrivateState,
// } = require("../games/feedTheKraken/utils/makeStates");
// const { rooms, games, userSocketMap } = require("../utils/memoryStore");
// async function onRequestGameState(gameId, socket, io) {
//   const { game, room, roomId, gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   // console.log(rooms, games, userSocketMap);
//   // console.log("rooms, games, userSocketMap");
//   const publicState = makePublicState(gameState);

//   const playerId = [...userSocketMap.entries()].find(
//     ([_, sId]) => sId === socket.id
//   )?.[0];

//   const player = gameState.players.find((p) => p.id === playerId);

//   const privateState = makePrivateState(player);
//   io.to(socket.id).emit("game_state_requested", {
//     publicState,
//     privateState,
//     gameId,
//   });
// }

// module.exports = {
//   onRequestGameState,
// };
