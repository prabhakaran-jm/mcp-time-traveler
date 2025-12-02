import { useState } from "react";
import { StackResponse, ErrorResponse } from "../types/stack";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

interface EnvironmentFormProps {
  onResult: (result: StackResponse | ErrorResponse) => void;
}

export default function EnvironmentForm({ onResult }: EnvironmentFormProps) {
  const [language, setLanguage] = useState<"node" | "python" | "ruby">("node");
  const [framework, setFramework] = useState<string>("express");
  const [year, setYear] = useState<number>(2020);
  const [extrasText, setExtrasText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const extras = extrasText
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          framework,
          year: Number(year),
          extras
        })
      });

      const data = await response.json();
      onResult(data);
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : "Something went wrong";

      const friendlyMsg =
        rawMsg === "Failed to fetch"
          ? "Could not reach the Time-Traveler engine. It might be asleep or unreachable. Try a different year, or check that the backend is running."
          : rawMsg;

      setError(friendlyMsg);
      onResult({
        error: "internal_error",
        message: friendlyMsg
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="language">Language</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as "node" | "python" | "ruby")}
          disabled={loading}
        >
          <option value="node">Node.js</option>
          <option value="python">Python</option>
          <option value="ruby">Ruby</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="framework">Framework</label>
        <select
          id="framework"
          value={framework}
          onChange={(e) => setFramework(e.target.value)}
          disabled={loading}
        >
          <option value="express">Express</option>
          <option value="django">Django</option>
          <option value="flask">Flask</option>
          <option value="rails">Rails</option>
          <option value="none">None</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="year">Year</label>
        <input
          id="year"
          type="number"
          min="2015"
          max="2025"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="extras">Extras (comma-separated)</label>
        <input
          id="extras"
          type="text"
          placeholder="testing, orm, auth"
          value={extrasText}
          onChange={(e) => setExtrasText(e.target.value)}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Generate Stack"}
      </button>

      {/* New spooky loading message */}
      {loading && (
        <div className="mt-4 text-sm text-amber-300">
          ⏳ Traveling through the code crypts...
        </div>
      )}

      {error && (
        <div className="error mt-4 text-red-400">
          👻 The spirits encountered a problem:<br />
          <span className="font-mono text-red-300">{error}</span><br />
          🪦 Try a different year or adjust your inputs.
        </div>
)}

    </form>
  );
}
