const feedTheKrakenPhaseHandlers = require("../games/feedTheKraken/socketHandlers/phaseHandlers");
const mineSweeperPhaseHandlers = require("../games/mineSweeper/socketHandlers/phaseHandlers");

const phaseHandlerMap = {
  feedTheKraken: feedTheKrakenPhaseHandlers,
  mineSweeper: mineSweeperPhaseHandlers,
};

module.exports = {
  phaseHandlerMap,
};
