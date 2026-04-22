import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/LoadingSpinner";

const statusChipClass = (status) => {
  if (status === "Accepted") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  if (status === "Wrong Answer") return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  return "bg-red-500/10 text-red-400 border-red-500/30";
};

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/users/dashboard");
        setDashboard(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <p className="mx-auto mt-6 max-w-6xl px-4 text-red-400">{error}</p>;

  return (
    <main className="mx-auto mt-6 max-w-6xl px-4">
      <h1 className="mb-4 text-2xl font-semibold text-gold">{dashboard.user.name}'s Dashboard</h1>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-medium">Solved Problems</h2>
          {dashboard.solvedProblems.length === 0 ? (
            <p className="text-sm text-gray-300">No solved problems yet.</p>
          ) : (
            <ul className="space-y-2">
              {dashboard.solvedProblems.map((problem) => (
                <li key={problem._id} className="flex justify-between text-sm">
                  <span>{problem.title}</span>
                  <span className="text-gold">{problem.difficulty}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-medium">Recent Submissions</h2>
          {dashboard.submissionHistory.length === 0 ? (
            <p className="text-sm text-gray-300">No submissions yet.</p>
          ) : (
            <ul className="space-y-2">
              {dashboard.submissionHistory.map((submission) => (
                <li key={submission._id} className="rounded bg-black-900 p-2 text-sm">
                  <p>{submission.problem?.title || "Unknown problem"}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-gray-300">
                    <span>{submission.language}</span>
                    <span
                      className={`rounded border px-2 py-0.5 text-xs font-medium ${statusChipClass(submission.status)}`}
                    >
                      {submission.status}
                    </span>
                    <span>Runtime: {Number(submission.runtimeMs || 0)} ms</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
};

export default DashboardPage;
