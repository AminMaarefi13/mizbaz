import React, { useState } from "react";
import MessageItem from "./MessageItem";
import VoiceChatButton from "../VoiceChatButton";

const dummyMessages = [
  { id: 1, sender: "Ali", text: "Ready to set sail! 🏴‍☠️" },
  { id: 2, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 3, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 4, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 5, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 6, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 7, sender: "Ali", text: "Ready to set sail! 🏴‍☠️" },
  { id: 8, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 9, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 10, sender: "Ali", text: "Ready to set sail! 🏴‍☠️" },
  { id: 11, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 12, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 13, sender: "Ali", text: "Ready to set sail! 🏴‍☠️" },
  { id: 14, sender: "Sara", text: "Who will be the Navigator?" },
  { id: 15, sender: "Sara", text: "Who will be the Navigator?" },
];

const ChatPanel = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState("");

  const toggleChat = () => setCollapsed(!collapsed);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-800 text-white shadow-inner transition-all duration-300 ease-in-out">
      {/* Header with toggle */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-blue-500">
        <span className="text-sm font-semibold text-blue-400">Game Chat</span>
        <button
          onClick={toggleChat}
          className="text-xs text-blue-400 hover:text-blue-300 transition"
        >
          {collapsed ? "💬 Open" : "❌ Close"}
        </button>
      </div>

      {/* VoiceChatButton with smaller size */}
      <div className="p-2 flex justify-end">
        <VoiceChatButton />
      </div>

      {/* Chat messages */}
      <div
        className={`transition-all duration-300 overflow-y-auto px-4 space-y-1 ${
          collapsed ? "max-h-0 opacity-0 p-0" : "max-h-48 py-2 opacity-100"
        }`}
      >
        {dummyMessages.map((msg) => (
          <MessageItem key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      {/* Input */}
      {!collapsed && (
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 p-2 border-t border-gray-700"
        >
          <input
            type="text"
            className="flex-1 p-2 rounded bg-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-sm text-white rounded hover:bg-blue-500 transition"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatPanel;
