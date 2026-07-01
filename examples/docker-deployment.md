# Docker Deployment Guide

This guide covers deploying with Docker and PostgreSQL.

## Prerequisites

- Docker and Docker Compose installed

## Steps

1. Clone the main branch:
   ```bash
   git clone https://github.com/dev-taherm/my-profile-oc.git
   cd my-profile-oc
   ```

2. Set up environment:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@db:5432/portfolio"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ADMIN_EMAIL="admin"
   ADMIN_PASSWORD="your-password"
   ```

4. Start with Docker Compose:
   ```bash
   docker compose up -d
   ```

5. Open http://localhost:3000

## Docker Compose Services

- **app**: Next.js application (port 3000)
- **db**: PostgreSQL 16 database

## Production Tips

- Use a reverse proxy (nginx, Caddy) for HTTPS
- Set strong passwords and secrets
- Enable database backups
- Use Docker volumes for persistent data
