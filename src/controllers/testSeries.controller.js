import Test from "../models/Test.js";
import Question from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";

/* =====================================================
   GET ALL TESTS INSIDE A PACK
   GET /api/test-series/pack/:packId
===================================================== */
export const getTestsByPack = async (req, res) => {
  try {
    const { packId } = req.params;

    const tests = await Test.find({
      pack: packId,
      isActive: true,
    }).sort({ createdAt: 1 });

    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET SINGLE TEST (INSTRUCTIONS PAGE)
   GET /api/test-series/test/:testId
===================================================== */
export const getTestDetails = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);

    if (!test) {
      return res
        .status(404)
        .json({ message: "Test not found" });
    }

    res.status(200).json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET QUESTIONS FOR A TEST (SECURED)
   GET /api/test-series/test/:testId/questions
===================================================== */
export const getTestQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      test: req.test._id,
    }).select("-correctOption -negativeMarks");

    res.status(200).json({
      durationMinutes: req.test.durationMinutes,
      questions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   SUBMIT TEST
   POST /api/test-series/test/:testId/submit
===================================================== */
export const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;

    const questions = await Question.find({
      test: req.test._id,
    });

    let score = 0;
    let totalMarks = 0;

    const answerSheet = [];

    questions.forEach((q) => {
      totalMarks += q.marks;

      const selected = answers[q._id];

      if (!selected) return;

      if (selected === q.correctOption) {
        score += q.marks;
      } else {
        score -= q.negativeMarks;
      }

      answerSheet.push({
        question: q._id,
        selectedOption: selected,
      });
    });

    const percentage = (score / totalMarks) * 100;

    await TestAttempt.create({
      user: req.user._id,
      test: req.test._id,
      answers: answerSheet,
      score,
      totalMarks,
      percentage,
      startedAt: new Date(Date.now() - req.test.durationMinutes * 60000),
      submittedAt: new Date(),
    });

    res.status(200).json({
      message: "Test submitted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET TEST RESULT
   GET /api/test-series/test/:testId/result
===================================================== */
export const getTestResult = async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      user: req.user._id,
      test: req.params.testId,
    })
      .populate("answers.question")
      .sort({ createdAt: -1 });

    if (!attempt) {
      return res
        .status(404)
        .json({ message: "Result not found" });
    }

    const analysis = attempt.answers.map((a) => ({
      questionId: a.question._id,
      questionText: a.question.questionText,
      selectedOption: a.selectedOption,
      correctOption: a.question.correctOption,
    }));

    res.status(200).json({
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      analysis,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
