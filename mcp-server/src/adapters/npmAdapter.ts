import axios from "axios";
import { VersionEntry } from "../core/types.js";

interface NpmRegistryResponse {
  time: Record<string, string>;
  versions: Record<string, unknown>;
}

export async function fetchNpmPackageVersions(
  packageName: string
): Promise<VersionEntry[]> {
  try {
    const url = `https://registry.npmjs.org/${packageName}`;
    const response = await axios.get<NpmRegistryResponse>(url);

    if (!response.data.time) {
      throw new Error(`Package "${packageName}" has no version history`);
    }

    const entries: VersionEntry[] = [];

    for (const [version, date] of Object.entries(response.data.time)) {
      if (version === "created" || version === "modified") {
        continue;
      }
      entries.push({ version, date });
    }

    entries.sort((a, b) => a.date.localeCompare(b.date));

    return entries;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Package "${packageName}" not found in npm registry`);
    }
    throw new Error(
      `Failed to fetch versions for "${packageName}": ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}


