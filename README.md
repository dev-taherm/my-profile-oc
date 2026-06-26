# Portfolio & Career Website / موقع البورتفوليو والوظائف

Select a language: **English** | **العربية**

---

<details open>
<summary><strong>English</strong></summary>

# Portfolio & Career Website

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

### Services System

A complete services management system with full CRUD operations, bilingual translations, and a dedicated public-facing page:

- **Public Pages** -- Services listing page with animated icons and service detail pages with features lists and WhatsApp CTA
- **Admin Management** -- Create, edit, and delete services with bilingual translation tabs (EN/AR), icon picker, featured flag, status (Draft/Published/Archived), and display order
- **Database-Driven** -- Services stored with translations in the database via Prisma ORM
- **SEO Optimized** -- Service detail pages include Schema.org `Service` structured data

### Media Library

A full-featured media library with folder organization and advanced file management:

- **Folder Organization** -- Create, rename, and delete folders to organize media files
- **Drag-and-Drop Upload** -- Upload multiple files simultaneously with drag-and-drop support
- **WebP Auto-Conversion** -- JPEG and PNG images are automatically converted to WebP format for optimized delivery
- **Bulk Operations** -- Select multiple files for bulk delete or bulk move between folders
- **Grid View** -- Visual grid with image previews, file size, and MIME type display
- **Copy URL** -- One-click URL copying for easy content embedding

### Built-in Analytics

A complete analytics system that tracks page views and provides insights through a dashboard:

- **Page View Tracking** -- Middleware-based tracking records every page view with referrer, user agent, country, and session ID
- **Analytics Dashboard** -- Admin dashboard with total views, unique visitors, daily breakdown, top pages, top referrers, browser stats, device stats, and country stats
- **Privacy-Focused** -- All data stored locally in your database, no external analytics services

### Dynamic OG Image Generation

Automatically generates Open Graph images for social media sharing:

- **Bilingual Support** -- Generates images in both English and Arabic with proper font rendering (Noto Sans Arabic for Arabic)
- **Gradient Design** -- 1200x630 gradient images with title, subtitle, site URL, and logo badge
- **Per-Page Customization** -- Each page generates its own OG image with relevant content

### RSS Feed

A standards-compliant RSS feed at `/rss.xml`:

- **Full Content** -- Includes published blog posts, projects, and services with descriptions
- **Atom Self-Link** -- Proper Atom integration for feed readers
- **Cached** -- Browser cache (1 hour) and CDN cache (24 hours) for performance

### SEO Enhancements

Advanced SEO features beyond basic optimization:

- **IndexNow Integration** -- Instant search engine indexing when new content is published (Bing, Yandex)
- **LLMs.txt** -- A structured plain-text file designed for Large Language Models to understand site content, expertise, and contact information
- **Rich Structured Data** -- Schema.org JSON-LD for Organization, WebSite (with SearchAction), Person, BreadcrumbList, FAQPage, HowTo, AboutPage, CreativeWork, and Service schemas
- **Sitemap Enhanced** -- Includes service pages, blog post cover images, and project images as image metadata

### Security Headers

Comprehensive security headers configured in `next.config.ts`:

- `Strict-Transport-Security` -- HSTS with includeSubDomains and preload
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` -- Blocks camera, microphone, geolocation, and interest-cohort

### Privacy Policy & Terms of Service

Bilingual legal pages with structured data:

- **Privacy Policy** -- `/privacy` page with BreadcrumbList schema
- **Terms of Service** -- `/terms` page with BreadcrumbList schema
- Both pages linked in the footer and fully translated

### Enhanced About Page

The about page now includes additional sections:

- **"How I Work" Process** -- 4-step workflow section (Discovery, Development, Testing, Deployment) with HowTo schema
- **FAQ Section** -- Expandable/collapsible frequently asked questions with FAQPage schema
- **Structured Data** -- Rich search results with AboutPage, HowTo, and FAQPage schemas

### Enhanced Homepage

The homepage now features additional sections:

- **Featured Services** -- Top 3 services with animated icons and link to full services page
- **Featured Projects** -- Showcase of featured projects with images, categories, and tags
- **Latest Blog** -- Recent blog posts with cover images and reading time
- **WhatsApp CTA** -- Call-to-action section for direct WhatsApp contact

### Breadcrumb Navigation

A reusable breadcrumb component with:

- **RTL Support** -- Automatically adapts to right-to-left layouts
- **Consistent Navigation** -- Used across all pages for improved UX and SEO

### Typed Upload System

Enhanced file upload with type-specific handling:

- **Separate Directories** -- Files stored in `public/uploads/projects/`, `public/uploads/blog/`, `public/uploads/resume/`
- **Type Validation** -- `?type=` query parameter validates file types (images for projects/blog, PDF for resume)
- **Size Limits** -- 5MB maximum file size

### Multi-Image Support for Projects

Projects now support multiple images:

- **Image Gallery** -- Projects can have multiple images with ordering
- **Admin Management** -- Upload, reorder, and delete project images from the admin editor
- **Image SEO** -- Project images included in sitemap with image metadata

### Blog Enhancements

Blog posts now support additional features:

- **Cover Images** -- Blog posts can have cover images displayed on listing and detail pages
- **Author Tracking** -- Blog posts track their author with author name display

### Admin Settings Page

A dedicated settings page in the admin dashboard:

- **Profile Management** -- Edit name, email, and password directly from settings
- **Resume/CV Management** -- Upload, replace, or delete resume PDF from settings

### Additional Enhancements

- **Dark Theme Logo** -- Separate logo for dark mode via `hidden dark:block`
- **Locale-Setter Script** -- Client-side script prevents FOUC (Flash of Unstyled Content) for RTL layouts
- **Arabic Font** -- Noto Sans Arabic bundled for OG image generation and Arabic text rendering

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
| Markdown | react-markdown + remark-gfm + rehype-highlight | 10.1.0 / 4.0.1 / 7.0.2 |
| Markdown Editor | @uiw/react-md-editor | 4.1.1 |
| Syntax Highlighting | shiki | 4.2.0 |
| Charts | recharts | 3.8.1 |
| Image Processing | sharp | 0.34.5 |
| Validation | zod | 4.4.3 |
| i18n Helpers | next-intl | 4.13.0 |
| Theme Management | next-themes | 0.4.6 |
| Animation CSS | tw-animate-css | 1.4.0 |
| Variant Classes | class-variance-authority | 0.7.1 |
| Base Components | @base-ui/react | 1.5.0 |
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

- **Categories** -- Create and delete categories (e.g., Backend, AI/LLM, Full-Stack, DevOps) to organize both projects and blog posts. Assign categories to projects and blog posts from their editor pages using checkboxes
- **Tags** -- Create and delete tags (e.g., Python, Django, React, Docker) for fine-grained content tagging across projects and posts. Assign tags to projects and blog posts from their editor pages using checkboxes

### Services Management

- **List view** -- Table showing all services with title, status badge, featured flag, and action buttons (Edit/Delete)
- **Create/Edit** -- Full editor with:
  - **Settings card** -- Slug, Icon picker, Featured checkbox, Status dropdown (Draft/Published/Archived), display order
  - **Translation tabs** -- Switch between English and Arabic editors, each with title, short description, full description, and features list
  - **RTL support** -- Arabic content fields automatically switch to right-to-left text direction
- **Delete** -- Confirmation dialog before permanent deletion

### Media Library

A full-featured media library for managing uploaded files:

- **Folder Management** -- Create, rename, and delete folders to organize media
- **File Upload** -- Drag-and-drop upload with automatic WebP conversion for JPEG/PNG images
- **Grid View** -- Visual grid with image previews, file size, and MIME type
- **Bulk Operations** -- Select multiple files for bulk delete or bulk move between folders
- **Search & Filter** -- Search by filename, filter by MIME type and folder
- **Copy URL** -- One-click URL copying for content embedding

### Settings

- **Profile Management** -- Edit name, email, and password directly from the settings page
- **Resume/CV Management** -- Upload, replace, or delete resume PDF file

### Analytics Dashboard

- **Overview** -- Total views, unique visitors, and daily breakdown charts
- **Top Pages** -- Most visited pages with view counts
- **Top Referrers** -- Traffic sources breakdown
- **Browser & Device Stats** -- Browser types, operating systems, and device categories
- **Country Stats** -- Geographic distribution of visitors

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
| `/api/upload?type={type}` | POST | Yes | Upload a file. Type parameter: `projects` (images), `blog` (images), `resume` (PDF). Max 5MB. Returns `{ url: "/uploads/{type}/{filename}" }` |

### Services

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/services` | GET | No | List all services (ordered by `order`). Includes translations |
| `/api/services` | POST | Yes | Create a new service with translations |
| `/api/services?id={id}` | PUT | Yes | Update an existing service. Replaces translations |
| `/api/services?id={id}` | DELETE | Yes | Delete a service and its translations |

### Media

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/media` | GET | Yes | List media files. Supports `search`, `mimeType`, `folderId` query params |
| `/api/media` | POST | Yes | Upload media files. Auto-converts JPEG/PNG to WebP. Returns uploaded file details |
| `/api/media?id={id}` or `/api/media?ids={id1,id2}` | DELETE | Yes | Delete single or multiple media files |
| `/api/media/folders` | GET | Yes | List all media folders |
| `/api/media/folders` | POST | Yes | Create a new folder. Body: `{ "name": "Folder Name" }` |
| `/api/media/folders/{id}` | PUT | Yes | Rename a folder |
| `/api/media/folders/{id}` | DELETE | Yes | Delete a folder |
| `/api/media/move` | POST | Yes | Move media to a folder. Body: `{ "mediaIds": [...], "folderId": "..." }` |

### Analytics

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/analytics` | POST | No | Record a page view. Auto-captures referrer, user agent, country, session ID |
| `/api/analytics/dashboard` | GET | Yes | Get analytics dashboard data: total views, unique visitors, daily breakdown, top pages, top referrers, browser/device/country stats |

### RSS Feed

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/rss.xml` | GET | No | RSS 2.0 feed with published blog posts, projects, and services. Cached 1hr (browser) / 24hr (CDN) |

### IndexNow

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/indexnow` | GET | No | IndexNow key verification endpoint |
| `/api/indexnow` | POST | Yes | Ping search engines (Bing/Yandex) for instant indexing |

