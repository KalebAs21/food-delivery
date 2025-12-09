import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to Local MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop the app if DB fails
  }
};
