# LaunchFast AI

**Production-ready SaaS boilerplate** with authentication, Stripe subscriptions, credit system, and AI-powered proposal generation. Built for freelancers and indie hackers who want to ship fast.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![NestJS](https://img.shields.io/badge/NestJS-11-e0234e)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-SDK%2020-635bff)](https://stripe.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991)](https://openai.com)

---

## Table of contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [License](#license)

---

## Features

| Area | What's included |
|------|-----------------|
| **Auth** | JWT-based register/login, protected routes, session handling |
| **Payments** | Stripe Checkout, Customer Portal, webhooks for subscriptions |
| **Credits** | Per-user quota (Free: 5/mo, Pro: 100/mo), reset logic, guard + interceptor |
| **AI** | OpenAI integration, proposal generator for freelancers, history with copy/export |
| **UX** | i18n (EN/ES), 404 page, error boundary, 401 auto-logout |
| **Backend** | Global exception filter, Helmet, health check, rate limiting |
| **Database** | Supabase (PostgreSQL), RLS, multi-tenantâ€“ready schema |

---

## Screenshots

Add `landing.png`, `dashboard.png`, and `generator.png` under `docs/screenshots/` to showcase the UI.

| Landing | Dashboard | Generator |
|---------|-----------|-----------|
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Generator](docs/screenshots/generator.png) |

---

## Quick start

**Prerequisites:** Node.js â‰¥18, accounts on [Supabase](https://supabase.com), [Stripe](https://stripe.com), [OpenAI](https://platform.openai.com).

```bash
# Clone and install
git clone https://github.com/JuanMBasile/LaunchFast-AI-SaaS.git
cd LaunchFast-AI-SaaS
cp .env.example .env
# Edit .env with your Supabase, Stripe, and OpenAI keys

# Run schema in Supabase SQL Editor: database/schema.sql

# Backend
cd backend && npm install && npm run start:dev

# Frontend (another terminal)
cd frontend && npm install && npm run dev
```

- Backend: **http://localhost:3001**
- Frontend: **http://localhost:5173**

For local Stripe webhooks: `stripe listen --forward-to localhost:3001/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## Project structure

```
LaunchFast-AI-SaaS/
â”œâ”€â”€ frontend/          # React 19, Vite 7, TailwindCSS 4, i18n
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ api/      # HTTP client + auth, credits, generations, stripe
â”‚       â”œâ”€â”€ components/
â”‚       â”œâ”€â”€ context/  # AuthContext
â”‚       â”œâ”€â”€ pages/    # Landing, Auth, Dashboard, Generator, History, Pricing
â”‚       â””â”€â”€ locales/  # en.json, es.json
â”œâ”€â”€ backend/           # NestJS 11
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ auth/     # JWT, register, login, /me
â”‚       â”œâ”€â”€ credits/  # Balance, deduct (guard + interceptor)
â”‚       â”œâ”€â”€ stripe/   # Checkout, portal, webhook
â”‚       â”œâ”€â”€ ai/       # OpenAI proposal generation
â”‚       â”œâ”€â”€ generations/
â”‚       â”œâ”€â”€ health/   # GET /api/health
â”‚       â””â”€â”€ common/   # Filters, guards, interceptors, decorators
â”œâ”€â”€ database/
â”‚   â””â”€â”€ schema.sql    # Supabase tables, RLS, triggers
â”œâ”€â”€ .env.example
â””â”€â”€ README.md
```

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default `3001`) |
| `JWT_SECRET` | Secret for signing JWTs |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Dashboard â†’ Settings â†’ API |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID` | From Stripe Dashboard |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | From OpenAI Platform |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `VITE_API_URL`, `VITE_*` | Used by the frontend build |

See [.env.example](.env.example) for the full list.

---

## API reference

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/register` | Register | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Current user | JWT |
| GET | `/api/credits` | User credits | JWT |
| POST | `/api/ai/generate-proposal` | Generate proposal | JWT + credits |
| GET | `/api/generations` | List generations (paginated) | JWT |
| GET | `/api/generations/:id` | Get one generation | JWT |
| POST | `/api/stripe/checkout` | Create checkout session | JWT |
| GET | `/api/stripe/portal` | Customer portal URL | JWT |
| POST | `/api/stripe/webhook` | Stripe webhook | Stripe signature |

---

## Deployment

- **Backend:** Railway, Render, or any Node host. Set env vars, `npm run build` then `npm run start:prod`.
- **Frontend:** Vercel, Netlify, or static host. Set `VITE_*` and build from `frontend/` with `npm run build`; serve `dist/`.
- **Stripe:** In production, add a webhook endpoint in Stripe Dashboard and use the live signing secret.


---

## License

[MIT](LICENSE). Use freely for personal and commercial projects.
