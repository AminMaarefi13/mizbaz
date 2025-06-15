const feedTheKrakenGameController = require("../controllers/feedTheKrakenGameController");
const mineSweeperGameController = require("../controllers/mineSweeperGameController");

const gameControllers = {
  feedTheKraken: feedTheKrakenGameController,
  mineSweeper: mineSweeperGameController,
};

const allGameControllers = [
  { type: "feedTheKraken", controller: feedTheKrakenGameController },
  { type: "mineSweeper", controller: mineSweeperGameController },
];

module.exports = {
  gameControllers,
  allGameControllers,
};
