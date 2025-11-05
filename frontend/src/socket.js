import { io } from "socket.io-client";

// Connect to backend server
const socket = io(
  process.env.REACT_APP_SOCKET_URL ||
    "https://ambulancemanagement-u67j.onrender.com",
  {
    transports: ["websocket"],
    auth: {
      token: localStorage.getItem("token"), // your JWT token (already stored when login)
    },
  }
);

export default socket;
