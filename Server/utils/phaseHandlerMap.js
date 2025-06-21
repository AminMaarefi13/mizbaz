const feedTheKrakenPhaseHandlers = require("../games/feedTheKraken/socketHandlers/phaseHandlers");
const mineSweeperPhaseHandlers = require("../games/mineSweeper/socketHandlers/phaseHandlers");
const splendorPhaseHandlers = require("../games/splendor/socketHandlers/phaseHandlers");

const phaseHandlerMap = {
  feedTheKraken: feedTheKrakenPhaseHandlers,
  mineSweeper: mineSweeperPhaseHandlers,
  splendor: splendorPhaseHandlers,
};

module.exports = {
  phaseHandlerMap,
};
