import Reviews from "../models/reviewModel.js";
import {
  getOne,
  updateOne,
  deleteOne,
  createOne,
  getAll,
} from "./handlerFactory.js";

export const setItemUserIds = (req, res, next) => {
  if (!req.body) req.body = {};
  if (!req.body.item) req.body.item = req.params.itemId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
export const getAllReviews = getAll(Reviews);

export const getReview = getOne(Reviews);
export const createReview = createOne(Reviews);
export const deleteReview = deleteOne(Reviews);
export const updateReview = updateOne(Reviews);
