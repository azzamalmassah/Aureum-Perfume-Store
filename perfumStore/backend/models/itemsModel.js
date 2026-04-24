import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A perfume must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "a perfume name must be less or equal to 40 charecters"],
      minlength: [10, "a perfume name must be more or equal to 10 charecters"],
    },
    brand: {
      type: String,
      required: [true, "A perfume must have a brand"],
      trim: true,
      maxlength: [40, "a perfume Brand must be less or equal to 40 charecters"],
      minlength: [3, "a perfume Brand must be more or equal to 10 charecters"],
    },
    slug: { type: String, unique: true },
    gender: {
      type: String,
      required: [true, "perfume must have a gender"],
      enum: {
        values: ["unisex", "women", "men"],
        message: " gender can only be Men, Women or Unisex",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        100,
        "a perfume description must be less or equal to 40 charecters",
      ],
      minlength: [
        20,
        "a perfume description must be more or equal to 10 charecters",
      ],
    },
    price: {
      type: Number,
      required: [true, "A perfume must have a Price"],
    },
    sizes: {
      type: [String],
      required: [true, "A perfume must have a sizes"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "rating can not be less than 1"],
      max: [5, "rating can not be more than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 12,
      min: [0, "stock can not be less than 0"],
    },
    images: [String],
    components: [String],
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
itemsSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "item",
  localField: "_id",
});

itemsSchema.index({ price: 1, rating: -1 });
itemsSchema.index({ slug: 1 });
itemsSchema.index({ gender: 1 });
const ITEMS = mongoose.model("ITEMS", itemsSchema);

export default ITEMS;
