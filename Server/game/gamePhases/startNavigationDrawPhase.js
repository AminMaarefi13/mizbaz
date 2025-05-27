const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");

async function startNavigationDrawPhase(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  const { navigationDeck, captainId, firstOfficerId } = gameState;
  console.log("gameState startNavigationDrawPhase");
  console.log(gameState);
  gameState.nextPhaseData = {};
  if (navigationDeck.length < 4) {
    throw new Error("تعداد کارت‌های مسیر برای توزیع کافی نیست.");
  }
  console.log("navigationDeck before");
  console.log(navigationDeck.length);
  console.log(navigationDeck);
  // کارت‌ها را از ته deck بردار
  const captainCards = navigationDeck.splice(-2);
  const firstOfficerCards = navigationDeck.splice(-2);
  console.log("navigationDeck after");
  console.log(navigationDeck.length);
  console.log(navigationDeck);

  // تنظیم فاز و داده‌ها
  gameState.currentPhase = "navigation_cards_draw";
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  const firstOfficer = gameState.players.find(
    (p) => p.id === gameState.firstOfficerId
  );

  captain.privatePhaseData = {
    currentPhase: "navigation_cards_draw",
    title: "انتخاب کارت ناوبری",
    captainId,
    cabinRole: "captain",
    cards: captainCards,
  };
  firstOfficer.privatePhaseData = {
    currentPhase: "navigation_cards_draw",
    title: "انتخاب کارت ناوبری",
    firstOfficerId,
    cabinRole: "firstOfficer",
    cards: firstOfficerCards,
  };
  gameState.phaseData = {
    currentPhase: "navigation_cards_draw",
    title: "انتخاب کارت ناوبری",
    message:
      "کاپیتان و افسر اول هر کدام دو کارت مسیر دریافت کردند و در حال انتخاب یکی از آن ها هستند که به ناوبر بدهند...",
  };

  gameState.logs.push({
    type: "phase",
    text: `🧭 کاپیتان و افسر اول هر کدام دو کارت مسیر دریافت کردند.`,
  });
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
  startNavigationDrawPhase,
};
