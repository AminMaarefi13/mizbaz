import React, { useState } from "react";
import ChatPanel from "../components/Chat/ChatPanel";
import NavigationMenu from "../components/NavigationMenu";

const AppLayout = ({
  children,
  showChat = true,
  isCaptain = false,
  cabinetUI,
}) => {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {cabinetUI && (
        <div className="w-full max-w-6xl mx-auto px-4 py-2">{cabinetUI}</div>
      )}
      <div className="flex-1 overflow-y-auto px-4 pt-2">
        <div className="max-w-4xl mx-auto">{children}</div>
      </div>
      {showChat && chatOpen && (
        <div className="bg-gray-800 border-t border-blue-500 shadow-inner max-h-[40vh] overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <ChatPanel />
          </div>
        </div>
      )}
      <footer className="bg-gray-950 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <NavigationMenu />
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
