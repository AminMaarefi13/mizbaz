const roomController = require("../controllers/roomController");
const { rooms } = require("../utils/memoryStore");

async function onToggleReady(socket, roomId, io) {
  const playerId = socket.user._id.toString();
  console.log(`🔄 Player ${playerId} toggling ready status in room ${roomId}`);
  console.log(rooms);
  console.log("rooms onToggleReady");
  const room = rooms.get(roomId);
  if (!room || room.gameStarted) return;
  const player = room.players.find((p) => p.playerId === playerId);
  if (!player) return;

  player.isReady = !player.isReady;

  // const roomObj = room.players.map((p) => ({
  //   playerId: p.playerId,
  //   nickname: p.nickname,
  //   isReady: p.isReady,
  //   socketId: p.socketId,
  // }));
  // به‌روزرسانی دیتابیس
  await roomController.updateRoom(roomId, {
    players: room.players.map((p) => ({
      playerId: p.playerId,
      nickname: p.nickname,
      isReady: p.isReady,
      socketId: p.socketId,
    })),
  });
  // console.log("room.players  daaaaa", room.players);
  // ارسال وضعیت جدید به همه‌ی اعضای روم
  io.to(roomId).emit("players_updated", {
    roomId,
    roomPlayers: room.players,
    // hostName: room.players[0]?.nickname || "نامشخص",
    // hostId: room.hostId,
  });
}

module.exports = {
  onToggleReady,
};
