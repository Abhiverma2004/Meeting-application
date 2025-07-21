const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;
const rooms = {};

app.use(cors());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomID, username }) => {
    if (!rooms[roomID]) rooms[roomID] = [];

    rooms[roomID].push({ id: socket.id, username });
    socket.join(roomID);

    const usersInRoom = rooms[roomID].filter(u => u.id !== socket.id);
    socket.emit("all-users", usersInRoom);

    socket.to(roomID).emit("user-joined", {
      id: socket.id,
      username
    });
  });

  socket.on("sending-signal", (payload) => {
    io.to(payload.userToSignal).emit("user-signal", {
      signal: payload.signal,
      callerID: payload.callerID,
      username: payload.username
    });
  });

  socket.on("returning-signal", (payload) => {
    io.to(payload.callerID).emit("receiving-returned-signal", {
      signal: payload.signal,
      id: socket.id,
      username: payload.username
    });
  });

  socket.on("send-message", ({ sender, text }) => {
    for (const roomID in rooms) {
      if (rooms[roomID].some(user => user.id === socket.id)) {
        io.to(roomID).emit("receive-message", { sender, text });
        break;
      }
    }
  });

  socket.on("disconnect", () => {
    for (const roomID in rooms) {
      rooms[roomID] = rooms[roomID].filter(user => user.id !== socket.id);
      socket.to(roomID).emit("user-left", socket.id);
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
