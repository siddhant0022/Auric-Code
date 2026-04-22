const Problem = require("../models/Problem");

const starterProblems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 9"
      }
    ],
    starterCode: {
      python: "def two_sum(nums, target):\n    # write your code here\n    pass",
      javascript: "function twoSum(nums, target) {\n  // write your code here\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // write your code here\n  return 0;\n}",
      java: "public class Main {\n  public static void main(String[] args) {\n    // write your code here\n  }\n}"
    },
    testCases: [
      { input: "2 7 11 15\n9", output: "0 1" },
      { input: "3 2 4\n6", output: "1 2" }
    ]
  }
];

const ensureSeedProblems = async () => {
  const count = await Problem.countDocuments();
  if (count === 0) {
    await Problem.insertMany(starterProblems);
    console.log("Seeded starter problems");
  }
};

module.exports = ensureSeedProblems;
