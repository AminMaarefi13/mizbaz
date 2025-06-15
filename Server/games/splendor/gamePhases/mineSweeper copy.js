const userRouter = require("./routes/userRoutes");
const gameRouter = require("./routes/userRoutes");
const MinesweeperStat = require("./models/minesweeperStatsModel");
let socket;
let usersConnectedArr = [];
let ongoingGames = [];

// endGame
// endGame
// endGame
// endGame
// endGame

io.to(data.room).emit(data);
// onUpdateGame
// onUpdateGame
// onUpdateGame
// onUpdateGame
// onUpdateGame

// console.log("update_game Data");
// console.log(data);
if (ongoingGames.length === 0) {
  ongoingGames.push(data);
} else {
  for (let i = 0; i < ongoingGames.length; i++) {
    if (ongoingGames[i].room === data.room) {
      ongoingGames[i] = { ...ongoingGames[i], ...data };
      break;
    }
  }
}
let match;
let newAllTimeScore;
if (data?.allTimeScore) {
  newAllTimeScore = [...data.allTimeScore];
  if (data.winner === 0) {
    newAllTimeScore[0] += 1;
  }
  if (data.winner === 1) {
    newAllTimeScore[1] += 1;
  }
  let newAllTimeScoreDatabase = newAllTimeScore;
  if (!data.sameSequence) {
    newAllTimeScoreDatabase = [newAllTimeScore[1], newAllTimeScore[0]];
  }
  // console.log(`allTimeScore: ${data.allTimeScore}`);
  // console.log(`newAllTimeScore: ${newAllTimeScore}`);
  match = await MinesweeperStat.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId.createFromHexString(data.matchId),
    },
    { results: newAllTimeScoreDatabase }
  );
  // console.log(match);
}
io.to(data.room).emit("update_server", {
  ...data,
  changedAllTimeScore: newAllTimeScore,
});
