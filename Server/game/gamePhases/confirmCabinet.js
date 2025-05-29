const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");

async function confirmCabinet(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  // console.log("✅ رویداد confirm_cabinet دریافت شد");
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  const { emergency, firstOfficerId, navigatorId } = eventSpecificData;
  // به‌روزرسانی gameState
  gameState.firstOfficerId = firstOfficerId;
  gameState.navigatorId = navigatorId;

  // لاگ
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  const firstOfficer = gameState.players.find((p) => p.id === firstOfficerId);
  const navigator = gameState.players.find((p) => p.id === navigatorId);

  gameState.logs.push({
    type: "cabinet_confirmed",
    text: `🎖️ کاپیتان ${captain.name} 
            ${firstOfficer.name} ر, به عنوان 👨‍✈️ افسر اول و
            ${navigator.name} ر, به عنوان 🧭 کشتیران
            انتخاب کرد.
            🗳️ حالا وقتشه تصمیم بگیرید که این کابینه ر, قبول دارید یا نه.`,
  });

  if (emergency) {
    gameState.currentPhase = "emergency_cabinet_confirmed";
    gameState.phaseData = {
      currentPhase: "emergency_cabinet_confirmed",
      type: "see",
      title: "انتخاب های کاپیتان",
      message: `🎖️ کاپیتان ${captain.name} 
            ${navigator.name} ر, به عنوان 🧭 کشتیران
            انتخاب کرد.
           علیه کابینه اضطراری نمیشه شورش کرد. پس مرحله بعد کارت های ناوبری پخش خواهد شد.`,
    };
    captain.privatePhaseData = {};
  } else {
    gameState.currentPhase = "cabinet_confirmed";
    gameState.phaseData = {
      currentPhase: "cabinet_confirmed",
      type: "see",
      title: "انتخاب های کاپیتان",
      message: `🎖️ کاپیتان ${captain.name} 
            ${firstOfficer.name} ر, به عنوان 👨‍✈️ افسر اول و
            ${navigator.name} ر, به عنوان 🧭 کشتیران
            انتخاب کرد.
            🗳️ حالا وقتشه تصمیم بگیرید که این کابینه ر, قبول دارید یا نه.`,
    };
    captain.privatePhaseData = {};
  }
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
  confirmCabinet,
};
