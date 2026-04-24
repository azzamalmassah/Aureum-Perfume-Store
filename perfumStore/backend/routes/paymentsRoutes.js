import express from "express";
import { createPaymentSession } from "../controllers/paymentsController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();
router.use(protect);
router.post("/session", createPaymentSession);

export default router;
