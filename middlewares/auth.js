const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login first",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.json({
        success: false,
        message: `Role: ${req.user.role} is not allowed to access this resource`,
      });
    }
    next();
  };
};

module.exports = { isAuthenticated, authorizeRoles };
