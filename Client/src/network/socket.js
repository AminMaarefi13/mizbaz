import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_MODE === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
// export const socket = io("http://localhost:3001", {
//   autoConnect: false,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// توکن یا playerId رو از localStorage بخون
const playerId = localStorage.getItem("playerId");

// اتصال اولیه
socket.connect();

// وقتی اتصال برقرار شد یا مجدداً وصل شد
socket.on("connect", () => {
  console.log("Connected with socket ID:", socket.id);
  if (playerId) {
    socket.emit("reconnect-player", { playerId });
  }
});

// برای بازیابی اتاق‌ها یا UI بعد از reconnect:
socket.on("player:rooms", (roomIds) => {
  console.log("Player is in rooms:", roomIds);
  // می‌تونی با این لیست UI رو مجدداً رندر کنی
});

// // src/network/socket.js
// // import { io } from "socket.io-client";

// // export const socket = io("http://localhost:3001", {
// //   withCredentials: true,
// // });
// import { io } from "socket.io-client";

// let socket;

// if (!socket) {
//   socket = io("http://localhost:3001", {
//     withCredentials: true,
//     autoConnect: true, // default: true
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//   });
// }

// export { socket };

// // let socket;

// // export function initSocketConnection() {
// //   socket = new WebSocket("ws://localhost:3000");
// //   socket.onmessage = (event) => {
// //     const message = JSON.parse(event.data);
// //     // مثلاً فاز جدید یا رأی‌گیری
// //   };
// // }

// // export function sendMessage(data) {
// //   if (socket?.readyState === WebSocket.OPEN) {
// //     socket.send(JSON.stringify(data));
// //   }
// // }
