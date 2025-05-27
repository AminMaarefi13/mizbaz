const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");

async function startCabinetFormationPhase(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  const { emergency } = preparedData;
  console.log("emergency");
  console.log(emergency);
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  if (!captain) throw new Error("کاپیتان پیدا نشد.");
  console.log("captain");
  console.log(captain);

  let selectablePlayers;
  if (emergency) {
    selectablePlayers = gameState.players.map((p) => {
      let disabledReason = null;

      if (p.id === gameState.captainId) {
        disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
      } else if (p.eliminated) {
        disabledReason = "بازیکن از بازی حذف شده است";
      } else if (p.id === gameState.firstOfficerId) {
        disabledReason = "افسر اول را نمیتوان به عنوان کشتیران انتخاب کرد.";
      } else if (p.tongueOff) {
        disabledReason = "بازیکنی که زبانش بریده شده نمیتواند کاپیتان باشد.";
      }

      return {
        id: p.id,
        name: p.name,
        seat: p.seat,
        disabled: Boolean(disabledReason),
        disabledReason,
      };
    });
    gameState.phaseData = {
      currentPhase: "cabinet_formation",
      step: "waitingForCabinet",
      title: "تشکیل کابینه اضطراری",
      message: "کاپیتان در حال انتخاب کشتیران است...",
    };
    captain.privatePhaseData = {
      currentPhase: "cabinet_formation",
      step: "waitingForCabinet",
      selectablePlayers,
      emergency: true,
      title: "تشکیل کاببینه اضطراری",
      message: "شما باید یک کشتیران را انتخاب کنید.",
    };

    gameState.logs.push({
      type: "phase",
      text: `📋 کاپیتان باید یک کشتیران برای کابینه اضطراری انتخاب کند.`,
    });
  } else {
    gameState.firstOfficerId = null;
    gameState.navigatorId = null;

    selectablePlayers = gameState.players.map((p) => {
      let disabledReason = null;

      if (p.id === gameState.captainId) {
        disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
      } else if (p.eliminated) {
        disabledReason = "بازیکن از بازی حذف شده است";
      } else if (p.offDuty) {
        disabledReason = "بازیکن در کابینه قبلی حضور داشته است (off-duty).";
      } else if (p.tongueOff) {
        disabledReason = "بازیکنی که زبانش بریده شده نمیتواند کاپیتان باشد.";
      }

      return {
        id: p.id,
        name: p.name,
        seat: p.seat,
        disabled: Boolean(disabledReason),
        disabledReason,
      };
    });
    gameState.phaseData = {
      currentPhase: "cabinet_formation",
      step: "waitingForCabinet",
      title: "تشکیل کاببینه",
      message: "کاپیتان در حال انتخاب افسر اول و کشتیران است...",
    };
    captain.privatePhaseData = {
      currentPhase: "cabinet_formation",
      step: "waitingForCabinet",
      selectablePlayers,
      emergency: false,
      title: "تشکیل کاببینه",
      message: "شما باید یک افسر اول و یک کشتیران را انتخاب کنید.",
    };

    gameState.logs.push({
      type: "phase",
      text: `📋 کاپیتان باید یک افسر اول و یک کشتیران انتخاب کند.`,
    });
  }

  gameState.currentPhase = "cabinet_formation";
  console.log("gameState");
  console.log(gameState);

  updateAndBroadcastGame(
    games,
    gameId,
    gameState,
    roomId,
    room,
    userSocketMap,
    io
  );
}

module.exports = {
  startCabinetFormationPhase,
};
