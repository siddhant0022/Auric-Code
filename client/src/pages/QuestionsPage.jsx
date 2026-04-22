import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/LoadingSpinner";

const difficultyOrder = ["Easy", "Medium", "Hard"];

const difficultyChipClass = {
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Hard: "border-red-500/30 bg-red-500/10 text-red-300"
};

const QuestionsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get("/problems");
        setProblems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const groupedByTopic = useMemo(() => {
    const grouped = {};

    for (const problem of problems) {
      const topic = problem.topic?.trim() || "General";
      if (!grouped[topic]) {
        grouped[topic] = { Easy: [], Medium: [], Hard: [] };
      }

      const difficulty = difficultyOrder.includes(problem.difficulty) ? problem.difficulty : "Easy";
      grouped[topic][difficulty].push(problem);
    }

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([topic, buckets]) => ({ topic, buckets }));
  }, [problems]);

  if (loading) return <LoadingSpinner label="Loading questions..." />;
  if (error) return <p className="mx-auto mt-6 max-w-7xl px-4 text-red-400">{error}</p>;

  return (
    <main className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8">
      <div className="absolute inset-x-10 top-0 h-64 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16),transparent_70%)] blur-3xl" />
      <section className="section-frame relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80">Question Bank</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          Topic-wise and <span className="gold-gradient-text">difficulty-wise</span> questions
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-300">
          Browse by topic, then pick your level: Easy, Medium, or Hard.
        </p>

        {groupedByTopic.length === 0 ? (
          <Card className="mt-6">
            <p className="text-sm text-zinc-300">No questions available yet.</p>
          </Card>
        ) : (
          <div className="mt-6 space-y-6">
            {groupedByTopic.map(({ topic, buckets }) => (
              <Card key={topic} className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-white">{topic}</h2>
                  <span className="rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.15em] text-gold">
                    {difficultyOrder.reduce((total, level) => total + buckets[level].length, 0)} Questions
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {difficultyOrder.map((difficulty) => (
                    <div key={difficulty} className="rounded-2xl border border-gold/15 bg-black-900/70 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">{difficulty}</h3>
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${difficultyChipClass[difficulty]}`}>
                          {buckets[difficulty].length}
                        </span>
                      </div>

                      {buckets[difficulty].length === 0 ? (
                        <p className="text-sm text-zinc-500">No questions in this level.</p>
                      ) : (
                        <ul className="space-y-2">
                          {buckets[difficulty].map((problem) => (
                            <li
                              key={problem._id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-gold/10 bg-black-950/60 px-3 py-2"
                            >
                              <p className="text-sm text-zinc-200">{problem.title}</p>
                              <Link
                                to={`/problems/${problem._id}`}
                                className="shrink-0 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold transition hover:bg-gold/10"
                              >
                                Solve
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default QuestionsPage;
