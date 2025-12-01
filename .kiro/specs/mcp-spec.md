# MCP Tool Specification - Time-Traveler

## Tool: get_historical_stack

Returns historically accurate technology stack recommendations for a given language, framework, and year. Helps developers understand what versions and packages were commonly used at specific points in time.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "language": {
      "type": "string",
      "enum": ["node", "python", "ruby"],
      "description": "Programming language"
    },
    "framework": {
      "type": "string",
      "enum": ["express", "django", "flask", "rails", "none"],
      "description": "Web framework (use 'none' for language-only)"
    },
    "year": {
      "type": "integer",
      "minimum": 2015,
      "maximum": 2025,
      "description": "Target year for stack recommendation"
    },
    "extras": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["testing", "orm", "auth", "api", "frontend"]
      },
      "description": "Optional additional package categories",
      "default": []
    }
  },
  "required": ["language", "framework", "year"]
}
```

### Output Schema

```json
{
  "type": "object",
  "properties": {
    "language": {
      "type": "string",
      "description": "Echo of requested language"
    },
    "framework": {
      "type": "string",
      "description": "Echo of requested framework"
    },
    "year": {
      "type": "integer",
      "description": "Echo of requested year"
    },
    "runtime_version": {
      "type": "string",
      "description": "Recommended runtime version (e.g., '18.12.0', '3.9.7', '3.1.2')"
    },
    "package_manager": {
      "type": "string",
      "description": "Recommended package manager and version (e.g., 'npm@8.19.2', 'pip@22.0', 'bundler@2.3.0')"
    },
    "packages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Package name"
          },
          "version": {
            "type": "string",
            "description": "Recommended version or range"
          },
          "category": {
            "type": "string",
            "enum": ["core", "testing", "orm", "auth", "api", "frontend", "utility"],
            "description": "Package category"
          },
          "notes": {
            "type": "string",
            "description": "Optional context about this package in that year"
          }
        },
        "required": ["name", "version", "category"]
      },
      "description": "List of recommended packages with versions"
    },
    "notes": {
      "type": "string",
      "description": "Historical context and recommendations for this stack"
    }
  },
  "required": ["language", "framework", "year", "runtime_version", "package_manager", "packages", "notes"]
}
```

### Error Schema

```json
{
  "type": "object",
  "properties": {
    "error": {
      "type": "string",
      "enum": ["invalid_input", "unsupported_combination", "year_out_of_range", "internal_error"],
      "description": "Error type"
    },
    "message": {
      "type": "string",
      "description": "Human-readable error message"
    },
    "details": {
      "type": "object",
      "description": "Additional error context",
      "additionalProperties": true
    }
  },
  "required": ["error", "message"]
}
```

### Version Selection Rules by Year

#### Node.js
- 2015: Node 4.x (LTS Argon), npm 3.x
- 2016: Node 6.x (LTS Boron), npm 3.x
- 2017: Node 8.x (LTS Carbon), npm 5.x
- 2018: Node 10.x (LTS Dubnium), npm 6.x
- 2019: Node 12.x (LTS Erbium), npm 6.x
- 2020: Node 14.x (LTS Fermium), npm 6.x
- 2021: Node 16.x (LTS Gallium), npm 7.x-8.x
- 2022: Node 18.x (LTS Hydrogen), npm 8.x
- 2023: Node 18.x/20.x (LTS Iron), npm 9.x
- 2024: Node 20.x (LTS Iron), npm 10.x
- 2025: Node 22.x (LTS Jod), npm 10.x

#### Python
- 2015: Python 2.7 or 3.4, pip 7.x
- 2016: Python 3.5, pip 8.x
- 2017: Python 3.6, pip 9.x
- 2018: Python 3.7, pip 10.x
- 2019: Python 3.7, pip 19.x
- 2020: Python 3.8, pip 20.x
- 2021: Python 3.9, pip 21.x
- 2022: Python 3.10, pip 22.x
- 2023: Python 3.11, pip 23.x
- 2024: Python 3.12, pip 24.x
- 2025: Python 3.12/3.13, pip 24.x

#### Ruby
- 2015: Ruby 2.2, Bundler 1.10
- 2016: Ruby 2.3, Bundler 1.13
- 2017: Ruby 2.4, Bundler 1.15
- 2018: Ruby 2.5, Bundler 1.16
- 2019: Ruby 2.6, Bundler 2.0
- 2020: Ruby 2.7, Bundler 2.1
- 2021: Ruby 3.0, Bundler 2.2
- 2022: Ruby 3.1, Bundler 2.3
- 2023: Ruby 3.2, Bundler 2.4
- 2024: Ruby 3.3, Bundler 2.5
- 2025: Ruby 3.3, Bundler 2.5

### Framework Version Rules

#### Express (Node.js)
- 2015-2017: Express 4.x (4.13-4.16)
- 2018-2021: Express 4.x (4.16-4.17)
- 2022-2025: Express 4.x (4.18+) or Express 5.x (beta/stable)

#### Django (Python)
- 2015: Django 1.8 LTS
- 2016-2017: Django 1.11 LTS
- 2018-2019: Django 2.2 LTS
- 2020-2021: Django 3.2 LTS
- 2022-2023: Django 4.0-4.2 LTS
- 2024-2025: Django 5.0+

#### Flask (Python)
- 2015-2017: Flask 0.10-0.12
- 2018-2019: Flask 1.0-1.1
- 2020-2021: Flask 1.1-2.0
- 2022-2023: Flask 2.0-2.3
- 2024-2025: Flask 3.0+

#### Rails (Ruby)
- 2015: Rails 4.2
- 2016-2017: Rails 5.0-5.1
- 2018-2019: Rails 5.2
- 2020-2021: Rails 6.0-6.1
- 2022-2023: Rails 7.0
- 2024-2025: Rails 7.1+

### Implementation Notes

1. **Precision**: Return the last stable minor version released in the target year
2. **Extras Handling**: Only include packages for requested extras categories
3. **Historical Accuracy**: Use actual release dates, not just version numbers
4. **Deprecation Warnings**: Include notes about deprecated features in that year
5. **Security Context**: Mention if versions have known vulnerabilities (historical context)
6. **Ecosystem State**: Describe what was popular/emerging in that year

### Example Request

```json
{
  "language": "node",
  "framework": "express",
  "year": 2020,
  "extras": ["testing", "orm"]
}
```

### Example Response

```json
{
  "language": "node",
  "framework": "express",
  "year": 2020,
  "runtime_version": "14.15.0",
  "package_manager": "npm@6.14.8",
  "packages": [
    {
      "name": "express",
      "version": "4.17.1",
      "category": "core",
      "notes": "Stable and widely used in 2020"
    },
    {
      "name": "jest",
      "version": "26.6.3",
      "category": "testing",
      "notes": "Dominant testing framework by 2020"
    },
    {
      "name": "sequelize",
      "version": "6.3.5",
      "category": "orm",
      "notes": "Popular ORM, v6 released in 2020"
    }
  ],
  "notes": "Node 14 LTS (Fermium) was released in October 2020. Express 4.x was mature and stable. TypeScript adoption was growing rapidly. ES2020 features were widely supported."
}
```
