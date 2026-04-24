import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import AppError from "../AppError.js";

dotenv.config({ path: "./config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderPath = "perfume_store/others";

    if (req.originalUrl.includes("users")) {
      folderPath = "perfume_store/users";
    } else if (req.originalUrl.includes("items")) {
      folderPath = "perfume_store/items";
    }

    return {
      folder: folderPath,
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [
        { width: 500, height: 500, crop: "limit", quality: "auto" },
      ],
    };
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image! Please upload only images.", 400), false);
    }
  },
});

export default upload;
