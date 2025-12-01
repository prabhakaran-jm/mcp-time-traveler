import { VersionEntry } from "./types.js";

export function pickVersionByYear(
  versions: VersionEntry[],
  targetYear: number
): VersionEntry & { confidence: number } {
  if (versions.length === 0) {
    throw new Error("No versions available");
  }

  const targetEndDate = new Date(`${targetYear}-12-31`);

  const eligibleVersions = versions.filter((v) => {
    const releaseDate = new Date(v.releaseDate);
    return releaseDate <= targetEndDate;
  });

  if (eligibleVersions.length > 0) {
    eligibleVersions.sort((a, b) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return dateB.getTime() - dateA.getTime();
    });

    const latest = eligibleVersions[0];
    return {
      ...latest,
      confidence: 0.9
    };
  }

  versions.sort((a, b) => {
    const dateA = new Date(a.releaseDate);
    const dateB = new Date(b.releaseDate);
    return dateA.getTime() - dateB.getTime();
  });

  const earliest = versions[0];
  return {
    ...earliest,
    confidence: 0.5
  };
}

export function pickVersionForYear(
  versions: VersionEntry[],
  targetYear: number
): string | null {
  const targetYearStr = targetYear.toString();
  
  const matchingVersions = versions.filter(v => 
    v.releaseDate.startsWith(targetYearStr)
  );
  
  if (matchingVersions.length === 0) {
    return null;
  }
  
  matchingVersions.sort((a, b) => 
    b.releaseDate.localeCompare(a.releaseDate)
  );
  
  return matchingVersions[0].version;
}
