const axios = require("axios");

const getEnv = (key) => {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : "";
};

const buildHeaders = () => {
  const baseUrl = resolveBaseUrl();
  if (!baseUrl.includes("rapidapi.com")) return {};

  const apiKey = getEnv("JUDGE0_API_KEY");
  if (!apiKey) return {};

  const apiHost = getEnv("JUDGE0_API_HOST") || "judge0-ce.p.rapidapi.com";
  return {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": apiHost
  };
};

const resolveBaseUrl = () => {
  const explicitBaseUrl = getEnv("JUDGE0_BASE_URL");
  if (explicitBaseUrl) return explicitBaseUrl;

  const apiHost = getEnv("JUDGE0_API_HOST") || "judge0-ce.p.rapidapi.com";
  if (getEnv("JUDGE0_API_KEY")) return `https://${apiHost}`;

  return "http://localhost:2358";
};

const getNumberEnv = (key, fallback) => {
  const raw = getEnv(key);
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const REQUEST_TIMEOUT_MS = getNumberEnv("JUDGE0_TIMEOUT_MS", 15000);
const RETRY_COUNT = getNumberEnv("JUDGE0_RETRY_COUNT", 2);
const RETRY_DELAY_MS = getNumberEnv("JUDGE0_RETRY_DELAY_MS", 400);
const POLL_MAX_ATTEMPTS = getNumberEnv("JUDGE0_POLL_MAX_ATTEMPTS", 12);
const POLL_INTERVAL_MS = getNumberEnv("JUDGE0_POLL_INTERVAL_MS", 700);

const judge0Client = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    ...buildHeaders()
  }
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseProviderError = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const requestId = error?.response?.headers?.["x-request-id"];
  const apiMessage =
    (typeof data === "object" && data?.message) ||
    (typeof data === "string" && data) ||
    error?.message;

  if (apiMessage) {
    const statusPrefix = status ? `status ${status} - ` : "";
    const requestIdText = requestId ? ` (requestId: ${requestId})` : "";
    return `Execution provider error: ${statusPrefix}${apiMessage}${requestIdText}`;
  }

  return "Execution provider request failed";
};

const shouldRetry = (error) => {
  if (!error?.response) return true;
  const status = error.response.status;
  return status === 429 || status >= 500;
};

const requestWithRetry = async (executor) => {
  let attempt = 0;
  let lastError;

  while (attempt <= RETRY_COUNT) {
    try {
      return await executor();
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_COUNT || !shouldRetry(error)) {
        break;
      }
      await wait(RETRY_DELAY_MS * (attempt + 1));
      attempt += 1;
    }
  }

  throw lastError;
};

const submitCode = async ({ source_code, language_id, stdin }) => {
  try {
    const response = await requestWithRetry(() =>
      judge0Client.post("/submissions?base64_encoded=false&wait=false", { source_code, language_id, stdin })
    );
    return response.data.token;
  } catch (error) {
    throw new Error(parseProviderError(error));
  }
};

const getSubmission = async (token) => {
  try {
    const response = await requestWithRetry(() =>
      judge0Client.get(
        `/submissions/${token}?base64_encoded=false&fields=status,stdout,stderr,compile_output,time,memory`
      )
    );
    return response.data;
  } catch (error) {
    throw new Error(parseProviderError(error));
  }
};

const submitAndWait = async (payload) => {
  const token = await submitCode(payload);
  let result = null;

  for (let i = 0; i < POLL_MAX_ATTEMPTS; i += 1) {
    result = await getSubmission(token);
    const statusId = result?.status?.id;
    if (typeof statusId !== "number" || [1, 2].includes(statusId)) {
      await wait(POLL_INTERVAL_MS);
      continue;
    }
    break;
  }

  const statusId = result?.status?.id;
  const stillQueued = typeof statusId !== "number" || [1, 2].includes(statusId);

  return {
    statusId: stillQueued ? 5 : statusId,
    statusDescription: stillQueued ? "Queue Timeout" : result?.status?.description || "Unknown",
    stdout: result?.stdout || "",
    stderr: result?.stderr || "",
    compileOutput: result?.compile_output || "",
    time: Number(result?.time || 0),
    memory: Number(result?.memory || 0),
    timedOut: stillQueued
  };
};

const fetchAbout = async () => {
  try {
    const response = await judge0Client.request({
      method: "GET",
      url: "/about"
    });
    return response.data;
  } catch (error) {
    throw new Error(parseProviderError(error));
  }
};

module.exports = { submitAndWait, fetchAbout };
