import fs from "fs";
import ITEMS from "../../models/itemsModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config({ path: "./config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const data = JSON.parse(
  fs.readFileSync(`${__dirname}/items-simple.json`, "utf-8")
);

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database is connected");
    });
    await mongoose.connect(`${process.env.DB_STRING}`);
  } catch (error) {
    console.log(error);
  }
};
connectDB();

const importData = async () => {
  try {
    await ITEMS.create(data);
    console.log("data successfully loaded");
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await ITEMS.deleteMany();
    console.log("data deleted successfully");
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
