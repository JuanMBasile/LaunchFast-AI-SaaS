# LaunchFast AI

> SaaS boilerplate listo para monetizar con autenticación, suscripciones Stripe, sistema de créditos y generación con IA.

![Stack](https://img.shields.io/badge/React_19-blue?style=flat-square) ![Stack](https://img.shields.io/badge/NestJS_11-red?style=flat-square) ![Stack](https://img.shields.io/badge/Supabase-green?style=flat-square) ![Stack](https://img.shields.io/badge/Stripe-purple?style=flat-square) ![Stack](https://img.shields.io/badge/OpenAI-black?style=flat-square)

## Arquitectura

```
LaunchFast AI/
├── frontend/                 # React 19 + Vite 7 + TailwindCSS 4
│   ├── src/
│   │   ├── api/              # Cliente HTTP + endpoints
│   │   ├── components/       # UI, Layout, Shared
│   │   ├── context/          # AuthContext (estado global)
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilidades
│   │   ├── pages/            # Landing, Login, Register, Dashboard, Generator, History, Pricing
│   │   └── types/            # TypeScript interfaces
│   └── package.json
├── backend/                  # NestJS 11 + TypeScript
│   ├── src/
│   │   ├── auth/             # JWT authentication
│   │   ├── users/            # User management
│   │   ├── credits/          # Credit system
│   │   ├── stripe/           # Stripe checkout + webhooks
│   │   ├── ai/               # OpenAI integration
│   │   ├── generations/      # Generation history
│   │   ├── database/         # Supabase client
│   │   └── common/           # Guards, decorators, interceptors, middleware
│   └── package.json
├── database/
│   └── schema.sql            # PostgreSQL schema para Supabase
├── .env.example              # Variables de entorno
└── README.md
```

## Tech Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + Vite | 19 / 7 |
| UI | TailwindCSS | 4.0 |
| Routing | React Router | 7.13 |
| Backend | NestJS | 11.x |
| Auth | JWT + Passport | - |
| Database | Supabase (PostgreSQL) | - |
| Payments | Stripe | SDK 20.x |
| AI | OpenAI | SDK 6.x |
| Icons | Lucide React | - |

## Features

- **Landing page** pública moderna y responsive
- **Autenticación** completa (registro + login) con JWT
- **Dashboard** protegido con sidebar responsive
- **Sistema de créditos** por usuario (Free: 5/mes, Pro: 100/mes)
- **Integración Stripe** completa (checkout, webhooks, portal de billing)
- **AI Proposal Generator** para freelancers
- **Historial de generaciones** con paginación
- **Copiar y exportar** propuestas en Markdown
- **Rate limiting** configurable
- **Arquitectura multi-tenant** preparada
- **Row Level Security** en Supabase

## Screenshots

Add screenshots to `docs/screenshots/` (e.g. `landing.png`, `dashboard.png`, `generator.png`) to showcase the UI on GitHub.

| Landing | Dashboard | Generator |
|---------|------------|-----------|
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Generator](docs/screenshots/generator.png) |

## Requisitos Previos

