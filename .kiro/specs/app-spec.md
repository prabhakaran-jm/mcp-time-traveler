# MCP Time-Traveler - Application Specification

## Purpose

MCP Time-Traveler is a Model Context Protocol (MCP) server that enables AI agents to analyze codebases across different points in their Git history. It allows developers and AI assistants to understand how code evolved, compare implementations across commits, and make informed decisions based on historical context.

## Scope

This MVP provides a read-only MCP server that exposes Git history operations through standardized MCP tools. The server integrates with Kiro and other MCP-compatible AI assistants to answer questions like "How did this function change over time?" or "What did the authentication logic look like 3 months ago?"

### In Scope
- Read-only Git operations (log, show, diff, blame)
- Time-based and commit-based navigation
- File content retrieval at specific commits
- Branch and tag listing
- Multi-language support (Node.js, Python, Ruby)

### Out of Scope
- Write operations (commit, push, merge)
- Git configuration changes
- Repository cloning or initialization
- Interactive rebase or conflict resolution

## User Stories

**As a developer**, I want to ask my AI assistant "Show me how the login function changed in the last 6 months" so I can understand the evolution of critical code.

**As a code reviewer**, I want to compare the current implementation with a specific commit to understand what changed and why.

**As a team lead**, I want to trace when a particular bug was introduced by examining file history and blame information.

**As a developer**, I want to see what the codebase looked like at a specific release tag to understand production behavior.

## Functional Flow

1. **Server Initialization**: MCP server starts and validates Git repository access
2. **Tool Discovery**: AI agent queries available MCP tools (git_log, git_show, git_diff, git_blame, list_branches)
3. **Query Execution**: Agent invokes tools with parameters (commit hash, file path, date range)
4. **Response Formatting**: Server executes Git commands and returns structured JSON responses
5. **Context Integration**: Agent uses historical data to answer user questions

### Example Interaction
```
User: "How did auth.js change between v1.0 and v2.0?"
Agent: [Calls git_diff tool with from="v1.0", to="v2.0", path="auth.js"]
Server: [Returns diff output]
Agent: "The authentication logic was refactored to use JWT tokens instead of sessions..."
```

## MVP Supported Stacks

### Node.js / Express
- Runtime: Node.js 18+
- MCP SDK: @modelcontextprotocol/sdk
- Git execution: child_process with git CLI
- Package manager: npm or yarn

### Python / Django / Flask
- Runtime: Python 3.8+
- MCP SDK: mcp Python package
- Git execution: subprocess with git CLI or GitPython library
- Package manager: pip or uv

### Ruby / Rails
- Runtime: Ruby 3.0+
- MCP SDK: ruby-mcp gem (or direct stdio implementation)
- Git execution: Open3 with git CLI or rugged gem
- Package manager: bundler

## Core MCP Tools

1. **git_log**: List commits with filters (author, date range, file path)
2. **git_show**: Display commit details and file contents at specific commits
3. **git_diff**: Compare files or commits
4. **git_blame**: Show line-by-line commit attribution
5. **list_branches**: List all branches and tags
6. **get_file_at_commit**: Retrieve file content at a specific point in history

## Non-Functional Constraints

### Performance
- Git operations must complete within 5 seconds for typical repositories
- Support repositories up to 10,000 commits
- Limit diff output to 10,000 lines to prevent memory issues

### Security
- Read-only operations only - no modifications to repository
- Validate all file paths to prevent directory traversal
- Sanitize Git command inputs to prevent command injection
- Run with minimal file system permissions

### Compatibility
- Requires Git 2.20+ installed on system
- Must work with local repositories only (no remote operations)
- Support standard Git repository structures
- Cross-platform: Windows, macOS, Linux

### Reliability
- Graceful error handling for invalid commits or missing files
- Clear error messages for Git command failures
- Validate repository exists before executing commands
- Handle edge cases (empty repos, detached HEAD, etc.)

### Usability
- JSON-formatted responses for easy parsing
- Consistent error response structure
- Tool descriptions clear enough for AI agents to use autonomously
- Minimal configuration required (auto-detect repository path)

## Success Criteria

- AI agent can successfully query Git history without human intervention
- All 6 core tools function correctly across supported languages
- Server handles errors gracefully without crashing
- Installation takes less than 5 minutes per stack
- Demo showcases at least 3 different time-travel queries
