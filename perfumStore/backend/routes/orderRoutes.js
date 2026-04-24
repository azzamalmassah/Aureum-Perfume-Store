import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

/**
 *  User Routes
 */

// Create a new order
router.post("/", createOrder);

// Get logged-in user's orders
router.get("/my-orders", getMyOrders);

// Get specific order
router.get("/:id", getOrderById);

/**
 *  Admin Routes
 */

router.get("/", restrictTo("admin"), getAllOrders);

router.patch("/:id/status", restrictTo("admin"), updateOrderStatus);

router.delete("/:id", restrictTo("admin"), deleteOrder);

export default router;
