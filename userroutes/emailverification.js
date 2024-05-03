const verifyEmail = async (User, req, res) => {
    const { token } = req.query;
  
    try {
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(404).json({ error: true, message: "Invalid verification token"});
      }
      user.isEmailVerified = true;
      user.verificationToken = undefined;
      await user.save();
      const redirectURL = "http://165.232.134.133:3000/login?emailVerified=true";
      res.redirect(302, redirectURL);
      console.log("Email verified successfully");

    } catch (error) {
      res.status(500).json({ error: true, message: "Error Verifying Email", errorMessage: error.message });
      console.log("Error Verifying Email");
      console.error(error);
    }
  };
  
  module.exports = { verifyEmail };
  