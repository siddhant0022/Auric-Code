const Problem = require("../models/Problem");

const starterProblems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target.\nInput format: line 1 has space-separated nums, line 2 has target. The judge also accepts optional n as first line.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Output indices as: i j"],
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
      { input: "3 2 4\n6", output: "1 2" },
      { input: "0 4 3 0\n0", output: "0 3" }
    ]
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string s containing just the characters (), {}, and [], determine if the input string is valid.\nInput format: single line string s. Output true or false (lowercase preferred).",
    constraints: ["1 <= s.length <= 10^4", "s consists only of parentheses characters", "Whitespace-only differences are ignored"],
    examples: [
      {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are closed in the correct order."
      }
    ],
    starterCode: {
      python: "def is_valid(s):\n    # write your code here\n    pass",
      javascript: "function isValid(s) {\n  // write your code here\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // write your code here\n  return 0;\n}",
      java: "public class Main {\n  public static void main(String[] args) {\n    // write your code here\n  }\n}"
    },
    testCases: [
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
      { input: "([{}])", output: "true" }
    ]
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    description:
      "Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.\nInput format: one line with space-separated integers. Output a single integer.",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "Negative-only arrays are valid"],
    examples: [
      {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6."
      }
    ],
    starterCode: {
      python: "def max_subarray(nums):\n    # write your code here\n    pass",
      javascript: "function maxSubArray(nums) {\n  // write your code here\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // write your code here\n  return 0;\n}",
      java: "public class Main {\n  public static void main(String[] args) {\n    // write your code here\n  }\n}"
    },
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6" },
      { input: "1", output: "1" },
      { input: "-8 -3 -6 -2 -5 -4", output: "-2" }
    ]
  },
  {
    title: "Merge Strings Alternately",
    difficulty: "Easy",
    description:
      "You are given two strings word1 and word2. Merge them by adding letters in alternating order.\nInput format: word1 on line 1, word2 on line 2. Output merged string.",
    constraints: ["1 <= word1.length, word2.length <= 100", "Only lowercase English letters"],
    examples: [
      {
        input: "abc\npqr",
        output: "apbqcr",
        explanation: "Take one character from each string alternately."
      }
    ],
    starterCode: {
      python: "def merge_alternately(word1, word2):\n    # write your code here\n    pass",
      javascript: "function mergeAlternately(word1, word2) {\n  // write your code here\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // write your code here\n  return 0;\n}",
      java: "public class Main {\n  public static void main(String[] args) {\n    // write your code here\n  }\n}"
    },
    testCases: [
      { input: "abc\npqr", output: "apbqcr" },
      { input: "ab\npqrs", output: "apbqrs" },
      { input: "a\nz", output: "az" }
    ]
  }
];

const ensureSeedProblems = async () => {
  for (const problem of starterProblems) {
    await Problem.updateOne({ title: problem.title }, { $setOnInsert: problem }, { upsert: true });
  }
  console.log("Ensured starter problems are seeded");
};

module.exports = ensureSeedProblems;
