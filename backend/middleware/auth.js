const jwt = require("jsonwebtoken");
const JWT_SECRET = "CacheLabs112323";
exports.auth = (req, res, next) => {
  const authHeader = req.headers["token"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) {
      return res.status(401).json({ message: "not token found" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid user" });
      }
      req.user = user;
      // console.log("user", user);
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
