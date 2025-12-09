import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // Expect token in headers: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1]; // take only <token>
    // verify token with your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach only user ID to request (controllers expect string ID)
    req.user = decoded.id; 

    next(); // move to next middleware/controller
  } catch (err) {
    console.error("AuthMiddleware Error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
