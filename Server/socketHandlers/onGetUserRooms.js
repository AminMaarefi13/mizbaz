const connectionController = require("../controllers/connectionController");

async function onGetUserRooms(playerId, callback, connectionsArr, rooms) {
  const connectionUser =
    connectionsArr.get(playerId) ||
    (await connectionController.getConnectionByPlayerId(playerId));

  // فقط roomIdها را استخراج کن
  const roomIds = new Set(
    (connectionUser?.userRooms || []).map((room) => room.roomId)
  );
  const result = Array.from(roomIds)
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

  callback(result);
}

module.exports = {
  onGetUserRooms,
};
