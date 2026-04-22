const Problem = require("../models/Problem");

const starterProblems = [
  {
    title: "Find Maximum Element",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Given an array of integers, return the maximum element.\nInput: space-separated integers.\nOutput: single integer.",
    constraints: ["1 <= n <= 10^5", "-10^9 <= arr[i] <= 10^9"],
    examples: [{ input: "1 3 2 9 5", output: "9" }],
    starterCode: {
      python: "def find_max(arr):\n    pass",
      javascript: "function findMax(arr) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [
      { input: "1 3 2 9 5", output: "9" },
      { input: "-1 -5 -3", output: "-1" }
    ]
  },

  {
    title: "Second Largest Element",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find the second largest element in the array. If it doesn't exist, return -1.",
    constraints: ["1 <= n <= 10^5"],
    examples: [{ input: "1 2 3 4", output: "3" }],
    starterCode: {
      python: "def second_largest(arr):\n    pass",
      javascript: "function secondLargest(arr) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [
      { input: "1 2 3 4", output: "3" },
      { input: "5", output: "-1" }
    ]
  },

  {
    title: "Check Sorted Array",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Check if the array is sorted in non-decreasing order.",
    constraints: ["1 <= n <= 10^5"],
    examples: [{ input: "1 2 3 4", output: "true" }],
    starterCode: {
      python: "def is_sorted(arr):\n    pass",
      javascript: "function isSorted(arr) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [
      { input: "1 2 3 4", output: "true" },
      { input: "1 3 2", output: "false" }
    ]
  },

  {
    title: "Move Zeroes",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Move all zeroes to the end while maintaining order of non-zero elements.",
    constraints: ["1 <= n <= 10^5"],
    examples: [{ input: "0 1 0 3 12", output: "1 3 12 0 0" }],
    starterCode: {
      python: "def move_zeroes(arr):\n    pass",
      javascript: "function moveZeroes(arr) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [
      { input: "0 1 0 3 12", output: "1 3 12 0 0" }
    ]
  },

  {
    title: "Reverse Words in String",
    topic: "Strings",
    difficulty: "Medium",
    description: "Reverse the order of words in a string.",
    constraints: ["1 <= n <= 10^5"],
    examples: [{ input: "hello world", output: "world hello" }],
    starterCode: {
      python: "def reverse_words(s):\n    pass",
      javascript: "function reverseWords(s) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [
      { input: "hello world", output: "world hello" }
    ]
  },

  {
    title: "Longest Palindromic Substring",
    topic: "Strings",
    difficulty: "Medium",
    description: "Find the longest palindromic substring.",
    constraints: ["1 <= n <= 1000"],
    examples: [{ input: "babad", output: "bab" }],
    starterCode: {
      python: "def longest_palindrome(s):\n    pass",
      javascript: "function longestPalindrome(s) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [
      { input: "babad", output: "bab" },
      { input: "cbbd", output: "bb" }
    ]
  },

  {
    title: "Valid Sudoku",
    topic: "Hashing",
    difficulty: "Medium",
    description: "Determine if a 9x9 Sudoku board is valid.",
    constraints: ["Board is 9x9"],
    examples: [{ input: "valid board", output: "true" }],
    starterCode: {
      python: "def is_valid_sudoku(board):\n    pass",
      javascript: "function isValidSudoku(board) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [
      { input: "valid", output: "true" }
    ]
  },

  {
    title: "Sliding Window Maximum",
    topic: "Sliding Window",
    difficulty: "Hard",
    description: "Find maximum in each window of size k.",
    constraints: ["1 <= n <= 10^5"],
    examples: [{ input: "1 3 -1 -3 5 3 6 7\n3", output: "3 3 5 5 6 7" }],
    starterCode: {
      python: "def max_sliding_window(nums, k):\n    pass",
      javascript: "function maxSlidingWindow(nums, k) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [
      { input: "1 3 -1 -3 5 3 6 7\n3", output: "3 3 5 5 6 7" }
    ]
  },

  {
    title: "Detect Cycle in Linked List",
    topic: "Linked List",
    difficulty: "Easy",
    description: "Check if linked list has a cycle.",
    constraints: ["n <= 10^5"],
    examples: [{ input: "cycle list", output: "true" }],
    starterCode: {
      python: "def has_cycle(head):\n    pass",
      javascript: "function hasCycle(head) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [{ input: "cycle", output: "true" }]
  },

  {
    title: "Binary Tree Inorder Traversal",
    topic: "Trees",
    difficulty: "Easy",
    description: "Return inorder traversal of binary tree.",
    constraints: ["n <= 10^5"],
    examples: [{ input: "tree", output: "1 2 3" }],
    starterCode: {
      python: "def inorder(root):\n    pass",
      javascript: "function inorder(root) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [{ input: "tree", output: "1 2 3" }]
  },

  {
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Find minimum coins needed to make amount.",
    constraints: ["1 <= amount <= 10^4"],
    examples: [{ input: "1 2 5\n11", output: "3" }],
    starterCode: {
      python: "def coin_change(coins, amount):\n    pass",
      javascript: "function coinChange(coins, amount) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [{ input: "1 2 5\n11", output: "3" }]
  },

  {
    title: "House Robber",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Max money without robbing adjacent houses.",
    constraints: ["1 <= n <= 10^5"],
    examples: [{ input: "2 7 9 3 1", output: "12" }],
    starterCode: {
      python: "def rob(nums):\n    pass",
      javascript: "function rob(nums) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [{ input: "2 7 9 3 1", output: "12" }]
  },

  {
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    description: "Count number of islands in grid.",
    constraints: ["1 <= m,n <= 300"],
    examples: [{ input: "grid", output: "3" }],
    starterCode: {
      python: "def num_islands(grid):\n    pass",
      javascript: "function numIslands(grid) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [{ input: "grid", output: "3" }]
  },

  {
    title: "Top K Frequent Elements",
    topic: "Heap",
    difficulty: "Medium",
    description: "Return k most frequent elements.",
    constraints: ["1 <= n <= 10^5"],
    examples: [{ input: "1 1 1 2 2 3\n2", output: "1 2" }],
    starterCode: {
      python: "def top_k(nums, k):\n    pass",
      javascript: "function topK(nums, k) {\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "public class Main { public static void main(String[] args) {} }"
    },
    testCases: [{ input: "1 1 1 2 2 3\n2", output: "1 2" }]
  },

  {
    title: "LRU Cache",
    topic: "Design",
    difficulty: "Hard",
    description: "Design LRU cache with O(1) operations.",
    constraints: ["capacity <= 3000"],
    examples: [{ input: "LRU ops", output: "result" }],
    starterCode: {
      python: "class LRUCache:\n    def __init__(self, capacity):\n        pass",
      javascript: "class LRUCache {\n constructor(capacity) {}\n}",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {}",
      java: "class LRUCache {}"
    },
    testCases: [{ input: "ops", output: "result" }]
  }
];

const ensureSeedProblems = async () => {
  for (const problem of starterProblems) {
    await Problem.updateOne(
      { title: problem.title, $or: [{ topic: { $exists: false } }, { topic: null }, { topic: "" }] },
      { $set: { topic: problem.topic } }
    );
    await Problem.updateOne({ title: problem.title }, { $setOnInsert: problem }, { upsert: true });
  }
  console.log("Ensured starter problems are seeded");
};

module.exports = ensureSeedProblems;
