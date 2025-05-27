const roomController = require("../controllers/roomController");

async function onGetAllGames(roomId, callback) {
  try {
    console.log("Fetching all games for room:", roomId.roomId);
    if (!roomId || !roomId.roomId) {
      console.error("Invalid roomId:", roomId);
      return callback({ error: "Invalid roomId" });
    }
    // گرفتن تمام بازی‌ها از دیتابیس
    // const gamesData = await gameController.getAllGames(roomId.roomId);
    const roomData = await roomController.getAllGamesByRoomId(roomId.roomId);
    console.log("Fetching all games for room:", roomId.roomId);

    console.log("Fetched room data:", roomData);
    console.log("gameIds ID:", roomData[0].gameIds);
    // const userGamesData = roomData.map((room) => {
    //   return room.gameIds;
    // });
    // ارسال اطلاعات بازی‌ها به کلاینت
    callback(roomData[0].gameIds);
  } catch (err) {
    console.error("Error fetching all games:", err);
    callback({ error: "Error fetching all games" });
  }
}

module.exports = {
  onGetAllGames,
};
