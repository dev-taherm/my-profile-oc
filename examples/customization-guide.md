# Customization Guide

Personalize this template for your own portfolio.

## 1. Profile Information

Edit `src/lib/profile.ts` to update your personal details:

```typescript
export const profile = {
  name: "Your Name",
  title: "Your Title",
  email: "you@example.com",
  // ...
}
```

Or use the admin dashboard to update via the database.

## 2. Profile Photo

Replace `public/images/profile.jpg` with your photo.

## 3. Translations

Edit translation files:

- `src/i18n/dictionaries/en.json` - English
- `src/i18n/dictionaries/ar.json` - Arabic

Add new languages:

1. Create a new dictionary file (e.g., `fr.json`)
2. Add the locale to `src/lib/constants.ts`
3. Update the middleware if needed

## 4. Theme

Customize colors in `src/app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  /* ... */
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  /* ... */
}
```

## 5. Content

Use the admin dashboard to manage:

- Projects
- Blog posts
- Services
- Categories and tags
- Media files

## 6. Pages

Modify or add pages in `src/app/[locale]/`:

- `home/` - Homepage
- `about/` - About page
- `blog/` - Blog
- `projects/` - Projects
- `services/` - Services
- `contact/` - Contact

## 7. Admin Access

Default credentials are in `.env`:

```
ADMIN_EMAIL=admin
ADMIN_PASSWORD=123456
```

**Change these immediately** on first login.
