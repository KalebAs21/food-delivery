
import userModel from "../models/userModel.js";


//add cart 
const addToCart = async (req, res) => {
  try {
    const userId = req.user; // string ID
    const { itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Make a shallow copy of cartData to trigger Mongoose change detection
    const cart = { ...(user.cartData || {}) };
    cart[itemId] = (cart[itemId] || 0) + 1;

    user.cartData = cart; // reassign
    await user.save(); // ✅ persist to DB

    res.json({ success: true, message: "Item added to cart", cart });
  } catch (err) {
    console.error("AddToCart Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user; // string ID
    const { itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = { ...(user.cartData || {}) };
    if (cart[itemId]) {
      cart[itemId] -= 1;
      if (cart[itemId] <= 0) delete cart[itemId];
    }

    user.cartData = cart;
    await user.save();

    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (err) {
    console.error("RemoveFromCart Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


// Fetch user cart
const getCart = async (req, res) => {
  try {
    const userId = req.user; // string ID

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, cart: user.cartData });
  } catch (err) {
    console.error("GetCart Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


export { addToCart, removeFromCart, getCart };
