const { getValidGameAndRoom } = require("../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../utils/updateAndBroadcastGame");

async function submitVote(
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
  const { playerId, gunsUsed } = eventSpecificData;
  // console.log("playerId");
  // console.log(playerId);
  // console.log("gunsUsed");
  // console.log(gunsUsed);
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return;
  // console.log("player");
  // console.log(player);
  const socketId = userSocketMap.get(playerId);
  const sessionId = gameState.currentVoteSessionId;
  // console.log("socket");
  // console.log(socketId);
  // console.log("gameState.currentPhase");
  // console.log(gameState.currentPhase);
  // چک: در فاز رأی‌گیری باشیم
  if (gameState.currentPhase !== "start_voting") {
    io.to(socketId).emit(
      "error_message",
      "در حال حاضر امکان رأی دادن وجود ندارد."
    );
  }

  // چک: کاپیتان یا آف‌دیو‌تی نمی‌تواند رأی دهد
  const isCaptain = playerId === gameState.captainId;
  if (isCaptain) {
    io.to(socketId).emit("error_message", "شما اجازه رأی دادن ندارید.");
  }
  // چک: قبلاً رأی داده؟
  const alreadyVoted = player.votes.some((v) => v.voteSessionId === sessionId);
  if (alreadyVoted) {
    io.to(socketId).emit("error_message", "شما قبلاً رأی داده‌اید.");
  }
  const eligibleVoters = gameState.players.filter(
    (p) => p.id !== gameState.captainId && !p.eliminated
  );

  // بررسی اینکه آیا بازیکن واجد شرایط رأی دادن است یا نه
  const isEligible = eligibleVoters.some((p) => p.id === playerId);

  let voteEntry;

  if (isEligible) {
    voteEntry = {
      voteSessionId: sessionId,
      playerId,
      nickname: player.name,
      gunsUsed,
      seen: false,
      timestamp: new Date(),
      eligible: true, // برای اطلاعات بیشتر
    };
  } else {
    voteEntry = {
      voteSessionId: sessionId,
      playerId,
      nickname: player.name,
      gunsUsed: 0, // یا هر مقدار پیش‌فرض دیگر
      seen: false,
      timestamp: new Date(),
      eligible: false, // برای تفکیک
      // note: "Captain cannot vote", // مثال از فیلد سفارشی
    };
  }

  // اضافه کردن رأی به لیست رأی‌های بازیکن
  player.votes.push(voteEntry);

  // لیست رأی‌دهندگان مجاز

  // لیست کسانی که رأی داده‌اند
  const submittedVotes = eligibleVoters.filter((p) =>
    p.votes.some((v) => v.voteSessionId === sessionId)
  );

  // ارسال وضعیت رأی‌گیری برای همه
  const progress = {
    current: submittedVotes.length,
    total: eligibleVoters.length,
  };

  gameState.phaseData = {
    currentPhase: "start_voting",
    title: "انتخاب کارت ناوبری",
    message: `vote_result - ${progress.current}/${progress.total}`,
    current: progress.current,
    total: progress.total,
  };
  // console.log("progress");
  // console.log(progress);
  gameState.currentPhase = "start_voting";

  // console.log("submittedVotes.length === eligibleVoters.length");
  updateAndBroadcastGame(
    games,
    gameId,
    gameState,
    roomId,
    room,
    userSocketMap,
    io
  );
  // console.log(submittedVotes.length === eligibleVoters.length);
  // اگر همه رأی دادند، نتایج ارسال شود
  if (submittedVotes.length === eligibleVoters.length) {
    gameState.currentPhase = "vote_pre_result";
    // console.log("gameState.currentPhase");
    // console.log(gameState.currentPhase);
    const result = submittedVotes.map((p) => {
      const vote = p.votes.find((v) => v.voteSessionId === sessionId);
      return {
        playerId: p.id,
        nickname: p.name,
        gunsUsed: vote?.gunsUsed ?? 0,
      };
    });
    const messageText =
      "📊 نتیجه رأی‌گیری شورش:" +
      "\n" +
      result
        .map(({ nickname, gunsUsed }) => {
          return `${nickname} - 🔫 تفنگ: ${gunsUsed}`;
        })
        .join("\n");
    gameState.phaseData = {
      phase: "vote_pre_result",
      title: "تعداد تفنگ های هر بازیکن",
      type: "see",
      message: messageText,
      result,
      phaseSeen: [],
    };
    gameState.nextPhaseData = {
      result,
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
}

module.exports = {
  submitVote,
};
