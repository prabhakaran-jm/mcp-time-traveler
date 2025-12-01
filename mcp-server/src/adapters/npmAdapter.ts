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
      entries.push({ version, releaseDate: date });
    }

    entries.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

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

const MOCK_VERSIONS: Record<string, VersionEntry[]> = {
  "express": [
    { version: "4.17.1", releaseDate: "2020-05-26" },
    { version: "4.18.2", releaseDate: "2022-10-08" },
    { version: "4.19.2", releaseDate: "2024-03-25" }
  ],
  "jest": [
    { version: "26.6.3", releaseDate: "2020-11-25" },
    { version: "27.5.1", releaseDate: "2022-01-31" },
    { version: "29.7.0", releaseDate: "2023-09-22" }
  ],
  "sequelize": [
    { version: "6.3.5", releaseDate: "2020-10-12" },
    { version: "6.28.0", releaseDate: "2023-01-09" }
  ]
};

export function getPackageVersions(packageName: string): VersionEntry[] {
  return MOCK_VERSIONS[packageName] || [];
}
