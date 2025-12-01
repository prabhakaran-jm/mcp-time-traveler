import axios from "axios";
import { VersionEntry } from "../core/types.js";

interface PypiRelease {
  upload_time: string;
}

interface PypiResponse {
  releases: Record<string, PypiRelease[]>;
}

export async function fetchPypiPackageVersions(
  packageName: string
): Promise<VersionEntry[]> {
  try {
    const url = `https://pypi.org/pypi/${packageName}/json`;
    const response = await axios.get<PypiResponse>(url);

    if (!response.data.releases) {
      throw new Error(`Package "${packageName}" has no releases`);
    }

    const entries: VersionEntry[] = [];

    for (const [version, releases] of Object.entries(response.data.releases)) {
      if (releases.length === 0) {
        continue;
      }
      const uploadTime = releases[0].upload_time;
      entries.push({ version, releaseDate: uploadTime.split("T")[0] });
    }

    entries.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

    return entries;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Package "${packageName}" not found in PyPI`);
    }
    throw new Error(
      `Failed to fetch versions for "${packageName}": ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
