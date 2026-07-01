import express from "express";
import { login, register } from "../controllers/auth.js";
import { verifyEmail } from "../controllers/auth.js";
import { resendVerificationEmail } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

export default router;
