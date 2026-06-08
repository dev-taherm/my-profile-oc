# Portfolio & Career Website

A modern, multilingual (English/Arabic) personal portfolio and career website built with Next.js, designed to attract remote software engineering opportunities.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Multilingual** — Full English/Arabic support with language switcher
- **RTL/LTR** — Automatic layout direction based on selected language
- **Dark/Light Mode** — Theme toggle with system preference detection
- **SEO Optimized** — Dynamic metadata, Open Graph, sitemap, robots.txt, hreflang tags
- **Admin Dashboard** — Create/edit/delete projects, blog posts, categories, and tags
- **Responsive** — Mobile-first design, works on all devices
- **Framer Motion** — Smooth animations and transitions
- **Database-driven** — Projects and blog posts stored via Prisma ORM

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| Database | SQLite / PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Credentials provider) |
| Icons | Lucide React |

## Installation Options

This project supports two database backends. Choose the one that fits your setup:

| | SQLite (`main-sqlite` branch) | Docker/PostgreSQL (`main` branch) |
|---|---|---|
| **Docker required** | No | Yes |
| **Database** | SQLite (file-based) | PostgreSQL 16 |
| **Best for** | Local development, quick setup | Production, full-featured setup |

---

## Quick Start (SQLite — This Branch)

> **No Docker required.** This is the simplest way to run the project locally.

### 1. Clone the repository

```bash
git clone -b main-sqlite https://github.com/dev-taherm/my-profile-oc.git
cd my-profile-oc
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 4. Initialize the database

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 5. Add your profile photo

Save your profile photo as `public/images/profile.jpg`.

### 6. Start the development server

```bash
pnpm dev
```

Open in your browser:
- **English**: http://localhost:3000/en
- **Arabic**: http://localhost:3000/ar

---

## Quick Start (Docker/PostgreSQL)

> **Requires Docker.** Uses PostgreSQL for a production-like setup.

### 1. Clone the repository

```bash
git clone -b main https://github.com/dev-taherm/my-profile-oc.git
cd my-profile-oc
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://portfolio:portfolio_secret@localhost:5432/portfolio"
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 4. Start PostgreSQL

```bash
docker compose up -d db
```

Or use an external PostgreSQL and update `DATABASE_URL` in `.env`.

### 5. Initialize the database

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 6. Add your profile photo

Save your profile photo as `public/images/profile.jpg`.

### 7. Start the development server

```bash
pnpm dev
```

Open in your browser:
- **English**: http://localhost:3000/en
- **Arabic**: http://localhost:3000/ar

---

## Admin Dashboard

Access the admin panel at http://localhost:3000/admin/login

| Field | Value |
|---|---|
| Email | Set in `ADMIN_EMAIL` env var |
| Password | Set in `ADMIN_PASSWORD` env var |

### Admin Features

- Dashboard overview with stats
- Create/edit/delete projects (with EN/AR translation tabs)
- Create/edit/delete blog posts (Markdown editor)
- Manage categories and tags
- Contact message management

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema (SQLite or PostgreSQL)
│   └── seed.ts                # Seed script (populates DB with sample data)
├── public/images/             # Static images (profile photo)
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized pages (en/ar)
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── about/         # About page
│   │   │   ├── projects/      # Projects listing + detail
│   │   │   ├── blog/          # Blog listing + detail
│   │   │   ├── resume/        # Resume page
│   │   │   └── contact/       # Contact form
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   └── robots.ts          # Robots.txt
│   ├── components/            # Reusable UI components
│   ├── i18n/                  # Translation dictionaries (en.json, ar.json)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities, Prisma client, constants
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Locale detection & routing
├── docker-compose.yml         # PostgreSQL + app services (main branch)
├── Dockerfile                 # Multi-stage production build
└── .env.example               # Environment variable template
```

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Prisma Studio (visual DB browser) |
| `pnpm db:reset` | Reset database and re-seed |

## Deployment

### Docker (Recommended)

```bash
docker compose up -d
```

This starts both the PostgreSQL database and the Next.js app.

### VPS with CloudPanel + Nginx

1. Build the project:
   ```bash
   pnpm build
   ```

2. Copy `.env.example` to `.env` and configure production values

3. Run database migrations:
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

4. Start with PM2:
   ```bash
   pm2 start pnpm --name "portfolio" -- start
   ```

5. Configure Nginx reverse proxy to forward port 3000

### Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Database connection string (`file:./dev.db` for SQLite, `postgresql://...` for PostgreSQL) |
| `NEXTAUTH_SECRET` | Yes | Random secret for NextAuth.js |
| `NEXTAUTH_URL` | Yes | Your site URL (e.g., `https://yourdomain.com`) |
| `ADMIN_EMAIL` | Yes | Admin login email |
| `ADMIN_PASSWORD` | Yes | Admin login password |

## Customization

### Profile Data

Edit `src/lib/constants.ts` to update your personal information (name, email, social links, etc.).

### Translations

Edit the translation files:
- `src/i18n/dictionaries/en.json` — English
- `src/i18n/dictionaries/ar.json` — Arabic

To add a new language, create a new dictionary file and add the locale to `src/lib/constants.ts`.

### Styling

The project uses Tailwind CSS v4 with shadcn/ui. Theme colors are defined in `src/app/globals.css`.

## License

MIT
