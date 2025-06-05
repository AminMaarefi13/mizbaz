async function onPhaseConfirm({
  gameId,
  socket,
  io,
  games,
  rooms,
  userSocketMap,
}) {
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  console.log("payload");
  // console.log(payload);
  proceedToNextPhase({
    games,
    gameState,
    gameId,
    roomId,
    rooms,
    userSocketMap,
    io,
    eventSpecificData: payload,
  });
}

module.exports = {
  onPhaseConfirm,
};
