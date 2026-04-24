import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ITEMS",
    required: [true, "Order item must reference an item"],
  },
  quantity: {
    type: Number,
    required: [true, "Order item must have a quantity"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Order item must have a price"],
    min: [0, "Price cannot be negative"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (val) => val.length > 0,
        message: "Order must contain at least one item",
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Order must have a total price"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "wallet"],
      required: [true, "Order must have a payment method"],
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, "Shipping address must have a street"],
      },
      city: {
        type: String,
        required: [true, "Shipping address must have a city"],
      },
      state: { type: String },
      zipCode: {
        type: String,
        required: [true, "Shipping address must have a zip code"],
      },
      country: {
        type: String,
        required: [true, "Shipping address must have a country"],
      },
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for common queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Auto-calculate totalPrice before saving
orderSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.totalPrice = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }
  next();
});

// Set timestamps on status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "delivered") this.deliveredAt = Date.now();
    if (this.status === "cancelled") this.cancelledAt = Date.now();
  }
  next();
});

// Populate user and items on find queries
orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email photo" }).populate({
    path: "items.item",
    select: "name brand price images",
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
