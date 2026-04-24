import mongoose from "mongoose";
import Item from "./itemsModel.js";
const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, "please write your review"] },
    rating: {
      type: Number,
      default: 4.5,
      required: [true, "please write your rating"],
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
    item: {
      type: mongoose.Schema.ObjectId,
      ref: "ITEMS",
      required: [true, "review must belong to an item"],
    },
  },
  { timestamps: true },
);
reviewSchema.index({ item: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  }).populate({
    path: "item",
    select: "name brand",
  });
  next();
});

reviewSchema.statics.calcRating = async function (itemId) {
  const stats = await this.aggregate([
    {
      $match: { item: itemId },
    },
    {
      $group: {
        _id: "$item",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: stats[0].nRating,
      rating: stats[0].avgRating,
    });
  } else {
    await Item.findByIdAndUpdate(Item, {
      ratingsQuantity: 0,
      rating: 4.5,
    });
  }
};
reviewSchema.post("save", function () {
  this.constructor.calcRating(this.item);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();

  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcRating(this.r.item);
});
const Reviews = mongoose.model("Reviews", reviewSchema);

export default Reviews;
