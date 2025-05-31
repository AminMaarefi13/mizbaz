const { userSocketMap, rooms } = require("../utils/memoryStore");
const User = require("../models/UserModel");
const { onJoinRoom } = require("./onJoinRoom");

async function inviteFriendToRoom(socket, { friendId, roomId }, callback) {
  const userId = socket.user._id.toString();
  const userName = socket.user.name;
  if (userId === friendId)
    return callback({
      success: false,
      message: "نمی‌توانید خودتان را دعوت کنید.",
    });

  const room = rooms.get(roomId);
  if (!room) return callback({ success: false, message: "روم پیدا نشد." });

  // چک کن دوست عضو روم نباشد
  if (room.players.some((p) => p.playerId?.toString() === friendId))
    return callback({
      success: false,
      message: "این کاربر هم‌اکنون عضو روم است.",
    });

  // چک کن قبلاً اینوایت نشده باشد
  if (room.pendingInvites?.some((inv) => inv.to === friendId))
    return callback({ success: false, message: "قبلاً دعوت شده است." });

  // گرفتن نام دوست (اختیاری)
  const friend = await User.findById(friendId);
  if (!friend) return callback({ success: false, message: "کاربر پیدا نشد." });

  // اضافه به لیست پندینگ روم
  if (!room.pendingInvites) room.pendingInvites = [];
  room.pendingInvites.push({
    from: userId,
    fromName: userName,
    to: friendId,
    toName: friend.name,
    createdAt: new Date(),
  });
  console.log("room.pendingInvites");
  console.log(room.pendingInvites);
  // اطلاع real-time اگر آنلاین است
  const friendSocketId = userSocketMap.get(friendId);
  if (friendSocketId) {
    socket.to(friendSocketId).emit("room_invite_received", {
      roomId,
      from: userId,
      fromName: userName,
    });
  }

  callback({ success: true, message: "دعوت ارسال شد." });
}
// async function inviteFriendToRoom(socket, { friendId, roomId }, callback) {
//   const userId = socket.user._id;
//   if (userId.toString() === friendId)
//     return callback({
//       success: false,
//       message: "نمی‌توانید خودتان را دعوت کنید.",
//     });

//   // چک کن دوست عضو روم نباشد
//   const room = rooms.get(roomId);
//   if (room && room.players.some((p) => p.playerId?.toString() === friendId)) {
//     return callback({
//       success: false,
//       message: "این کاربر هم‌اکنون عضو روم است.",
//     });
//   }

//   const friend = await User.findById(friendId);
//   if (!friend) return callback({ success: false, message: "کاربر پیدا نشد." });

//   // چک کن قبلاً اینوایت نشده باشد
//   if (
//     friend.roomInvites.some(
//       (inv) =>
//         inv.roomId === roomId && inv.from.toString() === userId.toString()
//     )
//   )
//     return callback({ success: false, message: "قبلاً دعوت شده است." });

//   friend.roomInvites.push({
//     roomId,
//     from: userId,
//     to: friendId,
//     toName: friend.name,
//     fromName: socket.user.name,
//   });
//   await friend.save();

//   // اطلاع real-time اگر آنلاین است
//   const friendSocketId = userSocketMap.get(friendId);
//   if (friendSocketId) {
//     socket.to(friendSocketId).emit("room_invite_received", {
//       roomId,
//       from: userId,
//       fromName: socket.user.name,
//     });
//   }

//   callback({ success: true, message: "دعوت ارسال شد." });
// }
function getRoomInvites(socket, callback) {
  const userId = socket.user._id.toString();
  console.log("getRoomInvites for userId:", userId);
  const invites = [];

  // فرض: rooms یک Map است که همه روم‌ها را نگه می‌دارد
  for (const [roomId, room] of rooms.entries()) {
    (room.pendingInvites || []).forEach((inv) => {
      if (inv.to === userId) {
        invites.push({
          roomId,
          from: { _id: inv.from, name: inv.fromName },
          to: { _id: inv.to, name: inv.toName },
          createdAt: inv.createdAt,
        });
      }
    });
  }
  console.log("invites:", invites);
  callback(invites);
}
// async function getRoomInvites(socket, callback) {
//   const user = await User.findById(socket.user._id).populate(
//     "roomInvites.from",
//     "name _id"
//   );
//   callback(user.roomInvites || []);
// }

