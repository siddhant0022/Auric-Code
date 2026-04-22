import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/LoadingSpinner";

const ProblemListPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get("/problems");
        setProblems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) return <LoadingSpinner label="Loading problems..." />;
  if (error) return <p className="mx-auto mt-6 max-w-6xl px-4 text-red-400">{error}</p>;

  return (
    <main className="mx-auto mt-6 max-w-6xl px-4">
      <h1 className="mb-4 text-2xl font-semibold text-gold">Problem List</h1>
      <div className="space-y-3">
        {problems.map((problem) => (
          <Card key={problem._id} className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">{problem.title}</h2>
              <p className="text-sm text-gray-300">{problem.difficulty}</p>
            </div>
            <Link to={`/problems/${problem._id}`} className="text-gold hover:underline">
              Solve
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default ProblemListPage;
