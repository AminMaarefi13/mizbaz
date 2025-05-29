const roomController = require("../controllers/roomController");
const gameController = require("../controllers/gameController");
const { describeKnownRoles } = require("../utils/describeKnownRoles");
const { makePublicState, makePrivateState } = require("../utils/makeStates");
const { gameStartPhase } = require("../utils/gameStartPhase");

async function onStartGame(
  roomId,
  playerId,
  socket,
  userSocketMap,
  rooms,
  games,
  io
) {
  // console.log("starstfbsaudsa;");
  // console.log(roomId);
  // console.log(playerId, socket, userSocketMap, rooms, games);
  const room = rooms.get(roomId);

  if (!room) {
    return socket.emit("error_message", "اتاق مورد نظر یافت نشد.");
  }

  // if (room.activeGameId) {
  //   return socket.emit("error_message", "بازی قبلاً در این اتاق شروع شده است.");
  // }

  if (room.hostId !== playerId) {
    return socket.emit(
      "error_message",
      "فقط میزبان می‌تواند بازی را شروع کند."
    );
  }

  const readyPlayers = room.players.filter((p) => p.isReady);
  if (readyPlayers.length < 5 || readyPlayers.length > 11) {
    return socket.emit(
      "error_message",
      "تعداد بازیکنان آماده باید بین ۵ تا ۱۱ نفر باشد."
    );
  }

  try {
    const gameId = Math.random().toString(36).substring(2, 10);
    const gameState = gameStartPhase(readyPlayers, "quick", roomId);

    // ثبت در حافظه
    // room.activeGameId = gameId;
    games.set(gameId, gameState);
    rooms.set(roomId, room);

    // اطمینان از وجود Set برای roomIds و اضافه کردن roomId جدید
    // if (!room.gameIds) {
    //   room.gameIds = new Set();
    // }
    // room.gameIds.add(gameId);
    const readyPlayersIds = readyPlayers.map((p) => p.playerId);

    if (!room.gameIds) {
      room.gameIds = [];
    }
    const gameIdsSet = new Set(room.gameIds);
    gameIdsSet.add({
      gameId,
      gameStatus: gameState.gameStatus,
      gamePlayersIds: readyPlayersIds,
    });
    room.gameIds = [...gameIdsSet];
    // بروزرسانی دیتابیس روم
    await roomController.updateRoom(roomId, {
      // activeGameId: gameId,
      gameIds: [...room.gameIds],
    });
    const captain = gameState.players.find(
      (pl) => pl.id === gameState.captainId
    );
    // ⚠️ اضافه کردن phaseSeen برای بازیکن‌های زنده
    gameState.phaseData = {
      phase: "start_game",
      title: "شروع بازی",
      type: "see",
      message: "بازی شروع شد! نقش مخفی خود را ببینید. کاپیتان: " + captain.name,
      phaseSeen: [],
    };
    for (const pl of gameState.players) {
      if (pl.knownRoles.length > 0) {
        const privateMessage = describeKnownRoles(pl.knownRoles, gameState);
        pl.privatePhaseData = {
          phase: "start_game",
          title: "شروع بازی",
          message: privateMessage,
        };
      }
    }
    gameState.nextPhaseData = {
      emergency: false,
    };

    gameState.gameId = gameId;
    // ذخیره وضعیت اولیه بازی در دیتابیس
    const gameDataToSave = {
      gameId,
      roomId,
      journeyType: gameState.journeyType,
      players: gameState.players,
      captainId: gameState.captainId,
      firstOfficerId: gameState.firstOfficerId,
      navigatorId: gameState.navigatorId,
      offDutyIds: gameState.offDutyIds,
      mapPosition: gameState.mapPosition,
      currentPhase: gameState.currentPhase,
      navigationDeck: gameState.navigationDeck,
      discardPile: gameState.discardPile,
      cultRitualDeck: gameState.cultRitualDeck,
      // navigationDeckLength: gameState.navigationDeck.length,
      // discardPileLength: gameState.discardPile.length,
      // cultRitualDeckLength: gameState.cultRitualDeck.length,
      playedNavCards: gameState.playedNavCards,
      gunReloadUsed: gameState.gunReloadUsed,
      currentVoteSessionId: gameState.currentVoteSessionId,
      phaseData: gameState.phaseData,
      nextPhaseData: gameState.nextPhaseData,
      logs: gameState.logs,
      gameStatus: gameState.gameStatus,
    };
    await gameController.createGame(gameDataToSave);

    for (const p of gameState.players) {
      const socketId = userSocketMap.get(p.id);
      // console.log(userSocketMap);

      if (!socketId) continue;

      const publicState = makePublicState(gameState);
      const privateState = makePrivateState(p);

      // مرحله ارسال وضعیت کامل اولیه
      io.to(socketId).emit("gameState", { publicState, privateState });

      io.to(socketId).emit("game_started", gameId);
      // مرحله اطلاع‌رسانی فاز فعلی
    }
  } catch (err) {
    console.error("❌ خطا در شروع بازی:", err);
    socket.emit("error_message", "خطا در شروع بازی.");
  }
}

module.exports = {
  onStartGame,
};
