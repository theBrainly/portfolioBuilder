# Portfolio Builder

A multi-user portfolio builder built with Next.js 14, TypeScript, MongoDB, and NextAuth.

Each user gets their own account, admin dashboard, published portfolio URL, and customizable portfolio content. The app supports portfolio slugs like `/your-name`, optional custom domains, contact form inboxes, resume import, plan-based feature limits, and Pro upgrades powered by Razorpay.

## Highlights

- Multi-user portfolio publishing with per-user content isolation
- Public portfolio pages served from `/{portfolioSlug}` or a connected custom domain
- Admin CMS for projects, skills, experience, testimonials, messages, and site settings
- Email-backed contact form with dashboard inbox
- Resume parsing and one-click import into portfolio content
- AI writing assistant for Pro users
- Free and Pro plans with feature gating
- Razorpay-based upgrade flow
- SEO helpers including metadata, robots, and sitemap generation
- Rate limiting for signup, login, contact, and seed endpoints

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- MongoDB with Mongoose
- NextAuth credentials auth
- Cloudinary for uploads
- Nodemailer for email
- Razorpay for payments
- Zod + React Hook Form for validation and forms
- Zustand for admin UI state

## How It Works

On localhost, the root route `/` shows the product landing page.

After a user signs up:

- an account is created
- a unique `portfolioSlug` is reserved
- default site settings are created
- the user can manage their content from the admin area
- their portfolio is published at `/{portfolioSlug}`

If a custom domain is configured for a user, the app can resolve that domain directly to their portfolio.

## Main Features

### Public experience

- Product landing page for the portfolio builder
- User portfolio homepage and project detail pages
- Portfolio metadata generated from user settings
- Contact section for inbound inquiries

### Admin experience

- Dashboard with portfolio and inbox stats
- CRUD for projects
- CRUD for experience
- CRUD for skills
- CRUD for testimonials
- Message inbox for contact submissions
- Settings editor for branding, SEO, hero content, and portfolio URL settings
- Upgrade page for plan management

### Pro features

- Unlimited content entries
- AI writing assistant
- All theme palettes and design presets
- Custom domain support
- Analytics-related plan support
- Priority support flags in plan configuration

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values you need.

```env
MONGODB_URI=

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

ADMIN_EMAIL=
ADMIN_PASSWORD=
SEED_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_TO=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

GROQ_API_KEY=
OPENROUTER_API_KEY=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### What is optional?

- Cloudinary is needed for image/file uploads
- SMTP variables are needed for email delivery from the contact flow
- Razorpay variables are needed for Pro upgrades
- `GROQ_API_KEY` or `OPENROUTER_API_KEY` is needed for AI generation
- `SEED_SECRET` is recommended for controlled setup outside local development

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app at [http://localhost:3000](http://localhost:3000)

## Initial Setup

You have two common ways to start using the app:

### Option 1: Create a normal user account

- Visit `/signup`
- Create your account and choose a portfolio slug
- Log in and manage your portfolio from `/admin`

### Option 2: Seed an admin account

Use the setup route:

```text
/api/seed
```

Notes:

- In local development, seeding works without `SEED_SECRET` unless you set one
- In production, you should configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SEED_SECRET`
- You can pass the secret with the `x-seed-secret` header or `?secret=...`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
src/
  app/
    (public)/            public pages and portfolio routes
    admin/               admin dashboard pages
    api/                 auth, content, upload, payment, settings, and seed routes
  components/
    admin/               admin UI
    public/              landing page and portfolio UI
    ui/                  shared primitives
  lib/                   auth, db, portfolio resolution, subscriptions, helpers
  models/                Mongoose schemas
  constants/             plans, UI config, AI config
  hooks/                 client hooks
  store/                 Zustand state
```

## Route Overview

- `/` product landing page on localhost, or portfolio homepage when resolved by custom domain
- `/signup` create a new account
- `/login` user login
- `/admin/*` protected admin dashboard
- `/{portfolioSlug}` published user portfolio
- `/{portfolioSlug}/projects/{slug}` published project details
- `/api/auth/*` auth routes
- `/api/admin/*` protected admin APIs

## Deployment Notes

- Set `NEXT_PUBLIC_SITE_URL` to your production base URL
- Configure MongoDB, NextAuth, and any optional integrations you plan to use
- For custom domains, make sure your hosting and DNS point the domain to this app
- The app is structured to work well on Vercel

## Status

This repo contains both:

- the product landing page for the builder itself
- the portfolio publishing platform used by each signed-in user

That makes it a good fit for a SaaS-style portfolio platform, not just a single personal portfolio site.
