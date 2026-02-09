# SvelteKit Project Template

A personal SvelteKit template with established patterns, architecture, and utilities for rapid project scaffolding.

## 🚀 Quick Start

1. **Copy this template** to a new project folder
2. **Read the guide files** before starting:
   - `SETUP.md` - How to initialize and deploy projects
   - `PROJECT_GUIDE.md` - Workflow for building with AI agents
   - `CODING_PATTERNS.md` - Coding style and architectural patterns
3. **Initialize the project**:
   ```bash
   npm install
   npm run dev
   ```

## 📁 Template Structure

```
├── CODING_PATTERNS.md      # Coding style guide and patterns
├── PROJECT_GUIDE.md         # Agent workflow guide
├── SETUP.md                 # Project setup instructions
├── PROGRESS.md.template     # Progress tracking template
├── src/
│   ├── lib/
│   │   ├── CORE/           # Core utilities (errors, logging, validation)
│   │   ├── VOCAB/          # Reference domain implementation
│   │   ├── EXAMPLE_CORE/   # Improved core utilities template
│   │   └── EXAMPLE_DATA/   # Example domain architecture
│   ├── routes/
│   │   ├── +layout.ts      # Root layout (client)
│   │   ├── +layout.server.ts # Root layout (server)
│   │   └── +page.svelte    # Homepage
│   └── hooks.server.ts     # Server hooks (auth, etc.)
```

## 🏗️ Architecture

### Layer Pattern
- **DAL** (Database Access Layer) - Direct database operations
- **SERVICE** - Business logic orchestration
- **UTILS** - Pure utility functions

### Naming Convention
- `DAL_<action>_<entity>` - Database functions
- `<DOMAIN>SERVICE_<action>` - Service functions
- `<DOMAIN>UTIL_<description>` - Utility functions

### Example Domains
- `EXAMPLE_DATA/` - Product/Order domain example
- `EXAMPLE_CORE/` - Enhanced core utilities
- `VOCAB/` - Reference implementation (vocabulary domain)

## 🎯 Key Features

- **Supabase Integration** - Pre-configured auth and database
- **Error Handling** - Layered error frames with context
- **Type Safety** - Full TypeScript with explicit types
- **Deduplication** - Smart array deduplication for upserts
- **ID Mapping** - Handles temporary negative IDs properly
- **Validation** - Comprehensive validation utilities

## 📚 Documentation

- **CODING_PATTERNS.md** - Complete style guide with examples
- **PROJECT_GUIDE.md** - Step-by-step workflow for agents
- **SETUP.md** - Deployment and configuration guide
- **EXAMPLE_DATA/AGENTS.md** - Domain architecture documentation

## 🛠️ Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤖 Working with AI Agents

When starting a new project with an AI agent:

```
Read PROJECT_GUIDE.md. This is a new project.

Project description:
[Your project description here]

Start Phase 1: Conceptual Alignment.
```

The agent will follow the established workflow and coding patterns automatically.

## 📝 Tech Stack

- **SvelteKit** - Web framework
- **Svelte 5** - UI framework (with runes)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Backend (auth + database)

## 🎨 Coding Style

- **snake_case** for variables and functions
- **Camel_Snake_Case** for types and components
- **Explicit layer prefixes** (DAL_, SERVICE_, UTIL_)
- **Verbose names** over abbreviations
- **Early returns** over deep nesting
- **Simple over clever**

See `CODING_PATTERNS.md` for complete guidelines.

## 📦 What's Included

### CORE Utilities
- Error handling with frames
- Logging (dev/prod)
- Response helpers
- Validation utilities
- Array/object utilities

### Example Implementations
- **EXAMPLE_DATA** - Complete domain (Product/Order)
- **EXAMPLE_CORE** - Enhanced utilities
- **VOCAB** - Reference implementation

### Configuration
- Supabase auth hooks
- Layout files (server + client)
- Environment setup
- TypeScript config

## 🔒 Safety Rules

- Never delete files without permission
- Ask before installing packages
- Keep files under 300 lines
- Test after each feature
- Document bugs in PROGRESS.md

## 📖 License

Personal template - use as you wish for your own projects.
