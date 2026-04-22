const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/User");
const { submitAndWait } = require("../services/judge0Service");
const parsedEpsilon = Number(process.env.OUTPUT_COMPARE_EPSILON);
const OUTPUT_COMPARE_EPSILON = Number.isFinite(parsedEpsilon) && parsedEpsilon > 0 ? parsedEpsilon : 1e-6;

const buildInputVariants = (rawInput) => {
  const input = (rawInput || "").trim();
  const variants = [input];
  const lines = input.split("\n").map((line) => line.trim()).filter(Boolean);

  // Supports both array input styles for common CP problems:
  // "2 7 11 15\n9" and "4\n2 7 11 15\n9".
  if (lines.length >= 2) {
    const firstLineTokens = lines[0].split(/\s+/).filter(Boolean);
    const isNumberList = firstLineTokens.length > 1 && firstLineTokens.every((token) => /^-?\d+$/.test(token));
    const startsWithCount =
      lines.length >= 3 &&
      /^-?\d+$/.test(lines[0]) &&
      Number(lines[0]) === lines[1].split(/\s+/).filter(Boolean).length;

    if (isNumberList && !startsWithCount) {
      variants.push(`${firstLineTokens.length}\n${lines.join("\n")}`);
    }
  }

  return [...new Set(variants)];
};

const normalizeLines = (value) => {
  const text = String(value ?? "").replace(/\r\n/g, "\n");
  const lines = text.split("\n").map((line) => line.replace(/[ \t]+$/g, ""));
  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines;
};

const normalizeForComparison = (value) => normalizeLines(value).join("\n");

const isNumericToken = (token) => /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(token);

const compareOutputs = (actual, expected) => {
  const normalizedActual = normalizeForComparison(actual);
  const normalizedExpected = normalizeForComparison(expected);

  if (normalizedActual === normalizedExpected) {
    return true;
  }

  const actualTokens = normalizedActual.trim() ? normalizedActual.trim().split(/\s+/) : [];
  const expectedTokens = normalizedExpected.trim() ? normalizedExpected.trim().split(/\s+/) : [];
  if (actualTokens.length !== expectedTokens.length) {
    return false;
  }

  for (let i = 0; i < actualTokens.length; i += 1) {
    const a = actualTokens[i];
    const b = expectedTokens[i];
    if (isNumericToken(a) && isNumericToken(b)) {
      if (Math.abs(Number(a) - Number(b)) > OUTPUT_COMPARE_EPSILON) {
        return false;
      }
      continue;
    }
    if (a !== b) {
      return false;
    }
  }

  return true;
};

const mapExecutionFailure = (result) => {
  if (result?.timedOut || result?.statusId === 5) {
    return "Timeout";
  }
  if (result?.statusId === 6 || result?.compileOutput) {
    return "Compile Error";
  }
  if ([7, 8, 9, 10, 11, 12, 14].includes(result?.statusId)) {
    return "Runtime Error";
  }
  if (result?.statusId === 13) {
    return "Execution Provider Error";
  }
  return null;
};

const runAgainstTestCase = async ({ code, languageId, testCase }) => {
  const inputVariants = buildInputVariants(testCase.input);
  let bestAcceptedResult = null;
  let lastResult = null;

  for (const stdin of inputVariants) {
    const result = await submitAndWait({
      source_code: code,
      language_id: languageId,
      stdin
    });
    lastResult = result;

    const failVerdict = mapExecutionFailure(result);
    if (failVerdict) {
      continue;
    }

    const isAccepted = compareOutputs(result?.stdout || "", testCase.output);
    if (isAccepted) {
      const candidate = { ...result, verdict: "Accepted" };
      if (!bestAcceptedResult || Number(candidate?.time || 0) < Number(bestAcceptedResult?.time || 0)) {
        bestAcceptedResult = candidate;
      }
    }
  }

  if (bestAcceptedResult) {
    return bestAcceptedResult;
  }

  const fallbackVerdict = mapExecutionFailure(lastResult) || "Wrong Answer";
  return { ...(lastResult || {}), verdict: fallbackVerdict };
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
    let details = "";

    for (const testCase of problem.testCases) {
      const result = await runAgainstTestCase({ code, languageId, testCase });
      runtimeMs = Math.max(runtimeMs, Number(result?.time || 0));
      memoryKb = Math.max(memoryKb, Number(result?.memory || 0));

      if (result?.verdict !== "Accepted") {
        verdict = result?.verdict || "Unknown";
        details = result?.stderr || result?.compileOutput || result?.statusDescription || "";
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

    return res.status(201).json({
      ...submission.toObject(),
      details
    });
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

const getProblemLeaderboard = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findById(problemId).select("_id");
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const leaderboard = await Submission.aggregate([
      { $match: { problem: problem._id, status: "Accepted" } },
      { $sort: { runtimeMs: 1, memoryKb: 1, createdAt: 1 } },
      {
        $group: {
          _id: "$user",
          runtimeMs: { $first: "$runtimeMs" },
          memoryKb: { $first: "$memoryKb" },
          language: { $first: "$language" },
          createdAt: { $first: "$createdAt" }
        }
      },
      { $sort: { runtimeMs: 1, memoryKb: 1, createdAt: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          userName: "$user.name",
          runtimeMs: 1,
          memoryKb: 1,
          language: 1
        }
      }
    ]);

    return res.json(leaderboard);
  } catch (error) {
    console.error("Get leaderboard error:", error.message);
    return res.status(500).json({ message: "Could not load leaderboard" });
  }
};

module.exports = { submitSolution, getMySubmissions, getProblemLeaderboard };
