# Coding Style Guide - MCP Time-Traveler

## General Principles

- **Small functions**: Keep functions under 30 lines. One responsibility per function.
- **Readable files**: Max 300 lines per file. Split larger modules into multiple files.
- **Clear naming**: Use descriptive names. `getUserById` not `get`. `isValid` not `check`.
- **No magic numbers**: Use named constants. `MAX_COMMITS = 10000` not `10000`.
- **Early returns**: Avoid deep nesting. Return early on error conditions.

## TypeScript Conventions (API + MCP Server)

### Types & Interfaces

```typescript
// Use interfaces for objects, types for unions/primitives
interface StackRequest {
  language: string;
  framework: string;
  year: number;
}

type Language = "node" | "python" | "ruby";

// Export types that cross boundaries
export interface ToolResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}
```

### Functions

```typescript
// Explicit return types
function getHistoricalStack(req: StackRequest): StackResponse {
  // implementation
}

// Async functions return Promise
async function executeGitCommand(cmd: string): Promise<string> {
  // implementation
}

// Use arrow functions for callbacks
const filtered = items.filter(item => item.year === 2020);
```

### Error Handling

```typescript
// Use custom error types
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Handle errors explicitly
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  return { 
    success: false, 
    error: error instanceof Error ? error.message : "Unknown error" 
  };
}
```

### File Organization

```
src/
  tools/           # MCP tool implementations
  utils/           # Helper functions
  types/           # Type definitions
  validators/      # Input validation
  index.ts         # Entry point
```

## React Conventions (Web App)

### Components

```typescript
// Functional components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

### Hooks

```typescript
// Custom hooks start with 'use'
function useHistoricalStack(year: number) {
  const [stack, setStack] = useState<StackResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // fetch logic
  }, [year]);
  
  return { stack, loading };
}
```

### File Structure

```
components/
  Button/
    Button.tsx
    Button.test.tsx
  StackViewer/
    StackViewer.tsx
    StackViewer.test.tsx
```

### State Management

- Use `useState` for local component state
- Use `useContext` for shared state (avoid prop drilling)
- Keep state close to where it's used
- Lift state only when necessary

## Testing Philosophy

### Simple & Focused

- **Test behavior, not implementation**: Test what the function does, not how it does it
- **One assertion per test**: Each test should verify one thing
- **Arrange-Act-Assert**: Structure tests clearly

```typescript
// Good test
test("getHistoricalStack returns Node 14 for year 2020", () => {
  const result = getHistoricalStack({ language: "node", framework: "express", year: 2020 });
  expect(result.runtime_version).toBe("14.15.0");
});

// Bad test (too many assertions)
test("getHistoricalStack works", () => {
  const result = getHistoricalStack({ language: "node", framework: "express", year: 2020 });
  expect(result.runtime_version).toBe("14.15.0");
  expect(result.packages.length).toBeGreaterThan(0);
  expect(result.notes).toContain("LTS");
  // ... too much
});
```

### Coverage Goals

- **Critical paths**: 100% coverage for validators, error handlers, core logic
- **Happy paths**: Test main use cases thoroughly
- **Edge cases**: Test boundaries (min/max years, empty inputs, invalid data)
- **Don't test**: External libraries, trivial getters/setters

### Test Naming

```typescript
// Pattern: "should [expected behavior] when [condition]"
test("should return error when year is out of range", () => {});
test("should include testing packages when extras contains 'testing'", () => {});
test("should execute git command successfully with valid input", () => {});
```

## Code Review Checklist

Before committing, verify:

- [ ] No `any` types (use `unknown` if truly dynamic)
- [ ] All functions have return types
- [ ] Error cases are handled
- [ ] No console.log (use proper logging)
- [ ] Tests pass
- [ ] No unused imports or variables
- [ ] File is under 300 lines

## Formatting

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Always use them
- **Line length**: Max 100 characters
- **Trailing commas**: Use them in multi-line arrays/objects

Let Prettier handle formatting automatically.

## Architectural principles

- Adapters stay stateless and pure.
- Shared types do not contain logic, only data shapes.
- The API does not call registries directly; it always goes through the MCP layer.
- UI components stay presentational; data fetching lives in hooks or services.

## Common Violations and Fixes

### Violation: Magic Numbers

**Bad:**
```typescript
if (year < 2015 || year > 2025) {
  throw new Error("Invalid year");
}

const maxRetries = 3;
if (attempts > 3) {
  // ...
}
```

**Good:**
```typescript
const MIN_YEAR = 2015;
const MAX_YEAR = 2025;
const MAX_RETRIES = 3;

if (year < MIN_YEAR || year > MAX_YEAR) {
  throw new Error("Invalid year");
}

if (attempts > MAX_RETRIES) {
  // ...
}
```

### Violation: Missing Return Types

**Bad:**
```typescript
function getPackageVersion(packageName: string) {
  return fetch(`/api/package/${packageName}`);
}
```

**Good:**
```typescript
function getPackageVersion(packageName: string): Promise<PackageVersion> {
  return fetch(`/api/package/${packageName}`);
}
```

### Violation: Deep Nesting

**Bad:**
```typescript
function processStack(request: StackRequest) {
  if (request.language) {
    if (request.framework) {
      if (request.year >= 2015) {
        if (request.year <= 2025) {
          // actual logic here
        }
      }
    }
  }
}
```

**Good:**
```typescript
function processStack(request: StackRequest): StackResponse {
  if (!request.language || !request.framework) {
    throw new ValidationError("Missing required fields");
  }
  
  if (request.year < MIN_YEAR || request.year > MAX_YEAR) {
    throw new ValidationError("Year out of range");
  }
  
  // actual logic here
}
```

### Violation: Using `any` Type

**Bad:**
```typescript
function parseResponse(data: any): StackResponse {
  return {
    language: data.language,
    // ...
  };
}
```

**Good:**
```typescript
function parseResponse(data: unknown): StackResponse {
  if (!isStackResponse(data)) {
    throw new Error("Invalid response format");
  }
  return data;
}

function isStackResponse(data: unknown): data is StackResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "language" in data &&
    "framework" in data &&
    "year" in data
  );
}
```

### Violation: Large Function

**Bad:**
```typescript
function generateStack(request: StackRequest): StackResponse {
  // 50+ lines of logic mixing validation, fetching, processing, formatting
  const runtimeVersion = RUNTIME_VERSIONS[request.language]?.[request.year] || "unknown";
  const packageManager = PACKAGE_MANAGERS[request.language]?.[request.year] || "unknown";
  const packages: Package[] = [];
  // ... 40 more lines
  return { /* ... */ };
}
```

**Good:**
```typescript
function generateStack(request: StackRequest): StackResponse {
  validateRequest(request);
  const runtimeVersion = getRuntimeVersion(request.language, request.year);
  const packageManager = getPackageManager(request.language, request.year);
  const packages = buildPackageList(request);
  return formatResponse(request, runtimeVersion, packageManager, packages);
}

function validateRequest(request: StackRequest): void {
  // validation logic
}

function getRuntimeVersion(language: string, year: number): string {
  // version lookup logic
}

function buildPackageList(request: StackRequest): Package[] {
  // package building logic
}

function formatResponse(/* ... */): StackResponse {
  // formatting logic
}
```