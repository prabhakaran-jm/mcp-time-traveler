import { VersionEntry } from "../types/stack.js";

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