### User Profile

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/user/profile` | GET | Yes | Get user profile including resumeUrl |
| `/api/user/profile` | PUT | Yes | Update user name, email, password, and resumeUrl |
| `/api/resume` | GET | No | Get the resume PDF URL |

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma              # Database schema (SQLite or PostgreSQL)
│   └── seed.ts                    # Seed script (populates DB with sample data)
│
├── public/
│   ├── images/                    # Static images (profile photo, screenshots)
│   ├── fonts/                     # Fonts (Noto Sans Arabic for OG images)
│   ├── uploads/                   # Uploaded files (projects, blog, resume)
│   ├── scripts/                   # Client scripts (set-locale.js for RTL FOUC prevention)
│   └── llms.txt                   # LLM discovery file (AI/LLM structured content)
│
├── src/
│   ├── app/
│   │   ├── [locale]/              # Localized pages (en/ar)
│   │   │   ├── page.tsx           # Home page (Hero, Stats, Featured Tech, Services, Projects, Blog, CTA)
│   │   │   ├── about/page.tsx     # About page (experience, education, certifications, How I Work, FAQ)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx       # Projects listing with search
│   │   │   │   └── [slug]/page.tsx # Project detail with Markdown content and image gallery
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx       # Blog listing with search
│   │   │   │   └── [slug]/page.tsx # Blog post detail with cover image and Markdown content
│   │   │   ├── services/
│   │   │   │   ├── page.tsx       # Services listing page
│   │   │   │   └── [slug]/page.tsx # Service detail with features and WhatsApp CTA
│   │   │   ├── resume/page.tsx    # Resume page with download PDF
│   │   │   ├── contact/page.tsx   # Contact form + info
│   │   │   ├── privacy/page.tsx   # Privacy policy page
│   │   │   └── terms/page.tsx     # Terms of service page
│   │   │
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── page.tsx           # Dashboard overview
│   │   │   ├── login/page.tsx     # Login page
│   │   │   ├── change-password/   # Forced credential change page
│   │   │   ├── projects/          # Project CRUD
│   │   │   ├── blog/              # Blog post CRUD
│   │   │   ├── services/          # Service CRUD
│   │   │   ├── categories/        # Category management
│   │   │   ├── tags/              # Tag management
│   │   │   ├── media/             # Media library (folders, upload, bulk ops)
│   │   │   └── settings/          # Profile and resume settings
│   │   │
│   │   ├── api/                   # REST API routes
│   │   │   ├── auth/              # NextAuth.js authentication
│   │   │   ├── projects/          # Projects CRUD (accepts categoryIds/tagIds)
│   │   │   ├── blog/              # Blog posts CRUD (accepts categoryIds/tagIds)
│   │   │   ├── services/          # Services CRUD
│   │   │   ├── categories/        # Categories CRUD
│   │   │   ├── tags/              # Tags CRUD
│   │   │   ├── media/             # Media library API (upload, folders, move)
│   │   │   ├── analytics/         # Page view tracking and dashboard data
│   │   │   ├── contact/           # Contact form submission
│   │   │   ├── upload/            # Typed file upload (projects/blog/resume)
│   │   │   ├── og/                # Dynamic OG image generation
│   │   │   ├── indexnow/          # IndexNow integration (instant indexing)
│   │   │   ├── resume/            # Resume URL endpoint
│   │   │   └── user/profile/      # Update user credentials and resume
│   │   │
│   │   ├── uploads/[...path]/     # Static file serving for uploaded media
│   │   ├── rss.xml/               # RSS feed endpoint
│   │   ├── sitemap.ts             # Dynamic sitemap.xml generation (with services and images)
│   │   ├── robots.ts              # robots.txt generation
│   │   ├── not-found.tsx          # Custom 404 page
│   │   ├── layout.tsx             # Root HTML layout (with RSS link, LLMs.txt meta)
│   │   └── globals.css            # Global styles, theme variables
│   │
│   ├── components/
│   │   ├── sections/              # Homepage sections (Hero, Stats, FeaturedTech, FeaturedServices, FeaturedProjects, LatestBlog, CTA)
│   │   ├── layout/                # Header, Footer (with Privacy/Terms links)
│   │   ├── blog/                  # BlogList, BlogPostDetail
│   │   ├── projects/              # ProjectsList, ProjectDetail
│   │   ├── services/              # ServicesList, ServiceDetail
│   │   ├── contact/               # ContactForm, ContactInfo
│   │   ├── resume/                # ResumeView
│   │   ├── shared/                # AnimatedSection, PageHeader, ProfileImage, Icons, Breadcrumb, JsonLd
│   │   ├── admin/                 # AdminSidebar (with Services, Media, Settings links)
│   │   └── ui/                    # shadcn/ui components
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
│   └── proxy.ts                 # Locale detection, routing, redirects, analytics tracking (Next.js 16)
│
├── docker-compose.yml             # PostgreSQL + app services (main branch)
├── Dockerfile                     # Multi-stage production build
├── components.json                # shadcn/ui configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.ts                 # Next.js configuration (with security headers)
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

</details>

---

<details>
<summary><strong>العربية</strong></summary>

# موقع البورتفوليو والوظائف

موقع بورتفوليو شخصي ومهني متعدد اللغات (الإنجليزية والعربية) مبني باستخدام Next.js 16، مصمم لعرض المشاريع وكتابة المقالات和技术جذب فرص هندسة البرمجيات عن بُعد. يضم لوحة تحكم كاملة، تحسين محركات البحث، وضع الدعم العربي/الإنجليزي، ونموذج اتصال -- كل ذلك مدعوم بقاعدة بيانات Prisma.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## لماذا هذا المشروع؟

هذا ليس مجرد بورتفوليو ثابت. إنه **نظام إدارة محتوى كامل** مصمم للمطورين الذين يرغبون في:

- حضور احترافي على الإنترنت مع موقع ثنائي اللغة (الإنجليزية + العربية)
- مدونة لمشاركة المعرفة التقنية وجذب الم(recruiters)
- لوحة تحكم لإدارة المحتوى دون لمس الكود
- صفحات محسنة لمحركات البحث تظهر جيداً في نتائج البحث
- تصميم عصري ومتجاوب يعمل على كل الأجهزة
- نموذج اتصال حتى يتمكن أصحاب العمل المحتملين من التواصل معك مباشرة

سواء كنت تبحث عن دور هندسة برمجيات عن بُعد أو تريد عرض أعمالك، هذا المشروع يعطيك كل ما تحتاجه جاهزاً.

---

## لقطات الشاشة

| الصفحة الرئيسية | من أنا | المشاريع |
|---|---|---|
| ![الرئيسية](public/images/screenshots/home.png) | ![من أنا](public/images/screenshots/about.png) | ![المشاريع](public/images/screenshots/projects.png) |

| المدونة | السيرة الذاتية | التواصل |
|---|---|---|
| ![المدونة](public/images/screenshots/blog.png) | ![السيرة الذاتية](public/images/screenshots/resume.png) | ![التواصل](public/images/screenshots/contact.png) |

| لوحة التحكم | محرر المشاريع | الإعدادات |
|---|---|---|
| ![لوحة التحكم](public/images/screenshots/adminDashboard.png) | ![محرر المشاريع](public/images/screenshots/adminProject.png) | ![الإعدادات](public/images/screenshots/adminSettings.png) |

---

## المميزات

### دعم اللغات (الإنجليزية والعربية)

الموقع مترجم بالكامل إلى الإنجليزية والعربية. مُبدّل اللغة في الرأس يتيح للزوار التبديل بين اللغات فوراً. جميع محتويات الصفحة -- التنقل، نص البطاقة التعريفية، أوصاف المشاريع، مقالات المدونة، صفحة من نحن، السيرة الذاتية، وتسميات نموذج الاتصال -- محملة من قاموس الترجمة. لوحة التحكم تدعم كتابة المحتوى باللغتين في نفس الوقت مع محررات على شكل تبويبات.

### تلقائي RTL/LTR

عندما يختار الزائر العربية، يتحول التخطيط بالكامل إلى الاتجاه من اليمين إلى اليسار (RTL). عند اختيار الإنجليزية، يتحول إلى الاتجاه من اليسار إلى اليمين (LTR). يتم التعامل مع ذلك بواسطة الـ middleware، والذي يكتشف اللغة المفضلة للمستخدم من ملفات تعريف الارتباط، أو رأس `Accept-Language`، أو بادئة الرابط (`/en/` أو `/ar/`)، ويطبق اتجاه النص والتخطيط الصحيح دون إعادة تحميل الصفحة.

### الوضع الداكن والفاتح

الموقع يدعم كلا الوضعين الداكن والفاتح. زر تبديل السمة متاح في الرأس، يتذكر الموقع تفضيلات المستخدم عبر الجلسات. كما يكتشف تفضيلات نظام الألوان تلقائياً، بحيث يرى الزوار الذين يفضلون الوضع الداكن في نظامهم التشغيلي الوضع الداكن بشكل افتراضي.

### تحسين محركات البحث (SEO)

كل صفحة محسنة لمحركات البحث:

- **بيانات وصفية ديناميكية** -- كل صفحة لها `<title>` و `<meta description>` فريد مولود من المحتوى
- **علامات Open Graph** -- معاينات غنية عند المشاركة على وسائل التواصل الاجتماعي
- **Twitter Card** -- نوع البطاقة `summary_large_image` لمشاركة تويتر/إكس
- **خريطة الموقع** -- `sitemap.xml` مولد تلقائياً بجميع الصفحات العامة باللغتين
- **robots.txt** -- يسمح بالزحف مع حظر `/admin/` و `/api/`
- **علامات Hreflang** -- تخبر Google بأي إصدار لغة يظهر في كل منطقة
- **روابط canonical** -- تمنع مشكلة المحتوى المكرر عبر المتغيرات اللغوية

### لوحة التحكم

لوحة تحكم مدمجة تتيح إدارة كل المحتوى دون كتابة كود:

- **تغيير بيانات الاعتماد الإجباري** -- عند تسجيل الدخول لأول مرة، يتم إعادة توجيهك لصفحة لتغيير البريد الإلكتروني وكلمة المرور الخاصة بك قبل الوصول إلى لوحة التحكم
- **لوحة القيادة** -- نظرة عامة على عدد المشاريع والمقالات والرسائل
- **إدارة المشاريع** -- إنشاء وتعديل وحذف المشاريع مع تبويبات الترجمة (إنجليزي/عربي)، روابط GitHub/الموقع، علامة مميزة، وحالة النشر (مسودة/منشور/مؤرشف)، خيارات التصنيفات، وخيارات الوسوم
- **إدارة المدونة** -- إنشاء وتعديل وحذف المقالات مع محتوى Markdown، وقت القراءة، علامة مميزة، وحالة النشر، خيارات التصنيفات، وخيارات الوسوم
- **إدارة التصنيفات** -- إنشاء وحذف التصنيفات لتنظيم المشاريع والمقالات. تعيين التصنيفات للمشاريع والمقالات مباشرة من صفحة المحرر
- **إدارة الوسوم** -- إنشاء وحذف الوسوم لتصنيف المحتوى بدقة عبر المشاريع والمقالات. تعيين الوسوم للمشاريع والمقالات مباشرة من صفحة المحرر
- **رسائل الاتصال** -- عرض وإدارة الرسائل المرسلة عبر نموذج الاتصال
- **المصادقة** -- تسجيل دخول آمن بالبريد الإلكتروني وكلمة المرور باستخدام NextAuth.js مع جلسات JWT

### محتوى مدعوم بقاعدة البيانات

جميع المشاريع والمقالات والتصنيفات والوسوم ورسائل الاتصال مخزنة في قاعدة بيانات (SQLite أو PostgreSQL) عبر Prisma ORM. هذا يعني:

- المحتوى ي persist بين النشرات
- يمكنك إدارة المحتوى من لوحة التحكم دون إعادة النشر
- مخطط قاعدة البيانات مُتحكم بإصداراته وسهل الترحيل
- مبدئياً ببيانات عينة يبدو الموقع ممتلئاً

### نموذج اتصال

نموذج اتصال полностью funktionelny مع:

- حقول الاسم والبريد الإلكتروني والموضوع والرسالة
- التحقق من صحة النموذج (الاسم والبريد الإلكتروني والرسالة مطلوبة)
- حالات تغذية راجعة للنجاح/الخطأ
- الرسائل مخزنة في قاعدة البيانات للمراجعة في لوحة التحكم
- بطاقة معلومات الاتصال مع البريد الإلكتروني والهاتف والموقع وروابط التواصل الاجتماعي
- مؤشر حالة التوفر

### تصميم متجاوب

مبني للmóvil أولاً مع Tailwind CSS v4. كل صفحة تعمل بشكل مثالي على الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر المكتبية. الرأس ينهار إلى درج على الهاتف، شبكات المشاريع والمقالات تتكيف مع عرض الشاشة، وجميع المحتويات تبقى مقروءة في كل حجم شاشة.

### حركات سلسة

مدعومة بـ Framer Motion، يضم الموقع:

- حركات ظهور وانزلاق للأعلى عند التمرير لأقسام الصفحة
- حركات دخول متدرجة للقوائم والشبكات
- انتقالات سلسة بين الصفحات
- قسم بطاقة تعريفية متحرك مع صورة الملف الشخصي والإحصائيات وعرض التقنيات

### صفحة السيرة الذاتية

صفحة سيرة ذاتية مخصصة تعرض:

- الملخص المهني
- المهارات الأساسية منظمة في فئات (الخوارزميات والأنظمة، الذكاء الاصطناعي/LLM، السحابة/DevOps، الواجهة الأمامية)
- جدول زمني لخبرات العمل مع تفاصيل الشركة والإنجازات
- تاريخ التعليم
- الشهادات المهنية
- إتقان اللغات
- زر تحميل PDF

### عرض التقنيات المميزة

الصفحة الرئيسية تعرض شبكة من التقنيات الرئيسية مع مؤشرات ملونة وتأثيرات التمرير، مما يعطي الزوار فورياً فكرة عن مجموعة التقنيات الخاصة بك.

### نظام الخدمات

نظام كامل لإدارة الخدمات مع عمليات CRUD كاملة وترجمات ثنائية اللغة وصفحة عامة مخصصة:

- **الصفحات العامة** -- صفحة عرض الخدمات مع أيقونات متحركة وصفحات تفاصيل 서비스 مع قائمة الميزات ودعوة واتساب
- **إدارة المسؤول** -- إنشاء وتعديل وحذف الخدمات مع تبويبات ترجمة (إنجليزي/عربي) واختيار الأيقونة وعلامة مميزة والحالة (مسودة/منشور/مؤرشف) وترتيب العرض
- **مدعوم بقاعدة البيانات** -- الخدمات مخزنة مع الترجمات في قاعدة البيانات عبر Prisma ORM
- **محسن لمحركات البحث** -- صفحات تفاصيل الخدمات تتضمن بيانات Schema.org المهيكلة

### مكتبة الوسائط

مكتبة وسائط كاملة مع تنظيم المجلدات وإدارة الملفات المتقدمة:

- **تنظيم المجلدات** -- إنشاء وإعادة تسمية وحذف المجلدات لتنظيم ملفات الوسائط
- **الرفع بالسحب والإفلات** -- رفع عدة ملفات في وقت واحد مع دعم السحب والإفلات
- **تحويل WebP تلقائياً** -- صور JPEG و PNG تُتحويل تلقائياً إلى صيغة WebP لتحسين التسليم
- **العمليات المجمعة** -- تحديد عدة ملفات للحذف أو النقل بين المجلدات
- **عرض الشبكة** -- شبكة بصرية مع معاينات الصور وحجم الملف ونوع MIME
- **نسخ الرابط** -- نسخ الرابط بنقرة واحدة لسهولة تضمين المحتوى

### تحليلات مدمجة

نظام تحليلات كامل يتتبع مشاهدات الصفحة ويقدم رؤى عبر لوحة تحكم:

- **تتبع مشاهدات الصفحة** -- تتبع.middleware يسجل كل مشاهدة صفحة مع魔法师和 المستخدم والبلد ومعرّف الجلسة
- **لوحة تحليلات** -- لوحة تحكم المسؤول مع إجمالي المشاهدات والزوار الفريدين واليومي والصفحات الأولى والمراجع والrowsers والأجهزة والبلدان
- **محترف للخصوصية** -- جميع البيانات مخزنة محلياً في قاعدة البيانات، لا خدمات تحليلات خارجية

### إنشاء صور OG ديناميكي

يُنشئ تلقائياً صور Open Graph لمشاركة وسائل التواصل الاجتماعي:

- **دعم ثنائي اللغة** -- يُنشئ صوراً بالإنجليزية والعربية مع عرض خط صحيح (Noto Sans Arabic للعربية)
- **تصميم متدرج** -- صور 1200x630 بتدرج مع العنوان والعنوان الفرعي ورابط الموقع وشارة الشعار
- **تخصيص لكل صفحة** -- كل صفحة تُنشئ صورتها الخاصة

### تغذية RSS

تغذية RSS متوافقة مع المعايير في `/rss.xml`:

- **محتوى كامل** -- تتضمن المقالات والمشاريع والخدمات المنشورة مع الأوصاف
- **رابط Atom ذاتي** -- تكامل Atomproper لقارئي التغذية
- **مخزنة مؤقتاً** -- ذاكرة التخزين المؤقت للمتصفح (ساعة) والـ CDN (24 ساعة)

### تحسينات محركات البحث

ميزات SEO متقدمة تتجاوز الأساسيات:

- **تكامل IndexNow** -- فهرسة محركات البحث الفورية عند نشر محتوى جديد (Bing، Yandex)
- **LLMs.txt** -- ملف نصي منظم مصمم لنموذجات اللغة الكبيرة لفهم محتوى الموقع والخبرة ومعلومات الاتصال
- **بيانات مهيكلة غنية** -- Schema.org JSON-LD للمؤسسة وموقع الويب (مع SearchAction) والشخص والقائمة المتنقلة والأسئلة الشائعة وكيف تعمل وصفحة حول ومحتوى إبداعي وخدمات
- **خريطة الموقع محسنة** -- تتضمن صفحات الخدمات وصورغطاء المقالات وصور المشاريع كبيانات وصفية للصور

### رؤوس الأمان

رؤوس أمان شاملة مُعدة في `next.config.ts`:

- `Strict-Transport-Security` -- HSTS مع includeSubDomains والتحميل المسبق
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` -- يحظر الكاميرا والميكروفون والموقع الجغرافي والاهتمام المجموعي

