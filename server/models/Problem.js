const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true }
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    topic: { type: String, default: "General", trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    description: { type: String, required: true },
    constraints: [{ type: String }],
    examples: [
      {
        input: String,
        output: String,
        explanation: String
      }
    ],
    starterCode: {
      python: { type: String, default: "" },
      javascript: { type: String, default: "" },
      cpp: { type: String, default: "" },
      java: { type: String, default: "" }
    },
    testCases: [testCaseSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);
