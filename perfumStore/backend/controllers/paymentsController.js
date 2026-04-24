import Stripe from "stripe";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

function getRequestOrigin(req) {
  const origin = req.get("origin");
  if (origin && typeof origin === "string") return origin;
  const fallback =
    (process.env.FRONTEND_URL || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0] || "http://localhost:3000";
  return fallback;
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((it) => {
      if (!it) return null;
      const name = String(it.name || "Item");
      const quantity = Math.max(1, Number(it.quantity || 1));
      const price = Number(it.price || 0);
      const image = Array.isArray(it.images) ? it.images[0] : it.image;
      return {
        name,
        quantity,
        price,
        image: typeof image === "string" ? image : undefined,
      };
    })
    .filter(Boolean);
}

const createStripeSession = async ({ items, successUrl, cancelUrl }) => {
  const key =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY_TEST ||
    process.env.STRIPE_TEST_SECRET_KEY;
  if (!key) {
    throw new AppError(
      "Stripe is not configured. Set STRIPE_SECRET_KEY (or STRIPE_SECRET_KEY_TEST) in backend env",
      501,
    );
  }

  const stripe = new Stripe(key);

  const line_items = items.map((it) => ({
    quantity: it.quantity,
    price_data: {
      currency: process.env.CURRENCY || "usd",
      unit_amount: Math.round(it.price * 100),
      product_data: {
        name: it.name,
        images: it.image ? [it.image] : undefined,
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return { redirectUrl: session.url };
};

export const createPaymentSession = catchAsync(async (req, res, next) => {
  const provider = String(req.body?.provider || "").toLowerCase();
  const items = normalizeItems(req.body?.items);

  if (!provider) return next(new AppError("provider is required", 400));
  if (items.length === 0) return next(new AppError("items are required", 400));

  const origin = getRequestOrigin(req);
  const successUrl = req.body?.successUrl || `${origin}/checkout?success=1`;
  const cancelUrl = req.body?.cancelUrl || `${origin}/checkout?cancel=1`;

  let result;
  if (provider === "card" || provider === "stripe") {
    result = await createStripeSession({ items, successUrl, cancelUrl });
  } else {
    return next(new AppError(`Unsupported payment provider: ${provider}`, 400));
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
});
