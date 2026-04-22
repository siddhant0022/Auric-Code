const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    languageId: { type: Number, required: true },
    status: { type: String, required: true },
    runtimeMs: { type: Number, default: 0 },
    memoryKb: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
