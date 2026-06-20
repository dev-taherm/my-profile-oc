# Portfolio & Career Website

> [English](README.md) | [العربية](README.ar.md)

A production-ready, multilingual (English & Arabic) personal portfolio and career website built with Next.js 16, designed to showcase projects, write blog posts, and attract remote software engineering opportunities. Features a full admin dashboard, SEO optimization, dark/light mode, RTL support, and a contact form -- all backed by a Prisma-powered database.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## Why This Project?

This isn't just a static portfolio. It's a **full-stack content management system** tailored for developers who want:

- A professional online presence with a bilingual website (English + Arabic)
- A blog to share technical knowledge and attract recruiters
- An admin dashboard to manage content without touching code
- SEO-optimized pages that rank well on search engines
- A modern, responsive design that works on every device
- A contact form so potential employers can reach you directly

Whether you're looking for a remote software engineering role or want to showcase your work, this project gives you everything you need out of the box.

---

## Screenshots

| Homepage | About | Projects |
|---|---|---|
| ![Homepage](public/images/screenshots/home.png) | ![About](public/images/screenshots/about.png) | ![Projects](public/images/screenshots/projects.png) |

| Blog | Resume | Contact |
|---|---|---|
| ![Blog](public/images/screenshots/blog.png) | ![Resume](public/images/screenshots/resume.png) | ![Contact](public/images/screenshots/contact.png) |

| Admin Dashboard | Admin Project Editor | Admin Settings |
|---|---|---|
| ![Admin Dashboard](public/images/screenshots/adminDashboard.png) | ![Admin Project](public/images/screenshots/adminProject.png) | ![Admin Settings](public/images/screenshots/adminSettings.png) |

---

## Features

### Bilingual Support (English & Arabic)

The entire website is fully translated into both English and Arabic. A language switcher in the header lets visitors toggle between languages instantly. All page content -- navigation, hero text, project descriptions, blog posts, about page, resume, and contact form labels -- is loaded from translation dictionaries. The admin dashboard supports writing content in both languages simultaneously with tabbed editors.

### Automatic RTL/LTR Layout

When a visitor selects Arabic, the entire layout automatically switches to right-to-left (RTL). When English is selected, it switches to left-to-right (LTR). This is handled by the middleware, which detects the user's preferred language from cookies, the `Accept-Language` header, or the URL prefix (`/en/` or `/ar/`), and applies the correct text direction and layout alignment without any page reload.

### Dark & Light Mode

The website supports both dark and light themes. The theme toggle is accessible from the header, and the site remembers the user's preference across sessions. It also detects the system's color scheme preference automatically, so visitors who prefer dark mode on their operating system will see the dark theme by default.

### SEO Optimization

Every page is optimized for search engines:

- **Dynamic metadata** -- Each page has a unique `<title>` and `<meta description>` generated from content
- **Open Graph tags** -- Rich previews when shared on social media (Facebook, LinkedIn, Twitter)
- **Twitter Card** -- `summary_large_image` card type for Twitter/X sharing
- **Sitemap** -- Auto-generated `sitemap.xml` with all public pages in both languages
- **Robots.txt** -- Allows search engine crawling while blocking `/admin/` and `/api/`
- **Hreflang tags** -- Tells Google which language version to show in each region
- **Canonical URLs** -- Prevents duplicate content issues across language variants

### Admin Dashboard

A built-in admin panel lets you manage all content without writing code:

- **Forced Credential Change** -- On first login, you are required to set your own email and password before accessing the dashboard. This ensures default credentials are never left unchanged in production
- **Dashboard** -- Overview with project, blog post, and message counts
- **Project Management** -- Create, edit, and delete projects with bilingual translation tabs (EN/AR), GitHub/live URLs, featured flag, and publish status (Draft/Published/Archived)
- **Blog Management** -- Create, edit, and delete blog posts with Markdown content, reading time, featured flag, and publish status. Publication date is auto-set when you publish
- **Category Management** -- Create and delete categories (e.g., Backend, AI/LLM) to organize both projects and blog posts. Assign categories to projects and blog posts directly from the editor
- **Tag Management** -- Create and delete tags (e.g., Python, Django, React) for fine-grained content tagging across projects and posts. Assign tags to projects and blog posts directly from the editor
- **Contact Messages** -- View and manage messages submitted through the contact form
- **Authentication** -- Secure login with email/password using NextAuth.js with JWT sessions

