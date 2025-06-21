const {
  startFeedTheKrakenGame,
} = require("../games/feedTheKraken/gamePhases/startFeedTheKrakenGame");
const {
  startMineSweeperGame,
} = require("../games/mineSweeper/gamePhases/startMineSweeperGame");
const {
  startSplendorGame,
} = require("../games/splendor/gamePhases/startSplendorGame");

const gameStartMap = {
  feedTheKraken: startFeedTheKrakenGame,
  mineSweeper: startMineSweeperGame,
  splendor: startSplendorGame,
};

module.exports = {
  gameStartMap,
};
