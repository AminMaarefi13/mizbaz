import { useGameContext } from "../context/GameContext";
import FeedTheKrakenPage from "./FeedTheKrakenPage";
import MineSweeperPage from "./MineSweeperPage";

export default function GameRouter() {
  const { gameState } = useGameContext();
  console.log("GameRouter - Current Game State:", gameState);
  if (!gameState || !gameState.type) {
    return <div>در حال بارگذاری اطلاعات بازی...</div>;
  }

  switch (gameState.type) {
    case "feedTheKraken":
      return <FeedTheKrakenPage />;
    case "mineSweeper":
      return <MineSweeperPage />;
    default:
      return <div>نوع بازی پشتیبانی نمی‌شود.</div>;
  }
}
