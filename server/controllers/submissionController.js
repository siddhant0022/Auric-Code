const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/User");
const { submitAndWait } = require("../services/judge0Service");

const runAgainstTestCase = async ({ code, languageId, testCase }) => {
  const result = await submitAndWait({
    source_code: code,
    language_id: languageId,
    stdin: testCase.input,
    expected_output: testCase.output
  });

  return result;
};

const submitSolution = async (req, res) => {
  try {
    const { problemId, code, language, languageId } = req.body;
    if (!problemId || !code || !language || !languageId) {
      return res.status(400).json({ message: "Missing required submission fields" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    let verdict = "Accepted";
    let runtimeMs = 0;
    let memoryKb = 0;

    for (const testCase of problem.testCases) {
      const result = await runAgainstTestCase({ code, languageId, testCase });
      runtimeMs = Number(result?.time || 0);
      memoryKb = Number(result?.memory || 0);

      if (result?.verdict !== "Accepted") {
        verdict = result?.verdict || "Unknown";
        break;
      }
    }

    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      code,
      language,
      languageId,
      status: verdict,
      runtimeMs,
      memoryKb
    });

    if (verdict === "Accepted") {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { solvedProblems: problem._id }
      });
    }

    return res.status(201).json(submission);
  } catch (error) {
    console.error("Submit solution error:", error.message);
    return res.status(500).json({
      message: error.message || "Submission failed. Check code and try again."
    });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 });

    return res.json(submissions);
  } catch (error) {
    console.error("Get submissions error:", error.message);
    return res.status(500).json({ message: "Could not load submissions" });
  }
};

module.exports = { submitSolution, getMySubmissions };
