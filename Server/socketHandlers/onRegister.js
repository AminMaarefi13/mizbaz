const connectionController = require("../controllers/connectionController");
const gameController = require("../controllers/gameController");
const { logAllUsers } = require("../utils/logAllusers");
const { makePublicState, makePrivateState } = require("../utils/makeStates");
const {
  rooms,
  games,
  connectionsArr,
  userSocketMap,
} = require("../utils/memoryStore");

async function onRegister(socket, io) {
  // console.log("socket.user");
  // console.log(socket.user);
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(`🔗 Registering player ${playerId} with name ${name}`);
  // console.log(rooms, games, connectionsArr, userSocketMap);
  // console.log("rooms, games, connectionsArr, userSocketMap");
  // console.log("connectionsArr onRegister");
  // console.log(connectionsArr);
  // console.log("connectionsArr.get(playerId)", connectionsArr.get(playerId));
  let connectionUser =
    connectionsArr.get(playerId) ||
    (await connectionController.getConnectionByPlayerId(playerId));
  console.log(`🔁 Updated socketId in connection for ${playerId}`);
  if (!connectionUser) {
    try {
      await connectionController.createConnection(playerId, socket.id);
    } catch (err) {
      console.error("❌ Failed to create user:", err);
      socket.emit("error", { message: "خطا در ساختن کاربر." });
      return;
    }
    const connectionObject = {
      playerId,
      name,
      socketId: socket.id,
      userRooms: new Set(),
      currentRoomId: null,
      currentGameId: null,
    };
    connectionsArr.set(playerId, connectionObject);
    connectionUser = connectionsArr.get(playerId);
  } else {
    connectionUser.socketId = socket.id;
  }

  connectionsArr.set(playerId, connectionUser);
  // console.log("connectionsArr onRegister");
  // console.log(connectionsArr);

  console.log("connectionUser onRegister");
  console.log(connectionUser);
  // console.log("connectionUser", connectionUser);
  userSocketMap.set(playerId, socket.id);
  console.log(`📲 Player ${playerId} registered with socket ${socket.id}`);

  // فقط roomIdها را استخراج کن
  const roomIds = new Set(
    Array.from(connectionUser?.userRooms || []).map((room) => room.roomId)
  );
  // آپدیت socketId در room.players
  roomIds.forEach((roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      const player = room.players.find((p) => p.playerId === playerId);
      if (player) {
        player.socketId = socket.id;
        console.log(`🔁 Updated socketId in room ${roomId} for ${playerId}`);
      }
    }
  });

  // ساخت لیست روم‌ها

  // await connectionController.updateConnection(playerId, {
  //   socketId: socket.id,
  //   userRooms: [...roomIds],
  // });
  // if (!room?.gameStarted || !room.activeGameId) return;
  const currentRoom = rooms.get(connectionUser.currentRoomId);
  if (!currentRoom) return;

  // const gameId = currentRoom?.activeGameId;
  // connectionUser.currentGameId = gameId;

  const userRoomsArr = Array.from(roomIds)
    .map((roomId) => {
      const room = rooms.get(roomId);
      if (!room) return null;

      return {
        roomId,
        hostName: room.players[0]?.nickname || "نامشخص",
        hostId: room.hostId,
      };
    })
    .filter(Boolean);

  socket.emit("user_rooms_updated", userRoomsArr);
  // console.log("userRoomsArr ddddd", userRoomsArr);
  await connectionController.updateConnection(playerId, {
    // currentGameId: gameId,
    userRooms: userRoomsArr,
  });

  // if (!gameId) return;
  // let game = games.get(gameId);
  // // اگر بازی در کش نبود از دیتابیس بگیر
  // if (!game) {
  //   const dbGame = await gameController.getGameByGameId(gameId);
  //   if (!dbGame) return;

  //   game = {
  //     gameId: dbGame.gameId,
  //     roomId: dbGame.roomId,
  //     journeyType: dbGame.journeyType,
  //     players: dbGame.players,
  //     captainId: dbGame.captainId,
  //     firstOfficerId: dbGame.firstOfficerId,
  //     navigatorId: dbGame.navigatorId,
  //     offDutyIds: dbGame.offDutyIds,
  //     mapPosition: dbGame.mapPosition,
  //     currentPhase: dbGame.currentPhase,
  //     navigationDeck: dbGame.navigationDeck,
  //     discardPile: dbGame.discardPile,
  //     cultRitualDeck: dbGame.cultRitualDeck,
  //     // navigationDeckLength: dbGame.navigationDeck.length,
  //     // discardPileLength: dbGame.discardPile.length,
  //     // cultRitualDeckLength: dbGame.cultRitualDeck.length,
  //     playedNavCards: dbGame.playedNavCards,
  //     gunReloadUsed: dbGame.gunReloadUsed,
  //     currentVoteSessionId: dbGame.currentVoteSessionId,
  //     phaseData: dbGame.phaseData,
  //     nextPhaseData: dbGame.nextPhaseData,
  //     logs: dbGame.logs,
  //     gameStatus: dbGame.gameStatus,
  //   };

  //   // game = {
  //   //   gameState: {
  //   //     gameId: dbGame.gameId,
  //   //     roomId: dbGame.roomId,
  //   //     journeyType: dbGame.journeyType,
  //   //     players: dbGame.players,
  //   //     captainId: dbGame.captainId,
  //   //     firstOfficerId: dbGame.firstOfficerId,
  //   //     navigatorId: dbGame.navigatorId,
  //   //     offDutyIds: dbGame.offDutyIds,
  //   //     mapPosition: dbGame.mapPosition,
  //   //     currentPhase: dbGame.currentPhase,
  //   //     logs: dbGame.logs,
  //   //     playedNavCards: dbGame.playedNavCards,
  //   //     gunReloadUsed: dbGame.gunReloadUsed,
  //   //     navigationDeckLength: gameState.navigationDeck.length,
  //   //     discardPileLength: gameState.discardPile.length,
  //   //     cultRitualDeckLength: gameState.cultRitualDeck.length,
  //   //     currentVoteSessionId: gameState.currentVoteSessionId,
  //   //     phaseData: gameState.phaseData,
  //   //     nextPhaseData: gameState.nextPhaseData,
  //   //   },
  //   //   roomId: dbGame.roomId,
  //   // };

  //   games.set(gameId, game);
  //   // games.set(gameId, game, connectionUser.currentRoomId);
  // }
  // console.log("game", game);
  // const gameState = game;
  // console.log("gameState", gameState);

  // const player = gameState.players.find((pl) => pl.playerId === playerId);
  // if (!player) return;

  // const publicState = makePublicState(gameState);
  // const privateState = makePrivateState(player);

  // io.to(socket.id).emit("gameState", { publicState, privateState });

  logAllUsers(userSocketMap, rooms);
}

module.exports = {
  onRegister,
};