async function respondRoomInvite(
  socket,
  io,
  { roomId, fromId, accept },
  callback
) {
  const userId = socket.user._id.toString();
  const room = rooms.get(roomId);
  if (!room) {
    return callback({
      success: false,
      message: "روم پیدا نشد.",
      joined: false,
    });
  }

  // حذف اینوایت از لیست پندینگ روم (در هر دو حالت)
  room.pendingInvites = (room.pendingInvites || []).filter(
    (inv) => !(inv.to === userId && inv.from === fromId)
  );

  // اطلاع به دعوت‌کننده و دعوت‌شونده برای رفرش لیست اینوایت‌ها
  const inviterSocketId = userSocketMap.get(fromId);
  if (inviterSocketId) {
    socket.to(inviterSocketId).emit("room_invite_received");
  }
  const inviteeSocketId = userSocketMap.get(userId);
  if (inviteeSocketId) {
    socket.to(inviteeSocketId).emit("room_invite_received");
  }

  if (accept) {
    // اضافه کردن کاربر به روم در Map حافظه (منطق فعلی تو)
    const alreadyInRoom = room.players.some(
      (p) => p.playerId?.toString() === userId
    );
    if (!alreadyInRoom) {
      onJoinRoom(roomId, socket, io);
    }
    callback({ success: true, message: "به روم اضافه شدید.", joined: true });
  } else {
    callback({ success: true, message: "دعوت رد شد.", joined: false });
  }
}

// async function respondRoomInvite(
//   socket,
//   io,
//   { roomId, fromId, accept },
//   callback
// ) {
//   const userId = socket.user._id.toString();
//   const room = rooms.get(roomId);
//   if (!room) {
//     return callback({
//       success: false,
//       message: "روم پیدا نشد.",
//       joined: false,
//     });
//   }

//   // حذف اینوایت از لیست پندینگ روم
//   room.pendingInvites = (room.pendingInvites || []).filter(
//     (inv) => !(inv.to === userId && inv.from === fromId)
//   );

//   // اطلاع به دعوت‌کننده و دعوت‌شونده برای رفرش لیست اینوایت‌ها
//   const inviterSocketId = userSocketMap.get(fromId);
//   if (inviterSocketId) {
//     socket.to(inviterSocketId).emit("room_invite_received");
//   }
//   const inviteeSocketId = userSocketMap.get(userId);
//   if (inviteeSocketId) {
//     socket.to(inviteeSocketId).emit("room_invite_received");
//   }

//   if (accept) {
//     // اضافه کردن کاربر به روم در Map حافظه (منطق فعلی تو)
//     const alreadyInRoom = room.players.some(
//       (p) => p.playerId?.toString() === userId
//     );
//     if (!alreadyInRoom) {
//       onJoinRoom(roomId, socket, io);
//     }

//     callback({ success: true, message: "به روم اضافه شدید.", joined: true });
//   } else {
//     callback({ success: true, message: "دعوت رد شد.", joined: false });
//   }
// }

// async function respondRoomInvite(
//   socket,
//   io,
//   { roomId, fromId, accept },
//   callback
// ) {
//   const user = await User.findById(socket.user._id);

//   // حذف اینوایت از لیست کاربر فعلی (دریافت‌کننده)
//   user.roomInvites = user.roomInvites.filter(
//     (inv) => !(inv.roomId === roomId && inv.from.toString() === fromId)
//   );
//   await user.save();

//   // حذف اینوایت از لیست فرستنده (پندینگ)
//   const sender = await User.findById(fromId);
//   if (sender) {
//     sender.roomInvites = sender.roomInvites.filter(
//       (inv) =>
//         !(
//           inv.roomId === roomId &&
//           inv.from.toString() === fromId &&
//           inv.to?.toString() === user._id.toString()
//         )
//     );
//     await sender.save();
//   }

//   if (accept) {
//     // اضافه کردن کاربر به روم در Map حافظه
//     const room = rooms.get(roomId);
//     if (!room) {
//       return callback({
//         success: false,
//         message: "روم پیدا نشد.",
//         joined: false,
//       });
//     }

//     // چک کن کاربر قبلاً عضو نباشد
//     const alreadyInRoom = room.players.some(
//       (p) => p.playerId?.toString() === user._id.toString()
//     );
//     if (!alreadyInRoom) {
//       onJoinRoom(roomId, socket, io);
//     }

