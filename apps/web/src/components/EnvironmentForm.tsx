import { useState } from "react";
import { StackResponse, ErrorResponse } from "../types/stack";

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
      const response = await fetch("http://localhost:4000/api/generate", {
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
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMsg);
      onResult({
        error: "internal_error",
        message: errorMsg
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

      {error && <div className="error">{error}</div>}
    </form>
  );
}
