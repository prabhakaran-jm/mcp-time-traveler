// Generated with Kiro AI, guided by .kiro/specs/app-spec.md and .kiro/specs/mcp-spec.md
import { StackRequest, StackResponse, ErrorResponse } from "../types/stack";
import { generateHistoricalStack } from "./stackService";

export async function requestHistoricalStack(
  req: StackRequest
): Promise<StackResponse | ErrorResponse> {
  try {
    const result = await generateHistoricalStack(req);
    return result;
  } catch (error) {
    return {
      error: "internal_error",
      message: error instanceof Error ? error.message : "Failed to generate stack",
      details: {
        language: req.language,
        framework: req.framework,
        year: req.year
      }
    };
  }
}
