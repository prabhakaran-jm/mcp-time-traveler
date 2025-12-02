// Generated with Kiro AI, guided by .kiro/specs/app-spec.md and .kiro/specs/mcp-spec.md
// Frankenstein's Lab: This stitches the Heart (API) to the Brain (MCP server)
// The API doesn't call registries directly; it always goes through the MCP layer per steering doc
import { StackRequest, StackResponse, ErrorResponse } from "../types/stack";
import { generateHistoricalStack } from "./stackService";

// FRANKENSTEIN STITCH: MCP client pumps data from brain (MCP server) through heart (API) to skin (UI)
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
