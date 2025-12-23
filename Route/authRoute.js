import express from "express";
import authController, { login, register } from "../Controller/authController.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;