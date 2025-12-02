import { StackResponse, Package } from "../types/stack";

interface ResultPanelProps {
  result: StackResponse;
  hauntedMode: boolean;
}

function isLowConfidence(pkg: Package): boolean {
  if (!pkg.notes) return false;
  const confidenceMatch = pkg.notes.match(/confidence[:\s]+(\d+)%/i);
  if (confidenceMatch) {
    const confidence = parseInt(confidenceMatch[1]);
    return confidence < 80;
  }
  return pkg.notes.toLowerCase().includes("may not have existed");
}

export default function ResultPanel({ result, hauntedMode }: ResultPanelProps) {
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
          {result.packages.map((pkg: Package, idx: number) => {
            const lowConfidence = hauntedMode && isLowConfidence(pkg);
            return (
              <li 
                key={idx} 
                className={`package-item ${lowConfidence ? "haunted" : ""}`}
              >
                <div className="package-header">
                  <strong>{pkg.name}</strong>
                  <span className="version">{pkg.version}</span>
                  <span className="category">{pkg.category}</span>
                  {lowConfidence && <span className="warning-icon">⚠️</span>}
                </div>
                {pkg.notes && <p className="package-notes">{pkg.notes}</p>}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="result-section">
        <h3>Historical Context</h3>
        <p>{result.notes}</p>
      </div>
    </div>
  );
}
