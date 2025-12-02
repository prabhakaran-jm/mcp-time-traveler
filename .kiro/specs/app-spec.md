---
name: app-spec
title: MCP Time-Traveler Application
description: Full-stack application for generating historically accurate technology stacks
status: complete
version: 1.0.0
---

# MCP Time-Traveler - Application Specification

## Purpose

MCP Time-Traveler is a web application and REST API that generates historically accurate technology stacks for any year between 2015-2025. It fetches real package version data from npm, PyPI, and RubyGems registries, applies intelligent version-picking algorithms with confidence scoring, and presents results through a Kiroween-themed web interface.

The system helps developers understand what package versions were available and popular in specific years, enabling accurate recreation of historical development environments.

## Scope

### In Scope
- Web UI for selecting language, framework, year, and optional extras
- REST API that processes stack generation requests
- MCP server integration for AI assistant queries
- Real-time package version lookup from public registries (npm, PyPI, RubyGems)
- Confidence scoring for version recommendations
- Haunted Mode UI feature for highlighting uncertain data
- Support for Node.js/Express, Python/Django/Flask, Ruby/Rails

### Out of Scope
- Package installation or environment setup
- Version compatibility analysis
- Security vulnerability scanning
- Custom package registry support
- Historical package download statistics
- Automated testing of generated stacks

## Supported Stacks

### Languages & Frameworks
- **Node.js**: Express
- **Python**: Django, Flask
- **Ruby**: Rails

### Optional Extras
- Testing frameworks (jest, pytest, rspec)
- ORMs (sequelize, sqlalchemy, activerecord)
- Auth libraries
- API tools
- Frontend packages

## Core Flows

### Flow 1: Generate Historical Stack (Web UI)

1. **User Input**
   - Selects language from dropdown (Node.js, Python, Ruby)
   - Selects framework from dropdown (Express, Django, Flask, Rails, None)
   - Enters target year (2015-2025)
   - Optionally adds extras (comma-separated: testing, orm, auth)
   - Optionally enables Haunted Mode toggle

2. **API Request**
   - Web app sends POST to `/api/generate`
   - Request body: `{ language, framework, year, extras }`
   - API validates input (year range, valid language/framework)

3. **Stack Generation**
   - API calls internal stack service
   - Service queries package registries for version data
   - Version picker algorithm selects appropriate versions
   - Confidence scores calculated based on data quality

4. **Response Display**
   - API returns StackResponse with runtime, packages, notes
   - Web UI displays results in card layout
   - If Haunted Mode enabled, low-confidence packages highlighted with ⚠️
   - User can adjust inputs and regenerate

### Flow 2: Generate Historical Stack (MCP Tool)

1. **AI Query**
   - User asks AI assistant: "What packages were popular for Node.js in 2020?"
   - AI assistant invokes `get_historical_stack` MCP tool

2. **MCP Processing**
   - MCP server receives tool call with parameters
   - Validates input (year range, language/framework combination)
   - Queries package registries via adapters

3. **Version Selection**
   - Fetches all versions with release dates
   - Filters versions released before/during target year
   - Picks latest version in range (confidence: 0.9)
   - Falls back to earliest version if none in range (confidence: 0.5)

4. **Response**
   - MCP server returns structured JSON
   - AI assistant formats response for user
   - Includes confidence warnings for uncertain data

### Flow 3: Registry Data Lookup

1. **Adapter Selection**
   - Based on language, select appropriate adapter (npm, PyPI, RubyGems)

2. **API Call**
   - npm: `GET https://registry.npmjs.org/{package}`
   - PyPI: `GET https://pypi.org/pypi/{package}/json`
   - RubyGems: `GET https://rubygems.org/api/v1/versions/{package}.json`

3. **Data Parsing**
   - Extract version numbers and release dates
   - Build VersionEntry array: `{ version, date }`
   - Sort by date ascending

4. **Error Handling**
   - 404: Package not found → return error
   - Timeout: Registry unavailable → return error
   - Invalid data: Missing dates → use fallback logic

