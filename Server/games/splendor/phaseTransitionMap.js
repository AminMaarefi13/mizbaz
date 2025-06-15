const { onConfirmMove } = require("./gamePhases/onConfrmMove");

const phaseTransitionMap = {
  // game_start: {
  //   next: "cabinet_formation",
  //   handler: startCabinetFormationPhase,
  //   prepare: (gameState) => gameState.nextPhaseData || {},
  // },
  confirm_move: {
    next: "cultRitualFinished",
    handler: onConfirmMove,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  // cult_ritual_resolved: {
  //   next: "cabinet_formation",
  //   handler: startCabinetFormationPhase,
  //   prepare: (gameState) => gameState.nextPhaseData || {},
  // },
};

module.exports = phaseTransitionMap;
