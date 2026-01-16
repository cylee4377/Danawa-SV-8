# Danawa Car Sales Radar

## Overview

A Korean automotive sales analytics dashboard that tracks and displays "surge" models from Danawa's monthly car sales data. The application analyzes domestic and imported vehicle sales, calculating composite scores based on month-over-month changes, percentage growth, and ranking movements to identify rapidly rising models.

The MVP approach focuses on derived metrics (surge scores, growth rates, rank changes) rather than raw data redistribution, with links back to original Danawa sources for each model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful JSON endpoints under /api prefix
- **Data Parser**: Custom parser module (danawa-parser.ts) that processes Danawa sales data and calculates surge scores
- **Storage**: In-memory cache (MemStorage class) with interface abstraction for future database migration

### Key API Endpoints
- `GET /api/radar` - Fetch radar data with nation (domestic/export) and month filters
- `GET /api/months` - Get available months for selection

### Data Model
The core entity is `RadarModel` which tracks:
- Sales figures (current and previous month)
- Month-over-month absolute and percentage changes
- Rank and rank changes
- Composite surge score
- Reference to original Danawa URL

### Scoring Algorithm
Surge detection uses a composite scoring approach combining:
1. Month-over-month absolute change (momAbs)
2. Month-over-month percentage change (momPct)
3. Rank improvement (rankChange)

Noise filtering: minimum sales threshold (default 300 units) and positive growth requirement.

### Build System
- Development: tsx for TypeScript execution with Vite HMR
- Production: esbuild bundles server code, Vite builds client to dist/public
- Database migrations: Drizzle Kit with push command

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via DATABASE_URL environment variable)
- **Drizzle ORM**: Type-safe database queries with Zod schema integration
- **connect-pg-simple**: Session storage for PostgreSQL

### Data Source
- **Danawa Auto**: External data source for Korean car sales statistics
  - Domestic models: `https://auto.danawa.com/auto/?Month=YYYY-MM-00&Nation=domestic&Tab=Model&Work=record`
  - Import models: `https://auto.danawa.com/auto/?Month=YYYY-MM-00&Nation=export&Tab=Model&Work=record`
  - Note: Data is based on KAMA/KAIDA official sources with specific update schedules

### UI Framework Dependencies
- Radix UI primitives (dialog, dropdown, tabs, etc.)
- Lucide React for icons
- class-variance-authority for component variants
- date-fns for date formatting

### Development Tools
- Replit-specific Vite plugins for error overlay and dev tooling
- TypeScript with strict mode and bundler module resolution