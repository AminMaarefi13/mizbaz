import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";
import Tiles from "../components/MineSweeper/Tiles";
import getGradientClass from "../UI/getGradientClass";
import getScoreShadowClass from "../UI/سیش";
// import ProfileImage from "../components/MineSweeper/ProfileImage";

export default function MineSweeperPage() {
  const navigate = useNavigate();
  const { gameState, setGameState } = useGameContext();
  const { connectionState, setConnectionState } = useAppContext();
  const { playerId, currentRoomId, currentGameId } = connectionState;

  // جلوگیری از ورود بدون انتخاب بازی
  useEffect(() => {
    if (!currentGameId) {
      alert("لطفاً ابتدا یک بازی را انتخاب کنید.");
      navigate("/lobby");
      return;
    }

    if (currentRoomId && playerId && currentGameId) {
      socket.emit(
        "request_game_state",
        currentGameId,
        (gameStateFromServer) => {
          if (gameStateFromServer.publicState) {
            setGameState(gameStateFromServer.publicState);
            setConnectionState((prev) => ({
              ...prev,
              currentRoomId: gameStateFromServer.publicState.roomId,
              currentGameId: gameStateFromServer.publicState.gameId,
            }));
            localStorage.setItem(
              "currentGameId",
              gameStateFromServer.publicState.gameId
            );
          } else {
            alert("❌ دریافت اطلاعات بازی ممکن نشد.");
          }
        }
      );
    }
  }, [currentRoomId, currentGameId, playerId, navigate]);

  if (
    !gameState ||
    !gameState.players ||
    gameState.players.length < 2 ||
    !gameState.map
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        لطفاً ابتدا یک بازی را از لابی انتخاب کنید.
      </div>
    );
  }

  const {
    players,
    turn = 0,
    // score = [0, 0],
    allTime = [0, 0],
  } = gameState;
  const myIndex = players.findIndex((p) => p.id === playerId);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center pt-20 pb-8 px-2">
      {/* All Time Score */}
      <div className="w-full max-w-lg bg-cyan-800 text-white rounded-lg shadow px-4 py-2 mb-3 flex justify-center font-mono text-sm sm:text-base">
        امتیاز کلی: {allTime[1]} : {allTime[0]}
      </div>

      {/* Remaining Bombs */}
      {players[0].score < 8 && players[1].score < 8 && (
        <div className="w-full max-w-md bg-white text-black rounded-lg shadow px-4 py-2 mb-3 flex justify-center items-center opacity-90 text-sm sm:text-base">
          {15 - players[0].score - players[1].score}{" "}
          <span className="text-2xl mx-2">💣</span>
          بمب باقی‌مانده
        </div>
      )}

      {/* Turn Banner */}
      {players[0].score < 8 && players[1].score < 8 && (
        <div
          className={`w-full max-w-md rounded-lg shadow px-4 py-2 mb-3 flex flex-col items-center
      ${getGradientClass({ type: "turn", myIndex, turnIndex: turn, playerId })}
    `}
        >
          <div className="font-bold text-xs sm:text-base">نوبت:</div>
          <div className="text-base sm:text-lg">{players[turn]?.name}</div>
        </div>
      )}

      {/* Score Banner */}
      <div className="w-full max-w-lg flex justify-between items-center rounded-lg shadow-lg px-4 py-3 mb-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
        <div className="flex flex-col items-center">
          {/* <ProfileImage src={players[0].photo} isBig={false} /> */}
          <span className="font-bold text-xs sm:text-base">
            {players[0].name}
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-mono font-bold">
          {players[0].score} : {players[1].score}
        </div>
        <div className="flex flex-col items-center">
          {/* <ProfileImage src={players[1].photo} isBig={false} /> */}
          <span className="font-bold text-xs sm:text-base">
            {players[1].name}
          </span>
        </div>
      </div>

      {/* Winner Banner */}
      {(players[0].score === 8 || players[1].score === 8) && (
        <div className="w-full max-w-md bg-gray-200 text-black rounded-lg shadow px-4 py-8 mb-3 flex flex-col items-center text-xl sm:text-2xl font-bold">
          <div>
            {players[0].score === 8 ? players[0].name : players[1].name}
          </div>
          <div>برنده شد!</div>
          {/* <button
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            onClick={rematchHandler}
          >
            بازی مجدد
          </button>
          <button
            className="mt-3 px-6 py-2 bg-gray-400 text-black rounded shadow hover:bg-gray-500 transition"
            onClick={() => navigate("/lobby")}
          >
            بازگشت به خانه
          </button> */}
        </div>
      )}

      {/* MineSweeper Board */}
      {players[0].score < 8 && players[1].score < 8 && (
        <div
          className={`
      flex justify-center items-center
      rounded-2xl
      transition
      mx-auto
      w-full
      max-w-xl
      ${getScoreShadowClass({ players, playerId })}
    `}
          style={{ transition: "box-shadow 0.3s" }}
        >
          <div className="w-full max-w-[420px] aspect-[7/8] flex items-center justify-center">
            <Tiles />
          </div>
        </div>
      )}

      {/* {players[0].score < 8 && players[1].score < 8 && (
        <div
          className={`
      flex justify-center items-center
      rounded-2xl
      transition
      mx-auto
      w-full
      max-w-xl
      ${(() => {
        const myIndex = players.findIndex((p) => p.id === playerId);
        const otherIndex = myIndex === 0 ? 1 : 0;
        if (players[myIndex].score > players[otherIndex].score) {
          return "shadow-[0_0_40px_8px_rgba(59,130,246,0.7)]";
        } else if (players[myIndex].score < players[otherIndex].score) {
          return "shadow-[0_0_40px_8px_rgba(236,72,153,0.7)]";
        } else {
          return "shadow-[0_0_32px_6px_rgba(34,211,238,0.5)]";
        }
      })()}
    `}
          style={{ transition: "box-shadow 0.3s" }}
        >
          <div className="w-full max-w-[420px] aspect-[7/8] flex items-center justify-center">
            <Tiles />
          </div>
        </div>
      )} */}
    </div>
  );
}

// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { socket } from "../network/socket";
// import { useGameContext } from "../context/GameContext";
// import { useAppContext } from "../context/AppContext";
// import Tiles from "../components/MineSweeper/Tiles";
// // import ProfileImage from "../components/MineSweeper/ProfileImage";

// export default function MineSweeperPage() {
//   const navigate = useNavigate();
//   const { gameState, setGameState } = useGameContext();
//   const { connectionState, setConnectionState } = useAppContext();
//   const { playerId, currentRoomId, currentGameId } = connectionState;

//   // جلوگیری از ورود بدون انتخاب بازی
//   useEffect(() => {
//     if (!currentGameId) {
//       alert("لطفاً ابتدا یک بازی را انتخاب کنید.");
//       navigate("/lobby");
//       return;
//     }

//     if (currentRoomId && playerId && currentGameId) {
//       socket.emit(
//         "request_game_state",
//         currentGameId,
//         (gameStateFromServer) => {
//           if (gameStateFromServer) {
//             setGameState(gameStateFromServer);
//             setConnectionState((prev) => ({
//               ...prev,
//               currentRoomId: gameStateFromServer.roomId,
//               currentGameId: gameStateFromServer.gameId,
//             }));
//             localStorage.setItem("currentGameId", gameStateFromServer.gameId);
//           } else {
//             alert("❌ دریافت اطلاعات بازی ممکن نشد.");
//           }
//         }
//       );
//     }
//   }, [currentRoomId, currentGameId, playerId, navigate]);

//   if (
//     !gameState ||
//     !gameState.players ||
//     gameState.players.length < 2 ||
//     !gameState.map
//   ) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
//         لطفاً ابتدا یک بازی را از لابی انتخاب کنید.
//       </div>
//     );
//   }

//   const {
//     players,
//     map,
//     turn = 0,
//     score = [0, 0],
//     allTimeScore = [0, 0],
//     gameStatus,
//   } = gameState;

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-8">
//       {/* Score Banner */}
//       <div
//         className={`max-w-2xl w-full flex justify-between items-center rounded-lg shadow-lg px-6 py-4 mb-4
//         ${
//           score[0] > score[1]
//             ? players[0].id === playerId
//               ? "bg-green-400"
//               : "bg-pink-400"
//             : score[0] === score[1]
//             ? "bg-cyan-600"
//             : players[0].id === playerId
//             ? "bg-pink-400"
//             : "bg-green-400"
//         }`}
//       >
//         <div className="flex flex-col items-center">
//           {/* <ProfileImage src={players[0].photo} isBig={false} /> */}
//           <span className="font-bold">{players[0].name}</span>
//         </div>
//         <div className="text-2xl font-mono font-bold">
//           {score[0]} : {score[1]}
//         </div>
//         <div className="flex flex-col items-center">
//           {/* <ProfileImage src={players[1].photo} isBig={false} /> */}
//           <span className="font-bold">{players[1].name}</span>
//         </div>
//       </div>

//       {/* All Time Score */}
//       <div className="max-w-2xl w-full bg-cyan-800 text-white rounded-lg shadow px-6 py-2 mb-4 flex justify-center font-mono">
//         امتیاز کلی: {allTimeScore[0]} : {allTimeScore[1]}
//       </div>

