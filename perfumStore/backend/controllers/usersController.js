import User from "../models/usersModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  getOne,
  updateOne,
  deleteOne,
  getAll,
  getPublicId,
} from "./handlerFactory.js";
import { v2 as cloudinary } from "cloudinary";

const fliterObj = (obj = {}, ...allowedFields) => {
  const allowedData = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) allowedData[el] = obj[el];
  });
  return allowedData;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body && (req.body.password || req.body.passwordConfirm)) {
    return next(
      new AppError(
        "You can not use this route to update password please use /updateMyPassword",
        400,
      ),
    );
  }
  const filteredBody = fliterObj(req.body, "name", "email");

  if (req.file) {
    const currentUser = await User.findById(req.user.id);

    if (
      currentUser.photo &&
      currentUser.photo.startsWith("https://res.cloudinary.com")
    ) {
      await cloudinary.uploader.destroy(getPublicId(currentUser.photo));
    }

    filteredBody.photo = req.file.path;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (user.photo && user.photo.startsWith("https://res.cloudinary.com")) {
    try {
      const publicId = getPublicId(user.photo);
      console.log("Attempting to delete Cloudinary ID:", publicId);

      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary Result:", result);
    } catch (err) {
      console.log(
        "Cloudinary cleanup failed during account deactivation:",
        err.message,
      );
    }
  }
  await User.findByIdAndUpdate(user._id, { active: false, photo: null });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
export const createUser = catchAsync(async (req, res) => {
  res.status(500).json({
    success: false,
    message: "this route is not defined please use /signup instead",
  });
});

export const deleteUser = deleteOne(User);
export const getUser = getOne(User);
export const getAllUsers = getAll(User);

// Do NOT update passwords and role with this!
export const updateUser = updateOne(User);
