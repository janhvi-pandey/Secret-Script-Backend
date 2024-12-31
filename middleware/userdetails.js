const jwt = require("jsonwebtoken");

const userdetails = (req, res, next) => {
  const token = req.header("token");
  // console.log("Middleware invoked. Token received:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log("Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = userdetails;
