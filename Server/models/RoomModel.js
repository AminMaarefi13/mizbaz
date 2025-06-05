const mongoose = require("mongoose");

const gamePlayerSchema = new mongoose.Schema({
  nickname: String,
  playerId: { type: String, required: true },
  socketId: String,
  isReady: { type: Boolean, default: false },
});

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true },
  roomId: { type: String, required: true },
  type: { type: String, required: true }, // نوع بازی (kraken, mafia, ...)
  players: [gamePlayerSchema],
  gameStatus: { type: String, default: "waiting" }, // وضعیت بازی (waiting, onGoing, gameOver)
  // می‌توانی state یا فیلدهای دیگر هم اضافه کنی
});

const playerRoomSchema = new mongoose.Schema({
  nickname: String,
  playerId: { type: String, required: true },
  socketId: String,
  // isReady: { type: Boolean, default: false },
});

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    hostId: { type: String, required: true },
    hostName: { type: String },
    players: [playerRoomSchema],
    pendingInvites: [
      {
        from: String,
        fromName: String,
        to: String,
        toName: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    games: [gameSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);

// const mongoose = require("mongoose");

// const playerRoomSchema = new mongoose.Schema({
//   nickname: String,
//   playerId: { type: String, required: true },
//   socketId: String,
//   isReady: { type: Boolean, default: false },
// });

// const roomSchema = new mongoose.Schema(
//   {
//     roomId: { type: String, required: true, unique: true },
//     hostId: { type: String, required: true },
//     hostName: { type: String },
//     players: [playerRoomSchema],
//     games: { type: Array, default: [] },
//     pendingInvites: [
//       {
//         from: String, // userId دعوت‌کننده
//         fromName: String, // نام دعوت‌کننده
//         to: String, // userId دعوت‌شونده
//         toName: String, // نام دعوت‌شونده
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Room", roomSchema);
