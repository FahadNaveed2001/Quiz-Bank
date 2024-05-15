const MCQ = require("../models/mcqmodel");

const addMCQ = async (req, res) => {
  try {
    let imageName = null;
    let videoName = null;

    // Check if image or video file is present in the request
    if (req.files) {
      const files = req.files;
      if (files.image) {
        imageName = files.image[0].filename;
      }
      if (files.video) {
        videoName = files.video[0].filename;
      }
    }

    // Destructure required fields from request body
    const {
      usmleStep,
      USMLE,
      question,
      optionOne,
      optionTwo,
      optionThree,
      optionFour,
      optionFive,
      optionSix,
      correctAnswer,
      questionExplanation,
      optionOneExplanation,
      optionTwoExplanation,
      optionThreeExplanation,
      optionFourExplanation,
      optionFiveExplanation,
      optionSixExplanation,
    } = req.body;

    // Create a new MCQ instance with the provided data
    const mcq = new MCQ({
      usmleStep,
      USMLE,
      question,
      optionOne,
      optionTwo,
      optionThree,
      optionFour,
      optionFive,
      optionSix,
      correctAnswer,
      questionExplanation,
      optionOneExplanation,
      optionTwoExplanation,
      optionThreeExplanation,
      optionFourExplanation,
      optionFiveExplanation,
      optionSixExplanation,
      image: imageName,
      video: videoName,
    });

    // Save the MCQ to the database
    await mcq.save();

    // Send success response with the saved MCQ data
    res.status(201).json({
      status: "success",
      success: true,
      message: "MCQ added successfully",
      data: mcq,
    });
    console.log("MCQ added successfully:", mcq);
  } catch (error) {
    console.error("Error adding MCQ:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error while adding MCQ.",
      errorMessage: error.message,
    });
  }
};

module.exports = {
  addMCQ,
};