//     callback({ success: true, message: "به روم اضافه شدید.", joined: true });
//   } else {
//     callback({ success: true, message: "دعوت رد شد.", joined: false });
//   }
// }

// async function respondRoomInvite(
//   socket,
//   io,
//   { roomId, fromId, accept },
//   callback
// ) {
//   const user = await User.findById(socket.user._id);

//   // حذف اینوایت از لیست
//   user.roomInvites = user.roomInvites.filter(
//     (inv) => !(inv.roomId === roomId && inv.from.toString() === fromId)
//   );
//   await user.save();

//   if (accept) {
//     // اضافه کردن کاربر به روم در Map حافظه
//     const room = rooms.get(roomId);
//     if (!room) {
//       return callback({
//         success: false,
//         message: "روم پیدا نشد.",
//         joined: false,
//       });
//     }

//     // چک کن کاربر قبلاً عضو نباشد
//     const alreadyInRoom = room.players.some(
//       (p) => p.playerId?.toString() === user._id.toString()
//     );
//     if (!alreadyInRoom) {
//       onJoinRoom(roomId, socket, io);
//       // room.players.push({
//       //   playerId: user._id.toString(),
//       //   nickname: user.name,
//       //   isReady: false,
//       //   // هر فیلد دیگری که نیاز داری
//       // });
//     }

//     // اطلاع به همه اعضای روم (اختیاری)
//     // room.players.forEach(p => {
//     //   const sockId = userSocketMap.get(p.playerId);
//     //   if (sockId) socket.to(sockId).emit("room_player_joined", { playerId: user._id.toString(), nickname: user.name });
//     // });

//     callback({ success: true, message: "به روم اضافه شدید.", joined: true });
//   } else {
//     callback({ success: true, message: "دعوت رد شد.", joined: false });
//   }
// }

function cancelRoomInvite(socket, { friendId, roomId }, callback) {
  const room = rooms.get(roomId);
  if (!room) return callback({ success: false, message: "روم پیدا نشد." });

  room.pendingInvites = (room.pendingInvites || []).filter(
    (inv) => inv.to !== friendId
  );

  // اطلاع real-time به کاربر دعوت‌شونده برای رفرش لیست اینوایت‌ها
  const friendSocketId = userSocketMap.get(friendId);
  if (friendSocketId) {
    socket.to(friendSocketId).emit("room_invite_received");
  }

  callback({ success: true, message: "اینوایت حذف شد." });
}
// function cancelRoomInvite(socket, { friendId, roomId }, callback) {
//   const room = rooms.get(roomId);
//   if (!room) return callback({ success: false, message: "روم پیدا نشد." });

//   room.pendingInvites = (room.pendingInvites || []).filter(
//     (inv) => inv.to !== friendId
//   );
//   callback({ success: true, message: "اینوایت حذف شد." });
// }
// async function cancelRoomInvite(socket, { friendId, roomId }, callback) {
//   const friend = await User.findById(friendId);
//   if (!friend) return callback({ success: false, message: "کاربر پیدا نشد." });
//   friend.roomInvites = friend.roomInvites.filter(
//     (inv) =>
//       !(
//         inv.roomId === roomId &&
//         inv.from.toString() === socket.user._id.toString()
//       )
//   );
//   await friend.save();
//   callback({ success: true, message: "اینوایت حذف شد." });
// }

function getPendingRoomInvites(socket, { roomId }, callback) {
  const room = rooms.get(roomId);
  callback(room?.pendingInvites || []);
}
// async function getPendingRoomInvites(socket, { roomId }, callback) {
//   const user = await User.findById(socket.user._id).populate(
//     "friends",
//     "name roomInvites"
//   );
//   const room = rooms.get(roomId);

//   // دوستانی که به آن‌ها اینوایت داده‌ای و هنوز عضو روم نیستند
//   const pending = [];
//   for (const friend of user.friends) {
//     // چک کن دوست عضو روم نباشد
//     if (
//       room &&
//       room.players.some((p) => p.playerId?.toString() === friend._id.toString())
//     )
//       continue;

