import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/LoadingSpinner";

const featureList = [
  {
    title: "Real-Time Collaboration",
    description: "Pair program with synced cursors, shared terminals, and instant review threads.",
    icon: "01"
  },
  {
    title: "AI Code Suggestions",
    description: "Context-aware completions and refactors tuned for clean, production-grade code.",
    icon: "02"
  },
  {
    title: "Lightning Deployment",
    description: "Ship preview builds globally in seconds with one-command release pipelines.",
    icon: "03"
  },
  {
    title: "Multi-Language Runtime",
    description: "Compile and execute across modern stacks with high-fidelity result tracing.",
    icon: "04"
  },
  {
    title: "Built-In Security Checks",
    description: "Scan pull requests and dependencies with proactive risk insights before merge.",
    icon: "05"
  },
  {
    title: "Unified Team Insights",
    description: "Track velocity, quality, and performance through a single elegant dashboard.",
    icon: "06"
  }
];

const testimonials = [
  {
    name: "Anya Li",
    role: "Principal Engineer, NovaStack",
    quote: "AuricCode makes every sprint feel deliberate. It is fast, clean, and beautifully focused."
  },
  {
    name: "Marcus Reed",
    role: "CTO, Helix Labs",
    quote: "The editor and deployment workflow cut our cycle time in half without adding operational noise."
  },
  {
    name: "Sofia Patel",
    role: "Lead Developer, Skyline AI",
    quote: "This is the first platform our whole team actually enjoys using every day."
  }
];

const ProblemListPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
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

  return (
    <main className="relative overflow-hidden pb-16">
      <section className="relative mx-auto flex min-h-[86vh] w-full max-w-7xl items-center px-4 pt-8 md:pt-14">
        <div className="absolute inset-x-6 top-8 h-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.2),transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

        <div className="relative z-10 grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-gold/35 bg-gold/10 px-4 py-1 text-xs uppercase tracking-[0.22em] text-gold">
              Elite Developer Workspace
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              Build, review, and ship code at{" "}
              <span className="gold-gradient-text">luxury speed</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg">
              AuricCode gives modern engineering teams a dark-mode command center for coding,
              collaboration, and deployment in one polished interface.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="animate-[pulseGlow_3s_ease-in-out_infinite] rounded-lg border border-gold/60 bg-gradient-to-r from-[#d4af37] to-[#ffd700] px-6 py-3 text-sm font-medium text-black shadow-[0_0_18px_rgba(212,175,55,0.3)] transition duration-300 hover:shadow-[0_0_28px_rgba(255,215,0,0.44)]"
              >
                Start Building
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-gold/45 bg-transparent px-6 py-3 text-sm font-medium text-gold transition duration-300 hover:border-gold hover:bg-gold/10"
              >
                Watch Demo
              </Link>
            </div>
          </div>

          <div className="section-frame">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Live Editor</p>
              <span className="rounded-full border border-gold/35 px-3 py-1 text-xs text-gold">
                Active Session
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gold/20 bg-black-950/95">
              <div className="flex items-center justify-between border-b border-gold/15 px-4 py-3">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="text-xs text-zinc-400">feature/quantum-runtime.ts</div>
              </div>

              <div className="grid grid-cols-[180px_1fr] text-sm max-[480px]:grid-cols-1">
                <aside className="border-r border-gold/10 bg-black-900/95 p-3 text-xs text-zinc-400 max-[480px]:border-r-0 max-[480px]:border-b">
                  <p className="mb-2 text-zinc-200">src</p>
                  <p className="mb-1 pl-3">components</p>
                  <p className="mb-1 pl-3 text-gold">services</p>
                  <p className="mb-1 pl-6 text-gold">judge0Service.js</p>
                  <p className="pl-3">utils</p>
                </aside>
                <div className="space-y-1 p-4 font-mono text-xs sm:text-sm">
                  {[
                    "export const deployBuild = async (runtime) => {",
                    "  const result = await runtime.compile({ optimize: true });",
                    "  if (!result.ok) return warn('fallback activated');",
                    "  return publish({ region: 'global-edge', mode: 'safe' });",
                    "}"
                  ].map((line, index) => (
                    <div key={line} className="flex gap-3">
                      <span className="select-none text-zinc-500">{index + 1}</span>
                      <code className={index === 3 ? "text-gold" : "text-zinc-200"}>{line}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-7xl px-4">
        <div className="section-frame">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold/80">Platform Strength</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Designed for high-performance teams</h2>
            </div>
            <p className="hidden max-w-md text-sm text-zinc-400 md:block">
              Elegant workflows that feel lightweight, yet powerful enough for enterprise-scale delivery.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featureList.map((feature) => (
              <Card
                key={feature.title}
                className="group relative transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
              >
                <span className="mb-4 inline-flex rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
                  {feature.icon}
                </span>
                <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="section-frame">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/80">Dashboard Preview</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Command metrics at a glance</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Build Success", value: "99.94%" },
              { label: "Avg Runtime", value: "123ms" },
              { label: "Deploys Today", value: "184" }
            ].map((item) => (
              <Card key={item.label} className="p-3">
                <p className="text-xs uppercase tracking-wider text-zinc-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gold">{item.value}</p>
              </Card>
            ))}
          </div>
          <Card className="mt-4 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Activity Log</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li className="flex justify-between"><span>New PR merged: billing-core</span><span className="text-gold">2m ago</span></li>
              <li className="flex justify-between"><span>Edge deploy completed</span><span className="text-gold">8m ago</span></li>
              <li className="flex justify-between"><span>AI patch suggested 4 refactors</span><span className="text-gold">14m ago</span></li>
            </ul>
          </Card>
        </div>

        <div className="section-frame">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/80">Challenge Vault</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Start coding now</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Practice with curated problems directly inside the same premium workspace.
          </p>
          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="rounded-xl border border-gold/20 bg-black-900/70 p-4">
                <LoadingSpinner label="Loading problems..." />
              </div>
            ) : (
              problems.slice(0, 5).map((problem) => (
                <Card key={problem._id} className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-white">{problem.title}</h3>
                    <p className="text-xs uppercase tracking-wider text-zinc-400">{problem.difficulty}</p>
                  </div>
                  <Link
                    to={`/problems/${problem._id}`}
                    className="rounded-full border border-gold/45 px-4 py-1.5 text-xs text-gold transition hover:bg-gold/10"
                  >
                    Solve
                  </Link>
                </Card>
              ))
            )}
            {!loading && error ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-7xl px-4">
        <div className="section-frame">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/80">Social Proof</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Trusted by world-class engineering teams</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="flex flex-col justify-between p-5">
                <div className="mb-3 text-gold">★★★★★</div>
                <p className="mb-4 text-sm leading-relaxed text-zinc-300">"{item.quote}"</p>
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs uppercase tracking-wider text-gold">{item.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="pointer-events-none absolute -right-12 top-1/4 h-48 w-48 rounded-full bg-gold/20 blur-3xl [animation:glowDrift_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-10 top-1/2 h-28 w-28 rounded-full bg-gold/15 blur-3xl [animation:floatUp_6s_ease-in-out_infinite_alternate]" />
    </main>
  );
};

export default ProblemListPage;
