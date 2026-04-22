const express = require("express");
const { submitSolution, getMySubmissions } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, submitSolution);
router.get("/me", protect, getMySubmissions);

module.exports = router;
