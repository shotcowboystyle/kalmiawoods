# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vacation rental website for Kalmia Woods, a mountain rental property near Lake Jocassee and Lake Keowee. It's built with Astro 3.6.5 using SSR (server-side rendering) with Vue 3 components, TypeScript, Tailwind CSS, and deployed on Vercel.

## Architecture

### Tech Stack
- **Framework**: Astro with Vue 3 integration and SSR
- **Styling**: Tailwind CSS with DaisyUI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Lucia Auth v2
- **Deployment**: Vercel with serverless functions
- **Testing**: Playwright for E2E tests
- **Package Manager**: pnpm
- **Build Tool**: Turbo for monorepo management

### Key Directories
- `src/pages/` - Astro pages (both .astro and .vue files)
- `src/components/` - Vue and Astro components (prefixed with `Kw` for custom components)
- `src/lib/` - Core utilities (database, auth, logging, sentry)
- `prisma/` - Database schema and migrations
- `e2e/tests/` - Playwright tests organized by type (accessibility, pages, performance, visual)

### Database Schema
Uses Prisma with PostgreSQL featuring:
- **User management**: Users, UserProfile, authentication sessions
- **Reservations**: Guest booking system with check-in/out dates
- **Email tracking**: Sent email history
- **Enums**: User roles (USER/ADMIN) and Building types (HOUSE/GARAGE/WORKSHOP)

## Common Development Commands

### Development
```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm preview                # Preview production build
```

### Database Operations
```bash
pnpm db:generate            # Generate Prisma client
pnpm db:migrate:dev         # Run migrations in development
pnpm db:migrate:deploy      # Deploy migrations to production
pnpm db:push                # Push schema changes without migrations
pnpm db:seed                # Seed database
pnpm prisma:studio          # Open Prisma Studio
```

### Code Quality
```bash
pnpm lint                   # Run ESLint
pnpm lint:fix               # Fix linting issues
pnpm format                 # Format code with Prettier
pnpm types:check            # Type check with TypeScript and Astro
pnpm validate               # Run all checks (format, lint, types, test)
```

### Testing
```bash
pnpm test                   # Run all Playwright tests
pnpm test:e2e:accessibility # Run accessibility tests
pnpm test:e2e:pages         # Run page tests
pnpm test:e2e:performance   # Run performance tests
pnpm test:e2e:visual        # Run visual regression tests
pnpm test:playwright:ui     # Open Playwright UI
```

## Development Notes

### Vue Integration
- Vue components use `<script setup>` with TypeScript
- Custom components are prefixed with `Kw` (e.g., `KwButton`, `KwForm`)
- Auto-imports configured for Vue composables and VueUse
- Astro pages can import Vue components directly

### Authentication Flow
- Uses Lucia Auth v2 with Prisma adapter
- Session-based authentication with database storage
- User profiles separate from auth users
- Email verification and password reset tokens supported

### Styling Conventions
- Tailwind CSS with custom configuration
- DaisyUI component library integration
- PostCSS with nesting and preset-env
- Responsive design with mobile-first approach

### Build Process
- Astro builds to `dist/` with Vercel adapter
- Turbo manages build pipeline dependencies
- Prisma client generation required before builds
- Bundle analysis available with rollup visualizer

### Environment Setup
- Uses pnpm workspaces (though appears to be single package)
- Husky for git hooks with lint-staged
- Commitizen for conventional commits
- Renovate for dependency updates