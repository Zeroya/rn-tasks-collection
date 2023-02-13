import express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import userRoutes from "./routes/users.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:19000", "http://192.168.0.105:19000/auth/login"] },
});
// const server = http.Server(app);
// const io = socketIo(server);

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];
let callInfo = { callName: "", checker: false };

io.on("connection", (socket) => {
  console.log("Connection established");
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("createRoom", (roomName) => {
    socket.join(roomName);
    chatRooms.unshift({ id: generateID(), name: roomName, messages: [] });
    socket.emit("roomsList", chatRooms);
  });

  socket.on("callUserInfo", (info) => {
    callInfo.callName = info.callName;
    callInfo.checker = info.checker;
    socket.broadcast.emit("getUserInfo", callInfo);
  });

  // socket.broadcast.emit("getUserInfo", callInfo);

  socket.on("findRoom", (id) => {
    let result = chatRooms.filter((room) => room.id == id);
    socket.emit("foundRoom", result[0].messages);
  });

  socket.on("newMessage", (data) => {
    const { room_id, message, user, timestamp } = data;
    let result = chatRooms.filter((room) => room.id == room_id);
    const newMessage = {
      id: generateID(),
      text: message,
      user,
      time: `${timestamp.hour}:${timestamp.mins}`,
    };
    socket.to(result[0].name).emit("roomMessage", newMessage);
    result[0].messages.push(newMessage);

    socket.emit("roomsList", chatRooms);
    socket.emit("foundRoom", result[0].messages);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

const PORT = process.env.PORT || 3003;

// const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));
// }

app.get("/api", (req, res) => {
  res.json(chatRooms);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ["http://localhost:19000", "http://192.168.0.105:19000/auth/login"] }));
app.use("/auth", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`all right ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
