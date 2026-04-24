import express from "express";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
  getMe,
} from "../controllers/usersController.js";
import {
  login,
  protect,
  signup,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";
import upload from "../utils/config/cloudinary.js";

const router = express.Router();
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);
//all routes from here must be protected
router.use(protect);
//route for loggedin users to update thier password
router.route("/updatePassword").patch(updatePassword);
router.get("/me", getMe, getUser);

router.route("/").get(restrictTo("admin"), getAllUsers).post(createUser);
router.route("/updateMe").patch(upload.single("photo"), updateMe);
router.route("/deleteMe").delete(deleteMe);

router
  .route("/:id")
  .get(restrictTo("admin"), getUser)
  .patch(restrictTo("admin"), updateUser)
  .delete(restrictTo("admin"), deleteUser);

export default router;
