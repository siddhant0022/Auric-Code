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

const difficultyBadgeClass = (difficulty) => {
  if (difficulty === "Easy") return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
  if (difficulty === "Medium") return "border-amber-500/35 bg-amber-500/10 text-amber-300";
  return "border-red-500/35 bg-red-500/10 text-red-300";
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

  const resetToStarterCode = () => {
    if (!problem?.starterCode?.[languageKey]) return;
    setCode(problem.starterCode[languageKey]);
  };

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
    <main className="relative mx-auto mt-6 max-w-7xl px-4 pb-12">
      <div className="pointer-events-none absolute -left-10 top-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-1/3 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />

      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="section-frame">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${difficultyBadgeClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-gold">
              {problem.topic || "General"}
            </span>
          </div>

          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{problem.title}</h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-200 sm:text-base">
            {problem.description}
          </p>

          <div className="mt-8">
            <h2 className="text-xs uppercase tracking-[0.22em] text-gold/80">Constraints</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {problem.constraints?.length ? (
                problem.constraints.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-gold/15 bg-black-900/70 px-3 py-2 text-sm text-zinc-200"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-400">No constraints provided.</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xs uppercase tracking-[0.22em] text-gold/80">Examples</h2>
            <div className="mt-3 space-y-3">
              {problem.examples?.length ? (
                problem.examples.map((example, index) => (
                  <div
                    key={`${example.input}-${index}`}
                    className="overflow-hidden rounded-2xl border border-gold/15 bg-black-950/75"
                  >
                    <div className="flex items-center justify-between border-b border-gold/10 px-4 py-2">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Example {index + 1}</p>
                      <span className="rounded-full border border-gold/25 px-2 py-0.5 text-[11px] text-gold">
                        Case
                      </span>
                    </div>
                    <div className="space-y-2 px-4 py-3 text-sm">
                      <p><span className="text-zinc-400">Input:</span> <span className="font-mono text-zinc-200">{example.input}</span></p>
                      <p><span className="text-zinc-400">Output:</span> <span className="font-mono text-zinc-200">{example.output}</span></p>
                      {example.explanation && (
                        <p className="text-zinc-300"><span className="text-zinc-400">Explanation:</span> {example.explanation}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-400">No examples provided.</p>
              )}
            </div>
          </div>
        </section>

        <section className="section-frame lg:sticky lg:top-24">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Code Lab</h2>
            <select
              value={languageKey}
              onChange={(event) => setLanguageKey(event.target.value)}
              className="rounded-lg border border-gold/25 bg-black-900 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-gold"
            >
              {languageOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 flex items-center justify-between rounded-lg border border-gold/15 bg-black-950/70 px-3 py-2 text-xs">
            <span className="uppercase tracking-[0.14em] text-zinc-400">{selectedLanguage?.label} Runtime</span>
            <button
              type="button"
              onClick={resetToStarterCode}
              className="rounded-full border border-gold/35 px-2.5 py-1 text-gold transition hover:bg-gold/10"
            >
              Reset Starter
            </button>
          </div>

          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="h-[440px] w-full rounded-xl border border-gold/20 bg-black-950/90 p-4 font-mono text-sm text-zinc-100 outline-none transition focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.18)]"
          />

          {status && (
            <div className="mt-3 rounded-xl border border-gold/15 bg-black-950/70 p-3 text-sm">
              <p>
                Result: <span className={statusToneClass(status)}>{status}</span>
              </p>
              {lastSubmission && (
                <p className="mt-1 text-zinc-300">
                  Runtime: {Number(lastSubmission.runtimeMs || 0)} ms | Memory:{" "}
                  {Number(lastSubmission.memoryKb || 0)} KB
                </p>
              )}
            </div>
          )}
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <Button onClick={handleSubmit} disabled={submitting} className="mt-4 w-full py-2.5">
            {submitting ? "Submitting..." : "Submit Code"}
          </Button>
        </section>
      </div>

      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-3xl p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gold">Submission Leaderboard</h3>
                <p className="text-sm text-zinc-300">{problem.title}</p>
              </div>
              <button
                type="button"
                onClick={closeLeaderboard}
                disabled={leaderboardLoading}
                className="rounded-lg border border-gold/30 px-3 py-1 text-sm text-zinc-200 transition hover:border-gold hover:bg-gold/10 hover:text-gold"
              >
                Close
              </button>
            </div>

            {lastSubmission && (
              <div className="mb-4 rounded-xl border border-gold/15 bg-black-950/75 p-3 text-sm">
                <p>
                  <span className="text-zinc-300">Your result:</span>{" "}
                  <span className={statusToneClass(lastSubmission.status)}>{lastSubmission.status}</span>
                </p>
                <p className="text-zinc-300">
                  Runtime: {Number(lastSubmission.runtimeMs || 0)} ms | Memory:{" "}
                  {Number(lastSubmission.memoryKb || 0)} KB | Language: {lastSubmission.language}
                </p>
                {lastSubmission.details && (
                  <p className="mt-1 whitespace-pre-line text-xs text-zinc-400">{lastSubmission.details}</p>
                )}
              </div>
            )}

            {leaderboardLoading ? (
              <p className="text-sm text-zinc-300">Loading leaderboard...</p>
            ) : leaderboardError ? (
              <p className="text-sm text-red-400">{leaderboardError}</p>
            ) : leaderboard.length === 0 ? (
              <p className="text-sm text-zinc-300">No accepted submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gold/15 text-zinc-300">
                      <th className="py-2">Rank</th>
                      <th className="py-2">User</th>
                      <th className="py-2">Runtime</th>
                      <th className="py-2">Memory</th>
                      <th className="py-2">Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={`${entry.userId}-${index}`} className="border-b border-gold/10">
                        <td className="py-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gold/30 text-xs text-gold">
                            {index + 1}
                          </span>
                        </td>
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
