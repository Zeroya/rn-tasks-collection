import express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import userRoutes from "./routes/users.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));
// }

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ["http://localhost:19000", "http://192.168.0.105:19000/auth/login"] }));
app.use("/auth", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`all right ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
