import { Navigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import FeedTheKrakenPage from "./FeedTheKrakenPage";
import MineSweeperPage from "./MineSweeperPage";

export default function GameRouter() {
  const { gameState } = useGameContext();
  console.log("GameRouter - Current Game State:", gameState);

  // اگر هنوز نوع بازی تعیین نشده، کاربر را به لابی بفرست
  if (!gameState?.type) {
    return <Navigate to="/lobby" replace />; // replace == بدون اضافه‌شدن به history
  }

  switch (gameState.type) {
    case "feedTheKraken":
      return <FeedTheKrakenPage />;
    case "mineSweeper":
      return <MineSweeperPage />;
    default:
      // نوع نامعتبر → برگشت به لابی
      return <Navigate to="/lobby" replace />;
  }
}

// import { useGameContext } from "../context/GameContext";
// import FeedTheKrakenPage from "./FeedTheKrakenPage";
// import MineSweeperPage from "./MineSweeperPage";
// import { useNavigate } from "react-router-dom";

// export default function GameRouter() {
//   const { gameState } = useGameContext();
//   const navigate = useNavigate();
//   console.log("GameRouter - Current Game State:", gameState);
//   if (!gameState || !gameState?.type) {
//     navigate(`/lobby`);
//     // return <div>در حال بارگذاری اطلاعات بازی...</div>;
//   }

//   switch (gameState?.type) {
//     case "feedTheKraken":
//       return <FeedTheKrakenPage />;
//     case "mineSweeper":
//       return <MineSweeperPage />;
//     default:
//     // return <div>نوع بازی پشتیبانی نمی‌شود.</div>;
//   }
// }
