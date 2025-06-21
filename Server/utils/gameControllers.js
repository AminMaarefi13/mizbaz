const feedTheKrakenGameController = require("../controllers/feedTheKrakenGameController");
const mineSweeperGameController = require("../controllers/mineSweeperGameController");
const splendorGameController = require("../controllers/splendorGameController");

const gameControllers = {
  feedTheKraken: feedTheKrakenGameController,
  mineSweeper: mineSweeperGameController,
  splendor: splendorGameController,
};

const allGameControllers = [
  { type: "feedTheKraken", controller: feedTheKrakenGameController },
  { type: "mineSweeper", controller: mineSweeperGameController },
  { type: "splendor", controller: splendorGameController },
];

module.exports = {
  gameControllers,
  allGameControllers,
};