### سياسة الخصوصية وشروط الخدمة

صفحات قانونية ثنائية اللغة مع بيانات مهيكلة:

- **سياسة الخصوصية** -- صفحة `/privacy` مع schema BreadcrumbList
- **شروط الخدمة** -- صفحة `/terms` مع schema BreadcrumbList
- كلا الصفحتين مرتبطان في التذييل ومترجمتان بالكامل

### صفحة "من أنا" المحسنة

الآن تتضمن أقساماً إضافية:

- **عملية "كيف أعمل"** -- قسم تدفق عمل من 4 خطوات (الاكتشاف، التطوير، الاختبار، النشر) مع schema HowTo
- **قسم الأسئلة الشائعة** -- أسئلة شائعة قابلة للتوسيع مع schema FAQPage
- **بيانات مهيكلة** -- نتائج بحث غنية مع أ schemas AboutPage و HowTo و FAQPage

### الصفحة الرئيسية المحسنة

الآن تعرض أقساماً إضافية:

- **الخدمات المميزة** -- أفضل 3 خدمات مع أيقونات متحركة ورابط لصفحة الخدمات الكاملة
- **المشاريع المميزة** -- عرض المشاريع المميزة مع الصور والتصنيفات والوسوم
- **أحدث المقالات** -- أحدث المقالات مع صور الغطاء ووقت القراءة
- **دعوة واتساب** -- قسم دعوة للتواصل المباشر عبر واتساب

### التنقل بالقائمة المتنقلة

مكون قائمة متنقلة قابل لإعادة الاستخدام مع:

- **دعم RTL** -- يتكيف تلقائياً مع التخطيط من اليمين إلى اليسار
- **تنقل متسق** -- يُستخدم في جميع الصفحات لتحسين تجربة المستخدم ومحركات البحث

### نظام رفع مُحسّن

رفع ملفات مُحسّن مع معالجة حسب النوع:

- **مجلدات منفصلة** -- الملفات مخزنة في `public/uploads/projects/` و `public/uploads/blog/` و `public/uploads/resume/`
- **التحقق من النوع** -- معامل الاستعلام `?type=` يتحقق من أنواع الملفات (صور للمشاريع/المدونة، PDF للسيرة الذاتية)
- **حدود الحجم** -- حد أقصى 5 ميجابايت لحجم الملف

