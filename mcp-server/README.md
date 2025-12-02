# MCP Time-Traveler Server

MCP server that provides historical technology stack recommendations.

## Setup

```bash
cd mcp-server
npm install
npm run build
```

## Usage

### As MCP Server

Add to your Kiro `mcp.json`:

```json
{
  "mcpServers": {
    "mcp-time-traveler": {
      "command": "node",
      "args": ["./dist/index.js"],
      "cwd": "./mcp-server"
    }
  }
}
```

### Development

```bash
npm run dev
```

## Tool: get_historical_stack

Returns historically accurate stack recommendations.

**Input:**
- `language`: "node" | "python" | "ruby"
- `framework`: "express" | "django" | "flask" | "rails" | "none"
- `year`: 2015-2025
- `extras`: ["testing", "orm", "auth", "api", "frontend"] (optional)

**Output:**
- `runtime_version`: Recommended runtime version
- `package_manager`: Package manager with version
- `packages`: Array of recommended packages
- `notes`: Historical context
