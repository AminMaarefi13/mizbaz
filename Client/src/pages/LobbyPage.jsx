import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import { useState } from "react";

function LobbyPage() {
  const [roomIdInputState, setRoomIdInputState] = useState("");
  const [nameInputState, setNameInputState] = useState("");
  const [playerIdInputState, setPlayerIdInputState] = useState("");
  const navigate = useNavigate();
  const {
    gameState,
    setGameState,
    userState,
    setUserState,
    connectionState,
    setConnectionState,
  } = useGameContext();
  const {
    name,
    playerId,
    currentRoomId,
    currentGameId,
    hostName,
    hostId,
    isHost,
    userRooms,
    userGames,
    roomPlayers,
  } = connectionState;
  console.log(userRooms);
  console.log(roomPlayers);
  // console.log(gameState);
  // بازیابی اطلاعات ذخیره شده
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedId = localStorage.getItem("playerId");
    if (savedName && !name)
      setConnectionState((prev) => ({ ...prev, name: savedName }));
    if (savedId && !playerId)
      setConnectionState((prev) => ({ ...prev, playerId: savedId }));
    if (savedName && !nameInputState) setNameInputState(savedName);
    if (savedId && !playerIdInputState) setPlayerIdInputState(savedId);
  }, [name, playerId, setConnectionState, nameInputState, playerIdInputState]);

  // ثبت بازیکن و دریافت روم‌ها و بازی‌ها
  useEffect(() => {
    const registerPlayer = () => {
      if (playerId && name) {
        socket.emit("register", { playerId, name });
        socket.emit("get_user_rooms", playerId, (rooms) => {
          console.log("get_user_rooms");
          setConnectionState((prev) => ({ ...prev, userRooms: rooms }));
        });
        socket.emit("get_all_games", { roomId: currentRoomId }, (userGames) => {
          console.log("get_all_games");
          console.log(userGames);
          setConnectionState((prev) => ({ ...prev, userGames }));
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
  }, [playerId, name, setConnectionState]);

  useEffect(() => {
    const onRoomCreated = ({ roomId, roomPlayers, hostName, hostId }) => {
      console.log("get_user_rooms ffffffffffff");
      console.log(roomId, roomPlayers, hostName, hostId);
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
      console.log("get_user_rooms");

      if (currentRoomId === roomId) {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          currentRoomId: roomId,
          // hostName: hostName,
          // hostId: hostId,
        }));
      }
    };

    const onUserRoomsUpdated = (rooms) => {
      console.log("get_user_rooms");

      setConnectionState((prev) => ({ ...prev, userRooms: rooms }));
    };

    // const onGameStatusUpdated = (roomId, gameStatus) => {
    //   setUserState((prev) => ({
    //     ...prev,
    //     games: prev.games.map((g) =>
    //       g.roomId === roomId ? { ...g, gameStatus } : g
    //     ),
    //   }));
    // };

    socket.on("room_created", onRoomCreated);
    socket.on("players_updated", onPlayersUpdated);
    socket.on("user_rooms_updated", onUserRoomsUpdated);
    // socket.on("game_status_updated", onGameStatusUpdated);
    socket.on("game_started", (gameId) => {
      console.log("بازی شروع شد");
      console.log(gameId);
      handleSelectGame(gameId);
    });
    socket.on("game_state_requested", (state) => {
      console.log("📦 وضعیت بازی دریافت شد", state);
      setGameState(state.publicState);
      setUserState((prev) => ({
        ...prev,
        ...state.privateState,
      }));
      setConnectionState((prev) => ({
        ...prev,
        currentRoomId: state.publicState.roomId,
        currentGameId: state.publicState.gameId,
      }));
      localStorage.setItem("activeGameId", state.publicState.gameId);

      navigate("/game");
    });

    return () => {
      socket.off("room_created", onRoomCreated);
      socket.off("players_updated", onPlayersUpdated);
      socket.off("user_rooms_updated", onUserRoomsUpdated);
      // socket.off("game_status_updated", onGameStatusUpdated);
      socket.off("game_state_requested");
    };
  }, [setGameState, setUserState, setConnectionState, currentRoomId]);

  const handleSelectGame = (gameId) => {
    console.log("🧩 انتخاب بازی:", gameId);
    console.log(playerId);
    console.log(currentRoomId);
    console.log(localStorage.getItem("playerId"));
    console.log(localStorage.getItem("currentRoomId"));
    socket.emit("join_game", {
      gameId,
      roomId: localStorage.getItem("currentRoomId"),
      playerId: localStorage.getItem("playerId"),
    });
    // socket.emit("callbackTest", gameId, (call) => {
    //   console.log(call);
    // });
    console.log(gameId);
    socket.emit("request_game_state", gameId);
  };

  const handleCreateRoom = () => {
    if (!name || !playerId) return alert("نام و آیدی را وارد کنید.");
    setConnectionState((prev) => ({ ...prev, isHost: true }));
    localStorage.setItem("name", name);
    localStorage.setItem("playerId", playerId);
    socket.emit("create_room", { name, playerId });
  };

  const handleJoinRoom = () => {
    if (!name || !playerId || !roomIdInputState)
      return alert("همه فیلدها را پر کنید.");
    setConnectionState((prev) => ({ ...prev, isHost: false }));
    localStorage.setItem("name", name);
    localStorage.setItem("playerId", playerId);
    socket.emit("join_room", { roomId: roomIdInputState, name, playerId });
    // localStorage.setItem("currentRoomId", currentRoomId);
  };

  const handleEnterRoom = (roomId) => {
    // setConnectionState((prev) => ({ ...prev, currentRoomId: roomId }));
    localStorage.setItem("currentRoomId", roomId);

    socket.emit("join_room", { roomId, name, playerId });

    socket.emit("get_room_state", roomId, (room) => {
      console.log("get_room_state");
      console.log(room);
      console.log(room.roomPlayers);

      if (room) {
        // if (room.activeGameId) {
        //   localStorage.setItem("activeGameId", room.activeGameId);
        // } else {
        //   localStorage.removeItem("activeGameId");
        // }
        setConnectionState((prev) => ({
          ...prev,
          currentRoomId: roomId,
          roomPlayers: room.roomPlayers,
          hostId: room.hostId || "نامشخص",
          isHost: room.hostId === playerId,
          // currentGameId: room.activeGameId,
          // gameStatus:room.gameStarted
          userGames: room.userGames,
        }));
      }
    });

    // socket.emit("get_game_status", roomId, (gameStatus) => {
    //   console.log("gameStatus", gameStatus);
    //   if (gameStatus) {
    //     const { gameId, gameState } = gameStatus;
    //     console.log(gameId);
    //     // به‌روزرسانی کامل وضعیت بازی
    //     setGameState((prev) => ({
    //       ...prev,
    //       // gameId,
    //       gameState,
    //     }));

    //     // setConnectionState((prev) => {
    //     //   const existingGame = prev.userGames.find((g) => g.gameId === gameId);
    //     //   const updatedGames = existingGame
    //     //     ? prev.userGames.map((g) =>
    //     //         g.gameId === gameId ? { ...g, gameStatus: "onGoing" } : g
    //     //       )
    //     //     : [...prev.userGames, { gameId, roomId, gameStatus: "onGoing" }];

    //     //   return {
    //     //     ...prev,
    //     //     userGames: updatedGames,
    //     //   };
    //     // });

    //     console.log("✅ بازی بازیابی شد:", gameStatus);
    //   } else {
    //     console.log(gameState);
    //     // بازی فعالی وجود ندارد
    //     // setConnectionState((prev) => ({
    //     //   ...prev,
    //     //   userGames: prev.userGames.map((g) =>
    //     //     g.roomId === roomId ? { ...g, gameStatus: "notStarted" } : g
    //     //   ),
    //     // }));
    //   }
    // });
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
    localStorage.removeItem("activeGameId");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">🎮 ورود به بازی</h2>

        <input
          className="w-full mb-3 px-4 py-2 rounded bg-gray-700"
          placeholder="نام شما"
          value={nameInputState}
          onChange={(e) => setNameInputState(e.target.value)}
        />

        <input
          className="w-full mb-3 px-4 py-2 rounded bg-gray-700"
          placeholder="آیدی شما (مثلاً u1)"
          value={playerIdInputState}
          onChange={(e) => setPlayerIdInputState(e.target.value)}
        />

        {currentRoomId && (
          <button
            className="w-full py-2 mb-4 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold"
            onClick={handleBackToLobby}
          >
            بازگشت به لابی
          </button>
        )}

        <button
          className="w-full py-2 mb-4 bg-green-600 hover:bg-green-700 rounded font-semibold"
          onClick={() => {
            setConnectionState((prev) => ({
              ...prev,
              name: nameInputState,
              playerId: playerIdInputState,
            }));
            localStorage.setItem("name", nameInputState);
            localStorage.setItem("playerId", playerIdInputState);
          }}
        >
          ورود
        </button>

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

        {/* {userGames.length > 0 && currentRoomId && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">🎮 بازی‌های موجود:</h3>
            <ul className="space-y-2">
              {userGames.map((game) => (
                <li
                  key={game.gameId}
                  className="bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSelectGame(game.gameId)}
                >
                  🎮 {game.gameId} | وضعیت: {game.gameStatus}
                </li>
              ))}
            </ul>
          </div>
        )} */}
        {userGames.length > 0 && currentRoomId && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">🎮 بازی‌های موجود:</h3>
            <ul className="space-y-2">
              {userGames.map((game) => {
                console.log(game);
                const isPlayerInGame = game.gamePlayersIds?.includes(playerId);
                return (
                  <li
                    key={game.gameId}
                    className={`p-2 rounded ${
                      isPlayerInGame
                        ? "bg-gray-700 cursor-pointer hover:bg-gray-600"
                        : "bg-gray-500 text-gray-400 cursor-not-allowed opacity-60"
                    }`}
                    onClick={
                      isPlayerInGame
                        ? () => handleSelectGame(game.gameId)
                        : undefined
                    }
                    style={{ pointerEvents: isPlayerInGame ? "auto" : "none" }}
                  >
                    🎮 {game.gameId} | وضعیت: {game.gameStatus}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {roomPlayers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">جزئیات روم:</h3>
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
                    {p.isReady ? "✅ آماده" : "⏳ منتظر"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {roomPlayers.length > 0 && (
          <button
            onClick={() =>
              socket.emit("toggle_ready", {
                roomId: currentRoomId,
                playerId,
              })
            }
            className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
          >
            {roomPlayers.find((p) => p.playerId === playerId)?.isReady
              ? "❌ بی‌خیال"
              : "✅ آماده‌ام"}
          </button>
        )}

        {currentRoomId && isHost && (
          <button
            onClick={() =>
              socket.emit("start_game", {
                roomId: currentRoomId,
                playerId,
              })
            }
            className="mt-2 w-full py-2 bg-red-600 hover:bg-red-700 rounded font-semibold"
          >
            🎬 شروع بازی
          </button>
        )}
      </div>
    </div>
  );
}

export default LobbyPage;
