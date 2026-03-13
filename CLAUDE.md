# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an OpenRouter clone - a Turborepo monorepo using Bun as the package manager. The project provides API gateway services with authentication, API key management, model routing, and payment processing.

## Commands

```bash
# Install dependencies
bun install

# Run all apps in development mode
bun dev

# Build all apps and packages
bun run build

# Lint all packages
bun run lint

# Type check all packages
bun run check-types

# Format code
bun run format

# Run a specific app/package
bun dev --filter=primary-backend
bun dev --filter=dashboard-frontend

# Build a specific package
bun run build --filter=primary-backend
```

## Database Commands (Prisma)

The database package is located at `packages/db`. Prisma commands must be run from that directory:

```bash
cd packages/db

# Generate Prisma client
bunx prisma generate

# Create a migration after schema changes
bunx prisma migrate dev --name <migration_name>

# Push schema changes without creating migration
bunx prisma db push

# Open Prisma Studio (database GUI)
bunx prisma studio
```

## Architecture

### Monorepo Structure

```
├── apps/
│   ├── primary-backend/    # Main API server (Elysia/Bun) - port 4000
│   ├── dashboard-frontend/ # React frontend with Bun bundler
│   └── api-backend/        # Placeholder for additional API services
├── packages/
│   ├── db/                 # Shared Prisma client and database schema
│   ├── ui/                 # Shared React components (Button, Card, Code)
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configurations
```

### Backend Architecture (primary-backend)

- **Framework**: Elysia (Bun-native web framework)
- **Runtime**: Bun (not Node.js)
- **Port**: 4000
- **Modules** are organized under `src/modules/` with each module containing:
  - `index.ts` - Route definitions using Elysia
  - `models.ts` - Request/response validation schemas using Elysia's `t` type system
  - `service.ts` - Business logic layer (static methods)

**Module Pattern Example** (auth module):
```typescript
// index.ts - Routes
export const auth = new Elysia({ prefix: "/auth" })
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
  .post("/signup", handler, { body: AuthModel.signUpSchema, response: {...} })

// service.ts - Business logic
export abstract class AuthService {
  static async signUp(email: string, password: string): Promise<string>
  static async signIn(email: string, password: string): Promise<{...}>
}
```

### Database Schema (Prisma)

Located at `packages/db/prisma/schema.prisma`:
- **User**: id, email, password, credits, relations to apiKeys, conversations, onrampTransactions
- **ApiKey**: id, userId, name, apiKey, disabled, deleted flags
- **Company/Model/Provider**: Model catalog with provider mappings and pricing
- **Conversation**: Tracks API usage with token counts
- **OnrampTransaction**: Payment tracking

### Frontend Architecture (dashboard-frontend)

- **Framework**: React 19 with Bun bundler
- **Styling**: Tailwind CSS v4
- **Components**: Uses Radix UI primitives with custom styling
- **Build**: Custom `build.ts` using `bun-plugin-tailwind`

### Shared Package Import Pattern

The `db` package exports the Prisma client directly:
```typescript
import { prisma } from "db";
```

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (Neon database)
- `JWT_SECRET` - Secret for JWT token signing

## Notes

- Uses Bun's built-in password hashing: `Bun.password.hash()` and `Bun.password.verify()`
- JWT handling via `@elysiajs/jwt` plugin
- Database uses Prisma with PostgreSQL adapter (`@prisma/adapter-pg`)
- Prisma client is generated to `packages/db/generated/prisma/` to avoid conflicts

# Files API — TypeScript

The Files API uploads files for use in Messages API requests. Reference files via `file_id` in content blocks, avoiding re-uploads across multiple API calls.

**Beta:** Pass `betas: ["files-api-2025-04-14"]` in your API calls (the SDK sets the required header automatically).

## Key Facts

- Maximum file size: 500 MB
- Total storage: 100 GB per organization
- Files persist until deleted
- File operations (upload, list, delete) are free; content used in messages is billed as input tokens
- Not available on Amazon Bedrock or Google Vertex AI

---

## Upload a File

```typescript
import Anthropic, { toFile } from "@anthropic-ai/sdk";
import fs from "fs";

const client = new Anthropic();

const uploaded = await client.beta.files.upload({
  file: await toFile(fs.createReadStream("report.pdf"), undefined, {
    type: "application/pdf",
  }),
  betas: ["files-api-2025-04-14"],
});

console.log(`File ID: ${uploaded.id}`);
console.log(`Size: ${uploaded.size_bytes} bytes`);
```

---

## Use a File in Messages

### PDF / Text Document

```typescript
const response = await client.beta.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Summarize the key findings in this report." },
        {
          type: "document",
          source: { type: "file", file_id: uploaded.id },
          title: "Q4 Report",
          citations: { enabled: true },
        },
      ],
    },
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response.content[0].text);
```

---

## Manage Files

### List Files

```typescript
const files = await client.beta.files.list({
  betas: ["files-api-2025-04-14"],
});
for (const f of files.data) {
  console.log(`${f.id}: ${f.filename} (${f.size_bytes} bytes)`);
}
```

### Delete a File

```typescript
await client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w", {
  betas: ["files-api-2025-04-14"],
});
```

### Download a File

```typescript
const response = await client.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ["files-api-2025-04-14"] },
);
const content = Buffer.from(await response.arrayBuffer());
await fs.promises.writeFile("output.txt", content);
```
