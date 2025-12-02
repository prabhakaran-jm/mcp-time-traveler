# Development Log – MCP Time-Traveler + Kiro

Built in December 2025 as a solo developer using Kiro as the primary IDE.

## Major Kiro Sessions

- Session 1: Generated the initial monorepo scaffold (apps/api, apps/web, mcp-server, shared/types)
  - Used `gen:scaffold` hook to generate base structure from specs
  - Vibe coding: "Create a monorepo with Express API, React frontend, and MCP server"
  
- Session 2: Refined app-spec and mcp-spec, regenerated types and handlers
  - Ran `gen:scaffold` hook after spec updates to sync TypeScript types
  - Vibe coding: "Update StackRequest type to match the new spec with optional extras array"
  - Pre-commit hook caught 2 type errors before commit
  
- Session 3: Implemented registry adapters for npm, PyPI, and RubyGems
  - Vibe coding: "Create adapters that fetch version history from npm, PyPI, and RubyGems APIs"
  - Followed steering doc: small functions, early returns, clear error handling
  
- Session 4: Built the React Kiroween UI, including Haunted Mode
  - Vibe coding: "Add a haunted mode toggle that highlights low-confidence packages with warning icons"
  - Generated ResultPanel component with haunted styling based on spec requirements
  
- Session 5: Wired up the MCP server and API integration
  - Vibe coding: "Connect the Express API to call the MCP server for stack generation"
  - Pre-commit hook validated all TypeScript types before integration commit
  
- Session 6: Deployment fixes for Heroku (API) and Vercel (web)
  - Fixed build scripts and environment variables
  - Pre-commit hook ensured no type errors before deployment

## Hook Usage Summary

- **gen:scaffold**: Used in Sessions 1 and 2 to generate/update project structure from specs
- **pre-commit**: Used regularly (Sessions 2, 5, 6) to catch type errors before commits
  - Caught 2 type errors in Session 2
  - Validated all modules before integration in Session 5
  - Ensured clean build before deployment in Session 6

### Hook Execution Examples

**Session 1 - gen:scaffold hook output:**
```
Reading specs from .kiro/specs/app-spec.md and mcp-spec.md...
Generating project structure:
✓ Created apps/api/src/server.ts
✓ Created apps/api/src/routes/generate.ts
✓ Created apps/web/src/main.tsx
✓ Created mcp-server/src/index.ts
✓ Created shared/types/stack.ts
✓ Generated TypeScript types matching spec schemas
All scaffolding complete. Ready for implementation.
```

**Session 2 - pre-commit hook output:**
```
Running pre-commit checks...
Checking apps/api...
apps/api/src/routes/generate.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'Language'.
Checking mcp-server...
Checking apps/web...
✗ Pre-commit failed: 2 type errors found
Fix errors before committing.
```

**Session 5 - pre-commit hook output (success):**
```
Running pre-commit checks...
Checking apps/api...
✓ No type errors
Checking mcp-server...
✓ No type errors
Checking apps/web...
✓ No type errors
All checks passed!
```

### Additional Vibe Coding Examples

**Session 1.5** (between Sessions 1 and 2):
- Prompt: "The spec says StackRequest should have an optional extras array. Can you update the type definition and regenerate the API route handler?"
- Result: Kiro updated `shared/types/stack.ts` and regenerated `apps/api/src/routes/generate.ts` to handle the new field

**Session 3.5** (registry adapter refinement):
- Prompt: "The npm adapter is working but PyPI returns dates in a different format. Can you handle both ISO dates and 'YYYY-MM-DD' strings?"
- Result: Kiro updated `pypiAdapter.ts` to normalize date formats, following the steering doc's error handling patterns

**Session 4.5** (UI polish):
- Prompt: "The haunted mode warnings look good, but can you make the warning icon pulse slightly to draw attention?"
- Result: Kiro added CSS animation to `.warning-icon` with subtle pulse effect

**Session 5.5** (MCP integration debugging):
- Prompt: "The MCP server works when I test it directly, but the API can't connect. The error says 'spawn node ENOENT'. What's wrong?"
- Result: Kiro identified missing path resolution in `mcpClient.ts` and fixed the command execution

Kiro was active in all of these sessions for both code and documentation. The spec-driven approach allowed rapid iteration: update spec → run gen:scaffold → implement → validate with pre-commit.
