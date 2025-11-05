import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    this.socket = io(
      process.env.REACT_APP_SOCKET_URL ||
        "https://ambulancemanagement-u67j.onrender.com",
      {
        auth: {
          token: token,
        },
      }
    );

    return new Promise((resolve, reject) => {
      this.socket.on("connect", () => {
        console.log("Connected to server");
        resolve(this.socket);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        reject(error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();
