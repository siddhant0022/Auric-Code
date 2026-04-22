const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    oauthProvider: { type: String, enum: ["google", "local"], default: "local" },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
