import { StackResponse } from "../types/stack";

interface ResultPanelProps {
  result: StackResponse;
}

export default function ResultPanel({ result }: ResultPanelProps) {
  return (
    <div className="result-panel">
      <h2>Stack for {result.year}</h2>

      <div className="result-section">
        <h3>Runtime</h3>
        <p><strong>{result.language}</strong> {result.runtime_version}</p>
        <p><strong>Package Manager:</strong> {result.package_manager}</p>
      </div>

      <div className="result-section">
        <h3>Packages</h3>
        <ul className="package-list">
          {result.packages.map((pkg, idx) => (
            <li key={idx} className="package-item">
              <div className="package-header">
                <strong>{pkg.name}</strong>
                <span className="version">{pkg.version}</span>
                <span className="category">{pkg.category}</span>
              </div>
              {pkg.notes && <p className="package-notes">{pkg.notes}</p>}
            </li>
          ))}
        </ul>
      </div>

      <div className="result-section">
        <h3>Historical Context</h3>
        <p>{result.notes}</p>
      </div>
    </div>
  );
}
