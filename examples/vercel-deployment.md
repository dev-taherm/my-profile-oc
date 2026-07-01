# Vercel Deployment Guide

Deploy to Vercel in minutes.

## Prerequisites

- Vercel account
- PostgreSQL database (Vercel Postgres, Neon, or Supabase)

## Steps

1. Push your fork to GitHub

2. Go to [vercel.com/new](https://vercel.com/new)

3. Import your GitHub repository

4. Configure environment variables:
   ```
   DATABASE_URL=your-postgresql-connection-string
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   NEXTAUTH_URL=https://your-domain.vercel.app
   ADMIN_EMAIL=admin
   ADMIN_PASSWORD=your-password
   ```

5. Deploy

## Important Notes

- Vercel uses serverless functions
- Use PostgreSQL (not SQLite) for production
- Set `NEXTAUTH_URL` to your production domain

## Custom Domain

1. Go to your project settings in Vercel
2. Add your custom domain
3. Update `NEXTAUTH_URL` to match
