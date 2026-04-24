import express from "express";
import reviewRouter from "./reviewsRoutes.js";
import {
  aliasTopItems,
  createItem,
  deleteItem,
  getAllItems,
  getItem,
  purchaseItems,
  updateItem,
} from "../controllers/itemsController.js";
import { protect, restrictTo } from "../controllers/authController.js";
import upload from "../utils/config/cloudinary.js";

const router = express.Router();
router.route("/top-5-cheap").get(aliasTopItems, getAllItems);
router.route("/purchase").post(protect, restrictTo("admin"), purchaseItems);
router
  .route("/:id")
  .get(getItem)
  .delete(protect, restrictTo("admin"), deleteItem)
  .patch(
    protect,
    restrictTo("admin", "employee"),
    upload.array("images"),
    updateItem,
  );
router
  .route("/")
  .get(getAllItems)
  .post(
    protect,
    restrictTo("admin", "employee"),
    upload.array("images"),
    createItem,
  );

router.use("/:itemId/reviews", reviewRouter);

export default router;
