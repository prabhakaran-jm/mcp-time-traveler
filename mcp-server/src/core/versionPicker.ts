// AI-GEN: Implemented with Kiro from the spec in .kiro/specs/mcp-spec.md.
// AI-GEN: This function picks the latest version published on or before the target year.
// It hides the complexity of comparing release dates across npm, PyPI, and RubyGems.
import { VersionEntry } from "./types.js";

export function pickVersionByYear(
  versions: VersionEntry[],
  targetYear: number
): (VersionEntry & { confidence: number }) | null {
  if (versions.length === 0) {
    return null;
  }

  const targetEndDate = new Date(`${targetYear}-12-31`);

  const eligibleVersions = versions.filter((v) => {
    const releaseDate = new Date(v.date);
    return releaseDate <= targetEndDate;
  });

  if (eligibleVersions.length > 0) {
    eligibleVersions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return {
      ...eligibleVersions[0],
      confidence: 0.9
    };
  }

  const sortedVersions = [...versions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return {
    ...sortedVersions[0],
    confidence: 0.5
  };
}

export function pickVersionForYear(
  versions: VersionEntry[],
  targetYear: number
): string | null {
  const targetYearStr = targetYear.toString();
  
  const matchingVersions = versions.filter(v => 
    v.date.startsWith(targetYearStr)
  );
  
  if (matchingVersions.length === 0) {
    return null;
  }
  
  matchingVersions.sort((a, b) => 
    b.date.localeCompare(a.date)
  );
  
  return matchingVersions[0].version;
}
