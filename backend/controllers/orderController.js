// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";


const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

// Example stripe init (put this at top-level of your module)
// import Stripe from "stripe";
// const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Example stripe init (put this at top-level of your module)
// import Stripe from "stripe";
// const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Put this in your order controller file. Ensure stripe is initialized at module top-level:
// import Stripe from "stripe";
// const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    console.log("DEBUG placeOrder called");
    console.log("DEBUG headers:", req.headers);
    console.log("DEBUG body:", req.body);
    console.log("DEBUG req.user:", req.user);

    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userId = typeof req.user === "string" ? req.user : (req.user.id || req.user._id);
    console.log("DEBUG userId:", userId);

    const { items, amount, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items are required" });
    }
    if (!address || typeof address !== "object") {
      return res.status(400).json({ success: false, message: "Address is required" });
    }
    if (typeof amount !== "number") {
      console.warn("placeOrder: amount not number, attempting to coerce:", amount);
    }

    // Verify user exists
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    console.log("DEBUG user found:", user.email || user._id);

    // Save order (use savedOrder for later reference)
    console.log("DEBUG: about to save new order...");
    const newOrder = new orderModel({ userId, items, amount, address });
    const savedOrder = await newOrder.save();
    console.log("✅ Order saved:", savedOrder._id);

    // Clear cart
    user.cartData = {};
    await user.save();
    console.log("DEBUG user cart cleared");

    // If Stripe not configured, return a local redirect (single return here)
    console.log("DEBUG stripe object:", typeof stripe !== "undefined" ? stripe : stripe);
    if (!stripe) {
      console.warn("placeOrder: STRIPE_SECRET_KEY missing — returning local redirect for debug");
      return res.json({
        success: true,
        session_url: `${frontend_url}/verify?success=true&orderId=${savedOrder._id}`,
        order: savedOrder
      });
    }

    // Build Stripe line_items with validation
    const line_items = items.map((item) => {
      const price = Number(item.price);
      const qty = Number(item.quantity || 1);
      console.log("DEBUG item price, qty:", price, qty);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error("Invalid item price for item: " + JSON.stringify(item));
      }
      if (!Number.isInteger(qty) || qty <= 0) {
        throw new Error("Invalid item quantity for item: " + JSON.stringify(item));
      }

      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.name || "Item" },
          unit_amount: Math.round(price * 100),
        },
        quantity: qty,
      };
    });

    // Add delivery fee
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round(2 * 100),
      },
      quantity: 1,
    });

    // Create Stripe session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${savedOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${savedOrder._id}`,
      });
      console.log("DEBUG stripe session created:", session && session.url);
    } catch (e) {
      console.error("Stripe session creation error:", e);
      return res.status(502).json({
        success: false,
        message: "Payment provider error",
        stripeError: e.message,
        order: savedOrder
      });
    }

    // Return session URL (single response)
    return res.json({ success: true, session_url: session.url, order: savedOrder });
  } catch (err) {
    console.error("PlaceOrder Error (full):", err && err.stack ? err.stack : err);
    return res.status(500).json({
      success: false,
      message: "Server error while placing order",
      error: err.message,
    });
  }
};


const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body; // use query, not body

  try {
    if (success === "true") {
      // update payment = true
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      // if payment failed or cancelled, delete order
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not paid" });
    }
  } catch (error) {
    console.error("VerifyOrder Error:", error);
    res.status(500).json({ success: false, message: "Server error while verifying order" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    // user id comes from authMiddleware
    const userId = req.user

    const orders = await orderModel.find({ userId });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};


// listing for admin panel


const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    console.log("DEBUG orders:", orders.length);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus  = async (req, res) =>{
  const { orderId, status } = req.body;
  try {
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.json({ success: false, message: "Error updating order" });
  }
}





export { placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus };
