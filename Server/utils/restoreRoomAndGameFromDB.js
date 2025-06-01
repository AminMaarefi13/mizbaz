const roomController = require("../controllers/roomController");
const gameController = require("../controllers/gameController");

// ✅ Restore rooms from MongoDB
async function restoreRoomsFromDB(rooms) {
  const dbRooms = await roomController.getAllRooms();
  dbRooms.forEach((dbRoom) => {
    rooms.set(dbRoom.roomId, {
      players: dbRoom.players.map((p) => ({
        playerId: p.playerId,
        nickname: p.nickname,
        isReady: p.isReady,
        socketId: null, // ست می‌شود بعد از اتصال socket
      })),
      // gameStarted: dbRoom.gamePhase !== "lobby",
      hostId: dbRoom.hostId,
      // activeGameId: dbRoom.activeGameId,
      roomGames: dbRoom.roomGames,
    });
  });

  console.log("✅ Rooms restored from database.");
  return dbRooms;
}

// ✅ Restore games from MongoDB
async function restoreGamesFromDB(games, rooms) {
  const allGames = await gameController.getAllGames();
  allGames.forEach((dbGame) => {
    if (dbGame.gameStatus === "onGoing") {
      games.set(dbGame.gameId, {
        gameId: dbGame.gameId,
        roomId: dbGame.roomId,
        journeyType: dbGame.journeyType,
        players: dbGame.players,
        captainId: dbGame.captainId,
        firstOfficerId: dbGame.firstOfficerId,
        navigatorId: dbGame.navigatorId,
        offDutyIds: dbGame.offDutyIds,
        mapPosition: dbGame.mapPosition,
        currentPhase: dbGame.currentPhase,
        navigationDeck: dbGame.navigationDeck,
        discardPile: dbGame.discardPile,
        cultRitualDeck: dbGame.cultRitualDeck,
        // navigationDeckLength: dbGame.navigationDeck.length,
        // discardPileLength: dbGame.discardPile.length,
        // cultRitualDeckLength: dbGame.cultRitualDeck.length,
        playedNavCards: dbGame.playedNavCards,
        gunReloadUsed: dbGame.gunReloadUsed,
        currentVoteSessionId: dbGame.currentVoteSessionId,
        phaseData: dbGame.phaseData,
        nextPhaseData: dbGame.nextPhaseData,
        logs: dbGame.logs,
        gameStatus: dbGame.gameStatus,
      });
      // اگر room وجود داره، flag بازی رو روشن می‌کنیم
      const room = rooms.get(dbGame.roomId);
      if (room) {
        // room.gameStarted = true;
      }
    }
  });

  console.log("✅ Games restored from database.");

  return allGames;
}

module.exports = {
  restoreGamesFromDB,
  restoreRoomsFromDB,
};