### Database-Driven Content

All projects, blog posts, categories, tags, and contact messages are stored in a database (SQLite or PostgreSQL) via Prisma ORM. This means:

- Content persists between deployments
- You can manage content from the admin panel without redeploying
- The database schema is version-controlled and easy to migrate
- Seeded with sample data so the site looks populated out of the box

### Contact Form

A fully functional contact form with:

- Name, email, subject, and message fields
- Form validation (name, email, and message are required)
- Success/error feedback states
- Messages stored in the database for review in the admin panel
- Contact information card with email, phone, location, and social links
- Availability status indicator

### Responsive Design

Built mobile-first with Tailwind CSS v4. Every page works perfectly on phones, tablets, and desktops. The header collapses into a slide-out drawer on mobile, project and blog grids adapt to screen width, and all content remains readable at every viewport size.

### Smooth Animations

Powered by Framer Motion, the site features:

- Fade-in and slide-up animations on scroll for page sections
- Staggered entry animations for lists and grids
- Smooth page transitions
- Animated hero section with profile image, stats, and technology showcase

### Resume Page

A dedicated resume page that displays:

- Professional summary
- Core skills organized into categories (Backend, AI/LLM, Cloud/DevOps, Frontend)
- Work experience timeline with company details and achievements
- Education history
- Professional certifications
- Language proficiency
- Download PDF button

### Featured Technologies Showcase

The homepage displays a grid of key technologies with color-coded indicators and hover effects, giving visitors an immediate sense of your tech stack at a glance.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| Language | TypeScript | 5.x |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Component Library | shadcn/ui (Base UI variant) | 4.11.0 |
| Animation | Framer Motion | 12.40.0 |
| Database | SQLite / PostgreSQL | -- |
| ORM | Prisma | 5.22.0 |
| Authentication | NextAuth.js (Credentials) | 4.24.14 |
| Icons | Lucide React | 1.17.0 |
| Password Hashing | bcryptjs | 3.0.3 |
| Package Manager | pnpm | -- |
| Deployment | Docker / PM2 | -- |

---

## Installation Options

This project supports two database backends. Choose the one that fits your needs:

| | SQLite (`main-sqlite` branch) | Docker/PostgreSQL (`main` branch) |
|---|---|---|
| **Docker required** | No | Yes |
| **Database** | SQLite (file-based) | PostgreSQL 16 |
| **Best for** | Local development, quick setup | Production, full-featured setup |
| **Performance** | Suitable for small-medium traffic | Better for high-traffic sites |

---

## Quick Start (SQLite -- This Branch)

> No Docker required. This is the simplest way to run the project locally.

### Prerequisites

- **Node.js** 18+ (recommended: 20)
- **pnpm** (package manager)

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

Edit `.env` and generate a secure secret:

```bash
openssl rand -base64 32
```

Your `.env` should look like this:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="123456"
```

### 4. Initialize the database

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

This creates the SQLite database, pushes the schema, and populates it with sample data (admin user, 2 projects, 1 blog post, categories, and tags).

### 5. Add your profile photo

Save your profile photo as `public/images/profile.jpg`.

### 6. Start the development server

```bash
pnpm dev
```

Open in your browser:
- **English**: http://localhost:3000/en
- **Arabic**: http://localhost:3000/ar
- **Admin panel**: http://localhost:3000/admin/login

---

## Quick Start (Docker/PostgreSQL)

> Requires Docker. Uses PostgreSQL for a production-like setup.

### Prerequisites

- **Node.js** 18+ (recommended: 20)
- **pnpm** (package manager)
- **Docker** and **Docker Compose**

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

Edit `.env` and generate a secure secret:

```bash
openssl rand -base64 32
```

Your `.env` should look like this:

```env
DATABASE_URL="postgresql://portfolio:portfolio_secret@localhost:5432/portfolio"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="123456"
```

### 4. Start PostgreSQL

```bash
docker compose up -d db
```

This starts a PostgreSQL 16 container with a persistent volume. The database is ready when the healthcheck passes.

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
- **Admin panel**: http://localhost:3000/admin/login

---

## Admin Dashboard

Access the admin panel at http://localhost:3000/admin/login

### Default Credentials

| Field | Value |
|---|---|
| Email | `admin` |
| Password | `123456` |

> **Security Note:** On first login, you will be redirected to a page where you must set your own email and password. The default credentials cannot be used to access the admin dashboard.

### Forced Credential Change

When you log in with the default credentials (`admin` / `123456`), you are automatically redirected to a credential change page. You must set your own name, email, and password before you can access the admin dashboard. This security feature ensures that default credentials are never left unchanged.

### Dashboard

The dashboard displays a welcome message with your name and quick-action buttons to create new projects or blog posts. Stats cards show the total count of projects, blog posts, and contact messages.

### Projects Management

- **List view** -- Table showing all projects with title, status badge, featured flag, and action buttons (Edit/Delete)
- **Create/Edit** -- Full editor with:
  - **Settings card** -- Slug, GitHub URL, Live URL, Featured checkbox, Status dropdown (Draft/Published/Archived), category checkboxes, tag checkboxes
  - **Translation tabs** -- Switch between English and Arabic editors, each with title, description, and Markdown content fields
  - **RTL support** -- Arabic content fields automatically switch to right-to-left text direction
- **Delete** -- Confirmation dialog before permanent deletion

### Blog Posts Management

- **List view** -- Table showing all posts with title, status badge, reading time, and action buttons (Edit/Delete)
- **Create/Edit** -- Full editor with:
  - **Settings card** -- Slug, Featured checkbox, Reading time, Status dropdown (Draft/Published/Archived), category checkboxes, tag checkboxes
  - **Translation tabs** -- English and Arabic editors with title, excerpt, and Markdown content fields
  - **Auto-publish date** -- `publishedAt` is automatically set when status changes to Published
- **Delete** -- Confirmation dialog before permanent deletion

### Categories & Tags

- **Categories** -- Create and delete categories (e.g., Backend, AI/LLM, Full-Stack, DevOps) used to organize both projects and blog posts. Assign categories to projects and blog posts from their editor pages using checkboxes
- **Tags** -- Create and delete tags (e.g., Python, Django, React, Docker) for fine-grained content tagging across projects and posts. Assign tags to projects and blog posts from their editor pages using checkboxes

---

## API Documentation

All API routes are under `/api/`. Authentication is required for write operations (POST/PUT/DELETE) and uses NextAuth.js JWT tokens.

### Authentication

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | -- | NextAuth.js authentication endpoints (sign in, sign out, session) |

### Projects

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/projects` | GET | No | List all projects (ordered by `order`). Includes translations, categories, and tags |
| `/api/projects` | POST | Yes | Create a new project with translations. Accepts `categoryIds` and `tagIds` to assign categories/tags |
| `/api/projects?id={id}` | PUT | Yes | Update an existing project. Replaces translations, categories, and tags |
| `/api/projects?id={id}` | DELETE | Yes | Delete a project and its translations |

