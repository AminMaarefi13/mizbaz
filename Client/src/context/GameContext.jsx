import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../network/socket";

const GameContext = createContext();
export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    journeyType: "",
    mapPosition: "",
    currentPhase: "",
    players: [],
    captainId: null,
    firstOfficerId: null,
    navigatorId: null,
    currentVoteSessionId: null,
    logs: [],
    gameStatus: "",
  });

  const [userState, setUserState] = useState({
    role: "",
    knownRoles: [],
    characterCard: "",
    privatePhaseData: {},
  });
  const [connectionState, setConnectionState] = useState({
    name: "",
    playerId: "",
    socketId: "",
    currentRoomId: "",
    currentGameId: "",
    hostName: "",
    hostId: "",
    isHost: "",
    roomPlayers: [],
    userRooms: [], // list of { roomId, host, players, hostId }
    userGames: [],
  });
  const [phaseDataState, setPhaseDataState] = useState({});
  const [energy, setEnergy] = useState(10);
  const [subscription, setSubscription] = useState(false);
  const [adSessionCount, setAdSessionCount] = useState(0);

  useEffect(() => {
    if (playerId && name) {
      socket.emit("get_energy", { playerId: playerId }, (data) => {
        console.log(data);
        setEnergy(data.energy);
        setSubscription(data.subscription);
        if (typeof data.adSessionCount === "number")
          setAdSessionCount(data.adSessionCount);
      });
    }
  }, [connectionState.playerId]);
  // useEffect(() => {
  //   if (connectionState.playerId) {
  //     socket.emit(
  //       "get_energy",
  //       { playerId: connectionState.playerId },
  //       (data) => {
  //         setEnergy(data.energy);
  //         setSubscription(data.subscription);
  //       }
  //     );
  //   }
  // }, [connectionState.playerId]);
  // تابع برای دریافت پاداش تبلیغ
  // rewardEnergy
  const rewardEnergy = (cb) => {
    socket.emit(
      "reward_energy",
      { playerId: connectionState.playerId },
      (data) => {
        if (typeof data.energy === "number") setEnergy(data.energy);
        if (typeof data.adSessionCount === "number")
          setAdSessionCount(data.adSessionCount);
        if (cb) cb(data); // اگر نیاز داری کل آبجکت را به callback بده
      }
    );
  };

  // const rewardEnergy = (cb) => {
  //   socket.emit(
  //     "reward_energy",
  //     { playerId: connectionState.playerId },
  //     (data) => {
  //       if (data.energy !== undefined) setEnergy(data.energy);
  //       if (typeof data.adSessionCount === "number")
  //         setAdSessionCount(data.adSessionCount);
  //       if (cb) cb(data);
  //     }
  //   );
  // };
  // const rewardEnergy = () => {
  //   socket.emit(
  //     "reward_energy",
  //     { playerId: connectionState.playerId },
  //     (data) => {
  //       if (data.energy !== undefined) setEnergy(data.energy);
  //     }
  //   );
  // };

  // تابع برای آپدیت سابسکریپشن (مثلاً بعد از خرید)
  const updateSubscription = (val) => {
    setSubscription(val);
    socket.emit("update_subscription", {
      playerId: connectionState.playerId,
      subscription: val,
    });
  };
  const { playerId, name, currentRoomId, currentGameId, roomPlayers } =
    connectionState;

  // ✅ درخواست وضعیت بازی وقتی context کامل شد
  const requestGameState = () => {
    if (socket.connected && playerId && currentRoomId && currentGameId) {
      socket.emit("join_game", {
        roomId: currentRoomId,
        gameId: currentGameId,
        playerId: playerId,
      });
      socket.emit("request_game_state", currentGameId);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      requestGameState();
    });

    socket.on("gameState", (state) => {
      console.log("📦 gameState وضعیت بازی دریافت شد", state);
      setGameState(state.publicState);
      setUserState((prev) => ({ ...prev, ...state.privateState }));
    });

    socket.on("game_state_requested", (state) => {
      console.log("📦 game_state_requested وضعیت بازی دریافت شد", state);
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
      // navigate("/game");
    });
    return () => {
      socket.off("connect");
      socket.off("gameState");
      socket.off("game_state_requested");
    };
  }, []);

  // ✅ هربار که اطلاعات هویت کامل شد
  useEffect(() => {
    if (playerId && name) {
      socket.emit("register", { playerId, name });
      socket.emit("get_user_rooms", playerId, (rooms) => {
        setConnectionState((prev) => ({ ...prev, userRooms: rooms }));
      });
    }
    socket.emit("get_all_games", { roomId: currentRoomId }, (games) => {
      setConnectionState((prev) => ({ ...prev, userGames: games }));
    });
  }, [playerId, name]);

  // ✅ هربار که roomId و gameId ست شد، وضعیت بازی درخواست کن
  useEffect(() => {
    if (currentRoomId && currentGameId && playerId) {
      requestGameState();
    }
  }, [currentRoomId, currentGameId, playerId]);

  useEffect(() => {
    socket.on("room_created", ({ roomId, roomPlayers, hostName, hostId }) => {
      setConnectionState((prev) => ({
        ...prev,
        roomPlayers: roomPlayers,
        currentRoomId: roomId,
        hostName: hostName,
        hostId: hostId,
      }));
    });
    socket.on(
      "joined_room",
      ({ roomId, roomPlayers, hostName, hostId, userGames }) => {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          currentRoomId: roomId,
          hostName: hostName,
          hostId: hostId,
          userGames,
        }));
      }
    );

    socket.on("players_updated", ({ roomId, roomPlayers }) => {
      if (currentRoomId === roomId) {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          currentRoomId: roomId,
          // hostName: hostName,
          // hostId: hostId,
        }));
      }
    });

    socket.on("user_rooms_updated", (rooms) => {
      setConnectionState((prev) => ({
        ...prev,
        userRooms: rooms,
      }));
    });

    socket.on(
      "room_updated",
      ({ roomPlayers, hostName, hostId, userGames }) => {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          hostName: hostName,
          hostId: hostId,
          userGames,
        }));
      }
    );

    // socket.on("game_status_updated", (roomId, gameStatus) => {
    //   console.log("game_status_updated dddddddddddddddddd");
    //   console.log("roomId", "gameStatus");
    //   console.log(roomId, gameStatus);
    //   setConnectionState((prevState) => ({
    //     ...prevState,
    //     userGames: prevState.userGames.map((game) =>
    //       game.roomId === roomId ? { ...game, gameStatus } : game
    //     ),
    //   }));
    // });

    return () => {
      socket.off("room_created");
      socket.off("players_updated");
      socket.off("user_rooms_updated");
      // socket.off("game_status_updated");
    };
  }, [currentGameId, currentRoomId, playerId, userState]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        userState,
        setUserState,
        connectionState,
        setConnectionState,
        phaseDataState,
        setPhaseDataState,
        energy,
        setEnergy,
        subscription,
        setSubscription,
        adSessionCount,
        setAdSessionCount,
        rewardEnergy,
        updateSubscription,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