### دعم صور متعدد للمشاريع

المشاريع الآن تدعم عدة صور:

- **معرض الصور** -- المشاريع يمكن أن يكون لها عدة صور مع ترتيب
- **إدارة المسؤول** -- رفع وترتيب وحذف صور المشاريع من محرر المسؤول
- **SEO الصور** -- صور المشاريع مشمولة في خريطة الموقع مع بيانات وصفية للصور

### تحسينات المدونة

مقالات المدونة الآن تدعم ميزات إضافية:

- **صور الغطاء** -- مقالات المدونة يمكن أن يكون لها صور غطاء معروضة في صفحات القائمة والتفاصيل
- **تتبع المؤلف** -- مقالات المدونة تتبع مؤلفها مع عرض اسم المؤلف

### صفحة إعدادات المسؤول

صفحة إعدادات مخصصة في لوحة تحكم المسؤول:

- **إدارة الملف الشخصي** -- تعديل الاسم والبريد الإلكتروني وكلمة المرور مباشرة من الإعدادات
- **إدارة السيرة الذاتية** -- رفع واستبدال أو حذف ملف PDF للسيرة الذاتية

### تحسينات إضافية

- **شعار الوضع الداكن** -- شعار منفصل للوضع الداكن عبر `hidden dark:block`
- **سكربت تعيين اللغة** -- سكربت عميل يمنع FOUC (وميض محتوى غير مُنسّق) للتخطيطات RTL
- **خط عربي** -- Noto Sans Arabic مضمن لتوليد صور OG وعرض النص العربي

---

## مجموعة التقنيات

| الطبقة | التقنية | الإصدار |
|---|---|---|
| الإطار | Next.js (App Router) | 16.2.7 |
| اللغة | TypeScript | 5.x |
| مكتبة الواجهة | React | 19.2.4 |
| التنسيق | Tailwind CSS | 4.x |
| مكتبة المكونات | shadcn/ui (Base UI) | 4.11.0 |
| الحركات | Framer Motion | 12.40.0 |
| قاعدة البيانات | SQLite / PostgreSQL | -- |
| ORM | Prisma | 5.22.0 |
| المصادقة | NextAuth.js (Credentials) | 4.24.14 |
| الأيقونات | Lucide React | 1.17.0 |
| تشفير كلمات المرور | bcryptjs | 3.0.3 |
| المحرر | react-markdown + remark-gfm + rehype-highlight | 10.1.0 / 4.0.1 / 7.0.2 |
| محرر Markdown | @uiw/react-md-editor | 4.1.1 |
| تمييز بناء الجملة | shiki | 4.2.0 |
| الرسوم البيانية | recharts | 3.8.1 |
| معالجة الصور | sharp | 0.34.5 |
| التحقق | zod | 4.4.3 |
| مساعدات i18n | next-intl | 4.13.0 |
| إدارة السمة | next-themes | 0.4.6 |
| CSS الحركات | tw-animate-css | 1.4.0 |
| فئات المتغيرات | class-variance-authority | 0.7.1 |
| المكونات الأساسية | @base-ui/react | 1.5.0 |
| مدير الحزم | pnpm | -- |
| النشر | Docker / PM2 | -- |

---

## خيارات التثبيت

يدعم هذا المشروع خياري قاعدة بيانات. اختر ما يناسب احتياجاتك:

| | SQLite (فرع `main-sqlite`) | Docker/PostgreSQL (فرع `main`) |
|---|---|---|
| **يتطلب Docker** | لا | نعم |
| **قاعدة البيانات** | SQLite (ملف محلي) | PostgreSQL 16 |
| **الأفضل لـ** | التطوير المحلي، الإعداد السريع | الإنتاج، الإعداد الكامل |

---

## البدء السريع (SQLite -- هذا الفرع)

> لا يتطلب Docker. هذه هي الطريقة الأبسط لتشغيل المشروع محلياً.

### المتطلبات

- **Node.js** 18+ (موصى به: 20)
- **pnpm** (مدير الحزم)

### 1. استنساخ المستودع

```bash
git clone -b main-sqlite https://github.com/dev-taherm/my-profile-oc.git
cd my-profile-oc
```

### 2. تثبيت التبعيات

```bash
pnpm install
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env
```

عدّل `.env` وأنشئ سراً آمناً:

```bash
openssl rand -base64 32
```

