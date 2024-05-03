const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.TRANSPORTER_USER,
      pass: process.env.TRANSPORTER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.TRANSPORTER_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Hello,</h2>
        <p style="font-size: 16px;">Welcome to Quiz Bank! Please verify your email address by clicking the following button:</p>
        <a href="http://165.232.134.133:3000/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Email</a>
        <p style="font-size: 14px; color: #777;">If you didn't create an account with Quiz Bank, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #777;">Thanks,<br/>From Team Quiz Bank</p>
    </div>
`,
  };
  await transporter.sendMail(mailOptions);
  console.log("Verification email sent");
};

const generateVerificationToken = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const userSignup = async (User, req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ error: true, errors: errors.array() });
      }

      const { firstName, lastName, email, password } = req.body;
      let existingUser = await User.findOne({ email });

      if (existingUser) {
          if (!existingUser.isEmailVerified) {
              return res.status(400).json({ error: true, message: "Email not verified. Please check your email for verification instructions." });
          }
          return res.status(400).json({ error: true, message: "User with this email already exists." });
      }

      const verificationToken = generateVerificationToken();
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          verificationToken,
          lastVerificationEmailSent: new Date()
      });
      await user.save();
      await sendVerificationEmail(email, verificationToken);
      return res.status(200).json({ success: true, message: "User created successfully. Check your email for verification." });

  } catch (error) {
      console.log("Error Creating User:", error);
      return res.status(500).json({ error: true, message: "Internal server error" });
  }
};



module.exports = { userSignup };