## Data Model

### StackRequest
```typescript
{
  language: "node" | "python" | "ruby"
  framework: "express" | "django" | "flask" | "rails" | "none"
  year: number  // 2015-2025
  extras?: string[]  // ["testing", "orm", "auth", "api", "frontend"]
}
```

### StackResponse
```typescript
{
  language: Language
  framework: Framework
  year: number
  runtime_version: string  // e.g., "14.15.0", "3.8.5", "2.7.2"
  package_manager: string  // e.g., "npm@6.14.8", "pip@20.3.3"
  packages: StackPackage[]
  notes?: string  // Historical context and warnings
}
```

### StackPackage
```typescript
{
  name: string
  version: string
  category?: string  // "core", "testing", "orm", "auth", etc.
  notes?: string  // Package-specific context
  releasedAt?: string  // ISO date
  confidence?: number  // 0.0-1.0 (0.5 = fallback, 0.9 = accurate)
}
```

### Confidence Scoring
- **0.9**: Version found within target year (high confidence)
- **0.5**: Fallback to earliest available version (low confidence)
- **< 0.8**: Triggers Haunted Mode warning in UI

## UI Features

### Haunted Mode
- Toggle switch: "🦇 Haunted Mode (show warnings)"
- When enabled:
  - Packages with confidence < 0.8 get orange border
  - Warning icon ⚠️ displayed next to package name
  - Helps users identify uncertain version recommendations

### Kiroween Theme
- Dark background (#1a1a2e)
- Purple (#7b2cbf) and orange (#ff6b35) accents
- Ghost 👻 and pumpkin 🎃 icons
- Gradient buttons with hover effects
- Card-based layouts with shadows

### Form Validation
- Year must be 2015-2025
- Language and framework required
- Extras optional (comma-separated)
- Real-time error messages
- Loading states during API calls

## Error Cases

### Invalid Input
- **Year out of range**: Return 400 with `year_out_of_range` error
- **Missing required fields**: Return 400 with `invalid_input` error
- **Invalid language/framework**: Return 400 with `invalid_input` error

### Registry Failures
- **Package not found**: Include in response with "unknown" version
- **Registry timeout**: Return 500 with `internal_error` and retry suggestion
- **Rate limiting**: Return 429 with retry-after header

### Unsupported Combinations
- **Framework mismatch**: e.g., Django with Node.js → Return 400
- **Unknown extras**: Ignore silently or return warning in notes

### Data Quality Issues
- **Missing release dates**: Use fallback logic, set confidence to 0.5
- **Incomplete version history**: Return available data with warning
- **No versions in range**: Return earliest version with low confidence

## Non-Functional Requirements

### Performance
- API response time < 3 seconds for typical requests
- Registry lookups cached for 1 hour
- Parallel registry queries when possible
- Web UI loads in < 2 seconds

### Reliability
- Graceful degradation when registries unavailable
- Clear error messages with actionable guidance
- Fallback to static version data if all registries fail
- No crashes on invalid input

### Usability
- Intuitive form with sensible defaults
- Keyboard-friendly navigation
- Clear confidence indicators
- Historical context in notes field
- Mobile-responsive design

### Security
- Input validation on all fields
- No code execution or eval
- CORS enabled for web UI
- Rate limiting on API endpoints
- Sanitized error messages (no stack traces)

### Maintainability
- Shared types across API, web, and MCP server
- Modular adapter pattern for registries
- Clear separation of concerns
- Comprehensive error handling
- Documented API endpoints

## Success Criteria

- User can generate accurate stacks for any supported language/framework/year
- Confidence scores accurately reflect data quality
- Haunted Mode correctly highlights uncertain packages
- API responds within 3 seconds for 95% of requests
- Clear error messages for all failure cases
- Web UI works on desktop and mobile browsers
- MCP integration enables conversational queries
- Zero crashes or unhandled exceptions in production
