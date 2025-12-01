import type { StackRequest, StackResponse, Package, Language, Framework } from "../types/stack.js";

interface VersionInfo {
  runtime: string;
  packageManager: string;
}

function getRuntimeVersion(language: Language, year: number): VersionInfo {
  if (language === "node") {
    const nodeVersions: Record<number, VersionInfo> = {
      2015: { runtime: "4.9.1", packageManager: "npm@3.10.10" },
      2016: { runtime: "6.17.1", packageManager: "npm@3.10.10" },
      2017: { runtime: "8.17.0", packageManager: "npm@5.10.0" },
      2018: { runtime: "10.24.1", packageManager: "npm@6.14.12" },
      2019: { runtime: "12.22.12", packageManager: "npm@6.14.16" },
      2020: { runtime: "14.15.0", packageManager: "npm@6.14.8" },
      2021: { runtime: "16.20.2", packageManager: "npm@8.19.4" },
      2022: { runtime: "18.12.0", packageManager: "npm@8.19.2" },
      2023: { runtime: "20.9.0", packageManager: "npm@9.8.1" },
      2024: { runtime: "20.11.0", packageManager: "npm@10.2.4" },
      2025: { runtime: "22.0.0", packageManager: "npm@10.5.0" }
    };
    return nodeVersions[year];
  }

  if (language === "python") {
    const pythonVersions: Record<number, VersionInfo> = {
      2015: { runtime: "3.4.10", packageManager: "pip@7.1.2" },
      2016: { runtime: "3.5.10", packageManager: "pip@8.1.2" },
      2017: { runtime: "3.6.15", packageManager: "pip@9.0.3" },
      2018: { runtime: "3.7.17", packageManager: "pip@10.0.1" },
      2019: { runtime: "3.7.17", packageManager: "pip@19.3.1" },
      2020: { runtime: "3.8.18", packageManager: "pip@20.3.4" },
      2021: { runtime: "3.9.18", packageManager: "pip@21.3.1" },
      2022: { runtime: "3.10.13", packageManager: "pip@22.3.1" },
      2023: { runtime: "3.11.7", packageManager: "pip@23.3.2" },
      2024: { runtime: "3.12.1", packageManager: "pip@24.0" },
      2025: { runtime: "3.12.2", packageManager: "pip@24.0" }
    };
    return pythonVersions[year];
  }

  if (language === "ruby") {
    const rubyVersions: Record<number, VersionInfo> = {
      2015: { runtime: "2.2.10", packageManager: "bundler@1.10.6" },
      2016: { runtime: "2.3.8", packageManager: "bundler@1.13.7" },
      2017: { runtime: "2.4.10", packageManager: "bundler@1.15.4" },
      2018: { runtime: "2.5.9", packageManager: "bundler@1.16.6" },
      2019: { runtime: "2.6.10", packageManager: "bundler@2.0.2" },
      2020: { runtime: "2.7.8", packageManager: "bundler@2.1.4" },
      2021: { runtime: "3.0.6", packageManager: "bundler@2.2.33" },
      2022: { runtime: "3.1.4", packageManager: "bundler@2.3.26" },
      2023: { runtime: "3.2.2", packageManager: "bundler@2.4.22" },
      2024: { runtime: "3.3.0", packageManager: "bundler@2.5.6" },
      2025: { runtime: "3.3.0", packageManager: "bundler@2.5.6" }
    };
    return rubyVersions[year];
  }

  return { runtime: "unknown", packageManager: "unknown" };
}
