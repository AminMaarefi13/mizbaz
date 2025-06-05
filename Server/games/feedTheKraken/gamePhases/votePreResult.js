const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");

async function votePreResult(
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
  const { result } = preparedData;
  // console.log(result);

  const submittedVotes = result;

  const totalGuns = submittedVotes.reduce((sum, v) => sum + v.gunsUsed, 0);

  const playerCount = gameState.players.length;
  const requiredGuns = playerCount <= 7 ? 3 : playerCount <= 9 ? 4 : 5;

  if (totalGuns < requiredGuns) {
    // شورش شکست خورد
    gameState.logs.push({
      type: "event",
      text: `❌ شورش شکست خورد. تفنگ‌ها به بازیکنان بازگشت.`,
    });
    gameState.logs.push({
      type: "event",
      text: `فاز ناوبری شروع میشود.`,
    });
    gameState.currentPhase = "mutiny_fail";
    gameState.phaseData = {
      currentPhase: "mutiny_fail",
      title: "نتیجه رای گیری",
      type: "see",
      message: `شورش ناموفق بود. \n
       مجموع تعداد تفنگ ها: ${totalGuns} \n
       تعداد تفنگ های لازم برای شورش: ${requiredGuns} \n
       مرحله بعد: کارت های ناوبری`,
    };
  } else {
    // شورش موفق بود
    submittedVotes.forEach((v) => {
      const p = gameState.players.find((p) => p.id === v.playerId);
      p.guns -= v.gunsUsed;
    });

    gameState.logs.push({
      type: "event",
      text: `✅ شورش موفق بود! کاپیتان جدید در راه است...`,
    });
    const tongueOffPlayer = gameState.players.find((p) => p.tongueOff);
    // console.log("submittedVotes");
    // console.log(submittedVotes);
    // console.log("tongueOffPlayer");
    // console.log(tongueOffPlayer);
    const submittedVotesExceptTongueOff = submittedVotes.filter(
      (v) => v.playerId !== tongueOffPlayer?.id
    );
    // console.log("submittedVotesExceptTongueOff");
    // console.log(submittedVotesExceptTongueOff);
    const maxGuns = Math.max(
      ...submittedVotesExceptTongueOff.map((v) => v.gunsUsed)
    );

    const topCandidates = submittedVotes.filter((v) => v.gunsUsed === maxGuns);
    if (topCandidates.length === 1) {
      const newCaptainId = topCandidates[0].playerId;
      gameState.captainId = newCaptainId;
      gameState.navigatorId = null;
      gameState.firstOfficerId = null;
      gameState.players.forEach((p) => {
        p.isCaptain = p.id === gameState.captainId;
      });

      gameState.logs.push({
        type: "event",
        text: `🎖 ${topCandidates[0].nickname} کاپیتان جدید شد.`,
      });
      gameState.currentPhase = "mutiny_success";
      gameState.phaseData = {
        currentPhase: "mutiny_success",
        title: "نتیجه رای گیری",
        type: "see",
        message: `شورش موفق بود. \n
       مجموع تعداد تفنگ ها: ${totalGuns} \n
       تعداد تفنگ های لازم برای شورش: ${totalGuns} \
       کاپیتان جدید: ${topCandidates[0].nickname} \n
       تعداد تفنگ ها: ${maxGuns} \n
       مرحله بعد: تشکیل کابینه توسط کاپیتان جدید`,
      };
      gameState.nextPhaseData = {
        emergency: false,
      };
    } else {
      gameState.currentPhase = "vote_tie_break_start";
      const tiedPlayersString =
        "بیشترین تفنگ ها:" +
        "\n" +
        topCandidates
          .map(({ nickname, gunsUsed }) => {
            return `${nickname} - 🔫 تفنگ: ${gunsUsed}`;
          })
          .join("\n") +
        "\n" +
        `شورش موفق بود. \n
       مجموع تعداد تفنگ ها: ${totalGuns} \n
       تعداد تفنگ های لازم برای شورش: ${totalGuns} \
       مرحله بعد: حذف یکی از بازیکنان با بیشترین تفنگ توسط کاپیتان`;
      gameState.phaseData = {
        currentPhase: "vote_tie_break_start",
        title: "نتیجه رای گیری",
        type: "see",
        message: tiedPlayersString,
      };
      gameState.nextPhaseData = {
        tiedPlayers: topCandidates.map((v) => ({
          id: v.playerId,
          name: v.nickname,
          gunsUsed: v.gunsUsed,
        })),
        eliminatorId: gameState.captainId,
      };

      // console.log(`🟰 تساوی در رأی‌ها! کاپیتان باید یکی از افراد را حذف کند.`);
      gameState.logs.push({
        type: "phase",
        text: `🟰 تساوی در رأی‌ها! کاپیتان باید یکی از افراد را حذف کند.`,
      });
    }
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
  votePreResult,
};
