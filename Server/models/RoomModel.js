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
    gameIds: { type: Array, default: [] },
    pendingInvites: [
      {
        from: String, // userId دعوت‌کننده
        fromName: String, // نام دعوت‌کننده
        to: String, // userId دعوت‌شونده
        toName: String, // نام دعوت‌شونده
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
