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

const judge0Client = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    ...buildHeaders()
  }
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseProviderError = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const apiMessage =
    (typeof data === "object" && data?.message) ||
    (typeof data === "string" && data) ||
    error?.message;

  if (apiMessage) {
    const statusPrefix = status ? `status ${status} - ` : "";
    return `Execution provider error: ${statusPrefix}${apiMessage}`;
  }

  return "Execution provider request failed";
};

const submitCode = async ({ source_code, language_id, stdin, expected_output }) => {
  try {
    const response = await judge0Client.post(
      "/submissions?base64_encoded=false&wait=false",
      { source_code, language_id, stdin, expected_output }
    );
    return response.data.token;
  } catch (error) {
    throw new Error(parseProviderError(error));
  }
};

const getSubmission = async (token) => {
  try {
    const response = await judge0Client.get(
      `/submissions/${token}?base64_encoded=false&fields=status,stdout,stderr,compile_output,time,memory`
    );
    return response.data;
  } catch (error) {
    throw new Error(parseProviderError(error));
  }
};

const submitAndWait = async (payload) => {
  const token = await submitCode(payload);
  let result = null;

  for (let i = 0; i < 10; i += 1) {
    result = await getSubmission(token);
    const statusId = result?.status?.id;
    if (![1, 2].includes(statusId)) break;
    await wait(700);
  }

  const statusDescription = result?.status?.description || "Unknown";
  const verdict = statusDescription === "Accepted" ? "Accepted" : statusDescription;

  return {
    verdict,
    stdout: result?.stdout || "",
    stderr: result?.stderr || result?.compile_output || "",
    time: Number(result?.time || 0),
    memory: Number(result?.memory || 0)
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
