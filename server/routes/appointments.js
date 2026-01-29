import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createAppointment, getUserAppointments } from "../controllers/appointments.js";
import { checkAppointment } from "../controllers/appointments.js";
const router = express.Router();

router.post('/create', verifyToken, createAppointment);
router.get("/:userId/appointments", verifyToken, getUserAppointments)
router.post('/check', verifyToken, checkAppointment )

export default router;