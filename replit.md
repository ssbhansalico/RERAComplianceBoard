# Gujarat RERA Information Board Generator

## Overview

This is a web application for generating RERA (Real Estate Regulatory Authority) compliant information boards for real estate projects in Gujarat, India, as per Order 112. The application provides a bilingual form interface (English and Gujarati) that allows users to input project details and generate a printable information board with all mandatory fields required by Gujarat RERA regulations.

The application is built as a single-page form with live preview functionality, enabling real estate developers and promoters to create compliant project information boards that must be displayed at construction sites.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The design follows Material Design principles optimized for form-heavy, data-driven government compliance applications.

**Design System**:
- Typography: Noto Sans for bilingual support (English and Gujarati), Roboto for UI elements
- Spacing: Tailwind utility classes with predefined spacing units (3, 4, 6, 8, 12, 16, 24)
- Layout: Two-column desktop layout (60% form, 40% preview) with responsive single-column mobile layout
- Color scheme: Neutral base with customizable HSL color variables for theming

**State Management**: React hooks for local component state, with React Query (@tanstack/react-query) configured for potential API interactions.

**Routing**: Wouter library for lightweight client-side routing (currently single-route application).

**Key Features**:
- Live preview panel that updates in real-time as users fill the form
- Bilingual label system for all form fields (English primary, Gujarati secondary)
- Dynamic block/unit entry table supporting multiple blocks with shops, offices, and residential units
- QR code image upload with drag-and-drop functionality
- Background color toggle (yellow/white) for board customization
- Print-optimized preview that scales to match actual board dimensions

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**Server Structure**:
- Entry point: `server/index.ts` with HTTP server creation
- Route registration: Modular route system in `server/routes.ts` (currently minimal, designed for future API endpoints)
- Static file serving: Production builds served from `dist/public` directory
- Development mode: Vite middleware integration for HMR (Hot Module Replacement)

**Storage Interface**: Abstracted storage pattern with `IStorage` interface currently implemented as in-memory storage (`MemStorage`). Designed to be easily swappable with database-backed storage (PostgreSQL via Drizzle ORM is configured but not yet utilized).

**Build System**: Custom esbuild-based bundler that bundles server dependencies to reduce cold start times, with allowlist for critical dependencies to inline.

### Data Layer

**ORM**: Drizzle ORM configured for PostgreSQL with schema definition in `shared/schema.ts`.

**Current Schema**: Minimal user table (id, username, password) serving as a template for future data models. The application currently operates client-side only without persistence.

**Migration System**: Drizzle Kit for schema migrations with configuration in `drizzle.config.ts` pointing to PostgreSQL database via `DATABASE_URL` environment variable.

**Validation**: Zod schemas integrated with Drizzle for runtime type validation and form validation (via @hookform/resolvers).

### External Dependencies

**UI Framework Dependencies**:
- Radix UI: Complete set of accessible, unstyled component primitives (accordion, dialog, dropdown, select, toast, etc.)
- Tailwind CSS: Utility-first CSS framework with custom configuration
- Class Variance Authority: For component variant management
- Lucide React: Icon library

**Form Management**:
- React Hook Form: Form state management and validation
- Zod: Schema validation library

**Database & ORM**:
- Drizzle ORM: TypeScript ORM for SQL databases
- @neondatabase/serverless: PostgreSQL driver for serverless environments
- Drizzle Kit: Database migration tool

**Development Tools**:
- Vite: Frontend build tool and dev server
- esbuild: JavaScript bundler for server-side code
- TypeScript: Type-safe development
- ESLint/Prettier configuration (via Replit plugins)

**Utility Libraries**:
- date-fns: Date manipulation and formatting
- clsx + tailwind-merge: Conditional CSS class composition
- nanoid: Unique ID generation

**Future Integration Points**: The application architecture supports adding:
- User authentication and session management (passport.js dependencies present)
- Database persistence for saving board configurations
- PDF generation for downloadable boards
- API endpoints for CRUD operations on project data