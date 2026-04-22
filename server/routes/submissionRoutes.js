const express = require("express");
const {
  submitSolution,
  getMySubmissions,
  getProblemLeaderboard
} = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, submitSolution);
router.get("/me", protect, getMySubmissions);
router.get("/problem/:problemId/leaderboard", protect, getProblemLeaderboard);

module.exports = router;
