import { useState } from "react";
import EnvironmentForm from "../components/EnvironmentForm";
import ResultPanel from "../components/ResultPanel";
import { StackResponse, ErrorResponse } from "../types/stack";

export default function Home() {
  const [result, setResult] = useState<StackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hauntedMode, setHauntedMode] = useState(false);

  function handleResult(data: StackResponse | ErrorResponse): void {
    if ("error" in data) {
      setError(data.message);
      setResult(null);
    } else {
      setResult(data);
      setError(null);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>👻 MCP Time-Traveler 🎃</h1>
        <p>Generate historically accurate technology stacks</p>
      </header>

      <main>
        <div className="haunted-toggle">
          <label>
            <input
              type="checkbox"
              checked={hauntedMode}
              onChange={(e) => setHauntedMode(e.target.checked)}
            />
            <span>🦇 Haunted Mode (show warnings)</span>
          </label>
        </div>

        <EnvironmentForm onResult={handleResult} />
        {error && <div className="error">{error}</div>}
        {result && <ResultPanel result={result} hauntedMode={hauntedMode} />}
      </main>
    </div>
  );
}
