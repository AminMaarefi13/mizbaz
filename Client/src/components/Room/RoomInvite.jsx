import React, { useEffect, useState } from "react";
import { socket } from "../../network/socket";

export default function RoomInvite({ roomId }) {
  const [pendingInvites, setPendingInvites] = useState([]);
  const [invitees, setInvitees] = useState([]);
  // ...existing code...
  useEffect(() => {
    fetchPendingInvites();
    socket.on("room_invite_received", fetchPendingInvites);
    return () => {
      socket.off("room_invite_received", fetchPendingInvites);
    };
    // eslint-disable-next-line
  }, [roomId]);
  // ...existing code...
  useEffect(() => {
    socket.emit("get_friends_data", (data) => {
      setInvitees(data.friends || []);
    });
    fetchPendingInvites();
    // eslint-disable-next-line
  }, []);

  function fetchPendingInvites() {
    socket.emit("get_pending_room_invites", { roomId }, (data) => {
      console.log(data);
      setPendingInvites(data || []);
    });
  }

  const handleInvite = (friendId) => {
    socket.emit("invite_friend_to_room", { friendId, roomId }, (res) => {
      if (res.success) fetchPendingInvites();
      alert(res.message);
    });
  };

  const handleCancelInvite = (friendId) => {
    socket.emit("cancel_room_invite", { friendId, roomId }, (res) => {
      if (res.success) fetchPendingInvites();
      alert(res.message);
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h3 className="font-bold text-lg mb-2 text-blue-400">
        دعوت دوستان به روم
      </h3>
      <div className="mb-3">
        <span className="text-gray-300">دوستان:</span>
        <ul className="flex flex-wrap gap-2 mt-2">
          {invitees.map((f) => (
            <li key={f._id}>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                onClick={() => handleInvite(f._id)}
                disabled={pendingInvites.some((inv) => inv.friendId === f._id)}
              >
                دعوت {f.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-3">
        <span className="text-gray-300">اینوایت‌های پندینگ:</span>
        <ul className="mt-2">
          {pendingInvites.map((inv) => (
            <li
              key={inv.to + "-" + inv.from}
              className="flex items-center gap-2"
            >
              <span>{inv.toName}</span>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                onClick={() => handleCancelInvite(inv.to)}
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
        {/* <ul className="mt-2">
          {pendingInvites.map((inv) => (
            <li key={inv.friendId} className="flex items-center gap-2">
              <span>{inv.friendName}</span>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                onClick={() => handleCancelInvite(inv.friendId)}
              >
                حذف
              </button>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { socket } from "../../network/socket";

// export default function RoomInvite({ roomId }) {
//   const [pendingInvites, setPendingInvites] = useState([]);
//   const [invitees, setInvitees] = useState([]);
//   const [roomInvites, setRoomInvites] = useState([]);

//   // گرفتن لیست دوستان (فرض بر این که داری)
//   useEffect(() => {
//     socket.emit("get_friends_data", (data) => {
//       setInvitees(data.friends || []);
//     });
//     fetchPendingInvites();
//     fetchRoomInvites();

//     socket.on("room_invite_received", fetchRoomInvites);

//     return () => {
//       socket.off("room_invite_received", fetchRoomInvites);
//     };
//     // eslint-disable-next-line
//   }, []);

//   function fetchPendingInvites() {
//     // فرض: سرور باید لیست اینوایت‌های پندینگ را برگرداند (دوستانی که دعوت شده‌اند)
//     socket.emit("get_pending_room_invites", { roomId }, (data) => {
//       setPendingInvites(data || []);
//     });
//   }

//   function fetchRoomInvites() {
//     socket.emit("get_room_invites", (data) => {
//       setRoomInvites(data || []);
//     });
//   }

//   // ارسال اینوایت
//   const handleInvite = (friendId) => {
//     socket.emit("invite_friend_to_room", { friendId, roomId }, (res) => {
//       if (res.success) fetchPendingInvites();
//       alert(res.message);
//     });
//   };

//   // حذف اینوایت پندینگ
//   const handleCancelInvite = (friendId) => {
//     socket.emit("cancel_room_invite", { friendId, roomId }, (res) => {
//       if (res.success) fetchPendingInvites();
//       alert(res.message);
//     });
//   };

//   // قبول یا رد اینوایت
//   const handleRespondInvite = (roomId, fromId, accept) => {
//     socket.emit("respond_room_invite", { roomId, fromId, accept }, (res) => {
//       fetchRoomInvites();
//       if (res.joined) {
//         // می‌توانی کاربر را به روم منتقل کنی
//         window.location.reload();
//       }
//       alert(res.message);
//     });
//   };

//   return (
//     <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
//       <h3 className="font-bold text-lg mb-2 text-blue-400">
//         دعوت دوستان به روم
//       </h3>
//       <div className="mb-3">
//         <span className="text-gray-300">دوستان:</span>
//         <ul className="flex flex-wrap gap-2 mt-2">
//           {invitees.map((f) => (
//             <li key={f._id}>
//               <button
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
//                 onClick={() => handleInvite(f._id)}
//                 disabled={pendingInvites.some((inv) => inv.friendId === f._id)}
//               >
//                 دعوت {f.name}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="mb-3">
//         <span className="text-gray-300">اینوایت‌های پندینگ:</span>
//         <ul className="mt-2">
//           {pendingInvites.map((inv) => (
//             <li key={inv.friendId} className="flex items-center gap-2">
//               <span>{inv.friendName}</span>
//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
//                 onClick={() => handleCancelInvite(inv.friendId)}
//               >
//                 حذف
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div>
//         <span className="text-gray-300">اینوایت‌های دریافتی:</span>
//         <ul className="mt-2">
//           {roomInvites.map((inv) => (
//             <li
//               key={inv.roomId + inv.from._id}
//               className="flex items-center gap-2"
//             >
//               <span>
//                 دعوت به روم {inv.roomId} از {inv.from.name}
//               </span>
//               <button
//                 className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
//                 onClick={() =>
//                   handleRespondInvite(inv.roomId, inv.from._id, true)
//                 }
//               >
//                 قبول
//               </button>
//               <button
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
//                 onClick={() =>
//                   handleRespondInvite(inv.roomId, inv.from._id, false)
//                 }
//               >
//                 رد
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
