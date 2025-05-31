import React, { useEffect, useState } from "react";
import { socket } from "../../network/socket";
import { useNavigate } from "react-router-dom";

export default function RoomInvitesInbox() {
  const [roomInvites, setRoomInvites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomInvites();
    socket.on("room_invite_received", fetchRoomInvites);
    return () => {
      socket.off("room_invite_received", fetchRoomInvites);
    };
    // eslint-disable-next-line
  }, []);

  function fetchRoomInvites() {
    socket.emit("get_room_invites", (data) => {
      console.log("Room invites received:", data);
      setRoomInvites(data || []);
    });
  }

  const handleRespondInvite = (roomId, fromId, accept) => {
    socket.emit("respond_room_invite", { roomId, fromId, accept }, (res) => {
      fetchRoomInvites();
      if (res.joined) {
        // انتقال به روم بعد از قبول دعوت
        navigate(`/lobby`);
      }
      alert(res.message);
    });
  };

  if (!roomInvites.length) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h3 className="font-bold text-lg mb-2 text-blue-400">
        دعوت‌های دریافتی به روم
      </h3>
      <ul className="mt-2">
        {roomInvites.map((inv) => (
          <li
            key={inv.roomId + inv.from._id}
            className="flex items-center gap-2"
          >
            <span>
              دعوت به روم {inv.roomId} از {inv.from.name}
            </span>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
              onClick={() =>
                handleRespondInvite(inv.roomId, inv.from._id, true)
              }
            >
              قبول
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
              onClick={() =>
                handleRespondInvite(inv.roomId, inv.from._id, false)
              }
            >
              رد
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
