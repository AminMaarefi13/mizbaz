const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");
const { journeyMapNodes } = require("../../config/journeyMapNodes");
const { offDutyCards } = require("../gameSetupConfig");

function handleNavigatorCard(
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

  const { journeyType, mapPosition } = gameState;
  const currentNode = journeyMapNodes[journeyType][mapPosition];
  const { card } = gameState.nextPhaseData;
  // console.log("card");
  // console.log(card);
  // console.log("currentNode");
  // console.log(currentNode);
  const cardColor = card.color;

  // ریست کردن وضعیت offDuty همه‌ی بازیکنان:
  gameState.players.forEach((p) => {
    p.offDuty = false;
  });
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  const firstOfficer = gameState.players.find(
    (p) => p.id === gameState.firstOfficerId
  );
  const navigator = gameState.players.find(
    (p) => p.id === gameState.navigatorId
  );
  const playerCount = gameState.players.length;
  const rolesToOffDuty = offDutyCards[journeyType]?.[playerCount] || [];
  rolesToOffDuty.forEach((role) => {
    switch (role) {
      case "Captain":
        if (captain) captain.offDuty = true;
        break;
      case "Lieutenant":
        if (firstOfficer) firstOfficer.offDuty = true;
        break;
      case "Navigator":
        if (navigator) navigator.offDuty = true;
        break;
    }
  });

  if (!currentNode) {
    throw new Error("موقعیت فعلی کشتی نامعتبر است.");
  }

  const nextNodeId = currentNode.next[cardColor];
  if (nextNodeId == null) {
    throw new Error("رنگ کارت نامعتبر است یا مسیر بعدی مشخص نشده.");
  }

  const nextNode = journeyMapNodes[journeyType][nextNodeId];
  const effect = nextNode.effect || null;
  const gunReload = nextNode.gunReload || null;

  gameState.mapPosition = nextNodeId;

  gameState.logs.push({
    type: "phase",
    text: `🚢 کشتی به موقعیت جدید (${nextNodeId}) حرکت کرد.`,
  });

  if (nextNode.isEnd) {
    gameState.currentPhase = "game_over";
    gameState.phaseData = {};
    gameState.winner = nextNode.winner;

    gameState.logs.push({
      type: "event",
      text: `🏁 بازی به پایان رسید. جناح برنده: ${nextNode.winner}`,
    });
    gameState.currentPhase = "game_over";
    gameState.phaseData = {
      currentPhase: "game_over",
      title: "پایان بازی",
      // type: "see",
      message: `🏁 بازی به پایان رسید. جناح برنده: ${nextNode.winner}`,
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
  }

  if (gunReload && !gameState.gunReloadUsed) {
    gameState.players.forEach((player) => {
      if (player.guns < 3) {
        player.guns = 3;
      }
    });
    gameState.logs.push({
      type: "gun_reload",
      text: `تفنگ های همه بازیکنان تا 3 عدد شارژ شد. 🔫 `,
    });
  }

  if (effect) {
    gameState.currentPhase = `${effect}_effect`;
    gameState.logs.push({
      type: "phase",
      text: `✨ افکت "${effect}" فعال شد.`,
    });
    gameState.phaseData = {
      title: "افکت مکان",
      type: "see",
      message: `✨ افکت "${effect}" فعال شد. کاپیتان باید یک نفر را انتخاب کند.`,
    };
    gameState.nextPhaseData = {
      effect,
      nodeId: nextNodeId,
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
  } else {
    gameState.currentPhase = "location_effect_resolved";
    gameState.phaseData = {
      title: "افکت مکان",
      type: "see",
      message: `افکت مکانی وجود نداره. مرحله بعدی: افکت کارت`,
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
  }
  // اگر افکتی ندارد و پایان بازی نیست، به راند بعد برو
}

module.exports = {
  handleNavigatorCard,
};
