const MCQ = require("../models/mcqmodel");

const deleteMCQImage = async (req, res) => {
  try {
    const mcqId = req.params.id;

    const mcq = await MCQ.findById(mcqId);

    if (!mcq) {
      return res.status(404).json({ error: true, message: "MCQ not found." });
    }

    if (!mcq.image) {
      return res.status(400).json({ error: true, message: "MCQ does not have an image." });
    }

    deleteImageFunction(mcq.image);

    mcq.image = null;
    await mcq.save();

    res.status(200).json({
      status: "success",
      success: true,
      message: "Image deleted successfully from MCQ.",
      data: mcq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error while deleting image from MCQ.", errorMessage: error.message });
  }
};

module.exports = {
  deleteMCQImage,
};