//       {/* Turn Banner */}
//       {score[0] < 8 && score[1] < 8 && (
//         <div
//           className={`max-w-xl w-full bg-gray-800 text-white rounded-lg shadow px-6 py-2 mb-4 flex flex-col items-center`}
//         >
//           <div className="font-bold">نوبت:</div>
//           <div className="text-lg">{players[turn]?.name}</div>
//         </div>
//       )}

//       {/* Remaining Bombs */}
//       {score[0] < 8 && score[1] < 8 && (
//         <div className="max-w-xl w-full bg-white text-black rounded-lg shadow px-6 py-2 mb-4 flex justify-center items-center opacity-80">
//           {15 - score[0] - score[1]} <span className="text-2xl mx-2">💣</span>{" "}
//           بمب باقی‌مانده
//         </div>
//       )}

//       {/* Winner Banner */}
//       {(score[0] === 8 || score[1] === 8) && (
//         <div className="max-w-xl w-full bg-gray-200 text-black rounded-lg shadow px-6 py-8 mb-4 flex flex-col items-center text-2xl font-bold">
//           <div>{score[0] === 8 ? players[0].name : players[1].name}</div>
//           <div>برنده شد!</div>
//           <button
//             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
//             onClick={() => window.location.reload()}
//           >
//             بازی مجدد
//           </button>
//           <button
//             className="mt-3 px-6 py-2 bg-gray-400 text-black rounded shadow hover:bg-gray-500 transition"
//             onClick={() => navigate("/lobby")}
//           >
//             بازگشت به خانه
//           </button>
//         </div>
//       )}

//       {/* MineSweeper Board */}
//       {score[0] < 8 && score[1] < 8 && (
//         <div className="max-w-3xl w-full flex justify-center items-center">
//           <Tiles
//             remaining={map}
//             turn={turn}
//             clickUpper={() => {}} // این تابع را طبق نیازت پیاده‌سازی کن
//             playerId={playerId}
//             players={players}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// // import React, { useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { socket } from "../network/socket";
// // import EnergyBar from "../components/Energy/EnergyBar";
// // import RewardedAdButton from "../components/Energy/RewardedAdButton";
// // import { useGameContext } from "../context/GameContext";
// // import { useAppContext } from "../context/AppContext";

// // export default function FeedTheKrakenPage() {
// //   const navigate = useNavigate();
// //   const { gameState, setGameState } = useGameContext();
// //   const {
// //     userState,
// //     setUserState,
// //     connectionState,
// //     setConnectionState,
// //     energy,
// //     setEnergy,
// //     subscription,
// //   } = useAppContext();
// //   const { map, turn, currentPhase, players, logs, gameStatus } = gameState;
// //   const { playerId, currentRoomId, currentGameId } = connectionState;
// //   // ⛵ جلوگیری از ورود بدون انتخاب بازی
// //   useEffect(() => {
// //     if (!currentGameId) {
// //       alert("لطفاً ابتدا یک بازی را انتخاب کنید.");
// //       navigate("/lobby");
// //       return;
// //     }

// //     if (currentRoomId && playerId && currentGameId) {
// //       console.log("درخواست وضعیت بازی برای:", currentGameId);
// //       socket.emit(
// //         "request_game_state",
// //         currentGameId,
// //         (gameStateFromServer) => {
// //           console.log("📥 وضعیت بازی دریافتی:", gameStateFromServer);
// //           console.log(gameStateFromServer);
// //           if (gameStateFromServer) {
// //             setGameState(gameStateFromServer);
// //             setConnectionState((prev) => ({
// //               ...prev,
// //               currentRoomId: gameStateFromServer.roomId,
// //               currentGameId: gameStateFromServer.gameId,
// //             }));
// //             localStorage.setItem("currentGameId", gameStateFromServer.gameId);
// //             // navigate("/game");
// //           } else {
// //             alert("❌ دریافت اطلاعات بازی ممکن نشد.");
// //           }
// //         }
// //       );
// //     }
// //   }, [currentRoomId, currentGameId, playerId, navigate]);
// //   // نمایش مناسب هنگام عدم دریافت اطلاعات یا ورود زودهنگام
// //   if (!currentGameId || !players || players.length === 0) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
// //         لطفاً ابتدا یک بازی را از لابی انتخاب کنید.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div>MineSweeper</div>
// //       <EnergyBar />
// //       {!subscription && energy < 1 && <RewardedAdButton />}
// //       <button
// //         onClick={() => {
// //           const amount = 1;
// //           socket.emit("consume_energy", { amount }, (data) => {
// //             if (typeof data.energy === "number") setEnergy(data.energy);
// //           });
// //         }}
// //       >
// //         کاهش انرژی (تست)
// //       </button>
// //     </div>
// //   );
// // }
