const MCQ = require("../../models/mcqmodel");


const getMCQById = async (req, res) => {
    const { mcqId } = req.params;
    try {
      const mcq = await MCQ.findById(mcqId);
      if (!mcq) {
        return res.status(500).json({ error: true, message: "MCQ Not Found."});

      }
      res.status(201).json({
        status: "success",
        success: true,
        message: "MCQ retrieved successfully",
        data: mcq,
      });
      console.log("MCQ retrieved successfully");
      console.log(mcq);
    } catch (error) {
      res.status(500).json({ error: true, message: "Error retrieving MCQ", errorMessage: error.message });
      console.log("Error retrieving MCQ");
      console.error(error);
    }
  };
  
  module.exports = {
    getMCQById,
  };