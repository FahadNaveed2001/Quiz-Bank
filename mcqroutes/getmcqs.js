
const MCQ = require("../models/mcqmodel");



const getMCQs = async (req, res) => {
    try {
      const { usmleStep } = req.query;
      let filter = {};
      if (usmleStep) {
        filter.usmleStep = usmleStep;
      }
      const mcqs = await MCQ.find(filter);
      res.status(201).json({
        status: "success",
        success: true,
        message: "MCQs retrieved successfully",
        data: mcqs,
      });
      console.log("MCQs retrieved successfully");
      console.log(mcqs);
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Error While Loading MCQs",
      });
      console.log("Error While Loading MCQs");
      console.error(error);
    }
  };
  
  module.exports = {
    getMCQs,
  };