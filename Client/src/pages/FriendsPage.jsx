import React, { useEffect, useState } from "react";
import { socket } from "../network/socket";

export default function FriendsPage() {
  const [playerId, setPlayerId] = useState(
    localStorage.getItem("playerId") || ""
  );
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [targetId, setTargetId] = useState("");
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [message, setMessage] = useState("");

  const fetchFriendsData = () => {
    socket.emit("get_friends_data", (data) => {
      setFriends(data.friends || []);
      setRequests(data.requests || []);
      setPendingRequests(data.pendingRequests || []);
      setOnlineFriends(data.onlineFriends || []); // این خط را تغییر بده

      // setOnlineFriends(
      //   (data.friends || [])
      //     .filter((f) => onlineFriends.includes(f._id))
      //     .map((f) => f._id)
      // );
    });
  };

  useEffect(() => {
    fetchFriendsData();

    socket.on("friend_online", ({ playerId }) => {
      setOnlineFriends((prev) => [...new Set([...prev, playerId])]);
    });
    socket.on("friend_offline", ({ playerId }) => {
      setOnlineFriends((prev) => prev.filter((id) => id !== playerId));
    });

    socket.on("friend_request_received", fetchFriendsData);
    socket.on("friend_request_accepted", fetchFriendsData);
    socket.on("friend_request_rejected", fetchFriendsData);
    socket.on("friend_request_cancelled", fetchFriendsData);

    return () => {
      socket.off("friend_online");
      socket.off("friend_offline");
      socket.off("friend_request_received", fetchFriendsData);
      socket.off("friend_request_accepted", fetchFriendsData);
      socket.off("friend_request_rejected", fetchFriendsData);
      socket.off("friend_request_cancelled", fetchFriendsData);
    };
    // eslint-disable-next-line
  }, []);

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!targetId) return;
    socket.emit("send_friend_request", targetId, (res) => {
      setMessage(res.message);
      fetchFriendsData();
    });
    setTargetId("");
  };

  const respondRequest = (fromId, accept) => {
    socket.emit("respond_friend_request", { fromId, accept }, (res) => {
      setMessage(res.message);
      fetchFriendsData();
    });
  };

  const cancelRequest = (targetId) => {
    socket.emit("cancel_friend_request", targetId, (res) => {
      setMessage(res.message);
      fetchFriendsData();
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">مدیریت دوستان</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-700">آیدی شما:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-700">
            {playerId}
          </span>
          <button
            className="ml-2 text-blue-600 underline text-sm"
            onClick={() => {
              navigator.clipboard.writeText(playerId);
              setMessage("آیدی کپی شد!");
            }}
          >
            کپی
          </button>
        </div>
        <form onSubmit={handleSendRequest} className="flex gap-2 mb-2">
          <input
            className="border rounded p-2 flex-1 focus:outline-blue-400 bg-gray-50 text-gray-800 placeholder-gray-500"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="آیدی دوست جدید"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            type="submit"
          >
            ارسال درخواست
          </button>
        </form>
        {message && (
          <div className="mb-2 text-green-600 text-sm">{message}</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* دوستان */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-bold text-lg mb-3 text-blue-600 flex items-center gap-2">
            <span>دوستان</span>
            <span className="bg-blue-100 text-blue-700 px-2 rounded text-xs">
              {friends.length}
            </span>
          </h3>
          <ul className="space-y-2">
            {friends.length === 0 && (
              <li className="text-gray-400">هنوز دوستی ندارید.</li>
            )}
            {friends.map((f, idx) => (
              <li
                key={f._id}
                className={`flex items-center gap-3 border-b pb-2 last:border-b-0 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } text-gray-800`}
              >
                <span className="font-medium">{f.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    onlineFriends.includes(f._id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                  title={onlineFriends.includes(f._id) ? "آنلاین" : "آفلاین"}
                ></span>
                <span className="text-xs text-gray-600">
                  {onlineFriends.includes(f._id) ? "آنلاین" : "آفلاین"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* درخواست‌های دریافتی */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-bold text-lg mb-3 text-purple-600">
            درخواست‌های دریافتی
          </h3>
          <ul className="space-y-2">
            {requests.length === 0 && (
              <li className="text-gray-400">درخواستی ندارید.</li>
            )}
            {requests.map((r, idx) => (
              <li
                key={r._id}
                className={`flex items-center gap-3 border-b pb-2 last:border-b-0 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } text-gray-800`}
              >
                <span className="font-medium">{r.name}</span>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => respondRequest(r._id, true)}
                >
                  قبول
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => respondRequest(r._id, false)}
                >
                  رد
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* درخواست‌های ارسال‌شده */}
        <div className="bg-white rounded-xl shadow p-4 col-span-1 md:col-span-2">
          <h3 className="font-bold text-lg mb-3 text-yellow-600">
            درخواست‌های ارسال‌شده (پندینگ)
          </h3>
          <ul className="space-y-2">
            {pendingRequests.length === 0 && (
              <li className="text-gray-400">درخواستی ارسال نکرده‌اید.</li>
            )}
            {pendingRequests.map((r, idx) => (
              <li
                key={r._id}
                className={`flex items-center gap-3 border-b pb-2 last:border-b-0 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } text-gray-800`}
              >
                <span className="font-medium">{r.name}</span>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => cancelRequest(r._id)}
                >
                  لغو
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { socket } from "../network/socket";

// export default function FriendsPage() {
//   const [playerId, setPlayerId] = useState(
//     localStorage.getItem("playerId") || ""
//   );
//   const [name, setName] = useState(localStorage.getItem("name") || "");
//   const [targetId, setTargetId] = useState("");
//   const [friends, setFriends] = useState([]);
//   const [onlineFriends, setOnlineFriends] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [message, setMessage] = useState("");

//   const fetchFriendsData = () => {
//     socket.emit("get_friends_data", (data) => {
//       setFriends(data.friends || []);
//       setRequests(data.requests || []);
//       setPendingRequests(data.pendingRequests || []);
//       setOnlineFriends(
//         (data.friends || [])
//           .filter((f) => onlineFriends.includes(f._id))
//           .map((f) => f._id)
//       );
//     });
//   };

//   useEffect(() => {
//     fetchFriendsData();

//     socket.on("friend_online", ({ playerId }) => {
//       setOnlineFriends((prev) => [...new Set([...prev, playerId])]);
//     });
//     socket.on("friend_offline", ({ playerId }) => {
//       setOnlineFriends((prev) => prev.filter((id) => id !== playerId));
//     });

//     socket.on("friend_request_received", fetchFriendsData);
//     socket.on("friend_request_accepted", fetchFriendsData);
//     socket.on("friend_request_rejected", fetchFriendsData);
//     socket.on("friend_request_cancelled", fetchFriendsData);

//     return () => {
//       socket.off("friend_online");
//       socket.off("friend_offline");
//       socket.off("friend_request_received", fetchFriendsData);
//       socket.off("friend_request_accepted", fetchFriendsData);
//       socket.off("friend_request_rejected", fetchFriendsData);
//       socket.off("friend_request_cancelled", fetchFriendsData);
//     };
//     // eslint-disable-next-line
//   }, []);

//   const handleSendRequest = (e) => {
//     e.preventDefault();
//     if (!targetId) return;
//     socket.emit("send_friend_request", targetId, (res) => {
//       setMessage(res.message);
//       fetchFriendsData();
//     });
//     setTargetId("");
//   };

//   const respondRequest = (fromId, accept) => {
//     socket.emit("respond_friend_request", { fromId, accept }, (res) => {
//       setMessage(res.message);
//       fetchFriendsData();
//     });
//   };

//   const cancelRequest = (targetId) => {
//     socket.emit("cancel_friend_request", targetId, (res) => {
//       setMessage(res.message);
//       fetchFriendsData();
//     });
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10">
//       <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
//         <h2 className="text-2xl font-bold mb-4 text-blue-700">مدیریت دوستان</h2>
//         <div className="flex items-center gap-2 mb-4">
//           <span className="text-gray-700">آیدی شما:</span>
//           <span className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-700">
//             {playerId}
//           </span>
//           <button
//             className="ml-2 text-blue-600 underline text-sm"
//             onClick={() => {
//               navigator.clipboard.writeText(playerId);
//               setMessage("آیدی کپی شد!");
//             }}
//           >
//             کپی
//           </button>
//         </div>
//         <form onSubmit={handleSendRequest} className="flex gap-2 mb-2">
//           <input
//             className="border rounded p-2 flex-1 focus:outline-blue-400"
//             value={targetId}
//             onChange={(e) => setTargetId(e.target.value)}
//             placeholder="آیدی دوست جدید"
//           />
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
//             type="submit"
//           >
//             ارسال درخواست
//           </button>
//         </form>
//         {message && (
//           <div className="mb-2 text-green-600 text-sm">{message}</div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* دوستان */}
//         <div className="bg-white rounded-xl shadow p-4">
//           <h3 className="font-bold text-lg mb-3 text-blue-600 flex items-center gap-2">
//             <span>دوستان</span>
//             <span className="bg-blue-100 text-blue-700 px-2 rounded text-xs">
//               {friends.length}
//             </span>
//           </h3>
//           <ul className="space-y-2">
//             {friends.length === 0 && (
//               <li className="text-gray-400">هنوز دوستی ندارید.</li>
//             )}
//             {friends.map((f) => (
//               <li
//                 key={f._id}
//                 className="flex items-center gap-3 border-b pb-2 last:border-b-0"
//               >
//                 <span className="font-medium">{f.name}</span>
//                 <span
//                   className={`w-2 h-2 rounded-full ${
//                     onlineFriends.includes(f._id)
//                       ? "bg-green-500"
//                       : "bg-gray-400"
//                   }`}
//                   title={onlineFriends.includes(f._id) ? "آنلاین" : "آفلاین"}
//                 ></span>
//                 <span className="text-xs text-gray-500">
//                   {onlineFriends.includes(f._id) ? "آنلاین" : "آفلاین"}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* درخواست‌های دریافتی */}
//         <div className="bg-white rounded-xl shadow p-4">
//           <h3 className="font-bold text-lg mb-3 text-purple-600">
//             درخواست‌های دریافتی
//           </h3>
//           <ul className="space-y-2">
//             {requests.length === 0 && (
//               <li className="text-gray-400">درخواستی ندارید.</li>
//             )}
//             {requests.map((r) => (
//               <li
//                 key={r._id}
//                 className="flex items-center gap-3 border-b pb-2 last:border-b-0"
//               >
//                 <span className="font-medium">{r.name}</span>
//                 <button
//                   className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
//                   onClick={() => respondRequest(r._id, true)}
//                 >
//                   قبول
//                 </button>
//                 <button
//                   className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
//                   onClick={() => respondRequest(r._id, false)}
//                 >
//                   رد
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* درخواست‌های ارسال‌شده */}
//         <div className="bg-white rounded-xl shadow p-4 col-span-1 md:col-span-2">
//           <h3 className="font-bold text-lg mb-3 text-yellow-600">
//             درخواست‌های ارسال‌شده (پندینگ)
//           </h3>
//           <ul className="space-y-2">
//             {pendingRequests.length === 0 && (
//               <li className="text-gray-400">درخواستی ارسال نکرده‌اید.</li>
//             )}
//             {pendingRequests.map((r) => (
//               <li
//                 key={r._id}
//                 className="flex items-center gap-3 border-b pb-2 last:border-b-0"
//               >
//                 <span className="font-medium">{r.name}</span>
//                 <button
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
//                   onClick={() => cancelRequest(r._id)}
//                 >
//                   لغو
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// // import React, { useEffect, useState } from "react";
// // import { socket } from "../network/socket";

// // export default function FriendsPage() {
// //   const [playerId, setPlayerId] = useState(
// //     localStorage.getItem("playerId") || ""
// //   );
// //   const [name, setName] = useState(localStorage.getItem("name") || "");
// //   const [targetId, setTargetId] = useState("");
// //   const [friends, setFriends] = useState([]);
// //   const [onlineFriends, setOnlineFriends] = useState([]);
// //   const [requests, setRequests] = useState([]);
// //   const [pendingRequests, setPendingRequests] = useState([]);
// //   const [message, setMessage] = useState("");

// //   // گرفتن اطلاعات دوستان و درخواست‌ها
// //   const fetchFriendsData = () => {
// //     socket.emit("get_friends_data", (data) => {
// //       setFriends(data.friends || []);
// //       setRequests(data.requests || []);
// //       setPendingRequests(data.pendingRequests || []);
// //       // وضعیت آنلاین دوستان را چک کن
// //       const online = (data.friends || []).filter(
// //         (f) =>
// //           socket.connected &&
// //           socket.id &&
// //           f._id !== playerId &&
// //           socket.id !== null
// //       ); // فقط برای نمونه
// //       setOnlineFriends(online.map((f) => f._id));
// //     });
// //   };

// //   useEffect(() => {
// //     fetchFriendsData();

// //     // وضعیت آنلاین/آفلاین دوستان
// //     socket.on("friend_online", ({ playerId }) => {
// //       setOnlineFriends((prev) => [...new Set([...prev, playerId])]);
// //     });
// //     socket.on("friend_offline", ({ playerId }) => {
// //       setOnlineFriends((prev) => prev.filter((id) => id !== playerId));
// //     });

// //     // آپدیت لیست‌ها بعد از هر تغییر
// //     socket.on("friend_request_received", fetchFriendsData);
// //     socket.on("friend_request_accepted", fetchFriendsData);
// //     socket.on("friend_request_rejected", fetchFriendsData);
// //     socket.on("friend_request_cancelled", fetchFriendsData);

// //     return () => {
// //       socket.off("friend_online");
// //       socket.off("friend_offline");
// //       socket.off("friend_request_received", fetchFriendsData);
// //       socket.off("friend_request_accepted", fetchFriendsData);
// //       socket.off("friend_request_rejected", fetchFriendsData);
// //       socket.off("friend_request_cancelled", fetchFriendsData);
// //     };
// //     // eslint-disable-next-line
// //   }, []);

// //   // ارسال درخواست دوستی
// //   const handleSendRequest = (e) => {
// //     e.preventDefault();
// //     if (!targetId) return;
// //     socket.emit("send_friend_request", targetId, (res) => {
// //       setMessage(res.message);
// //       fetchFriendsData();
// //     });
// //     setTargetId("");
// //   };

// //   // قبول یا رد درخواست
// //   const respondRequest = (fromId, accept) => {
// //     socket.emit("respond_friend_request", { fromId, accept }, (res) => {
// //       setMessage(res.message);
// //       fetchFriendsData();
// //     });
// //   };

// //   // لغو درخواست پندینگ
// //   const cancelRequest = (targetId) => {
// //     socket.emit("cancel_friend_request", targetId, (res) => {
// //       setMessage(res.message);
// //       fetchFriendsData();
// //     });
// //   };

// //   return (
// //     <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
// //       <h2 className="text-xl font-bold mb-4">دوستان</h2>
// //       <div className="mb-4">
// //         <span>آیدی شما: </span>
// //         <span className="font-mono bg-gray-100 px-2 py-1 rounded">
// //           {playerId}
// //         </span>
// //         <button
// //           className="ml-2 text-blue-600 underline"
// //           onClick={() => {
// //             navigator.clipboard.writeText(playerId);
// //             setMessage("آیدی کپی شد!");
// //           }}
// //         >
// //           کپی
// //         </button>
// //       </div>

// //       <form onSubmit={handleSendRequest} className="mb-4 flex gap-2">
// //         <input
// //           className="border rounded p-2 flex-1"
// //           value={targetId}
// //           onChange={(e) => setTargetId(e.target.value)}
// //           placeholder="آیدی دوست"
// //         />
// //         <button
// //           className="bg-blue-600 text-white px-4 py-2 rounded"
// //           type="submit"
// //         >
// //           ارسال درخواست
// //         </button>
// //       </form>

// //       {message && <div className="mb-2 text-green-600">{message}</div>}

// //       <div className="mb-6">
// //         <h3 className="font-bold mb-2">دوستان ({friends.length})</h3>
// //         <ul>
// //           {friends.map((f) => (
// //             <li key={f._id} className="flex items-center gap-2">
// //               <span>{f.name}</span>
// //               <span
// //                 className={
// //                   onlineFriends.includes(f._id)
// //                     ? "text-green-600"
// //                     : "text-gray-400"
// //                 }
// //               >
// //                 {onlineFriends.includes(f._id) ? "آنلاین" : "آفلاین"}
// //               </span>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>

// //       <div className="mb-6">
// //         <h3 className="font-bold mb-2">درخواست‌های دریافتی</h3>
// //         <ul>
// //           {requests.map((r) => (
// //             <li key={r._id} className="flex items-center gap-2">
// //               <span>{r.name}</span>
// //               <button
// //                 className="bg-green-500 text-white px-2 py-1 rounded"
// //                 onClick={() => respondRequest(r._id, true)}
// //               >
// //                 قبول
// //               </button>
// //               <button
// //                 className="bg-red-500 text-white px-2 py-1 rounded"
// //                 onClick={() => respondRequest(r._id, false)}
// //               >
// //                 رد
// //               </button>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>

// //       <div>
// //         <h3 className="font-bold mb-2">درخواست‌های ارسال‌شده (پندینگ)</h3>
// //         <ul>
// //           {pendingRequests.map((r) => (
// //             <li key={r._id} className="flex items-center gap-2">
// //               <span>{r.name}</span>
// //               <button
// //                 className="bg-yellow-500 text-white px-2 py-1 rounded"
// //                 onClick={() => cancelRequest(r._id)}
// //               >
// //                 لغو
// //               </button>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // }
