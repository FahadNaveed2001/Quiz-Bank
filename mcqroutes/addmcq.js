const MCQ = require("../models/mcqmodel");

const addMCQ = async (req, res) => {
  try {
    let imageName = null; 
    if (req.file) {
      imageName = req.file.filename;
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
      image: imageName,
    });

    await mcq.save();
    res.status(201).json({
      status: "success",
      success: true,
      message: "MCQ added successfully",
      data: mcq,
    });
    console.log(mcq)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error while adding MCQ.", errorMessage: error.message });
  }  
};

module.exports = {
  addMCQ,
};
