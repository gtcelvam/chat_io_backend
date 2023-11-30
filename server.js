// index.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Keep track of connected users
const users = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  // Listen for username
  socket.on("setUsername", (username) => {
    // Store the username with the corresponding socket ID
    users[username] = socket.id;
  });

  // Listen for private chat messages
  socket.on("private message", ({ recipient, message }) => {
    const recipientSocketId = users[recipient];

    // Send the private message only to the intended recipient
    io.to(recipientSocketId).emit("private message", {
      sender: socket.id,
      message,
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
