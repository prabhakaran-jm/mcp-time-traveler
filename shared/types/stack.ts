// Single source of truth for MCP Time-Traveler types

export type Language = "node" | "python" | "ruby";

export type Framework = "express" | "django" | "flask" | "rails" | "none";

export type ExtraCategory = "testing" | "orm" | "auth" | "api" | "frontend";

export interface StackRequest {
  language: Language;
  framework: Framework;
  year: number;
  extras?: string[];
}

export interface StackPackage {
  name: string;
  version: string;
  category?: string;
  notes?: string;
  releasedAt?: string;
  confidence?: number;
}

export interface StackResponse {
  language: Language;
  framework: Framework;
  year: number;
  runtime_version: string;
  package_manager: string;
  packages: StackPackage[];
  notes?: string;
}

export interface ErrorResponse {
  error: "invalid_input" | "unsupported_combination" | "year_out_of_range" | "internal_error";
  message: string;
  details?: Record<string, unknown>;
}

// Legacy alias for backward compatibility
export type Package = StackPackage;
