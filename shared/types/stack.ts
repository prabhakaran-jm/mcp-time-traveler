export interface StackRequest {
  language: "node" | "python" | "ruby";
  framework: "express" | "django" | "flask" | "rails" | "none";
  year: number;
  extras?: string[];
}

export interface Package {
  name: string;
  version: string;
  category: "core" | "testing" | "orm" | "auth" | "api" | "frontend" | "utility";
  notes?: string;
}

export interface StackResponse {
  language: string;
  framework: string;
  year: number;
  runtime_version: string;
  package_manager: string;
  packages: Package[];
  notes: string;
}

export interface ErrorResponse {
  error: "invalid_input" | "unsupported_combination" | "year_out_of_range" | "internal_error";
  message: string;
  details?: Record<string, unknown>;
}
