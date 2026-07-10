# LinkVault — Smart Link Management Platform

A full-stack URL shortening and bookmark management application with click analytics, QR code generation, and rich link organization.

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Radix UI |
| **Backend** | ASP.NET Core 10, C#, Clean Architecture |
| **Database** | PostgreSQL via Entity Framework Core |
| **Auth** | JWT with refresh token rotation |
| **State** | Zustand (client) + TanStack React Query (server) |
| **Validation** | FluentValidation (backend), Zod (frontend) |

## Project Structure

```
linkvault/
├── linkvault-frontend/          # Next.js frontend
│   └── src/
│       ├── app/                 # App Router pages
│       │   ├── (auth)/          # Login, register, password reset
│       │   └── (dashboard)/     # Dashboard, analytics, links, etc.
│       ├── components/          # UI components (Radix-based)
│       ├── hooks/               # React Query hooks
│       ├── lib/                 # API client, utils, validations
│       ├── stores/              # Zustand stores
│       └── types/               # TypeScript interfaces
│
└── LinkVaultBackend/            # ASP.NET Core backend
    └── src/
        ├── LinkVault.API/       # Controllers, middleware, configuration
        ├── LinkVault.Application/ # Business logic, DTOs, validators
        ├── LinkVault.Core/      # Domain entities, enums, interfaces
        └── LinkVault.Infrastructure/ # EF Core DbContext, repositories
```

## Features

- **URL Shortening** — Create short links with custom codes, passwords, and expiry dates
- **Link Organization** — Categories, collections, and tags for structured management
- **Click Analytics** — Track device, browser, OS, location, and referrer per click
- **QR Code Generation** — Auto-generated QR codes for every shortened link
- **Full-Text Search** — Search across all links, titles, and notes
- **User Authentication** — JWT-based auth with email verification and password reset
- **Favorites & Notifications** — Save favorites; get alerts on link expiry and milestones
- **Admin Panel** — User management, audit logs, and platform-wide analytics
- **Dark/Light Theme** — Full theme support with persistent preferences
- **Command Palette** — Ctrl+K quick-action navigation

## Getting Started

### Prerequisites

- Node.js 20+
- .NET 10 SDK
- PostgreSQL database

### Backend Setup

```bash
cd LinkVaultBackend/src/LinkVault.API
# Update the connection string in appsettings.json
dotnet run
```

The API starts at `http://localhost:5253` with Swagger at `/swagger`.

### Frontend Setup

```bash
cd linkvault-frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:3000`.

## API Endpoints

| Area | Endpoints |
|---|---|
| **Auth** | Register, Login, Logout, RefreshToken, ForgotPassword, ResetPassword, VerifyEmail |
| **Links** | CRUD, bulk delete, toggle favorite |
| **Categories** | CRUD |
| **Tags** | CRUD |
| **Collections** | CRUD |
| **Analytics** | Overview stats, per-link analytics |
| **Dashboard** | Summary statistics |
| **Search** | Full-text search |
| **Admin** | User management, audit logs |
| **Redirect** | Public `/{shortCode}` with analytics logging |
| **Health** | `/api/health/status` |

## Architecture

The backend follows **Clean Architecture** with four fully decoupled layers:

- **Core** — Domain entities and interfaces (zero dependencies)
- **Application** — Business logic, DTOs, validation (depends only on Core)
- **Infrastructure** — EF Core, repositories, unit of work (implements Core interfaces)
- **API** — Controllers, middleware, startup configuration

The frontend uses **TanStack React Query** for server state management and **Zustand** for lightweight client state (auth, UI preferences).
