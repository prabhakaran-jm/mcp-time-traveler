// Generated with Kiro AI, guided by .kiro/specs/app-spec.md and .kiro/specs/mcp-spec.md
import { useState } from "react";
import EnvironmentForm from "../components/EnvironmentForm";
import ResultPanel from "../components/ResultPanel";
import { StackResponse, ErrorResponse } from "../types/stack";

export default function Home() {
  const [result, setResult] = useState<StackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hauntedMode, setHauntedMode] = useState(false);

  // NEW 👇
  const [loading, setLoading] = useState(false);

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

        {/* Pass loading setter down to the form */}
        <EnvironmentForm onResult={handleResult} />

        {/* 🔥 NEW spooky loading message */}
        {loading && (
          <div className="mt-4 text-sm text-amber-300">
            ⏳ Traveling through the code crypts...
          </div>
        )}

        {result && <ResultPanel result={result} hauntedMode={hauntedMode} />}
      </main>
    </div>
  );
}
