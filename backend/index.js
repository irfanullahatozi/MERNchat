import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(cors());
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileName);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("send-message", (data) => {
    socket.broadcast.emit("server-message", data);
  });
  socket.on("disconnect", () => {
    console.log("User left");
  });
});

const PORT = process.env.PORT;
console.log(process.env.PORT);
httpServer.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
