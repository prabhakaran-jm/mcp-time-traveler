# API Conventions - MCP Time-Traveler

## REST Endpoint Design

### Naming
- Use plural nouns for resources: `/api/stacks` not `/api/stack`
- Use kebab-case for multi-word endpoints: `/api/historical-stacks`
- Keep URLs short and meaningful

### HTTP Methods
- **POST** for creating or generating resources
- **GET** for retrieving data
- **PUT** for full updates
- **PATCH** for partial updates
- **DELETE** for removing resources

### Current Endpoints
- `POST /api/generate` - Generate historical stack
- `GET /health` - Health check

## Request/Response Format

### Request Body
Always use JSON with Content-Type: application/json

```typescript
{
  "language": "node",
  "framework": "express",
  "year": 2020,
  "extras": ["testing", "orm"]
}
```

### Success Response (200)
```typescript
{
  "language": "node",
  "framework": "express",
  "year": 2020,
  "runtime_version": "14.15.0",
  "package_manager": "npm@6.14.8",
  "packages": [...],
  "notes": "..."
}
```

### Error Response (4xx/5xx)
```typescript
{
  "error": "invalid_input" | "year_out_of_range" | "internal_error",
  "message": "Human-readable error message",
  "details": { /* optional context */ }
}
```

## Error Handling Standards

### Validation Errors (400)
- Missing required fields
- Invalid enum values
- Type mismatches

### Business Logic Errors (400)
- Year out of range (2015-2025)
- Unsupported language/framework combination

### Server Errors (500)
- Registry API failures
- Unexpected exceptions
- Timeout errors

### Error Response Pattern
```typescript
try {
  // operation
  res.json(result);
} catch (error) {
  res.status(500).json({
    error: "internal_error",
    message: error instanceof Error ? error.message : "Unknown error"
  });
}
```

## Input Validation

### Required Fields
- Validate presence before processing
- Return clear error messages
- Use TypeScript types for compile-time safety

### Range Validation
```typescript
if (year < 2015 || year > 2025) {
  res.status(400).json({
    error: "year_out_of_range",
    message: "Year must be between 2015 and 2025"
  });
  return;
}
```

### Enum Validation
```typescript
const VALID_LANGUAGES = ["node", "python", "ruby"];
if (!VALID_LANGUAGES.includes(language)) {
  res.status(400).json({
    error: "invalid_input",
    message: `Invalid language. Must be one of: ${VALID_LANGUAGES.join(", ")}`
  });
  return;
}
```

## CORS Configuration

Enable CORS for web UI:
```typescript
app.use(cors());
```

For production, restrict origins:
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*"
}));
```

## Logging

### Development
- Use `console.log` for debugging
- Remove before production

### Production
- Use structured logging (e.g., winston, pino)
- Log errors with context
- Never log sensitive data

## Response Times

### Performance Targets
- Health check: < 100ms
- Stack generation: < 3 seconds
- Registry lookups: < 2 seconds each

### Timeout Handling
- Set reasonable timeouts for external APIs
- Return partial results if some registries fail
- Include timeout info in error messages

## Type Safety

### Request Typing
```typescript
router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  const { language, framework, year } = req.body;
  // validation and processing
});
```

### Response Typing
```typescript
interface StackResponse {
  language: Language;
  framework: Framework;
  year: number;
  // ...
}
```

## Testing Conventions

### Manual Testing
```bash
curl -X POST http://localhost:4000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"language":"node","framework":"express","year":2020}'
```

### Error Case Testing
- Test all validation rules
- Test with missing fields
- Test with invalid values
- Test with edge cases (year 2015, 2025)

## Documentation

### Endpoint Documentation
- Include in README.md
- Show example requests and responses
- Document all error codes
- Provide curl examples

### Code Comments
- Explain business logic, not syntax
- Document non-obvious decisions
- Reference specs when applicable

## Security

### Input Sanitization
- Validate all inputs
- Prevent injection attacks
- Limit request size

### Rate Limiting
- Consider adding rate limiting for production
- Protect against abuse
- Return 429 status with Retry-After header

### Error Messages
- Don't expose internal details
- Don't include stack traces in production
- Provide actionable guidance

## Deployment

### Environment Variables
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - CORS origins

### Health Check
Always provide a health endpoint:
```typescript
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});
```

## Consistency with Specs

All API behavior should match `.kiro/specs/app-spec.md`:
- Data models
- Error cases
- Non-functional requirements
- Success criteria
