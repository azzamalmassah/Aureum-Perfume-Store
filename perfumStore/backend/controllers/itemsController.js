import Item from "../models/itemsModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  getOne,
  updateOne,
  deleteOne,
  createOne,
  getAll,
} from "./handlerFactory.js";
export const aliasTopItems = (req, res, next) => {
  res.locals.aliasQuery = {
    ...req.query,
    limit: "5",
    sort: "price",
    fields: "name,price,rating",
  };

  next();
};

export const getAllItems = getAll(Item);

export const createItem = createOne(Item);

export const deleteItem = deleteOne(Item);
export const updateItem = updateOne(Item);

export const getItem = getOne(Item, { path: "reviews" });

export const purchaseItems = catchAsync(async (req, res, next) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (items.length === 0) {
    return next(new AppError("items are required", 400));
  }

  const results = [];

  for (const it of items) {
    const id = it.id || it._id;
    const qty = Number(it.quantity || 0);
    if (!id || !Number.isFinite(qty) || qty <= 0) continue;

    const updated = await Item.findOneAndUpdate(
      { _id: id, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true },
    );

    if (!updated) {
      return next(new AppError("One or more items are out of stock", 409));
    }
    results.push({ id: String(updated._id), stock: updated.stock });
  }

  return res.status(200).json({
    success: true,
    data: { items: results },
  });
});
