import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  getAllReviews,
  createReview,
  setItemUserIds,
  getReview,
  deleteReview,
  updateReview,
} from "../controllers/reviewsController.js";
const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setItemUserIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .delete(restrictTo("admin"), deleteReview)
  .patch(restrictTo("admin"), updateReview);
export default router;
