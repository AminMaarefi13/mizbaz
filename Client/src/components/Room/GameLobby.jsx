import React, { useEffect } from "react";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function GameLobby() {
  const navigate = useNavigate();

  const { connectionState, setConnectionState } = useAppContext();
  const { playerId, currentGame, currentGameId, currentRoomId, isHost } =
    connectionState;
  if (!currentGame) return null;

  useEffect(() => {
    function handleGamePlayersUpdated({ gameId, gamePlayers }) {
      if (currentGame && currentGame.gameId === gameId) {
        setConnectionState((prev) => ({
          ...prev,
          currentGame: {
            ...prev.currentGame,
            players: gamePlayers,
          },
        }));
        // socket.emit("get_all_games", { roomId: currentRoomId }, (roomGames) => {
        //   setConnectionState((prev) => ({ ...prev, roomGames }));
        // });
      }
    }
    socket.on("game_players_updated", handleGamePlayersUpdated);
    return () => {
      socket.off("game_players_updated", handleGamePlayersUpdated);
    };
  }, [currentGame, setConnectionState]);

  const handleBackToRoom = () => {
    setConnectionState((prev) => ({
      ...prev,
      currentGameId: null,
      currentGame: null,
    }));
    localStorage.removeItem("currentGameId");
    localStorage.removeItem("currentGame");
  };

  const me = currentGame.players.find((p) => p.playerId === playerId);

  const handleToggleReady = () => {
    socket.emit(
      "toggle_ready",
      {
        roomId: currentRoomId,
        gameId: currentGame.gameId,
      },
      (res) => {
        if (res?.success === false) {
          alert(res.message || "خطا در تغییر وضعیت آماده بودن");
          return;
        }
        if (res?.gamePlayers) {
          setConnectionState((prev) => ({
            ...prev,
            currentGame: {
              ...prev.currentGame,
              players: res.gamePlayers,
              roomGames: res.games,
            },
          }));
        }
      }
    );
    // socket.emit("get_all_games", { roomId: currentRoomId }, (roomGames) => {
    //   console.log(roomGames);
    //   setConnectionState((prev) => ({ ...prev, roomGames }));
    // });
  };

  const handleStartGame = () => {
    console.log("currentRoomId", currentRoomId);
    console.log("currentGame.gameId", currentGame.gameId);
    socket.emit("start_game", {
      roomId: currentRoomId,
      gameId: currentGame.gameId,
    });
  };

  const handleEnterGame = () => {
    socket.emit("request_game_state", currentGameId);
    navigate(`/game/${currentGameId}`);
  };
  return (
    <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg mt-8 mx-auto">
      <h3 className="font-bold text-2xl text-blue-400 mb-4 text-center">
        لابی بازی
      </h3>
      <div className="mb-3 flex flex-col gap-1">
        <div>
          <span className="text-gray-300">نوع بازی: </span>
          <span className="text-white font-semibold">{currentGame.type}</span>
        </div>
        <div>
          <span className="text-gray-300">آیدی بازی: </span>
          <span className="text-white font-mono">{currentGame.gameId}</span>
        </div>
        <div>
          <span className="text-gray-300">وضعیت: </span>
          <span className="text-white">{currentGame.gameStatus}</span>
        </div>
      </div>
      <div className="mb-4">
        <span className="text-gray-300">بازیکنان این بازی:</span>
        <ul className="mt-2 space-y-2">
          {currentGame.players.map((p) => (
            <li
              key={p.playerId}
              className="bg-gray-700 px-4 py-2 rounded flex justify-between items-center"
            >
              <span className="text-white">{p.nickname}</span>
              <span className={p.isReady ? "text-green-400" : "text-red-400"}>
                {p.isReady ? "✅ آماده" : "⏳ منتظر"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {currentGame.gameStatus === "waiting" && (
        <button
          onClick={handleToggleReady}
          className="w-full py-2 mb-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
        >
          {me ? "❌ بی‌خیال" : "✅ آماده‌ام"}
        </button>
      )}
      {isHost && currentGame.gameStatus === "waiting" && (
        <button
          onClick={handleStartGame}
          className="w-full py-2 mb-2 bg-red-600 hover:bg-red-700 rounded font-semibold"
        >
          🎬 شروع بازی
        </button>
      )}
      {currentGame.gameStatus === "onGoing" && (
        <button
          onClick={handleEnterGame}
          className="w-full py-2 mb-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
        >
          🚪 ورود به بازی
        </button>
      )}
      <button
        className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold"
        onClick={handleBackToRoom}
      >
        بازگشت به روم
      </button>
    </div>
  );
}
