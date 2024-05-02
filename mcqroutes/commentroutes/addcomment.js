const MCQ = require("../../models/mcqmodel");

const addCommentToMCQ = async (req, res) => {
  const { mcqId } = req.params;
  const { commentText } = req.body;
  try {
    const mcq = await MCQ.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({ error: true, message: "MCQ Not Found" });

    }
    mcq.comments.push({ commentText });
    await mcq.save();
    res.status(201).json({
      status: "success",
      success: true,
      message: "Comment added successfully",
      data: mcq,
    });
    console.log("Comment added successfully");
    console.log(mcq);
  } catch (error) {
    res.status(500).json({ error: true, message: "Error Adding Comment", errorMessage: error.message });
    console.log("Error Adding Comment");
    console.error(error);
  }
};

module.exports = {
  addCommentToMCQ,
};
