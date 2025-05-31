const { getValidGameAndRoom } = require("../utils/getValidGameAndRoom");
const { makePublicState, makePrivateState } = require("../utils/makeStates");
const { rooms, games, userSocketMap } = require("../utils/memoryStore");
async function onRequestGameState(gameId, socket, io) {
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  // console.log(rooms, games, userSocketMap);
  // console.log("rooms, games, userSocketMap");
  const publicState = makePublicState(gameState);

  const playerId = [...userSocketMap.entries()].find(
    ([_, sId]) => sId === socket.id
  )?.[0];

  const player = gameState.players.find((p) => p.id === playerId);

  const privateState = makePrivateState(player);
  io.to(socket.id).emit("game_state_requested", {
    publicState,
    privateState,
    gameId,
  });
}

module.exports = {
  onRequestGameState,
};

// const { getValidGameAndRoom } = require("../utils/getValidGameAndRoom");
// const { makePublicState, makePrivateState } = require("../utils/makeStates");

// async function onRequestGameState(
//   playerId,
//   games,
//   gameId,
//   rooms,
//   userSocketMap,
//   io
// ) {
//   const { gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   const socketId = userSocketMap.get(playerId);
//   console.log("sdddddddddddd");
//   const player = gameState.players.find((pl) => pl.id === playerId);

//   const publicState = makePublicState(gameState);
//   const privateState = makePrivateState(player);
//   io.to(socketId).emit("game_state_requested", { publicState, privateState });
//   // console.log("gameId");
//   // console.log(gameId);

//   // const game = games.get(gameId);
//   // if (!game) {
//   //   callback(null);
//   //   return;
//   // }

//   // const gameState = game.gameState;

//   // const publicState = makePublicState(gameState);

//   // const playerId = [...userSocketMap.entries()].find(
//   //   ([_, sId]) => sId === socket.id
//   // )?.[0];

//   // const player = gameState.players.find((p) => p.id === playerId);
//   // if (!player) {
//   //   callback(null);
//   //   return;
//   // }

//   // const privateState = makePrivateState(player);
//   // if (gameState.phaseData) {
//   //   const captainSocketId = userSocketMap.get(gameState.captainId);
//   //   if (captainSocketId) {
//   //     io.to(captainSocketId).emit("cabinet_formation", gameState.phaseData);
//   //   }
//   // }

//   // callback({ publicState, privateState });
// }

// module.exports = {
//   onRequestGameState,
// };
