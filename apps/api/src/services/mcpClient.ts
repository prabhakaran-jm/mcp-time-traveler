import { StackRequest, StackResponse } from "../types/stack.js";

export async function requestHistoricalStack(req: StackRequest): Promise<StackResponse> {
  // Mock response matching get_historical_stack output schema
  return {
    language: req.language,
    framework: req.framework,
    year: req.year,
    runtime_version: "14.15.0",
    package_manager: "npm@6.14.8",
    packages: [
      {
        name: "express",
        version: "4.17.1",
        category: "core",
        notes: "Stable and widely used in 2020"
      },
      {
        name: "jest",
        version: "26.6.3",
        category: "testing",
        notes: "Dominant testing framework by 2020"
      }
    ],
    notes: "Node 14 LTS (Fermium) was released in October 2020. Express 4.x was mature and stable."
  };
}
