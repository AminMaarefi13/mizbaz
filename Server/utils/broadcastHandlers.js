const broadcastHandlers = {
  feedTheKraken:
    require("../games/feedTheKraken/utils/broadcastGameStateToPlayers.js")
      .broadcastGameStateToPlayers,
  mineSweeper:
    require("../games/mineSweeper/utils/broadcastGameStateToPlayers.js")
      .broadcastGameStateToPlayers,
  splendor: require("../games/splendor/utils/broadcastGameStateToPlayers.js")
    .broadcastGameStateToPlayers,
};

module.exports = {
  broadcastHandlers,
};