//     // چک کن اینوایت از طرف کاربر فعلی برای این دوست وجود دارد
//     const hasInvite = (friend.roomInvites || []).some(
//       (inv) =>
//         inv.roomId === roomId && inv.from.toString() === user._id.toString()
//     );
//     if (hasInvite) {
//       pending.push({
//         friendId: friend._id.toString(),
//         friendName: friend.name,
//       });
//     }
//   }

//   callback(pending);
// }
// async function getPendingRoomInvites(socket, { roomId }, callback) {
//   const user = await User.findById(socket.user._id);
//   const room = rooms.get(roomId);

//   // فقط اینوایت‌هایی که این کاربر ارسال کرده و دوست هنوز عضو روم نشده
//   console.log("user.roomInvites");
//   console.log(user.roomInvites);

//   const pending = user.roomInvites
//     .filter(
//       (inv) =>
//         inv.roomId === roomId &&
//         inv.from.toString() === user._id.toString() &&
//         (!room ||
//           !room.players.some(
//             (p) => p.playerId?.toString() === inv.to?.toString()
//           ))
//     )
//     .map((inv) => ({
//       friendId: inv.to?.toString(),
//       friendName: inv.toName,
//     }));
//   console.log("pending");
//   console.log(pending);

//   callback(pending);
// }

module.exports = {
  inviteFriendToRoom,
  getRoomInvites,
  respondRoomInvite,
  cancelRoomInvite,
  getPendingRoomInvites,
};

// // فایل: Server/socketHandlers/roomInvite.js
// const { userSocketMap } = require("../utils/memoryStore");
// const User = require("../models/UserModel");

// async function inviteFriendToRoom(socket, { friendId, roomId }, callback) {
//   const userId = socket.user._id;
//   if (userId.toString() === friendId)
//     return callback({
//       success: false,
//       message: "نمی‌توانید خودتان را دعوت کنید.",
//     });

//   const friend = await User.findById(friendId);
//   if (!friend) return callback({ success: false, message: "کاربر پیدا نشد." });

//   // چک کن قبلاً اینوایت نشده باشد
//   if (
//     friend.roomInvites.some(
//       (inv) =>
//         inv.roomId === roomId && inv.from.toString() === userId.toString()
//     )
//   )
//     return callback({ success: false, message: "قبلاً دعوت شده است." });

//   friend.roomInvites.push({ roomId, from: userId });
//   await friend.save();

//   // اطلاع real-time اگر آنلاین است
//   const friendSocketId = userSocketMap.get(friendId);
//   if (friendSocketId) {
//     socket.to(friendSocketId).emit("room_invite_received", {
//       roomId,
//       from: userId,
//       fromName: socket.user.name,
//     });
//   }

//   callback({ success: true, message: "دعوت ارسال شد." });
// }

// async function getRoomInvites(socket, callback) {
//   const user = await User.findById(socket.user._id).populate(
//     "roomInvites.from",
//     "name _id"
//   );
//   callback(user.roomInvites || []);
// }

// const Room = require("../models/RoomModel"); // فرض بر این که داری

// async function respondRoomInvite(socket, { roomId, fromId, accept }, callback) {
//   const user = await User.findById(socket.user._id);
//   // حذف اینوایت از لیست
//   user.roomInvites = user.roomInvites.filter(
//     (inv) => !(inv.roomId === roomId && inv.from.toString() === fromId)
//   );
//   await user.save();

//   if (accept) {
//     // اضافه کردن کاربر به روم (بسته به ساختار RoomModel)
//     await Room.updateOne({ roomId }, { $addToSet: { players: user._id } });
//     // اطلاع به همه اعضای روم (اختیاری)
//     // ...
//     callback({ success: true, message: "به روم اضافه شدید.", joined: true });
//   } else {
//     callback({ success: true, message: "دعوت رد شد.", joined: false });
//   }
// }

// async function cancelRoomInvite(socket, { friendId, roomId }, callback) {
//   const friend = await User.findById(friendId);
//   if (!friend) return callback({ success: false, message: "کاربر پیدا نشد." });
//   friend.roomInvites = friend.roomInvites.filter(
//     (inv) =>
//       !(
//         inv.roomId === roomId &&
//         inv.from.toString() === socket.user._id.toString()
//       )
//   );
//   await friend.save();
//   callback({ success: true, message: "اینوایت حذف شد." });
// }

// module.exports = {
//   inviteFriendToRoom,
//   getRoomInvites,
//   respondRoomInvite,
//   cancelRoomInvite,
// };
