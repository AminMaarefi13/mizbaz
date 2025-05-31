// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

// Page imports
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import PlayersPage from "./pages/PlayersPage";
import SettingsPage from "./pages/SettingsPage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import { GameProvider } from "./context/GameContext.jsx";
import { socket } from "./network/socket.js";
import SignupPage from "./pages/SignupPage.jsx.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AuthPage from "./pages/AuthPage .jsx";

// Main App component with routing and layout
function App() {
  useEffect(() => {
    // ✅ جلوگیری از ماندن در صفحه game بعد از ریفرش
    if (window.location.pathname === "/game") {
      window.location.replace("/lobby");
      return;
    }

    socket.emit("ping");
    socket.on("pong", (msg) => {
      console.log("🎯 Received from server:", msg);
    });

    const handleBeforeUnload = () => {
      socket.disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("pong");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <GameProvider>
      <Router>
        <Routes>
          {/* Default layout with chat */}
          <Route
            path="/lobby"
            element={
              <AppLayout showChat={false}>
                <LobbyPage />
              </AppLayout>
            }
          />
          <Route
            path="/"
            element={
              <AppLayout showChat={true}>
                <HomePage />
              </AppLayout>
            }
          />
          <Route
            path="/map"
            element={
              <AppLayout showChat={false}>
                <MapPage />
              </AppLayout>
            }
          />
          <Route
            path="/game"
            element={
              <AppLayout showChat={false}>
                <GamePage />
              </AppLayout>
            }
          />
          <Route
            path="/players"
            element={
              <AppLayout showChat={false}>
                <PlayersPage />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout showChat={false}>
                <SettingsPage />
              </AppLayout>
            }
          />
          <Route
            path="/friends"
            element={
              <AppLayout showChat={false}>
                <SignupPage />
              </AppLayout>
            }
          />
          {/* <Route
            path="/login"
            element={
              <AppLayout showChat={false}>
                <LoginPage />
              </AppLayout>
            }
          /> */}
          <Route
            path="/login"
            element={
              <AppLayout showChat={false}>
                <AuthPage />
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
