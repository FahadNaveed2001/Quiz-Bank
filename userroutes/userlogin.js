const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userLogin = async (User, predefinedAdmin, req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === predefinedAdmin.email &&
      password === predefinedAdmin.password
    ) {
      const token = jwt.sign(
        { email: predefinedAdmin.email, role: "admin" },
        process.env.JWT_SECRET_KEY
      );
      res.json({ token, success: true, message: "Login successful as admin", userId: null });
      console.log("Admin login done !!");
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User with the provided email does not exist." });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
          error: true,
          message: "Email not verified. Please verify your email to login."
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ email: user.email, role: "user" }, process.env.JWT_SECRET_KEY);
      res.status(200).json({
        token,
        success: true,
        message: "Login successful as user",
        userId: user._id,
      });
      console.log("User login done !!");
    } else {
      res.status(401).json({
        error: true,
        message: "The provided password is incorrect."
      });
    }
  } catch (error) {
    res.status(500).json({ error: true, error: error.message, message: "Error Logging In User." });
    console.log("Error Logging In User");
    console.error(error);
  }
};

module.exports = { userLogin };
