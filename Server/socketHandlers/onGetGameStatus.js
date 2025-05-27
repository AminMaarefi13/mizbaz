const gameController = require("../controllers/gameController");

async function onGetGameStatus(roomId, rooms, callback, rooms, games) {
  const room = rooms.get(roomId);
  console.log("roomId");
  console.log(roomId);

  // if (!room || !room.activeGameId) {
  //   return callback(null); // هیچ بازی فعالی وجود ندارد
  // }
  console.log("room");
  console.log(room);
  const gameId = room.activeGameId;
  console.log("gameId");
  console.log(gameId);
  let game = games.get(gameId);
  console.log("game");
  console.log(game);
  if (!game) {
    const dbGame = await gameController.getGameByGameId(gameId);
    if (!dbGame) return callback(null); // بازی در پایگاه داده هم نبود

    game = {
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
    };
    // game = {
    //   gameState: {
    //     gameId,
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
    //     playedNavCards: dbGame.playedNavCards,
    //     phaseData: dbGame.phaseData,
    //     currenVoteSessionId: dbGame.currenVoteSessionId,
    //     nextPhaseData: dbGame.nextPhaseData,
    //     logs: dbGame.logs,
    //   },
    //   roomId: dbGame.roomId,
    // };

    games.set(gameId, game);
    // games.set(gameId, game, roomId);
  }

  // ارسال وضعیت کامل بازی
  callback({
    gameId,
    roomId,
    gameState: game,
  });
}

module.exports = {
  onGetGameStatus,
};
