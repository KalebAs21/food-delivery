// orderRoute.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, userOrders, verifyOrder, listOrders, updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router(); // ✅ fixed

// POST /api/order/place
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/userorders", authMiddleware, userOrders)
orderRouter.get("/list", listOrders) // This should be protected and return all orders for admin 
orderRouter.post("/update", updateOrderStatus);




export default orderRouter;
