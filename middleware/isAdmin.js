const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function isAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("DECODED",decoded);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Not an admin" });
    }

    req.admin = decoded; // token data ko req mein daal diya future use ke liye
    next(); // agle middleware/controller pe jao
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
