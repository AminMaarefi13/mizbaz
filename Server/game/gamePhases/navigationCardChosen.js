const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");
const gameController = require("../../controllers/gameController");
const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");

async function navigationCardChosen(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  const { emergency, playerId, chosenCard, discardedCard, cabinRole } =
    eventSpecificData;
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  console.log("gameState navigationCardChosen");
  console.log(gameState);
  console.log("playerId");
  console.log(playerId);
  if (!gameState.phaseData) gameState.phaseData = {};
  if (cabinRole === "navigator") {
    if (!emergency) {
      console.log(gameState);
      console.log(gameState.playedNavCards);
      gameState.playedNavCards.push(chosenCard);
      gameState.discardPile.push(discardedCard);
      const captain = gameState.players.find(
        (pl) => pl.id === gameState.captainId
      );
      captain.resume.push(chosenCard);

      gameState.currentPhase = "navigation_card_chosen";
      const cardMessage = `کارت انتخابی کشتیران: \n
      ${chosenCard.color}
      ${chosenCard.type}`;
      gameState.phaseData = {
        currentPhase: "navigation_card_chosen",
        title: " کارت انتخابی کشتیران",
        type: "see",
        message: cardMessage,
      };
      gameState.nextPhaseData = {
        card: chosenCard,
      };
      updateAndBroadcastGame(
        games,
        gameId,
        gameState,
        roomId,
        room,
        userSocketMap,
        io
      );
      console.log("gameState.phaseData");
    } else {
      gameState.discardPile.push(chosenCard);
      gameState.discardPile.push(discardedCard);
      const navigator = gameState.players.find(
        (p) => p.id === gameState.navigatorId
      );
      navigator.eliminated = true;
      gameState.navigatorId = null;
      gameState.logs.push({
        type: "event",
        text: `کشتیران هیچ کارتی رو انتخاب نکرد و خودشو پرت کرد تو آب. مرحله بعد: تشکیل کابینه اضطراری`,
      });
      gameState.currentPhase = "navigator_denial";
      gameState.phaseData = {
        currentPhase: "navigator_denial",
        title: "حذف ناوبر",
        type: "see",
        message: `کشتیران هیچ کارتی رو انتخاب نکرد و خودشو پرت کرد تو آب. مرحله بعد: تشکیل کابینه اضطراری`,
      };
      gameState.nextPhaseData = {
        emergency: true,
      };
      updateAndBroadcastGame(
        games,
        gameId,
        gameState,
        roomId,
        room,
        userSocketMap,
        io
      );
      return;
    }
  }
  const isCaptain = playerId === gameState.captainId;
  const isFirstOfficer = playerId === gameState.firstOfficerId;
  console.log("isCaptain");
  console.log("isFirstOfficer");
  console.log(isCaptain);
  console.log(isFirstOfficer);
  if (!isCaptain && !isFirstOfficer) return;

  // ثبت انتخاب
  if (isCaptain && !gameState.nextPhaseData.captainCardChosen) {
    gameState.nextPhaseData.captainCardChosen = chosenCard;
    gameState.nextPhaseData.captainCardDiscarded = discardedCard;
    console.log("gameState.nextPhaseData.captainSubmitted = true;");
    gameState.nextPhaseData.captainSubmitted = true;
  }

  if (isFirstOfficer && !gameState.nextPhaseData.officerCardChosen) {
    gameState.nextPhaseData.officerCardChosen = chosenCard;
    gameState.nextPhaseData.officerCardDiscarded = discardedCard;
    console.log("gameState.nextPhaseData.officerSubmitted = true;");
    gameState.nextPhaseData.officerSubmitted = true;
  }

  // اگر هر دو نفر انتخابشون رو انجام دادن:
  if (
    gameState.nextPhaseData.captainSubmitted &&
    gameState.nextPhaseData.officerSubmitted
  ) {
    const finalCards = [
      gameState.nextPhaseData.captainCardChosen,
      gameState.nextPhaseData.officerCardChosen,
    ];
    console.log("finalCards");
    console.log(finalCards);

    // دو کارت دورریخته شده به دیسکارد
    gameState.discardPile.push(
      gameState.nextPhaseData.captainCardDiscarded,
      gameState.nextPhaseData.officerCardDiscarded
    );

    // شافل کارت‌ها
    const shuffled = finalCards.sort(() => Math.random() - 0.5);
    console.log("shuffled");
    console.log(shuffled);

    // فاز جدید
    const navigator = gameState.players.find(
      (p) => p.id === gameState.navigatorId
    );

    gameState.currentPhase = "navigator_choose_card";
    gameState.nextPhaseData = {}; // فاز بعدی نیازی به داده‌های قبلی نداره
    navigator.privatePhaseData = {
      currentPhase: "navigator_choose_card",
      title: "انتخاب کارت توسط کشتیران",
      navigatorId: navigator.id,
      cabinRole: "navigator",
      cards: shuffled,
    };
    gameState.phaseData = {
      currentPhase: "navigator_choose_card",
      title: "انتخاب کارت توسط کشتیران",
      message: "کشتیران دو کارت از کاپیتان و افسر اول دریافت کرد...",
    };
    gameState.logs.push({
      type: "phase",
      text: "🧭 کشتیران در حال انتخاب کارت مسیر است.",
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
  } else {
    // اگر هنوز یکی از دو نفر انتخاب نکرده
    games.set(gameId, gameState);
    // games.set(gameId, { gameState: gameState, roomId });
    await gameController.updateGame(gameId, gameState);
    // await gameController.updateGame(gameId, { gameState: gameState, roomId });
  }
}

module.exports = {
  navigationCardChosen,
};
