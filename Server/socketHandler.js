const { onRegister } = require("./socketHandlers/onRegister.js");
const { onCreateRoom } = require("./socketHandlers/onCreateRoom.js");
const { onJoinRoom } = require("./socketHandlers/onJoinRoom.js");
const { onGetUserRooms } = require("./socketHandlers/onGetUserRooms.js");
const { onGetRoomState } = require("./socketHandlers/onGetRoomState.js");
const { onToggleReady } = require("./socketHandlers/onToggleReady.js");
const { onStartGame } = require("./socketHandlers/onStartGame.js");
const {
  onRequestGameState,
} = require("./socketHandlers/onRequestGameState.js");
const { onGetAllGames } = require("./socketHandlers/onGetAllGames.js");
const { onGetGameStatus } = require("./socketHandlers/onGetGameStatus.js");
const { onReconnectPlayer } = require("./socketHandlers/onReconnectPlayer.js");
const { onDisconnect } = require("./socketHandlers/onDisconnect.js");

const rooms = new Map(); // roomId => { players: [] }
const games = new Map(); // gameId => { gameState, roomId }
const connectionsArr = new Map(); // playerId => { player }
const userSocketMap = new Map(); // playerId => socketId
const gameController = require("./controllers/gameController");
const connectionController = require("./controllers/connectionController");

const { proceedToNextPhase } = require("./game/proceedToNextPhase.js");
const { getValidGameAndRoom } = require("./utils/getValidGameAndRoom.js");
const { updateAndBroadcastGame } = require("./utils/updateAndBroadcastGame.js");
const {
  initializeMemoryAndRedis,
} = require("./utils/initializeMemoryAndRedis.js");