يجب أن يبدو `.env` الخاص بك هكذا:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="123456"
```

### 4. تهيئة قاعدة البيانات

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

يقوم هذا بإنشاء قاعدة بيانات SQLite، ودفع المخطط، وملئها ببيانات عينة (مستخدم مسؤول، مشاريع، مقال، تصنيفات، ووسوم).

### 5. إضافة صورة ملفك الشخصي

احفظ صورة ملفك الشخصي باسم `public/images/profile.jpg`.

### 6. بدء خادم التطوير

```bash
pnpm dev
```

افتح في متصفحك:
- **الإنجليزية**: http://localhost:3000/en
- **العربية**: http://localhost:3000/ar
- **لوحة التحكم**: http://localhost:3000/admin/login

---

## البدء السريع (Docker/PostgreSQL)

> يتطلب Docker. يستخدم PostgreSQL لإعداد شبيه بالإنتاج.

### المتطلبات

- **Node.js** 18+ (موصى به: 20)
- **pnpm** (مدير الحزم)
- **Docker** و **Docker Compose**

### 1. استنساخ المستودع

```bash
git clone -b main https://github.com/dev-taherm/my-profile-oc.git
cd my-profile-oc
```

### 2. تثبيت التبعيات

```bash
pnpm install
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env
```

عدّل `.env` وأنشئ سراً آمناً:

```bash
openssl rand -base64 32
```

يجب أن يبدو `.env` الخاص بك هكذا:

```env
DATABASE_URL="postgresql://portfolio:portfolio_secret@localhost:5432/portfolio"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="123456"
```

### 4. بدء تشغيل PostgreSQL

```bash
docker compose up -d db
```

يقوم هذا ببدء حاوية PostgreSQL 16 مع وحدة تخزين دائمة. قاعدة البيانات جاهزة عند اجتياز فحص الصحة.

### 5. تهيئة قاعدة البيانات

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 6. إضافة صورة ملفك الشخصي

احفظ صورة ملفك الشخصي باسم `public/images/profile.jpg`.

### 7. بدء خادم التطوير

```bash
pnpm dev
```

افتح في متصفحك:
- **الإنجليزية**: http://localhost:3000/en
- **العربية**: http://localhost:3000/ar
- **لوحة التحكم**: http://localhost:3000/admin/login

---

## لوحة التحكم

الوصول إلى لوحة التحكم على http://localhost:3000/admin/login

### بيانات الاعتماد الافتراضية

| الحقل | القيمة |
|---|---|
| البريد الإلكتروني | `admin` |
| كلمة المرور | `123456` |

> **ملاحظة أمنية:** عند تسجيل الدخول لأول مرة، يتم إعادة توجيهك إلى صفحة لتغيير البريد الإلكتروني وكلمة المرور. لا يمكن استخدام بيانات الاعتماد الافتراضية للوصول إلى لوحة التحكم.

### تغيير بيانات الاعتماد الإجباري

عند تسجيل الدخول باستخدام بيانات الاعتماد الافتراضية (`admin` / `123456`)، يتم إعادة توجيهك تلقائياً إلى صفحة تغيير بيانات الاعتماد. يجب تعيين اسمك وبريدك الإلكتروني وكلمة مرورك الخاصة قبل أن تتمكن من الوصول إلى لوحة التحكم. تensure هذه الميزة الأمنية عدم استخدام بيانات الاعتماد الافتراضية.

### لوحة القيادة

تعرض لوحة القيادة رسالة ترحيب مع اسمك وأزرار الإجراءات السريعة لإنشاء مشاريع أو مقالات جديدة. بطاقات الإحصائيات تظهر العدد الإجمالي للمشاريع والمقالات ورسائل الاتصال.

### إدارة المشاريع

- **عرض القائمة** -- جدول يعرض جميع المشاريع مع العنوان وشارة الحالة وعلامة المميزة وأزرار الإجراءات (تعديل/حذف)
- **إنشاء/تعديل** -- محرر كامل مع:
  - **بطاقة الإعدادات** -- الرابط المختصر، رابط GitHub، رابط الموقع، خيار مميز، قائمة الحالة (مسودة/منشور/مؤرشف)، خيارات التصنيفات، وخيارات الوسوم
  - **تبويبات الترجمة** -- التبديل بين محرري الإنجليزية والعربية، لكل منهما حقول العنوان والوصف ومحتوى Markdown
  - **دعم RTL** -- حقول المحتوى العربي تتحول تلقائياً إلى اتجاه النص من اليمين إلى اليسار
- **حذف** -- مربع حوار تأكيد قبل الحذف الدائم

### إدارة المدونة

- **عرض القائمة** -- جدول يعرض جميع المقالات مع العنوان وشارة الحالة ووقت القراءة وأزرار الإجراءات (تعديل/حذف)
- **إنشاء/تعديل** -- محرر كامل مع:
  - **بطاقة الإعدادات** -- الرابط المختصر، خيار مميز، وقت القراءة، قائمة الحالة (مسودة/منشور/مؤرشف)، خيارات التصنيفات، وخيارات الوسوم
  - **تبويبات الترجمة** -- محرري الإنجليزية والعربية مع حقول العنوان والم摘要有 ومحتوى Markdown
  - **تاريخ النشر التلقائي** -- يتم تعيين `publishedAt` تلقائياً عند تغيير الحالة إلى منشور
- **حذف** -- مربع حوار تأكيد قبل الحذف الدائم

### التصنيفات والوسوم

- **التصنيفات** -- إنشاء وحذف التصنيفات (مثل: Backend, AI/LLM, Full-Stack, DevOps) لتنظيم المشاريع والمقالات. تعيين التصنيفات للمشاريع والمقالات من صفحات المحرر باستخدام خيارات الاختيار
- **الوسوم** -- إنشاء وحذف الوسوم (مثل: Python, Django, React, Docker) لتصنيف المحتوى بدقة عبر المشاريع والمقالات. تعيين الوسوم للمشاريع والمقالات من صفحات المحرر باستخدام خيارات الاختيار

### إدارة الخدمات

- **عرض القائمة** -- جدول يعرض جميع الخدمات مع العنوان وشارة الحالة وعلامة المميزة وأزرار الإجراءات (تعديل/حذف)
- **إنشاء/تعديل** -- محرر كامل مع:
  - **بطاقة الإعدادات** -- الرابط المختصر، اختيار الأيقونة، خيار مميز، قائمة الحالة (مسودة/منشور/مؤرشف)، ترتيب العرض
  - **تبويبات الترجمة** -- التبديل بين محرري الإنجليزية والعربية، لكل منهما حقول العنوان والوصف القصير والوصف الكامل وقائمة الميزات
  - **دعم RTL** -- حقول المحتوى العربي تتحول تلقائياً إلى اتجاه النص من اليمين إلى اليسار
- **حذف** -- مربع حوار تأكيد قبل الحذف الدائم

### مكتبة الوسائط

مكتبة وسائط كاملة لإدارة الملفات المرفوعة:

- **إدارة المجلدات** -- إنشاء وإعادة تسمية وحذف المجلدات لتنظيم الوسائط
- **رفع الملفات** -- رفع بالسحب والإفلات مع تحويل تلقائي إلى WebP لصور JPEG/PNG
- **عرض الشبكة** -- شبكة بصرية مع معاينات الصور وحجم الملف ونوع MIME
- **العمليات المجمعة** -- تحديد عدة ملفات للحذف أو النقل بين المجلدات
- **البحث والتصفية** -- البحث بالاسم والتصفية حسب نوع MIME والمجلد
- **نسخ الرابط** -- نسخ الرابط بنقرة واحدة لسهولة تضمين المحتوى

### الإعدادات

- **إدارة الملف الشخصي** -- تعديل الاسم والبريد الإلكتروني وكلمة المرور مباشرة من صفحة الإعدادات
- **إدارة السيرة الذاتية** -- رفع واستبدال أو حذف ملف PDF للسيرة الذاتية

### لوحة تحليلات

- **نظرة عامة** -- إجمالي المشاهدات والزوار الفريدين ورسوم بيانية يومية
- **الصفحات الأولى** -- الأكثر زيارة مع عدادات المشاهدات
- **أول المراجع** -- مصادر حركة المرور
- **إحصائيات المتصفحات والأجهزة** -- أنواع المتصفحات وأنظمة التشغيل وفئات الأجهزة
- **إحصائيات البلدان** -- التوزيع الجغرافي للزوار

---

## توثيق API

جميع مسارات API تحت `/api/`. تتطلب المصادقة لعمليات الكتابة (POST/PUT/DELETE) وتستخدم JWT من NextAuth.js.

### المصادقة

| النقطة النهائية | الطريقة | الوصف |
|---|---|---|
| `/api/auth/[...nextauth]` | -- | نقاط المصادقة في NextAuth.js (تسجيل الدخول، الخروج، الجلسة) |

### المشاريع

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/projects` | GET | لا | عرض جميع المشاريع (مرتبة حسب `order`). تتضمن الترجمات والتصنيفات والوسوم |
| `/api/projects` | POST | نعم | إنشاء مشروع جديد مع الترجمات. يقبل `categoryIds` و `tagIds` لتعيين التصنيفات والوسوم |
| `/api/projects?id={id}` | PUT | نعم | تعديل مشروع موجود. يستبدل الترجمات والتصنيفات والوسوم |
| `/api/projects?id={id}` | DELETE | نعم | حذف مشروع وترجماته |

### مقالات المدونة

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/blog` | GET | لا | عرض جميع المقالات. تتضمن الترجمات والتصنيفات والوسوم واسم المؤلف |
| `/api/blog?id={id}` | GET | لا | الحصول على مقال واحد بالمعرف |
| `/api/blog` | POST | نعم | إنشاء مقال جديد مع الترجمات. يقبل `categoryIds` و `tagIds` لتعيين التصنيفات والوسوم |
| `/api/blog?id={id}` | PUT | نعم | تعديل مقال موجود. يستبدل الترجمات والتصنيفات والوسوم |
| `/api/blog?id={id}` | DELETE | نعم | حذف مقال وترجماته |

### التصنيفات

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/categories` | GET | لا | عرض جميع التصنيفات مع عدادات الاستخدام (المشاريع والمقالات) |
| `/api/categories` | POST | نعم | إنشاء تصنيف جديد. الجسم: `{ "name": "اسم التصنيف" }`. يتم إنشاء الرابط المختصر تلقائياً |
| `/api/categories?id={id}` | DELETE | نعم | حذف تصنيف |

### الوسوم

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/tags` | GET | لا | عرض جميع الوسوم مع عدادات الاستخدام (المشاريع والمقالات) |
| `/api/tags` | POST | نعم | إنشاء وسم جديد. الجسم: `{ "name": "اسم الوسم" }`. يتم إنشاء الرابط المختصر تلقائياً |
| `/api/tags?id={id}` | DELETE | نعم | حذف وسم |

### الاتصال

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/contact` | POST | لا | إرسال رسالة اتصال. الحقول المطلوبة: `name`، `email`، `message` |

