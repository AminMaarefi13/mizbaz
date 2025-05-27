// src/components/Chat/MessageItem.jsx
import React from "react";

const MessageItem = ({ sender, text }) => {
  return (
    <div className="text-sm text-white">
      <span className="font-semibold text-blue-400">{sender}:</span>{" "}
      <span>{text}</span>
    </div>
  );
};

export default MessageItem;
