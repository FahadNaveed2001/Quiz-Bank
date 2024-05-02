const getUsers = async (User, req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json({
        status: "success",
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
      console.log("Users retrieved successfully");
      console.log(users);
    } catch (error) {
      res.status(500).json({ error: true, message: "Error Retrieving Users", errorMessage: error.message });
      console.log("Error Retrieving Users");
      console.error(error);
    }
  };
  
  module.exports = { getUsers };
  