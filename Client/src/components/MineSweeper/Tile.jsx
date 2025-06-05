import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import { socket } from "../../network/socket";

export default function Tile({ index, tileVal, position }) {
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId, currentGameId } = connectionState;
  const { turn } = gameState;
  const myIndex = gameState.players.findIndex((p) => p.id === playerId);

  function clickHandler(e) {
    console.log(currentGameId);
    const isMyTurn = gameState.players[turn]?.id === playerId;

    if (position === "none" && isMyTurn) {
      e.preventDefault();
      console.log(index, tileVal, position, turn);
      const payload = { index };
      socket.emit("phase_confirm", { gameId: currentGameId, payload });
    }
  }

  // رنگ‌بندی و استایل داینامیک
  let bg = "bg-gray-300";
  if (position !== "none") {
    if (tileVal === "bomb") {
      console.log(myIndex);
      console.log(position);
      bg = position === myIndex ? "bg-green-400" : "bg-pink-400";
    }
  } else {
    bg = "bg-gray-700";
  }

  return (
    <div
      className={`
        flex items-center justify-center
        font-mono font-bold
        text-base sm:text-lg md:text-xl
        rounded
        select-none
        cursor-pointer
        transition
        duration-100
        active:scale-95
        ${bg}
        ${position === "none" ? "text-transparent" : "text-black"}
        `}
      style={{
        aspectRatio: "1/1",
        minHeight: "28px",
        minWidth: "28px",
        maxHeight: "48px",
        maxWidth: "48px",
      }}
      onClick={clickHandler}
    >
      {tileVal === "bomb" ? "💣" : tileVal === 0 ? "" : tileVal}
    </div>
  );
}

// import "./Tile.css";

// export default function Tile({
//   index,
//   tileVal,
//   position,
//   turn,
//   group,
//   clickUp,
//   currentPlayerHome,
// }) {
//   function clickHandler(e) {
//     if (position === "none") {
//       e.preventDefault();
//       clickUp(index, tileVal, position, turn, group);
//     }
//     // setTileClass("tileContainer");
//   }

//   return (
//     <>
//       <div
//         className={`tileContainer player${position} ${tileVal} ${
//           currentPlayerHome ? "home" : "away"
//         }`}
//         onClick={clickHandler}
//       >
//         {tileVal === "bomb" ? "💣" : tileVal === 0 ? "" : tileVal}
//       </div>
//     </>
//   );
// }