- Node.js >= 18
- npm >= 9
- Cuenta de [Supabase](https://supabase.com)
- Cuenta de [Stripe](https://stripe.com) (modo test)
- API Key de [OpenAI](https://platform.openai.com)

---

## Setup Paso a Paso

### 1. Clonar y Configurar Variables de Entorno

```bash
cd "LaunchFast AI"
cp .env.example .env
```

Edita `.env` con tus credenciales reales.

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `database/schema.sql`
3. Copia las credenciales:
   - `SUPABASE_URL` → Settings > API > Project URL
   - `SUPABASE_ANON_KEY` → Settings > API > anon/public
   - `SUPABASE_SERVICE_ROLE_KEY` → Settings > API > service_role (secret)

### 3. Configurar Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/test)
2. Copia tu **Secret Key** → `STRIPE_SECRET_KEY`
3. Copia tu **Publishable Key** → `VITE_STRIPE_PUBLISHABLE_KEY`
4. Crea un producto con precio recurrente ($19/mes):
   - Products > Add Product > "Pro Plan" > $19/month
   - Copia el **Price ID** → `STRIPE_PRO_PRICE_ID`
5. Para webhooks locales, instala [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe login
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

Copia el webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### 4. Configurar OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea un API Key → `OPENAI_API_KEY`
3. Modelo recomendado: `gpt-4o` (puedes cambiar a `gpt-4o-mini` para ahorrar)

### 5. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 6. Ejecutar en Desarrollo

Abre dos terminales:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
El backend estará en `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
El frontend estará en `http://localhost:5173`

---

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del backend | `3001` |
| `JWT_SECRET` | Secreto para firmar JWT | `tu-secreto-seguro` |
| `JWT_EXPIRATION` | Expiración del token | `7d` |
| `SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Clave pública de Supabase | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio de Supabase | `eyJhbGci...` |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Secreto del webhook de Stripe | `whsec_...` |
| `STRIPE_PRO_PRICE_ID` | ID del precio del plan Pro | `price_...` |
| `OPENAI_API_KEY` | API key de OpenAI | `sk-...` |
| `OPENAI_MODEL` | Modelo de OpenAI | `gpt-4o` |
| `THROTTLE_TTL` | Ventana de rate limit (seg) | `60` |
| `THROTTLE_LIMIT` | Máx requests por ventana | `30` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:5173` |
| `VITE_API_URL` | URL de la API para el frontend | `http://localhost:3001` |
| `VITE_SUPABASE_URL` | URL de Supabase (frontend) | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clave pública Supabase (frontend) | `eyJhbGci...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe | `pk_test_...` |

---

## API Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Perfil del usuario | JWT |

### Credits
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/credits` | Obtener créditos del usuario | JWT |

### AI Generation
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/ai/generate-proposal` | Generar propuesta con IA | JWT + Credits |

### Generations
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/generations` | Listar historial (paginado) | JWT |
| GET | `/api/generations/:id` | Detalle de generación | JWT |

### Stripe
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/stripe/checkout` | Crear sesión de checkout | JWT |
| GET | `/api/stripe/portal` | Abrir portal de billing | JWT |
| POST | `/api/stripe/webhook` | Webhook de Stripe | Stripe Sig |

---

## Planes

| Feature | Free | Pro ($19/mes) |
|---------|------|---------------|
| Créditos por mes | 5 | 100 |
| Generación de propuestas | Si | Si |
| Historial completo | Si | Si |
| Copiar y exportar | Si | Si |
| Soporte prioritario | No | Si |
| Personalización avanzada | No | Si |

---

## Deploy a Producción

### Opción A: Railway (Recomendado)

**Backend:**

1. Ve a [Railway](https://railway.app) y crea un nuevo proyecto
2. Conecta tu repositorio de GitHub
3. Configura el servicio:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
4. Agrega todas las variables de entorno en Settings > Variables
5. Railway asignará un dominio automáticamente

**Frontend:**

1. Agrega otro servicio en el mismo proyecto
2. Configura:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve dist -s -l 3000` (o usa Nginx)
3. Agrega variables de entorno `VITE_*`

### Opción B: Vercel (Frontend) + Railway (Backend)

**Frontend en Vercel:**

1. Ve a [Vercel](https://vercel.com) e importa tu repo
2. Configura:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Agrega variables de entorno `VITE_*`
4. Deploy

**Backend en Railway:**
Sigue los pasos de la Opción A para el backend.

### Opción C: VPS (DigitalOcean / Hetzner)

```bash
# En tu VPS
git clone tu-repo
cd "LaunchFast AI"

# Backend
cd backend
npm install
npm run build
pm2 start dist/main.js --name launchfast-backend

# Frontend
cd ../frontend
npm install
npm run build
# Servir con Nginx
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name tudominio.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Configurar Stripe para Producción

1. Activa tu cuenta Stripe (verifica negocio)
2. Crea los mismos productos/precios en modo live
3. Configura webhook en Stripe Dashboard:
   - URL: `https://tudominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`
4. Actualiza las variables de entorno con las claves live

### SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com
```

---

## Estructura de la Base de Datos

```
┌──────────────┐     ┌─────────────────┐
│   auth.users │     │  public.users   │
│   (Supabase) │────>│  id (FK)        │
│              │     │  email          │
│              │     │  full_name      │
│              │     │  plan           │
│              │     │  stripe_cust_id │
│              │     │  tenant_id      │
│              │     └────────┬────────┘
│              │              │
│              │     ┌────────┴────────┐
│              │     │                 │
│              │  ┌──▼──────────┐ ┌───▼──────────┐ ┌──▼──────────────┐
│              │  │ credits     │ │ subscriptions│ │ generations     │
│              │  │ total       │ │ stripe_sub_id│ │ type            │
│              │  │ used        │ │ plan         │ │ title           │
│              │  │ remaining*  │ │ status       │ │ input (JSONB)   │
│              │  │ reset_at    │ │ period_start │ │ output (TEXT)   │
│              │  └─────────────┘ │ period_end   │ │ credits_used    │
│              │                  └──────────────┘ └─────────────────┘
└──────────────┘
* remaining = computed column (total - used)
```

---

## Escalabilidad

Este boilerplate está preparado para escalar:

- **Multi-tenant**: Cada usuario tiene un `tenant_id` para aislar datos
- **Row Level Security**: Supabase RLS asegura aislamiento a nivel de DB
- **Rate Limiting**: Configurable por ventana de tiempo
- **Modular**: Cada feature es un módulo NestJS independiente
- **Credits Guard**: Middleware que valida créditos antes de ejecutar
- **Webhook idempotente**: Maneja eventos de Stripe de forma segura

### Para agregar nuevas features de IA:

1. Crea un nuevo DTO en `backend/src/ai/dto/`
2. Agrega el método en `AiService`
3. Agrega el endpoint en `AiController` (con `@UseGuards(CreditsGuard)`)
4. Agrega la página en el frontend
5. Los créditos se descuentan automáticamente via `CreditsInterceptor`

---

## Licencia

MIT - Usa este boilerplate libremente para tus proyectos comerciales.
