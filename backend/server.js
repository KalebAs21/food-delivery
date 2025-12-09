import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import path from "path";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import mongoose from "mongoose";
import Order from "./models/orderModel.js"; 


// import  "dotenv/config"

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// ✅ serve static uploads folder (so frontend can fetch images)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// db connection
connectDb();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
//app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
  res.send("API Working 🚀");
});
app.get("/debug-orders", async (req, res) => {
  try {
    const count = await mongoose.connection.db.collection("orders").countDocuments();
    const modelCount = await Order.countDocuments();
    res.json({
      connected: mongoose.connection.readyState,
      dbName: mongoose.connection.name,
      collectionCount: count,
      modelCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
