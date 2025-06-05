import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import { useState } from "react";
import RoomInvite from "../components/Room/RoomInvite";
import RoomInvitesInbox from "../components/Room/RoomInvitesInbox";
import GameLobby from "../components/Room/GameLobby";
import CreateGameBox from "../components/Room/CreateGameBox";
import { getStatusIcon } from "../utils/getStatusIcon";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";

function LobbyPage() {
  const [roomIdInputState, setRoomIdInputState] = useState("");

  const navigate = useNavigate();
  const { setUserState, connectionState, setConnectionState } = useAppContext();
  const { setGameState } = useGameContext();

  const {
    name,
    playerId,
    currentRoomId,
    currentGameId,
    currentGame,
    hostName,
    isHost,
    userRooms,
    roomGames,
    roomPlayers,
  } = connectionState;
  // بازیابی اطلاعات ذخیره شده
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedId = localStorage.getItem("playerId");
    if (savedName && !name)
      setConnectionState((prev) => ({ ...prev, name: savedName }));
    if (savedId && !playerId)
      setConnectionState((prev) => ({ ...prev, playerId: savedId }));

    if (!savedName && !name) {
      alert("لطفاً ابتدا وارد شوید.");
      navigate("/login");
      return;
    }
  }, [name, playerId, setConnectionState]);

  useEffect(() => {
    socket.on("game_created", ({ game }) => {
      console.log(game);
      setConnectionState((prev) => ({
        ...prev,
        currentGameId: game.gameId,
        currentGame: game,
      }));
    });

    return () => {
      socket.off("game_created");
    };
  }, []);

  useEffect(() => {
    function handleRoomGamesUpdated({ games }) {
      console.log(games);
      setConnectionState((prev) => ({
        ...prev,
        roomGames: games,
      }));
    }
    socket.on("room_games_updated", handleRoomGamesUpdated);
    return () => {
      socket.off("room_games_updated", handleRoomGamesUpdated);
    };
  }, [setConnectionState]);

  useEffect(() => {
    function handleGamePlayersUpdated({ gameId, gamePlayers }) {
      console.log(handleGamePlayersUpdated);
      if (currentGame && currentGame.gameId === gameId) {
        setConnectionState((prev) => ({
          ...prev,
          currentGame: {
            ...prev.currentGame,
            players: gamePlayers,
          },
        }));
      }
    }
    socket.on("game_players_updated", handleGamePlayersUpdated);
    return () => {
      socket.off("game_players_updated", handleGamePlayersUpdated);
    };
  }, [currentGame, setConnectionState]);

  // ثبت بازیکن و دریافت روم‌ها و بازی‌ها
  useEffect(() => {
    const registerPlayer = () => {
      if (playerId && name) {
        console.log(playerId);
        console.log(name);
        socket.emit("register");
        socket.emit("get_user_rooms", (rooms) => {
          setConnectionState((prev) => ({ ...prev, userRooms: rooms }));
        });
        socket.emit("get_all_games", { roomId: currentRoomId }, (roomGames) => {
          setConnectionState((prev) => ({ ...prev, roomGames }));
        });
      }
    };

    if (socket.connected) {
      registerPlayer();
    }

    socket.on("connect", registerPlayer);

    return () => {
      socket.off("connect", registerPlayer);
    };
  }, [playerId, name, currentRoomId, currentGameId, setConnectionState]);

  useEffect(() => {
    const onRoomCreated = ({ roomId, roomPlayers, hostName, hostId }) => {
      localStorage.setItem("currentRoomId", roomId);
      setConnectionState((prev) => ({
        ...prev,
        roomPlayers: roomPlayers,
        currentRoomId: roomId,
        hostName: hostName,
        hostId: hostId,
      }));
    };

    const onPlayersUpdated = ({ roomId, roomPlayers }) => {
      if (currentRoomId === roomId) {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          currentRoomId: roomId,
        }));
      }
    };

    const onUserRoomsUpdated = (rooms) => {
      setConnectionState((prev) => ({ ...prev, userRooms: rooms }));
    };

    socket.on("room_created", onRoomCreated);
    socket.on("players_updated", onPlayersUpdated);
    socket.on("user_rooms_updated", onUserRoomsUpdated);
    // socket.on("game_status_updated", onGameStatusUpdated);
    socket.on("game_started", (gameId, gamePlayer) => {
      console.log(gamePlayer);
      if (gamePlayer) {
        console.log("بازی شروع شد");
        console.log(gameId);
        handleStartGame(gameId);
      } else {
        alert("بازی شروع شد و شما عضو این بازی نیستید!");
        setConnectionState((prev) => ({
          ...prev,
          currentGameId: null,
          currentGame: null,
        }));
        localStorage.removeItem("currentGameId");
        localStorage.removeItem("currentGame");
      }
    });

    socket.on("gameState", (state) => {
      console.log("📦 gameState وضعیت بازی دریافت شد", state);
      if (state?.publicState.type === "feedTheKraken") {
        setGameState(state.publicState);
        setUserState((prev) => ({ ...prev, ...state.privateState }));
        setConnectionState((prev) => ({
          ...prev,
          currentRoomId: state.publicState.roomId,
          currentGameId: state.publicState.gameId,
        }));
        localStorage.setItem("currentGameId", state.publicState.gameId);
      } else if (state?.publicState.type === "mineSweeper") {
        console.log("MineSweeper game state received:");
        setGameState(state.publicState);
        setConnectionState((prev) => ({
          ...prev,
          currentRoomId: state.publicState.roomId,
          currentGameId: state.publicState.gameId,
        }));
        localStorage.setItem("currentGameId", state.publicState.gameId);
      }
      navigate(`/game/${state.publicState.gameId}`);
    });

    socket.on("game_state_requested", (state) => {
      console.log("📦 game_state_requested lobby وضعیت بازی دریافت شد", state);
      if (state?.publicState.type === "feedTheKraken") {
        setGameState(state.publicState);
        setUserState((prev) => ({ ...prev, ...state.privateState }));
        setConnectionState((prev) => ({
          ...prev,
          currentRoomId: state.publicState.roomId,
          currentGameId: state.publicState.gameId,
        }));
        navigate(`/game/${state.publicState.gameId}`);
        localStorage.setItem("currentGameId", state.gameId);
      } else if (state?.publicState.type === "mineSweeper") {
        console.log("MineSweeper game state received:", state.publicState);
        setGameState(state.publicState);
        setConnectionState((prev) => ({
          ...prev,
          currentRoomId: state.publicState.roomId,
          currentGameId: state.publicState.gameId,
        }));
        console.log(state.publicState.gameId);
        console.log(state.publicState);
        navigate(`/game/${state.publicState.gameId}`);
        localStorage.setItem("currentGameId", state.publicState.gameId);
      }

      // navigate("/game");
    });

    return () => {
      socket.off("room_created", onRoomCreated);
      socket.off("players_updated", onPlayersUpdated);
      socket.off("user_rooms_updated", onUserRoomsUpdated);
      socket.off("game_state_requested");
    };
  }, [setGameState, setUserState, setConnectionState, currentRoomId]);

  const handleSelectGame = (gameId) => {
    console.log("🧩 انتخاب بازی:", gameId);
    console.log(playerId);
    console.log(currentRoomId);
    console.log(localStorage.getItem("playerId"));
    console.log(localStorage.getItem("currentRoomId"));
    localStorage.setItem("currentGameId", gameId);
    socket.emit(
      "enter_game_lobby",
      {
        gameId,
        roomId: currentRoomId,
      },
      (res) => {
        console.log("🥨 نتیجه ورود به بازی:", res);
        if (res?.success === false) {
          alert(res.message || "بازی پیدا نشد.");
          return;
        }
        if (res?.game) {
          console.log("res.game");
          setConnectionState((prev) => ({
            ...prev,
            currentGameId: res.game.gameId,
            currentGame: res.game,
          }));
        }
      }
    );
    // socket.emit("join_game", {
    //   gameId,
    //   roomId: localStorage.getItem("currentRoomId"),
    //   playerId: localStorage.getItem("playerId"),
    // });
    // console.log(gameId);
    // socket.emit("request_game_state", gameId);
  };

  const handleStartGame = (gameId) => {
    console.log("🍔 شروع بازی:", gameId);
    localStorage.setItem("currentGameId", gameId);
    socket.emit("request_game_state", gameId);
    // if (currentGame.gameStatus && currentGame.gameStatus !== "waiting") {
    //   // socket.emit("join_game", {
    //   //   gameId,
    //   //   roomId: localStorage.getItem("currentRoomId"),
    //   //   playerId: localStorage.getItem("playerId"),
    //   // });

    // }
  };

  const handleCreateRoom = () => {
    if (!name || !playerId) return alert("نام و آیدی را وارد کنید.");
    setConnectionState((prev) => ({ ...prev, isHost: true }));
    localStorage.setItem("name", name);
    localStorage.setItem("playerId", playerId);
    socket.emit("create_room");
  };

  const handleJoinRoom = () => {
    if (!name || !playerId || !roomIdInputState)
      return alert("همه فیلدها را پر کنید.");
    setConnectionState((prev) => ({ ...prev, isHost: false }));
    localStorage.setItem("name", name);
    localStorage.setItem("playerId", playerId);
    socket.emit("join_room", { roomId: roomIdInputState });
  };

  const handleEnterRoom = (roomId) => {
    localStorage.setItem("currentRoomId", roomId);

    socket.emit("join_room", { roomId });

    socket.emit("get_room_state", roomId, (room) => {
      if (room) {
        console.log(room.roomGames);
        setConnectionState((prev) => ({
          ...prev,
          currentRoomId: roomId,
          roomPlayers: room.roomPlayers,
          hostId: room.hostId || "نامشخص",
          isHost: room.hostId === playerId,
          roomGames: room.roomGames,
        }));
      }
    });
  };

  const handleBackToLobby = () => {
    setConnectionState((prev) => ({
      ...prev,
      currentRoomId: null,
      currentGameId: null,
      roomPlayers: [],
      hostName: null,
      hostId: null,
    }));
    localStorage.removeItem("currentRoomId");
    localStorage.removeItem("currentGameId");
  };
  // console.log(roomGames);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <RoomInvitesInbox />

        {/* دکمه ریلود صفحه */}
        <button
          className="w-full py-2 mb-4 bg-gray-500 hover:bg-gray-600 rounded font-semibold"
          onClick={() => window.location.reload()}
        >
          🔄 ریلود صفحه
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">🎮 ورود به بازی</h2>

        <div>!{name} خوش اومدی</div>
        <div>{playerId} :آیدی</div>

        {currentRoomId && !currentGameId && !currentGame && (
          <button
            className="w-full py-2 mb-4 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold"
            onClick={handleBackToLobby}
          >
            بازگشت به لابی
          </button>
        )}

        {!currentRoomId && (
          <>
            <button
              className="w-full mb-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
              onClick={handleCreateRoom}
            >
              ساخت روم
            </button>

            <input
              className="w-full mb-3 px-4 py-2 rounded bg-gray-700"
              placeholder="کد روم برای ورود"
              value={roomIdInputState}
              onChange={(e) => setRoomIdInputState(e.target.value)}
            />

            <button
              className="w-full py-2 mb-3 bg-green-600 hover:bg-green-700 rounded font-semibold"
              onClick={handleJoinRoom}
            >
              ورود به روم
            </button>
          </>
        )}

        {userRooms?.length > 0 && !currentRoomId && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">📁 روم‌های شما:</h3>
            <ul className="space-y-2">
              {userRooms.map((room) => (
                <li
                  key={room.roomId}
                  className="bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-600"
                  onClick={() => handleEnterRoom(room.roomId)}
                >
                  🏠 {room.roomId} | میزبان: {room.hostName}
                </li>
              ))}
            </ul>
          </div>
        )}

        {roomGames.length > 0 &&
          currentRoomId &&
          !currentGameId &&
          !currentGame && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">🎮 بازی‌های موجود:</h3>
              <ul className="space-y-2">
                {roomGames.map((game) => {
                  const isWaiting = game.gameStatus === "waiting";
                  const isPlayer =
                    Array.isArray(game.players) &&
                    game.players.some((p) => p.playerId === playerId);
                  const canClick =
                    isWaiting || (game.gameStatus === "onGoing" && isPlayer);

                  return (
                    <li
                      key={game.gameId}
                      className={`p-2 rounded ${
                        canClick
                          ? "bg-gray-700 cursor-pointer hover:bg-gray-600"
                          : "bg-gray-500 text-gray-400 cursor-not-allowed opacity-60"
                      }`}
                      onClick={
                        canClick
                          ? () => handleSelectGame(game.gameId)
                          : undefined
                      }
                      style={{
                        pointerEvents: canClick ? "auto" : "none",
                      }}
                    >
                      {getStatusIcon(game.gameStatus)}
                      🎮 {game.gameId} | بازی: {game.type} | وضعیت:{" "}
                      {game.gameStatus}
                      <span className="ml-2 text-sm text-blue-300">
                        {game.players?.length || 0}{" "}
                        {game.gameStatus === "onGoing"
                          ? "نفر در حال بازی"
                          : game.gameStatus === "waiting"
                          ? "نفر آماده بازی"
                          : "نفر"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        {/* {roomGames.length > 0 &&
          currentRoomId &&
          !currentGameId &&
          !currentGame && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">🎮 بازی‌های موجود:</h3>
              <ul className="space-y-2">
                {roomGames.map((game) => {
                  // شرط کلیک‌پذیری:
                  const isWaiting = game.gameStatus === "waiting";
                  const isPlayer =
                    Array.isArray(game.players) &&
                    game.players.some((p) => p.playerId === playerId);
                  const canClick =
                    isWaiting || (game.gameStatus === "onGoing" && isPlayer);

                  return (
                    <li
                      key={game.gameId}
                      className={`p-2 rounded ${
                        canClick
                          ? "bg-gray-700 cursor-pointer hover:bg-gray-600"
                          : "bg-gray-500 text-gray-400 cursor-not-allowed opacity-60"
                      }`}
                      onClick={
                        canClick
                          ? () => handleSelectGame(game.gameId)
                          : undefined
                      }
                      style={{
                        pointerEvents: canClick ? "auto" : "none",
                      }}
                    >
                      🎮 {game.gameId} | بازی: {game.type} | وضعیت:{" "}
                      {game.gameStatus}
                      <span className="ml-2 text-sm text-blue-300">
                        {game.players?.length || 0}{" "}
                        {game.gameStatus === "onGoing"
                          ? "نفر در حال بازی"
                          : "نفر آماده بازی"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )} */}

        {currentRoomId && !currentGameId && !currentGame && (
          <div className="mt-8">
            <CreateGameBox />
          </div>
        )}
        {currentRoomId && !currentGameId && !currentGame && (
          <RoomInvite roomId={currentRoomId} />
        )}
        {roomPlayers.length > 0 && !currentGameId && !currentGame && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">اعضای روم:</h3>
            {hostName && (
              <p className="mb-2 text-sm text-gray-300">
                👑 میزبان: {hostName}
              </p>
            )}
            <ul className="space-y-2">
              {roomPlayers.map((p) => (
                <li
                  key={p.playerId}
                  className="bg-gray-700 px-4 py-2 rounded flex justify-between items-center"
                >
                  <span>
                    {p.nickname} | ID: {p.playerId}
                  </span>
                  <span
                    className={p.isReady ? "text-green-400" : "text-red-400"}
                  >
                    {/* {p.isReady ? "✅ آماده" : "⏳ منتظر"} */}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {currentGameId && currentGame && <GameLobby />}
    </div>
  );
}

export default LobbyPage;
