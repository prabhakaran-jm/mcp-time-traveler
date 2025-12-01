import { useState } from "react";
import EnvironmentForm from "../components/EnvironmentForm";
import ResultPanel from "../components/ResultPanel";
import { StackRequest, StackResponse, ErrorResponse } from "../types/stack";

export default function Home() {
  const [result, setResult] = useState<StackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(request: StackRequest): Promise<void> {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        setError(errorData.message);
        return;
      }

      setResult(data as StackResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>🎃 MCP Time-Traveler</h1>
        <p>Generate historically accurate technology stacks</p>
      </header>

      <main>
        <EnvironmentForm onSubmit={handleSubmit} loading={loading} />
        {error && <div className="error">{error}</div>}
        {result && <ResultPanel result={result} />}
      </main>
    </div>
  );
}