### Blog Posts

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/blog` | GET | No | List all blog posts. Includes translations, categories, tags, and author name |
| `/api/blog?id={id}` | GET | No | Get a single blog post by ID |
| `/api/blog` | POST | Yes | Create a new blog post with translations. Accepts `categoryIds` and `tagIds` to assign categories/tags |
| `/api/blog?id={id}` | PUT | Yes | Update an existing blog post. Replaces translations, categories, and tags |
| `/api/blog?id={id}` | DELETE | Yes | Delete a blog post and its translations |

### Categories

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/categories` | GET | No | List all categories with usage counts (projects and blog posts) |
| `/api/categories` | POST | Yes | Create a new category. Body: `{ "name": "Category Name" }`. Slug is auto-generated |
| `/api/categories?id={id}` | DELETE | Yes | Delete a category |

### Tags

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/tags` | GET | No | List all tags with usage counts (projects and blog posts) |
| `/api/tags` | POST | Yes | Create a new tag. Body: `{ "name": "Tag Name" }`. Slug is auto-generated |
| `/api/tags?id={id}` | DELETE | Yes | Delete a tag |

### Contact

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/contact` | POST | No | Submit a contact message. Required fields: `name`, `email`, `message` |

### File Upload

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/upload` | POST | Yes | Upload an image file to `public/images/`. Returns `{ url: "/images/{filename}" }` |

### User Profile

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/user/profile` | PUT | Yes | Update user name, email, and password. Sets `passwordChanged: true` after first update |

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma              # Database schema (SQLite or PostgreSQL)
│   └── seed.ts                    # Seed script (populates DB with sample data)
│
├── public/images/                 # Static images (profile photo)
│
├── src/
│   ├── app/
│   │   ├── [locale]/              # Localized pages (en/ar)
│   │   │   ├── page.tsx           # Home page (Hero, Stats, Featured Tech)
│   │   │   ├── about/page.tsx     # About page (experience, education, certifications)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx       # Projects listing with search
│   │   │   │   └── [slug]/page.tsx # Project detail with Markdown content
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx       # Blog listing with search
│   │   │   │   └── [slug]/page.tsx # Blog post detail with Markdown content
│   │   │   ├── resume/page.tsx    # Resume page with download PDF
│   │   │   └── contact/page.tsx   # Contact form + info
│   │   │
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── page.tsx           # Dashboard overview
│   │   │   ├── login/page.tsx     # Login page
│   │   │   ├── change-password/   # Forced credential change page
│   │   │   ├── projects/          # Project CRUD
│   │   │   ├── blog/              # Blog post CRUD
│   │   │   ├── categories/        # Category management
│   │   │   └── tags/              # Tag management
│   │   │
│   │   ├── api/                   # REST API routes
│   │   │   ├── auth/              # NextAuth.js authentication
│   │   │   ├── projects/          # Projects CRUD (accepts categoryIds/tagIds)
│   │   │   ├── blog/              # Blog posts CRUD (accepts categoryIds/tagIds)
│   │   │   ├── categories/        # Categories CRUD
│   │   │   ├── tags/              # Tags CRUD
│   │   │   ├── contact/           # Contact form submission
│   │   │   ├── upload/            # File upload
│   │   │   └── user/profile/      # Update user credentials
│   │   │
│   │   ├── sitemap.ts             # Dynamic sitemap.xml generation
│   │   ├── robots.ts              # robots.txt generation
│   │   ├── not-found.tsx          # Custom 404 page
│   │   ├── layout.tsx             # Root HTML layout
│   │   └── globals.css            # Global styles, theme variables
│   │
│   ├── components/
│   │   ├── sections/              # Homepage sections (Hero, Stats, FeaturedTech)
│   │   ├── layout/                # Header, Footer
│   │   ├── blog/                  # BlogList, BlogPostDetail
│   │   ├── projects/              # ProjectsList, ProjectDetail
│   │   ├── contact/               # ContactForm, ContactInfo
│   │   ├── resume/                # ResumeView
│   │   ├── shared/                # AnimatedSection, PageHeader, ProfileImage, Icons
│   │   ├── admin/                 # AdminSidebar
│   │   └── ui/                    # shadcn/ui components (18 components)
│   │
│   ├── i18n/
│   │   ├── config.ts              # Locale validation and detection helpers
│   │   ├── get-dictionary.ts      # Dictionary loader
│   │   └── dictionaries/
│   │       ├── en.json            # English translations
│   │       └── ar.json            # Arabic translations
│   │
│   ├── lib/
│   │   ├── constants.ts           # Site config, navigation, locale definitions
│   │   ├── prisma.ts              # Singleton Prisma client
│   │   └── utils.ts               # cn() utility (clsx + tailwind-merge)
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   │
│   └── proxy.ts                 # Locale detection, routing, redirects (Next.js 16)
│
├── docker-compose.yml             # PostgreSQL + app services (main branch)
├── Dockerfile                     # Multi-stage production build
├── components.json                # shadcn/ui configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.ts                 # Next.js configuration
└── .env.example                   # Environment variable template
```

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with hot reload (Turbopack) |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Prisma client from schema |
| `pnpm db:push` | Push schema changes to database (no migration file) |
| `pnpm db:migrate` | Run database migrations (creates migration files) |
| `pnpm db:seed` | Seed database with sample data (admin user, projects, blog posts) |
| `pnpm db:studio` | Open Prisma Studio (visual database browser) |
| `pnpm db:reset` | Reset database, re-run migrations, and re-seed |

---

## Deployment

### Docker (Recommended for Production)

```bash
docker compose up -d
```

This starts both the PostgreSQL database and the Next.js app. The Dockerfile uses a multi-stage build:

1. **Dependencies** -- Installs only production dependencies
2. **Builder** -- Builds the Next.js application with standalone output
3. **Runner** -- Runs the app in a minimal Node.js Alpine container as a non-root user

### VPS with CloudPanel + Nginx

1. Build the project:
   ```bash
   pnpm build
   ```

2. Copy `.env.example` to `.env` and configure production values

3. Run database setup:
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

4. Start with PM2:
   ```bash
   pm2 start pnpm --name "portfolio" -- start
   ```

5. Configure Nginx reverse proxy to forward port 3000

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Database connection string: `file:./dev.db` (SQLite) or `postgresql://user:pass@host:5432/db` (PostgreSQL) |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Your site URL (e.g., `http://localhost:3000` for dev, `https://yourdomain.com` for production) |
| `ADMIN_EMAIL` | Yes | Default admin email for initial login (default: `admin`) |
| `ADMIN_PASSWORD` | Yes | Default admin password for initial login (default: `123456`) |

