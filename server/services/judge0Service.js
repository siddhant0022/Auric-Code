const axios = require("axios");

const buildHeaders = () => {
  if (!process.env.JUDGE0_API_KEY) return {};
  return {
    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
    "X-RapidAPI-Host": process.env.JUDGE0_API_HOST
  };
};

const judge0Client = axios.create({
  baseURL: process.env.JUDGE0_BASE_URL || "http://localhost:2358",
  headers: {
    "Content-Type": "application/json",
    ...buildHeaders()
  }
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitCode = async ({ source_code, language_id, stdin, expected_output }) => {
  try {
    const response = await judge0Client.post(
      "/submissions?base64_encoded=false&wait=false",
      { source_code, language_id, stdin, expected_output }
    );
    return response.data.token;
  } catch (error) {
    const apiMessage = error?.response?.data?.message;
    if (apiMessage) {
      throw new Error(`Execution provider error: ${apiMessage}`);
    }
    throw new Error("Execution provider request failed");
  }
};

const getSubmission = async (token) => {
  try {
    const response = await judge0Client.get(
      `/submissions/${token}?base64_encoded=false&fields=status,stdout,stderr,compile_output,time,memory`
    );
    return response.data;
  } catch (error) {
    const apiMessage = error?.response?.data?.message;
    if (apiMessage) {
      throw new Error(`Execution provider error: ${apiMessage}`);
    }
    throw new Error("Execution provider request failed");
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

module.exports = { submitAndWait };
