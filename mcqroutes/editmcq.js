const MCQ = require("../models/mcqSchema");

const editMCQ = async (req, res) => {
  const { mcqId } = req.params;
  try {
    const mcqToUpdate = await MCQ.findById(mcqId);

    if (!mcqToUpdate) {
      return res.status(404).json({
        error: true,
        message: "MCQ Not Found.",
      });
    }
    const {
      usmleStep,
      USMLE,
      question,
      optionOne,
      optionTwo,
      optionThree,
      optionFour,
      correctAnswer,
      questionExplanation,
      optionOneExplanation,
      optionTwoExplanation,
      optionThreeExplanation,
      optionFourExplanation,
    } = req.body;
    mcqToUpdate.usmleStep = usmleStep;
    mcqToUpdate.USMLE = USMLE;
    mcqToUpdate.question = question;
    mcqToUpdate.optionOne = optionOne;
    mcqToUpdate.optionTwo = optionTwo;
    mcqToUpdate.optionThree = optionThree;
    mcqToUpdate.optionFour = optionFour;
    mcqToUpdate.correctAnswer = correctAnswer;
    mcqToUpdate.questionExplanation = questionExplanation;
    mcqToUpdate.optionOneExplanation = optionOneExplanation;
    mcqToUpdate.optionTwoExplanation = optionTwoExplanation;
    mcqToUpdate.optionThreeExplanation = optionThreeExplanation;
    mcqToUpdate.optionFourExplanation = optionFourExplanation;
    if (req.file) {
      mcqToUpdate.image = req.file.filename;
    }
    const updatedMCQ = await mcqToUpdate.save();
    res.status(200).json({
      status: "success",
      success: true,
      message: "MCQ updated successfully",
      data: updatedMCQ,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  editMCQ,
};