---

## Customization

### Profile Data

Edit `src/lib/constants.ts` to update your personal information:

- **Name, title, description** -- Used in the hero section and metadata
- **Email, phone, location** -- Displayed on the contact page
- **Social links** -- GitHub and LinkedIn URLs
- **Navigation items** -- Add, remove, or reorder nav links

### Content

- **Projects & Blog Posts** -- Managed through the admin dashboard (no code changes needed)
- **Categories & Tags** -- Managed through the admin dashboard
- **Homepage stats** -- Edit the stats values in `src/i18n/dictionaries/en.json` and `ar.json`

### Translations

Edit the translation files to customize all text on the site:

- `src/i18n/dictionaries/en.json` -- English translations
- `src/i18n/dictionaries/ar.json` -- Arabic translations

To add a new language:

1. Create a new dictionary file (e.g., `fr.json`)
2. Add the locale to the `LOCALES` array in `src/lib/constants.ts`
3. Update the middleware if needed

### Styling

The project uses Tailwind CSS v4 with shadcn/ui. Customize the theme by editing:

- `src/app/globals.css` -- Theme colors (light/dark mode), CSS custom properties
- `components.json` -- shadcn/ui configuration (style, base color)

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to:
- Follow the existing code style
- Run `pnpm lint` before committing
- Test your changes locally with `pnpm dev`

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> [English](README.md) | [العربية](README.ar.md)
