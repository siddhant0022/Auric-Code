const Problem = require("../models/Problem");

const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({})
      .select("title topic difficulty createdAt")
      .sort({ createdAt: -1 });
    return res.json(problems);
  } catch (error) {
    console.error("Get problems error:", error.message);
    return res.status(500).json({ message: "Could not load problems" });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("-testCases");
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.json(problem);
  } catch (error) {
    console.error("Get problem by id error:", error.message);
    return res.status(500).json({ message: "Could not load problem details" });
  }
};

module.exports = { getProblems, getProblemById };
