const MCQ = require("../models/mcqmodel");

async function deleteMCQ(req, res) {
  try {
    const { mcqId } = req.params;
    const deletedMCQ = await MCQ.findByIdAndDelete(mcqId);
    if (!deletedMCQ) {
      return res.status(404).json({
        error: true,
        message: "MCQ Not Found.",
      });
    }
    res
      .status(200)
      .json({ success: true, message: "MCQ Deleted Successfully" });
    console.log("MCQ deleted successfully");
  } catch (error) {
    res.status(500).json({ error: true, message: "Error Deleting MCQ" });
    console.log("Error Deleting MCQ");
    console.error(error);
  }
}

module.exports = { deleteMCQ };
