const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  console.log(req.headers);
  const token = req.header("Authorization");
  if (!token)
    return res.status(500).json({ error: true, message: "Not Allowed" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res
      .status(400)
      .json({
        error: true,
        message: "Invalid Token",
        errorMessage: error.message,
      });
  }
};

const routesWithoutToken = [
  "/forget-password",
  "/user-login",
  "/verify-email",
  "/user-signup",
  "/reset-password/:id/:token",
  "/attempted-questions",
];

module.exports = { verifyToken, routesWithoutToken };
