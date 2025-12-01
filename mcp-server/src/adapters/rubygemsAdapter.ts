import axios from "axios";
import { VersionEntry } from "../core/types.js";

interface RubyGemsVersion {
  number: string;
  created_at: string;
}

export async function fetchRubyGemsPackageVersions(
  packageName: string
): Promise<VersionEntry[]> {
  try {
    const url = `https://rubygems.org/api/v1/versions/${packageName}.json`;
    const response = await axios.get<RubyGemsVersion[]>(url);

    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw new Error(`Package "${packageName}" has no versions`);
    }

    const entries: VersionEntry[] = response.data.map((item) => ({
      version: item.number,
      releaseDate: item.created_at.split("T")[0]
    }));

    entries.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

    return entries;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Package "${packageName}" not found in RubyGems`);
    }
    throw new Error(
      `Failed to fetch versions for "${packageName}": ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
