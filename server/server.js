require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const ensureSeedProblems = require("./utils/seedProblems");

const app = express();
const PORT = process.env.PORT || 5000;

const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");

const rawClientUrl = process.env.CLIENT_URL || "*";
const allowedOrigins =
  rawClientUrl === "*"
    ? ["*"]
    : rawClientUrl
        .split(",")
        .map((origin) => normalizeOrigin(origin))
        .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      const normalizedRequestOrigin = normalizeOrigin(origin);
      const isAllowed = allowedOrigins.includes(normalizedRequestOrigin);
      return callback(isAllowed ? null : new Error("Not allowed by CORS"), isAllowed);
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Coding Platform API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  await ensureSeedProblems();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
