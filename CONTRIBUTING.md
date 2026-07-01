# Contributing to Portfolio & Career Website

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20)
- **pnpm** (package manager)
- **Git**

### Setup

1. **Fork** the repository on GitHub

2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/my-profile-oc.git
   cd my-profile-oc
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Set up environment**:
   ```bash
   cp .env.example .env
   ```

5. **Initialize database**:
   ```bash
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

6. **Start development server**:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Branch Naming

Use descriptive branch names:

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/description` | `feature/add-dark-mode-toggle` |
| Bug fix | `fix/description` | `fix/contact-form-validation` |
| Documentation | `docs/description` | `docs/update-api-reference` |
| Refactor | `refactor/description` | `refactor/admin-components` |

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes

3. Run linting:
   ```bash
   pnpm lint
   ```

4. Test your changes:
   ```bash
   pnpm build
   ```

5. Commit your changes (see [Commit Messages](#commit-messages))

6. Push to your fork:
   ```bash
   git push origin feature/your-feature
   ```

7. Open a Pull Request

## Project Structure

```
src/
  app/              # Next.js App Router pages and API routes
    [locale]/       # Localized public pages
    admin/          # Admin dashboard pages
    api/            # REST API endpoints
    actions/        # Server actions
  components/       # React components
    admin/          # Admin-specific components
    blog/           # Blog components
    contact/        # Contact form components
    layout/         # Header, Footer
    projects/       # Project components
    sections/       # Homepage sections
    services/       # Service components
    shared/         # Reusable components
    ui/             # shadcn/ui base components
  contexts/         # React contexts
  hooks/            # Custom React hooks
  i18n/             # Internationalization
  lib/              # Utilities and helpers
  types/            # TypeScript type definitions
prisma/             # Database schema and migrations
public/             # Static assets
```

## Code Style

### TypeScript

- Use TypeScript for all files
- Avoid `any` types - use proper type annotations
- Use interfaces for object shapes
- Export types from `src/types/` when shared across files

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Prefer server components when possible

### Styling

- Use Tailwind CSS classes
- Follow the existing color scheme
- Use `cn()` utility for conditional classes
- Maintain RTL/LTR compatibility

### Files

- Use PascalCase for component files: `BlogList.tsx`
- Use camelCase for utility files: `formatDate.ts`
- Keep files under 300 lines when possible

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```
feat(blog): add reading time calculation
fix(contact): validate email format
docs(readme): update installation steps
refactor(admin): extract media picker component
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Changes are tested locally
- [ ] Build passes (`pnpm build`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Documentation is updated if needed
- [ ] No console errors or warnings

### PR Description

Include:

1. **What** does this PR do?
2. **Why** is this change needed?
3. **How** was it tested?
4. **Screenshots** if UI changed

### Review Process

1. Maintainers will review your PR
2. Address any feedback
3. Once approved, your PR will be merged

## Reporting Bugs

Use the [Bug Report template](https://github.com/dev-taherm/my-profile-oc/issues/new?template=bug_report.md) and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## Suggesting Features

Use the [Feature Request template](https://github.com/dev-taherm/my-profile-oc/issues/new?template=feature_request.md) and include:

- Problem description
- Proposed solution
- Alternatives considered
- Additional context

## Questions?

Feel free to open a [Discussion](https://github.com/dev-taherm/my-profile-oc/discussions) if you have questions!

Thank you for contributing!
