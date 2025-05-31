const { rooms } = require("../utils/memoryStore");

async function onGetRoomState(roomId, callback) {
  const room = rooms.get(roomId);
  console.log("onGetRoomState");
  console.log(rooms);
  console.log("rooms onGetRoomState");
  if (!room) return callback(null);
  callback({
    roomId,
    roomPlayers: room.players,
    hostName: room.players[0]?.nickname || "نامشخص",
    hostId: room.hostId,
    // gameStarted: room.gameStarted || false,
    // activeGameId: room.activeGameId || null,
    userGames: room.gameIds || [],
  });
}

module.exports = {
  onGetRoomState,
};
