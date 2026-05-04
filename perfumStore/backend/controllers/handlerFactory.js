import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { ApiFeatures } from "../utils/apiFeatuers.js";
import { v2 as cloudinary } from "cloudinary";

// Helper to extract public_id from Cloudinary URL

export const getPublicId = (url) => {
  if (typeof url !== "string" || !url.includes("/upload/")) return null;

  const parts = url.split("/upload/");
  if (!parts[1]) return null;
  const pathParts = parts[1].split("/");
  const pathWithoutVersion = pathParts.slice(1).join("/");

  return pathWithoutVersion ? pathWithoutVersion.split(".")[0] : null;
};

const getCloudinaryDestroyPromises = (images = []) => {
  return images
    .map((imgUrl) => getPublicId(imgUrl))
    .filter(Boolean)
    .map((publicId) => cloudinary.uploader.destroy(publicId));
};
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError("No Document found with this ID", 404));
    }
    if (doc.images && doc.images.length > 0) {
      const deletePromises = getCloudinaryDestroyPromises(doc.images);
      await Promise.all(deletePromises);
    }
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
      success: true,
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.files && req.files.length > 0) {
      const oldDoc = await Model.findById(req.params.id);

      if (oldDoc && oldDoc.images && oldDoc.images.length > 0) {
        const deletePromises = getCloudinaryDestroyPromises(oldDoc.images);
        await Promise.all(deletePromises);
      }

      req.body.images = req.files.map((file) => file.path);
    } else if (req.file) {
      req.body.images = [req.file.path];
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No  Document found with this ID", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => file.path);
    } else if (req.file) {
      req.body.images = [req.file.path];
    }
    const doc = await Model.create(req.body);
    res.status(201).json({
      success: true,
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new AppError("No item found with this ID", 404));
    }
    res.status(200).json({
      success: true,
      data: {
        doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.itemId) filter = { item: req.params.itemId };
    const defaults = res.locals.aliasQuery || {};
    const effectiveQuery = { ...defaults, ...(req.query || {}) };
    //EXECUTE QUERY
    const features = new ApiFeatures(Model.find(), effectiveQuery)
      .filter()
      .sorting()
      .limiting()
      .paginate();
    const doc = await features.query;
    res.status(200).json({
      success: true,
      length: doc.length,
      data: {
        data: doc,
      },
    });
  });
