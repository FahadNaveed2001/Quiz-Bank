const jwt = require("jsonwebtoken");

const forgotPassword = async (User, jwt, nodemailer, req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: "Email Not Found." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_PASS,
      },
    });

    const mailOptions = {
      from: `"ZAP-70" <${process.env.TRANSPORTER_EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2 style="color: #333;">Reset Your Password</h2>
                  <p style="font-size: 16px;">Hello!</p>
                  <p style="font-size: 16px;">You recently requested to reset your password. Click the button below to reset it:</p>
                  <a href="https://zap70.com/forget-password/${user._id}/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
                  <p style="font-size: 14px; color: #777;">If you didn't request this, you can safely ignore this email.</p>
                  <p style="font-size: 14px; color: #777;">Thank you,<br/>From ZAP-70</p>
              </div>
          `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: true, message: "Error Sending Mail" });
      } else {
        return res.status(200).json({
          status: "success",
          success: true,
          message:
            "Email Sent. Please check your inbox for further instructions.",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Error Sending Mail",
      errorMessage: error.message,
    });
  }
};

module.exports = { forgotPassword };