### رفع الملفات

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/upload?type={type}` | POST | نعم | رفع ملف. معامل النوع: `projects` (صور)، `blog` (صور)، `resume` (PDF). الحد الأقصى 5 ميجابايت. يرجع `{ url: "/uploads/{type}/{filename}" }` |

### الخدمات

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/services` | GET | لا | عرض جميع الخدمات (مرتبة حسب `order`). تتضمن الترجمات |
| `/api/services` | POST | نعم | إنشاء خدمة جديدة مع الترجمات |
| `/api/services?id={id}` | PUT | نعم | تعديل خدمة موجودة. تستبدل الترجمات |
| `/api/services?id={id}` | DELETE | نعم | حذف خدمة وترجماتها |

### الوسائط

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/media` | GET | نعم | عرض ملفات الوسائط. يدعم `search` و `mimeType` و `folderId` |
| `/api/media` | POST | نعم | رفع ملفات الوسائط. يحول JPEG/PNG تلقائياً إلى WebP |
| `/api/media?id={id}` أو `/api/media?ids={id1,id2}` | DELETE | نعم | حذف ملف أو عدة ملفات |
| `/api/media/folders` | GET | نعم | عرض جميع مجلدات الوسائط |
| `/api/media/folders` | POST | نعم | إنشاء مجلد جديد. الجسم: `{ "name": "اسم المجلد" }` |
| `/api/media/folders/{id}` | PUT | نعم | إعادة تسمية مجلد |
| `/api/media/folders/{id}` | DELETE | نعم | حذف مجلد |
| `/api/media/move` | POST | نعم | نقل وسائط إلى مجلد. الجسم: `{ "mediaIds": [...], "folderId": "..." }` |

### التحليلات

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/analytics` | POST | لا | تسجيل مشاهدة صفحة. يلتقط تلقائياً魔法师和 المستخدم والبلد ومعرّف الجلسة |
| `/api/analytics/dashboard` | GET | نعم | بيانات لوحة التحليلات: إجمالي المشاهدات والزوار الفريدين واليومي والصفحات الأولى والمراجع وإحصائيات المتصفحات/الأجهزة/البلدان |

### تغذية RSS

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/rss.xml` | GET | لا | تغذية RSS 2.0 مع المقالات والمشاريع والخدمات المنشورة. مخزنة مؤقتاً (ساعة للمتصفح / 24 ساعة للـ CDN) |

### IndexNow

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/indexnow` | GET | لا | نقطة التحقق من مفتاح IndexNow |
| `/api/indexnow` | POST | نعم | إبلاغ محركات البحث (Bing/Yandex) للفهرسة الفورية |

### الملف الشخصي

| النقطة النهائية | الطريقة | مصادقة | الوصف |
|---|---|---|---|
| `/api/user/profile` | GET | نعم | جلب الملف الشخصي مع resumeUrl |
| `/api/user/profile` | PUT | نعم | تحديث الاسم والبريد الإلكتروني وكلمة المرور و resumeUrl |
| `/api/resume` | GET | لا | جلب رابط ملف PDF للسيرة الذاتية |

---

## هيكل المشروع

```
├── prisma/
│   ├── schema.prisma              # مخطط قاعدة البيانات (SQLite أو PostgreSQL)
│   └── seed.ts                    # سكربت الزراعة (يملا قاعدة البيانات ببيانات عينة)
│
├── public/
│   ├── images/                    # الصور الثابتة (صورة الملف الشخصي، لقطات الشاشة)
│   ├── fonts/                     # الخطوط (Noto Sans Arabic لصور OG)
│   ├── uploads/                   # الملفات المرفوعة (مشاريع، مدونة، سيرة ذاتية)
│   ├── scripts/                   # سكربتات العميل (set-locale.js لمنع FOUC في RTL)
│   └── llms.txt                   # ملف اكتشاف LLM (محتوى منظم للنماذج اللغوية الكبيرة)
│
├── src/
│   ├── app/
│   │   ├── [locale]/              # الصفحات المترجمة (en/ar)
│   │   │   ├── page.tsx           # الصفحة الرئيسية (بطاقة تعريفية، إحصائيات، تقنيات، خدمات، مشاريع، مدونة، دعوة واتساب)
│   │   │   ├── about/page.tsx     # صفحة من نحن (خبرات، تعليم، شهادات، كيف أعمل، أسئلة شائعة)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx       # قائمة المشاريع مع بحث
│   │   │   │   └── [slug]/page.tsx # تفاصيل المشروع مع محتوى Markdown ومعرض صور
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx       # قائمة المدونة مع بحث
│   │   │   │   └── [slug]/page.tsx # تفاصيل المقال مع صورة غطاء ومحتوى Markdown
│   │   │   ├── services/
│   │   │   │   ├── page.tsx       # صفحة عرض الخدمات
│   │   │   │   └── [slug]/page.tsx # تفاصيل الخدمة مع الميزات ودعوة واتساب
│   │   │   ├── resume/page.tsx    # صفحة السيرة الذاتية مع تحميل PDF
│   │   │   ├── contact/page.tsx   # نموذج الاتصال + المعلومات
│   │   │   ├── privacy/page.tsx   # صفحة سياسة الخصوصية
│   │   │   └── terms/page.tsx     # صفحة شروط الخدمة
│   │   │
│   │   ├── admin/                 # لوحة التحكم
│   │   │   ├── page.tsx           # نظرة عامة على لوحة القيادة
│   │   │   ├── login/page.tsx     # صفحة تسجيل الدخول
│   │   │   ├── change-password/   # صفحة تغيير بيانات الاعتماد الإجباري
│   │   │   ├── projects/          # إدارة المشاريع
│   │   │   ├── blog/              # إدارة المقالات
│   │   │   ├── services/          # إدارة الخدمات
│   │   │   ├── categories/        # إدارة التصنيفات
│   │   │   ├── tags/              # إدارة الوسوم
│   │   │   ├── media/             # مكتبة الوسائط (مجلدات، رفع، عمليات مجمعة)
│   │   │   └── settings/          # إعدادات الملف الشخصي والسيرة الذاتية
│   │   │
│   │   ├── api/                   # مسارات API
│   │   │   ├── auth/              # مصادقة NextAuth.js
│   │   │   ├── projects/          # إدارة المشاريع (يقبل categoryIds/tagIds)
│   │   │   ├── blog/              # إدارة المقالات (يقبل categoryIds/tagIds)
│   │   │   ├── services/          # إدارة الخدمات
│   │   │   ├── categories/        # إدارة التصنيفات
│   │   │   ├── tags/              # إدارة الوسوم
│   │   │   ├── media/             # مكتبة الوسائط (رفع، مجلدات، نقل)
│   │   │   ├── analytics/         # تتبع مشاهدات الصفحة وبيانات لوحة التحكم
│   │   │   ├── contact/           # إرسال نموذج الاتصال
│   │   │   ├── upload/            # رفع ملفات محسنة (مشاريع/مدونة/سيرة ذاتية)
│   │   │   ├── og/                # إنشاء صور OG ديناميكي
│   │   │   ├── indexnow/          # تكامل IndexNow (فهرسة فورية)
│   │   │   ├── resume/            # نقطة نهاية رابط السيرة الذاتية
│   │   │   └── user/profile/      # تحديث بيانات الاعتماد والسيرة الذاتية
│   │   │
│   │   ├── uploads/[...path]      # تقديم الملفات الثابتة للوسائط المرفوعة
│   │   ├── rss.xml/               # نقطة نهاية تغذية RSS
│   │   ├── sitemap.ts             # إنشاء خريطة الموقع الديناميكية (مع الخدمات والصور)
│   │   ├── robots.ts              # إنشاء robots.txt
│   │   ├── not-found.tsx          # صفحة 404 مخصصة
│   │   ├── layout.tsx             # تخطيط HTML الجذر (مع رابط RSS و meta LLMs.txt)
│   │   └── globals.css            # الأنماط العامة ومتغيرات السمة
│   │
│   ├── components/
│   │   ├── sections/              # أقسام الصفحة الرئيسية (بطاقة تعريفية، إحصائيات، تقنيات، خدمات مميزة، مشاريع مميزة، أحدث المقالات، دعوة واتساب)
│   │   ├── layout/                # الرأس، التذييل (مع روابط الخصوصية والشروط)
│   │   ├── blog/                  # قائمة المدونة، تفاصيل المقال
│   │   ├── projects/              # قائمة المشاريع، تفاصيل المشروع
│   │   ├── services/              # قائمة الخدمات، تفاصيل الخدمة
│   │   ├── contact/               # نموذج الاتصال، معلومات الاتصال
│   │   ├── resume/                # عرض السيرة الذاتية
│   │   ├── shared/                # الأقسام المتحركة، رأس الصفحة، صورة الملف الشخصي، الأيقونات، القائمة المتنقلة، JsonLd
│   │   ├── admin/                 # الشريط الجانبي للإدارة (مع روابط الخدمات والوسائط والإعدادات)
│   │   └── ui/                    # مكونات shadcn/ui
│   │
│   ├── i18n/
│   │   ├── config.ts              # مساعدات التحقق من اللغة والاكتشاف
│   │   ├── get-dictionary.ts      # محمّل القاموس
│   │   └── dictionaries/
│   │       ├── en.json            # ترجمات الإنجليزية
│   │       └── ar.json            # ترجمات العربية
│   │
│   ├── lib/
│   │   ├── constants.ts           # إعدادات الموقع والتنقل وتعريفات اللغة
│   │   ├── prisma.ts              # عميل Prisma أحادي
│   │   └── utils.ts               # أداة cn() (clsx + tailwind-merge)
│   │
│   ├── types/
│   │   └── index.ts               # تعريفات TypeScript
│   │
│   └── proxy.ts                 # اكتشاف اللغة والتوجيه وإعادة التوجيه وتتبع التحليلات (Next.js 16)
│
├── docker-compose.yml             # خدمات PostgreSQL + التطبيق (فرع main)
├── Dockerfile                     # بناء الإنتاج متعدد المراحل
├── components.json                # إعدادات shadcn/ui
├── tailwind.config.ts             # إعدادات Tailwind CSS
├── next.config.ts                 # إعدادات Next.js (مع رؤوس الأمان)
└── .env.example                   # قالب متغيرات البيئة
```

