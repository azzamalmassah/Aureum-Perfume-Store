import express from "express";
import itemsRouter from "./routes/itemsRoutes.js";
import userRouter from "./routes/userRoutes.js";
import reviewRouter from "./routes/reviewsRoutes.js";
import paymentsRouter from "./routes/paymentsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import path from "path";
import { fileURLToPath } from "url";
// import qs from "qs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl/postman) with no Origin header
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Dev-friendly: allow any localhost port
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin))
        return callback(null, true);

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.set("query parser", "extended");
app.use(mongoSanitize());
// app.set("query parser", (str) => qs.parse(str));
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many requests from this ip ,please try again later in  an hour",
});
app.use("/api", limiter);
app.use(express.static(`${__dirname}/public`));

app.use(hpp());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/orders", orderRoutes);

app.use((req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);
export default app;
