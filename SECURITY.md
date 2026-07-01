# Security Policy

## Supported Versions

| Version | Supported          |
| --- | --- |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to **[your-email@example.com]**. All security vulnerabilities will be promptly addressed.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### What to include

When reporting a vulnerability, please include:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### Response timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 1 week
- **Fix release**: Depends on severity

## Security Best Practices

When deploying this project, follow these security guidelines:

### Environment Variables

- Never commit `.env` files to version control
- Use strong, unique values for `NEXTAUTH_SECRET`
- Use strong admin credentials (not defaults)
- Rotate secrets regularly

### Authentication

- Change default admin credentials immediately on first login
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- The admin panel forces credential change on first login

### Database

- Use PostgreSQL for production (not SQLite)
- Enable database backups
- Restrict database access

### Deployment

- Use HTTPS in production
- Keep dependencies updated
- Use security headers (already configured in `next.config.ts`)
- Enable rate limiting for API endpoints

### Docker

- Don't run containers as root
- Use specific image tags (not `latest`)
- Scan images for vulnerabilities

## Updates

Security updates will be released as patch versions and announced in:
- GitHub Releases
- Security Advisories

## Acknowledgments

We thank all security researchers who responsibly disclose vulnerabilities.
