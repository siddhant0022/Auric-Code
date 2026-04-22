import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/LoadingSpinner";

const languageOptions = [
  { key: "cpp", label: "C++", languageId: 54 },
  { key: "java", label: "Java", languageId: 62 },
  { key: "python", label: "Python", languageId: 71 },
  { key: "javascript", label: "JavaScript", languageId: 63 }
];

const statusToneClass = (status) => {
  if (status === "Accepted") return "text-emerald-400";
  if (status === "Wrong Answer") return "text-amber-400";
  if (status === "Compile Error" || status === "Runtime Error" || status === "Timeout") return "text-red-400";
  return "text-gold";
};

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [languageKey, setLanguageKey] = useState("python");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastSubmission, setLastSubmission] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${id}`);
        setProblem(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem?.starterCode?.[languageKey]) {
      setCode(problem.starterCode[languageKey]);
    }
  }, [languageKey, problem]);

  const selectedLanguage = useMemo(
    () => languageOptions.find((option) => option.key === languageKey),
    [languageKey]
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setStatus("");
    setError("");
    setLeaderboardError("");
    setShowLeaderboard(true);
    setLeaderboardLoading(true);
    try {
      const response = await api.post("/submissions", {
        problemId: problem._id,
        code,
        language: selectedLanguage.label,
        languageId: selectedLanguage.languageId
      });
      setStatus(response.data.status);

      setLastSubmission({
        status: response.data.status,
        runtimeMs: response.data.runtimeMs,
        memoryKb: response.data.memoryKb,
        language: response.data.language,
        details: response.data.details || ""
      });

      try {
        const leaderboardResponse = await api.get(`/submissions/problem/${problem._id}/leaderboard`);
        setLeaderboard(leaderboardResponse.data || []);
      } catch (leaderboardFetchError) {
        setLeaderboard([]);
        setLeaderboardError(leaderboardFetchError.response?.data?.message || "Could not load leaderboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
      setShowLeaderboard(false);
      setLeaderboard([]);
      setLeaderboardError("");
    } finally {
      setLeaderboardLoading(false);
      setSubmitting(false);
    }
  };

  const closeLeaderboard = () => {
    if (leaderboardLoading) return;
    setShowLeaderboard(false);
  };

  if (loading) return <LoadingSpinner label="Loading problem..." />;
  if (error && !problem) return <p className="mx-auto mt-6 max-w-6xl px-4 text-red-400">{error}</p>;

  return (
    <main className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 lg:grid-cols-2">
      <Card>
        <h1 className="text-2xl font-semibold text-gold">{problem.title}</h1>
        <p className="mb-2 mt-1 text-sm text-gray-300">{problem.difficulty}</p>
        <p className="mb-4 whitespace-pre-line">{problem.description}</p>

        <h2 className="mb-2 text-lg font-medium">Constraints</h2>
        <ul className="mb-4 list-inside list-disc text-sm text-gray-300">
          {problem.constraints?.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <h2 className="mb-2 text-lg font-medium">Examples</h2>
        <div className="space-y-3">
          {problem.examples?.map((example, index) => (
            <Card key={`${example.input}-${index}`} className="bg-black-900">
              <p><strong>Input:</strong> {example.input}</p>
              <p><strong>Output:</strong> {example.output}</p>
              {example.explanation && <p><strong>Explanation:</strong> {example.explanation}</p>}
            </Card>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Code Editor</h2>
          <select
            value={languageKey}
            onChange={(event) => setLanguageKey(event.target.value)}
            className="rounded border border-black-700 bg-black-900 px-2 py-1 text-sm"
          >
            {languageOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="h-[420px] w-full rounded-md border border-black-700 bg-black-900 p-3 font-mono text-sm outline-none focus:border-gold"
        />

        {status && (
          <div className="mt-3 rounded border border-black-700 bg-black-900 p-3 text-sm">
            <p>
              Result: <span className={statusToneClass(status)}>{status}</span>
            </p>
            {lastSubmission && (
              <p className="text-gray-300">
                Runtime: {Number(lastSubmission.runtimeMs || 0)} ms | Memory:{" "}
                {Number(lastSubmission.memoryKb || 0)} KB
              </p>
            )}
          </div>
        )}
        {error && <p className="mt-3 text-red-400">{error}</p>}

        <Button onClick={handleSubmit} disabled={submitting} className="mt-4 w-full">
          {submitting ? "Submitting..." : "Submit Code"}
        </Button>
      </Card>

      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <Card className="w-full max-w-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gold">Submission Leaderboard</h3>
                <p className="text-sm text-gray-300">{problem.title}</p>
              </div>
              <button
                type="button"
                onClick={closeLeaderboard}
                disabled={leaderboardLoading}
                className="rounded border border-black-700 px-3 py-1 text-sm text-gray-200 hover:border-gold hover:text-gold"
              >
                Close
              </button>
            </div>

            {lastSubmission && (
              <div className="mb-4 rounded border border-black-700 bg-black-900 p-3 text-sm">
                <p>
                  <span className="text-gray-300">Your result:</span>{" "}
                  <span className={statusToneClass(lastSubmission.status)}>{lastSubmission.status}</span>
                </p>
                <p className="text-gray-300">
                  Runtime: {Number(lastSubmission.runtimeMs || 0)} ms | Memory:{" "}
                  {Number(lastSubmission.memoryKb || 0)} KB | Language: {lastSubmission.language}
                </p>
                {lastSubmission.details && (
                  <p className="mt-1 whitespace-pre-line text-xs text-gray-400">{lastSubmission.details}</p>
                )}
              </div>
            )}

            {leaderboardLoading ? (
              <p className="text-sm text-gray-300">Loading leaderboard...</p>
            ) : leaderboardError ? (
              <p className="text-sm text-red-400">{leaderboardError}</p>
            ) : leaderboard.length === 0 ? (
              <p className="text-sm text-gray-300">No accepted submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-black-700 text-gray-300">
                      <th className="py-2">Rank</th>
                      <th className="py-2">User</th>
                      <th className="py-2">Runtime</th>
                      <th className="py-2">Memory</th>
                      <th className="py-2">Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={`${entry.userId}-${index}`} className="border-b border-black-800/70">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">{entry.userName}</td>
                        <td className="py-2">{Number(entry.runtimeMs || 0)} ms</td>
                        <td className="py-2">{Number(entry.memoryKb || 0)} KB</td>
                        <td className="py-2">{entry.language}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </main>
  );
};

export default ProblemDetailPage;