---

## الأوامر المتاحة

| الأمر | الوصف |
|---|---|
| `pnpm dev` | بدء خادم التطوير مع إعادة التحميل (Turbopack) |
| `pnpm build` | إنشاء بناء إنتاجي |
| `pnpm start` | بدء خادم الإنتاج |
| `pnpm lint` | تشغيل ESLint |
| `pnpm db:generate` | إنشاء عميل Prisma من المخطط |
| `pnpm db:push` | دفع تغييرات المخطط إلى قاعدة البيانات (بدون ملف انتقال) |
| `pnpm db:migrate` | تشغيل انتقالات قاعدة البيانات (يإنشاء ملفات انتقال) |
| `pnpm db:seed` | زراعة قاعدة البيانات ببيانات عينة |
| `pnpm db:studio` | فتح Prisma Studio (مستعرض مرئي لقاعدة البيانات) |
| `pnpm db:reset` | إعادة تعيين قاعدة البيانات وإعادة تشغيل الانتقالات والزراعة |

---

## النشر

### Docker (موصى به للإنتاج)

```bash
docker compose up -d
```

يقوم هذا بتشغيل قاعدة البيانات PostgreSQL وتطبيق Next.js. يستخدم Dockerfile بناء متعدد المراحل:

1. **التبعيات** -- يتثبيت التبعيات الإنتاجية فقط
2. **المنشئ** -- يبني تطبيق Next.js مع مخرجات مستقلة
3. **المشغل** -- يعمل التطبيق في حاوية Node.js Alpine كمستخدم غير جذر

### VPS مع CloudPanel + Nginx

1. بناء المشروع:
   ```bash
   pnpm build
   ```

2. انسخ `.env.example` إلى `.env` وقم بتكوين قيم الإنتاج

3. إعداد قاعدة البيانات:
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

4. بدء التشغيل مع PM2:
   ```bash
   pm2 start pnpm --name "portfolio" -- start
   ```

5. تكوين Nginx كخادم عكسي لإعادة توجيه المنفذ 3000

---

## مرجع متغيرات البيئة

| المتغير | مطلوب | الوصف |
|---|---|---|
| `DATABASE_URL` | نعم | سلسلة اتصال قاعدة البيانات: `file:./dev.db` (SQLite) أو `postgresql://user:pass@host:5432/db` (PostgreSQL) |
| `NEXTAUTH_SECRET` | نعم | سر عشوائي لتوقيع JWT. يتم إنشاؤه بـ `openssl rand -base64 32` |
| `NEXTAUTH_URL` | نعم | رابط موقعك (مثلاً `http://localhost:3000` للتطوير، `https://yourdomain.com` للإنتاج) |
| `ADMIN_EMAIL` | نعم | البريد الإلكتروني الافتراضي للمسؤول لتسجيل الدخول الأولي (الافتراضي: `admin`) |
| `ADMIN_PASSWORD` | نعم | كلمة المرور الافتراضية للمسؤول لتسجيل الدخول الأولي (الافتراضي: `123456`) |

---

## التخصيص

### بيانات الملف الشخصي

عدّل `src/lib/constants.ts` لتحديث معلوماتك الشخصية:

- **الاسم واللقب والوصف** -- المستخدم في البطاقة التعريفية والبيانات الوصفية
- **البريد الإلكتروني والهاتف والموقع** -- معروض على صفحة الاتصال
- **روابط التواصل الاجتماعي** -- روابط GitHub وLinkedIn
- **عناصر التنقل** -- إضافة أو إزالة أو إعادة ترتيب روابط التنقل

### المحتوى

- **المشاريع والمقالات** -- تُدار عبر لوحة التحكم (لا حاجة لتغيير الكود)
- **التصنيفات والوسوم** -- تُدار عبر لوحة التحكم
- **إحصائيات الصفحة الرئيسية** -- عدّل قيم الإحصائيات في `src/i18n/dictionaries/en.json` و `ar.json`

### الترجمات

عدّل ملفات الترجمة لتخصيص جميع النصوص على الموقع:

- `src/i18n/dictionaries/en.json` -- ترجمات الإنجليزية
- `src/i18n/dictionaries/ar.json` -- ترجمات العربية

لإضافة لغة جديدة:

1. أنشئ ملف قاموس جديد (مثل `fr.json`)
2. أضف اللغة إلى مصفوفة `LOCALES` في `src/lib/constants.ts`
3. حدّث الـ middleware إذا لزم الأمر

### التنسيق

يستخدم المشروع Tailwind CSS v4 مع shadcn/ui. خصص السمة بتعديل:

- `src/app/globals.css` -- ألوان السمة (الوضع الداكن/الفاتح)، متغيرات CSS
- `components.json` -- إعدادات shadcn/ui (النمط، اللون الأساسي)

---

## المساهمة

المساهمات مرحب بها! إليك كيفية البدء:

1. ا fork المستودع
2. أنشئ فرع ميزة (`git checkout -b feature/amazing-feature`)
3. التزم بتغييراتك (`git commit -m 'Add amazing feature'`)
4. ادفع إلى الفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

يرجى التأكد من:

- اتباع نمط الكود الحالي
- تشغيل `pnpm lint` قبل الالتزام
- اختبار تغييراتك محلياً مع `pnpm dev`

---

## الترخيص

هذا المشروع مرخص بموجب رخصة MIT. راجع ملف [LICENSE](LICENSE) للتفاصيل.

</details>
