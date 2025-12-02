import type { StackRequest, ErrorResponse } from "../types/stack";

const VALID_LANGUAGES = ["node", "python", "ruby"] as const;
const VALID_FRAMEWORKS = ["express", "django", "flask", "rails", "none"] as const;
const VALID_EXTRAS = ["testing", "orm", "auth", "api", "frontend"] as const;
const MIN_YEAR = 2015;
const MAX_YEAR = 2025;

export function validateStackRequest(input: unknown): StackRequest | ErrorResponse {
  if (!input || typeof input !== "object") {
    return {
      error: "invalid_input",
      message: "Request body must be an object"
    };
  }

  const req = input as Record<string, unknown>;

  if (!req.language || typeof req.language !== "string") {
    return {
      error: "invalid_input",
      message: "Missing or invalid 'language' field"
    };
  }

  if (!VALID_LANGUAGES.includes(req.language as any)) {
    return {
      error: "invalid_input",
      message: `Invalid language. Must be one of: ${VALID_LANGUAGES.join(", ")}`
    };
  }

  if (!req.framework || typeof req.framework !== "string") {
    return {
      error: "invalid_input",
      message: "Missing or invalid 'framework' field"
    };
  }

  if (!VALID_FRAMEWORKS.includes(req.framework as any)) {
    return {
      error: "invalid_input",
      message: `Invalid framework. Must be one of: ${VALID_FRAMEWORKS.join(", ")}`
    };
  }

  if (!req.year || typeof req.year !== "number") {
    return {
      error: "invalid_input",
      message: "Missing or invalid 'year' field"
    };
  }

  if (req.year < MIN_YEAR || req.year > MAX_YEAR) {
    return {
      error: "year_out_of_range",
      message: `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`,
      details: { min: MIN_YEAR, max: MAX_YEAR, provided: req.year }
    };
  }

  let extras: string[] = [];
  if (req.extras) {
    if (!Array.isArray(req.extras)) {
      return {
        error: "invalid_input",
        message: "'extras' must be an array"
      };
    }

    for (const extra of req.extras) {
      if (typeof extra !== "string" || !VALID_EXTRAS.includes(extra as any)) {
        return {
          error: "invalid_input",
          message: `Invalid extra category. Must be one of: ${VALID_EXTRAS.join(", ")}`
        };
      }
    }
    extras = req.extras as string[];
  }

  return {
    language: req.language as any,
    framework: req.framework as any,
    year: req.year,
    extras
  };
}
