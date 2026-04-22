const User = require("../models/User");
const Submission = require("../models/Submission");

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("solvedProblems", "title difficulty");
    const submissions = await Submission.find({ user: req.user._id })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
      solvedProblems: user.solvedProblems,
      submissionHistory: submissions
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    return res.status(500).json({ message: "Could not load dashboard" });
  }
};

module.exports = { getDashboard };
