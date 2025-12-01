import { StackRequest, StackResponse, ErrorResponse } from "../types/stack.js";
import { generateHistoricalStack } from "./stackService.js";

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
