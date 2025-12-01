import { useState } from "react";
import { StackRequest } from "../types/stack";

interface EnvironmentFormProps {
  onSubmit: (request: StackRequest) => Promise<void>;
  loading: boolean;
}

export default function EnvironmentForm({ onSubmit, loading }: EnvironmentFormProps) {
  const [language, setLanguage] = useState<"node" | "python" | "ruby">("node");
  const [framework, setFramework] = useState<string>("express");
  const [year, setYear] = useState<number>(2020);
  const [extrasText, setExtrasText] = useState<string>("");

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();

    const extras = extrasText
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const request: StackRequest = {
      language,
      framework: framework as StackRequest["framework"],
      year,
      extras
    };

    onSubmit(request);
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
        {loading ? "Generating..." : "Generate Stack"}
      </button>
    </form>
  );
}
