async function onGetRoomState(roomId, callback, rooms) {
  const room = rooms.get(roomId);
  // console.log("room.players jjjjjjjjjjj", room.players);

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
