const mongoose = require("mongoose");

const gamePlayerSchema = new mongoose.Schema({
  id: String,
  name: String,
  score: { type: Number, default: 0 },
});

const MineSweeperGameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true }, // اضافه شده
  roomId: { type: String, required: true },
  players: [gamePlayerSchema],
  gameStatus: {
    type: String,
    enum: ["waiting", "onGoing", "gameOver"],
    default: "waiting",
  },
  currentPhase: { type: String, default: "game_start" },
  map: [],
  clientMap: [],
  turn: { type: Number, default: 0 },
  phaseData: {},
  nextPhaseData: {},
  allTime: [],
  logs: [],
  type: { type: String, default: "mineSweeper" },
  // playerOne: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: [true, "Please provide playerOne's ID"],
  // },
  // playerTwo: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: [true, "Please provide playerTwo's ID"],
  // },
  // results: {
  //   type: Array,
  // },
  // // xp: {
  // //   type: Number,
  // // },
});

module.exports = mongoose.model("MineSweeperGame", MineSweeperGameSchema);
