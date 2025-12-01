#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getHistoricalStack } from "./tools/getHistoricalStack.js";
import { StackRequest } from "./types/stack.js";

const server = new Server(
  {
    name: "mcp-time-traveler",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_historical_stack",
        description: "Returns historically accurate technology stack recommendations for a given language, framework, and year",
        inputSchema: {
          type: "object",
          properties: {
            language: {
              type: "string",
              enum: ["node", "python", "ruby"],
              description: "Programming language"
            },
            framework: {
              type: "string",
              enum: ["express", "django", "flask", "rails", "none"],
              description: "Web framework"
            },
            year: {
              type: "integer",
              minimum: 2015,
              maximum: 2025,
              description: "Target year"
            },
            extras: {
              type: "array",
              items: {
                type: "string",
                enum: ["testing", "orm", "auth", "api", "frontend"]
              },
              description: "Additional package categories"
            }
          },
          required: ["language", "framework", "year"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_historical_stack") {
    const args = request.params.arguments as unknown as StackRequest;
    
    if (args.year < 2015 || args.year > 2025) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "year_out_of_range",
              message: "Year must be between 2015 and 2025"
            })
          }
        ]
      };
    }
    
    const result = getHistoricalStack(args);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Time-Traveler server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
