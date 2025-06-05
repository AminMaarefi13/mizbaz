const roomController = require("../controllers/roomController");
const gameController = require("../controllers/gameController");
const { rooms, games, userSocketMap } = require("../utils/memoryStore");
const { getPlayerLimits } = require("../utils/gamePlayerLimits");

// ایمپورت توابع شروع بازی‌ها
const {
  startFeedTheKrakenGame,
} = require("../games/feedTheKraken/gamePhases/startFeedTheKrakenGame");
const {
  startMineSweeperGame,
} = require("../games/mineSweeper/gamePhases/startMineSweeperGame");

const feedTheKrakenGameController = require("../controllers/feedTheKrakenGameController");
const mineSweeperGameController = require("../controllers/mineSweeperGameController");

const gameStartMap = {
  feedTheKraken: startFeedTheKrakenGame,
  mineSweeper: startMineSweeperGame,
  // ...
};

async function onStartGame(roomId, gameId, socket, io) {
  const playerId = socket.user._id.toString();
  const room = rooms.get(roomId);
  if (!room) return socket.emit("error_message", "اتاق مورد نظر یافت نشد.");

  const game = room.games.find((g) => g.gameId === gameId);
  if (!game || game.gameStatus !== "waiting") return;

  const readyPlayers = game.players.filter((p) => p.isReady);
  const { min, max } = getPlayerLimits(game.type);
  if (readyPlayers.length < min || readyPlayers.length > max) {
    const msg =
      min === max
        ? `تعداد بازیکنان باید دقیقا ${min} نفر باشد.`
        : `تعداد بازیکنان آماده باید بین ${min} تا ${max} نفر باشد.`;
    return socket.emit("error_message", msg);
  }

  try {
    // انتخاب تابع شروع بازی بر اساس نوع بازی
    const startGameFn = gameStartMap[game.type];
    if (!startGameFn) {
      return socket.emit("error_message", "نوع بازی پشتیبانی نمی‌شود.");
    }

    const gameControllers = {
      feedTheKraken: feedTheKrakenGameController,
      mineSweeper: mineSweeperGameController,
    };
    const type = game.type;
    const controller = gameControllers[type];

    // اجرای تابع مخصوص بازی و دریافت وضعیت اولیه بازی
    await startGameFn({
      readyPlayers,
      roomId,
      gameId,
      room,
      io,
      userSocketMap,
      gameController: controller,
      games,
      rooms,
    });
  } catch (err) {
    console.error("❌ خطا در شروع بازی:", err);
    socket.emit("error_message", "خطا در شروع بازی.");
  }
}

module.exports = {
  onStartGame,
};