initializeMemoryAndRedis(rooms, games).then(() => {
  console.log("Memory and Redis initialized from DB");
  console.log("rooms", rooms);
  console.log("games", games);
});

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("⚡ New socket connected:", socket.id);

    socket.on("register", async ({ playerId, name }) => {
      onRegister(
        playerId,
        name,
        socket,
        userSocketMap,
        rooms,
        games,
        connectionsArr,
        io
      );
    });

    socket.on("create_room", async ({ name, playerId }) => {
      onCreateRoom(
        name,
        playerId,
        socket,
        userSocketMap,
        rooms,
        connectionsArr,
        io
      );
    });

    socket.on("join_room", async ({ roomId, name, playerId }) => {
      onJoinRoom(
        roomId,
        name,
        playerId,
        socket,
        userSocketMap,
        rooms,
        connectionsArr,
        io
      );
    });

    socket.on("get_user_rooms", (playerId, callback) => {
      onGetUserRooms(playerId, callback, connectionsArr, rooms);
    });

    socket.on("get_room_state", (roomId, callback) => {
      onGetRoomState(roomId, callback, rooms);
    });

    socket.on("toggle_ready", async ({ roomId, playerId }) => {
      onToggleReady(roomId, playerId, rooms, io);
    });

    socket.on("reconnect-player", ({ playerId }) => {
      onReconnectPlayer(
        playerId,
        rooms,
        socket,
        userSocketMap,
        connectionsArr,
        io
      );
    });

    // فرض می‌کنیم rooms،  userSocketMap وجود دارن
    socket.on("start_game", async ({ roomId, playerId }) => {
      onStartGame(roomId, playerId, socket, userSocketMap, rooms, games, io);
    });
    socket.on("request_game_state", async (gameId) => {
      onRequestGameState(games, gameId, rooms, socket, userSocketMap, io);
    });

    socket.on("get_all_games", async (roomId, callback) => {
      onGetAllGames(roomId, callback);
    });

    socket.on("get_game_status", async (roomId, callback) => {
      onGetGameStatus(roomId, rooms, callback, rooms, games);
    });

    socket.on("phase_seen", async ({ gameId, playerId }) => {
      const { game, room, roomId, gameState } = getValidGameAndRoom({
        gameId,
        games,
        rooms,
      });
      console.log("phaseSeen");
      console.log(playerId);
      // پیدا کردن بازیکن فعلی
      const player = gameState.players.find(
        (p) => p.id === playerId && !p.eliminated
      );
      console.log("player");
      console.log(player);
      if (!player) return;
      console.log("gameState?.phaseData?.phaseSeen beforeeeeeeeee");
      console.log(gameState?.phaseData?.phaseSeen);
      // جلوگیری از تکرار
      if (gameState?.phaseData?.phaseSeen === undefined) {
        console.log("was undefined");
        gameState.phaseData.phaseSeen = [];
      }
      console.log("gameState?.phaseData?.phaseSeen");
      console.log(gameState?.phaseData?.phaseSeen);
      if (gameState.phaseData?.phaseSeen.includes(playerId)) return;
      console.log("continued...");
      gameState.phaseData.phaseSeen.push(playerId);
      await gameController.updateGame(gameId, gameState);
      //  await gameController.updateGame(gameId, {
      //   gameState: gameState,
      //   roomId,
      // });

      // چک کن همه دیدن یا نه
      const alivePlayerIds = gameState.players
        .filter((p) => !p.eliminated) // یا هر شرطی برای بازیکن فعال
        .map((p) => p.id);
      console.log("alivePlayerIds");
      console.log(alivePlayerIds);
      const allSeen = alivePlayerIds.every((id) =>
        gameState.phaseData.phaseSeen.includes(id)
      );
      console.log("allSeen");
      console.log(allSeen);
      const progress = {
        current: gameState.phaseData.phaseSeen.length,
        total: alivePlayerIds.length,
      };

      gameState.phaseData.current = progress.current;
      gameState.phaseData.total = progress.total;

      console.log("progress");
      console.log(progress);
      updateAndBroadcastGame(
        games,
        gameId,
        gameState,
        roomId,
        room,
        userSocketMap,
        io
      );
      if (allSeen) {
        console.log("allSeenssssssssss");
        proceedToNextPhase({
          games,
          gameState,
          gameId,
          roomId,
          rooms,
          userSocketMap,
          io,
          eventSpecificData: "",
        }); // ادامه بازی
      }
    });

    socket.on("phase_confirm", async ({ gameId, payload }) => {
      console.log(gameId);
      // console.log(playerId);
      const { game, room, roomId, gameState } = getValidGameAndRoom({
        gameId,
        games,
        rooms,
      });
      console.log("payload");
      console.log(payload);
      proceedToNextPhase({
        games,
        gameState,
        gameId,
        roomId,
        rooms,
        userSocketMap,
        io,
        eventSpecificData: payload,
      }); // ادامه بازی
      // }
    });

    // هندل گرفتن انرژی
    socket.on("get_energy", async ({ playerId }, callback) => {
      const data = await connectionController.getEnergyAndSubscription(
        playerId
      );
      callback(data);
    });

    // فایل: Server/socketHandler.js
    socket.on("consume_energy", async ({ playerId, amount }, callback) => {
      const user = await connectionController.consumeEnergy(playerId, amount);
      callback({ energy: user ? user.energy : null });
    });

    // هندل پاداش تبلیغ
    socket.on("reward_energy", async ({ playerId }, callback) => {
      const result = await connectionController.rewardEnergy(playerId);
      console.log("reward_energy result", result);
      callback(result); // مستقیماً آبجکت را برگردان
    });
    // socket.on("reward_energy", async ({ playerId }, callback) => {
    //   const energy = await connectionController.rewardEnergy(playerId);
    //   callback({ energy });
    // });

    // هندل آپدیت سابسکریپشن
    socket.on("update_subscription", async ({ playerId, subscription }) => {
      await connectionController.updateSubscription(playerId, subscription);
    });

    socket.on("disconnect", () => {
      onDisconnect(socket, userSocketMap);
    });
  });
}

module.exports = {
  socketHandler,
  rooms,
  games,
  userSocketMap,
};
