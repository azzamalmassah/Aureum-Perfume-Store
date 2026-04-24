import Order from "../models/orderModel.js";
import ITEMS from "../models/itemsModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const createOrder = catchAsync(async (req, res, next) => {
  const { items, paymentMethod, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError("No order items provided", 400));
  }

  if (!paymentMethod) {
    return next(new AppError("Payment method is required", 400));
  }

  if (!shippingAddress) {
    return next(new AppError("Shipping address is required", 400));
  }

  const { normalizedItems, totalPrice } = await calculateOrderPrice(items);

  const order = await Order.create({
    user: req.user._id,
    items: normalizedItems,
    totalPrice,
    paymentMethod,
    shippingAddress,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    data: {
      order,
    },
  });
});

export const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");

  res.status(200).json({
    success: true,
    results: orders.length,
    data: {
      orders,
    },
  });
});

export const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (
    (order.user._id || order.user).toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You are not authorized to view this order", 403));
  }

  res.status(200).json({
    success: true,
    data: {
      order,
    },
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    results: orders.length,
    data: {
      orders,
    },
  });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = Order.schema.path("status").enumValues;

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Invalid status value", 400));
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    data: {
      order,
    },
  });
});

/**
 * Admin: Delete Order
 */
export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(204).json({
    success: true,
    data: null,
  });
});

export const calculateOrderPrice = async (items) => {
  let total = 0;
  const normalizedItems = [];

  for (const orderItem of items) {
    if (!orderItem.item) {
      throw new AppError("Each order item must include an item id", 400);
    }

    const dbItem = await ITEMS.findById(orderItem.item);

    if (!dbItem) {
      throw new AppError(`Item not found: ${orderItem.item}`, 404);
    }

    if (!orderItem.quantity || orderItem.quantity < 1) {
      throw new AppError(`Invalid quantity for ${dbItem.name}`, 400);
    }

    if (orderItem.quantity > dbItem.stock) {
      throw new AppError(`Not enough stock for ${dbItem.name}`, 400);
    }

    total += dbItem.price * orderItem.quantity;
    normalizedItems.push({
      item: dbItem._id,
      quantity: orderItem.quantity,
      price: dbItem.price,
    });
  }

  return { normalizedItems, totalPrice: total };
};
