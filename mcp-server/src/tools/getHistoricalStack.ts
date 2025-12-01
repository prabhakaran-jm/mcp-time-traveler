import { StackRequest, StackResponse, Package } from "../core/types.js";
import { pickVersionByYear } from "../core/versionPicker.js";
import { fetchNpmPackageVersions } from "../adapters/npmAdapter.js";
import { fetchPypiPackageVersions } from "../adapters/pypiAdapter.js";
import { fetchRubyGemsPackageVersions } from "../adapters/rubygemsAdapter.js";

const RUNTIME_VERSIONS: Record<string, Record<number, string>> = {
  node: {
    2020: "14.15.0",
    2021: "16.13.0",
    2022: "18.12.0",
    2023: "20.9.0",
    2024: "20.11.0",
    2025: "22.0.0"
  },
  python: {
    2020: "3.8.5",
    2021: "3.9.7",
    2022: "3.10.8",
    2023: "3.11.5",
    2024: "3.12.0",
    2025: "3.12.1"
  },
  ruby: {
    2020: "2.7.2",
    2021: "3.0.3",
    2022: "3.1.3",
    2023: "3.2.2",
    2024: "3.3.0",
    2025: "3.3.0"
  }
};

const PACKAGE_MANAGERS: Record<string, Record<number, string>> = {
  node: {
    2020: "npm@6.14.8",
    2021: "npm@8.1.0",
    2022: "npm@8.19.2",
    2023: "npm@9.8.1",
    2024: "npm@10.2.4",
    2025: "npm@10.5.0"
  },
  python: {
    2020: "pip@20.3.3",
    2021: "pip@21.3.1",
    2022: "pip@22.3.1",
    2023: "pip@23.2.1",
    2024: "pip@24.0",
    2025: "pip@24.0"
  },
  ruby: {
    2020: "bundler@2.1.4",
    2021: "bundler@2.2.33",
    2022: "bundler@2.3.26",
    2023: "bundler@2.4.19",
    2024: "bundler@2.5.6",
    2025: "bundler@2.5.6"
  }
};

async function fetchPackageVersion(
  language: string,
  packageName: string,
  year: number
): Promise<{ version: string; confidence: number }> {
  let versions;
  
  if (language === "node") {
    versions = await fetchNpmPackageVersions(packageName);
  } else if (language === "python") {
    versions = await fetchPypiPackageVersions(packageName);
  } else if (language === "ruby") {
    versions = await fetchRubyGemsPackageVersions(packageName);
  } else {
    throw new Error(`Unsupported language: ${language}`);
  }
  
  const picked = pickVersionByYear(versions, year);
  return { version: picked.version, confidence: picked.confidence };
}

export async function getHistoricalStack(request: StackRequest): Promise<StackResponse> {
  const { language, framework, year, extras = [] } = request;
  
  const runtimeVersion = RUNTIME_VERSIONS[language]?.[year] || "unknown";
  const packageManager = PACKAGE_MANAGERS[language]?.[year] || "unknown";
  
  const packages: Package[] = [];
  
  if (framework !== "none") {
    try {
      const { version, confidence } = await fetchPackageVersion(language, framework, year);
      packages.push({
        name: framework,
        version,
        category: "core",
        notes: `${framework} framework (confidence: ${(confidence * 100).toFixed(0)}%)`
      });
    } catch (error) {
      packages.push({
        name: framework,
        version: "unknown",
        category: "core",
        notes: `Failed to fetch: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    }
  }
  
  if (language === "node" && framework === "express") {
    try {
      const { version, confidence } = await fetchPackageVersion(language, "mongoose", year);
      packages.push({
        name: "mongoose",
        version,
        category: "orm",
        notes: `MongoDB ODM (confidence: ${(confidence * 100).toFixed(0)}%)`
      });
    } catch (error) {
      console.error("Failed to fetch mongoose:", error);
    }
  }
  
  if (language === "python" && framework === "django") {
    try {
      const { version, confidence } = await fetchPackageVersion(language, "django", year);
      packages.push({
        name: "django",
        version,
        category: "core",
        notes: `Django framework (confidence: ${(confidence * 100).toFixed(0)}%)`
      });
    } catch (error) {
      console.error("Failed to fetch django:", error);
    }
  }
  
  if (language === "ruby" && framework === "rails") {
    try {
      const { version, confidence } = await fetchPackageVersion(language, "rails", year);
      packages.push({
        name: "rails",
        version,
        category: "core",
        notes: `Rails framework (confidence: ${(confidence * 100).toFixed(0)}%)`
      });
    } catch (error) {
      console.error("Failed to fetch rails:", error);
    }
  }
  
  if (extras.includes("testing")) {
    const testPkg = language === "node" ? "jest" : language === "python" ? "pytest" : "rspec";
    try {
      const { version, confidence } = await fetchPackageVersion(language, testPkg, year);
      packages.push({
        name: testPkg,
        version,
        category: "testing",
        notes: `Testing framework (confidence: ${(confidence * 100).toFixed(0)}%)`
      });
    } catch (error) {
      console.error(`Failed to fetch ${testPkg}:`, error);
    }
  }
  
  if (extras.includes("orm") && language === "node") {
    try {
      const { version, confidence } = await fetchPackageVersion(language, "sequelize", year);
      packages.push({
        name: "sequelize",
        version,
        category: "orm",
        notes: `SQL ORM (confidence: ${(confidence * 100).toFixed(0)}%)`
      });
    } catch (error) {
      console.error("Failed to fetch sequelize:", error);
    }
  }
  
  const notes = `${language} ${runtimeVersion} was the stable version in ${year}. ` +
    `${framework !== "none" ? `${framework} was widely used.` : ""}`;
  
  return {
    language,
    framework,
    year,
    runtime_version: runtimeVersion,
    package_manager: packageManager,
    packages,
    notes
  };
}
