// app.put("/update-users-test", async (req, res) => {
//   try {
//     const { userId, testId, updatedQuestions, obtainedScore, timeInSeconds, sectionInfo, testInfo } = req.body;
//         const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: true, message: "User not found." });
//     }
//         const attemptIndex = user.attemptedTests.findIndex(attempt => attempt.test.toString() === testId);
//     if (attemptIndex === -1) {
//       return res.status(404).json({ error: true, message: "Test attempt not found for the given user and test." });
//     }
//         if (user.attemptedTests[attemptIndex].testInfo === false) {
//       return res.status(403).json({ error: true, message: "this test cannot be edited." });
//     }
//         if (!updatedQuestions || !Array.isArray(updatedQuestions)) {
//       return res.status(400).json({ error: true, message: "Invalid or missing 'updatedQuestions' field in the request body." });
//     }
//     updatedQuestions.forEach(updatedQuestion => {
//       const { questionId, selectedOption } = updatedQuestion;
//       for (const section of user.attemptedTests[attemptIndex].sections) {
//         for (const question of section.questions) {
//           if (question._id.toString() === questionId) {
//             question.selectedOption = selectedOption;
//             break;
//           }
//         }
//       }
//     });
//     user.attemptedTests[attemptIndex].obtainedScore = obtainedScore;
//     user.attemptedTests[attemptIndex].timeInSeconds = timeInSeconds;
//     user.attemptedTests[attemptIndex].sectionInfo = sectionInfo;
//     user.attemptedTests[attemptIndex].testInfo = testInfo;
//     await user.save();

//     res.status(200).json({
//       status: "success",
//       success: true,
//       message: "Selected options and test info updated successfully.",
//       testAttempt: user.attemptedTests[attemptIndex],
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: true,
//       message: "Error updating selected options.",
//       errorMessage: error.message,
//     });
//   }
// });


// app.post("/attempt-test-for-user", async (req, res) => {
//   try {
//     const { userId, testId, testAttemptedAt, totalMarks, obtainedMarks } =
//       req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: true, message: "User not found." });
//     }

//     const test = await Test.findById(testId);
//     if (!test) {
//       return res.status(404).json({ error: true, message: "Test not found." });
//     }
//     let allowedMinutes;
//     if (test.usmleStep === "1") {
//       allowedMinutes = 420;
//     } else if (test.usmleStep === "2") {
//       allowedMinutes = 480;
//     } else {
//       return res
//         .status(400)
//         .json({ error: true, message: "Invalid USMLE step." });
//     }

//     const allowedTimeInMilliseconds = allowedMinutes * 60 * 1000;
//     const testEndTime =
//       new Date(testAttemptedAt).getTime() + allowedTimeInMilliseconds;
//     const currentTime = new Date().getTime();
//     if (currentTime > testEndTime) {
//       return res.status(400).json({
//         error: true,
//         message: "The allowed time for this test has ended.",
//       });
//     }

//     const testAttempt = {
//       test: testId,
//       questions: test.questions,
//       createdAt: testAttemptedAt,
//       totalScore: totalMarks,
//       obtainedScore: obtainedMarks,
//       usmleSteps: test.usmleStep,
//       USMLE: test.USMLE,
//     };

//     user.attemptedTests.push(testAttempt);
//     await user.save();

//     res.status(200).json({
//       status: "success",
//       success: true,
//       message: "Test attempt information saved successfully.",
//       testAttempt: testAttempt,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: true,
//       message: "Error saving test attempt information.",
//       errorMessage: error.message,
//     });
//   }
// });
