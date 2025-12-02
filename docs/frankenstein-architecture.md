# 🧟 Frankenstein Architecture

## The Assembled Creature

```
                    ⚡ LIGHTNING BOLT ⚡
                           |
                           v
        ╔══════════════════════════════════════╗
        ║     👻 MCP TIME-TRAVELER 🎃         ║
        ╚══════════════════════════════════════╝

┌─────────────────────────────────────────────────────┐
│  🧠 THE BRAIN                                       │
│  MCP Server (TypeScript + MCP SDK)                 │
│  • Reasons over registry history                   │
│  • Coordinates all components                      │
│  • Exposes get_historical_stack tool               │
└─────────────────────────────────────────────────────┘
                         ⚡
                         ↓
┌─────────────────────────────────────────────────────┐
│  ❤️  THE HEART                                      │
│  Express API (TypeScript + Node.js)                │
│  • Pumps data between MCP and UI                   │
│  • Validates requests                              │
│  • Handles errors gracefully                       │
└─────────────────────────────────────────────────────┘
                         ⚡
            ↙            ↓            ↘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 🦾 LEFT LIMB │  │ 🦾 CENTER    │  │ 🦾 RIGHT     │
│              │  │    LIMB      │  │    LIMB      │
│ npm Adapter  │  │ PyPI Adapter │  │ RubyGems     │
│              │  │              │  │ Adapter      │
│ • Fetches    │  │ • Fetches    │  │ • Fetches    │
│   Node.js    │  │   Python     │  │   Ruby       │
│   packages   │  │   packages   │  │   packages   │
└──────────────┘  └──────────────┘  └──────────────┘
       ⚡                ⚡                ⚡
       ↓                 ↓                 ↓
┌─────────────────────────────────────────────────────┐
│  👁️  THE EYES                                       │
│  Version Picker Algorithm                          │
│  • Sees across years (2015-2025)                   │
│  • Picks accurate versions                         │
│  • Calculates confidence scores                    │
└─────────────────────────────────────────────────────┘
                         ⚡
                         ↓
┌─────────────────────────────────────────────────────┐
│  🎨 THE SKIN                                        │
│  React UI (Vite + TypeScript)                      │
│  • Kiroween theme (purple & orange)                │
│  • Haunted Mode for warnings                       │
│  • Deployed on Vercel                              │
└─────────────────────────────────────────────────────┘
                         ⚡
                         ↓
┌─────────────────────────────────────────────────────┐
│  🧬 THE NERVOUS SYSTEM                              │
│  Shared TypeScript Types                           │
│  • StackRequest, StackResponse, StackPackage       │
│  • Connects all components                         │
│  • Ensures type safety                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🔬 THE LABORATORY                                  │
│  Kiro Development Environment                      │
│  • Specs: Requirements & design docs               │
│  • Hooks: Automation (scaffold, pre-commit)        │
│  • Steering: Coding standards                      │
│  • Vibe Coding: Natural language generation        │
└─────────────────────────────────────────────────────┘
```

## Stitching Points

Each component was built separately, then connected:

1. **Brain ↔ Heart**: MCP server exports `getHistoricalStack`, API imports and calls it
2. **Heart ↔ Limbs**: API delegates to adapters based on language
3. **Limbs ↔ Eyes**: Adapters return version data, picker filters by year
4. **Heart ↔ Skin**: API exposes REST endpoint, React calls via fetch
5. **Nervous System**: Shared types ensure all parts speak the same language

## The Spark of Life

The creature came alive through Kiro's features:
- **Specs** defined what each part should do
- **Vibe coding** generated the initial implementations
- **Hooks** automated quality checks
- **Steering** kept the code consistent
- **MCP** enabled AI assistant integration

## Technology Stack by Body Part

| Part | Technologies |
|------|-------------|
| Brain | TypeScript, @modelcontextprotocol/sdk, Node.js |
| Heart | Express, TypeScript, CORS, dotenv |
| Limbs | Axios, npm/PyPI/RubyGems APIs |
| Eyes | TypeScript, Date manipulation |
| Skin | React 18, Vite, CSS3, TypeScript |
| Nervous System | TypeScript interfaces |
| Laboratory | Kiro AI, YAML configs, Markdown specs |
