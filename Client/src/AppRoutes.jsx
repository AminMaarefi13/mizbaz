import React, { useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AppLayout from "./layout/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import MapPage from "./pages/MapPage.jsx";
import PlayersPage from "./pages/PlayersPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LobbyPage from "./pages/LobbyPage.jsx";
import { socket } from "./network/socket.js";
import SignupPage from "./pages/SignupPage.jsx.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AuthPage from "./pages/AuthPage .jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import GameRouter from "./pages/GameRouter.jsx";
import { useGameContext } from "./context/GameContext.jsx";
import { useAppContext } from "./context/AppContext.jsx";

export default function AppRoutes() {
  const location = useLocation();
  const { setConnectionState } = useAppContext();
  const { setGameState } = useGameContext();

  useEffect(() => {
    const isGamePage = /^\/game\/[^/]+$/.test(location.pathname);
    const isMapPage = location.pathname === "/map";
    if (!isGamePage && !isMapPage) {
      setConnectionState((prev) => ({
        ...prev,
        currentGameId: null,
        currentGame: null,
      }));
      setGameState(null);
    }
  }, [location.pathname, setConnectionState, setGameState]);

  useEffect(() => {
    const isGamePage = /^\/game\/[^/]+$/.test(location.pathname);
    const isMapPage = location.pathname === "/map";
    if (!isGamePage && !isMapPage) {
      setConnectionState((prev) => ({
        ...prev,
        currentGameId: null,
        currentGame: null,
      }));
      setGameState(null);
    }
  }, [location.pathname, setConnectionState, setGameState]);

  useEffect(() => {
    if (window.location.pathname === "/game/:gameId") {
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
    <Routes>
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
        path="/game/:gameId"
        element={
          <AppLayout showChat={false}>
            <GameRouter />
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
            <FriendsPage />
          </AppLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AppLayout showChat={false}>
            <AuthPage />
          </AppLayout>
        }
      />
    </Routes>
  );
}
