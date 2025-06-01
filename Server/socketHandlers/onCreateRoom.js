const { logAllUsers } = require("../utils/logAllusers");
const roomController = require("../controllers/roomController");
const connectionController = require("../controllers/connectionController");
const {
  rooms,
  connectionsArr,
  userSocketMap,
} = require("../utils/memoryStore");

async function onCreateRoom(socket, io) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(`🔗 Creating room for player ${playerId} with name ${name}`);
  // console.log(rooms, connectionsArr, userSocketMap);
  // console.log("rooms, connectionsArr, userSocketMap");
  const connectionUser =
    connectionsArr.get(playerId) ||
    (await connectionController.getConnectionByPlayerId(playerId));
  const roomId = Math.random().toString(36).substring(2, 8);

  const newPlayer = {
    nickname: name,
    playerId: playerId,
    socketId: socket.id,
    isReady: false,
  };

  const room = {
    roomId,
    players: [newPlayer],
    hostName: name,
    hostId: playerId,
    gameIds: [],
  };

  rooms.set(roomId, room);
  connectionUser.currentRoomId = roomId;
  connectionUser.currentGameId = null;
  // ذخیره در دیتابیس
  try {
    await roomController.createRoom(
      roomId,
      playerId,
      name,
      [
        {
          playerId,
          nickname: name,
          isReady: false,
          socketId: socket.id,
        },
      ],
      []
    );
  } catch (err) {
    console.error("❌ Failed to persist room:", err);
    socket.emit("error", { message: "خطا در ساختن روم." });
    return;
  }
  // console.log("room.players oooooo", room.players);

  socket.join(roomId);
  socket.emit("room_created", {
    roomId,
    roomPlayers: room.players,
    hostName: room.hostName,
    hostId: room.hostId,
    roomGames: room.gameIds,
  });

  // اطمینان از وجود Set برای roomIds و اضافه کردن roomId جدید
  // تبدیل آرایه به Set موقت، افزودن roomId و تبدیل مجدد به آرایه
  const userRoomsSet = new Set(connectionUser.userRooms || []);
  userRoomsSet.add({ roomId, hostName: name, hostId: playerId });
  connectionUser.userRooms = [...userRoomsSet];

  logAllUsers(userSocketMap, rooms);

  // ارسال لیست روم‌ها به کاربر
  const roomIds = new Set(
    Array.from(connectionUser?.userRooms || []).map((room) => room.roomId)
  );

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

  await connectionController.updateConnection(playerId, {
    currentRoomId: connectionUser.currentRoomId,
    currentGameId: connectionUser.currentGameId,
    socketId: socket.id,
    userRooms: userRoomsArr,
    name: connectionUser.name,
  });
}

module.exports = {
  onCreateRoom,
};
