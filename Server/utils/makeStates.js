function makePublicState(gameState) {
  console.log("makePublicState");
  // console.log(gameState);
  return {
    gameId: gameState.gameId,
    roomId: gameState.roomId,
    journeyType: gameState.journeyType,
    players: gameState.players.map((player) => ({
      id: player.id,
      name: player.name,
      seat: player.seat,
      isCaptain: player.isCaptain,
      guns: player.guns,
      offDuty: player.offDuty,
      characterCard: player.characterCard,
      canJoinCult: player.canJoinCult,
      tongueOff: player.tongueOff,
      initialRole: player.initialRole,
      eliminated: player.eliminated,
      isNotARole: player.isNotARole,
      resume: player.resume,
    })),
    captainId: gameState.captainId,
    firstOfficerId: gameState.firstOfficerId,
    navigatorId: gameState.navigatorId,
    offDutyIds: gameState.offDutyIds,
    mapPosition: gameState.mapPosition,
    currentPhase: gameState.currentPhase,
    // navigationDeckLength: gameState.navigationDeck.length,
    // discardPileLength: gameState.discardPile.length,
    // cultRitualDeckLength: gameState.cultRitualDeck.length,
    playedNavCards: gameState.playedNavCards,
    gunReloadUsed: gameState.gunReloadUsed,
    currentVoteSessionId: gameState.currentVoteSessionId,
    logs: gameState.logs,
    phaseData: gameState.phaseData,
    nextPhaseData: gameState.nextPhaseData,
    gameStatus: gameState.gameStatus,
  };
}

function makePrivateState(player) {
  return {
    // id: player.id,
    // name: player.name,
    seat: player.seat,
    characterCard: player.characterCard,
    role: player.role,
    knownRoles: player.knownRoles,
    guns: player.guns,
    offDuty: player.offDuty,
    votes: player.votes,
    canJoinCult: player.canJoinCult,
    tongueOff: player.tongueOff,
    initialRole: player.initialRole,
    eliminated: player.eliminated,
    isNotARole: player.isNotARole,
    resume: player.resume,
    privatePhaseData: player.privatePhaseData,
  };
}

// function makeConnectionState(player) {
//   return {
//     id: player.id,
//     name: player.name,
//     seat: player.seat,
//     characterCard: player.characterCard,
//     role: player.role,
//     knownRoles: player.knownRoles,
//     guns: player.guns,
//     offDuty: player.offDuty,
//     votes: player.votes,
//     canJoinCult: player.canJoinCult,
//     tongueOff: player.tongueOff,
//     initialRole: player.initialRole,
//     eliminated: player.eliminated,
//     isNotARole: player.isNotARole,
//     resume: player.resume,
//     privatePhaseData: player.privatePhaseData,
//   };
// }

module.exports = {
  makePublicState,
  makePrivateState,
  // makeConnectionState,
};
