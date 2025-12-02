import { StackRequest, StackResponse, Package } from "../types/stack.js";

const RUNTIME_VERSIONS: Record<string, Record<number, string>> = {
  node: {
    2015: "4.9.1",
    2016: "6.17.1",
    2017: "8.17.0",
    2018: "10.24.1",
    2019: "12.22.12",
    2020: "14.15.0",
    2021: "16.13.0",
    2022: "18.12.0",
    2023: "20.9.0",
    2024: "20.11.0",
    2025: "22.0.0"
  },
  python: {
    2015: "3.4.10",
    2016: "3.5.10",
    2017: "3.6.15",
    2018: "3.7.17",
    2019: "3.7.17",
    2020: "3.8.5",
    2021: "3.9.7",
    2022: "3.10.8",
    2023: "3.11.5",
    2024: "3.12.0",
    2025: "3.12.1"
  },
  ruby: {
    2015: "2.2.10",
    2016: "2.3.8",
    2017: "2.4.10",
    2018: "2.5.9",
    2019: "2.6.10",
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
    2015: "npm@3.10.10",
    2016: "npm@3.10.10",
    2017: "npm@5.6.0",
    2018: "npm@6.14.18",
    2019: "npm@6.14.18",
    2020: "npm@6.14.8",
    2021: "npm@8.1.0",
    2022: "npm@8.19.2",
    2023: "npm@9.8.1",
    2024: "npm@10.2.4",
    2025: "npm@10.5.0"
  },
  python: {
    2015: "pip@7.1.2",
    2016: "pip@8.1.2",
    2017: "pip@9.0.3",
    2018: "pip@10.0.1",
    2019: "pip@19.3.1",
    2020: "pip@20.3.3",
    2021: "pip@21.3.1",
    2022: "pip@22.3.1",
    2023: "pip@23.2.1",
    2024: "pip@24.0",
    2025: "pip@24.0"
  },
  ruby: {
    2015: "bundler@1.10.6",
    2016: "bundler@1.13.7",
    2017: "bundler@1.15.4",
    2018: "bundler@1.16.6",
    2019: "bundler@2.0.2",
    2020: "bundler@2.1.4",
    2021: "bundler@2.2.33",
    2022: "bundler@2.3.26",
    2023: "bundler@2.4.19",
    2024: "bundler@2.5.6",
    2025: "bundler@2.5.6"
  }
};

const FRAMEWORK_VERSIONS: Record<string, Record<number, string>> = {
  express: {
    2015: "4.13.4",
    2016: "4.14.1",
    2017: "4.16.4",
    2018: "4.16.4",
    2019: "4.17.1",
    2020: "4.17.1",
    2021: "4.17.3",
    2022: "4.18.2",
    2023: "4.18.2",
    2024: "4.19.2",
    2025: "4.19.2"
  },
  django: {
    2015: "1.8.19",
    2016: "1.10.8",
    2017: "1.11.29",
    2018: "2.1.15",
    2019: "2.2.28",
    2020: "3.1.14",
    2021: "3.2.20",
    2022: "4.1.10",
    2023: "4.2.4",
    2024: "5.0.6",
    2025: "5.0.6"
  },
  flask: {
    2015: "0.10.1",
    2016: "0.12.5",
    2017: "0.12.5",
    2018: "1.0.4",
    2019: "1.1.4",
    2020: "1.1.4",
    2021: "2.0.3",
    2022: "2.2.5",
    2023: "2.3.3",
    2024: "3.0.3",
    2025: "3.0.3"
  },
  rails: {
    2015: "4.2.11.3",
    2016: "5.0.7.2",
    2017: "5.1.7",
    2018: "5.2.8.1",
    2019: "6.0.6.1",
    2020: "6.0.6.1",
    2021: "6.1.7.4",
    2022: "7.0.6",
    2023: "7.0.6",
    2024: "7.1.3.4",
    2025: "7.1.3.4"
  }
};

export async function generateHistoricalStack(
  request: StackRequest
): Promise<StackResponse> {
  const { language, framework, year, extras = [] } = request;

  const runtimeVersion = RUNTIME_VERSIONS[language]?.[year] || "unknown";
  const packageManager = PACKAGE_MANAGERS[language]?.[year] || "unknown";

  const packages: Package[] = [];

  if (framework !== "none") {
    const version = FRAMEWORK_VERSIONS[framework]?.[year] || "latest";
    packages.push({
      name: framework,
      version,
      category: "core",
      notes: `${framework} framework for ${language}`
    });
  }

  if (extras.includes("testing")) {
    const testPkg = language === "node" ? "jest" : language === "python" ? "pytest" : "rspec";
    const testConfidence = year < 2018 ? 50 : 90;
    packages.push({
      name: testPkg,
      version: "latest",
      category: "testing",
      notes: `Testing framework (confidence: ${testConfidence}%)`
    });
  }

  if (extras.includes("orm")) {
    const ormPkg = language === "node" ? "sequelize" : language === "python" ? "sqlalchemy" : "activerecord";
    const ormConfidence = year < 2017 ? 60 : 85;
    packages.push({
      name: ormPkg,
      version: "latest",
      category: "orm",
      notes: `ORM for database access (confidence: ${ormConfidence}%)`
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
