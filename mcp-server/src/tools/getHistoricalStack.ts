import { StackRequest, StackResponse, Package } from "../types/stack.js";
import { pickVersionForYear } from "../core/versionPicker.js";
import { getPackageVersions } from "../adapters/npmAdapter.js";

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

export function getHistoricalStack(request: StackRequest): StackResponse {
  const { language, framework, year, extras = [] } = request;
  
  const runtimeVersion = RUNTIME_VERSIONS[language]?.[year] || "unknown";
  const packageManager = PACKAGE_MANAGERS[language]?.[year] || "unknown";
  
  const packages: Package[] = [];
  
  if (framework !== "none") {
    const versions = getPackageVersions(framework);
    const version = pickVersionForYear(versions, year) || "latest";
    packages.push({
      name: framework,
      version,
      category: "core",
      notes: `${framework} framework for ${language}`
    });
  }
  
  if (extras.includes("testing")) {
    const testPkg = language === "node" ? "jest" : "pytest";
    const versions = getPackageVersions(testPkg);
    const version = pickVersionForYear(versions, year) || "latest";
    packages.push({
      name: testPkg,
      version,
      category: "testing",
      notes: "Testing framework"
    });
  }
  
  if (extras.includes("orm")) {
    const ormPkg = language === "node" ? "sequelize" : "sqlalchemy";
    const versions = getPackageVersions(ormPkg);
    const version = pickVersionForYear(versions, year) || "latest";
    packages.push({
      name: ormPkg,
      version,
      category: "orm",
      notes: "ORM for database access"
    });
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
