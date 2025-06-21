const mongoose = require("mongoose");

const gamePlayerSchema = new mongoose.Schema({
  id: String,
  name: String,
  chips: [],
  devCards: { type: Array, default: [] },
  reservedCards: { type: Array, default: [] },
  nobleTilesOwned: { type: Array, default: [] },
  prestigePoints: { type: Number, default: 0 },
  seat: { type: Number, default: 0 },
});

const SplendorGameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true }, // اضافه شده
  roomId: { type: String, required: true },
  players: [gamePlayerSchema],
  gameStatus: {
    type: String,
    enum: ["waiting", "onGoing", "gameOver"],
    default: "waiting",
  },
  currentPhase: { type: String, default: "game_start" },
  // levelOneDevCardsDeck: [],
  // levelTwoDevCardsDeck: [],
  // levelThreeDevCardsDeck: [],
  // levelOneDevCardsVisible: [],
  // levelTwoDevCardsVisible: [],
  // levelThreeDevCardsVisible: [],
  devCardsDeck: [],
  devCardsVisible: [],
  nobleTilesDeck: [],
  chipQuantities: [],
  // whiteChipQuantity: { type: Number, default: 0 },
  // blueChipQuantity: { type: Number, default: 0 },
  // redChipQuantity: { type: Number, default: 0 },
  // greenChipQuantity: { type: Number, default: 0 },
  // blackChipQuantity: { type: Number, default: 0 },
  // yellowChipQuantity: { type: Number, default: 0 },
  turn: { type: Number, default: 0 },
  finalRound: { type: Boolean, default: false },
  phaseData: {},
  nextPhaseData: {},
  logs: [],
  type: { type: String, default: "splendor" },
});

module.exports = mongoose.model("SplendorGame", SplendorGameSchema);
