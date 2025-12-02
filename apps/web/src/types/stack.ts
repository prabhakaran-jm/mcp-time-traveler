// Local type definitions for web frontend
// No cross-package imports for Vite compatibility
// Schema matches .kiro/specs/mcp-spec.md - Input/Output schemas

export type Language = "node" | "python" | "ruby";

export type Framework = "express" | "django" | "flask" | "rails" | "none";

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
  error: string;
  message: string;
}

// Legacy alias for backward compatibility
export type Package = StackPackage;
