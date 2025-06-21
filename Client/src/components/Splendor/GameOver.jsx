import React from "react";

export default function GameOver({ gameState, myIndex }) {
  console.log(gameState);
  const sortedPlayers = [...gameState.players].sort(
    (a, b) => b.prestigePoints - a.prestigePoints
  );
  console.log(myIndex);
  console.log(gameState.phaseData.winners);
  const winners = gameState.phaseData.winners;
  if (winners.length === 1) {
    return (
      <div
        style={{
          direction: "rtl",
        }}
      >
        {winners[0].seat === myIndex && <div>شما برنده شدید!</div>}
        <div>برنده: </div>
        <div>{winners[0].name}</div>
        {sortedPlayers.map((player) => {
          return (
            <>
              <div key={player.seat}>
                {player.name}: {player.prestigePoints}
              </div>
            </>
          );
        })}
      </div>
    );
  } else {
    return <div>برندگان: </div>;
  }
}
