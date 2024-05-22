const MCQ = require("../models/mcqmodel");

const addMCQ = async (req, res) => {
  try {
    let imageName = null;
    let imageTwoName = null;
    let videoName = null;

    if (req.files) {
      const files = req.files;
      if (files.image) {
        imageName = files.image[0].filename;
      }
      if (files.imageTwo) { 
        imageTwoName = files.imageTwo[0].filename;
      }
      if (files.video) {
        videoName = files.video[0].filename;
      }
    }

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
      image: imageName, // Set image property
      imageTwo: imageTwoName, // Set imageTwo property
      video: videoName,
    });

    await mcq.save();

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
