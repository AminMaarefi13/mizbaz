const mongoose = require("mongoose");

const playerRoomSchema = new mongoose.Schema({
  nickname: String,
  playerId: { type: String, required: true },
  socketId: String,
  isReady: { type: Boolean, default: false },
});

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    hostId: { type: String, required: true },
    hostName: { type: String },
    players: [playerRoomSchema],
    // gamePhase: { type: String, default: "lobby" },
    gameIds: { type: Array, default: [] },
    // activeGameId: { type: String, default: null }, // ✅ اضافه کن برای مشخص کردن بازی فعال کنونی در این اتاق
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
