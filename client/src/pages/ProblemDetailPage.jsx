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

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [languageKey, setLanguageKey] = useState("python");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    try {
      const response = await api.post("/submissions", {
        problemId: problem._id,
        code,
        language: selectedLanguage.label,
        languageId: selectedLanguage.languageId
      });
      setStatus(response.data.status);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
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

        {status && <p className="mt-3 text-gold">Result: {status}</p>}
        {error && <p className="mt-3 text-red-400">{error}</p>}

        <Button onClick={handleSubmit} disabled={submitting} className="mt-4 w-full">
          {submitting ? "Submitting..." : "Submit Code"}
        </Button>
      </Card>
    </main>
  );
};

export default ProblemDetailPage;
