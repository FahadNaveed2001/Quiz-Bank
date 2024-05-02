const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Index");

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password, repeatPassword } = req.body;

  try {
    if (password !== repeatPassword) {
      return res.status(400).json({ Status: "Passwords do not match" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ Status: "Error with token" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        return res.status(200).json({ Status: "Passwords reseted" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Status: "Error" });
  }
};

module.exports = { resetPassword };s
