const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");

async function confirmMermaidOrTelescopeChoice(
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
  const { targetPlayerId, type } = eventSpecificData;
  const targetPlayer = gameState.players.find((p) => p.id === targetPlayerId);
  if (!targetPlayer) return;

  // ذخیره انتخاب در state (برای لاگ یا مراجعات بعدی)
  const targetSocketId = userSocketMap.get(targetPlayerId);

  if (!targetSocketId) return;

  if (type === "mermaid") {
    console.log("gameState");
    console.log(gameState);
    // 🔍 ارسال سه کارت انداخته شده اخیر (شافل شده) به بازیکن
    const discarded = [...gameState.discardPile];
    const lastThree = discarded.slice(-3).sort(() => Math.random() - 0.5); // شافل
    console.log("lastThree");
    console.log(lastThree);
    gameState.currentPhase = "mermaid_choice";
    gameState.phaseData = {
      currentPhase: "mermaid_choice",
      title: "پری دریایی",
      // type: "see",
      message: `🧜 کاپیتان بازیکن ${targetPlayer.name} را برای دیدن سه کارت انداخته‌شده به دریا انتخاب کرد.`,
    };
    targetPlayer.privatePhaseData = {
      cards: lastThree,
      type: "mermaid_choice",
    };
  } else if (type === "telescope") {
    // 🔭 ارسال کارت بالای Deck به بازیکن برای انتخاب
    console.log("gameState");
    console.log(gameState);
    console.log("dicardPile");
    console.log(gameState.dicardPile);
    console.log("navigationDeck");
    console.log(gameState.navigationDeck);
    const topCard =
      gameState.navigationDeck[gameState.navigationDeck.length - 1];

    console.log("topCard");
    console.log(topCard);

    gameState.currentPhase = "telescope_choice";
    gameState.phaseData = {
      currentPhase: "telescope_choice",
      title: "تلسکوپ",
      // type: "see",
      message: `🔭 کاپیتان بازیکن ${targetPlayer.name} را برای دیدن کارت بالای دسته انتخاب کرد. حالا بازیکن باید انتخاب کند این کارت را میخواهد به کارت های برگرداند یا به دریا بیندازد...`,
    };
    targetPlayer.privatePhaseData = {
      card: topCard,
      type: "telescope_choice",
    };
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
  confirmMermaidOrTelescopeChoice,
};
