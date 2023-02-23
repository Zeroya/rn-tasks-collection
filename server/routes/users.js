import express from "express";
import { authLogin, authRegister, getAllRegisteredUsers } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", authLogin);

router.post("/register", authRegister);

router.get("/allUsers", getAllRegisteredUsers);

export default router;
