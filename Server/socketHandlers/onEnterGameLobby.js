const { rooms } = require("../utils/memoryStore");
const roomController = require("../controllers/roomController");

async function onEnterGameLobby(socket, roomId, gameId, callback) {
  const playerId = socket.user._id.toString();

  const room = rooms.get(roomId);
  if (!room) return callback({ success: false, message: "روم پیدا نشد." });

  const game = room.games?.find((g) => g.gameId === gameId);
  if (!game) return callback({ success: false, message: "بازی پیدا نشد." });

  // دیگر بازیکن جدید اضافه نمی‌شود
  callback({ success: true, game });
}

module.exports = { onEnterGameLobby };

// const { rooms } = require("../utils/memoryStore");
// const roomController = require("../controllers/roomController");

// async function onEnterGameLobby(socket, roomId, gameId, callback) {
//   const playerId = socket.user._id.toString();
//   const name = socket.user.name || "نامشخص";

//   const room = rooms.get(roomId);
//   if (!room) return callback({ success: false, message: "روم پیدا نشد." });

//   const game = room.games?.find((g) => g.gameId === gameId);
//   if (!game) return callback({ success: false, message: "بازی پیدا نشد." });

//   let player = game.players.find((p) => p.playerId === playerId);

//   if (!player && game.gameStatus === "waiting") {
//     // بازیکن را به بازی اضافه کن
//     player = {
//       playerId,
//       nickname: name,
//       socketId: socket.id,
//       isReady: false,
//     };
//     game.players.push(player);
//     // ذخیره تغییرات در دیتابیس
//     await roomController.updateRoom(roomId, { games: room.games });
//   }

//   callback({ success: true, game });
// }

// module.exports = { onEnterGameLobby };
