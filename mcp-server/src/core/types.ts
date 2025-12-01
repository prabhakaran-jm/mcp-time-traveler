// Core types for MCP Time-Traveler server
// Re-exports shared types and adds MCP-specific types

import type {
  StackRequest,
  Package,
  StackResponse,
  ErrorResponse
} from "../../../shared/types/stack.js";

export type {
  StackRequest,
  Package,
  StackResponse,
  ErrorResponse
};

// MCP-specific types
export interface VersionEntry {
  version: string;
  releaseDate: string;
}

// Aliases for clarity in MCP context
export type HistoricalStackRequest = StackRequest;
export type HistoricalStackResult = StackResponse;
export type HistoricalStackError = ErrorResponse;
export type PackageVersionInfo = Package;
