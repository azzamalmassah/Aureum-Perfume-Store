import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config({ path: "./config.env", override: true });
// Also load `.env` if present (common for local sandbox keys).
dotenv.config({ override: true });

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database is connected");
    });
    await mongoose.connect(`${process.env.DB_STRING}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();

const port = Number(process.env.PORT) || 5000;
const server = app.listen(port, () => {
  console.log(`server is up an running on port ${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("shutting down!");
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("shutting down!");
  server.close(() => {
    process.exit(1);
  });
});
