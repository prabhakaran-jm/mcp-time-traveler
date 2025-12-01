# Shared Types

Common TypeScript types used across MCP Time-Traveler modules.

## Purpose

Ensures type consistency between:
- `apps/api` - Express API server
- `mcp-server` - MCP tool server
- `apps/web` - React frontend

## Types

### StackRequest
Input schema for historical stack queries.

### StackResponse
Output schema with runtime versions, packages, and notes.

### Package
Individual package with version and category.

### ErrorResponse
Standardized error format.

## Usage

Both `apps/api` and `mcp-server` re-export these types from their own `types/stack.ts` files:

```typescript
import { StackRequest, StackResponse } from "../types/stack.js";
```

This keeps imports simple while maintaining a single source of truth.
