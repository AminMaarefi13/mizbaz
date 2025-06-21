function checkGameOver(gameState) {
  if (gameState.finalRound) {
    console.log("turn", gameState.turn);
    if (gameState.turn === gameState.players.length - 1) {
      gameState.currentPhase = "game_over";
      const sortedPlayers = [...gameState.players].sort(
        (a, b) => b.prestigePoints - a.prestigePoints
      );

      // پیدا کردن بیشترین تعداد تفنگ
      const maxPrestigePoints =
        sortedPlayers.length > 0 ? sortedPlayers[0].prestigePoints : 0;
      const winners = sortedPlayers.filter(
        (player) => player.prestigePoints === maxPrestigePoints
      );
      gameState.phaseData = { winners };
    }
  } else {
    const isFinalRound = gameState.players.some(
      (player) => player.prestigePoints >= 15
    );
    if (isFinalRound) {
      gameState.finalRound = true;
    }
  }
}

module.exports = checkGameOver;
